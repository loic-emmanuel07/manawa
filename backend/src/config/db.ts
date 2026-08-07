import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schema";
import { createLogger } from "../lib/logger";
import env from "./env";

const logger = createLogger("db");

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(env.DATABASE_URL, { prepare: false });
logger.info("Postgres client initialized");
export const db = drizzle(client, { schema });
