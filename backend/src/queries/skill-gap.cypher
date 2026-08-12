MATCH (u:User {id: $userId})-[:HAS_SKILL]->(owned:Skill)
WITH u, collect(owned) AS ownedSkills

MATCH (r:Role {name: $roleName})-[:REQUIRES]->(required:Skill)

WITH ownedSkills, collect(required) AS requiredSkills

RETURN
    [skill IN requiredSkills
        WHERE NOT skill IN ownedSkills |
        skill.name] AS missingSkills,

    [skill IN requiredSkills
        WHERE skill IN ownedSkills |
        skill.name] AS matchedSkills,

    size([skill IN requiredSkills
        WHERE skill IN ownedSkills]) AS matchedCount,

    size(requiredSkills) AS requiredCount