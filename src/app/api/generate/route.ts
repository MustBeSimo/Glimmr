import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { userId, prompt, imageBase64 } = await req.json();
    
    if (!userId || !prompt || !imageBase64) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // For testing, return mock data
    return NextResponse.json({
      success: true,
      generatedImage: "https://placehold.co/1024x1024/blue/white?text=Generated",
      editedImage: "https://placehold.co/1024x1024/green/white?text=Edited",
      analysis: "Mock image analysis",
      similarObjects: "Mock similar objects",
      remainingCredits: 5,
    });
    
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate image' },
      { status: 500 }
    );
  }
} 