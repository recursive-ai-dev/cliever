import { Agent, AgentCategory } from '../types';
import { TAG_DESCRIPTIONS, REGISTRY_METADATA_AS_OF } from '../constants';
import { THEMES } from '../utils/theme';
import { SORT_OPTIONS } from './appBridge';

/**
 * Everything cliever calls things. Hand-written entries describe the UI and its concepts;
 * entries for tags, themes and categories are generated from the app's own data so they
 * cannot drift from what is on screen.
 */

export interface GlossaryEntry {
  id: string;
  term: string;
  aliases: string[];
  definition: string;
  /** What to say or click to use it. */
  tryIt?: string;
  /** Generated tag entries are common English words; they only match when the user says "tag". */
  weak?: boolean;
}

const entry = (id: string, term: string, aliases: string[], definition: string, tryIt?: string): GlossaryEntry => ({
  id, term, aliases, definition, ...(tryIt ? { tryIt } : {}),
});

export const normalizeTerm = (text: string): string =>
  text.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9+#.\s/-]/g, ' ').replace(/\s+/g, ' ').trim();

const handWritten = (total: number): GlossaryEntry[] => [
  entry('registry', 'Registry', ['registry', 'the registry', 'grid', 'tool list', 'roster'],
    `The main grid of ${total} CLI tools and agents, shown 12 per page. It is filtered by your platform, the search box and the category pills. Metadata (stars, versions, archive flags) was last refreshed ${REGISTRY_METADATA_AS_OF}.`,
    '“search for git”, “show terminal utilities”, “next page”.'),
  entry('platform', 'Platform', ['platform', 'architecture', 'select architecture', 'platform gate', 'os', 'operating system'],
    'Your operating system — macOS, Linux or Windows — chosen on the first screen (“Select Architecture”). The registry only shows tools whose install command works there, and install commands are tailored to it. Change it any time from the platform button in the top bar.',
    '“switch to linux”.'),
  entry('page', 'Page / sector', ['page', 'pages', 'pagination', 'sector', 'sectors', 'next page'],
    'The grid shows 12 tools per page. “Sector 3/14” in the chat context is the same thing: page 3 of 14.',
    '“next page”, “go to page 4”.'),
  entry('category', 'Category', ['category', 'categories', 'category filter', 'category pill', 'pills'],
    `Every tool belongs to one category: ${Object.values(AgentCategory).join(', ')}. The category pills filter the grid and show how many tools match your search in each.`,
    '“show coding assistants”.'),
  entry('search', 'Search', ['search', 'search box', 'search registry', 'search bar'],
    'The search box filters the registry as you type. It matches names, descriptions, categories, languages, tags, features and use cases, treats related words as synonyms, and tolerates small typos. Press “/” to jump to it.',
    '“search for docker”.'),
  entry('sort', 'Sort', ['sort', 'sorting', 'sort by', 'sort options'],
    `The sort menu orders the grid: ${SORT_OPTIONS.join(', ')}. “Verified (First)” ranks VERIFIED tools above DEGRADED, UNVERIFIED and FAILED ones, then by stars.`,
    '“sort by name”.'),
  entry('stars', 'Stars', ['stars', 'star count', 'stars source', 'github stars', 'popularity'],
    'The GitHub star count for a tool’s repository, used as a popularity signal. The source is REGISTRY (the value shipped with the app), GITHUB_API (refreshed live by verification) or UNKNOWN.'),
  entry('agent-card', 'Agent card', ['agent card', 'card', 'cards', 'tool card'],
    'One tile in the grid. It shows the tool’s name, status and verification badges, a short description, tags and its install command, plus buttons to recruit it to your squad, add it to your bundle, queue it for comparison, view details, open its repository, or copy its install command.'),
  entry('status', 'Status', ['status', 'statuses', 'status badge', 'live', 'syncing', 'update available', 'update_available', 'offline badge'],
    'The badge on each card from the last repository check. LIVE: the repository is reachable. UPDATE_AVAILABLE: it was pushed to recently (within 45 days). SYNCING: a check is running. OFFLINE: the repository could not be reached.',
    '“sync the registry”.'),
  entry('sync', 'Sync', ['sync', 'force sync', 'force sync registry', 'sync registry', 'registry sync', 'last status check', 'status check'],
    'Force sync asks each tool’s repository whether it is still reachable and recently active (GitHub API for GitHub repos, a lightweight probe for others), with caching and a circuit breaker; if you are offline it falls back to a deterministic estimate. The “Last status check” time updates when it finishes.',
    '“sync the registry”.'),
  entry('verification', 'Verification', ['verification', 'verified', 'unverified', 'degraded', 'failed', 'verification status', 'verify', 'verify visible agents'],
    'A local trust check. The repo URL and install command must each pass a safe allow-list. VERIFIED: both pass. DEGRADED: the install command is not on the allow-list. FAILED: the repo URL is unsafe. UNVERIFIED: not checked yet. GitHub metadata (stars, last update) is attached when reachable. Verify visible agents checks the current page.',
    '“verify the visible agents”.'),
  entry('archived', 'Archived', ['archived', 'archive', 'archived flag', 'unmaintained'],
    'A flag on tools whose upstream repository has been archived and is no longer maintained. They stay listed for reference and are marked on the card.'),
  entry('install-command', 'Install command', ['install command', 'install commands', 'platform commands', 'copy install', 'manual step', 'manual steps'],
    'The shell command that installs a tool, adapted to your platform when the tool has platform-specific variants (Windows, macOS, Linux, Docker). Some tools have a manual step instead of a command; those are shown as instructions and are commented out in bundles.',
    '“install ripgrep”.'),
  entry('details', 'Detail view', ['detail view', 'details', 'agent detail', 'detail layer', 'tool details', 'detail panel'],
    'The full page for one tool: description, features, use cases, install guides per platform, troubleshooting tips, an install-error diagnoser, Generate Intel, a Kira chat scoped to that tool, user reviews and share buttons. Esc closes it.',
    '“open lazygit”.'),
  entry('intel', 'Generate Intel', ['generate intel', 'intel', 'technical analysis', 'analysis'],
    'The button in the detail view that writes a Technical Analysis of the tool offline: key capabilities, strengths, setup notes and use-case fit, built from the registry entry.'),
  entry('diagnose', 'Install diagnosis', ['diagnose', 'install error', 'installation error', 'diagnose install', 'troubleshooting', 'troubleshoot'],
    'In the detail view, paste an installation error message and press Diagnose. The app matches it against known failure patterns and suggests fixes; Show Troubleshooting Tips lists the tool’s own known issues.'),
  entry('comparison', 'Comparison Engine', ['comparison', 'comparison engine', 'comparison queue', 'compare', 'analyze', 'agent a', 'agent b'],
    'Queue two tools with “Add to comparison” on their cards (Agent A and Agent B) and press Analyze for a metric-by-metric comparison plus a written Comparison Analysis. Adding a third replaces the oldest.',
    '“add lazygit to comparison”, “open comparison”.'),
  entry('squad', 'Squad', ['squad', 'recruit', 'recruit to squad', 'recruits'],
    'The set of tools you have recruited with “Recruit to squad”. A squad is the team Mission Control plans a task for.',
    '“recruit aider”.'),
  entry('mission-control', 'Mission Control', ['mission control', 'collaboration', 'multi-agent', 'multi agent', 'mission objective', 'collaboration plan', 'squad collaboration plan'],
    'The multi-agent collaboration simulator. Describe an objective, press Execute, and it writes a Squad Collaboration Plan assigning roles and steps across your recruited tools. It is an offline simulation; nothing is run.',
    '“open mission control”.'),
  entry('bundle', 'Bundle', ['bundle', 'bundles', 'take bundle', 'add to bundle', 'bundle output'],
    'A shopping list of tools. Add tools with “Add to bundle”, then Take bundle turns their install commands into one script for Windows, macOS or Linux, with manual steps commented out. Your bundle is remembered in this browser.',
    '“add ripgrep to bundle”, “take bundle”.'),
  entry('command-generator', 'Shell Command Generator', ['shell command generator', 'command generator', 'natural language shell', 'shell generator', 'generated command', 'generated output'],
    'Describe a shell task in plain language (“find all PDFs modified in the last 7 days”) and it writes a command. Input is sanitized and dangerous patterns are rejected; always review a command before running it.',
    '“open the shell generator”.'),
  entry('telemetry', 'System Telemetry', ['telemetry', 'system telemetry', 'analytics', 'health', 'metrics', 'readiness'],
    'A local dashboard of the app’s own health: performance and readiness scores, GitHub API usage and circuit-breaker state, the status cache, storage use and log counts. You can copy the JSON or reset the counters. Nothing leaves your browser.',
    '“open telemetry”.'),
  entry('circuit-breaker', 'Circuit breaker', ['circuit breaker', 'circuit', 'rate limit', 'rate limiting'],
    'A guard around GitHub API calls: after repeated failures it opens and stops calling for 15 seconds so the app does not hammer a failing or rate-limited API. Its state (closed/open) is shown in System Telemetry.'),
  entry('status-cache', 'Status cache', ['status cache', 'cache', 'cache age'],
    'Repository check results are kept for 5 minutes so repeated syncs do not re-query every repository.'),
  entry('theme', 'Theme', ['theme', 'themes', 'theme selector', 'colors', 'colours', 'appearance'],
    `Colour schemes: ${Object.values(THEMES).map(t => `${t.name} (${t.description.toLowerCase()})`).join('; ')}. Pick one from the palette button in the top bar; it is remembered.`,
    '“use the synthwave theme”.'),
  entry('reviews', 'Reviews', ['review', 'reviews', 'rating', 'ratings', 'display name'],
    'Community-style reviews on a tool’s detail page. They are stored only in your browser: you choose a display name, write a review with a 1–5 rating, and can delete your own. They can be copied as JSON.'),
  entry('kira', 'Kira', ['kira', 'chat', 'system chat', 'assistant', 'the chatbot', 'chatbot', 'expert', 'expert analysis'],
    'The assistant you are talking to. Kira chats and remembers what you tell her; a registry skill answers find / what-is / install / compare questions from the roster; and chat commands can drive the app itself. Everything is rule-based and offline — no LLM, no network. System Chat is the panel in the corner; the terminal on the home screen and each tool’s detail page have their own windows into the same engine.',
    '“what can you do”.'),
  entry('offline', 'Offline-first', ['offline', 'offline first', 'privacy', 'no backend', 'local storage', 'localstorage'],
    'cliever has no backend and needs no API keys. Search, chat, analysis and comparisons all run in your browser; your bundle, reviews, theme and chat history are stored in this browser only. The only network calls are optional repository checks when you sync or verify.'),
  entry('shortcuts', 'Keyboard shortcuts', ['shortcut', 'shortcuts', 'keyboard', 'hotkeys', 'keys'],
    '“/” focuses the search box. Esc closes the open panel or detail view. Cards open from the keyboard with Enter.'),
  entry('metadata-date', 'Metadata date', ['metadata date', 'metadata', 'as of', 'metadata as of'],
    `The date star counts, versions and archive flags were last refreshed from upstream: ${REGISTRY_METADATA_AS_OF}.`),
];

