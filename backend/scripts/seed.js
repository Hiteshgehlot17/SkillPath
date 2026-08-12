import dotenv from "dotenv";
import driver from "../src/config/database.js";

dotenv.config();

const session = driver.session();

const skills = [
  "JavaScript",
  "TypeScript",
  "React",
  "HTML",
  "CSS",
  "Node.js",
  "Express.js",
  "REST APIs",
  "MongoDB",
  "SQL",
  "Java",
  "Spring Boot",
  "Python",
  "Git",
  "Docker",
  "Kubernetes",
  "AWS",
  "Linux",
  "System Design",
  "Authentication"
];

const roles = [
  "Frontend Engineer",
  "Backend Engineer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Cloud Engineer",
  "Software Engineer"
];

const projects = [
  {
    name: "Build a React Dashboard",
    skills: ["React", "JavaScript", "HTML", "CSS"]
  },
  {
    name: "Build a REST API",
    skills: ["Node.js", "Express.js", "REST APIs", "MongoDB"]
  },
  {
    name: "Build an Authentication API",
    skills: ["Node.js", "Express.js", "REST APIs", "Authentication"]
  },
  {
    name: "Deploy an Application with Docker",
    skills: ["Docker", "Linux", "AWS"]
  },
  {
    name: "Build a Spring Boot API",
    skills: ["Java", "Spring Boot", "REST APIs", "SQL"]
  }
];

const roleRequirements = {
  "Frontend Engineer": [
    "JavaScript",
    "TypeScript",
    "React",
    "HTML",
    "CSS",
    "Git"
  ],

  "Backend Engineer": [
    "JavaScript",
    "Node.js",
    "Express.js",
    "REST APIs",
    "MongoDB",
    "Authentication",
    "Git"
  ],

  "Full Stack Developer": [
    "JavaScript",
    "React",
    "Node.js",
    "Express.js",
    "REST APIs",
    "MongoDB",
    "Git"
  ],

  "DevOps Engineer": [
    "Linux",
    "Git",
    "Docker",
    "Kubernetes",
    "AWS"
  ],

  "Cloud Engineer": [
    "Linux",
    "Docker",
    "Kubernetes",
    "AWS",
    "System Design"
  ],

  "Software Engineer": [
    "Java",
    "Python",
    "SQL",
    "Git",
    "System Design"
  ]
};

const prerequisites = [
  ["JavaScript", "Node.js"],
  ["Node.js", "Express.js"],
  ["Express.js", "REST APIs"],
  ["REST APIs", "Authentication"],
  ["Java", "Spring Boot"],
  ["HTML", "React"],
  ["CSS", "React"],
  ["Linux", "Docker"],
  ["Docker", "Kubernetes"],
  ["Kubernetes", "AWS"]
];

async function seed() {
  try {
    console.log("🌱 Starting database seed...");

    await session.run(`
      MATCH (n)
      DETACH DELETE n
    `);

    console.log("🧹 Existing graph cleared.");

    // Create skills
    for (const name of skills) {
      await session.run(
        `
        CREATE (:Skill {
          name: $name
        })
        `,
        { name }
      );
    }

    console.log(`✅ Created ${skills.length} skills.`);

    // Create roles
    for (const name of roles) {
      await session.run(
        `
        CREATE (:Role {
          name: $name
        })
        `,
        { name }
      );
    }

    console.log(`✅ Created ${roles.length} roles.`);

    // Create projects
    for (const project of projects) {
      await session.run(
        `
        CREATE (:Project {
          name: $name
        })
        `,
        { name: project.name }
      );
    }

    console.log(`✅ Created ${projects.length} projects.`);

    // Role → Skill
    for (const [roleName, requiredSkills] of Object.entries(roleRequirements)) {
      for (const skillName of requiredSkills) {
        await session.run(
          `
          MATCH (r:Role {name: $roleName})
          MATCH (s:Skill {name: $skillName})
          CREATE (r)-[:REQUIRES]->(s)
          `,
          {
            roleName,
            skillName
          }
        );
      }
    }

    console.log("✅ Created role requirements.");

    // Skill → Skill prerequisites
    for (const [from, to] of prerequisites) {
      await session.run(
        `
        MATCH (a:Skill {name: $from})
        MATCH (b:Skill {name: $to})
        CREATE (a)-[:PREREQUISITE_OF]->(b)
        `,
        {
          from,
          to
        }
      );
    }

    console.log("✅ Created prerequisite relationships.");

    // Project → Skill
    for (const project of projects) {
      for (const skillName of project.skills) {
        await session.run(
          `
          MATCH (p:Project {name: $projectName})
          MATCH (s:Skill {name: $skillName})
          CREATE (p)-[:TEACHES]->(s)
          `,
          {
            projectName: project.name,
            skillName
          }
        );
      }
    }

    console.log("✅ Created project relationships.");

    // Related roles
    await session.run(`
      MATCH (a:Role {name: "Frontend Engineer"})
      MATCH (b:Role {name: "Full Stack Developer"})
      CREATE (a)-[:RELATED_TO]->(b)
    `);

    await session.run(`
      MATCH (a:Role {name: "Backend Engineer"})
      MATCH (b:Role {name: "Full Stack Developer"})
      CREATE (a)-[:RELATED_TO]->(b)
    `);

    await session.run(`
      MATCH (a:Role {name: "DevOps Engineer"})
      MATCH (b:Role {name: "Cloud Engineer"})
      CREATE (a)-[:RELATED_TO]->(b)
    `);

    console.log("✅ Created role relationships.");

    // Create demo user
    await session.run(`
      CREATE (u:User {
        id: "demo-user",
        name: "Demo User"
      })
    `);

    const demoSkills = [
      "JavaScript",
      "React",
      "HTML",
      "CSS",
      "Git"
    ];

    for (const skillName of demoSkills) {
      await session.run(
        `
        MATCH (u:User {id: "demo-user"})
        MATCH (s:Skill {name: $skillName})
        CREATE (u)-[:HAS_SKILL]->(s)
        `,
        { skillName }
      );
    }

    console.log("✅ Created demo user.");

    console.log("🎉 Database seeded successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
  } finally {
    await session.close();
    await driver.close();
  }
}

seed();