import { insertMessageSchema } from "@shared/schema";
import type { Express } from "express";
import { createServer, type Server } from "http";
import { generateResponse } from "./lib/claude";

let currentId = 1;

export function registerRoutes(app: Express): Server {
  app.post("/api/chat", async (req, res) => {
    try {
      const data = insertMessageSchema.parse(req.body);

      // Generate response using Gemini API
      const response = await generateResponse(data.prompt, data.imageUrl);

      const message = {
        id: currentId++,
        ...data,
        response,
        createdAt: new Date(),
      };

      res.json(message);
    } catch (error) {
      console.error("Chat error:", error);
      res.status(400).json({ error: "Invalid request" });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
