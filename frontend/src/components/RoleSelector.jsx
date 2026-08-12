import { Briefcase } from "lucide-react";

export default function RoleSelector({
  roles,
  selectedRole,
  setSelectedRole
}) {
  return (
    <div className="role-grid">
      {roles.map((role) => (
        <button
          key={role}
          className={`role-card ${
            selectedRole === role ? "selected" : ""
          }`}
          onClick={() => setSelectedRole(role)}
        >
          <Briefcase size={22} />

          <span>{role}</span>

          <small>
            Explore career path
          </small>
        </button>
      ))}
    </div>
  );
}