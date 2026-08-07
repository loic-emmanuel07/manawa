import type { Server, Socket } from "socket.io";
import { createLogger, locate } from "../../lib/logger";
import {
	createConversation,
	isParticipant,
} from "../../services/conversation.service";
import {
	createConversationSchema,
	joinConversationSchema,
	leaveConversationSchema,
} from "../../types";
import { EVENTS } from "../events";

const logger = createLogger("socket:conversation");

export function registerConversationHandlers(io: Server, socket: Socket) {
	socket.on(EVENTS.CONVERSATION_CREATE, async (rawPayload, ack) => {
		const parsed = createConversationSchema.safeParse(rawPayload);
		if (!parsed.success) {
			return ack({ ok: false, error: parsed.error.issues[0].message });
		}

		const { participantIds, isGroup, name } = parsed.data;
		const conversation = await createConversation(
			socket.data.userId,
			participantIds,
			isGroup,
			name,
		);

		// fait rejoindre la room à tous les participants déjà connectés
		conversation.participantIds.forEach((userId) => {
			io.to(userId).socketsJoin(conversation.id);
		});

		logger.debug(
			`Conversation created -> ${conversation.id} (${conversation.participantIds.length} participants)`,
		);
		io.to(conversation.id).emit(EVENTS.CONVERSATION_CREATED, conversation);
		ack({ ok: true, conversationId: conversation.id });
	});

	socket.on(EVENTS.CONVERSATION_JOIN, async (rawPayload, ack) => {
		const parsed = joinConversationSchema.safeParse(rawPayload);
		if (!parsed.success) {
			return ack?.({ ok: false, error: parsed.error.issues[0].message });
		}

		const allowed = await isParticipant(
			socket.data.userId,
			parsed.data.conversationId,
		);
		if (!allowed) {
			logger.warn(
				`Join denied: userId ${socket.data.userId} is not a participant of ${parsed.data.conversationId}`,
			);
			return ack?.({
				ok: false,
				error: "Vous ne faites pas partie de cette conversation",
			});
		}

		socket.join(parsed.data.conversationId);
		ack?.({ ok: true });
	});

	socket.on(EVENTS.CONVERSATION_LEAVE, async (rawPayload, ack) => {
		const parsed = leaveConversationSchema.safeParse(rawPayload);
		if (!parsed.success) {
			return ack?.({ ok: false, error: parsed.error.issues[0].message });
		}

		socket.leave(parsed.data.conversationId);
		ack?.({ ok: true });
	});
}
locate(registerConversationHandlers);
