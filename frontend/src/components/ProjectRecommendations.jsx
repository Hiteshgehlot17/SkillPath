import { Lightbulb } from "lucide-react";

export default function ProjectRecommendations({
  recommendations
}) {
  return (
    <div className="project-grid">

      {recommendations.map((item) => (
        <div className="project-card" key={item.skill}>

          <div className="project-icon">
            <Lightbulb size={20} />
          </div>

          <div>
            <span className="project-skill">
              Learn {item.skill}
            </span>

            {item.projects.map((project) => (
              <h4 key={project}>
                {project}
              </h4>
            ))}
          </div>

        </div>
      ))}

    </div>
  );
}