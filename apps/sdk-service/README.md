# @peek-a-boo/sdk-service

Backend service for SDK delivery and WebSocket connections for the Peek-a-boo feature flag system.

## Features

- Feature flag evaluation API endpoints
- WebSocket connections for real-time flag updates
- SDK delivery
- Analytics collection

## Setup

1. Create a `.env` file in this directory:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
# From the root of the monorepo
pnpm install
```

3. Start the development server:

```bash
# From the root of the monorepo
pnpm run dev --workspace=apps/sdk-service
```

The service will be available at http://localhost:3001.

## Development

### Structure

```
src/
├── main.ts                # Application entry point
├── app.module.ts          # Main module
├── sdk/                   # SDK delivery
│   ├── sdk.controller.ts  # SDK endpoints
│   ├── sdk.service.ts     # SDK business logic
│   └── sdk.module.ts      # SDK module
├── websocket/             # WebSocket handling
│   ├── events.gateway.ts  # WebSocket gateway
│   └── events.module.ts   # WebSocket module
├── flags/                 # Flag evaluation
│   ├── flags.controller.ts # Flag endpoints
│   ├── flags.service.ts   # Flag business logic
│   └── flags.module.ts    # Flag module
└── shared/                # Shared code
    ├── auth/              # Authentication
    └── utils/             # Utilities
```

### Adding Modules

To add a new module:

```bash
pnpm nest generate module module-name
pnpm nest generate controller module-name
pnpm nest generate service module-name
``` 