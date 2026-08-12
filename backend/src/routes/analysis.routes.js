import express from "express";

import {
  analyzeCareer,
  updateUserSkills
} from "../services/graph.service.js";

const router = express.Router();

router.put("/:userId/skills", async (req, res) => {
  try {
    const { userId } = req.params;
    const { skills } = req.body;

    if (!Array.isArray(skills)) {
      return res.status(400).json({
        success: false,
        message: "skills must be an array"
      });
    }

    await updateUserSkills(userId, skills);

    res.json({
      success: true,
      message: "User skills updated successfully"
    });
  } catch (error) {
    console.error("Update skills error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to update user skills"
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { userId, roleName } = req.body;

    if (!userId || !roleName) {
      return res.status(400).json({
        success: false,
        message: "userId and roleName are required"
      });
    }

    const result = await analyzeCareer(userId, roleName);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Analysis error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to analyze career path"
    });
  }
});

export default router;