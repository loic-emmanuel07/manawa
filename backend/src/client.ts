import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
	console.log("Connecté au serveur:", socket.id);
});

socket.on("message", (data) => {
	console.log("Message reçu:", data);
});

socket.on("disconnect", () => {
	console.log("Déconnecté du serveur");
});

/* je sais pas trop quoi en faire
function sendMessage(text: string) {
	socket.emit("message", text);
}
*/
