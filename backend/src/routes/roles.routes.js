import express from "express";
import { getRoles } from "../services/graph.service.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const roles = await getRoles();

    res.json({
      success: true,
      data: roles
    });
  } catch (error) {
    console.error("Roles error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to load roles"
    });
  }
});

export default router;