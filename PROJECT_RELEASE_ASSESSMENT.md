# Cliever / CLI-Verse Release Readiness Assessment

**Audit date:** 2026-08-16  
**Repository:** `recursive-ai-dev/cliever`  
**Audited ref:** `main` / `4a20dc7455bf5d55aeef20c84f91c0b9458f607a` (working branch `arena/01a00be6-cliever`)  
**Declared application version:** `2.5.0`  
**Assessment type:** source, build, data, model, test, security, accessibility, legal, deployment, operations, and release-process audit

---

## 1. Executive verdict

## **NO-GO for a public production release.**

The repository contains a real, buildable React application with a substantial registry UI and several usable client-side features. It is suitable for a **demo or internal alpha** after clearly labeling its limitations. It is not currently a defensible production release.

The biggest issue is not that the app is empty—it is not. The issue is that the project repeatedly labels weak, stale, heuristic, or unverified behavior as **live**, **verified**, **trained**, **self-updating**, **production monitoring**, and **production ready**. Several of those claims are contradicted by direct test results.

### Release blockers in one page

1. **There is no reproducible build.** `package-lock.json` is explicitly ignored. `npm ci` fails in a clean checkout. Dependency ranges already resolve to versions different from those described in `RELEASE.md`.
2. **There is no CI/CD or release pipeline.** No GitHub Actions workflows, deployment manifest, tag, GitHub Release, changelog, release automation, environment, or rollback definition exists in the repository.
3. **The model/checkpoint story is broken.** Every shipped checkpoint has 16 `null` TD weights; the system-invariant suite fails; the nested package's default `npm test` fails; `test-all` omits the failing invariant suite; some “tests” explicitly print illustrative results rather than measure the implementation.
4. **The registry is materially stale.** All 96 GitHub repository URLs were reachable during this audit, but 92/96 have material star-count drift under the audit threshold, and 3 listed tools are archived. The UI does not actually update displayed star counts.
5. **“Live” and “verified” are misleading.** All tools start as `LIVE`; offline fallback invents deterministic statuses; `UPDATE_AVAILABLE` means “pushed within 45 days,” not a version comparison; verification can mark a tool `VERIFIED` even when GitHub metadata is unavailable or the repository is missing.
6. **A core copy action violates its own documented contract.** Eleven stored `npm install -g` commands are changed to `npx --yes ...` before display/copy. `TESTING.md` says commands must copy exactly.
7. **Legal/data provenance is unresolved.** The root `LICENSE` is a shortened, modified Apache text that GitHub reports as `Other / NOASSERTION`. The 12,000-line corpus used for the larger checkpoint is absent, so that checkpoint cannot be reproduced or provenance-audited.
8. **Security and privacy deployment requirements are absent.** No CSP/security-header configuration, privacy policy, third-party notice/SBOM, dependency update automation, or secret-scanning workflow exists.
9. **Accessibility is incomplete.** Dialog roles were added, but keyboard access, focus management, semantic controls, mobile layouts, and default color contrast still have concrete failures.
10. **The apparent Render URL was not healthy during the audit.** `https://cliever.onrender.com/` returned Render's “Application loading” page on repeated fetches rather than the application. This may be a cold start, but there is no uptime evidence or deployment configuration in the repo.

### Honest current maturity

| Dimension | Status | Summary |
|---|---:|---|
| Demo readiness | **Good** | Builds, loads as a static SPA, and exposes substantial UI functionality. |
| Internal alpha | **Possible with warnings** | Useful for product feedback if claims are corrected and users are told data is stale/local. |
| Public beta | **No-go** | Needs reproducible CI builds, current data, truthful trust labels, accessibility, and deploy/ops basics. |
| Production | **No-go** | Model integrity, legal provenance, security headers, observability, release engineering, and reliability are unresolved. |

---

## 2. What was actually verified

### 2.1 Commands run against the root app

| Check | Result | Notes |
|---|---:|---|
| `npm install` | **PASS** | Installed 235 packages using currently-resolved ranges. This is not reproducible because no lockfile is tracked. |
| `npm run typecheck` | **PASS** | Strict TypeScript check exits 0 for the TypeScript app. This does not provide strict checking for the JavaScript model implementation. |
| `npm run lint` | **PASS** | ESLint exits 0. The config targets `*.ts`/`*.tsx`; the large nested JavaScript model/test code is effectively outside this lint gate. |
| `npm test` | **PASS** | Registry structural gate: 108 agents, 108 unique IDs/names, 24 categories. This is not a behavioral/unit test suite. |
| `npm run build` | **PASS** | Vite 6.4.3 transformed 2,319 modules and emitted a 16 MB static bundle. |
| `npm audit` | **PASS at audit time** | 0 known vulnerabilities in the dependency graph resolved on 2026-08-16. This result is not stable without a lockfile. |
| Production preview `/` | **PASS** | HTTP 200. |
| Production preview model JSON | **PASS** | HTTP 200 for both checkpoint files. |
| SPA fallback | **PASS** | Unknown routes return the same `index.html` with HTTP 200. |
| Secret-pattern scan | **PASS (limited)** | No common high-confidence private key/API token patterns found in tracked text; only `.env.example` matched an environment filename scan. |

### 2.2 Build output observed in this audit

