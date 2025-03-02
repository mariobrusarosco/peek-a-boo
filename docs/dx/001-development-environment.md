# Development Environment Setup

This guide will help you set up your local development environment for the Feature Flag SaaS platform.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or later)
- **PNPM** (v8 or later)
- **Docker** and **Docker Compose** (for local database and services)
- **Git**

If you don't have PNPM installed, you can install it with:

```bash
npm install -g pnpm
```

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
│   └── client-sdk/      # The JavaScript SDK for clients
├── docs/
│   ├── decision/        # Architectural Decision Records
│   └── dx/              # Developer Experience guides
├── docker-compose.yml   # Local development services
├── pnpm-workspace.yaml  # PNPM workspace configuration
└── package.json         # Root package.json for workspaces
```

## Initial Setup

1. **Clone the repository**

```bash
git clone [repository-url]
cd feature-flag-saas
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

Copy the example environment files:

```bash
cp apps/dashboard/.env.example apps/dashboard/.env.local
cp apps/sdk-service/.env.example apps/sdk-service/.env
```

Edit the environment files with your local settings.

4. **Start the development database**

```bash
docker-compose up -d postgres
```

5. **Run database migrations**

```bash
pnpm run db:migrate
```

## Running the Applications

### Dashboard (Next.js)

```bash
# From the root directory
pnpm run dev:dashboard

# Or from the dashboard directory
cd apps/dashboard
pnpm run dev
```

The dashboard will be available at http://localhost:3000.

### SDK Service (NestJS)

```bash
# From the root directory
pnpm run dev:sdk-service

# Or from the sdk-service directory
cd apps/sdk-service
pnpm run start:dev
```

The SDK service will be available at http://localhost:3001.

## Development Workflow

### Running Both Services

We've provided a convenience script to run both services simultaneously:

```bash
pnpm run dev
```

This will start both the dashboard and SDK service in development mode.

### Database Management

#### Prisma Studio

You can use Prisma Studio to view and edit your database:

```bash
pnpm run prisma:studio
```

This will open Prisma Studio at http://localhost:5555.

#### Running Migrations

After making changes to the Prisma schema:

```bash
pnpm run prisma:migrate:dev
```

### Working with Workspaces

PNPM workspaces make it easy to work with packages in the monorepo:

```bash
# Install dependencies across all workspaces
pnpm install

# Add a dependency to a specific workspace
pnpm --filter packages/shared add @types/node --save-dev

# Run a command in a specific workspace
pnpm --filter apps/dashboard test
```

### Testing

#### Running Tests

```bash
# Run all tests
pnpm test

# Run dashboard tests
pnpm run test:dashboard

# Run SDK service tests
pnpm run test:sdk-service
```

## Code Quality Tools

### Linting

```bash
# Lint all code
pnpm run lint

# Lint dashboard code
pnpm run lint:dashboard

# Lint SDK service code
pnpm run lint:sdk-service
```

### Formatting

```bash
# Format all code
pnpm run format
```

## Debugging

### Dashboard (Next.js)

1. Start the dashboard in debug mode:

```bash
pnpm run dev:dashboard:debug
```

2. Use Chrome DevTools or VS Code debugger to connect to `localhost:9229`.

### SDK Service (NestJS)

1. Start the SDK service in debug mode:

```bash
pnpm run dev:sdk-service:debug
```

2. Use Chrome DevTools or VS Code debugger to connect to `localhost:9230`.

## Common Issues and Solutions

### Database Connection Issues

If you encounter database connection issues:

1. Ensure Docker is running and the Postgres container is up:
```bash
docker ps | grep postgres
```

2. Check the database logs:
```bash
docker-compose logs postgres
```

3. Verify your `.env` files have the correct database connection strings.

### PNPM Workspace Issues

If you encounter issues with PNPM workspaces:

1. Try clearing the PNPM store:
```bash
pnpm store prune
```

2. Ensure your `pnpm-workspace.yaml` is correctly configured.

3. Run `pnpm install --force` to rebuild the dependencies.

### Port Conflicts

If you encounter port conflicts:

1. Check if the ports are already in use:
```bash
lsof -i :3000
lsof -i :3001
```

2. Adjust the ports in your `.env` files if needed.

## Next Steps

After setting up your development environment, check out the following guides:

- [Working with the Next.js Dashboard](/docs/dx/002-nextjs-dashboard.md)
- [Working with the NestJS SDK Service](/docs/dx/003-nestjs-sdk-service.md)
- [Authentication Overview](/docs/dx/004-authentication.md)
- [Database Schema and Models](/docs/dx/005-database-schema.md) 