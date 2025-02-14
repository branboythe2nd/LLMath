import "dotenv/config";
import OpenAI from "openai";
// Add your API key to environment variables and initialize here
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateResponse(prompt: string, imageUrl?: string | null) {
  const messages = [
    {
      role: "user" as const,
      content: imageUrl
        ? [
            { type: "text" as const, text: prompt },
            { type: "image_url" as const, image_url: { url: imageUrl } },
          ]
        : [{ type: "text" as const, text: prompt }], // Ensure content is always an array
    },
  ];

  const response = await openai.chat.completions.create({
    model: imageUrl ? "gpt-4o-mini" : "gpt-4o-mini",
    messages,
    max_tokens: 500,
  });

  return response.choices[0]?.message?.content || "No response generated";
}