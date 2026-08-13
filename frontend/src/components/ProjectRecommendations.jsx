import { Lightbulb } from "lucide-react";

export default function ProjectRecommendations({
  recommendations = []
}) {
  const validRecommendations = recommendations.filter(
    (item) =>
      item.projects &&
      item.projects.length > 0
  );

  if (validRecommendations.length === 0) {
    return (
      <div className="project-empty">
        <Lightbulb size={24} />
        <p>
          No project recommendations are available for the
          current skill gap.
        </p>
      </div>
    );
  }

  return (
    <div className="project-grid">
      {validRecommendations.map((item) =>
        item.projects.map((project) => (
          <div
            className="project-card"
            key={`${item.skill}-${project}`}
          >
            <div className="project-icon">
              <Lightbulb size={20} />
            </div>

            <div className="project-content">
              <span className="project-skill">
                Recommended for {item.skill}
              </span>

              <h4>{project}</h4>
            </div>
          </div>
        ))
      )}
    </div>
  );
}