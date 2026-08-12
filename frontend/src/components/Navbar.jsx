import { Network, Compass } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <Network size={22} />
        SkillPath
      </div>

      <div className="nav-link">
        <Compass size={18} />
        Career Explorer
      </div>
    </nav>
  );
}