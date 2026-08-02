import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import env from "../config/env";
import { registerHandlers } from "./handlers";
import registerMiddlewares from "./middlewares";

export function createSocketServer(httpServer: HttpServer): Server {
	const io = new Server(httpServer, {
		cors: { origin: env.CORS_ORIGIN },
	});
	registerMiddlewares(io);
	registerHandlers(io);
	return io;
}
