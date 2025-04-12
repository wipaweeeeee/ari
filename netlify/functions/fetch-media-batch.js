import { google } from 'googleapis';
import dotenv from 'dotenv';
import pLimit from 'p-limit';

dotenv.config();

// Credentials from environment variables
const driveCredentials = {
  type: process.env.GOOGLE_DRIVE_TYPE,
  project_id: process.env.GOOGLE_DRIVE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_DRIVE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_DRIVE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_DRIVE_CLIENT_ID,
  auth_uri: process.env.GOOGLE_DRIVE_AUTH_URI,
  token_uri: process.env.GOOGLE_DRIVE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GOOGLE_DRIVE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.GOOGLE_DRIVE_CLIENT_CERT_URL,
  universe_domain: "googleapis.com"
};

// Initialize outside handler for reuse
const auth = new google.auth.GoogleAuth({
  credentials: driveCredentials,
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
});

const drive = google.drive({ version: 'v3', auth });

// Utility: retry wrapper for transient errors
const withRetries = async (fn, retries = 2) => {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;
    await new Promise((res) => setTimeout(res, 500));
    return withRetries(fn, retries - 1);
  }
};

// Serverless handler
export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { fileIds, chunk = 0 } = JSON.parse(event.body);
    const chunkSize = 5;
    const startIdx = chunk * chunkSize;
    const endIdx = startIdx + chunkSize;
    const batch = fileIds.slice(startIdx, endIdx);

    if (batch.length === 0) {
      return {
        statusCode: 200,
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ complete: true }),
      };
    }

    const results = {};
    const limit = pLimit(3); // max 3 concurrent requests

    await Promise.all(
      batch.map((fileId) =>
        limit(async () => {
          try {
            const { data: file } = await withRetries(() =>
              drive.files.get({
                fileId,
                fields: 'mimeType,webContentLink,name',
              })
            );

            const type = file.mimeType.includes('image') ? 'image' : 'video';

            results[fileId] = {
                url: `/.netlify/functions/fetch-media?fileId=${fileId}`,
                name: file.name,
                type,
              };
          } catch (error) {
            results[fileId] = {
              error: {
                message: error.message,
                code: error.code || 'unknown',
              },
            };
          }
        })
      )
    );

    return {
      statusCode: 200,
      headers: {
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        results,
        nextChunk: endIdx < fileIds.length ? chunk + 1 : null,
        complete: endIdx >= fileIds.length,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};