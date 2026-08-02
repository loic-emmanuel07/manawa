// The ENV config loader
// Utilisez à la place de process.env pour des données déjà validé
// Et evitez les syntaxes "unsafe" comme "process.env.SUPABASE_URL!"
import "dotenv/config";

function required(key: string): string {
	const value = process.env[key];
	if (!value) throw new Error(`Variable d'environnement manquante: ${key}`);
	return value;
}

const env = {
	DATABASE_URL: required("DATABASE_URL"),
	SUPABASE_URL: required("SUPABASE_URL"),
	SUPABASE_SERVICE_ROLE_KEY: required("SUPABASE_SERVICE_ROLE_KEY"),
	PORT: process.env.PORT || "3000",
	CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
};

export default env;
