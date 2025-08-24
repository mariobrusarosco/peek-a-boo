# @peek-a-boo/core

Shared code, types, and database schema for the Peek-a-boo feature flag system.

## Setup

1. Create a `.env` file in this directory:

```bash
cp .env.example .env
```

2. Update the `.env` file with your database connection string.

3. Initialize the database:

```bash
# From the root of the monorepo
pnpm run prisma:migrate:dev --workspace=packages/core
```

4. Generate Prisma client:

```bash
# From the root of the monorepo
pnpm run prisma:generate --workspace=packages/core
```

## Usage

This package exports:

- Prisma client for database access
- TypeScript types for the feature flag system
- Shared utilities for SDK and dashboard

Import it in other workspace packages:

```typescript
import { prisma, FlagContext, FlagEvaluationResponse } from '@peek-a-boo/core';
```

## Development

After making changes to the database schema:

1. Create a migration:

```bash
pnpm run prisma:migrate:dev --workspace=packages/core
```

2. Rebuild the package:

```bash
pnpm run build --workspace=packages/core
``` 