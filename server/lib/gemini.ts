import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

// Initialize Gemini API with API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateResponse(prompt?: string | null, imageUrl?: string | null) {
  let model;
  let result;

  if (imageUrl) {
    model = genAI.getGenerativeModel({ model: "gemini-1.5" });

    const imageParts = [{ inlineData: { mimeType: "image/png", data: await fetchBase64(imageUrl) } }];

    // Create content array dynamically based on prompt availability
    const contentParts = prompt 
      ? [{ text: prompt }, ...imageParts]  // If prompt exists, send both text + image
      : imageParts;  // If no prompt, send only image

    result = await model.generateContent({
      contents: [{ role: "user", parts: contentParts }],
    });
  } else if (prompt) {
    model = genAI.getGenerativeModel({ model: "gemini-pro" });

    result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
  } else {
    return "Error: No prompt or image provided";
  }

  return result?.response?.text() || "No response generated";
}

// Helper function to convert image URL to Base64
async function fetchBase64(url: string | URL | Request) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer).toString("base64");
}
