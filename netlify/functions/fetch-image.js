import fetch from 'node-fetch';

export const handler = async (event) => {
  const { fileId } = event.queryStringParameters;

  if (!fileId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'fileId parameter is required' }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  try {
    // First try the direct download link
    let response = await fetch(`https://drive.google.com/uc?export=download&id=${fileId}`);
    
    // If that fails (returns HTML), try the viewer link
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('text/html')) {
      response = await fetch(`https://drive.google.com/uc?export=view&id=${fileId}`);
    }

    if (!response.ok) {
      throw new Error(`Google Drive responded with ${response.status}`);
    }

    // Get the image as ArrayBuffer
    const buffer = await response.arrayBuffer();
    const imageData = Buffer.from(buffer).toString('base64');
    
    // Verify it looks like valid base64 image data
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(imageData)) {
      throw new Error('Invalid base64 image data received from Google Drive');
    }

    return {
      statusCode: 200,
      body: imageData,
      isBase64Encoded: true,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400'
      }
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to fetch image',
        details: error.message 
      }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};