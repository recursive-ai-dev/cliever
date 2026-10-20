# Changelog

## 2.8.0 — 2026-10-20

### Kira knows the app, and can run it

- **Terminology** (`services/appKnowledge.ts`): ask "what is a squad", "what does DEGRADED mean", "what is the circuit breaker", "what does the tui tag mean", "list themes", or just "help". About 30 hand-written entries cover the registry, platform, pages, search, sort, status, sync, verification, comparison, squad / Mission Control, bundle, shell generator, telemetry, themes, reviews and offline behaviour. Entries for every tag, theme and category are generated from the app's own data, so they cannot drift from the UI.
- **Commands** (`services/appCommands.ts`, `services/appBridge.ts`): chat now drives the real UI. "search for git", "show terminal utilities", "sort by name", "next page", "go to page 3", "clear filters", "open lazygit", "add aider to comparison", "recruit goose", "add ripgrep to my bundle", "open comparison of aider and goose", "open mission control", "take bundle", "open telemetry", "switch to macos", "use the synthwave theme", "sync the registry", "verify the visible agents", "where am I". Replies state what actually happened (result counts, refusals such as "the Comparison Engine needs two tools").
- **Routing** is now: pending Kira clarification → app commands → conversation → app terminology → registry skill → how-to knowledge base → Kira.
- Kira's own capabilities text mentions app control (model hash and dialogue assets rebuilt).
- **Tests:** 18 new unit tests (command parsing and execution against a fake controller, glossary coverage of every tag) and 5 new end-to-end tests that watch the UI change.

## 2.7.0 — 2026-10-20

### Chat: LaPoet → Kira

The registry chat is now **Kira**, an offline, deterministic dialogue engine (Apache-2.0, vendored in `kira/`), plus a registry skill that answers from the 159-tool roster. No LLM, no network.

- **Routing:** conversation and memory go to Kira ("hello", "I like docker", "what do you remember about me"). Find / what-is / install / compare questions are answered from the registry (`services/registrySkill.ts`). Generic how-to questions use the knowledge base plus the bundled CLI corpus. Anything else falls back to Kira.
- **Kira configuration:** default persona is `direct`; her capabilities and about text describe the CLI registry; references to the standalone app's "Engine lab" were removed. The model hash and dialogue version were updated (`dialogue/4.2.0-cliever`). Her lexicon is the stock compiled artifact, so she doesn't know CLI vocabulary; the registry skill covers that.
- **Runtime:** Kira loads lazily in a Web Worker (inline fallback). The conversation is stored as a replayable, checksummed event log in `localStorage` and verified on load.
- **Removed:** the LaPoet checkpoints (`public/lapoet/*checkpoint*`, ~15 MB), the ULE runtime path and `lapoetTrainedService`, and the `lapoet:train-poems` trainer. `model/lapoet-main` is kept as an upstream snapshot (synced with the fixed AG-TUNE engine). CLI corpora moved to `public/corpus/`.
- **Tests:** `npm test` now runs registry validation, Kira's own suite (48 tests), the Kira module staleness check and new unit tests for the registry skill and Kira service. E2E covers registry answers and Kira memory.

## 2.6.0 — 2026-10-18

### Roster: 108 → 159 tools

**Added: 53 tools.** Every install command was checked against its package registry (npm, PyPI, crates.io, Homebrew, Scoop) or the project's own README.

- **Coding agents:** OpenAI Codex CLI, opencode, goose, Cursor CLI, Kilo Code CLI, Continue CLI, Kimi Code CLI, Letta Code, Claude Squad, ccusage
- **AI context & frameworks:** Spec Kit, MCP Inspector, Repomix, Gitingest, MLX LM, RamaLama, CrewAI, smolagents, LangGraph CLI
- **Shells & terminal:** Atuin, Zellij, tmux, Nushell, fish, Gum, Oh My Posh, Fastfetch
- **Developer workflow:** uv, mise, direnv, hyperfine, tokei, chezmoi, calcurse
- **Data, HTTP & search:** xh, Posting, Harlequin, VisiData, Television, ast-grep, presenterm
- **Security, network & infra:** Trivy, Gitleaks, age, Trippy, gping, croc, rclone, btop, gh-dash, Jujutsu, FFmpeg, cava

