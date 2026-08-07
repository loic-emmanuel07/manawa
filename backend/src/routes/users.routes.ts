import { Router } from "express";
import { createLogger } from "../lib/logger";
import supabase from "../lib/supabase";

const logger = createLogger("users");
const router = Router();

router.get("/users", async (_req, res) => {
	const { data, error } = await supabase.from("utilisateur").select("*");

	if (error) {
		logger.error("Failed to fetch users", error);
		return res
			.status(500)
			.json({ message: "Erreur de connexion", error: error.message });
	}

	res.json({ message: "Connexion réussie!", data });
});

export default router;
