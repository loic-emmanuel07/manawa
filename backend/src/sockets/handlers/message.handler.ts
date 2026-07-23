import type { Server, Socket } from "socket.io";
import { isParticipant } from "../../services/conversation.service";
import { sendMessage } from "../../services/message.service";
import { sendMessageSchema } from "../../types";
import { EVENTS } from "../events";

export function registerMessageHandlers(io: Server, socket: Socket) {
	socket.on(EVENTS.MESSAGE_SEND, async (rawPayload, ack) => {
		const parsed = sendMessageSchema.safeParse(rawPayload);
		if (!parsed.success) {
			return ack({ ok: false, error: parsed.error.issues[0].message });
		}

		const { conversationId, text } = parsed.data;

		const allowed = await isParticipant(socket.data.userId, conversationId);
		if (!allowed) {
			return ack({
				ok: false,
				error: "Vous ne faites pas partie de cette conversation",
			});
		}

		const message = await sendMessage(socket.data.userId, conversationId, text);
		io.to(conversationId).emit(EVENTS.MESSAGE_NEW, message);
		ack({ ok: true });
	});
}
