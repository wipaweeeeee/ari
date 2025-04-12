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
    let contentType = response.headers['content-type'] || 'application/octet-stream';

    if (contentType?.includes('text/html')) {
      response = await axios.get(`https://drive.google.com/uc?export=view&id=${fileId}`, {
        responseType: 'arraybuffer'
      });
    }

    // Check for successful response
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`Google Drive responded with ${response.status}`);
    }

    let buffer = Buffer.from(response.data);
    
    return {
      statusCode: 200,
      body: buffer.toString('base64'),
      isBase64Encoded: true,
      headers: {
        'Content-Type': response.headers['content-type'] || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*' // Important for CORS
      }
    };
  } catch (error) {
    console.error('Error in fetch-media:', error);
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