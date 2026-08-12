MATCH p =
    (start:Skill {name: $startSkill})
    -[:PREREQUISITE_OF*1..6]->
    (target:Skill)
    <-[:REQUIRES]-
    (role:Role {name: $roleName})

RETURN
    [node IN nodes(p) | node.name] AS path
ORDER BY length(p)
LIMIT 10