import { eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "../db";
import { profiles } from "../db/schema";
import supabase from "../lib/supabase";

export const register = async (req: Request, res: Response) => {
	try {
		const { email, password, displayName } = req.body;

		if (!email || !password || !displayName) {
			return res
				.status(400)
				.json({ error: "Email, mot de passe et nom d'affichage requis" });
		}

		if (password.length < 6) {
			return res
				.status(400)
				.json({ error: "Le mot de passe doit contenir au moins 6 caractères" });
		}

		// 1. Créer l'utilisateur via Supabase Auth (table auth.users)
		const { data, error } = await supabase.auth.admin.createUser({
			email,
			password,
			email_confirm: true,
		});

		if (error) {
			return res.status(400).json({ error: error.message });
		}

		const userId = data.user.id;

		// 2. Créer le profil applicatif via Drizzle
		try {
			const [profile] = await db
				.insert(profiles)
				.values({
					id: userId,
					displayName,
				})
				.returning();

			res.status(201).json({
				user: {
					id: userId,
					email: data.user.email,
					displayName: profile.displayName,
				},
			});
		} catch (dbError) {
			// Si l'insertion du profil échoue, on supprime l'utilisateur Auth créé
			// pour éviter d'avoir un compte "orphelin" sans profil
			await supabase.auth.admin.deleteUser(userId);
			throw dbError;
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Erreur serveur" });
	}
};

export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ error: "Email et mot de passe requis" });
		}

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			return res.status(401).json({ error: "Email ou mot de passe incorrect" });
		}

		// On récupère le profil applicatif associé
		const [profile] = await db
			.select()
			.from(profiles)
			.where(eq(profiles.id, data.user.id));

		res.status(200).json({
			user: {
				id: data.user.id,
				email: data.user.email,
				displayName: profile?.displayName,
				avatarUrl: profile?.avatarUrl,
			},
			session: data.session, // contient access_token, refresh_token, expires_at...
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Erreur serveur" });
	}
};
