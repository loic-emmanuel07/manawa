import { createServer } from "node:http";
import app from "./app";
import env from "./config/env";
import { createLogger } from "./lib/logger";

import { createSocketServer } from "./sockets";

const logger = createLogger("server");

const server = createServer(app); // on greffe le serveur HTTP sur votre app Express existante
const io = createSocketServer(server); // Socket.IO se greffe sur le serveur HTTP

// On écoute sur "server", pas sur "app"
const PORT = env.PORT;
server.listen(PORT, () => {
	logger.success(`Serveur démarré sur le port ${PORT} (mode: ${env.MODE})`);
});

app.set("io", io);
