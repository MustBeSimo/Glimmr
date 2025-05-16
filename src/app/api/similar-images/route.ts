import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

async function searchGoogleVision(base64Image: string) {
  const response = await fetch('https://vision.googleapis.com/v1/images:annotate?key=' + process.env.GCP_VISION_KEY, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [{
        image: {
          content: base64Image
        },
        features: [{
          type: 'WEB_DETECTION',
          maxResults: 6
        }]
      }]
    })
  });

  const data = await response.json();
  return data.responses[0]?.webDetection?.visuallySimilarImages || [];
}

async function searchSerpApi(imageUrl: string) {
  const response = await fetch(`https://serpapi.com/search.json?engine=google_lens&url=${encodeURIComponent(imageUrl)}&api_key=${process.env.SERPAPI_KEY}`);
  const data = await response.json();
  return data.visual_matches || [];
}

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    // Remove data URL prefix if present
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');

    try {
      // Try Google Cloud Vision first
      const similarImages = await searchGoogleVision(base64Image);
      if (similarImages.length > 0) {
        return NextResponse.json({
          images: similarImages.map((img: any) => ({
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
    const visualMatches = await searchSerpApi(image);
    return NextResponse.json({
      images: visualMatches.map((match: any) => ({
        url: match.thumbnail,
        title: match.title || 'Similar Image',
        sourceUrl: match.link,
      })).slice(0, 6),
    });
  } catch (error) {
    console.error('Similar images API error:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
} 