| Asset | Raw size | Gzip reported by Vite |
|---|---:|---:|
| Main app JS | 283.29 kB | 78.19 kB |
| Charts JS | 384.55 kB | 111.89 kB |
| React vendor JS | 194.27 kB | 60.74 kB |
| Icons JS | 21.04 kB | 4.92 kB |
| CSS | 40.74 kB | 8.11 kB |
| Poems checkpoint | 11.18 MB | ~2.59 MB when separately gzipped |
| Lyrics checkpoint | 3.90 MB | ~0.94 MB when separately gzipped |
| Total `dist/` | 16 MB / 13 files | Model data dominates |

### 2.3 Root E2E status

The repository defines **15 tests × 3 desktop browser projects = 45 cases**.

Current execution was **not completed**:

- `npm run test:e2e` failed all 45 cases before entering application test logic because Playwright 1.62.1 browser binaries were absent.
- `npx playwright install chromium firefox webkit` then failed with repeated network `ECONNRESET` errors.
- Therefore, these are **environment/precondition failures, not 45 proven app failures**.
- `RELEASE.md` records a historical 45/45 pass. Because there is no lockfile, CI run, test artifact, or immutable dependency set, that historical result is not current reproducible release evidence.

### 2.4 Nested LaPoet/model checks

| Check | Result | Meaning |
|---|---:|---|
| `npm run test-all` | **PASS, but misleading** | It omits `test-invariants`, even though docs call it the complete suite. |
| `npm run test-invariants` | **FAIL: 9/10** | TD weights “may have exploded or vanished”; actual shipped values are null. |
| Nested `npm test` | **FAIL (127)** | Script invokes `jest`, but Jest is not a dependency. |
| Checkpoint finite/null scan | **FAIL** | All 4 tracked checkpoint copies have 16 null `valueEstimator.weights`. |
| Source-corpus reproducibility | **FAIL** | `model/poems/` is absent; the large checkpoint says it used 12,000 poem lines. |

The model invariant output also exposes weak assertions:

- Consecutive emotional distance was **1.2448× random distance** (worse than the claimed smoothness) but the test still passed the emotional-space invariant merely because embeddings existed.
- Iambic meter scores were both **0.0000**, but consistency alone was counted as a pass.
- The ablation script says its values are “Illustrative examples—replace with actual measurements in production,” then prints that causality was proven.

---

## 3. What works

### 3.1 Application and UI

- React 19 + TypeScript + Vite production compilation works.
- The static SPA requires no backend or API key to render.
- Platform selection, registry cards, category filters, fuzzy search, sorting, and pagination are implemented.
- Agent detail, local reviews, local export, bundles, comparison, collaboration planning, command generation, install diagnosis, themes, and local telemetry UI have real code paths.
- Reviews are accurately labeled local-only in the detail view and are capped per agent.
- Bundle IDs, chat history, reviews, verification records, and theme preferences have local persistence paths.
- Markdown output is rendered as React text nodes rather than `dangerouslySetInnerHTML`, which materially reduces XSS risk.
- A top-level React error boundary exists.
- Async chat code includes abort handling and stale-request protection.
- Clipboard operations have a fallback and visible failure state.
- Most modal layers handle Escape and body scroll lock.
- Reduced-motion preferences are respected in CSS.

### 3.2 Registry structure

- 108 entries pass required-field, ID/name uniqueness, category, URL syntax, and tag-description checks.
- 96/108 point at GitHub; all 96 GitHub repositories resolved successfully through GitHub's API during the audit.
- No duplicate registry repository URLs were found.
- Platform metadata coverage is substantial: 79 Windows, 73 Linux, 79 macOS, and 3 Docker-specific entries.
- Search indexes names, descriptions, categories, languages, URLs, commands, tags, features, and use cases.

### 3.3 Defensive engineering that is genuinely present

- Registry data is runtime-validated before use.
- React text output is escaped by React.
- URL schemes are checked in validation/sanitization utilities.
- Local storage operations generally fail soft when unavailable.
- GitHub calls have in-memory caching and ETag support.
- Sync probes are deduplicated by URL.
- Analytics buffers and logs are bounded in memory.
- Root dependency audit was clean at the exact time of this assessment.

These are useful foundations. They do not, however, support the project's broader production claims without the missing release controls and correctness work below.

---

## 4. Product correctness and trust-label failures

### 4.1 The registry is not truly “live” or “self-updating”

Evidence:

- `App.tsx` initializes every agent with `status: 'LIVE'` and a `lastSynced` timestamp equal to page-load time, before any network check.
- The navigation displays `STATUS: OPERATIONAL` unconditionally.
- The hero calls the product “live, self-updating.”
- `RegistrySyncService.seededFallbackStatus()` invents a stable status from the agent ID/repository hash when network truth is unavailable.
- A repository pushed in the last 45 days is labeled `UPDATE_AVAILABLE`; no installed/current/latest version comparison occurs.
- The background loop returns a heuristic immediately, schedules a fetch, and only surfaces fetched data on a later 30-second tick.
- Non-GitHub `no-cors` HEAD checks can establish that a host responded but cannot reliably distinguish the intended resource/status.

**Required fix:** Separate states such as `UNCHECKED`, `CHECKING`, `REACHABLE`, `UNREACHABLE`, and `UNKNOWN`. Only display network-derived results as verified. Rename recent activity to `RECENTLY_UPDATED`; implement an actual release/version comparison before using `UPDATE_AVAILABLE`.

