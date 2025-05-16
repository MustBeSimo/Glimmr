import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// Initialize OpenAI client for each request to ensure fresh configuration
const getOpenAIClient = () => {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

export async function POST(request: Request) {
  try {
    const { image, prompt } = await request.json();

    // Remove data URL prefix if present
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');
    
    // Convert base64 to binary
    const binaryImage = atob(base64Image);
    const array = new Uint8Array(binaryImage.length);
    for (let i = 0; i < binaryImage.length; i++) {
      array[i] = binaryImage.charCodeAt(i);
    }
    
    // Create a Blob and File object (compatible with OpenAI's Uploadable type)
    const blob = new Blob([array], { type: 'image/png' });
    const imageFile = new File([blob], 'image.png', { type: 'image/png' });

    const openai = getOpenAIClient();
    const response = await openai.images.edit({
      image: imageFile,
      prompt,
      model: 'gpt-image-1',
      n: 1,
      size: '1024x1024',
    });

    if (!response.data?.[0]?.url) {
      throw new Error('No image URL in response');
    }

    return NextResponse.json({
      editedImage: response.data[0].url,
    });
  } catch (error) {
    console.error('Image edit API error:', error);
    return NextResponse.json(
      { error: 'Failed to edit image' },
      { status: 500 }
    );
  }
} 