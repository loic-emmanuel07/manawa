import { Server } from "socket.io";
import { socketAuthMiddleware } from "./auth.middleware";

export default function registerMiddlewares(io: Server ) {
    io.use(socketAuthMiddleware)
}