import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";

import driver from "./config/database.js";

import skillsRoutes from "./routes/skills.routes.js";
import rolesRoutes from "./routes/roles.routes.js";
import analysisRoutes from "./routes/analysis.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get("/health", async (req, res) => {
  try {
    await driver.verifyConnectivity();

    res.json({
      success: true,
      message: "Server and CognoDB are connected"
    });
  } catch (error) {
    console.error("Database error:", error.message);

    res.status(503).json({
      success: false,
      message: "Database unavailable"
    });
  }
});

app.use("/api/skills", skillsRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/analyze", analysisRoutes);

const server = http.createServer(app);

server.listen(PORT, "127.0.0.1", () => {
  console.log(`🚀 SkillPath API running on http://127.0.0.1:${PORT}`);
});

server.ref();