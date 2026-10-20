# CLI-Verse (Cliever) AI Coding Instructions

## Architecture Overview

**Stack:** React 19 + TypeScript (strict) + Vite 6 + offline chat (Kira dialogue engine + deterministic registry skill)  
**Key Philosophy:** Production-grade, client-only app with zero backend dependencies. There is no LLM: chat is rule-based and runs entirely in the browser.

### Core Components & Data Flow
1. **Agent Registry ([constants.ts](../constants.ts))** - Single source of truth for 20+ CLI AI tools. Each `Agent` entry must include 13+ required fields (see `types.ts`).
2. **Local Model Service ([services/localModelService.ts](../services/localModelService.ts))** - `askExpert()` routes chat between Kira, the registry skill and the how-to knowledge base; also hosts analysis, comparison and install-guide generators.
3. **React Entry ([App.tsx](../App.tsx))** - Stateful container managing agent lists, filters, sync status, chat history (persisted to localStorage), and multi-layer UI (detail/comparison/collaboration views).
4. **Production Services** - Analytics, sync, storage, GitHub API integration with rate limiting, circuit breakers, and LRU caching.

## Critical Workflows

### Adding New Agents to Registry
1. **Extend [constants.ts](../constants.ts)**:  Add entry to `AGENTS` array with all required fields per `Agent` type in [types.ts](../types.ts).
2. **Required Fields**: `id`, `name`, `description`, `longDescription`, `category`, `stars`, `language`, `installCommand`, `platformCommands` (optional), `repoUrl`, `features`, `tags`, `useCases`, `reviews`, `version`.
3. **Tags**: Reuse from `TAG_DESCRIPTIONS` map (avoid introducing new tags unless necessary).
4. **Non-Destructive**: Never modify existing agent entries' `id` or `installCommand` fields (additive-only per [LOGIC-MAP.md](../LOGIC-MAP.md)).

### Working with the Chat Engine
- **Routing** (`askExpert()` in [localModelService.ts](../services/localModelService.ts)): conversation, preferences and memory → **Kira**; find / what-is / install / compare → [services/registrySkill.ts](../services/registrySkill.ts) (answers from `AGENTS`); generic how-to → knowledge base + CLI corpus (`public/corpus/`); otherwise Kira.
- **Kira** lives in [kira/](../kira/) (its own README, tests and build). `scripts/build-kira-module.mjs` bundles `kira/src/model` + `kira/src/browser/persistence.js` into `services/kira/kira-model.generated.js`; run `npm run kira:build` after changing anything under `kira/src`. If you change the model, update `APP_META.modelHash` (kira's `tools/build.py` prints the expected value) and the dialogue version.
- **Kira's lexicon is a frozen compiled artifact** (no compiler in this repo), so she cannot learn CLI vocabulary. Add registry intelligence in `registrySkill.ts`, not in her lexicon.
- **Browser runtime**: `services/kira/kiraService.ts` runs the model in a Web Worker (inline fallback) and persists a replayable event log in `localStorage` (`cliever-kira-session`).
- **No External APIs**: Everything is offline. Do not add OpenAI/Anthropic API calls without explicit user approval.
- `model/lapoet-main/` is an upstream snapshot of the AG-TUNE poetry engine; the app no longer imports it.

### Theme System
[components/ThemeSelector.tsx](../components/ThemeSelector.tsx) applies CSS variables dynamically. Theme state persists to localStorage. Use `applyTheme(themeName)` to switch, `getStoredTheme()` to retrieve.

## Documentation References

- [LOGIC-MAP.md](../LOGIC-MAP.md) - Expansion strategy with mathematical proofs of non-destructive changes.
- [WE-CHOSE.md](../WE-CHOSE.md) - Three-perspective decision log (CEO/Junior Dev/Customer).
- [README.md](../README.md) - Production readiness score (92/100) and deployment guidelines.
- [kira/README.md](../kira/README.md) - Kira's architecture, semantics and test layout.

## Common Pitfalls

1. **Don't break existing commands**: Agent registry changes must be additive-only. Existing `installCommand` fields are sacred.
2. **Don't skip sanitization**: All user input (search, chat, reviews) must be sanitized before state storage.
3. **Don't add backend dependencies**: This is a client-only app. Avoid introducing server-side APIs without architectural discussion.
4. **Don't ignore TypeScript errors**: Strict mode is non-negotiable. Fix type errors, don't use `any` or `@ts-ignore` unless documenting why.
5. **Don't fetch external LLM APIs**: Kira and the registry skill are the only chat providers. External API keys violate the offline-first design.
6. **Don't edit `services/kira/kira-model.generated.js` by hand**: it is generated; `npm run kira:check` fails when stale.
