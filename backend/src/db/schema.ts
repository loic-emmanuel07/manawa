// src/db/schema.ts

import { relations } from "drizzle-orm";
import {
	boolean,
	pgSchema,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

const authSchema = pgSchema("auth");

// Table gérée par Supabase Auth — on la déclare juste pour pouvoir la référencer
export const authUsers = authSchema.table("users", {
	id: uuid("id").primaryKey(),
});

// Profil applicatif, lié 1-to-1 à auth.users
export const profiles = pgTable("profiles", {
	id: uuid("id")
		.primaryKey()
		.references(() => authUsers.id, { onDelete: "cascade" }),
	displayName: text("display_name").notNull(),
	avatarUrl: text("avatar_url"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const conversations = pgTable("conversations", {
	id: uuid("id").defaultRandom().primaryKey(),
	isGroup: boolean("is_group").notNull().default(false),
	name: text("name"), // nullable, utilisé seulement pour les groupes
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const conversationParticipants = pgTable(
	"conversation_participants",
	{
		conversationId: uuid("conversation_id")
			.notNull()
			.references(() => conversations.id, { onDelete: "cascade" }),
		userId: uuid("user_id")
			.notNull()
			.references(() => authUsers.id, { onDelete: "cascade" }),
		role: text("role").default("member"),
		joinedAt: timestamp("joined_at").defaultNow().notNull(),
	},
	(table) => [primaryKey({ columns: [table.conversationId, table.userId] })],
);

export const messages = pgTable("messages", {
	id: uuid("id").defaultRandom().primaryKey(),
	conversationId: uuid("conversation_id")
		.notNull()
		.references(() => conversations.id, { onDelete: "cascade" }),
	senderId: uuid("sender_id")
		.notNull()
		.references(() => authUsers.id),
	text: text("text").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations — utile pour faire des requêtes avec jointures via l'API relationnelle de Drizzle
export const conversationsRelations = relations(conversations, ({ many }) => ({
	participants: many(conversationParticipants),
	messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
	conversation: one(conversations, {
		fields: [messages.conversationId],
		references: [conversations.id],
	}),
}));

export const conversationParticipantsRelations = relations(
	conversationParticipants,
	({ one }) => ({
		conversation: one(conversations, {
			fields: [conversationParticipants.conversationId],
			references: [conversations.id],
		}),
	}),
);
