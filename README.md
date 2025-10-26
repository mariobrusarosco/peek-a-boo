# Peek-a-boo Feature Flag Service

A modern, scalable feature flag management platform that helps teams deploy features safely and efficiently.

SDK Client hosted at https://github.com/peek-a-boo/peek-a-boo-client-sdk
Dashboard hosted at https://peek-a-boo-dashboard.vercel.app/
SDK Service hosted at https://github.com/peek-a-boo/peek-a-boo-sdk-service

## Overview

This platform provides:

- 🚀 **Feature Flag Management**: Create, update, and manage feature flags through an intuitive dashboard
- 🔄 **Real-time Updates**: Changes to feature flags are propagated in real-time to connected applications
- 🌐 **Lightweight SDK**: A minimal JavaScript SDK that can be integrated into any web application
- 📊 **Analytics**: Track feature flag usage and impact
- 👥 **Multi-tenant**: Support for multiple organizations and teams

## Architecture

```
Legend:
⟶ : imports/uses
⟹ : communicates with API

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│    Dashboard    │     │   SDK Service   │     │   Client App    │
│   (Next.js)     │     │    (NestJS)     │     │                 │
│  localhost:3000 │     │ localhost:6001  │     │                 │
│                 │     │                 │     │                 │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │                       │                       │
         │                       │                       │
         │                       │                       ↓
         │                       │                  ┌─────────────┐
         │                       │                  │             │
         │                       ◀─────────────────┐│ Client SDK  │
         │                       │    API calls     │  (Library)  │
         │                       │                  │             │
         │                       │                  └─────────────┘
         │                       │
         │                       │
┌────────┴───────────────────────┴───────────────────────────────────┐
│                                                                    │
│                         PostgreSQL Database                        │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
                               ▲
                               │
                      ┌────────┴────────┐
                      │                 │
                      │ Shared Package  │
                      │                 │
                      └─────────────────┘
```

## Project Structure

This is a monorepo containing:

- **Dashboard**: A Next.js application for the admin interface (`apps/dashboard`)
- **SDK Service**: A NestJS application for SDK delivery and WebSockets (`apps/sdk-service`)
- **Core**: Shared code and database schema (`packages/core`)
- **Client SDK**: The JavaScript SDK for clients (`packages/client-sdk`)

### Database Architecture

Our database architecture follows a centralized approach:

- **Central Management**: The database schema and client are managed through the `@peek-a-boo/core` package
- **Unified Access**: All services (dashboard, sdk-service, client-sdk) access the same database through this shared package
- **Prisma ORM**: We use Prisma for type-safe database access and migrations
- **PostgreSQL**: Our primary database is PostgreSQL, supporting complex relationships and transactions

This architecture provides several benefits:
- Single source of truth for database schema
- Consistent data access patterns across services
- Centralized migration management
- Type-safe database queries

## Getting Started

### Prerequisites

- Node.js v18+
- pnpm v8+
- Docker and Docker Compose

### First-Time Setup

1. **Clone the repository**

```bash
git clone [repository-url]
cd peek-a-boo
```

2. **Install all dependencies**

```bash
pnpm install
```
or you can install `pnpm` with Volta

*Install Volta*

Unix
```bash
curl https://get.volta.sh | bash 
```

Windows
```bash
winget install Volta.Volta
```   

Install pnpm
```bash
volta install pnpm
```

3. **Start the development database**

```bash
docker compose up -d
```

4. **Set up environment variables**

Create the `.env` file for the core package:

```bash
# Create packages/core/.env
cat > packages/core/.env << EOF
DATABASE_URL="postgresql://postgres:postgres@localhost:5438/feature_flags_dev"
DATABASE_DIRECT_URL="postgresql://postgres:postgres@localhost:5438/feature_flags_dev"
EOF
```

You can also copy from the example file:
```bash
cp packages/core/.env.example packages/core/.env
# Then add DATABASE_DIRECT_URL to the file
```

5. **Initialize the database**

```bash
pnpm run prisma:migrate:dev
```

6. **Seed the database** (optional, but recommended for first-time setup)

```bash
pnpm run prisma:seed
```

This will create sample users, projects, organizations, and feature flags. Login credentials:
- **Email**: `admin@peek-a-boo.dev`
- **Password**: `password123`

7. **Build the core package** (required before running dev servers)

```bash
pnpm build:core
```

This step is critical for the monorepo - all other packages depend on the core package being built first.

### Running the Applications

Start all applications in development mode:

```bash
pnpm dev
```

Or run them individually:

```bash
# Run the dashboard
pnpm dev:dashboard

# Run the SDK service
pnpm dev:sdk-service

# Build the client SDK in watch mode
pnpm dev:client-sdk
```

When running `pnpm dev`:
- The dashboard will be available at http://localhost:3000
- The SDK service will be available at http://localhost:6001
- The client SDK is not a server; it builds the library in watch mode for use in applications

## Development Workflow

For a comprehensive guide on development workflows, see our [Developer Workflow Guide](docs/guides/004-developer-workflow.md).

### Common Commands

```bash
# Build all packages
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format
```

### Database Management

Use Prisma Studio to view and edit your database:

```bash
pnpm --filter=@peek-a-boo/core prisma:studio
```

This will open Prisma Studio at http://localhost:5555.

For a comprehensive guide on database setup and management, see our [Database Setup Guide](docs/guides/005-database-setup.md).

### Running Migrations

After making changes to the Prisma schema:

```bash
pnpm run prisma:migrate:dev
```

## Troubleshooting

We maintain documentation on common issues and their fixes in the `@docs/fixing-history` directory:

- [Client SDK TypeScript Declaration Bundling](@docs/fixing-history/001-client-sdk-typescript-declaration-bundling.md)
- [Next.js Lucide React Dependency Resolution](@docs/fixing-history/002-next-js-lucide-dependency-resolution.md)
- [Client SDK Module Type Configuration](@docs/fixing-history/003-client-sdk-module-type-configuration.md)

These documents can help you understand and fix common issues that you might encounter while working with this monorepo.

## Documentation

For more detailed documentation, see:

- [Project Phases and Planning](planning/00-project-phases.md)
- [Architecture Decisions](docs/decision/)
- [Architecture Diagrams](docs/architecture-diagrams.md)
- [Developer Guides](docs/guides/)
   - [Development Environment](docs/guides/001-development-environment.md)
   - [Database Schema](docs/guides/002-database-schema.md)
   - [Developer Workflow](docs/guides/004-developer-workflow.md)
   - [Database Setup and Interaction](docs/guides/005-database-setup.md)
   - [CI/CD Pipeline](docs/guides/006-ci-cd-pipeline.md)
   - [Environment Variables Setup](docs/guides/007-environment-variables-setup.md)
   - [Railway Deployment Setup](docs/guides/008-railway-deployment-setup.md)
   - [React 19 Server Components Guide](docs/guides/011-react-19-server-components-guide.md)
   - [API Architecture Guide](docs/guides/012-api-architecture.md) ⭐ **New!**

## License

This project is licensed under the [MIT License](LICENSE). 