### 4.2 Force Sync makes false success claims

`handleGlobalSync()` tells the user:

> `REGISTRY SYNCHRONIZED. ... NODES VERIFIED. INTEGRITY 100%.`

But:

- Sync results can be deterministic fallbacks.
- GitHub's unauthenticated API budget is typically much smaller than 108 full checks.
- The local token bucket models 60 requests refilling at 1/second, which does not model GitHub's hourly anonymous quota.
- The sync service's failure counter and circuit are global across all repositories.
- GitHub `fetch()` calls have no explicit timeout.

**Required fix:** Return structured truth (`source`, `checkedAt`, `outcome`, `error/rateLimit`, `stale`) per agent; show checked/unknown/fallback counts; read rate-limit headers; use a backend/proxy or scheduled build-time refresh if reliable public freshness is a product requirement.

### 4.3 “VERIFIED” does not mean repository/install verification

`VerificationService.verifyAgent()` sets `VERIFIED` when:

- the URL has an HTTP(S) syntax, and
- the install command matches a local string allowlist.

GitHub metadata success is not required. A missing/rate-limited repository adds a note, but the status can still become `VERIFIED`. The service also does not verify package existence, publisher identity, command authenticity, checksums, signatures, latest release, or installation success.

The command allowlist itself is syntax-level, not a trust list. Its curl patterns accept broad HTTPS domains.

**Required fix:** Rename the current result `LOCAL_SYNTAX_CHECK_PASSED`, or implement layered trust evidence with explicit badges: URL syntax, repository reachable, repository archived, publisher match, package/release exists, command provenance, last checked, and check source.

### 4.4 Displayed metadata does not refresh

- GitHub metadata fetching exists, but normal sync updates only status and `lastSynced`.
- Verification records that GitHub data was fetched but does not patch `stars` with `stargazers_count`.
- `GitHubService.enrichAgentWithGitHubData()` and batch metadata paths are not wired into the main refresh flow.

Audit-time comparison of the 96 GitHub entries found:

- **92/96** with material star drift (absolute change ≥100 or relative change ≥10%).
- Examples: Claude Code 18,000 stored vs 141,651 current; Gemini CLI 10,000 vs 106,531; vLLM 24,000 vs 89,193.
- **3 archived repositories:** `charmbracelet/mods`, `AntonOsika/gpt-engineer`, and `gptscript-ai/gptscript`.
- **3 repositories not pushed in more than two years:** The Fuck, ctop, and HTTP Prompt.

All 96 GitHub URLs were reachable, which is positive, but the metadata is not current enough for a “live registry.”

**Required fix:** Move registry refresh to a scheduled, authenticated CI job that creates a reviewable data update; store `metadataAsOf`, archive status, release date/version, and source; fail CI on missing repositories; display staleness in the UI.

### 4.5 Install-command copying is wrong for 11 entries

`utils/command.ts` converts every global npm install into an npx run command. As a result, stored install commands such as:

- `npm install -g @anthropic-ai/claude-code`
- `npm install -g @google/gemini-cli`
- `npm install -g @github/copilot`

are displayed/copied as `npx --yes ...`.

This affects 11 entries and contradicts `TESTING.md`, which says copied commands must exactly match `installCommand`.

**Required fix:** Copy the exact install command. If a “try without installing” action is desirable, expose it as a separate, accurately labeled action with its own validated command.

### 4.6 Bundles can contain prose, not commands

Several platform fields contain instructions such as “Use WSL…,” “Download pre-built binaries…,” “Included with Git for Windows…,” or “Build from source…”. `TakeBundleLayer` writes these into an executable-looking bundle without commenting them out.

**Required fix:** Represent platform installation as typed steps (`command`, `manual`, `url`, `note`) rather than a single string. Only executable steps belong in generated scripts; comment or omit manual steps.

### 4.7 “AI” features are mostly deterministic templates

- Agent analysis is a formatted projection of static registry fields.
- Comparison is a hand-coded score based on category, language, tags, stars, and feature count.
- Collaboration is a fixed six-step plan with agent metadata inserted.
- Shell generation is regex/template matching.
- Install Doctor is regex matching.
- Expert chat selects a hard-coded topic response and optionally appends corpus-line retrieval and vector-neighbor words.
- Calls to `UniversalLinguisticEngine.analyze()` / `generateStructure()` do not drive the visible answer; the generated structure result is discarded.

An expert system can be a valid product feature, but it should be called that. “Trained local AI model analysis” implies capabilities this implementation does not provide.

**Required fix:** Either (A) release an honest “offline rules and retrieval assistant,” or (B) define and validate model-backed output quality with real evaluation data and wire model inference into the answer.

---

## 5. LaPoet/model assessment

### 5.1 Shipped checkpoints are internally invalid

All four tracked copies have:

```json
"valueEstimator": {
  "weights": [null, null, null, null, null, null, null, null,
              null, null, null, null, null, null, null, null]
}
```

JSON serialization turns `NaN` into `null`, so this is consistent with numerical failure during training. The system invariant suite independently reports vanished/exploded TD weights.

The runtime TypeScript interface declares `number[]` but fetched JSON is never runtime-schema-validated, so invalid checkpoint data is accepted as if typed.

