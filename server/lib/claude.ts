import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";

// Initialize Claude API with API Key
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateResponse(prompt: string, imageUrl?: string | null) {
  try {
    let messages = [{ role: "user", content: prompt }];
    
    if (imageUrl) {
      messages.push({ role: "user", content: `Here is an image: ${imageUrl}` });
    }

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 500,
      messages,
    });

    return response?.content?.[0]?.text || "No response generated.";
  } catch (error) {
    console.error("Claude API Error:", error);
    return "Error generating response.";
  }
}
