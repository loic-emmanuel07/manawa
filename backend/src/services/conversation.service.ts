import * as conversationRepo from "../repositories/conversation.repository";

export async function isParticipant(userId: string, conversationId: string) {
	return conversationRepo.isParticipant(userId, conversationId);
}

export async function createConversation(
	creatorId: string,
	participantIds: string[],
	isGroup: boolean,
	name?: string,
) {
	return conversationRepo.createConversation(
		creatorId,
		participantIds,
		isGroup,
		name,
	);
}
