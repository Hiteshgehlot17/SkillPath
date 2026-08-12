import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import driver from "./config/database.js";

import skillsRoutes from "./routes/skills.routes.js";
import rolesRoutes from "./routes/roles.routes.js";
import analysisRoutes from "./routes/analysis.routes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: true
  })
);

app.use(express.json());

/*
 * Health check
 */
app.get("/health", async (req, res) => {
  try {
    await driver.verifyConnectivity();

    res.status(200).json({
      success: true,
      message: "Server and CognoDB are connected"
    });
  } catch (error) {
    console.error("CognoDB connection error:", error.message);

    res.status(503).json({
      success: false,
      message: "Database unavailable"
    });
  }
});

/*
 * API routes
 */
app.use("/api/skills", skillsRoutes);

app.use("/api/roles", rolesRoutes);

app.use("/api/analyze", analysisRoutes);

/*
 * Unknown route
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

/*
 * Error handler
 */
app.use((error, req, res, next) => {
  console.error("Unhandled server error:", error);

  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

/*
 * Export Express application.
 *
 * Vercel uses this exported app as the backend.
 */
export default app;