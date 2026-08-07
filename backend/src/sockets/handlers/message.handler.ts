import type { Server, Socket } from "socket.io";
import { createLogger, locate } from "../../lib/logger";
import { isParticipant } from "../../services/conversation.service";
import { sendMessage } from "../../services/message.service";
import { sendMessageSchema } from "../../types";
import { EVENTS } from "../events";

const logger = createLogger("socket:message");

export function registerMessageHandlers(io: Server, socket: Socket) {
	socket.on(EVENTS.MESSAGE_SEND, async (rawPayload, ack) => {
		const parsed = sendMessageSchema.safeParse(rawPayload);
		if (!parsed.success) {
			return ack({ ok: false, error: parsed.error.issues[0].message });
		}

		const { conversationId, text } = parsed.data;

		const allowed = await isParticipant(socket.data.userId, conversationId);
		if (!allowed) {
			logger.warn(
				`Send denied: userId ${socket.data.userId} is not a participant of ${conversationId}`,
			);
			return ack({
				ok: false,
				error: "Vous ne faites pas partie de cette conversation",
			});
		}

		const message = await sendMessage(socket.data.userId, conversationId, text);
		logger.debug(`Message sent -> conversation ${conversationId}`);
		io.to(conversationId).emit(EVENTS.MESSAGE_NEW, message);
		ack({ ok: true });
	});
}
locate(registerMessageHandlers);
