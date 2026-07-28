import { Server, Socket } from "socket.io";
import { registerConversationHandlers } from "./conversation.handler";
import { registerMessageHandlers } from "./message.handler";

export function registerHandlers(io : Server): void{
    io.on("connetion", (Socket) =>{
        registerConversationHandlers(io, Socket);
        registerMessageHandlers(io, Socket);
    })
}