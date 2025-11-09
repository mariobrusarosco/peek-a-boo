# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

*IMPORTANT*

Custom Commands you need to watch:

* "Brace for Compact" - Refer to section "Pre and Post Auto-Compact"
* "Write a Topic" - Refer to section "Create a Garden Topic"

## Pre and Post Auto-Compact
Claude Code CLI auto-compacts conversations due context limitations, it generates a summary that's not the same.
We kind of lose the most crucial converation parts. 

Your job is to: 
1. Summarize the WHOLE conversation 
2. Add the summary as a new entry on the `CLAUDE_COMPACTED_HISTORY.md` 

## Create a Garden Topic
To create a Garnde Topic, you need to access the project named `garden`.
You should have context to it because the engineer must have already added the project via Claude's `/add-dir` command.
Your job is to understand how to create a new topic via .mdx file over there. 
Ask me which part of our work should you focus with. I'll tell you what the name of the topic.
No need to do anything else on that project. 

## Project Overview

Peek-a-boo is a modern feature flag management platform built as a Turborepo monorepo. The platform consists of a Next.js dashboard, NestJS SDK service, and a JavaScript client SDK, all sharing a centralized database schema through the shared package.

## Architecture

- **Dashboard** (`apps/dashboard`): Next.js application for feature flag management UI
- **SDK Service** (`apps/sdk-service`): NestJS backend API for SDK delivery and WebSockets
- **Client SDK** (`packages/client-sdk`): JavaScript library for client applications
- **Core** (`packages/core`): Common database schema, Prisma client, and shared utilities

## Development Commands

### Critical Setup Sequence
```bash
# 1. Install dependencies
pnpm install

# 2. Build shared package FIRST (critical for monorepo)
pnpm build:core

# 3. Start development database
docker-compose up -d

# 4. Setup environment variables (see Environment section)
# Copy .env.example files in each package:
# - apps/dashboard/.env.local
# - apps/sdk-service/.env  
# - packages/core/.env

# 5. Run database migrations
pnpm run prisma:migrate:dev

# 6. Generate Prisma client (automatically runs via postinstall hook)
# If needed manually: pnpm --filter=@peek-a-boo/core prisma:generate
```

### Development
```bash
# Start all services in development mode
pnpm dev

# Start individual services
pnpm dev:dashboard     # Next.js dashboard at localhost:3000
pnpm dev:sdk-service   # NestJS API at localhost:6001
pnpm dev:client-sdk    # Build client SDK in watch mode
```

### Building and Testing
```bash
# Build all packages (shared must be built first)
pnpm build

# Build specific packages with dependencies
pnpm build:dashboard --filter=@peek-a-boo/dashboard...
pnpm build:sdk-service --filter=@peek-a-boo/sdk-service...
pnpm build:client-sdk
pnpm build:core

# Turborepo specific commands
turbo run build --force           # Ignore cache
turbo run build --dry-run         # See what would run
rm -rf .turbo                     # Clear Turborepo cache

# Run tests
pnpm test
pnpm test:dashboard
pnpm test:sdk-service
pnpm test:client-sdk

# Type checking (dashboard)
pnpm run lint:types --filter=@peek-a-boo/dashboard

# Linting and formatting
pnpm lint
pnpm format
```

### Database Management
```bash
# Open Prisma Studio (localhost:5555)
pnpm --filter=@peek-a-boo/core prisma:studio

# Run migrations in development
pnpm run prisma:migrate:dev

# Deploy migrations to production
pnpm run prisma:migrate:deploy

# Seed database
pnpm run prisma:seed

# Generate Prisma client
pnpm --filter=@peek-a-boo/core prisma:generate

# Generate ERD diagram
pnpm --filter=@peek-a-boo/core prisma:erd
```

## Key Architecture Patterns

### Database Architecture
- **Centralized Schema**: All database models are defined in `packages/core/prisma/schema.prisma`
- **Shared Client**: All applications access the database through `@peek-a-boo/core`
- **Type Safety**: Prisma generates TypeScript types shared across all packages

