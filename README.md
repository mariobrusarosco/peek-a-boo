# Peek-a-boo Feature Flag Service

A modern, scalable feature flag management platform that helps teams deploy features safely and efficiently.

## Overview

This platform provides:

- 🚀 **Feature Flag Management**: Create, update, and manage feature flags through an intuitive dashboard
- 🔄 **Real-time Updates**: Changes to feature flags are propagated in real-time to connected applications
- 🌐 **Lightweight SDK**: A minimal JavaScript SDK that can be integrated into any web application
- 📊 **Analytics**: Track feature flag usage and impact
- 👥 **Multi-tenant**: Support for multiple organizations and teams

## Project Structure

This is a monorepo containing:

- **Dashboard**: A Next.js application for the admin interface (`apps/dashboard`)
- **SDK Service**: A NestJS application for SDK delivery and WebSockets (`apps/sdk-service`)
- **Shared**: Shared code and database schema (`packages/shared`)
- **Client SDK**: The JavaScript SDK for clients (`packages/client-sdk`)

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

3. **Start the development database**

```bash
docker-compose up -d
```

4. **Initialize the database**

```bash
pnpm run prisma:migrate:dev --workspace=packages/shared
```

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

# Run the client SDK in watch mode
pnpm dev:client-sdk
```

- The dashboard will be available at http://localhost:3000
- The SDK service will be available at http://localhost:3001

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
pnpm run prisma:studio --workspace=packages/shared
```

This will open Prisma Studio at http://localhost:5555.

### Running Migrations

After making changes to the Prisma schema:

```bash
pnpm run prisma:migrate:dev --workspace=packages/shared
```

## Documentation

For more detailed documentation, see:

- [Project Phases and Planning](planning/00-project-phases.md)
- [Architecture Decisions](docs/decision/)
- [Developer Guides](docs/guides/)
   - [Development Environment](docs/guides/001-development-environment.md)
   - [Database Schema](docs/guides/002-database-schema.md)
   - [Developer Workflow](docs/guides/004-developer-workflow.md)

## License

This project is licensed under the [MIT License](LICENSE). 