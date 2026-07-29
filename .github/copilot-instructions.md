# CLI-Verse (Cliever) AI Coding Instructions

## Architecture Overview

**Stack:** React 19 + TypeScript (strict) + Vite 6 + offline local AI model (Universal Linguistic Engine)  
**Key Philosophy:** Production-grade, client-only app with zero backend dependencies. All AI inference runs locally via a custom neuro-symbolic poetry engine repurposed for agent recommendations.

### Core Components & Data Flow
1. **Agent Registry ([constants.ts](../constants.ts))** - Single source of truth for 20+ CLI AI tools. Each `Agent` entry must include 13+ required fields (see `types.ts`).
2. **Local Model Service ([services/localModelService.ts](../services/localModelService.ts))** - Wraps `UniversalLinguisticEngine.js` (neuro-symbolic model from `model/lapoet-main/`) for chat, analysis, and comparison features.
3. **React Entry ([App.tsx](../App.tsx))** - Stateful container managing agent lists, filters, sync status, chat history (persisted to localStorage), and multi-layer UI (detail/comparison/collaboration views).
4. **Production Services** - Analytics, sync, storage, GitHub API integration with rate limiting, circuit breakers, and LRU caching.

## Critical Workflows

### Adding New Agents to Registry
1. **Extend [constants.ts](../constants.ts)**:  Add entry to `AGENTS` array with all required fields per `Agent` type in [types.ts](../types.ts).
2. **Required Fields**: `id`, `name`, `description`, `longDescription`, `category`, `stars`, `language`, `installCommand`, `platformCommands` (optional), `repoUrl`, `features`, `tags`, `useCases`, `reviews`, `version`.
3. **Tags**: Reuse from `TAG_DESCRIPTIONS` map (avoid introducing new tags unless necessary).
4. **Non-Destructive**: Never modify existing agent entries' `id` or `installCommand` fields (additive-only per [LOGIC-MAP.md](../LOGIC-MAP.md)).

### Working with the Local AI Model
- **Model Location**: `model/lapoet-main/src/UniversalLinguisticEngine.js` - A neuro-symbolic poetry engine (AG-TUNE/LaPoet) using Kernel PCA embeddings, Rete rule engine, CYK parser, and TD(λ) reinforcement learning.
- **Import Pattern**: `import { UniversalLinguisticEngine } from '../model/lapoet-main/src/UniversalLinguisticEngine.js';` (note `.js` extension in TS import).
- **Chat Interface**: All chat runs through `askExpert()` in [localModelService.ts](../services/localModelService.ts), which handles sanitization, abort signals, and error recovery.
- **No External APIs**: The model is 100% offline. Do not add OpenAI/Anthropic API calls without explicit user approval.

#### Universal Linguistic Engine Architecture (Under Migration)
The engine is transitioning from a monolithic design to an interface-based architecture (see [model/lapoet-main/FIXES.md](../model/lapoet-main/FIXES.md)):

**Current State** (monolithic):
```javascript
// Tightly coupled - components created internally
class UniversalLinguisticEngine {
  constructor() {
    this.phonetics = new PhoneticEngine();
    this.grammar = new ConstraintGrammar();
  }
}
```

**Target State** (interface-based with dependency injection):
```typescript
// Decoupled - dependencies injected
interface ILinguisticEngine {
  analyze(word: string): Promise<AnalysisResult>;
  generateStructure(complexity: number): string;
}

class UniversalLinguisticEngine implements ILinguisticEngine {
  constructor(
    private phoneticEngine: IPhoneticEngine,
    private grammar: ConstraintGrammar
  ) {}
}
```

**When Contributing**:
- **Respect backward compatibility**: Use `LegacyAdapter` pattern when refactoring
- **Prefer interfaces**: Define `IPhoneticEngine`, `IConstraintGrammar` for new components
- **Event-driven**: New code should emit `LinguisticEvent` for observability (type: 'analysis-complete' | 'generation-start' | 'error')
- **Migration phases**: Check current phase before modifying core engine (Phase 1: interfaces coexist, Phase 2: component separation, Phase 3: event system, Phase 4: cleanup)

### Security & Sanitization
**Always sanitize user input** via [utils/sanitization.ts](../utils/sanitization.ts):
- `sanitizeSearchQuery()` - Removes script tags, event handlers (used for search bar).
- `sanitizeHtml()` - Escapes HTML entities (used for agent metadata display).
- `sanitizeUrl()` - Validates http/https only, rejects data:/javascript: schemes.
- `sanitizeCommand()` - Whitelists safe install command patterns (npm, brew, pip, etc.).

**Pattern**: Sanitize at the boundary (user input) before storing in state or rendering to DOM.

### Type Safety Conventions
- **TypeScript Strict Mode**: All compiler strict checks enabled ([tsconfig.json](../tsconfig.json)). Do not disable `noUncheckedIndexedAccess` or `noImplicitReturns`.
- **Enum Usage**: Use `AgentCategory` enum for categories, `AnalyticsEventType` for events, `AgentStatus` for sync states.
- **Array Validation**: Always check `.length` or use optional chaining (`?.`) when accessing arrays from `Agent` type (tags, features, useCases may be undefined in schema extensions).

