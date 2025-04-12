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

2. **Setup shared package first**

The shared package needs to be built first as other packages depend on it:

```bash
# Create .env file for the shared package
cp packages/shared/.env.example packages/shared/.env

# Build the shared package
pnpm --filter @peek-a-boo/shared install
pnpm --filter @peek-a-boo/shared build
```

3. **Install all dependencies**

Now you can install all dependencies:

```bash
pnpm install
```

4. **Start the development database**

```bash
docker-compose up -d
```

5. **Initialize the database**

```bash
pnpm run prisma:migrate:dev --workspace=packages/shared
```

### Running the Applications

Start both applications in development mode:

```bash
pnpm run dev
```

Or run them individually:

```bash
# Run the dashboard
pnpm run dev --workspace=apps/dashboard

# Run the SDK service
pnpm run dev --workspace=apps/sdk-service
```

- The dashboard will be available at http://localhost:3000
- The SDK service will be available at http://localhost:3001

## Development Workflow

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
- [Developer Guides](docs/dx/)

## License

This project is licensed under the [MIT License](LICENSE). 