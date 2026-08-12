const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:5001/api";

export async function getSkills() {
  const response = await fetch(`${API_URL}/skills`);

  if (!response.ok) {
    throw new Error("Failed to load skills");
  }

  return response.json();
}

export async function getRoles() {
  const response = await fetch(`${API_URL}/roles`);

  if (!response.ok) {
    throw new Error("Failed to load roles");
  }

  return response.json();
}

export async function updateUserSkills(userId, skills) {
  const response = await fetch(
    `${API_URL}/analyze/${userId}/skills`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ skills })
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update skills");
  }

  return response.json();
}

export async function analyzeCareer(userId, roleName) {
  const response = await fetch(`${API_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId,
      roleName
    })
  });

  if (!response.ok) {
    throw new Error("Failed to analyze career");
  }

  return response.json();
}