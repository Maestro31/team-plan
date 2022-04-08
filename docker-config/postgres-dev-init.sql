CREATE USER adonis with encrypted password 'adonis';
CREATE DATABASE team_plan;
GRANT ALL PRIVILEGES ON DATABASE team_plan TO adonis;

CREATE DATABASE team_plan_test;
GRANT ALL PRIVILEGES ON DATABASE team_plan_test TO adonis;
