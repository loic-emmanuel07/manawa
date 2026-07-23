import { Router } from "express";

const router = Router();

router.get("/health", (_req, res) => {
	res.json({ status: "ok" });
});

router.post("/exemple", (req, res) => {
	const io = req.app.get("io");
	io.emit("message", "Événement depuis une route HTTP");
	res.send("OK");
});

export default router;
