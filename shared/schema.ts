import { z } from "zod";

export const insertMessageSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  imageUrl: z.string().nullable().optional(),
});

export interface Message {
  id: number;
  prompt: string;
  imageUrl: string | null;
  response: string | null;
  createdAt: Date;
}

export type InsertMessage = z.infer<typeof insertMessageSchema>;