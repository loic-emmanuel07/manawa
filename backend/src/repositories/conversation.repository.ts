import { eq, and, inArray } from "drizzle-orm";
import { db } from "../config/db";
import { conversations, conversationParticipants } from "../db/schema";

export async function isParticipant(userId: string, conversationId: string): Promise<boolean> {
  const [row] = await db
    .select()
    .from(conversationParticipants)
    .where(
      and(
        eq(conversationParticipants.conversationId, conversationId),
        eq(conversationParticipants.userId, userId)
      )
    )
    .limit(1);

  return !!row;
}

export async function createConversation(
  creatorId: string,
  participantIds: string[],
  isGroup: boolean,
  name?: string
) {
  const allParticipantIds = [...new Set([creatorId, ...participantIds])];

  return db.transaction(async (tx) => {
    const [conversation] = await tx
      .insert(conversations)
      .values({ isGroup, name })
      .returning();

    await tx.insert(conversationParticipants).values(
      allParticipantIds.map((userId) => ({
        conversationId: conversation.id,
        userId,
        role: userId === creatorId ? "admin" : "member",
      }))
    );

    return { ...conversation, participantIds: allParticipantIds };
  });
}

export async function getConversationsForUser(userId: string) {
  const rows = await db
    .select({ conversationId: conversationParticipants.conversationId })
    .from(conversationParticipants)
    .where(eq(conversationParticipants.userId, userId));

  const conversationIds = rows.map((r) => r.conversationId);
  if (conversationIds.length === 0) return [];

  return db.select().from(conversations).where(inArray(conversations.id, conversationIds));
}

export async function addParticipant(conversationId: string, userId: string) {
  await db.insert(conversationParticipants).values({ conversationId, userId, role: "member" });
}

export async function removeParticipant(conversationId: string, userId: string) {
  await db
    .delete(conversationParticipants)
    .where(
      and(
        eq(conversationParticipants.conversationId, conversationId),
        eq(conversationParticipants.userId, userId)
      )
    );
}