### 5.2 The PRNG is broken

`SeededRng.next()` uses:

```js
(this._state & 0xffffffff) / 0x100000000
```

JavaScript bitwise operators produce signed 32-bit values. Direct testing showed frequent negative outputs (roughly 30–50% in sampled sequences), even though callers use the result as a `[0, 1)` random value. Negative values produce negative array indexes and generated structures containing `?`.

This visible app mostly discards those structures, which further demonstrates that the engine is ornamental to current chat output.

### 5.3 Validation claims are not supported

- Nested `npm test` cannot run because Jest is missing.
- `test-all` excludes `test-invariants`.
- `test-invariants` fails 9/10.
- `test-ablation-study.js` explicitly says results are illustrative and actual component disabling/measurement remains to be implemented.
- The interpretability test validates a handcrafted example/schema, not reasoning traces emitted by the engine.
- Running interpretability tests mutates the tracked `reasoning-trace-example.json` timestamp, so the suite is not hermetic.
- `test-engine.js` is primarily console output and does not provide a rigorous assertion harness.

Documentation nevertheless says all tests pass 100%, all components are causal, and production confidence is 100%. Those statements must be removed until supported.

### 5.4 The larger checkpoint is not reproducible

- `public/lapoet/agtune-poems-checkpoint.json` reports 12,000 poem lines and 10,320 vocabulary terms.
- `model/poems/`, the claimed source, is absent.
- The fallback tracked lyrics corpus is only 15 files / 971 physical lines and cannot reproduce that checkpoint.
- Training uses unseeded `Math.random()`, so even with the corpus it is not deterministic.
- The checkpoint lacks a complete source manifest, hashes, algorithm version, source commit, and environment details.

### 5.5 Repository and runtime cost

- Checkpoints are duplicated under `model/` and `public/`, consuming about 30 MB in the checkout.
- Public CLI corpora are also exact duplicates of model corpora.
- First trained-chat use loads both 11.18 MB and 3.90 MB JSON checkpoints in parallel, then builds large maps in browser memory.
- The optional telemetry chart library is also loaded eagerly despite being modal-only.
- No real-user performance, memory, low-end-device, or mobile test exists.

### Model release decision

Do not ship the current model under “trained/validated” claims. Pick one:

1. **Fast, honest release path:** remove checkpoints and neuro-symbolic claims from the main app; ship only the clearly labeled rules/retrieval assistant.
2. **Full model path:** fix numerical correctness and PRNG, add checkpoint schema validation, restore/audit source data, make training deterministic, build real tests/evaluations, generate signed checksummed artifacts, and publish a model card/data sheet.

---

## 6. Test and quality engineering gaps

### Existing coverage

- 173 lines of Playwright test code.
- Roughly 7,766 lines under `components/`, `services/`, and `utils/`, before counting `App.tsx`, registry data, and the nested model.
- No root unit-test framework/config and no `*.test.*` files.
- One registry structure script and one desktop E2E file.

### Important untested behavior

- Exact clipboard output (the known npm/npx defect).
- Platform command correctness and bundle script validity.
- Sync outcomes, rate limiting, GitHub 304 behavior, timeouts, and fallback labeling.
- Verification status semantics, including 404/rate-limit cases.
- Storage corruption, migrations, quota failure, and malformed persisted chat/reviews.
- Sanitizers and URL parsing.
- Search edge cases claimed in `TESTING.md`.
- Command generator safety/destructive commands.
- Checkpoint schema/numerical integrity and runtime memory.
- Error-boundary recovery.
- Mobile/responsive behavior.
- Accessibility scans and keyboard-only flows.
- Performance budgets/Web Vitals.
- Offline reload behavior.
- Deployment smoke/headers/caching.

### E2E limitations

- Desktop Chrome, Firefox, and Safari emulations only.
- No mobile projects.
- No accessibility assertions (axe or equivalent).
- Tests intentionally avoid network, so they do not validate “real-time sync” or verification.
- Most tests assert that headings appear, not that generated content is correct.
- The suite rebuilds inside Playwright but no CI executes it.

### Documentation mismatch

- `TESTING.md` discusses ten newly added agents and index ranges `-1` through `12`, but those cases are not automated.
- It requires exact copied commands, which current UI violates and E2E does not test.
- `.github/copilot-instructions.md` says the registry has “20+” entries, while it has 108.
- It references a README score/deployment guidance that does not exist as described.
- `RELEASE.md`'s dependency vulnerability and bundle facts are stale under current dependency resolution.

### Required quality gate

A release branch/tag should be impossible unless all of these pass from a clean checkout:

1. `npm ci`
2. typecheck
3. lint (including nested JS/model code)
4. unit/component tests with coverage thresholds
5. registry schema + live metadata freshness validation
6. checkpoint schema/numerical tests, if model ships
7. Playwright desktop + mobile
8. accessibility scan
9. production build + bundle budget
10. dependency audit + secret scan + CodeQL/static analysis
11. deployed preview smoke test and security-header test

---

## 7. Dependency and build reproducibility

### Blockers

