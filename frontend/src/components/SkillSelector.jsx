import { Check } from "lucide-react";

export default function SkillSelector({
  skills,
  selectedSkills,
  setSelectedSkills
}) {
  function toggleSkill(skill) {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(
        selectedSkills.filter((item) => item !== skill)
      );
    } else {
      setSelectedSkills([
        ...selectedSkills,
        skill
      ]);
    }
  }

  return (
    <div className="skill-grid">
      {skills.map((skill) => {
        const selected = selectedSkills.includes(skill);

        return (
          <button
            key={skill}
            className={`skill-chip ${selected ? "selected" : ""}`}
            onClick={() => toggleSkill(skill)}
          >
            {selected && <Check size={15} />}
            {skill}
          </button>
        );
      })}
    </div>
  );
}