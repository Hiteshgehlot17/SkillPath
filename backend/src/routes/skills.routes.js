import express from "express";
import { getSkills } from "../services/graph.service.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const skills = await getSkills();

    res.json({
      success: true,
      data: skills
    });
  } catch (error) {
    console.error("Skills error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to load skills"
    });
  }
});

export default router;