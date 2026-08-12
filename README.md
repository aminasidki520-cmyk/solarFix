Project Solar Backend - quick start

Prerequisites
- Java 21
- Docker (optional, recommended for local DB)
- Maven wrapper is included (use ./mvnw.cmd on Windows)

Run PostgreSQL with Docker (local dev)

1) Start the DB:

```powershell
# from project root
docker compose up -d
```

This will start a Postgres container listening on localhost:5332 with:
- user: solar_db
- password: solar123
- database: technician

Run the app

Set the DB password in the environment and start the app:

```powershell
$env:DB_PASSWORD='solar123'
.\mvnw.cmd spring-boot:run
Remove-Item Env:\DB_PASSWORD
```

Run tests (they use H2 in-memory database):

```powershell
.\mvnw.cmd test
```

Notes
- Migration tool: Liquibase is configured. Add changeSets under src/main/resources/db/changelog/ and include them in db.changelog-master.xml.
- For production remove the property that disables Spring Security in src/main/resources/application.properties.
- Do not commit real passwords into source control; use CI secrets/variables.

