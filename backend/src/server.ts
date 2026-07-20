import "dotenv/config";
import app from "./app";
import { createServer } from "http";
import { Server } from "socket.io";

const server = createServer(app); // on greffe le serveur HTTP sur votre app Express existante
const io = new Server(server);    // Socket.IO se greffe sur le serveur HTTP

// Gestion des connexions Socket.IO
io.on("connection", (socket) => {
  console.log("Un client est connecté:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client déconnecté");
  });

  socket.on("message", (data) => {
    console.log("Message reçu:", data);
    io.emit("message", data); // rediffuse à tous les clients
  });
});

// On écoute sur "server", pas sur "app"
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

app.set("io", io);