import { NextResponse } from 'next/server';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import SerpApi from 'google-search-results-nodejs';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// Initialize SerpAPI client (fallback)
const serpApi = new SerpApi(process.env.SERPAPI_KEY);

// Create Vision client only when needed to avoid edge function issues
const getVisionClient = () => {
  return new ImageAnnotatorClient({
    projectId: process.env.GCP_PROJECT_ID,
    credentials: {
      client_email: process.env.GCP_CLIENT_EMAIL,
      private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
  });
};

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    // Remove data URL prefix if present
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');

    try {
      // Try Google Cloud Vision first
      const visionClient = getVisionClient();
      const [result] = await visionClient.webDetection({
        image: {
          content: base64Image,
        },
      });

      const webDetection = result.webDetection;
      if (webDetection?.visuallySimilarImages?.length) {
        return NextResponse.json({
          images: webDetection.visuallySimilarImages.map((img: any) => ({
            url: img.url || '',
            title: img.url?.split('/').pop() || 'Similar Image',
            sourceUrl: img.url || '',
          })).slice(0, 6),
        });
      }
    } catch (visionError) {
      console.error('Vision API error:', visionError);
      // Fall back to SerpAPI
    }

    // Fallback to SerpAPI Google Lens
    return new Promise((resolve) => {
      serpApi.search({
        engine: 'google_lens',
        url: image,
      }, (data: any) => {
        const visualMatches = data.visual_matches || [];
        resolve(
          NextResponse.json({
            images: visualMatches.map((match: any) => ({
              url: match.thumbnail,
              title: match.title || 'Similar Image',
              sourceUrl: match.link,
            })).slice(0, 6),
          })
        );
      });
    });
  } catch (error) {
    console.error('Similar images API error:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
} 