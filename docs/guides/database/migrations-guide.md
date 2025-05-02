# Database Migrations Guide

## Overview

Database migrations are a way to evolve your database schema over time. In Peek-a-boo, we use Prisma Migrate to handle schema changes in a version-controlled, predictable manner.

This guide explains how to create, apply, and manage migrations after making changes to the Prisma schema.

## Migration Workflow

### 1. Update the Prisma Schema

First, modify the `schema.prisma` file in `packages/shared/prisma/` to reflect your desired changes:

```prisma
// Example: Adding a new field to the Project model
model Project {
  id          String   @id @default(cuid())
  name        String
  description String?  // New field added
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### 2. Generate a Migration

After modifying the schema, create a migration:

```bash
# Navigate to the shared package
cd packages/shared

# Generate the Prisma client first (required)
pnpm prisma:generate

# Generate a migration with a descriptive name
pnpm prisma migrate dev --name added_project_description
```

This command:
- Compares your current schema to the database
- Creates a new migration file in `prisma/migrations/`
- Applies the migration to your development database
- Regenerates the Prisma Client

> **Important**: Always run `prisma:generate` before running migrations or seed scripts to ensure the Prisma client is properly initialized. Without this step, you may encounter errors.

### 3. Review the Migration

Examine the generated SQL in the migration file to ensure it matches your expectations:

```sql
-- Example migration file: 20250503123456_added_project_description/migration.sql
ALTER TABLE "projects" ADD COLUMN "description" TEXT;
```

### 4. Commit the Migration

Commit both your schema changes and the generated migration files to version control:

```bash
git add packages/shared/prisma/schema.prisma
git add packages/shared/prisma/migrations/
git commit -m "Add description field to Project model"
```

## Common Migration Tasks

### Adding a New Model

```prisma
model Feature {
  id        String   @id @default(cuid())
  name      String
  enabled   Boolean  @default(false)
  projectId String
  project   Project  @relation(fields: [projectId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("features")
}
```

### Adding a Relation

```prisma
model Project {
  // Existing fields...
  features Feature[] // Add this line
}
```

### Making a Field Optional or Required

```prisma
model User {
  // Change from required to optional
  name String? // Add the question mark
  
  // Change from optional to required (remove the question mark)
  email String
}
```

### Adding an Index

```prisma
model Project {
  // Existing fields...
  
  @@index([name]) // Add an index on the name field
}
```

## Special Migration Scenarios

### 1. Resetting Development Database

If you need to start fresh:

```bash
pnpm prisma migrate reset
```

This will:
- Drop and recreate the database
- Apply all migrations
- Run the seed script

### 2. Handling Migration Conflicts

If you encounter conflicts when multiple developers create migrations:

1. Pull the latest migrations from the repository
2. Reset your local database: `pnpm prisma migrate reset`
3. Make your schema changes
4. Generate a new migration

### 3. Squashing Migrations

For large projects with many migrations, you can squash them:

```bash
# Create a SQL dump of your current database
pg_dump -s -x -O -f current_schema.sql postgresql://postgres:postgres@localhost:5438/feature_flags_dev

# Delete old migration files
rm -rf packages/shared/prisma/migrations/*

# Create a new baseline migration
pnpm prisma migrate dev --name init
```

## Production Deployments

For production environments:

```bash
pnpm prisma migrate deploy
```

This command:
- Applies pending migrations without generating new ones
- Does not reset the database or run the seed script
- Is safe to run in CI/CD pipelines

## Troubleshooting

### Migration Failed to Apply

If a migration fails:

1. Check the error message for specific issues
2. Fix the schema or manually adjust the migration SQL
3. Try applying the migration again
4. If needed, use `prisma db push` to force schema changes (development only)

### Drift Detected

If you see "drift detected" errors:

1. Your database schema has been modified outside of Prisma Migrate
2. Use `prisma migrate diff` to see the differences
3. Create a migration to align the schema with the database

## Best Practices

1. **Use descriptive migration names** that explain what changed
2. **One change per migration** for clarity and easier rollbacks
3. **Test migrations** on a staging environment before production
4. **Never edit an existing migration** that has been applied or committed
5. **Include migrations in code reviews** to catch potential issues early
6. **Back up your database** before applying migrations in production

## Resources

- [Prisma Migrate Documentation](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Migration Examples](https://www.prisma.io/docs/guides/migrate)