### Error Handling Pattern
1. **ErrorBoundary**: Top-level React error boundary in [components/ErrorBoundary.tsx](../components/ErrorBoundary.tsx) catches render crashes and logs to analytics/logger services with double-layer try-catch.
2. **Service Errors**: Services use structured logger ([services/logger.ts](../services/logger.ts)) with severity levels (debug/info/warn/error/critical).
3. **Async Abort**: Chat requests support `AbortSignal` via `chatAbortRef` in [App.tsx](../App.tsx) - always respect abort signals in async operations.

### Performance & Caching
- **Rate Limiting**: `RateLimiter` class in [syncService.ts](../services/syncService.ts) uses token bucket (60 req/min, refills at 1/sec). GitHub API checks are cached for 5 minutes.
- **Circuit Breaker**: After 3 consecutive API failures, circuit opens for 15 seconds to prevent cascade failures.
- **LRU Cache**: Analytics service uses ring buffer for event storage (max 1000 events, rolling window).

## Build & Development

**Commands** (from [package.json](../package.json)):
- `npm run dev` - Vite dev server (default port 3000, see `vite.config.ts`)
- `npm run build` - Production build (outputs to `dist/`)
- `npm run preview` - Preview production build locally
- `npm run typecheck` / `npm run lint` - Strict TS + ESLint (both must stay at zero errors)
- `npm test` - Offline registry integrity gate (`scripts/validate-registry.mjs`: schema, unique ids/names, categories, URLs, tag vocabulary)
- `npm run test:e2e` - Playwright smoke suite in `tests/` against the production build (requires `npx playwright install`)

## Integration Points

### GitHub Service
[services/githubService.ts](../services/githubService.ts) fetches repo stars/metadata via unauthenticated GitHub API. Respects rate limits and returns cached data on 304 responses.

### Analytics Service
[services/analyticsService.ts](../services/analyticsService.ts) tracks 10+ event types (`agent_view`, `install_copy`, `search_query`, etc.) with session management and ring buffer storage. Export via `AnalyticsService.getReport()`.

### Storage Service
[services/storageService.ts](../services/storageService.ts) persists reviews to localStorage with JSON parsing error handling. Reviews are merged with agent data on mount via `initializeAgentReviews()` in [App.tsx](../App.tsx).

## Project-Specific Patterns

### Multi-Select UI States
- **Squad Mode**: Array of selected agents for collaboration preview ([components/CollaborationLayer.tsx](../components/CollaborationLayer.tsx)).
- **Comparison Mode**: Exactly 2 agents in `compareAgentA`/`compareAgentB` slots with overflow logic (shift B→A when adding 3rd agent).

### Pagination Logic
- Fixed 6 items per page (`itemsPerPage` in [App.tsx](../App.tsx)).
- Filtered list computed via `useMemo` before pagination slice.
- Reset `currentPage` to 1 when filters change.

### Theme System
[components/ThemeSelector.tsx](../components/ThemeSelector.tsx) applies CSS variables dynamically. Theme state persists to localStorage. Use `applyTheme(themeName)` to switch, `getStoredTheme()` to retrieve.

## Documentation References

- [LOGIC-MAP.md](../LOGIC-MAP.md) - Expansion strategy with mathematical proofs of non-destructive changes.
- [WE-CHOSE.md](../WE-CHOSE.md) - Three-perspective decision log (CEO/Junior Dev/Customer).
- [README.md](../README.md) - Production readiness score (92/100) and deployment guidelines.
- [model/lapoet-main/README.md](../model/lapoet-main/README.md) - AG-TUNE poetry engine architecture (neuro-symbolic hybrid model).
- [model/lapoet-main/FIXES.md](../model/lapoet-main/FIXES.md) - UniversalLinguisticEngine refactoring roadmap: interface-based architecture, event system, migration phases.

## Common Pitfalls

1. **Don't break existing commands**: Agent registry changes must be additive-only. Existing `installCommand` fields are sacred.
2. **Don't skip sanitization**: All user input (search, chat, reviews) must be sanitized before state storage.
3. **Don't add backend dependencies**: This is a client-only app. Avoid introducing server-side APIs without architectural discussion.
4. **Don't ignore TypeScript errors**: Strict mode is non-negotiable. Fix type errors, don't use `any` or `@ts-ignore` unless documenting why.
5. **Don't fetch external LLM APIs**: The local model is the only AI provider. External API keys violate the offline-first design.
6. **Don't bypass the UniversalLinguisticEngine migration**: When modifying the local model, check [FIXES.md](../model/lapoet-main/FIXES.md) for current architecture state. Use adapters for backward compatibility, don't directly couple to legacy implementations.
7. **Don't create components without interfaces**: New phonetic/grammar components should implement `IPhoneticEngine` or `IConstraintGrammar` interfaces for testability and extensibility.
