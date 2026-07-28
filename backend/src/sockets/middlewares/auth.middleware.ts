import type { Socket } from "socket.io";
import supabase from "../../lib/supabase";


export async function socketAuthMiddleware(
	socket: Socket,
	next: (err?: Error) => void,
) {
	const token = socket.handshake.auth?.token;

	if (!token) {
		console.error("SOCKET.AUTH: Missing token")
		return next(new Error("Token manquant"));
	}

	const { data, error } = await supabase.auth.getUser(token);

	if (error || !data.user) {
		console.error(`SOCKET.AUTH: Invalid token -> ${token}`)
		return next(new Error("Token invalide"));
	}

	socket.data.userId = data.user.id;
	console.log(`Auth successful userId -> ${socket.data.userId}`)
	next();
}
