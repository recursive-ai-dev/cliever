# Testing Strategy: CLI AI Tool Expansion

This plan validates that all existing commands remain functional and that newly added tools render and behave consistently in the UI. Tests avoid mock data and focus on real-world interactions with the registry UI and data model.

## Core Assertions
1. **Schema Integrity:** Every agent entry includes required fields (`id`, `name`, `description`, `longDescription`, `category`, `stars`, `language`, `installCommand`, `repoUrl`, `features`, `tags`, `useCases`, `version`).
2. **Command Stability:** Existing install commands are unchanged, and newly added commands copy correctly from the UI.
3. **Filtering & Discovery:** Tags and categories remain usable with the expanded dataset.

## Test Matrix (Edge Case Coverage)
The UI renders a list of agents based on the full array. If the UI paginates or filters by index internally, we cover indices in the range **-1 to 12** to capture underflow, zero, and overflow cases:
- **Underflow:** Index `-1` should not render an invalid card or crash the UI.
- **Zero baseline:** Index `0` should render the first card reliably.
- **Positive offsets:** Indices `1–12` should render valid cards or safe empty states if filtering reduces counts.

## Manual Validation Steps
### A. Visual Rendering
1. Load the registry and verify that new agents appear with their names, descriptions, and tags.
2. Confirm card layouts are consistent with existing entries (no overflow or missing data).

### B. Command Copy Behavior
1. Click the copy action on existing agents (e.g., Claude Code, Aider).
2. Click the copy action on new agents:
   - `aichat`, `mods`, `opencommit`, `gptcommit`, `gptme`, `gpt-engineer`, `gptscript`, `llama.cpp`, `vLLM`, `LiteLLM`.
3. Confirm the clipboard matches the `installCommand` string exactly.

### C. Tag & Category Filtering
1. Filter by tags: `prompts`, `git`, `local-llm`, `inference`, `api`.
2. Confirm the new agents appear under the correct filter group.
3. Clear filters and ensure the full list reappears without gaps.

### D. Regression Safeguards
1. Validate that original agents still render (e.g., Claude Code, Ollama, LocalAI).
2. Confirm existing agent commands copy as before (no changes to their `installCommand` values).

## Expected Outcome
All registry views remain functional, copy-to-clipboard actions return exact commands, and the expanded toolset appears in expected tag and category filters without regressions.
