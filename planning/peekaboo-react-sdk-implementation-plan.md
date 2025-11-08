# Implementation Plan: @peek-a-boo/react-sdk

## 📋 Project Overview

**Project:** Peek-a-boo React SDK  
**Timeline:** 2 weeks to MVP, 4 weeks to v1.0  
**Start Date:** November 2, 2025  
**Developer:** You + Claude AI Assistant  

---

## 🎯 Implementation Strategy

### Guiding Principles
1. **Incremental Progress** - Small, testable chunks
2. **Continuous Validation** - Test each component before moving on
3. **Documentation as You Go** - Update docs with each feature
4. **Future-Proof Design** - Make choices that won't require refactoring

### Development Flow
```
Setup → Core Client → React Integration → Testing → Documentation → Publishing
```

---

## 📦 Phase 0: Project Setup & SDK Service Verification

### Prerequisites Check
- [ ] Verify SDK Service is running on localhost:6001
- [ ] Confirm database is accessible (PostgreSQL on port 5438)
- [ ] Check that Dashboard can create flags (localhost:3000)

### SDK Service Endpoints Needed
```typescript
// These must exist on the SDK Service before we can proceed:
GET  /api/v1/flags?environment={env}        // Get all flags
GET  /api/v1/flags/{key}?environment={env}  // Get single flag
POST /api/v1/evaluate                       // Batch evaluate flags
```

### Create SDK Service Endpoints (if missing)
- [ ] Create `/api/v1/flags` endpoint in SDK Service
  ```typescript
  // apps/sdk-service/src/domains/flags/flags.controller.ts
  @Get('flags')
  async getFlags(@Query('environment') environment: string) {
    // Return flag configurations
  }
  ```
- [ ] Test endpoints with curl/Postman
- [ ] Document API responses

### Package Setup
- [ ] Create `packages/react-sdk` directory
- [ ] Initialize package.json
  ```json
  {
    "name": "@peek-a-boo/react-sdk",
    "version": "0.1.0",
    "main": "dist/index.js",
    "module": "dist/index.esm.js",
    "types": "dist/index.d.ts",
    "peerDependencies": {
      "react": ">=16.8.0"
    }
  }
  ```
- [ ] Setup TypeScript config
- [ ] Configure build tool (Vite recommended)
- [ ] Setup test framework (Vitest)
- [ ] Create folder structure

**Checkpoint:** Run `pnpm install` and ensure no errors

---

## 🏗️ Phase 1: Core Client Implementation (Vanilla TypeScript)

### 1.1 Type Definitions
- [ ] Create `src/client/types.ts`
  ```typescript
  export interface FeatureFlag {
    key: string;
    enabled: boolean;
    value?: any;
    environment: string;
  }
  
  export interface ClientConfig {
    apiKey: string;
    environment: string;
    baseUrl?: string;
  }
  
  export interface FlagResult<T = any> {
    enabled: boolean;
    value?: T;
    loading: boolean;
    error?: Error;
  }
  ```
- [ ] Add error types
- [ ] Add response types

**Checkpoint:** Types compile without errors

