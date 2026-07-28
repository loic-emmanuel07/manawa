import { Server } from "socket.io";
import { registerHandlers } from "./handlers";
import registerMiddlewares from "./middlewares";

export function createSocketServer(): Server {
	const io = new Server();
	registerMiddlewares(io);
	registerHandlers(io);
	return io;
}
