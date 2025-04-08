import axios from 'axios';

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
    let response = await axios.get(`https://drive.google.com/uc?export=download&id=${fileId}`, {
      responseType: 'arraybuffer',
      validateStatus: () => true // Don't throw on HTTP errors
    });

    // If response looks like HTML (failed download), try the viewer link
    const contentType = response.headers['content-type'];
    if (contentType?.includes('text/html')) {
      response = await axios.get(`https://drive.google.com/uc?export=view&id=${fileId}`, {
        responseType: 'arraybuffer'
      });
    }

    // Check for successful response
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`Google Drive responded with ${response.status}`);
    }

    // Convert to base64
    const imageData = Buffer.from(response.data).toString('base64');
    
    // Basic base64 validation
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(imageData)) {
      throw new Error('Invalid base64 image data received');
    }

    return {
      statusCode: 200,
      body: imageData,
      isBase64Encoded: true,
      headers: {
        'Content-Type': response.headers['content-type'] || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*' // Important for CORS
      }
    };
  } catch (error) {
    console.error('Error in fetch-image:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to fetch media',
        details: error.message 
      }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};