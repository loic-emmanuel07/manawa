import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes";
import userRoutes from "./routes/users.routes";

const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// ROUTES
app.use(healthRoutes);
app.use(userRoutes);

export default app;