### 1.2 HTTP Client
- [ ] Create `src/client/http.ts`
  ```typescript
  export class HttpClient {
    constructor(private baseUrl: string, private apiKey: string) {}
    
    async get<T>(path: string): Promise<T> {
      const response = await fetch(`${this.baseUrl}${path}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    }
  }
  ```
- [ ] Add error handling
- [ ] Add retry logic (exponential backoff)
- [ ] Add timeout handling

**Checkpoint:** HTTP client can successfully call SDK Service

### 1.3 Feature Flag Client
- [ ] Create `src/client/FeatureFlagClient.ts`
  ```typescript
  export class FeatureFlagClient {
    private flags: Map<string, FeatureFlag> = new Map();
    private loading: boolean = false;
    private error: Error | null = null;
    
    constructor(private config: ClientConfig) {}
    
    async initialize(): Promise<void> {
      // Fetch initial flags
    }
    
    getFlag(key: string): FlagResult {
      // Return flag state
    }
    
    async refresh(): Promise<void> {
      // Refresh all flags
    }
  }
  ```
- [ ] Implement initialize method
- [ ] Implement getFlag method  
- [ ] Implement refresh method
- [ ] Add fallback handling
- [ ] Add caching logic

**Checkpoint:** Vanilla client can fetch and return flags

### 1.4 Client Testing
- [ ] Unit test HttpClient
- [ ] Unit test FeatureFlagClient
- [ ] Integration test with mock server
- [ ] Error scenario tests

**Checkpoint:** All client tests passing

---

## 🎨 Phase 2: React Integration Layer

### 2.1 React Context
- [ ] Create `src/react/PeekabooContext.tsx`
  ```typescript
  interface PeekabooContextValue {
    client: FeatureFlagClient | null;
    flags: Map<string, FeatureFlag>;
    loading: boolean;
    error: Error | null;
    refresh: () => Promise<void>;
  }
  
  export const PeekabooContext = createContext<PeekabooContextValue>({
    client: null,
    flags: new Map(),
    loading: true,
    error: null,
    refresh: async () => {}
  });
  ```
- [ ] Add context provider logic
- [ ] Handle initialization

**Checkpoint:** Context provides client instance

### 2.2 Provider Component
- [ ] Create `src/react/PeekabooProvider.tsx`
  ```typescript
  export function PeekabooProvider({ 
    children, 
    apiKey, 
    environment,
    options 
  }: PeekabooProviderProps) {
    const [client] = useState(() => new FeatureFlagClient({
      apiKey,
      environment,
      ...options
    }));
    
    useEffect(() => {
      client.initialize();
    }, []);
    
    return (
      <PeekabooContext.Provider value={...}>
        {children}
      </PeekabooContext.Provider>
    );
  }
  ```
- [ ] Implement state management
- [ ] Handle loading states
- [ ] Handle error states
- [ ] Add refresh mechanism

**Checkpoint:** Provider initializes and provides context

### 2.3 Core Hook - useFeatureFlag
- [ ] Create `src/react/hooks/useFeatureFlag.ts`
  ```typescript
  export function useFeatureFlag<T = any>(
    key: string, 
    options?: { fallback?: boolean }
  ): FlagResult<T> {
    const { client, loading: globalLoading } = useContext(PeekabooContext);
    
    const flag = client?.getFlag(key);
    
    return {
      enabled: flag?.enabled ?? options?.fallback ?? false,
      value: flag?.value,
      loading: globalLoading,
      error: flag?.error
    };
  }
  ```
- [ ] Handle missing provider
- [ ] Add memoization
- [ ] Handle updates

**Checkpoint:** Hook returns correct flag states

### 2.4 Additional Hooks
- [ ] Create `src/react/hooks/usePeekaboo.ts` (context hook)
- [ ] Create `src/react/hooks/useFeatureFlags.ts` (multiple flags)
- [ ] Add TypeScript overloads

**Checkpoint:** All hooks working correctly

### 2.5 React Testing
- [ ] Test Provider mounting
- [ ] Test hook behavior
- [ ] Test error scenarios
- [ ] Test refresh functionality

**Checkpoint:** All React tests passing

---

## 🧪 Phase 3: Testing & Quality Assurance

### 3.1 Unit Tests
- [ ] Test each client method
- [ ] Test each hook
- [ ] Test error handling
- [ ] Test edge cases
- [ ] Achieve >90% coverage

### 3.2 Integration Tests
- [ ] Create mock SDK service
- [ ] Test full flow
- [ ] Test network failures
- [ ] Test configuration errors

### 3.3 Example Applications
- [ ] Create basic CRA example
- [ ] Create Next.js example (client-side)
- [ ] Create Vite example
- [ ] Verify bundle size

**Checkpoint:** All tests green, examples working

---

## 📚 Phase 4: Documentation

### 4.1 API Documentation
- [ ] Document all exports
- [ ] Add JSDoc comments
- [ ] Generate TypeDoc

### 4.2 README
- [ ] Installation instructions
- [ ] Quick start guide
- [ ] API reference
- [ ] Examples
- [ ] Troubleshooting

### 4.3 Examples
- [ ] Basic usage
- [ ] Error handling
- [ ] TypeScript usage
- [ ] Advanced patterns

**Checkpoint:** Documentation complete and clear

---

## 🚀 Phase 5: Publishing & Release

### 5.1 Build & Bundle
- [ ] Configure production build
- [ ] Optimize bundle size
- [ ] Generate source maps
- [ ] Create dist files

### 5.2 Pre-publish Checks
- [ ] Verify package.json
- [ ] Check bundle size (<5KB gzipped)
- [ ] Run all tests
- [ ] Test npm pack locally

### 5.3 NPM Publishing
- [ ] Setup NPM account/org
- [ ] Configure .npmignore
- [ ] Publish as beta first
  ```bash
  npm publish --tag beta
  ```
- [ ] Test installation in fresh project
- [ ] Publish stable version
  ```bash
  npm publish
  ```

**Checkpoint:** Package available on NPM

---

## 📊 Phase 6: Post-Launch

### 6.1 Monitoring
- [ ] Monitor NPM downloads
- [ ] Track GitHub issues
- [ ] Collect user feedback

### 6.2 Iteration
- [ ] Fix reported bugs
- [ ] Improve based on feedback
- [ ] Plan v2 features

---

## 🔧 Command Reference

### Development Commands
```bash
# Setup
cd packages/react-sdk
pnpm install