### Domain-Driven Structure
Both dashboard and sdk-service follow domain-based organization:
- `src/domains/`: Feature-specific modules (projects, auth, ui-system)
- Each domain contains: components/, services/, dto/ (for NestJS), etc.

### Import Patterns
- Use type imports: `import type { Project } from "@peek-a-boo/core"`
- Workspace dependencies: `"@peek-a-boo/core": "workspace:*"`

## Technology Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS, Shadcn UI (Radix-based), next-themes
- **Backend**: NestJS, Prisma ORM, PostgreSQL, Socket.io
- **Build System**: Turborepo with pnpm workspaces
- **Development**: TypeScript, ESLint, Prettier
- **Authentication**: NextAuth.js (dashboard), JWT (API)
- **Hosting**: Vercel (dashboard), Railway (SDK service), Supabase (database)

## Deployment

- **Dashboard**: Deployed to Vercel via `pnpm deploy:dashboard`
- **SDK Service**: Deployed to Railway via `pnpm deploy:sdk-service`

## Development Guidelines

### File Naming
- Use kebab-case for all files
- Example: `create-project-button.tsx`, `project-list-container.tsx`

### TypeScript Imports
- Always use type imports for types: `import type { Project } from "@peek-a-boo/core"`
- Use workspace dependencies: `"@peek-a-boo/core": "workspace:*"`

### Database Changes
1. Modify `packages/core/prisma/schema.prisma`
2. Run `pnpm run prisma:migrate:dev --workspace=packages/core`
3. The migration will automatically generate the Prisma client

### Testing Strategy
- Dashboard: Uses Jest
- SDK Service: Uses Jest with NestJS testing utilities
- Client SDK: Uses Jest with Rollup builds

## Environment Variables

Critical environment variables must be configured for each package and listed in `turbo.json` for builds:

```bash
# Required for builds (must be in turbo.json env array)
DATABASE_URL=postgresql://postgres:postgres@localhost:5438/feature_flags_dev
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret
NEXT_PUBLIC_SDK_SERVICE_URL=http://localhost:6001

# Production variables
SUPABASE_PROJECT_ID=your_project_id
SUPABASE_DB_PASSWORD=your_password
```

Environment files needed:
- `apps/dashboard/.env.local`
- `apps/sdk-service/.env`  
- `packages/core/.env`

### Local Development Database
The PostgreSQL database runs on port 5438 (not default 5432) via Docker Compose.

## Common Issues & Solutions

### PNPM/Module Resolution Issues
```bash
# Fix lucide-react and similar dependency issues
# Add to .npmrc:
public-hoist-pattern[]=lucide-react

# Clean reinstall
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm install
```

### Turborepo Build Issues
- Environment variables MUST be listed in `turbo.json` `env` array
- Always build shared package before others: `pnpm build:core`
- Use `--force` flag to bypass cache when needed
- Clear cache with `rm -rf .turbo`

### TypeScript/ESM Module Issues
- Client SDK uses ESM: add `"type": "module"` to package.json
- For JSON imports in ESM: use `readFileSync` + `JSON.parse`
- Run `generate-dts` before client SDK watch mode

### Database Connection Issues
- Ensure PostgreSQL is running: `docker-compose up -d`
- Database runs on port 5438 (not default 5432)
- Verify DATABASE_URL in environment files
- Run migrations: `pnpm run prisma:migrate:dev --workspace=packages/core`

### Client SDK Issues
- Client SDK uses ESM: requires `"type": "module"` in package.json
- Run `generate-dts` before client SDK watch mode
- For JSON imports in ESM: use `readFileSync` + `JSON.parse`

### Detailed Solutions
Check `docs/fixing-history/` directory for comprehensive solutions to specific issues:
- Client SDK TypeScript declaration bundling
- Next.js Lucide dependency resolution  
- Build dependency fixes
- Vercel deployment configurations