- `.gitignore` explicitly excludes `package-lock.json`.
- No lockfile is tracked at root or in `model/lapoet-main`.
- `npm ci` without the locally generated ignored lockfile exits with `EUSAGE`.
- No `packageManager` or `engines` fields exist.
- README says Node 18+, but currently resolved `@vitejs/plugin-react@5.2.0` requires Node `^20.19.0 || >=22.12.0`, and Playwright 1.62.1 requires Node 20+.
- Dependency ranges resolved newer versions than the declared minimums, including React 19.2.8, Playwright 1.62.1, Vite 6.4.3, and Recharts 3.10.1.
- The current main bundle (283.29 kB) differs from the 280.80 kB app bundle recorded in `RELEASE.md`.
- `RELEASE.md` records 5 high audit findings; the current dynamic graph reports zero. The change is dependency resolution, not a reviewed lockfile update.

### Required fix

- Track a root lockfile and use `npm ci`.
- Either make the nested model a proper workspace with one controlled lock graph or isolate/vendor it deliberately.
- Set and enforce exact supported Node/npm versions (`.nvmrc`/`.tool-versions`, `engines`, `packageManager`).
- Run a Node-version matrix if multiple versions are promised.
- Add Dependabot/Renovate with CI validation.
- Generate an SBOM and dependency license report for each release.

---

## 8. Security and privacy

### Positive findings

- No API keys are required.
- No high-confidence committed secrets were found in the limited scan.
- React text rendering avoids direct HTML injection.
- Root `npm audit` was clean for the graph resolved during this audit.
- User review/chat data stays client-side in current code.
- Commands are displayed/copied, not executed by the website.

### Gaps and risks

1. **No production security headers.** There is no host configuration for CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, or framing restrictions. Vite preview emitted none of these.
2. **No CSP-compatible asset strategy.** Google Fonts are loaded from external domains; a real CSP must account for them or self-host fonts.
3. **No privacy notice.** The app uses localStorage/IndexedDB, loads Google Fonts, and contacts GitHub when users sync/verify. “Nothing is transmitted” is only true for the local telemetry payload, not the entire app.
4. **No dependency/security automation.** Dependabot alerts are disabled; no CodeQL, secret scanning workflow, SAST, or supply-chain policy is present.
5. **No lockfile.** This is a supply-chain and incident-reproduction risk even with a clean current audit.
6. **Broad URL parsing.** `GitHubService.parseGitHubUrl()` uses an unanchored regex rather than exact URL host/path parsing.
7. **No explicit GitHub request timeout.** A stalled API request can stall a user operation.
8. **Global circuit behavior.** Failure accounting is shared across repositories, and the GitHub circuit's failure count only resets after half-open success, not every successful closed-state request.
9. **Window opening.** `AgentCard` uses `window.open(..., '_blank')` without explicitly nulling `opener`/using `noopener`.
10. **Persisted data is not consistently schema-validated.** Main chat history is parsed directly as `ChatMessage[]`; generic storage returns cast data with limited key-specific runtime validation.
11. **Security advice quality.** Install Doctor sometimes recommends `sudo npm install -g`, insecure certificate bypass (`curl -k`), and destructive commands. Warnings and safer alternatives need stronger treatment.
12. **No incident process/security contact.** `SECURITY.md` and a reporting channel are absent.

### Required release security work

- Threat-model the static app, external requests, copied commands, storage, and supply chain.
- Add a strict host-level CSP and standard headers; test them in CI against the deployed preview.
- Self-host fonts or document external processing.
- Add privacy disclosure and data-clear controls.
- Track the lockfile; enable dependency and code scanning.
- Parse URLs with `new URL()` and exact hostname rules.
- Add abort timeouts and structured rate-limit handling.
- Add release SBOM/checksums and a security policy.

---

## 9. Accessibility and responsive design

Adding `role="dialog"` and `aria-modal="true"` was useful, but it did not complete modal accessibility.

### Concrete issues

- Agent cards are clickable `<div>` elements with no `role`, `tabIndex`, Enter/Space handler, or separate semantic detail link. Keyboard users cannot open them the way pointer users can.
- Dialogs do not trap focus, focus an initial control, restore focus to the trigger, or make the background inert.
- Several icon-only controls lack accessible names (for example source-repository, close, roster remove, and rating-star buttons).
- Markdown “headings” are `<span>` elements, not heading elements, so generated documents lack navigable structure.
- The theme listbox does not implement expected listbox arrow-key behavior.
- The default muted color `#666666` on `#111111` has approximately **3.29:1** contrast and is widely used at 9–11 px, below WCAG AA normal-text contrast.
- Focus-visible styling is inconsistent or absent.
- No skip link is present.
- The large full-screen collaboration layout uses a fixed 20rem sidebar and has no clear small-screen adaptation.
- The sticky navigation has many controls in a single non-wrapping row and is likely to overflow or hide functionality on narrow screens.
- No mobile Playwright project or accessibility automation exists.

### Exit criteria

- WCAG 2.2 AA audit, including keyboard-only and screen-reader smoke tests.
- axe checks in Playwright for the platform gate, registry, each dialog, and forms.
- All pointer interactions reachable with semantic controls and keyboard.
- Correct focus trap/return and inert background for all modal experiences.
- Contrast pass for all themes and states.
- Tested layouts at 320, 375, 768, 1024, and desktop widths.

---

## 10. Performance, caching, and offline claims

### What is acceptable

