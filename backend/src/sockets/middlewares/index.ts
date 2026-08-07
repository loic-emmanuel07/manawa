import type { Server } from "socket.io";
import { entry, group, groupEnd } from "../../lib/logger";
import { socketAuthMiddleware } from "./auth.middleware";

const MIDDLEWARES = [{ name: "AuthMiddleware", use: socketAuthMiddleware }];

export default function registerMiddlewares(io: Server) {
	group("Middlewares Registry");
	for (const { name, use } of MIDDLEWARES) {
		entry(name, use);
		io.use(use);
	}
	groupEnd();
}
