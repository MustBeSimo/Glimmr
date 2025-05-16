import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

async function searchGoogleVision(base64Image: string) {
  try {
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

    if (!response.ok) {
      throw new Error(`Google Vision API error: ${response.status}`);
    }

    const data = await response.json();
    return data.responses[0]?.webDetection?.visuallySimilarImages || [];
  } catch (error) {
    console.error('Google Vision API error:', error);
    return [];
  }
}

async function searchSerpApi(imageUrl: string) {
  try {
    // Mock response for testing
    return [
      {
        thumbnail: "https://placehold.co/300x300/blue/white?text=Similar1",
        title: "Similar Object 1",
        link: "https://example.com/item1"
      },
      {
        thumbnail: "https://placehold.co/300x300/green/white?text=Similar2",
        title: "Similar Object 2",
        link: "https://example.com/item2"
      },
      {
        thumbnail: "https://placehold.co/300x300/red/white?text=Similar3",
        title: "Similar Object 3",
        link: "https://example.com/item3"
      }
    ];
    
    // In production, use this:
    /*
    const response = await fetch(`https://serpapi.com/search.json?engine=google_lens&url=${encodeURIComponent(imageUrl)}&api_key=${process.env.SERPAPI_KEY}`);
    if (!response.ok) {
      throw new Error(`SerpAPI error: ${response.status}`);
    }
    const data = await response.json();
    return data.visual_matches || [];
    */
  } catch (error) {
    console.error('SerpAPI error:', error);
    return [];
  }
}

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'Missing image data' },
        { status: 400 }
      );
    }

    // Remove data URL prefix if present
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');

    // Try Google Cloud Vision first
    let similarImages = await searchGoogleVision(base64Image);
    
    // Fall back to SerpAPI if no results from Vision API
    if (similarImages.length === 0) {
      const visualMatches = await searchSerpApi(image);
      similarImages = visualMatches.map((match: any) => ({
        url: match.thumbnail,
        title: match.title || 'Similar Object',
        sourceUrl: match.link,
      }));
    } else {
      // Format Google Vision results
      similarImages = similarImages.map((img: any) => ({
        url: img.url || '',
        title: img.url?.split('/').pop().replace(/-|_/g, ' ').substring(0, 30) || 'Similar Object',
        sourceUrl: img.url || '',
      }));
    }

    return NextResponse.json({
      images: similarImages.slice(0, 6),
    });
  } catch (error) {
    console.error('Similar images API error:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
} 