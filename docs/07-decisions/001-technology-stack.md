# ADR 001: Technology Stack Selection

## Date
<!-- When was this decision made -->
2025-03-02

## Status
Accepted

## Context
Our startup is building a Feature Flag SaaS platform, similar to LaunchDarkly. We need to select a technology stack that:

- Enables fast development of an MVP
- Provides a foundation for future scaling
- Supports both an admin dashboard and a client-side SDK
- Can handle real-time updates efficiently
- Is cost-effective for a startup

## Decision Drivers

- Development speed and time to market
- Future scalability requirements
- Need for real-time capabilities
- Multi-tenant design
- Developer experience and productivity

## Considered Options

### Frontend Frameworks

1. **Next.js with React**
2. Angular
3. Vue.js with Nuxt

### Backend Architecture

1. **Hybrid approach: Next.js API Routes + dedicated NestJS/Express service**
2. Full Next.js API Routes approach
3. Separate NestJS backend for everything
4. Express with TypeScript

### Database

1. **PostgreSQL with Prisma ORM**
2. MongoDB
3. DynamoDB

### Frontend Styling

1. **Tailwind CSS with Shadcn UI**
2. Material UI
3. Chakra UI

## Decision

We've decided to adopt a hybrid architecture:

### Frontend

- **Next.js with React** for the admin dashboard
- **TypeScript** for type safety
- **Tailwind CSS + Shadcn UI** for styling and components
- **TanStack Query** for data fetching and state management

### Backend (Hybrid Approach)

- **Next.js API Routes** for dashboard-related operations
- **NestJS** for the SDK serving infrastructure and WebSocket connections
- Structured with a clear separation between presentation and business logic

### Database

- **PostgreSQL** for reliable, relational data storage
- **Prisma ORM** for type-safe database access

### Authentication

- **NextAuth.js** for dashboard authentication
- **JWT-based authentication** for SDK/API authentication

### Hosting & Deployment

- **Vercel** for hosting the Next.js application
- **Railway** or similar for hosting the NestJS service
- **Supabase** or **Railway PostgreSQL** for database hosting

### Client SDK

- Vanilla JavaScript for a lightweight, framework-agnostic SDK
- Distributed via CDN

## Rationale

### Why Next.js for the Dashboard

- Excellent developer experience and fast development cycles
- Server-side rendering for good SEO and initial load performance
- Built-in API routes simplify dashboard CRUD operations
- Strong TypeScript integration
- Vercel deployment is optimized for Next.js

ps. We don't need SEO, so we can use SSR.

### Why NestJS for Real-Time/SDK Backend

- Better suited for WebSocket handling at scale
- Provides structured architecture for complex API services
- Excellent TypeScript support with decorators
- Dependency injection for cleaner, more testable code
- Designed for enterprise-grade applications

### Why a Hybrid Approach

- Dashboard operations are well-suited for Next.js API Routes
- WebSockets and real-time features require dedicated infrastructure
- Separating concerns allows each system to be optimized for its purpose
- Provides a cleaner migration path as the application grows
- Reduces initial development complexity while planning for scale

### Why PostgreSQL + Prisma

- Strong data integrity for a multi-tenant system
- Powerful querying capabilities for complex flag configurations
- Schema migrations for safe database evolution
- Type safety through Prisma's generated types
- Excellent developer experience with Prisma Studio

### Why Tailwind + Shadcn UI

- Rapid UI development with utility classes
- Consistent design system with customizable components
- Smaller bundle size compared to component libraries
- Components are copied into the project for complete control

## Consequences

### Positive

- Faster initial development for the dashboard
- Proper architecture for mission-critical real-time features
- Clear separation of concerns
- Type safety throughout the stack
- Optimized developer experience

### Negative

- Managing multiple services increases operational complexity
- Need to share authentication across services
- Potential for code duplication between services
- Multiple deployment pipelines to maintain

### Neutral

- Need to establish clear boundaries between services
- Need to implement cross-service monitoring
- Team needs expertise in both Next.js and NestJS patterns

## Implementation Notes

- We will structure the Next.js project with a clear separation between API controllers and business logic
- We will establish a shared authentication strategy between services
- We will set up infrastructure-as-code for consistent deployment across environments
- We will implement observability across both services from the start
