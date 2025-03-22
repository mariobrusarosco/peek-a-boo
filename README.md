# Feature Flag SaaS Platform

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

- **Dashboard**: A Next.js application for the admin interface
- **SDK Service**: A NestJS application for SDK delivery and WebSockets
- **Shared**: Shared code and database schema
- **Client SDK**: The JavaScript SDK for clients

## Getting Started

### Prerequisites

- Node.js v18+
- pnpm v8+
- Docker and Docker Compose

### Local Development

1. **Clone the repository**

```bash
git clone [repository-url]
cd feature-flag-saas
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Start the development environment**

```bash
docker-compose up -d
pnpm dev
```

4. Open the dashboard at http://localhost:3000

## Documentation

- [Development Environment Setup](/docs/dx/001-development-environment.md)
- [UI Components & Shadcn UI](/docs/dx/002-ui-components.md)
- [Architectural Decisions](/docs/decision/)
- [Developer Experience Guides](/docs/dx/)

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **UI Components**: Shadcn UI with Radix UI primitives
- **Backend**: NestJS, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis
- **Real-time**: WebSockets

## License

This project is licensed under the [MIT License](LICENSE). 