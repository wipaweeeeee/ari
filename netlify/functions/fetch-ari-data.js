import dotenv from "dotenv";
import axios from "axios";

dotenv.config(); // Load .env variables

export const handler = async () => {
  const SHEET_ID = "136MtmqAsa04as6RQCtssOBi5ZzbhhmBsq40Tu_RDmYY";
  const RANGE = "Form Responses 1";
  const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;

  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing Google Sheets API Key" }),
      headers: { "Content-Type": "application/json" }
    };
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;

  try {
    const response = await axios.get(url, {
      timeout: 5000 // 5 second timeout
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300" // 5 minute cache
      }
    };
  } catch (error) {
    console.error("Google Sheets API Error:", error);
    
    let statusCode = 500;
    let errorMessage = error.message;

    if (error.response) {
      // Handle Google API errors
      statusCode = error.response.status;
      errorMessage = error.response.data.error?.message || error.message;
    } else if (error.request) {
      // Request was made but no response
      errorMessage = "No response from Google Sheets API";
    }

    return {
      statusCode,
      body: JSON.stringify({ 
        error: "Failed to fetch sheet data",
        details: errorMessage 
      }),
      headers: { "Content-Type": "application/json" }
    };
  }
};