import { messages, type Message, type InsertMessage } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createMessage(message: InsertMessage & { response: string }): Promise<Message>;
  getMessage(id: number): Promise<Message | undefined>;
  updateMessageFeedback(id: number, isApproved: boolean): Promise<Message>;
}

export class DatabaseStorage implements IStorage {
  async getMessage(id: number): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message;
  }

  async createMessage(message: InsertMessage & { response: string }): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values({
        prompt: message.prompt,
        imageUrl: message.imageUrl ?? null,
        response: message.response,
        isApproved: null,
        createdAt: new Date(),
      })
      .returning();
    return newMessage;
  }

  async updateMessageFeedback(id: number, isApproved: boolean): Promise<Message> {
    const [updatedMessage] = await db
      .update(messages)
      .set({ isApproved })
      .where(eq(messages.id, id))
      .returning();

    if (!updatedMessage) {
      throw new Error(`Message with id ${id} not found`);
    }

    return updatedMessage;
  }
}

export const storage = new DatabaseStorage();