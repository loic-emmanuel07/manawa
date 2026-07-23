// src/services/message.service.ts
import * as messageRepo from "../repositories/message.repository";
import { isParticipant } from "./conversation.service";

export async function sendMessage(
	senderId: string,
	conversationId: string,
	text: string,
) {
	return messageRepo.insertMessage(conversationId, senderId, text);
}

export async function getHistory(
	userId: string,
	conversationId: string,
	limit?: number,
	before?: string,
) {
	const allowed = await isParticipant(userId, conversationId);
	if (!allowed)
		throw new Error("Vous n'êtes pas participant de cette conversation");
	return messageRepo.getMessagesForConversation(conversationId, limit, before);
}
