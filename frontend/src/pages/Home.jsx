import { ArrowRight, Network, Route, Target } from "lucide-react";

export default function Home({ onStart }) {
  return (
    <div className="home">
      <div className="hero">

        <div className="hero-badge">
          <Network size={16} />
          Graph-powered career intelligence
        </div>

        <h1>
          Find the path from
          <span> where you are </span>
          to where you want to go.
        </h1>

        <p>
          SkillPath maps your existing skills to career requirements
          and discovers the learning paths that connect them.
        </p>

        <button className="primary-btn" onClick={onStart}>
          Explore your path
          <ArrowRight size={18} />
        </button>

      </div>

      <div className="features">

        <div className="feature-card">
          <Target size={24} />
          <h3>Identify skill gaps</h3>
          <p>
            See exactly which skills you already have and
            which ones your target role requires.
          </p>
        </div>

        <div className="feature-card">
          <Route size={24} />
          <h3>Discover paths</h3>
          <p>
            Explore prerequisite relationships between
            skills instead of following a generic checklist.
          </p>
        </div>

        <div className="feature-card">
          <Network size={24} />
          <h3>Build with purpose</h3>
          <p>
            Get projects connected directly to the skills
            you need to develop.
          </p>
        </div>

      </div>
    </div>
  );
}