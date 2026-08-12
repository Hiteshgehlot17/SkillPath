import app from "./server.js";

const PORT = process.env.PORT || 5001;

app.listen(PORT, "127.0.0.1", () => {
  console.log(
    `🚀 SkillPath API running on http://127.0.0.1:${PORT}`
  );
});