import { z } from "zod";

export const insertMessageSchema = z.object({
  prompt: z.string().optional(), // Make prompt optional
  imageUrl: z.string().nullable(), // Ensure imageUrl can be null or a string
}).refine(data => data.prompt || data.imageUrl, {
  message: "Either a prompt or an image is required.",
  path: ["prompt"],
});

export interface Message {
  id: number;
  prompt: string;
  imageUrl: string | null;
  response: string | null;
  createdAt: Date;
}

export type InsertMessage = z.infer<typeof insertMessageSchema>;