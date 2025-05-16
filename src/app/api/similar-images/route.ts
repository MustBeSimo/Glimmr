import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

async function getGoogleAccessToken() {
  const credentials = {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  if (!credentials.client_email || !credentials.private_key) {
    throw new Error('Missing Google Cloud credentials');
  }

  const jwtHeader = {
    alg: 'RS256',
    typ: 'JWT',
    kid: credentials.private_key
  };

  const now = Math.floor(Date.now() / 1000);
  const jwtClaimSet = {
    iss: credentials.client_email,
    sub: credentials.client_email,
    aud: 'https://vision.googleapis.com/',
    iat: now,
    exp: now + 3600
  };

  // Create JWT
  const encodedHeader = Buffer.from(JSON.stringify(jwtHeader)).toString('base64url');
  const encodedClaimSet = Buffer.from(JSON.stringify(jwtClaimSet)).toString('base64url');
  const signatureInput = `${encodedHeader}.${encodedClaimSet}`;

  // Sign the JWT
  const textEncoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'pkcs8',
    Buffer.from(credentials.private_key, 'utf-8'),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    textEncoder.encode(signatureInput)
  );
  const encodedSignature = Buffer.from(signature).toString('base64url');

  const jwt = `${signatureInput}.${encodedSignature}`;

  // Exchange JWT for access token
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  });

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

async function searchGoogleVision(base64Image: string) {
  try {
    const accessToken = await getGoogleAccessToken();

    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Google Vision API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const webDetection = data.responses[0]?.webDetection;
    
    if (!webDetection) {
      throw new Error('No web detection results found');
    }

    return webDetection.visuallySimilarImages || [];
  } catch (error) {
    console.error('Google Vision API error:', error);
    throw error;
  }
}

async function searchSerpApi(imageUrl: string) {
  if (!process.env.SERPAPI_KEY) {
    return []; // Silently fall back if no API key
  }

  try {
    const response = await fetch(
      `https://serpapi.com/search.json?engine=google_lens&url=${encodeURIComponent(imageUrl)}&api_key=${process.env.SERPAPI_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`SerpAPI error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.visual_matches || [];
  } catch (error) {
    console.error('SerpAPI error:', error);
    return []; // Return empty array to allow fallback
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

    try {
      // Try Google Cloud Vision first
      const visionResults = await searchGoogleVision(base64Image);
      
      if (visionResults.length > 0) {
        const similarImages = visionResults.map((img: any) => ({
          url: img.url || '',
          title: img.url?.split('/').pop().replace(/-|_/g, ' ').substring(0, 30) || 'Similar Image',
          sourceUrl: img.url || '',
        }));

        return NextResponse.json({
          images: similarImages.slice(0, 6),
          source: 'google_vision'
        });
      }
    } catch (visionError) {
      console.error('Vision API error:', visionError);
      // Continue to SerpAPI fallback
    }

    // Fall back to SerpAPI
    const serpResults = await searchSerpApi(image);
    if (serpResults.length > 0) {
      const similarImages = serpResults.map((match: any) => ({
        url: match.thumbnail || '',
        title: match.title || 'Similar Object',
        sourceUrl: match.link || '',
      }));

      return NextResponse.json({
        images: similarImages.slice(0, 6),
        source: 'serp_api'
      });
    }

    // If both APIs fail to return results
    return NextResponse.json({
      images: [],
      error: 'No similar images found'
    });

  } catch (error: any) {
    console.error('Similar images API error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to process image',
        images: [] 
      },
      { status: 500 }
    );
  }
} 