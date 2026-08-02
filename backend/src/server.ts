import { createServer } from "node:http";
import app from "./app";
import env from "./config/env";

import { createSocketServer } from "./sockets";

const server = createServer(app); // on greffe le serveur HTTP sur votre app Express existante
const io = createSocketServer(server); // Socket.IO se greffe sur le serveur HTTP

// On écoute sur "server", pas sur "app"
const PORT = env.PORT;
server.listen(PORT, () => {
	console.log(`Serveur démarré sur le port ${PORT}`);
});

app.set("io", io);
