// src/client-test.ts
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Connecté:", socket.id);
  socket.emit("message", "hello from client-test");
});

socket.on("message", (data) => {
  console.log("Reçu:", data);
});

socket.on("disconnect", () => {
  console.log("Déconnecté");
});