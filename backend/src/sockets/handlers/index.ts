import type { Server } from "socket.io";
import { registerConversationHandlers } from "./conversation.handler";
import { registerMessageHandlers } from "./message.handler";

export function registerHandlers(io: Server): void {
	io.on("connection", (socket) => {
		registerConversationHandlers(io, socket);
		registerMessageHandlers(io, socket);
	});
}