const generated = (): GlossaryEntry[] => {
  const tags = Object.entries(TAG_DESCRIPTIONS).map(([tag, description]) => ({
    id: `tag:${tag}`,
    term: `${tag} (tag)`,
    aliases: [tag, tag.replace(/-/g, ' '), `${tag} tag`, `the ${tag} tag`],
    definition: description,
    weak: true,
  }));
  const categories = Object.values(AgentCategory).map(category => ({
    id: `category:${category}`,
    term: category,
    aliases: [normalizeTerm(category)],
    definition: `A registry category. Filter to it with “show ${normalizeTerm(category)}”.`,
    weak: true,
  }));
  const themes = Object.values(THEMES).map(t => ({
    id: `theme:${t.id}`,
    term: `${t.name} theme`,
    aliases: [t.id, normalizeTerm(t.name), `${t.id} theme`],
    definition: `${t.name}: ${t.description}. Apply it with “use the ${t.id} theme”.`,
    weak: true,
  }));
  return [...tags, ...categories, ...themes];
};

export interface Glossary {
  entries: GlossaryEntry[];
  /** alias -> entry, longest aliases first for greedy matching. */
  aliases: Array<{ alias: string; entry: GlossaryEntry }>;
}

export const buildGlossary = (agents: Agent[]): Glossary => {
  const entries = [...handWritten(agents.length), ...generated()];
  const aliases = entries
    .flatMap(e => [...new Set([normalizeTerm(e.term), ...e.aliases.map(normalizeTerm)])].map(alias => ({ alias, entry: e })))
    .filter(a => a.alias.length > 0)
    .sort((a, b) => b.alias.length - a.alias.length);
  return { entries, aliases };
};

