# SolarFix - DevSecOps Initial Status

## Environment

- OS: Ubuntu
- Java: 21.0.11
- Maven: 3.9.16
- Node.js: 22.23.2
- npm: 10.9.8
- Docker: installed
- PostgreSQL: Docker container

## Frontend

Project:
solarfixWebsite

Commands validated:

- npm ci
- npm run build

Status: PASS

## Backend

Commands:

- ./mvnw -version → PASS
- ./mvnw clean test → FAIL

Reason:

Tests use H2:
src/test/resources/application.properties

But H2 dependency is not present in pom.xml.

Error:

Cannot load driver class: org.h2.Driver

## Docker

PostgreSQL container:
solar_postgres

Status:
UP

Web container:
gep-web-app-web-1

Status:
UP

## Backend runtime

Port 8082:
NOT RUNNING

curl localhost:8082:
CONNECTION REFUSED

## Important

Do not modify application code without developer validation.
