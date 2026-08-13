# SkillPath

### Graph-Based Career Path & Skill Gap Explorer

SkillPath is a web application that helps users understand how their current technical skills map to a target software engineering role.

Users can select their existing skills, choose a target role, and receive:

- Skill match percentage
- Matched skills
- Missing skills
- Multi-hop career/prerequisite paths
- Recommended projects for missing skills

The application is backed by **CognoDB**, a managed graph database using openCypher and the official Neo4j driver.

---

## Live Demo

**Frontend:**  
https://skill-path-theta.vercel.app

**Backend API:**  
https://skill-path-rod3b2hc5-hitesh-malis-projects.vercel.app

---

## Why a Graph Database?

SkillPath is fundamentally about relationships between entities:

- Users have skills
- Roles require skills
- Skills have prerequisites
- Projects teach skills

These relationships form a connected graph.

A relational database could store the same information, but queries involving multi-hop prerequisite traversal and career paths would require complex joins or recursive queries.

With a graph database, these relationships can be traversed naturally using Cypher.

For example:

```text
User
  │
  └── HAS_SKILL → Skill
                    │
                    └── PREREQUISITE_OF → Skill
                                              │
                                              └── REQUIRED_BY → Role