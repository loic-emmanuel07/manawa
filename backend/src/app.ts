import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.routes";
import healthRoutes from "./routes/health.routes";
import userRoutes from "./routes/users.routes";

const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// ROUTES
app.use(healthRoutes);
app.use(userRoutes);
app.use("/auth", authRoutes); // ← ajoutez "/auth" ici

export default app;
