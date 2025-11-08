# React SDK Implementation Plan

## Project Context
Peek-a-boo is a feature flag management platform. This plan covers the implementation of `@peek-a-boo/react-sdk`, a React-specific SDK that wraps the existing `@peek-a-boo/client-sdk` package.

## Key Decisions from Discovery

### MVP Scope
- **Context + Hooks Pattern**: `<PeekabooProvider>` + `useFeatureFlag()` hook
- **Boolean-only flags** for MVP, but API designed for future variations support
- **Client-side only**: No SSR/SSG support in MVP (postponed to v1)
- **No real-time updates**: WebSocket support postponed to v1
- **No user targeting/segmentation**: Postponed to future version
- **No analytics/tracking**: Postponed to future version
- **Manual refresh**: Page reload or optional `refetch()` function

### API Design (Future-Proof)
```tsx
// Provider setup
<PeekabooProvider
  apiKey="sdk_xxx"
  environment="production"
  fallback={false}
>
  <App />
</PeekabooProvider>

// Hook usage (returns object for future-proofing)
const { enabled, loading, value } = useFeatureFlag('new-feature', { fallback: false })

// Context access for advanced usage
const { refetch, flags, loading } = usePeekaboo()
```

**Why object return?** Prevents breaking changes when we add variations (string/number values) in the future.

### Technical Decisions
1. **Wraps existing client-sdk**: Reuses `@peek-a-boo/client-sdk` logic with React layer
2. **Custom fallbacks**: Allow per-flag and provider-level fallbacks
3. **Refetch function**: Exposed via context for manual refresh without page reload
4. **TypeScript-first**: Full type safety from the start
5. **Error handling**: Graceful degradation with fallback values

## Implementation Phases

### Phase 1: Project Setup
**Goal**: Create package structure and configure build tooling

- [ ] 1.1. Create `packages/react-sdk` directory structure
  - `src/` for source code
  - `dist/` for build output (git-ignored)
  - Configuration files at root

- [ ] 1.2. Create `package.json` with dependencies
  - React 18+ as peer dependency
  - `@peek-a-boo/client-sdk` as dependency
  - TypeScript, build tools (rollup/tsup)
  - Proper exports configuration

- [ ] 1.3. Configure TypeScript (`tsconfig.json`)
  - Target ES2020+
  - JSX support
  - Declaration file generation
  - Proper module resolution

- [ ] 1.4. Configure build tooling
  - Choose between Rollup or tsup
  - ESM + CJS output
  - Type declarations bundling
  - Source maps

- [ ] 1.5. Add to Turborepo configuration
  - Update root `turbo.json` with react-sdk tasks
  - Set up build dependencies (depends on client-sdk)
  - Configure caching

- [ ] 1.6. Create basic README.md with installation instructions

### Phase 2: Core Context & Provider
**Goal**: Implement React Context for flag state management

- [ ] 2.1. Create `src/context/PeekabooContext.tsx`
  - Define context shape (flags, loading, error, refetch)
  - Create context with proper TypeScript types
  - Export context for internal use

- [ ] 2.2. Implement `src/PeekabooProvider.tsx`
  - Accept props: apiKey, environment, fallback, children
  - Initialize client-sdk instance
  - Fetch flags on mount
  - Handle loading/error states
  - Provide refetch function
  - Store flags in state

- [ ] 2.3. Add error boundaries/error handling
  - Graceful degradation on fetch failure
  - Use fallback values when SDK service is down
  - Log errors to console (dev mode)

- [ ] 2.4. Create TypeScript interfaces
  - `PeekabooProviderProps`
  - `PeekabooContextValue`
  - `FeatureFlagValue` (enabled, value, loading)

### Phase 3: Hooks Implementation
**Goal**: Create developer-facing hooks for flag consumption

- [ ] 3.1. Implement `src/hooks/usePeekaboo.ts`
  - Access PeekabooContext
  - Return full context value
  - Throw error if used outside Provider

- [ ] 3.2. Implement `src/hooks/useFeatureFlag.ts`
  - Accept flagKey and optional options (fallback)
  - Return `{ enabled, value, loading }`
  - Handle flag not found (use fallback)
  - Memoize return value for performance

- [ ] 3.3. (Optional) Implement `src/hooks/useFeatureFlags.ts`
  - Accept array of flag keys
  - Return object with all flag states
  - Useful for checking multiple flags at once

- [ ] 3.4. Add proper TypeScript generics for type inference

### Phase 4: Component Implementation (Optional)
**Goal**: Provide declarative component API as alternative to hooks

- [ ] 4.1. Implement `src/components/FeatureFlag.tsx`
  - Props: flag, fallback, children
  - Renders children if flag enabled
  - Optional fallback component/element
  - Uses useFeatureFlag hook internally

- [ ] 4.2. Add loading state handling
  - Optional loading prop
  - Show loading component while fetching

### Phase 5: Testing Setup
**Goal**: Ensure reliability with comprehensive tests

- [ ] 5.1. Configure Jest for React testing
  - Install @testing-library/react
  - Configure test environment
  - Add to package.json scripts

- [ ] 5.2. Create test utilities
  - Mock PeekabooProvider wrapper
  - Mock client-sdk responses
  - Helper functions for common test scenarios

- [ ] 5.3. Write tests for PeekabooProvider
  - Fetches flags on mount
  - Handles loading states
  - Handles errors gracefully
  - Provides flags to children
  - Refetch function works

- [ ] 5.4. Write tests for useFeatureFlag hook
  - Returns correct flag value
  - Handles missing flags (fallback)
  - Handles loading state
  - Throws error outside Provider

