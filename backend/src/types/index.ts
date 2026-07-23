import { z } from "zod";

export const createConversationSchema = z
	.object({
		participantIds: z.array(z.uuid()).min(1, "Il faut au moins un participant"),
		name: z.string().trim().min(1).optional(),
	})
	.transform((data) => ({
		...data,
		isGroup: data.participantIds.length > 1,
	}));

export const joinConversationSchema = z.object({
	conversationId: z.uuid(),
});

export const leaveConversationSchema = z.object({
	conversationId: z.uuid(),
});

// --- Messages ---

export const sendMessageSchema = z.object({
	conversationId: z.uuid(),
	text: z.string().trim().min(1, "Le message ne peut pas être vide").max(5000),
});

// --- Types dérivés, pour typer les fonctions de service ---

export type CreateConversationPayload = z.infer<
	typeof createConversationSchema
>;
export type JoinConversationPayload = z.infer<typeof joinConversationSchema>;
export type LeaveConversationPayload = z.infer<typeof leaveConversationSchema>;
export type SendMessagePayload = z.infer<typeof sendMessageSchema>;