- Main application code is moderate in compressed size.
- Vendor chunking exists.
- The app can continue to use its static registry and heuristic features when GitHub is unavailable after the app has loaded.

### What is not established

- There is no service worker, web app manifest, precache, or installable PWA behavior. A browser cannot reliably reload the app offline unless ordinary HTTP cache happens to contain every required asset.
- Google Fonts require network and introduce an external dependency/privacy surface.
- Both large checkpoints are fetched and parsed on first trained chat use.
- Checkpoints use stable filenames, not content hashes, and preview served them with `Cache-Control: no-cache`.
- Charts are eagerly loaded despite telemetry being optional.
- No performance budget, Lighthouse test, Core Web Vitals, memory test, or slow-network test exists.
- No loading/progress UI explains the first ~15 MB raw checkpoint load.

### Required fix

- Stop saying “fully offline-capable” unless offline reload is implemented and tested.
- Lazy-load telemetry/Recharts.
- Load only the checkpoint needed for a query, or replace the checkpoint architecture.
- Add schema validation and a visible model-load state.
- Configure hashed/immutable assets and deliberate caching for model artifacts.
- Add bundle, Lighthouse, slow-3G, low-end/mobile, and memory budgets.
- If true offline support is in scope, add and test a service worker/PWA lifecycle and update strategy.

---

## 11. Logging, analytics, and operations

### The “production monitoring” claim is incorrect

- Analytics exists only in the current browser's memory.
- The readiness score hardcodes code quality (95), scalability (90), monitoring (100), and security (85), then can label the app “Production Ready.” This is self-attestation, not monitoring.
- No real Web Vitals are collected; `render_time` is chartable but not meaningfully instrumented.
- Logger batching is disabled by default and never enabled, so the IndexedDB persistence path described in README is not active for normal logs.
- There is no remote error collection, uptime check, alerting, deploy marker, or operator dashboard.
- The error boundary tells users an error “has been logged” and to contact support, but no remote operator receives it and no support contact is provided.

### Required operations work

For a static public product, minimum operations still include:

- uptime monitor for HTML and critical assets;
- client error reporting with privacy controls, or an explicit decision to operate without it;
- Web Vitals/performance monitoring;
- deployment logs and immutable artifact IDs;
- alert owner and severity policy;
- rollback/runbook;
- status/support channel;
- retention/privacy policy for any telemetry introduced.

Rename the current modal to **Local Session Diagnostics** and remove the “Production Ready” score unless it is based on real externally-defined gates.

---

## 12. Deployment readiness

### Current state

- Static `dist/` can be hosted.
- Vite preview serves the SPA and assets.
- `vite.config.ts` contains `cliever.onrender.com` in a host allowlist, suggesting an intended Render deployment.
- No `render.yaml`, Netlify/Vercel config, Dockerfile, server config, GitHub Pages workflow, deployment script, or infrastructure-as-code is tracked.
- GitHub reports no Actions workflows and no configured environments.
- The deployment API was not accessible to this audit integration, so external deployment history could not be confirmed through GitHub.
- Repeated web fetches of `https://cliever.onrender.com/` returned Render's “Application loading” page, not Cliever.

### Required deployment definition

Commit a deployment contract that specifies:

- build command and exact Node/npm version;
- artifact directory and immutable artifact/checksum;
- SPA fallback behavior;
- gzip/Brotli;
- HTML no-cache vs hashed asset immutable caching;
- checkpoint cache/update policy;
- CSP and all security headers;
- custom domain/TLS/redirect policy;
- preview/staging/production promotion;
- smoke test after deploy;
- rollback to previous artifact;
- uptime check and owner.

Do not call a release complete until the public URL is tested from outside the build environment and its headers, assets, primary flows, and rollback are verified.

---

## 13. Legal, licensing, and content provenance

### Blockers

1. **Root license is not standard Apache-2.0 text.** It is 106 lines vs the full 202-line copy under `model/lapoet-main/LICENSE` and omits substantial language and the appendix. GitHub classifies it as `Other` / `NOASSERTION`.
2. Root `package.json` has no `license`, repository, homepage, bugs, author, or funding metadata.
3. No root copyright/author/NOTICE attribution is defined.
4. No third-party notices or SBOM is shipped.
5. The poems checkpoint's 12,000-line source corpus is unavailable, so permission, provenance, data subjects, and reproducibility cannot be audited.
6. Tracked lyrics/pretraining files have no per-corpus source/provenance manifest. If they are original works, ownership should be explicitly documented; if derived, licenses/permissions must be documented.
7. Product uses third-party project names and presents install guidance without a clear non-affiliation/trademark disclaimer.
8. No privacy policy, terms, support policy, or security policy exists.

### Required legal exit criteria

- Replace root `LICENSE` with an unmodified SPDX-recognized license text approved by the owner.
- Add correct copyright ownership and a `NOTICE` if needed.
- Add `license` metadata to packages.
- Produce dependency/model/data SBOMs and third-party notices.
- Create a dataset/model card with source, license, consent/rights basis, transformations, limitations, and hashes.
- Remove any checkpoint whose source rights cannot be proven.
- Add privacy and third-party-service disclosure for the public website.
- Add non-affiliation/trademark language for listed tools.
- Obtain human legal review before public distribution; this audit is technical, not legal advice.

---

## 14. Repository, governance, and release engineering

### GitHub/repository state observed

