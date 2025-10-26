# ADR 002: Hybrid Architecture Approach

## Date
2023-09-20

## Status
Accepted

## Context
Building a Feature Flag SaaS platform requires both an admin dashboard for configuration and a high-performance delivery system for serving feature flags to client applications. These two components have different performance characteristics, scaling needs, and implementation requirements.

Many teams choose either a fully-integrated approach (everything in Next.js) or a completely separate approach (separate frontend and backend codebases). Both approaches have significant drawbacks for our specific use case.

## Decision Drivers
- Need for real-time capabilities (WebSockets) for flag updates
- Different performance profiles for dashboard vs. SDK serving
- Future scalability requirements
- Development velocity
- Operational complexity management

## Problem Statement
Next.js API Routes are excellent for simple CRUD operations but have limitations:

1. **WebSocket Limitations**: Next.js API Routes on serverless platforms have timeouts (typically 10-30 seconds), making them unsuitable for persistent WebSocket connections.

2. **Cold Starts**: Serverless functions can experience cold starts, impacting performance for the SDK which needs to be consistently fast.

3. **Limited Background Processing**: Long-running tasks or background processes are difficult to implement.

4. **Scaling Characteristics**: Serverless functions scale differently than traditional services, which can impact performance during high load.

However, building completely separate frontend and backend systems from the start introduces unnecessary complexity and slows down initial development.

## Decision
We will implement a hybrid architecture that uses:

1. **Next.js with API Routes** for:
   - Admin dashboard UI
   - Dashboard-related API operations (user management, flag configuration)
   - Authentication for dashboard users

2. **NestJS as a dedicated service** for:
   - WebSocket connections for real-time flag updates
   - Serving the JavaScript SDK to client applications
   - High-performance flag evaluation endpoints
   - Analytics data collection

3. **Shared Code and Clear Boundaries**:
   - Business logic will be structured for potential extraction
   - Authentication will be coordinated between services
   - Clear ownership of data and operations

## Detailed Architecture

```
┌─────────────────────────────────────┐     ┌─────────────────────────────────┐
│         Next.js Application         │     │        NestJS Application        │
│                                     │     │                                  │
│  ┌─────────────┐   ┌─────────────┐  │     │  ┌─────────────┐  ┌───────────┐ │
│  │  Dashboard  │   │ API Routes  │  │     │  │ SDK Serving │  │ WebSocket │ │
│  │     UI      │   │  (Admin)    │  │     │  │  Endpoints  │  │  Server   │ │
│  └─────────────┘   └─────────────┘  │     │  └─────────────┘  └───────────┘ │
│                                     │     │                                  │
│  ┌─────────────────────────────┐    │     │  ┌───────────────────────────┐  │
│  │        Business Logic        │◄───┼─────┼─►│      Business Logic       │  │
│  │  (Dashboard Operations)      │    │     │  │  (Flag Delivery/Updates)  │  │
│  └─────────────────────────────┘    │     │  └───────────────────────────┘  │
└─────────────────────────────────────┘     └─────────────────────────────────┘
                   ▲                                         ▲
                   │                                         │
                   │                                         │
                   ▼                                         ▼
            ┌────────────────────────────────────────────────────┐
            │                     Database                        │
            │                   (PostgreSQL)                      │
            └────────────────────────────────────────────────────┘
                                    ▲
                                    │
                                    ▼
                        ┌─────────────────────┐
                        │    Client Website   │
                        │  ┌───────────────┐  │
                        │  │ Feature Flag  │  │
                        │  │     SDK       │  │
                        │  └───────────────┘  │
                        └─────────────────────┘
```

## Communication Between Services

The two services will communicate in the following ways:

1. **Database as Source of Truth**:
   - Both services read from the same database
   - Flag configurations stored in PostgreSQL
   - Clear ownership of write operations

2. **Authentication Coordination**:
   - JWT tokens used across services
   - Same secret/keys for validation
   - Scoped permissions based on service

3. **Event-Based Communication** (future):
   - Message queue for asynchronous operations
   - Event sourcing for key state changes

## Implementation Strategy

We will implement this architecture incrementally:

1. **Phase 1**: Setup Next.js dashboard with basic flag management
2. **Phase 2**: Implement NestJS service for SDK delivery
3. **Phase 3**: Add WebSocket support to NestJS service
4. **Phase 4**: Implement real-time updates between services
5. **Phase 5**: Optimize for performance and scale

## Code Organization

### Next.js Project Structure

```
src/
├── pages/          # Page components and API routes
│   ├── api/        # API routes for dashboard operations
│   └── ...         # Dashboard UI pages
├── components/     # UI components
├── hooks/          # React hooks
├── server/         # Server-side code (extractable)
│   ├── services/   # Business logic
│   ├── models/     # Domain models
│   ├── db/         # Database access
│   └── utils/      # Utilities
└── utils/          # Shared utilities
```

### NestJS Project Structure

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

## Rationale

This hybrid approach provides several advantages:

1. **Optimized for Different Workloads**:
   - Dashboard UI and admin operations through Next.js
   - High-performance SDK delivery and WebSockets through NestJS

2. **Faster Initial Development**:
   - Start with familiar Next.js patterns for dashboard
   - Add NestJS for specialized needs without rewriting everything

3. **Clean Migration Path**:
   - Well-structured code can be migrated as needed
   - No need for big-bang rewrites

4. **Appropriate Tools for Each Job**:
   - Next.js excels at UI and simple API operations
   - NestJS excels at complex API architecture and WebSockets

5. **Balanced Complexity**:
   - More complex than a monolith but simpler than microservices
   - Appropriate for a startup needing balance between speed and scalability

## Consequences

### Positive
- Proper architecture for WebSockets from the start
- No future migration pain for critical paths
- Better performance for SDK data delivery
- More appropriate tooling for specific tasks
- Clear separation of concerns

### Negative
- Managing two services instead of one
- Need to coordinate deployments
- Potential for divergence in patterns between services
- Need to manage authentication across services

### Neutral
- Need for more comprehensive documentation
- Slightly steeper learning curve for new team members
- More complex local development setup

## Implementation Notes
- We will use environment variables for service coordination
- We will implement consistent logging across services
- We will use Docker for local development to simplify setup
- We will establish CI/CD pipelines for both services 