- [ ] 5.5. Write tests for FeatureFlag component (if implemented)
  - Renders children when enabled
  - Renders fallback when disabled
  - Handles loading state

### Phase 6: Documentation & Examples
**Goal**: Make SDK easy to adopt for developers

- [ ] 6.1. Write comprehensive README.md
  - Installation instructions
  - Quick start guide
  - API reference (Provider props, hook signatures)
  - Code examples
  - Troubleshooting section

- [ ] 6.2. Add TypeScript JSDoc comments
  - Document all public APIs
  - Include usage examples in comments
  - Proper @param and @returns tags

- [ ] 6.3. Create example app (optional)
  - Simple React app demonstrating usage
  - Show loading states, error handling
  - Multiple flags example

- [ ] 6.4. Add to main project documentation
  - Update root README with react-sdk info
  - Link to react-sdk README

### Phase 7: Integration & Polish
**Goal**: Ensure everything works together in the monorepo

- [ ] 7.1. Update root workspace configuration
  - Ensure pnpm workspace includes react-sdk
  - Add convenience scripts (build:react-sdk, dev:react-sdk)

- [ ] 7.2. Test build process
  - Run `pnpm build:core` → `pnpm build:client-sdk` → `pnpm build:react-sdk`
  - Verify output files (ESM, CJS, types)
  - Test in a sample Next.js app

- [ ] 7.3. Add linting and formatting
  - Ensure ESLint configuration works
  - Run prettier on all files
  - Fix any type errors

- [ ] 7.4. Update CLAUDE.md with react-sdk information
  - Add to project structure
  - Document build commands
  - Note any gotchas

## Future Enhancements (Post-MVP)

### V1 Features (Not in MVP)
- **Real-time updates via WebSockets**: Opt-in live flag updates
- **SSR/SSG support**: Server-side flag evaluation for Next.js
- **Performance optimizations**:
  - Local caching (localStorage/sessionStorage)
  - Stale-while-revalidate pattern
  - Batch flag requests
- **Advanced error handling**: Retry logic, exponential backoff

### Future Features
- **User targeting**: Enable flags based on user attributes
- **Analytics/tracking**: Report flag evaluations to service
- **Flag variations**: String/number/object values (already API-compatible)
- **A/B testing helpers**: Variant assignment utilities
- **DevTools integration**: Browser extension for debugging

## Dependencies on Existing Code

### Client SDK Integration
The react-sdk will depend on `@peek-a-boo/client-sdk`. Need to verify:
- Client SDK exports a class/function to instantiate a client
- Client SDK has methods like: `initialize()`, `getFlag(key)`, `getAllFlags()`
- Client SDK returns flag values in expected format

**Action**: Review `packages/client-sdk` to understand current API before implementing Phase 2.

### SDK Service API
The react-sdk (via client-sdk) will call the SDK service API. Need to understand:
- Authentication mechanism (API key header?)
- Endpoints for fetching flags
- Response format
- Error codes and handling

**Action**: Review `apps/sdk-service` API documentation or code before Phase 2.

## Risk & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Client SDK API doesn't match assumptions | High | Review client-sdk in Phase 1.5 before proceeding |
| Build configuration issues (like previous client-sdk issues) | Medium | Reference `docs/fixing-history/` for solutions |
| React peer dependency version conflicts | Low | Use wide peer dependency range (^18.0.0) |
| TypeScript declaration bundling issues | Medium | Use proven tools (tsup or rollup-plugin-dts) |

## Success Criteria

MVP is complete when:
- ✅ Developer can install `@peek-a-boo/react-sdk`
- ✅ Provider wraps app with API key
- ✅ `useFeatureFlag()` hook returns `{ enabled, loading, value }`
- ✅ Flags default to custom or provider fallback on error
- ✅ `refetch()` function refreshes flags without page reload
- ✅ TypeScript types are fully working
- ✅ Tests pass with >80% coverage
- ✅ Documentation is clear and complete
- ✅ Build process works in monorepo
- ✅ Example app demonstrates core functionality

## Timeline Estimate

- **Phase 1**: 1-2 hours (setup)
- **Phase 2**: 2-3 hours (core implementation)
- **Phase 3**: 1-2 hours (hooks)
- **Phase 4**: 30 min - 1 hour (optional component)
- **Phase 5**: 2-3 hours (testing)
- **Phase 6**: 1-2 hours (documentation)
- **Phase 7**: 1 hour (integration)

**Total: ~8-14 hours** for complete MVP implementation.

## Notes for Future Self

### Important Context
- User wants **React-only** for now (vanilla JS postponed)
- **Boolean flags only** in MVP, but API designed with `{ enabled, value }` to support variations later
- **No SSR** in MVP - this is a conscious decision, not an oversight
- **Real-time is opt-in** and postponed to v1 - manual refresh is fine for MVP
- User is experienced and wants **incremental approval** - complete one phase, show results, get approval before next

### Design Philosophy
- **Future-proof API**: Even if MVP is simple, API should not break when adding features
- **Developer Experience**: Clear error messages, good TypeScript support, intuitive API
- **Monorepo-aware**: Follow existing patterns from dashboard/sdk-service (domain structure, naming conventions)

### Key Decisions Rationale
- **Object return from hook**: Allows adding `value`, `metadata`, etc. without breaking changes
- **Custom fallbacks**: Critical for graceful degradation - user explicitly requested this
- **Refetch function**: Low effort, high value - user agreed when I explained tradeoff