- Repository is **private**.
- Description, homepage, and topics are empty.
- Community profile health: **28%**.
- No code of conduct, contributing guide, security policy, support guide, issue template, PR template, or CODEOWNERS.
- No open issues/milestones were present; that reflects lack of tracked planning, not proven completion.
- No workflows or recent Actions runs.
- Dependabot alerts are disabled.
- Default `main` branch reports `protected: false`.
- No tags and no GitHub Releases.
- Declared `v2.5.0` exists only in source/docs; it has no immutable release identity.
- Latest main commit message is `y` and is unsigned; most non-merge commits are unsigned.
- No changelog or conventional release history.

### Required repository/release work

- Decide whether the project is to be public/open source; if yes, clean legal/provenance first.
- Add repo description, homepage, topics, screenshots, and an honest feature/limitations summary.
- Track work as issues with a release milestone.
- Add branch protection/rules: PR review, passing checks, no force push, required conversation resolution.
- Add CODEOWNERS and ownership for product, data, security, release, and model.
- Add `CONTRIBUTING.md`, `SECURITY.md`, `SUPPORT.md`, code of conduct, templates, and governance expectations.
- Adopt SemVer (or explicitly document another scheme), changelog, signed/annotated tags, generated release notes, checksums, and release artifacts.
- Make release evidence machine-produced, not a hand-written `RELEASE.md` that goes stale.

---

## 15. Documentation and go-to-market gaps

### Documentation problems

- README is readable but overstates production readiness and offline/model capabilities.
- No hosted product URL is listed.
- No screenshots, demo GIF, user guide, FAQ, troubleshooting for this app, architecture diagram, or deployment guide.
- No documented browser support.
- Node prerequisite is currently wrong because dependency ranges now require Node 20+ for parts of the toolchain.
- Model documentation contains mutually contradicted “100% pass/production ready” claims.
- Improvement, logic-map, and decision-log documents read like task artifacts rather than maintained product documentation.

### Public launch requirements

- Clear audience/problem statement and scope.
- Honest explanation of local-only features and what “verification” means.
- Data freshness timestamp and methodology.
- Supported browsers/platforms.
- Install-command safety disclaimer.
- Privacy/security/support links.
- Screenshots and accessible demo.
- Known limitations.
- Versioned changelog and migration notes.
- Deployment/operator documentation.

### SEO/product identity

- Branding is inconsistent: “CLI-Verse,” “cliever,” and package name `cli-verse:-the-agent-registry`.
- No canonical URL, Open Graph, Twitter card, social image, structured data, or sitemap.
- Shared agent links do not deep-link to an agent; they share only the current SPA URL.
- No route-level metadata exists.

These are not all P0 engineering blockers, but they matter for actually releasing a product rather than uploading a build.

---

## 16. Prioritized completion plan

## Phase 0 — Decide what product is being released

Choose and document one scope:

### Option A: honest static registry + offline rules assistant

- Static, timestamped registry snapshot.
- Scheduled metadata refresh in CI.
- Local reviews/bundles/comparison.
- Clearly labeled rules/retrieval assistant.
- Remove broken checkpoints and model claims.

This is the shortest credible path.

### Option B: full advertised “live verified registry + trained local model”

This requires real metadata infrastructure/rate-limit strategy, evidence-backed verification semantics, valid/reproducible model artifacts, evaluations, and much more operational work.

Do not keep Option A's implementation with Option B's marketing language.

## P0 — Must complete before any public beta

| Work item | Exit criterion |
|---|---|
| Correct product claims | No invented `LIVE`, `VERIFIED`, `UPDATE_AVAILABLE`, `100% integrity`, “production ready,” or “trained” labels. UI/docs define every status. |
| Reproducible toolchain | Tracked lockfile; `npm ci` from a clean checkout; pinned Node/npm; root and nested dependency strategy settled. |
| CI quality gate | Type, lint, unit, registry, E2E, accessibility, security, build, and deploy-smoke jobs required on protected main. |
| Exact command behavior | Install action displays/copies exact validated install command; separate “try” actions if desired; executable bundles contain only commands. |
| Registry refresh | All 108 entries revalidated; 3 archived tools labeled/removed; stars/releases refreshed; metadata timestamp/source visible. |
| Trust model | Verification redesigned as evidence layers; no successful badge without the claimed check succeeding. |
| Model decision | Remove checkpoints/claims, or fix null weights/PRNG/tests/provenance/reproducibility and publish model/data docs. |
| Legal baseline | Standard recognized license, copyright/NOTICE, corpus rights audit, dependency notices/SBOM, privacy/security policies. |
| Deployment contract | Tracked infrastructure config, security headers, caching/compression, public smoke test, rollback. |
| Current E2E proof | Clean 45/45 desktop pass on locked deps plus mobile projects; artifacts retained in CI. |
| Availability | Public URL serves the app reliably, with uptime monitoring and owner. |

## P1 — Required before production

