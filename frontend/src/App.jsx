import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Analysis from "./pages/Analysis";

import { getSkills, getRoles } from "./services/api";

import "./App.css";

function App() {
  const [page, setPage] = useState("home");
  const [skills, setSkills] = useState([]);
  const [roles, setRoles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function loadData() {
      try {
        const [skillsResponse, rolesResponse] = await Promise.all([
          getSkills(),
          getRoles()
        ]);

        setSkills(skillsResponse.data);
        setRoles(rolesResponse.data);
      } catch (err) {
        console.error("SkillPath API error:", err);

        setError(
          "Unable to connect to SkillPath. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <Loader2 className="spin" size={32} />
        <p>Loading SkillPath...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <h1>SkillPath</h1>

        <p>{error}</p>

        <small>
          Backend: {API_URL}
        </small>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <main>
        {page === "home" && (
          <Home onStart={() => setPage("analysis")} />
        )}

        {page === "analysis" && (
          <Analysis
            skills={skills}
            roles={roles}
            onBack={() => setPage("home")}
          />
        )}
      </main>
    </>
  );
}

export default App;