const cache = new WeakMap<Agent[], Glossary>();
const glossaryFor = (agents: Agent[]): Glossary => {
  let g = cache.get(agents);
  if (!g) { g = buildGlossary(agents); cache.set(agents, g); }
  return g;
};

const DEFINE_CUE = /^(?:what is|what s|whats|what are|what does|what do|whats the|what is the|explain|define|describe|tell me about|how does|how do|how do i use|how to use|meaning of|what is a|what is an|what are the|what s a|what s an|whats a|whats an|help with|about)\s+(?:the |a |an |my |these |those )?(.+?)(?:\s+(?:mean|do|work|means|for|is for|used for|about))?$/;

const OVERVIEW = /^(?:help|help me|what can i do(?: here)?|what can this (?:app|site|thing) do|what is this(?: app| site| place)?|what is cliever|features|what features (?:are there|do you have)|how do i use (?:this|the app|cliever|this app)|tour|show me around|give me a tour|what s (?:here|in here)|commands|what commands (?:are there|can i use)|what can i ask)$/;

const overview = (agents: Agent[]): string =>
  [
    `### cliever`,
    '',
    `A registry of ${agents.length} CLI coding agents and terminal tools, running entirely in your browser. Here's the map:`,
    '',
    '- **Registry grid** — browse, search, sort and filter by category; limited to your platform.',
    '- **Agent cards / detail view** — install commands, guides, troubleshooting, Generate Intel, reviews.',
    '- **Comparison Engine** — queue two tools and analyze them side by side.',
    '- **Squad + Mission Control** — recruit tools and simulate a multi-agent plan.',
    '- **Bundle** — collect install commands into one script.',
    '- **Shell Command Generator** — plain language to shell command.',
    '- **System Telemetry** — the app’s own health dashboard.',
    '- **Themes, sync and verification** — look, repository checks, and trust badges.',
    '',
    'Ask “what is <anything above>” for details. I can also drive the app:',
    '- “search for git”, “show terminal utilities”, “sort by name”, “next page”, “clear filters”',
    '- “open lazygit”, “add aider to comparison”, “recruit goose”, “add ripgrep to bundle”',
    '- “open comparison”, “open mission control”, “take bundle”, “open telemetry”',
    '- “switch to macos”, “use the synthwave theme”, “sync the registry”, “verify the visible agents”',
    '- “where am I” for a summary of the current view',
  ].join('\n');