| Work item | Exit criterion |
|---|---|
| Unit/integration coverage | Deterministic tests for sync, verification, storage, search, sanitization, commands, bundles, analytics, and model loader. Meaningful coverage thresholds. |
| Accessibility | WCAG 2.2 AA audit passed; focus management, keyboard semantics, contrast, and responsive defects fixed. |
| Performance | Lazy charts/model, checkpoint strategy, Lighthouse/Web Vitals/mobile/memory budgets. |
| Security hardening | Threat model, CSP/headers, timeout/rate-limit handling, CodeQL/dependency/secret scanning, safe external navigation. |
| Real operations | Uptime, client errors or explicit no-telemetry decision, deploy IDs, alerts, runbook, rollback drill. |
| Storage resilience | Versioned validation/migration for every persisted key, user data clear/export, corruption tests. |
| Documentation | Honest README, user/deploy guides, support/security/privacy, known limitations, browser matrix. |
| Governance | CODEOWNERS, branch protection, issue/PR templates, milestone, release owner/checklist. |

## P2 — Launch quality and growth

- Deep links/routes for agents and comparisons.
- Canonical/Open Graph/social metadata and share images.
- Self-hosted fonts and optional PWA/offline reload if strategically valuable.
- Registry contribution workflow with schema review and automated provenance checks.
- Product analytics that respects privacy and answers real adoption questions.
- User research on platform gate, bundle usability, and trust indicators.
- Public roadmap and deprecation policy.

---

## 17. Definition of done for the first credible release

A release is done only when all of the following are true:

### Product

- [ ] Scope and audience are explicit.
- [ ] Every user-facing trust/status/AI claim is accurate and documented.
- [ ] Registry data has an auditable “as of” timestamp and source.
- [ ] Archived/unmaintained tools are handled intentionally.
- [ ] Install and bundle output is exact, typed, and safety-reviewed.

### Engineering

- [ ] Fresh clone + pinned runtime + `npm ci` is deterministic.
- [ ] CI passes all required checks.
- [ ] Unit/component/E2E/mobile/accessibility/performance tests pass.
- [ ] Model artifacts pass schema/numerical/evaluation checks or are excluded.
- [ ] Build artifacts are checksummed and retained.

### Security/privacy/legal

- [ ] Threat model reviewed.
- [ ] Dependency/code/secret scans pass.
- [ ] CSP/security headers pass automated checks.
- [ ] Privacy disclosure and data controls are published.
- [ ] License is recognized; third-party/model/data provenance is approved.
- [ ] SBOM/notices/checksums are attached to the release.

### Deployment/operations

- [ ] Staging and production are defined as code.
- [ ] Public URL passes external smoke tests.
- [ ] Caching/compression/SPA fallback are correct.
- [ ] Uptime/error/performance monitoring and alert ownership exist.
- [ ] Rollback is documented and tested.

### Release/governance

- [ ] Protected branch and required reviews/checks are enabled.
- [ ] Version/changelog/tag/release notes agree.
- [ ] Tag and release artifacts are immutable.
- [ ] Support and security contacts are live.
- [ ] Known limitations are published.
- [ ] A named release owner signs the checklist.

---

## 18. Recommended immediate next actions

Do these in this order:

1. **Stop using the current `RELEASE.md` as evidence and mark v2.5.0 unreleased.** There is no tag/release and its evidence is not reproducible.
2. **Make the scope decision:** static honest registry (recommended) vs full live/model product.
3. **Track the lockfile, pin Node/npm, and add CI.** This is the foundation for every later claim.
4. **Fix the known command-copy defect and status/verification semantics.** These directly affect user trust and command safety.
5. **Refresh the registry and add scheduled metadata validation.** Label the three archived projects and expose data age.
6. **Remove the current model from the release or put it behind a non-production experimental flag** until null weights, negative PRNG, failing invariants, fake tests, and missing corpus provenance are resolved.
7. **Fix licensing/provenance before making the repo or checkpoints public.**
8. **Define a real deployment in the repo** with headers, cache policy, public smoke tests, monitoring, and rollback.
9. **Complete accessibility/mobile work and current cross-browser tests.**
10. **Then cut a release candidate**, run the full checklist from a clean environment, deploy to staging, obtain product/security/legal sign-off, and only then tag/publish.

---

## 19. Audit limitations

- Playwright browsers could not be downloaded because the browser CDN connection reset, so current browser test bodies were not executed. Historical pass claims were recorded but not accepted as reproducible proof.
- The sandbox could not establish TLS to the 12 non-GitHub registry hosts with curl, so those URLs are inconclusive rather than declared dead. All 96 GitHub URLs were successfully checked through authenticated GitHub API access.
- Some GitHub administration/deployment/security APIs returned integration permission errors. Facts reported as absent were taken from accessible repository contents/API fields; inaccessible settings are called out rather than assumed.
- The Render endpoint's loading page may reflect a transient cold start; the finding is that the application was not externally available during repeated audit requests and no uptime/deploy evidence exists.
- This is a technical release assessment, not legal advice or a substitute for a specialist accessibility/security penetration test.

---

## Bottom line

There is a legitimate application here, and the frontend is much closer to a useful demo than the repository's disorder suggests. But the project is **not finished in the sense that matters for releasing software**: reproducibility, evidence, truthful product semantics, current data, model validity, legal provenance, accessibility, deployment, observability, governance, and rollback.

The fastest credible release is to make it smaller and more honest: ship a timestamped static registry with local utility features, remove the broken model and fake trust/readiness labels, automate data refresh and testing, and establish a real release/deployment process. The full “live verified registry with trained local AI” vision can follow only after its claims are implemented and measured rather than declared.
