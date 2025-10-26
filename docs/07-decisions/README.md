# Architecture Decision Records (ADRs)

Documentation of significant technical decisions made during Peek-a-boo's development.

## 📚 Decision Log

All architecture decisions are documented here for historical reference and to provide context for current implementation choices.

### [001 - Technology Stack](./001-technology-stack.md)
Initial technology choices for the platform.

**Status**: ✅ Accepted
**Date**: Project inception
**Key Decisions**:
- Next.js for Dashboard
- NestJS for SDK Service
- PostgreSQL for database
- Turborepo for monorepo

### [002 - Hybrid Architecture](./002-hybrid-architecture.md)
Decision to use API-based architecture vs direct database access.

**Status**: ✅ Accepted
**Key Decisions**:
- Dashboard → API → Database (not direct DB access)
- Client SDK → API → Database
- Centralized business logic in SDK Service
- RESTful APIs + WebSockets

### [003 - pnpm Migration](./003-pnpm-migration.md)
Migration from npm/yarn to pnpm for package management.

**Status**: ✅ Accepted
**Key Decisions**:
- pnpm workspaces for monorepo
- Faster installations
- Strict dependency resolution
- Disk space optimization

### [004 - Turborepo Adoption](./004-turborepo-adoption.md)
Adoption of Turborepo for build orchestration.

**Status**: ✅ Accepted
**Key Decisions**:
- Intelligent caching
- Parallel execution
- Incremental builds
- Improved developer experience

### [005 - next-themes Implementation](./005-nextthemes-implementation.md)
Theme system implementation using next-themes.

**Status**: ✅ Accepted
**Key Decisions**:
- next-themes for theme provider
- OKLCH color system
- CSS variables for theming
- Dark/light mode support

### [006 - Theme Update](./006-theme-update.md)
Updates to the theme system and color palette.

**Status**: ✅ Accepted
**Key Decisions**:
- Enhanced color palette
- Improved accessibility
- Updated component theming
- Better contrast ratios

## 📖 What are ADRs?

Architecture Decision Records (ADRs) document important architectural decisions along with their context and consequences.

### Why We Use ADRs

1. **Historical Context**: Understand why decisions were made
2. **Onboarding**: Help new team members understand the system
3. **Avoid Repeating Mistakes**: Learn from past decisions
4. **Track Evolution**: See how architecture evolved over time

### ADR Format

Each ADR includes:
- **Title**: Clear, descriptive decision name
- **Status**: Proposed, Accepted, Deprecated, Superseded
- **Context**: Why this decision was needed
- **Decision**: What was decided
- **Consequences**: Positive and negative outcomes
- **Alternatives Considered**: Other options evaluated

## 🎯 Key Takeaways

### API-Based Architecture (ADR 002)
The decision to use an API layer (SDK Service) instead of direct database access from the Dashboard was crucial. This enables:
- Multiple API consumers (Dashboard, Client SDK, future mobile app)
- Centralized business logic
- WebSocket support for real-time updates
- Better security and rate limiting

### Monorepo with Turborepo (ADR 004)
Using Turborepo dramatically improved build times and developer experience:
- ~70% faster builds with caching
- Parallel task execution
- Incremental builds
- Consistent tooling across packages

### pnpm Workspaces (ADR 003)
pnpm provides strict dependency resolution and faster installations:
- Disk space savings through content-addressable storage
- Faster than npm/yarn
- Strict by default (prevents phantom dependencies)

## 🔗 Related Sections

- [Core Concepts](../01-core/) - Current architecture
- [Development](../03-development/) - Applying these decisions
- [API Architecture](../01-core/api-architecture.md) - Deep dive on ADR 002

---

[← Back to Documentation Home](../README.md)
