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
│   └── dx/             # Developer Experience guides
├── docker-compose.yml   # Local development services
├── pnpm-workspace.yaml  # PNPM workspace configuration
├── turbo.json          # Turborepo configuration
└── package.json        # Root package.json for workspaces
```

## Build System

We use Turborepo as our build system orchestrator, which provides:
- Incremental builds
- Remote caching
- Parallel execution
- Task dependencies
- Workspace filtering

The build pipeline is defined in `turbo.json` and includes:
- `build`: Builds all packages and applications
- `dev`: Starts development servers
- `lint`: Runs linting across the codebase
- `test`: Runs tests with proper build dependencies

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

# Or using Turborepo directly
turbo run dev --filter=@peek-a-boo/dashboard
```

The dashboard will be available at http://localhost:3000.

### SDK Service (NestJS)

```bash
# From the root directory
pnpm run dev:sdk-service

# Or using Turborepo directly
turbo run dev --filter=@peek-a-boo/sdk-service
```

The SDK service will be available at http://localhost:3001.

## Development Workflow

### Dependency Management Best Practices

To ensure consistent builds across development and CI environments:

1. **After Dependency Changes**:
   ```bash
   # Always run after modifying package.json
   pnpm install
   ```
   This updates the lockfile to match your dependency changes.

2. **Version Control**:
   - Always commit both `package.json` and `pnpm-lock.yaml`
   - These files together ensure reproducible builds
   - Never gitignore the lockfile

3. **Local Verification**:
   ```bash
   # Use this to catch dependency mismatches early
   pnpm install --frozen-lockfile
   ```
   This simulates CI behavior and ensures your lockfile is up-to-date.

4. **Common Issues**:
   - If you see `ERR_PNPM_OUTDATED_LOCKFILE`, run `pnpm install`
   - If dependencies seem wrong, try `pnpm store prune` followed by `pnpm install`

### Running Both Services

We've provided a convenience script to run both services simultaneously:

```bash
pnpm run dev
```

This will start both the dashboard and SDK service in development mode using Turborepo's parallel execution.

### Building the Project

To build all applications and packages:

```bash
pnpm run build
```

This will execute the build pipeline defined in `turbo.json`, respecting dependencies between packages.

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

Our monorepo uses both PNPM workspaces and Turborepo for efficient package management:

```bash
# Install dependencies across all workspaces
pnpm install

# Add a dependency to a specific workspace
pnpm --filter @peek-a-boo/shared add @types/node --save-dev

# Run a command in a specific workspace
turbo run dev --filter=@peek-a-boo/dashboard
```

### Testing

#### Running Tests

```bash
# Run all tests
pnpm test

# Run dashboard tests
turbo run test --filter=@peek-a-boo/dashboard

# Run SDK service tests
turbo run test --filter=@peek-a-boo/sdk-service
```

## Code Quality Tools

### Linting

```bash
# Lint all code
pnpm run lint

# Lint specific workspace
turbo run lint --filter=@peek-a-boo/dashboard
```

### Formatting

```bash
# Format all code
pnpm run format
```

## Deployment

### Dashboard (Vercel)
The dashboard is configured for deployment on Vercel with proper monorepo settings in `apps/dashboard/vercel.json`.

### SDK Service
The SDK service should be deployed to a Node.js-compatible hosting platform that supports WebSocket connections.

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

### Turborepo Cache Issues

If you encounter cache-related issues:

1. Clear the Turborepo cache:
```bash
turbo clean
```

2. Verify your `turbo.json` configuration.

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