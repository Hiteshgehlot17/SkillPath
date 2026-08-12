import dotenv from "dotenv";
import driver from "../src/config/database.js";

dotenv.config();

const session = driver.session();

async function testQueries() {
  try {
    console.log("\n📊 SKILLS\n");

    const skills = await session.run(`
      MATCH (s:Skill)
      RETURN s.name AS name
      ORDER BY name
    `);

    console.log(
      skills.records.map(record => record.get("name"))
    );

    console.log("\n💼 BACKEND ENGINEER REQUIREMENTS\n");

    const requirements = await session.run(
      `
      MATCH (r:Role {name: $roleName})-[:REQUIRES]->(s:Skill)
      RETURN s.name AS skill
      ORDER BY skill
      `,
      {
        roleName: "Backend Engineer"
      }
    );

    console.log(
      requirements.records.map(record => record.get("skill"))
    );

    console.log("\n🧭 MULTI-HOP CAREER PATH\n");

    const pathResult = await session.run(
      `
      MATCH p =
        (start:Skill {name: $startSkill})
        -[:PREREQUISITE_OF*1..6]->
        (target:Skill)
        <-[:REQUIRES]-
        (role:Role {name: $roleName})

      RETURN [node IN nodes(p) | node.name] AS path
      ORDER BY length(p)
      LIMIT 10
      `,
      {
        startSkill: "JavaScript",
        roleName: "Backend Engineer"
      }
    );

    for (const record of pathResult.records) {
      console.log(record.get("path"));
    }

    console.log("\n🎯 SKILL GAP\n");

    const gapResult = await session.run(
      `
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
              skill.name] AS matchedSkills
      `,
      {
        userId: "demo-user",
        roleName: "Backend Engineer"
      }
    );

    console.log(gapResult.records[0].toObject());

  } catch (error) {
    console.error("❌ Query test failed:", error);
  } finally {
    await session.close();
    await driver.close();
  }
}

testQueries();