import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";

import SkillSelector from "../components/SkillSelector";
import RoleSelector from "../components/RoleSelector";
import SkillGap from "../components/SkillGap";
import CareerPath from "../components/CareerPath";
import ProjectRecommendations from "../components/ProjectRecommendations";

import {
  analyzeCareer,
  updateUserSkills
} from "../services/api";

export default function Analysis({
  skills,
  roles,
  onBack
}) {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAnalyze() {
    if (selectedSkills.length === 0) {
      setError("Select at least one skill.");
      return;
    }

    if (!selectedRole) {
      setError("Select a target role first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Update selected skills in CognoDB
      await updateUserSkills(
        "demo-user",
        selectedSkills
      );

      // Analyze using the updated graph
      const response = await analyzeCareer(
        "demo-user",
        selectedRole
      );

      setAnalysis(response.data);
    } catch (err) {
      console.error(err);
      setError("Unable to analyze your career path.");
    } finally {
      setLoading(false);
    }
  }

  if (analysis) {
    return (
      <div className="analysis-page">

        <button
          className="back-btn"
          onClick={() => setAnalysis(null)}
        >
          <ArrowLeft size={18} />
          Change selection
        </button>

        <div className="analysis-header">
          <div>
            <span className="eyebrow">
              Career analysis
            </span>

            <h1>{analysis.role}</h1>
          </div>

          <div className="score">
            <strong>{analysis.matchPercentage}%</strong>
            <span>match</span>
          </div>
        </div>

        <section className="result-section">
          <h2>Skill gap</h2>

          <SkillGap
            matchedSkills={analysis.matchedSkills}
            missingSkills={analysis.missingSkills}
          />
        </section>

        <section className="result-section">
          <h2>Recommended paths</h2>

          <CareerPath
            paths={analysis.careerPaths}
          />
        </section>

        <section className="result-section">
          <h2>Projects to build</h2>

          <ProjectRecommendations
            recommendations={analysis.recommendations}
          />
        </section>

      </div>
    );
  }

  return (
    <div className="analysis-page">

      <button
        className="back-btn"
        onClick={onBack}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="analysis-header">
        <div>
          <span className="eyebrow">
            Step 1
          </span>

          <h1>Your current skills</h1>

          <p>
            Select the technologies and skills you already know.
          </p>
        </div>
      </div>

      <SkillSelector
        skills={skills}
        selectedSkills={selectedSkills}
        setSelectedSkills={setSelectedSkills}
      />

      <div className="step-divider" />

      <div className="analysis-header">
        <div>
          <span className="eyebrow">
            Step 2
          </span>

          <h1>Choose your destination</h1>

          <p>
            Select the career role you want to explore.
          </p>
        </div>
      </div>

      <RoleSelector
        roles={roles}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
      />

      {error && (
        <div className="error-box">
          {error}
        </div>
      )}

      <button
        className="primary-btn analyze-btn"
        onClick={handleAnalyze}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2
              className="spin"
              size={18}
            />
            Analyzing graph...
          </>
        ) : (
          "Analyze my career path"
        )}
      </button>

    </div>
  );
}