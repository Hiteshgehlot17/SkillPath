import { CheckCircle2, Circle } from "lucide-react";

export default function SkillGap({
  matchedSkills,
  missingSkills
}) {
  return (
    <div className="gap-section">

      <div>
        <h3>Your strengths</h3>

        <div className="gap-list">
          {matchedSkills.map((skill) => (
            <div className="gap-item matched" key={skill}>
              <CheckCircle2 size={18} />
              {skill}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3>Skills to develop</h3>

        <div className="gap-list">
          {missingSkills.map((skill) => (
            <div className="gap-item missing" key={skill}>
              <Circle size={18} />
              {skill}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}