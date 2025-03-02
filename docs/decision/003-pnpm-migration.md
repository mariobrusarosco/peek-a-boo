# ADR 003: Migration to PNPM Workspaces

## Date

2025-03-02

## Status

Accepted

## Context

Our Feature Flag SaaS platform is structured as a monorepo with multiple packages and applications. Initially, we set up the project using NPM workspaces, but we've identified several benefits in migrating to PNPM for workspace management.

## Decision Drivers

- Developer experience efficiency
- Package installation speed
- Disk space usage in monorepo
- Dependency management consistency
- Strict package boundaries

## Considered Options

1. **Continue with NPM Workspaces**
   - Familiar to most developers
   - Built into NPM

2. **Migrate to Yarn Workspaces**
   - Well-established alternative
   - Good plugin ecosystem

3. **Migrate to PNPM Workspaces**
   - Fast installation
   - Disk-efficient with content-addressable storage
   - Strict dependency boundaries

## Decision

We have decided to migrate from NPM Workspaces to PNPM Workspaces for managing our monorepo.

## Rationale

PNPM offers several advantages that align with our project needs:

1. **Faster Installation**: PNPM's parallel installation and caching mechanisms make dependency installation significantly faster, especially in a monorepo setup.

2. **Disk Efficiency**: PNPM's content-addressable storage system ensures that dependencies are stored only once on disk, regardless of how many projects use them. This is particularly beneficial in a monorepo where multiple packages may share dependencies.

3. **Strict Package Boundaries**: PNPM creates a more accurate node_modules structure that prevents packages from accessing dependencies they haven't explicitly declared. This helps prevent "phantom dependencies" and makes the codebase more maintainable.

4. **Better Handling of Monorepos**: PNPM has first-class support for monorepos through its workspace features, making it easier to manage interdependencies between our packages.

5. **Growing Ecosystem**: PNPM has been gaining popularity and has good community support.

## Implementation

The migration to PNPM involved:

1. Creating a `pnpm-workspace.yaml` file in the project root to define workspace packages
2. Updating scripts in the root package.json to use PNPM commands
3. Replacing NPM-specific commands with PNPM equivalents

## Consequences

### Positive

- Faster dependency installation for developers and CI/CD
- Reduced disk space usage
- Stricter dependency management leading to fewer "it works on my machine" problems
- Better maintainability of the codebase

### Negative

- Short learning curve for developers unfamiliar with PNPM
- Need to update CI/CD pipelines to use PNPM

### Neutral

- Developers need to use PNPM commands instead of NPM
- Documentation updates required

## Implementation Notes

- To install dependencies: `pnpm install`
- To run commands in specific workspaces: `pnpm --filter <workspace> <command>`
- To run commands in parallel across workspaces: `pnpm --parallel <command>` 