# Development
pnpm dev          # Start dev server
pnpm test         # Run tests
pnpm test:watch   # Watch mode
pnpm test:coverage # Coverage report

# Building
pnpm build        # Build for production
pnpm size         # Check bundle size

# Quality
pnpm lint         # Run linter
pnpm type:check   # TypeScript check

# Publishing
pnpm prepublish   # Pre-publish checks
npm publish       # Publish to NPM
```

---

## 📝 Code Review Checklist

Before moving to next phase, verify:

### Code Quality
- [ ] No TypeScript errors
- [ ] No linting errors  
- [ ] Tests passing
- [ ] Coverage >90%

### Performance
- [ ] Bundle size <5KB gzipped
- [ ] No memory leaks
- [ ] Efficient re-renders

### Developer Experience  
- [ ] Clear error messages
- [ ] Good TypeScript types
- [ ] Helpful JSDoc comments
- [ ] Intuitive API

### Security
- [ ] No sensitive data logged
- [ ] Secure API key handling
- [ ] Input validation

---

## 🎯 Success Metrics Tracking

### Technical Metrics
| Metric | Target | Current | Status |
|--------|--------|---------|---------|
| Bundle Size | <5KB | - | ⏳ |
| Test Coverage | >90% | - | ⏳ |
| TypeScript Coverage | 100% | - | ⏳ |
| Build Time | <10s | - | ⏳ |
| Install Time | <30s | - | ⏳ |

### Adoption Metrics
| Metric | Week 1 | Week 2 | Week 4 |
|--------|--------|---------|---------|
| NPM Downloads | 10 | 50 | 100 |
| GitHub Stars | 5 | 15 | 30 |
| Active Users | 1 | 5 | 10 |

---

## 🚨 Risk Mitigation Log

| Risk Identified | Mitigation Applied | Date | Status |
|----------------|-------------------|------|---------|
| SDK Service not ready | Build mock server | - | ⏳ |
| Bundle size too large | Remove dependencies | - | ⏳ |
| Poor TypeScript types | Extensive testing | - | ⏳ |

---

## 💬 Decision Log

| Date | Decision | Rationale | Impact |
|------|----------|-----------|---------|
| Nov 2 | Standalone React package | Faster to market | High |
| Nov 2 | Vanilla client internally | Future-proof | Medium |
| Nov 2 | No dependencies | Small bundle | High |
| Nov 2 | Vite for building | Modern, fast | Low |

---

## 📅 Daily Standup Template

Copy this for daily progress updates:

```markdown
### Date: [DATE]

**Completed:**
- [ ] Task 1
- [ ] Task 2

**In Progress:**
- [ ] Task 3

**Blockers:**
- None / Description

**Next:**
- [ ] Task 4
- [ ] Task 5

**Notes:**
- Any important observations
```

---

## 🎉 Completion Criteria

The MVP is complete when:

- [ ] All Phase 1-4 tasks checked
- [ ] Published to NPM (beta tag)
- [ ] Example app working
- [ ] Documentation complete
- [ ] Bundle <5KB gzipped
- [ ] Tests passing with >90% coverage
- [ ] TypeScript fully typed
- [ ] No critical bugs
- [ ] Basic telemetry ready (for v2)

---

## 📞 Support & Resources

### Internal Resources
- SDK Service: http://localhost:6001
- Dashboard: http://localhost:3000  
- Database: postgresql://localhost:5438

### External Resources
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [NPM Publishing](https://docs.npmjs.com/cli/v9/commands/npm-publish)
- [Semantic Versioning](https://semver.org)

### When Stuck
1. Review this plan
2. Check the PDR document
3. Look at competitor SDKs for patterns
4. Ask Claude for specific help
5. Break the problem into smaller pieces

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Nov 2, 2025 | Initial plan created |

---

*Remember: Each checkbox is a commitment. Check it only when truly complete. Ask for help when needed. You've got this! 🚀*