**Removed: 2 entries that did not belong in a curated registry.**
- `pulstack`: a hobby project with a single GitHub star.
- `vibe-coding-guide`: a guide, not a tool. Its "install command" was an `echo`.

**Corrected: stale or wrong data in existing entries.**
- **Claude Code:** now uses the native installer. The npm install is deprecated upstream.
- **Amazon Q CLI → Kiro CLI:** the old `amazon-q` cask no longer exists.
- **Grok CLI:** the npm package was renamed to `grok-dev`. The install now uses the official script.
- **Install paths updated to match upstream READMEs:** Copilot CLI, Gemini CLI, Qwen Code, OpenHands, Mistral Vibe, DeepCode, gptme, aider, llama.cpp, llamafile, Fabric, asciinema.
- **Wrong implementation languages fixed:** Gemini CLI, GPTCommit, asciinema, Wave Terminal, Kiro CLI, Copilot CLI.
- **Moved repositories:** `ggml-org/llama.cpp`, `mozilla-ai/llamafile`, `ccusage/ccusage`.
- **Repository links instead of marketing sites:** Ollama, LocalAI, Jan, LLM, AWS CLI, Warp, Open Interpreter, LM Studio (`lms`). This lets verification and star counts work for them.
- **Star counts and versions refreshed for every entry.** Stars come from GitHub metadata. Versions come from the package registry that the install command actually uses.
- **Unverifiable star counts for non-GitHub projects removed.** These now show "—" instead of a made-up number.
- **Archived upstream projects flagged** with a new `archived` field: Mods, gpt-engineer, GPTScript.

### Polish & correctness
- **Copy is now exact.** Global `npm install -g …` commands were silently rewritten to `npx --yes …` before copying, which went against the documented contract. Copy buttons now copy the stored command verbatim.
- **Bundle scripts stay runnable.** Prose steps such as "Download AppImage…" are emitted as `# Manual step:` comments. Commands that don't run natively on the selected OS (for example `curl … | bash` on Windows) are also commented out, with an explanation.
- **Platform filter:** pipe-to-shell installers no longer count as Windows-compatible.
- **Search:**
  - Short queries now work. `gpt`, `cpp`, and `cla` previously returned nothing.
  - Hyphenated and dotted names are split into parts.
  - Tool names match by prefix as you type.
  - Short multi-word queries like "claude code" require every term to match, so they no longer return 40 loosely related results.
- **Registry UI:**
  - 12 tools per page (was 6).
  - Live counts on category pills, and empty categories are hidden.
  - A "Showing X–Y of N" summary.
  - An empty state with a one-click "Clear filters".
  - Searching resets to page 1.
  - Changing pages scrolls back to the top of the grid.
  - `/` focuses search, and Esc clears it.
  - The registry metadata date is shown.
- **Archived tools:** badge on cards and a warning banner in the detail view.
- **Closed-source tools** show "—" for stars. Links read "Visit Website" instead of "Access Repository" when there is no GitHub repo.
- **Accessibility:**
  - Cards can be opened with the keyboard.
  - Icon-only buttons now have accessible names.
  - Visible focus ring everywhere.
  - Skip link.
  - `aria-pressed` on filter and OS toggles.
  - Live region for result counts.
  - Muted text color raised to at least 4.5:1 contrast in all four themes (was 2.4–3.7:1).
- **Mobile:** the sticky nav no longer wraps into two tall rows. Tool buttons scroll horizontally instead.
- **Security hygiene:** external links open with `noopener,noreferrer`.
- **Chat history from localStorage** is validated before use.
- **Honest status messages:** the sync message no longer claims "INTEGRITY 100%", and the greeting no longer claims "direct metadata pulling".
- **The registry gate (`npm test`) mirrors the runtime validator's limits.** An entry that passes the gate can no longer be silently dropped at boot. The gate also checks `archived`, `platformCommands`, the metadata date, and that every primary install command is a real command.
- **E2E coverage:** new tests for exact copy, manual-step bundling, the empty state, the `/` shortcut, keyboard card opening, and archived flags.
