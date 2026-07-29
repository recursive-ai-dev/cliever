# CLI-Verse: The Agent Registry

A production-grade, futuristic web application for discovering and managing CLI AI agents and terminal tools. Fully client-side and offline-capable: every analysis runs on a bundled local linguistic engine — no API keys, no backend.

## 🚀 Features

- **Agent Discovery**: Browse 100+ carefully curated CLI AI tools and frameworks
- **Real-time Sync**: Live repository status checking backed by the GitHub API with intelligent rate limiting, ETag conditional requests, circuit breakers, and a deterministic offline fallback
- **AI-Powered Chat**: Built-in expert system for agent recommendations (offline local model, optionally enriched by trained LaPoet checkpoints)
- **Comparison Tool**: Side-by-side analysis of different agents
- **Collaboration Simulator (Mission Control)**: Recruit a squad of agents and preview how they work together
- **Shell Command Generator**: Natural-language → shell command translation, offline
- **Take Bundle**: Collect install commands across agents and export a per-OS bundle script
- **Install Doctor**: Paste an installation error and get an offline diagnosis per package manager
- **Production Monitoring**: Built-in live telemetry dashboard (events, latency, health, readiness) with JSON export
- **Theme System**: Four hand-tuned themes with CSS-variable theming and persistence

## Run Locally

**Prerequisites:**  Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the app (no external AI API keys required):
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Verify (type-check, lint, registry integrity gate):
   ```bash
   npm run typecheck
   npm run lint
   npm test
   ```

5. End-to-end smoke tests (requires Playwright browsers, `npx playwright install`):
   ```bash
   npm run test:e2e
   ```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 19 + TypeScript (Strict Mode)
- **Build Tool**: Vite 6 + Tailwind CSS 4 (compiled at build time — no runtime CDN)
- **Charts**: Recharts (live telemetry dashboard)
- **AI Integration**: Local offline model (Universal Linguistic Engine) + trained LaPoet checkpoints served from `public/`
- **Icons**: Lucide React

### Production Features
- ✅ TypeScript strict mode with comprehensive type safety
- ✅ Input sanitization for XSS prevention
- ✅ Error boundary for graceful error handling
- ✅ Structured logging with severity levels and IndexedDB persistence
- ✅ Rate limiting and circuit breakers (sync engine + GitHub client)
- ✅ LRU caching with ETag conditional requests for the GitHub API
- ✅ Registry schema integrity gate (`scripts/validate-registry.mjs`) enforced at boot and in CI
- ✅ Real repository reachability checks with deterministic offline degradation
- ✅ Playwright E2E suite mirroring the manual test plan

## ⚠️ Security Considerations

### Current Limitations
- **No Backend**: All logic runs in-browser/offline; add a backend if you need persistence or auth

### Production Recommendations
1. **Backend Proxy (Optional)**: Introduce a backend only if you need persistence or auth flows
2. **Rate Limiting**: Keep circuit breakers if you add outbound calls
3. **Authentication**: Add user authentication for write actions
4. **CSP Headers**: Implement Content Security Policy headers

## 📊 Production Readiness

**Category Breakdown:**
- ✅ Reliability: Error boundaries, abort-safe async, deterministic fallbacks
- ✅ Performance: Compiled CSS, vendor chunk splitting, caching layers
- ✅ Code Quality: TypeScript strict mode, zero-error ESLint (react-hooks v7), clean architecture
- ✅ Scalability: Rate limiting, batching, concurrency control
- ✅ Monitoring: Live telemetry dashboard + structured logs + JSON export
- ⚠️ Security: Input sanitization everywhere; no backend proxy (by design)
