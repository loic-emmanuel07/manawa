import { Server, Socket} from "socket.io";
import { registerHandlers } from "./handlers";

export function createSocketServer(): Server{
    const io = new Server;
    registerHandlers(io);
    return io;
}