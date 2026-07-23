import { createClient } from "@supabase/supabase-js";
import type { Socket } from "socket.io";
import env from "../../config/env";

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

export async function socketAuthMiddleware(
	socket: Socket,
	next: (err?: Error) => void,
) {
	const token = socket.handshake.auth?.token;

	if (!token) {
		return next(new Error("Token manquant"));
	}

	const { data, error } = await supabase.auth.getUser(token);

	if (error || !data.user) {
		return next(new Error("Token invalide"));
	}

	socket.data.userId = data.user.id;
	next();
}
