import driver from "../config/database.js";

export async function getSkills() {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (s:Skill)
      RETURN s.name AS name
      ORDER BY name
    `);

    return result.records.map((record) => record.get("name"));
  } finally {
    await session.close();
  }
}

export async function getRoles() {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (r:Role)
      RETURN r.name AS name
      ORDER BY name
    `);

    return result.records.map((record) => record.get("name"));
  } finally {
    await session.close();
  }
}

export async function analyzeCareer(userId, roleName) {
  const session = driver.session();

  try {
    // Skill gap
    const gapResult = await session.run(
      `
      MATCH (u:User {id: $userId})-[:HAS_SKILL]->(owned:Skill)
      WITH collect(owned) AS ownedSkills

      MATCH (r:Role {name: $roleName})-[:REQUIRES]->(required:Skill)

      WITH ownedSkills, collect(required) AS requiredSkills

      RETURN
        [skill IN requiredSkills
          WHERE skill IN ownedSkills |
          skill.name] AS matchedSkills,

        [skill IN requiredSkills
          WHERE NOT skill IN ownedSkills |
          skill.name] AS missingSkills,

        size([skill IN requiredSkills
          WHERE skill IN ownedSkills]) AS matchedCount,

        size(requiredSkills) AS requiredCount
      `,
      {
        userId,
        roleName
      }
    );

    if (gapResult.records.length === 0) {
      throw new Error("Role not found");
    }

    const gap = gapResult.records[0];

    const matchedSkills = gap.get("matchedSkills");
    const missingSkills = gap.get("missingSkills");

    const matchedCount = gap.get("matchedCount").toNumber();
    const requiredCount = gap.get("requiredCount").toNumber();

    const matchPercentage =
      requiredCount === 0
        ? 0
        : Math.round((matchedCount / requiredCount) * 100);

    // Career paths
    const pathResult = await session.run(
      `
      MATCH p =
        (start:Skill)
        -[:PREREQUISITE_OF*1..6]->
        (target:Skill)
        <-[:REQUIRES]-
        (role:Role {name: $roleName})

      WHERE start.name IN $missingSkills

      RETURN
        [node IN nodes(p) | node.name] AS path

      ORDER BY length(p)

      LIMIT 10
      `,
      {
        roleName,
        missingSkills
      }
    );

    const careerPaths = pathResult.records.map(
      (record) => record.get("path")
    );

    // Recommended projects
    const projectResult = await session.run(
      `
      MATCH (skill:Skill)

      WHERE skill.name IN $missingSkills

      OPTIONAL MATCH (project:Project)-[:TEACHES]->(skill)

      RETURN
        skill.name AS skill,
        collect(DISTINCT project.name) AS projects

      ORDER BY skill
      `,
      {
        missingSkills
      }
    );

    const recommendations = projectResult.records.map((record) => ({
      skill: record.get("skill"),
      projects: record.get("projects")
    }));

    return {
      role: roleName,
      matchPercentage,
      matchedSkills,
      missingSkills,
      careerPaths,
      recommendations
    };
  } finally {
    await session.close();
  }
}
export async function updateUserSkills(userId, skills) {
  const session = driver.session();

  try {
    await session.run(
      `
      MATCH (u:User {id: $userId})
      OPTIONAL MATCH (u)-[r:HAS_SKILL]->()
      DELETE r
      `,
      { userId }
    );

    await session.run(
      `
      MATCH (u:User {id: $userId})
      UNWIND $skills AS skillName
      MATCH (s:Skill {name: skillName})
      CREATE (u)-[:HAS_SKILL]->(s)
      `,
      {
        userId,
        skills
      }
    );

    return true;
  } finally {
    await session.close();
  }
}