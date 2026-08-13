MATCH (r:Role {name: $roleName})-[:REQUIRES]->(skill:Skill)

MATCH (p:Project)-[:TEACHES]->(skill)

RETURN
    skill.name AS skill,
    collect(DISTINCT p.name) AS recommendedProjects
ORDER BY skill