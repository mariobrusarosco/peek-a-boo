# Database Setup and Interaction Guide

This guide provides comprehensive instructions for setting up, running, and interacting with the PostgreSQL database used in the Peek-a-Boo Feature Flag SaaS platform.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Database Setup](#local-database-setup)
3. [Database Schema](#database-schema)
4. [Prisma Studio](#prisma-studio)
5. [Common Tasks](#common-tasks)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Docker](https://www.docker.com/get-started) and Docker Compose
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [PNPM](https://pnpm.io/installation) (version 8.15.4 or higher)
- [PostgreSQL Client](https://www.postgresql.org/download/) (optional, for direct database access)

## Local Database Setup

### Option 1: Using Docker (Recommended)

1. **Start the PostgreSQL database container**:

   ```bash
   docker-compose up -d postgres
   ```

   This will start a PostgreSQL instance on port 5438.

2. **Environment Variables**:

   Ensure your local `.env` file contains the correct database connection string:

   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5438/feature_flags_dev?schema=public"
   ```

   This connection string matches the configuration in the `docker-compose.yml` file.

## Database Schema

Our database schema is managed using Prisma. You can find the schema definition in `packages/shared/prisma/schema.prisma`.

### Key Entities

The database schema includes the following key entities:

1. **Organizations**: Multi-tenant support with separate organizations
2. **Users**: User accounts with role-based permissions
3. **Projects**: Group related feature flags
4. **Environments**: Different deployment environments (dev, staging, prod)
5. **Flags**: The feature flags themselves
6. **FlagVariations**: Different values a flag can have
7. **FlagValues**: Environment-specific settings for flags
8. **FlagRules**: Targeting rules for flags

### Entity Relationships

- **Organizations** contain Users, Projects, Environments, and Flags
- **Projects** contain Flags and have ProjectMembers (Users)
- **Flags** have Variations and Values
- **FlagValues** connect Flags to Environments and have Rules

### Schema Diagram

For a visual representation of the database schema, you can generate an ERD (Entity Relationship Diagram) using the provided script:

```bash
# Navigate to the shared package
cd packages/shared

# Generate ERD diagram
pnpm prisma:erd
```

This will create an SVG diagram at `packages/shared/prisma-erd.svg` that you can open in any browser to visualize the database relationships.

To apply the schema to your database:

1. **Navigate to the shared package**:

   ```bash
   cd packages/shared
   ```

2. **Run migrations**:

   ```bash
   pnpm prisma migrate dev
   ```

   This command will apply all pending migrations and update your database schema.

## Prisma Commands

Our shared package includes several scripts to simplify working with Prisma:

```bash
# Navigate to the shared package
cd packages/shared

# Generate Prisma Client
pnpm prisma:generate

# Run migrations
pnpm prisma:migrate:dev

# Open Prisma Studio
pnpm prisma:studio
```

You can also use these commands through the workspace from the project root:

```bash
# Generate Prisma Client
pnpm --filter @peek-a-boo/shared prisma:generate

# Run migrations
pnpm --filter @peek-a-boo/shared prisma:migrate:dev

# Open Prisma Studio
pnpm --filter @peek-a-boo/shared prisma:studio
```

This allows you to run the commands from any directory in the project.

## Prisma Studio

[Prisma Studio](https://www.prisma.io/studio) is a visual editor for your database that allows you to view and edit data without writing SQL.

### Starting Prisma Studio

1. **Navigate to the shared package**:

   ```bash
   cd packages/shared
   ```

2. **Launch Prisma Studio**:

   ```bash
   pnpm prisma studio
   ```

3. **Access the UI**:

   Open your browser and navigate to [http://localhost:5555](http://localhost:5555)

### Using Prisma Studio

- **Browse Data**: Select models from the left sidebar
- **Filter and Sort**: Use the controls at the top of each table
- **Edit Records**: Click on any record to edit its values
- **Add Records**: Use the "Add record" button
- **Delete Records**: Select records and use the delete action

## Common Tasks

### Resetting the Database

To reset your database and start fresh:

```bash
cd packages/shared
pnpm prisma migrate reset
```

This will drop all tables, reapply migrations, and run seed scripts if available.

### Adding Test Data

You can seed your database with test data using:

```bash
cd packages/shared
pnpm prisma db seed
```

### Creating New Migrations

When making changes to the schema:

1. Edit `packages/shared/prisma/schema.prisma`
2. Generate a migration:

   ```bash
   cd packages/shared
   pnpm prisma migrate dev --name your_migration_name
   ```

## Troubleshooting

### Connection Issues

If you're having trouble connecting to the database:

1. **Check Docker Container**:

   ```bash
   docker ps
   ```

   Ensure the PostgreSQL container is running.

2. **Verify Connection Details**:

   ```bash
   psql -h localhost -U postgres -d feature_flags_dev
   ```

   Password: `postgres`

3. **Reset Docker Container**:

   ```bash
   docker-compose down -v
   docker-compose up -d postgres
   ```

### Schema Issues

If you encounter schema-related errors:

1. **Check Prisma Client Generation**:

   ```bash
   cd packages/shared
   pnpm prisma generate
   ```

2. **Reset Database Schema**:

   ```bash
   cd packages/shared
   pnpm prisma migrate reset --force
   ```

3. **Update Prisma Client**:

   ```bash
   pnpm install @prisma/client@latest
   ```

### Performance Issues

If the database is running slowly:

1. **Check Resources**:

   Ensure Docker has enough CPU and memory allocated.

2. **Optimize Queries**:

   Use Prisma's query optimization features like `select` and `include`.

3. **Set Up Indexes**:

   Add appropriate indexes to the schema for frequently queried fields. 