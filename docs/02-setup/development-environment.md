# Development Environment Setup

This guide will help you set up your local development environment for the Peek-a-boo feature flag platform, avoiding common issues with workspace dependencies.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or later)
- **pnpm** (v8 or later)
- **Docker** and **Docker Compose** (for local database and services)
- **Git**

## Repository Structure

Our project consists of two main parts:

1. **Dashboard**: A Next.js application for the admin interface
2. **SDK Service**: A NestJS application for SDK delivery and WebSockets

Both are contained within this monorepo structure:

```
.
├── apps/
│   ├── dashboard/       # Next.js application
│   └── sdk-service/     # NestJS application
├── packages/
│   ├── shared/          # Shared code between applications
│   └── client-sdk/      # The JavaScript SDK for clients (coming soon)
├── docs/
│   ├── decision/        # Architectural Decision Records
│   └── dx/              # Developer Experience guides
├── planning/            # Project planning documents
├── docker-compose.yml   # Local development services
└── package.json         # Root package.json for workspaces
```

## Initial Setup

### 1. Clone the Repository

```bash
git clone [repository-url]
cd peek-a-boo
```

### 2. Important: Setup the Shared Package First

The most common issue when setting up this project is the dependency on the shared package. Since other packages depend on `@peek-a-boo/shared`, we need to set it up first:

```bash
# Create .env file for the shared package
cp packages/shared/.env.example packages/shared/.env

# Install dependencies for the shared package only
pnpm --filter @peek-a-boo/shared install

# Build the shared package
pnpm --filter @peek-a-boo/shared build
```

### 3. Install All Dependencies

Now that the shared package is built, you can install all dependencies:

```bash
pnpm install
```

> **Troubleshooting**: If you see errors like `ERR_PNPM_FETCH_404 GET https://registry.npmjs.org/@peek-a-boo%2Fshared: Not Found - 404`, it means you need to build the shared package first as described in step 2.

### 4. Start the Development Database

```bash
docker-compose up -d
```

This will start PostgreSQL and Redis containers.

### 5. Initialize the Database

```bash
# Create tables and run migrations
pnpm run prisma:migrate:dev --workspace=packages/shared
```

### 6. Configure Application Environment Variables

```bash
# Dashboard
cp apps/dashboard/.env.example apps/dashboard/.env.local

# SDK Service
cp apps/sdk-service/.env.example apps/sdk-service/.env
```

## Running the Applications

### Start Both Applications

```bash
# From the root directory
pnpm run dev
```

This will start both the dashboard and SDK service in development mode.

### Or Start Each Application Individually

```bash
# Start the dashboard
pnpm run dev --workspace=apps/dashboard

# Start the SDK service
pnpm run dev --workspace=apps/sdk-service
```

- The dashboard will be available at http://localhost:3000
- The SDK service will be available at http://localhost:3001

## Development Workflow

### Database Management

#### Using Prisma Studio

Prisma Studio provides a visual interface for your database:

```bash
pnpm run prisma:studio --workspace=packages/shared
```

This will open Prisma Studio at http://localhost:5555.

#### Creating Migrations

After making changes to the Prisma schema:

```bash
pnpm run prisma:migrate:dev --workspace=packages/shared
```

### Rebuilding the Shared Package

If you make changes to the shared package, you need to rebuild it:

```bash
pnpm run build --workspace=packages/shared
```

### Working with Multiple Terminals

For the best development experience, we recommend using multiple terminal windows or tabs:

1. One for running the dashboard
2. One for running the SDK service
3. One for database tools and other commands

## Troubleshooting

### Common Issues

#### 1. Dependency Not Found Errors

If you see errors about `@peek-a-boo/shared` not being found in the registry, make sure you've built the shared package first:

```bash
pnpm --filter @peek-a-boo/shared install
pnpm --filter @peek-a-boo/shared build
```

#### 2. Database Connection Issues

Ensure your PostgreSQL container is running:

```bash
docker ps | grep postgres
```

Check that your `.env` files have the correct database connection strings.

#### 3. Port Conflicts

If you see errors about ports already being in use:

```bash
# Find what's using port 3000 (dashboard)
lsof -i :3000

# Find what's using port 3001 (SDK service)
lsof -i :3001
```

You can change the ports in the respective `.env` files.

## Next Steps

After setting up your development environment, check out the following resources:

- [Project Planning Overview](../../planning/00-project-phases.md)
- [Feature Flag Concepts](./002-feature-flag-concepts.md)
- [Database Schema Overview](./003-database-schema.md) 