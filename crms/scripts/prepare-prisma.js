const fs = require("fs");
const path = require("path");

const schemaPath = path.join(__dirname, "..", "prisma", "schema.prisma");

function preparePrisma() {
  const dbUrl =
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    "";

  if (!fs.existsSync(schemaPath)) {
    return;
  }

  let content = fs.readFileSync(schemaPath, "utf8");

  // Determine provider: postgresql if connection string starts with postgres, else sqlite
  const isPostgres =
    dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://");

  const targetProvider = isPostgres ? "postgresql" : "sqlite";

  // Replace provider in datasource db block
  content = content.replace(
    /datasource\s+db\s*\{[^}]*provider\s*=\s*"[^"]*"[^}]*\}/m,
    (match) => match.replace(/provider\s*=\s*"[^"]*"/, `provider = "${targetProvider}"`)
  );

  fs.writeFileSync(schemaPath, content, "utf8");
  console.log(`[prepare-prisma] Configured Prisma datasource provider: ${targetProvider}`);
}

preparePrisma();
