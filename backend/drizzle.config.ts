// drizzle.config.ts (racine du projet backend)

import { defineConfig } from "drizzle-kit";

export default defineConfig({

  schema: "./src/db/schema.ts",

  out: "./src/db/migrations",

  dialect: "postgresql",

  dbCredentials: {
    url: process.env.DIRECT_URL!,
  },

});