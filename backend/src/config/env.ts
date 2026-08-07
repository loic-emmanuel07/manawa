// The ENV config loader
// Utilisez à la place de process.env pour des données déjà validé
// Et evitez les syntaxes "unsafe" comme "process.env.SUPABASE_URL!"
import "dotenv/config";
import { createLogger } from "../lib/logger";

const logger = createLogger("env");

function required(key: string): string {
	const value = process.env[key];
	if (!value) throw new Error(`Variable d'environnement manquante: ${key}`);
	return value;
}

const ALLOWED_MODES = ["DEV", "RELEASE"] as const;
type Mode = (typeof ALLOWED_MODES)[number];

function resolveMode(): Mode {
	const raw = process.env.MODE || "DEV";
	if ((ALLOWED_MODES as readonly string[]).includes(raw)) return raw as Mode;
	logger.warn(
		`Unknown mode: "${raw}", expected one of ${ALLOWED_MODES.join(", ")}. Falling back to "DEV".`,
	);
	return "DEV";
}

const env = {
	MODE: resolveMode(),
	DATABASE_URL: required("DATABASE_URL"),
	SUPABASE_URL: required("SUPABASE_URL"),
	SUPABASE_SERVICE_ROLE_KEY: required("SUPABASE_SERVICE_ROLE_KEY"),
	PORT: process.env.PORT || "3000",
	CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
};

export default env;
