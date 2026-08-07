import type { Server } from "socket.io";
import { createLogger, entry, group, groupEnd } from "../../lib/logger";
import { registerConversationHandlers } from "./conversation.handler";
import { registerMessageHandlers } from "./message.handler";

const logger = createLogger("socket");

const HANDLERS = [
	{ name: "ConversationHandlers", register: registerConversationHandlers },
	{ name: "MessageHandlers", register: registerMessageHandlers },
];

export function registerHandlers(io: Server): void {
	group("Handlers Registry");
	for (const { name, register } of HANDLERS) {
		entry(name, register);
	}
	groupEnd();

	io.on("connection", (socket) => {
		logger.info(
			`Socket connected -> ${socket.id} (userId: ${socket.data.userId})`,
		);

		// Room personnelle : c'est elle que conversation.handler.ts cible via
		// `io.to(userId).socketsJoin(...)` pour auto-join les participants déjà connectés.
		socket.join(socket.data.userId);

		for (const { register } of HANDLERS) {
			register(io, socket);
		}

		socket.on("disconnect", (reason) => {
			logger.info(`Socket disconnected -> ${socket.id} (${reason})`);
		});
	});
}
