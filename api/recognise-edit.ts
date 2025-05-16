import { VercelRequest, VercelResponse } from '@vercel/node';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import OpenAI from 'openai';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to convert base64 to a File object
async function base64ToFile(base64String: string, filename = 'image.png'): Promise<File> {
  // Remove data URL prefix if present
  const base64WithoutPrefix = base64String.replace(/^data:image\/\w+;base64,/, '');
  
  // Convert base64 to buffer
  const buffer = Buffer.from(base64WithoutPrefix, 'base64');
  
  // Create a Blob from the buffer
  const blob = new Blob([buffer], { type: 'image/png' });
  
  // Convert Blob to File
  return new File([blob], filename, { type: 'image/png' });
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageBase64, prompt } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Initialize Vision client with service account credentials
    const credentials = {
      client_email: process.env.GCP_CLIENT_EMAIL,
      private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      project_id: process.env.GCP_PROJECT_ID,
    };

    if (!credentials.client_email || !credentials.private_key || !credentials.project_id) {
      throw new Error('Missing required Google Cloud credentials');
    }

    const vision = new ImageAnnotatorClient({
      credentials,
      projectId: credentials.project_id,
    });

    // Get similar images using Vision API
    const [webDetection] = await vision.webDetection({
      image: { content: Buffer.from(imageBase64, 'base64').toString('base64') }
    });

    const similarImages = webDetection.webDetection?.visuallySimilarImages?.map(img => ({
      thumbnailUrl: img.url || '',
      sourceUrl: img.url || '',
      title: 'Similar Image'
    })) || [];

    // Handle image editing with OpenAI if prompt is provided
    let editedImageUrl: string | null = null;
    if (prompt) {
      try {
        const imageFile = await base64ToFile(imageBase64);
        const editResponse = await openai.images.edit({
          image: imageFile,
          prompt,
          n: 1,
          size: "1024x1024",
        });
        
        if (editResponse.data?.[0]?.url) {
          editedImageUrl = editResponse.data[0].url;
        }
      } catch (openaiError) {
        console.error('OpenAI API error:', openaiError);
        throw new Error(`OpenAI API error: ${openaiError instanceof Error ? openaiError.message : 'Unknown error'}`);
      }
    }

    return res.status(200).json({
      similarImages,
      editedImageUrl
    });

  } catch (error) {
    console.error('Error in API handler:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: errorMessage });
  }
} 