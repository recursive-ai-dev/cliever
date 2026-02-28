# Logic Map: CLI AI Tool Expansion

## Objective
Expand the registry with a substantial set of additional CLI AI tools while keeping existing commands untouched and functional. The changes are additive, preserve existing behavior, and widen tool coverage across local inference, automation, and productivity workflows.

## Logic Chain (Steps 1–3 bundled)
### L1 — Coverage Gap Identification
**Why:** The registry leaned heavily on a few flagship tools and lacked breadth across daily CLI workflows and local inference options.  
**How:** Categorized existing agents by capability (terminal productivity, local inference, automation, infrastructure). Identified gaps in:
- **CLI productivity** (prompt utilities, commit assistants, chat clients)
- **Local inference** (CLI runtimes for local models)
- **Infrastructure proxying** (unified APIs for multi-provider LLMs)

### L2 — Expansion With Proof of Non-Destructive Impact
**Why:** The requirement is “expansion only” with no breakage.  
**How:** Added 10 new agents with unique IDs and existing tag vocabulary. Existing entries and commands are untouched.

**Proof of non-destructive change:**  
Let `A` be the original set of agents and `B` be the added set.  
We ensure `A ∩ B = ∅` (unique IDs) and create `A' = A ∪ B`.  
Since no members of `A` were edited or removed, all pre-existing commands remain identical and functional.

### L3 — Consistent Metadata Integrity
**Why:** The UI depends on structured fields (tags, categories, install commands) to render cards, filters, and copy-to-clipboard actions.  
**How:** Each new agent includes complete, validated metadata:
- `id` (unique)
- `name`, `description`, `longDescription`
- `category`, `stars`, `language`
- `installCommand`, `repoUrl`
- `features`, `tags`, `useCases`
- `version`

## Tool Additions (Mapped to Logic Chains)
| Tool | Category | Primary Gap Filled | Logic Chain |
| --- | --- | --- | --- |
| llama.cpp | Terminal Utility | Local inference CLI | L1 → L2 → L3 |
| vLLM | Infrastructure | High-throughput serving | L1 → L2 → L3 |
| LiteLLM | Infrastructure | Provider normalization | L1 → L2 → L3 |
| aichat | Terminal Utility | CLI prompt workflows | L1 → L2 → L3 |
| Mods | Terminal Utility | TUI chat in terminal | L1 → L2 → L3 |
| OpenCommit | Terminal Utility | Git commit automation | L1 → L2 → L3 |
| GPTCommit | Terminal Utility | Commit message generation | L1 → L2 → L3 |
| gptme | Autonomous | Plan/act CLI agent | L1 → L2 → L3 |
| gpt-engineer | Coding Assistant | Spec-driven scaffolding | L1 → L2 → L3 |
| GPTScript | Agent Framework | Scripted CLI workflows | L1 → L2 → L3 |

## Mathematical Rigor Notes
1. **Uniqueness:** Added 10 agents with non-colliding IDs → ensures deterministic lookups.  
2. **Completeness:** Each agent provides 10 required fields → uniform schema across entries.  
3. **Stability:** No removal or modification to existing entries → pre-existing commands remain unchanged.
