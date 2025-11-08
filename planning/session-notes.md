# Session Notes: React SDK Planning

## Context Preservation
**Date:** November 2, 2025  
**Session:** Moving from Claude Code to Claude.ai for planning

## Key Decisions Made

### Architecture Decisions
1. **Standalone React SDK** - Build React SDK without waiting for vanilla client
2. **Internal Vanilla Client** - Structure code to allow easy extraction later
3. **Object Return Pattern** - Use `{ enabled, value }` for future-proofing
4. **Zero Dependencies** - Keep bundle tiny (<5KB gzipped)

### MVP Scope Decisions
✅ **In Scope:**
- Context + Hooks pattern (`<PeekabooProvider>` + `useFeatureFlag`)
- Custom fallback values for error handling
- Simple refetch() function
- TypeScript support
- Client-side only

❌ **Out of Scope (for MVP):**
- Real-time updates (WebSockets) - postponed to v1
- SSR/SSG support - postponed to v1  
- User targeting/segmentation - future
- Analytics/tracking - future
- Local caching beyond in-memory - future
- Vanilla JS export - not needed initially

### Technical Decisions
- **Error Handling:** Allow custom fallbacks per flag
- **Refresh Strategy:** Page reload for MVP (refetch() is bonus)
- **Flag Types:** Booleans only for MVP, but API designed for future variations
- **Return Type:** Always return object to avoid breaking changes

## Important Context

### Why Standalone is OK
Initially there was concern that building standalone would make vanilla support harder later. This was clarified:
- If we structure the code well (vanilla client class inside React package), extraction is trivial
- Moving a file is easier than waiting to build two packages
- Can even export both APIs from same package initially if needed

### Project Structure
```
peek-a-boo/
├── apps/
│   ├── dashboard/        # Next.js UI
│   └── sdk-service/      # NestJS API
├── packages/
│   ├── core/            # Shared Prisma schema
│   ├── client-sdk/      # (Doesn't exist yet)
│   └── react-sdk/       # What we're building
```

### SDK Service Status
- Service exists at localhost:6001
- May need to add runtime endpoints (/api/v1/flags)
- Uses WebSockets (Socket.io) for future real-time

## Next Session Reminders

1. **Start with Prerequisites** - Check if SDK Service has the endpoints
2. **Follow the Plan** - Work through phases systematically  
3. **Check Before Moving** - Complete each phase before proceeding
4. **Test as You Go** - Don't leave testing until the end
5. **Document Immediately** - Update docs with each feature

## Questions Resolved
- ✅ Boolean vs variations: Use object return
- ✅ Standalone vs wait: Go standalone
- ✅ Real-time in MVP: No, postpone
- ✅ SSR in MVP: No, postpone
- ✅ Fallback strategy: Custom per flag

## Open Questions (Non-blocking)
- Caching strategy: In-memory only, or localStorage?
- Telemetry: When to add?
- License: MIT or Apache 2.0?

## Success Definition
**MVP is successful when:**
- Developer can install package
- Add Provider to app
- Use hook to check flag
- It just works
- Under 5KB gzipped
- Takes <5 minutes to integrate

## Communication Style Notes
- Work in phases with checkpoints
- Ask permission before moving to next phase
- Break down into small, concrete tasks
- Use checklists extensively
- Keep decision rationale documented

---

*These notes preserve the key context from our planning session. Refer to the PDR and Implementation Plan for detailed execution.*
