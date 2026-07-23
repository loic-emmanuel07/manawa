import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { profiles } from "../db/schema";

export async function getProfile(userId: string) {
  const [profile] = await db.select().from(profiles).where(eq(profiles.id, userId)).limit(1);
  return profile ?? null;
}

export async function createProfile(userId: string, displayName: string, avatarUrl?: string) {
  const [profile] = await db
    .insert(profiles)
    .values({ id: userId, displayName, avatarUrl })
    .returning();
  return profile;
}