import { eq, desc, lt, and } from "drizzle-orm";
import { db } from "../config/db";
import { messages } from "../db/schema";

export async function insertMessage(conversationId: string, senderId: string, text: string) {
  const [message] = await db
    .insert(messages)
    .values({ conversationId, senderId, text })
    .returning();

  return message;
}

export async function getMessagesForConversation(
  conversationId: string,
  limit = 50,
  before?: string // ISO timestamp, pour la pagination par curseur
) {
  const conditions = before
    ? and(eq(messages.conversationId, conversationId), lt(messages.createdAt, new Date(before)))
    : eq(messages.conversationId, conversationId);

  return db
    .select()
    .from(messages)
    .where(conditions)
    .orderBy(desc(messages.createdAt))
    .limit(limit);
}