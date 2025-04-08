import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

export const handler = async () => {
  const SHEET_ID = "136MtmqAsa04as6RQCtssOBi5ZzbhhmBsq40Tu_RDmYY"; // Replace with your actual sheet ID
  const RANGE = "Form Responses 1"; // Adjust the range as needed
  const API_KEY = process.env.GOOGLE_SHEETS_API_KEY; // Use an environment variable

  if (!API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: "Missing API Key" }) };
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};