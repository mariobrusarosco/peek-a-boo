# Developer Workflow Guide

This document outlines the standard development workflow for the Peek-a-boo feature flag platform monorepo.

## Getting Started

Before starting development, make sure to install dependencies:

```bash
pnpm install
```

## Development Commands

### Running the Entire Platform

To run all applications and services simultaneously:

```bash
pnpm dev
```

This command starts:
- Dashboard application (Next.js)
- SDK service (NestJS)
- Client SDK (Rollup in watch mode)
- Shared package builds

### Running Individual Components

#### Dashboard Only

```bash
pnpm dev:dashboard
```

This starts the Next.js dashboard application on http://localhost:3000.

#### SDK Service Only

```bash
pnpm dev:sdk-service
```

This starts the NestJS SDK service on http://localhost:3001.

#### Client SDK Development

```bash
pnpm --filter @peek-a-boo/client-sdk dev
```

This starts Rollup in watch mode to build the client SDK as you make changes.

## Working with the Monorepo

### Making Changes to Shared Package

When making changes to the shared package, you need to build it for other packages to pick up the changes:

```bash
pnpm --filter @peek-a-boo/shared build
```

After building, restart your development servers to pick up the changes.

### Cross-Package Dependencies

Dependencies flow in this order:
1. `shared` - Base types and utilities
2. `client-sdk` - Depends on shared
3. `sdk-service` - Depends on shared
4. `dashboard` - Depends on shared

Always build dependent packages after making changes to their dependencies.

## Troubleshooting

### Module Resolution Issues

If you encounter module resolution issues:

1. Make sure all packages are installed: `pnpm install`
2. Try cleaning node_modules: `rm -rf node_modules apps/*/node_modules packages/*/node_modules && pnpm install`
3. Check that the `.npmrc` file has the correct hoisting patterns

### Port Conflicts

If you have port conflicts when running multiple services:

- Dashboard usually runs on port 3000
- SDK service usually runs on port 3001

You can modify these in the individual package configuration files.

## Testing

Run tests for all packages:

```bash
pnpm test
```

Run tests for a specific package:

```bash
pnpm --filter @peek-a-boo/dashboard test
```

## Building

Build all packages:

```bash
pnpm build
```

Build a specific package and its dependencies:

```bash
pnpm build:dashboard
pnpm build:sdk-service
```

## Common Development Scenarios

### "I only need to work on the dashboard"

```bash
# Terminal 1: Start the SDK service (required for the dashboard)
pnpm dev:sdk-service

# Terminal 2: Start the dashboard
pnpm dev:dashboard
```

### "I'm working on backend features only"

```bash
pnpm dev:sdk-service
```

### "I need to test the entire platform"

```bash
pnpm dev
``` 