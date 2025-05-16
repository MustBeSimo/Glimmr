import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateImage } from '@/lib/gpt';

// Initialize Supabase client with service role for admin access
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(req: NextRequest) {
  try {
    const { userId, prompt, imageBase64 } = await req.json();
    
    if (!userId || !prompt || !imageBase64) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user has enough credits
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single();

    if (userError) {
      return NextResponse.json(
        { error: 'Failed to retrieve user data' },
        { status: 500 }
      );
    }

    if (!userData || userData.credits < 1) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 402 }
      );
    }

    // Generate image using GPT
    const { generatedImage, analysis, similarObjects } = await generateImage({
      prompt,
      originalImage: imageBase64,
      size: '1024x1024',
    });

    if (!generatedImage) {
      throw new Error('Failed to generate image');
    }

    // Deduct a credit from the user's account
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ credits: userData.credits - 1 })
      .eq('id', userId);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update user credits' },
        { status: 500 }
      );
    }

    // Store the generated image in Supabase Storage
    const timestamp = Date.now();
    const originalKey = `${userId}/original_${timestamp}.jpg`;
    const generatedKey = `${userId}/generated_${timestamp}.jpg`;

    // Convert base64 to buffer for storage
    const originalBuffer = Buffer.from(imageBase64.split(',')[1], 'base64');
    const generatedBuffer = await fetch(generatedImage).then(res => res.arrayBuffer());

    // Upload images to Supabase Storage
    const { error: uploadError } = await supabaseAdmin
      .storage
      .from('images')
      .upload(originalKey, originalBuffer, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
      });

    if (uploadError) {
      throw new Error('Failed to upload original image');
    }

    const { error: genUploadError } = await supabaseAdmin
      .storage
      .from('images')
      .upload(generatedKey, generatedBuffer, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
      });

    if (genUploadError) {
      throw new Error('Failed to upload generated image');
    }

    // Get public URLs for the uploaded images
    const { data: { publicUrl: originalUrl } } = supabaseAdmin
      .storage
      .from('images')
      .getPublicUrl(originalKey);

    const { data: { publicUrl: generatedUrl } } = supabaseAdmin
      .storage
      .from('images')
      .getPublicUrl(generatedKey);

    // Record the generation in the database
    await supabaseAdmin.from('generations').insert({
      user_id: userId,
      prompt,
      original_image_url: originalUrl,
      generated_image_url: generatedUrl,
      analysis,
      similar_objects: similarObjects,
      status: 'completed',
    });

    // Return the generated images and analysis
    return NextResponse.json({
      success: true,
      generatedImage: generatedUrl,
      originalImage: originalUrl,
      analysis,
      similarObjects,
      remainingCredits: userData.credits - 1,
    });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate image' },
      { status: 500 }
    );
  }
} 