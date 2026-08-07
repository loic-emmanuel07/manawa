import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import env from "../config/env";
import { createLogger, group, groupEnd } from "../lib/logger";
import { registerHandlers } from "./handlers";
import registerMiddlewares from "./middlewares";

const logger = createLogger("socket");

export function createSocketServer(httpServer: HttpServer): Server {
	const io = new Server(httpServer, {
		cors: { origin: env.CORS_ORIGIN },
	});

	group("Socket::Init");
	registerMiddlewares(io);
	registerHandlers(io);
	groupEnd();

	logger.info(`Socket.IO server ready (CORS origin: ${env.CORS_ORIGIN})`);
	return io;
}
