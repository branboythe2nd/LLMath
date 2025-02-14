import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

// Initialize Gemini API with API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateResponse(prompt: string, imageUrl?: string | null) {
  let model;
  let result;

  if (imageUrl) {
    model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    const imageParts = [{ inlineData: { mimeType: "image/png", data: await fetchBase64(imageUrl) } }];

    result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }, ...imageParts] }],
    });
  } else {
    model = genAI.getGenerativeModel({ model: "gemini-pro" });

    result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
  }

  return result?.response?.text() || "No response generated";
}

// Helper function to convert image URL to Base64
async function fetchBase64(url: string | URL | Request) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer).toString("base64");
}
