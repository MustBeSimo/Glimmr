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

    const openai = getOpenAIClient();
    const response = await openai.images.edit({
      image: Buffer.from(base64Image, 'base64'),
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