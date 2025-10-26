# API Architecture Guide

## Overview

This guide explains the API architecture of Peek-a-boo, clarifying the distinction between **Management APIs** (for the Dashboard) and **Runtime/SDK APIs** (for the Client SDK), and why both are necessary.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Two Different API Consumers](#two-different-api-consumers)
- [Dashboard APIs vs Client SDK APIs](#dashboard-apis-vs-client-sdk-apis)
- [What the Client SDK Calls](#what-the-client-sdk-calls)
- [Security Model](#security-model)
- [Data Flow](#data-flow)
- [API Endpoints Reference](#api-endpoints-reference)
- [Example Usage](#example-usage)

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                  SDK Service (NestJS)                   │
│                                                         │
│  ┌──────────────────────┐  ┌─────────────────────────┐ │
│  │  Management APIs     │  │  Runtime/SDK APIs       │ │
│  │  (for Dashboard)     │  │  (for Client SDK)       │ │
│  ├──────────────────────┤  ├─────────────────────────┤ │
│  │ POST /feature-flags  │  │ GET /api/v1/flags       │ │
│  │ GET  /feature-flags  │  │ WS  /flags/stream       │ │
│  │ PUT  /feature-flags  │  │ POST /api/v1/track      │ │
│  │ DELETE /flags/:id    │  │                         │ │
│  └──────────────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
         ↑                              ↑
         │                              │
    Dashboard                     Client SDK
   (Next.js App)               (Embedded in user apps)
```

## Two Different API Consumers

The SDK Service serves two distinct types of consumers:

### 1. Dashboard (Management)
- **Purpose**: Create, update, delete, and configure feature flags
- **User**: Admin users, developers, product managers
- **Authentication**: User session (NextAuth.js)
- **Data access**: Full flag configurations, targeting rules, analytics

### 2. Client SDK (Runtime)
- **Purpose**: Evaluate feature flags in real-time
- **User**: End users of client applications
- **Authentication**: SDK API key
- **Data access**: Evaluated flag values only (no internal configuration)

## Dashboard APIs vs Client SDK APIs

| Aspect | Dashboard APIs | Client SDK APIs |
|--------|----------------|-----------------|
| **Purpose** | Manage flags (CRUD) | Evaluate flags (Read-only) |
| **User** | Admin/Developer | End users |
| **Auth** | User session/login | API key (public or server-side) |
| **Data** | Full flag config with rules | Evaluated flag values only |
| **Endpoint Pattern** | `/feature-flags/*` | `/api/v1/flags` |
| **Operations** | Create, Read, Update, Delete | Read only |
| **Response** | Full FeatureFlag objects | Simplified flag values |
| **Caching** | Minimal (admin UIs change often) | Aggressive (CDN-friendly) |
| **Rate Limiting** | Moderate | High (many clients) |

## What the Client SDK Calls

The Client SDK is embedded in end-user applications and needs to:

1. **Fetch all flags** for the current environment
2. **Evaluate flags locally** (fast, no network call per check)
3. **Receive real-time updates** when flags change
4. **Track analytics** (optional)

### Client SDK API Calls

#### 1. Get All Flags for Environment

```http
GET /api/v1/flags?environment={env}&context.userId={id}
Authorization: Bearer {sdk-key}
```

**Request Example:**
```bash
curl -X GET "https://sdk.peek-a-boo.io/api/v1/flags?environment=production&context.userId=user_123&context.plan=pro" \
  -H "Authorization: Bearer pk_prod_abc123"
```

**Response:**
```json
{
  "flags": {
    "new-checkout": true,
    "button-color": "blue",
    "free-trial-days": 14,
    "premium-features": {
      "enabled": true,
      "value": ["analytics", "export", "api"]
    }
  }
}
```

**Key Points:**
- SDK calls this on initialization
- Polls every 30-60 seconds (configurable)
- Context parameters help with server-side evaluation
- Returns **evaluated** values, not configuration

#### 2. WebSocket for Real-Time Updates (Future)

```javascript
// Connect to WebSocket
const ws = new WebSocket('wss://sdk.peek-a-boo.io/flags/stream?sdkKey=pk_prod_abc123&environment=production');

// Receive updates
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  // { "type": "FLAG_UPDATED", "flag": { "key": "new-checkout", "value": true } }
};
```

**Benefits:**
- Instant flag updates (no polling delay)
- Reduced server load (no polling requests)
- Better user experience (flags update immediately)

#### 3. Track Events (Optional - Future)

```http
POST /api/v1/track
Authorization: Bearer {sdk-key}
Content-Type: application/json

{
  "event": "flag_evaluated",
  "flagKey": "new-checkout",
  "value": true,
  "userId": "user_123",
  "timestamp": "2025-10-26T12:00:00Z"
}
```

**Use Case:**
- Analytics on flag usage
- A/B test result tracking
- Feature adoption metrics

## Security Model

The SDK Service uses different authentication methods for different consumers:

### Authentication Types

#### 1. User Session (Dashboard)
```typescript
// NextAuth.js session-based authentication
// Dashboard API requests include session cookie
```

**Permissions:**
- ✅ Create/update/delete flags
- ✅ View all organization data
- ✅ Configure targeting rules
- ✅ Access analytics

#### 2. Client-Side SDK Key (Public)
```typescript
// Prefix: pk_prod_*, pk_dev_*
const client = new FeatureFlagClient({
  apiKey: 'pk_prod_abc123',  // Safe to expose in browser
  environmentKey: 'production'
});
```

**Permissions:**
- ✅ Read evaluated flags for specified environment
- ❌ Cannot create/update/delete flags
- ❌ Cannot see targeting rules or configuration
- ❌ Cannot access other environments

**Security:**
- Safe to embed in frontend code
- Scoped to single environment
- Read-only access
- Rate-limited per key

#### 3. Server-Side SDK Key (Secret - Future)
```typescript
// Prefix: sk_prod_*, sk_dev_*
const client = new FeatureFlagClient({
  apiKey: 'sk_prod_xyz789',  // Keep secret!
  environmentKey: 'production'
});
```

**Permissions:**
- ✅ Read evaluated flags
- ✅ Track events with PII
- ✅ Server-side evaluation with sensitive context
- ❌ Cannot create/update/delete flags

## Data Flow

### How Feature Flags Get to End Users

```
1. Admin creates flag in Dashboard
   ↓
   POST /feature-flags
   {
     "name": "new-checkout",
     "enabled": true,
     "targeting": { ... }
   }
   ↓
2. SDK Service stores in database
   ↓
3. User app initializes Client SDK
   ↓
   GET /api/v1/flags?environment=production&context.userId=user_123
   ↓
4. SDK Service evaluates flags based on:
   - Environment (production vs staging)
   - User context (targeting rules)
   - Rollout percentage
   - Kill switches
   ↓
5. Returns evaluated flags
   {
     "flags": {
       "new-checkout": true,
       "theme": "blue"
     }
   }
   ↓
6. Client SDK stores in memory
   ↓
7. App checks flag: flags.isEnabled('new-checkout')
   → No network call! Instant response!
   ↓
8. SDK polls/receives WebSocket updates
   ↓
9. Flags update → Client SDK emits event → App re-renders
```

### Why This Architecture?

**Performance:**
- Flags are evaluated once on fetch, not on every check
- Local evaluation is instant (no network latency)
- Polling/WebSocket keeps flags fresh

**Security:**
- Targeting rules stay on server (not exposed to client)
- SDK keys are scoped and rate-limited
- Sensitive context can be evaluated server-side

**Scalability:**
- Aggressive caching (flags don't change frequently)
- CDN-friendly (GET requests)
- WebSocket reduces polling load

## API Endpoints Reference

### Management APIs (Dashboard)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/feature-flags/:organizationId` | List all flags | User session |
| `GET` | `/feature-flags/:id` | Get flag details | User session |
| `POST` | `/feature-flags` | Create new flag | User session |
| `PUT` | `/feature-flags/:id` | Update flag | User session |
| `DELETE` | `/feature-flags/:id` | Delete flag | User session |
| `GET` | `/projects/:organizationId` | List projects | User session |
| `POST` | `/projects` | Create project | User session |

### Runtime APIs (Client SDK)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/v1/flags` | Get evaluated flags | SDK key |
| `WS` | `/flags/stream` | Real-time updates | SDK key |
| `POST` | `/api/v1/track` | Track events | SDK key |

## Example Usage

### Dashboard Creating a Flag

```typescript
// apps/dashboard/src/domains/feature-flags/actions/feature-flag.actions.ts

'use server'
export async function createFeatureFlagAction(prevState, formData) {
  const name = formData.get('name');
  const projectId = formData.get('projectId');

  // Call Management API
  const response = await fetch(`${API_BASE_URL}/feature-flags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookies().toString(), // User session
    },
    body: JSON.stringify({
      name,
      projectId,
      organizationId: session.user.organizationId,
      value: { enabled: true }
    })
  });

  const flag = await response.json();
  revalidatePath('/flags');

  return { success: true, flag };
}
```

### Client SDK Using Flags

```typescript
// customer-app/src/app.js (User's React App)

import { FeatureFlagClient } from '@peek-a-boo/client-sdk';

// Initialize SDK
const flags = new FeatureFlagClient({
  apiKey: 'pk_prod_abc123',        // Public SDK key
  environmentKey: 'production',
  baseUrl: 'https://sdk.peek-a-boo.io',
  pollingInterval: 30000,          // 30 seconds
  defaultContext: {
    userId: currentUser.id,
    plan: currentUser.plan,        // "free", "pro", "enterprise"
    region: currentUser.region
  }
});

// Wait for initialization
await flags.initialize();
// This calls: GET /api/v1/flags?environment=production&context.userId=...

// Check flags (instant, no network call!)
if (flags.isEnabled('new-checkout')) {
  return <NewCheckout />;
}

// Get flag values
const theme = flags.getValue('theme-color', { defaultValue: 'blue' });
const trialDays = flags.getValue('free-trial-days', { defaultValue: 14 });

// Listen for updates
flags.onFlagsChanged((newFlags) => {
  console.log('Flags updated!', newFlags);
  // Trigger re-render with new flag values
});
```

### SDK Service Evaluation Logic (Future Implementation)

```typescript
// apps/sdk-service/src/domains/sdk/sdk.service.ts

@Injectable()
export class SdkService {
  async getFlagsForEnvironment(
    organizationId: string,
    environment: string,
    context: Record<string, string>
  ) {
    // 1. Get all flags for organization
    const flags = await this.prisma.featureFlag.findMany({
      where: { organizationId }
    });

    // 2. Evaluate each flag based on context
    const evaluatedFlags = {};

    for (const flag of flags) {
      evaluatedFlags[flag.name] = this.evaluateFlag(flag, context, environment);
    }

    return evaluatedFlags;
  }

  private evaluateFlag(flag: FeatureFlag, context: Record<string, string>, environment: string) {
    // Check environment match
    if (flag.environment !== environment) {
      return flag.defaultValue;
    }

    // Check targeting rules
    if (flag.targeting) {
      const matchesTargeting = this.evaluateTargeting(flag.targeting, context);
      if (matchesTargeting) {
        return flag.value;
      }
    }

    // Check rollout percentage
    if (flag.rolloutPercentage) {
      const userHash = this.hashUserId(context.userId);
      if (userHash <= flag.rolloutPercentage) {
        return flag.value;
      }
    }

    // Return enabled/disabled state
    return flag.enabled ? flag.value : flag.defaultValue;
  }
}
```

## Why Not Direct Database Access from Dashboard?

You might wonder: "Why doesn't the Dashboard just access the database directly via Prisma?"

### Current Architecture (Dashboard → API → Database)

**Pros:**
- ✅ **API is reusable** by multiple clients (web, mobile, CLI)
- ✅ **Business logic centralized** in SDK Service (DRY principle)
- ✅ **WebSocket support** for real-time features (Client SDK needs this)
- ✅ **Security layer** - API enforces authentication, rate limiting, validation
- ✅ **Independent scaling** - Scale API servers separately
- ✅ **Multiple consumers** - Client SDK, Dashboard, future apps all use same API

**Cons:**
- ❌ Extra network hop (mitigated by ISR caching)
- ❌ More complex infrastructure

### Alternative (Dashboard → Database Direct)

**Pros:**
- ✅ Faster (no network hop)
- ✅ Simpler (fewer services)

**Cons:**
- ❌ Client SDK still needs API (can't access database from browser)
- ❌ Business logic duplicated (Dashboard + SDK Service)
- ❌ No WebSocket layer for real-time updates
- ❌ Database connections from serverless functions (scaling issues)

**Verdict:** For a feature flag platform with a Client SDK, the API-based architecture is the correct choice.

## Next Steps

### Immediate (Phase 1)
- [ ] Implement `/api/v1/flags` endpoint in SDK Service
- [ ] Add SDK key authentication
- [ ] Add context-based flag evaluation
- [ ] Test Client SDK integration

### Short-term (Phase 2)
- [ ] Add WebSocket support for real-time updates
- [ ] Implement server-side SDK keys
- [ ] Add rate limiting per SDK key
- [ ] Add CDN caching headers

### Long-term (Phase 3)
- [ ] Add analytics/tracking endpoint
- [ ] Implement A/B testing metrics
- [ ] Add edge computing support (Cloudflare Workers)
- [ ] Add flag dependency management

## Related Documentation

- [Architecture Diagrams](../architecture-diagrams.md)
- [Development Workflow](./004-developer-workflow.md)
- [Database Schema](./002-database-schema.md)
- [React 19 Server Components Guide](./011-react-19-server-components-guide.md)

---

**Last Updated:** 2025-10-26
**Author:** Architecture Team
**Status:** Active
