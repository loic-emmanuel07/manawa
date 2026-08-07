import type { Socket } from "socket.io";
import { createLogger, locate } from "../../lib/logger";
import supabase from "../../lib/supabase";

const logger = createLogger("socket:auth");

export async function socketAuthMiddleware(
	socket: Socket,
	next: (err?: Error) => void,
) {
	const token = socket.handshake.auth?.token;

	if (!token) {
		logger.warn(`Missing token (socket ${socket.id})`);
		return next(new Error("Token manquant"));
	}

	const { data, error } = await supabase.auth.getUser(token);

	if (error || !data.user) {
		logger.warn(`Invalid token (socket ${socket.id})`, error);
		return next(new Error("Token invalide"));
	}

	socket.data.userId = data.user.id;
	logger.info(`Auth successful, userId -> ${socket.data.userId}`);
	next();
}
locate(socketAuthMiddleware);