const formatEntry = (e: GlossaryEntry): string => {
  const lines = [`### ${e.term}`, '', e.definition];
  if (e.tryIt) lines.push('', `Try: ${e.tryIt}`);
  return lines.join('\n');
};

export interface AppKnowledgeAnswer {
  topic: string;
  body: string;
}

export const answerAppQuestion = (agents: Agent[], query: string): AppKnowledgeAnswer | null => {
  const q = normalizeTerm(query);
  if (!q) return null;

  if (OVERVIEW.test(q)) return { topic: 'app', body: overview(agents) };

  if (/^(?:list|show|what are|what)(?: all)?(?: the)? (?:tags|themes|categories|sort options|statuses|verification statuses)\??$/.test(q) ||
      /^(?:which|what) (?:tags|themes|categories|sort options|statuses) (?:are there|exist|do you have|can i use)$/.test(q)) {
    if (/tags/.test(q)) {
      const tags = Object.keys(TAG_DESCRIPTIONS).sort();
      return { topic: 'app', body: `### Tags\n\n${tags.length} tags label tools. Ask “what does the <tag> tag mean”.\n\n${tags.join(', ')}` };
    }
    if (/themes/.test(q)) return { topic: 'app', body: formatEntry(handWritten(agents.length).find(e => e.id === 'theme')!) };
    if (/categories/.test(q)) return { topic: 'app', body: formatEntry(handWritten(agents.length).find(e => e.id === 'category')!) };
    if (/sort/.test(q)) return { topic: 'app', body: formatEntry(handWritten(agents.length).find(e => e.id === 'sort')!) };
    return { topic: 'app', body: formatEntry(handWritten(agents.length).find(e => e.id === 'status')!) + '\n\n' + formatEntry(handWritten(agents.length).find(e => e.id === 'verification')!) };
  }

  const glossary = glossaryFor(agents);
  const cue = DEFINE_CUE.exec(q);
  const phrase = (cue?.[1] ?? q).trim();
  const mentionsTag = /\btags?\b/.test(q);
  const bare = !cue && phrase.split(' ').length <= 3;
  if (!cue && !bare) return null;

  // Exact phrase first, so “mission control” is never mistaken for the shorter “control”.
  const stripped = phrase.replace(/\b(?:the|a|an)\b/g, ' ').replace(/\b(?:tag|tags)\b/g, ' ').replace(/\s+/g, ' ').trim();
  const tagAllowed = mentionsTag || /\b(?:mean|means|meaning)\b/.test(q);
  for (const { alias, entry: e } of glossary.aliases) {
    if (e.id.startsWith('tag:') && !tagAllowed) continue;
    if (phrase === alias || stripped === alias) return { topic: 'app', body: formatEntry(e) };
  }

  // Containment (“what does the mission objective box do”) only when the user asked a question.
  if (cue) {
    for (const { alias, entry: e } of glossary.aliases) {
      if (e.weak || alias.length < 4) continue;
      if (new RegExp(`(?:^|\\s)${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\s|$)`).test(phrase)) return { topic: 'app', body: formatEntry(e) };
    }
  }
  return null;
};
