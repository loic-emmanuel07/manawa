import cors from "cors";
import express from "express";
import env from "./config/env";
import authRoutes from "./routes/auth.routes";
import healthRoutes from "./routes/health.routes";
import userRoutes from "./routes/users.routes";

const app = express();

// MIDDLEWARES
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

// ROUTES
app.use(healthRoutes);
app.use(userRoutes);
app.use("/auth", authRoutes); // ← ajoutez "/auth" ici

export default app;
