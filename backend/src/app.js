import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import todoRoutes from "./routes/todo.routes.js";
import sequelize from "./config/db.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || true
  })
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/todo", todoRoutes);

const port = Number(process.env.PORT || 5000);

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: process.env.DB_SYNC_ALTER === "true" });
    console.log("PostgreSQL connected");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error("Startup failed", err);
    process.exit(1);
  }
})();
