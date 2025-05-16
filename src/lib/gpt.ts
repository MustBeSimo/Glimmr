import OpenAI from 'openai/index.mjs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ImageGenerationParams {
  prompt: string;
  originalImage: string;
  size?: '256x256' | '512x512' | '1024x1024';
  n?: number;
}

export async function generateImage({
  prompt,
  originalImage,
  size = '1024x1024',
  n = 1,
}: ImageGenerationParams) {
  try {
    // First, analyze the image to understand its content
    const visionResponse = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this image and describe its key elements:" },
            {
              type: "image_url",
              image_url: {
                url: originalImage,
              },
            },
          ],
        },
      ],
      max_tokens: 150,
    });

    const imageAnalysis = visionResponse.choices[0]?.message?.content || '';

    // Generate a detailed prompt combining user's request and image analysis
    const enhancedPrompt = `Based on this image analysis: "${imageAnalysis}", 
      create a new image that: ${prompt}. 
      Maintain the original composition and key elements while applying the requested changes.`;

    // Generate the new image
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      size,
      n,
      quality: "hd",
      style: "natural",
    });

    // Find similar objects using GPT-4 Vision
    const similarResponse = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Identify the main objects in this image and suggest similar items:" },
            {
              type: "image_url",
              image_url: {
                url: originalImage,
              },
            },
          ],
        },
      ],
      max_tokens: 150,
    });

    return {
      generatedImage: response.data?.[0]?.url || null,
      analysis: imageAnalysis,
      similarObjects: similarResponse.choices[0]?.message?.content || null,
    };
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
} 