import { Agent, AgentCategory } from '../types';
import { THEMES } from '../utils/theme';
import type { Platform } from '../utils/platform';
import type { AppController, AppSnapshot, ListName, PanelName, SortOption } from './appBridge';

/**
 * Natural-language app commands. `parseAppCommand` is pure (text + registry in, command out);
 * `runAppCommand` applies a command to an AppController and returns the chat reply.
 */

export type AppCommand =
  | { kind: 'search'; query: string }
  | { kind: 'category'; category: string }
  | { kind: 'sort'; sort: SortOption }
  | { kind: 'page'; target: 'next' | 'prev' | number }
  | { kind: 'clearFilters' }
  | { kind: 'openAgent'; agent: Agent }
  | { kind: 'openPanel'; panel: PanelName }
  | { kind: 'close' }
  | { kind: 'membership'; list: ListName; agents: Agent[]; member: boolean }
  | { kind: 'clearList'; list: ListName }
  | { kind: 'openComparison'; agents: Agent[] }
  | { kind: 'platform'; platform: Platform }
  | { kind: 'theme'; theme: string }
  | { kind: 'sync' }
  | { kind: 'verify' }
  | { kind: 'status'; about: 'view' | ListName };

const normalize = (text: string): string =>
  text.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9+#.\s-]/g, ' ').replace(/\s+/g, ' ').trim();

const escapeRegExp = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Polite lead-ins that carry no meaning: "please", "can you", "i want to", "let's"... */
const LEAD_IN = /^(?:(?:hey |ok |okay |kira )?(?:please |pls )?(?:can you |could you |would you |will you )?(?:please )?(?:i want to |i d like to |id like to |i wanna |lets |let us |go ahead and |just )?)/;

const PANEL_ALIASES: Array<[PanelName, RegExp]> = [
  ['missionControl', /\b(mission control|squad (?:panel|view|window)|collaboration(?: layer| panel)?|the squad)\b/],
  ['commandGenerator', /\b(shell (?:command )?generator|command generator|shell tool)\b/],
  ['telemetry', /\b(telemetry|system health|health dashboard|metrics dashboard)\b/],
  ['bundle', /\b(take bundle|the bundle|my bundle|bundle (?:panel|view|output)|install bundle)\b/],
  ['comparison', /\b(comparison|compare (?:panel|view|engine|layer)|comparison engine|analy[sz]e (?:the )?(?:queue|comparison))\b/],
];

const PLATFORMS: Array<[Platform, RegExp]> = [
  ['macos', /\b(mac|macos|mac os|osx|os x|darwin)\b/],
  ['linux', /\b(linux|ubuntu|debian|fedora|arch)\b/],
  ['windows', /\b(windows|win11|win10|powershell)\b/],
];

const SORT_ALIASES: Array<[SortOption, RegExp]> = [
  ['Stars (Low-High)', /\b(least (?:starred|popular)|lowest stars|stars? (?:low(?:est)? (?:to|-) ?high(?:est)?|ascending))\b/],
  ['Stars (High-Low)', /\b(most (?:starred|popular)|highest stars|stars?(?: high(?:est)? (?:to|-) ?low(?:est)?| descending)?|popularity|popular first)\b/],
  ['Name (Z-A)', /\b(name z (?:to|-) ?a|z (?:to|-) ?a|reverse alphabetical|alphabetical(?:ly)? reverse|descending name)\b/],
  ['Name (A-Z)', /\b(name a (?:to|-) ?z|a (?:to|-) ?z|alphabetical(?:ly)?|by name|name)\b/],
  ['Verified (First)', /\b(verified(?: first)?|verification|trusted first)\b/],
];

const categoryPhrases = (): Array<[string, string]> => {
  const out: Array<[string, string]> = [];
  for (const category of Object.values(AgentCategory)) {
    const norm = normalize(category);
    out.push([category, norm]);
    // "Terminal Utility" is also asked for as "terminal utilities"; "Coding Assistant" as "coding assistants".
    const plural = norm.replace(/y$/, 'ie') + 's';
    out.push([category, plural]);
    out.push([category, norm + 's']);
    if (norm.includes('/')) for (const part of norm.split('/')) out.push([category, part.trim()]);
  }
  return out.sort((a, b) => b[1].length - a[1].length);
};

const findAgents = (agents: Agent[], q: string): Agent[] => {
  const hits: Array<{ agent: Agent; at: number }> = [];
  let rest = ` ${q} `;
  const index = agents
    .flatMap(agent => [normalize(agent.name), normalize(agent.id.replace(/-/g, ' '))].filter(n => n.length >= 2).map(n => ({ agent, n })))
    .sort((a, b) => b.n.length - a.n.length);
  const seen = new Set<string>();
  for (const { agent, n } of index) {
    if (seen.has(agent.id)) continue;
    const m = new RegExp(`(?:^|\\s)${escapeRegExp(n)}(?:\\s|$)`).exec(rest);
    if (!m) continue;
    seen.add(agent.id);
    hits.push({ agent, at: m.index });
    rest = rest.slice(0, m.index) + ' '.repeat(m[0].length) + rest.slice(m.index + m[0].length);
  }
  return hits.sort((a, b) => a.at - b.at).map(h => h.agent);
};

const LIST_WORDS: Array<[ListName, RegExp]> = [
  ['compare', /\b(?:comparison|compare)(?: queue| list| slots?)?\b/],
  ['squad', /\b(?:squad|mission control|team)\b/],
  ['bundle', /\bbundle\b/],
];

const listIn = (q: string): ListName | null => {
  for (const [list, re] of LIST_WORDS) if (re.test(q)) return list;
  return null;
};

export const parseAppCommand = (text: string, agents: Agent[]): AppCommand | null => {
  const full = normalize(text);
  if (!full) return null;
  const q = full.replace(LEAD_IN, '').trim();
  if (!q) return null;

  // --- read-only status ------------------------------------------------------------------
  if (/^(?:whats|what is|what are|show|list|tell me) (?:in |inside |on )?(?:my |the |current )?(bundle|squad|comparison(?: queue)?|compare queue)\b/.test(q) ||
      /^(?:whats|what is) (?:in )?(?:my )?(bundle|squad|comparison(?: queue)?)\b/.test(q)) {
    return { kind: 'status', about: listIn(q) ?? 'bundle' };
  }
  if (/^(?:where am i|whats on screen|what am i (?:looking at|seeing)|current (?:view|filters?|state)|show (?:me )?(?:the )?(?:current )?(?:view|filters?|state)|status of (?:the )?(?:app|view))\b/.test(q)) {
    return { kind: 'status', about: 'view' };
  }

  // --- clearing / closing ---------------------------------------------------------------
  if (/^(?:clear|reset|remove) (?:all )?(?:the |my )?filters?\b/.test(q) || /^(?:show|list) (?:me )?(?:all|everything)(?: tools| agents)?$/.test(q) || q === 'reset search' || q === 'clear search') {
    return { kind: 'clearFilters' };
  }
  const clearList = /^(?:clear|empty|reset) (?:all )?(?:the |my )?(.+)$/.exec(q);
  if (clearList?.[1]) {
    const list = listIn(clearList[1]);
    if (list) return { kind: 'clearList', list };
  }
  if (/^(?:close|dismiss|hide|exit)(?: (?:this|that|it|everything|all|the (?:panel|window|layer|modal|dialog)|panels?|windows?))?$/.test(q)) {
    return { kind: 'close' };
  }

  // --- navigation -------------------------------------------------------------------------
  if (/^(?:go to |show |open )?(?:the )?next page$/.test(q) || q === 'next') return { kind: 'page', target: 'next' };
  if (/^(?:go to |show |open |go )?(?:the )?(?:previous|prev|last|back to the previous) page$/.test(q) || q === 'previous' || q === 'prev') return { kind: 'page', target: 'prev' };
  const page = /^(?:go (?:back )?to |go back to |back to |show |open |jump to )?page (\d{1,3})$/.exec(q);
  if (page?.[1]) return { kind: 'page', target: Number(page[1]) };

  // --- platform ---------------------------------------------------------------------------
  const plat = /^(?:switch|change|set|use|go|move)(?: the)?(?: platform| os| system)?(?: to| for| over to)? (.+)$/.exec(q) ??
    /^(?:show|filter)(?: me)?(?: tools| agents)? (?:that )?(?:for|on|work on|run on|install on) (.+)$/.exec(q);
  if (plat?.[1]) {
    for (const [platform, re] of PLATFORMS) if (re.test(plat[1]) && plat[1].split(' ').length <= 4) return { kind: 'platform', platform };
  }

  // --- theme ------------------------------------------------------------------------------
  if (/\b(?:theme|skin|colou?rs?|look|appearance)\b/.test(q) || /^(?:switch|change|set|use|apply) (?:to )?(?:the )?(default|synthwave|h3llscape|hellscape|m4trix|matrix)\b/.test(q)) {
    const wanted = q.replace('hellscape', 'h3llscape').replace(/\bmatrix\b/, 'm4trix');
    for (const [id, theme] of Object.entries(THEMES)) {
      if (new RegExp(`\\b${escapeRegExp(id)}\\b`).test(wanted) || wanted.includes(normalize(theme.name))) return { kind: 'theme', theme: id };
    }
  }

  const makeIt = /^make it (default|synthwave|h3llscape|hellscape|m4trix|matrix)$/.exec(q);
  if (makeIt?.[1]) return { kind: 'theme', theme: makeIt[1].replace('hellscape', 'h3llscape').replace('matrix', 'm4trix') };

  // --- sync / verify -----------------------------------------------------------------------
  if (/^(?:force )?(?:sync|refresh|check)(?: the)?(?: registry| repos| repositories| status| statuses| all)?(?: now)?$/.test(q) || /^(?:run|start|do|force) (?:a )?(?:registry )?(?:sync|status check)$/.test(q)) return { kind: 'sync' };
  if (/^(?:verify|validate)(?: the)?(?: visible| shown| these| current| listed)?(?: agents| tools| entries| page)?$/.test(q) || /^(?:run|start|do) (?:a )?verification$/.test(q)) return { kind: 'verify' };

  // --- sorting ----------------------------------------------------------------------------
  const sort = /^(?:sort|order|rank|arrange)(?: (?:the )?(?:tools|agents|results|list|registry))?(?: by| on)? (.+)$/.exec(q);
  if (sort?.[1]) {
    for (const [option, re] of SORT_ALIASES) if (re.test(sort[1])) return { kind: 'sort', sort: option };
  }

  // --- list membership: add/remove --------------------------------------------------------
  const add = /^(?:add|put|queue|recruit|include|stage|pick)\s+(.+?)\s+(?:to|into|in|for|on)\s+(?:my |the |your )?(.+)$/.exec(q);
  if (add?.[1] && add[2]) {
    const list = listIn(add[2]);
    const hits = findAgents(agents, add[1]);
    if (list && hits.length) return { kind: 'membership', list, agents: hits, member: true };
  }
  const recruit = /^recruit (.+)$/.exec(q);
  if (recruit?.[1]) {
    const hits = findAgents(agents, recruit[1]);
    if (hits.length) return { kind: 'membership', list: 'squad', agents: hits, member: true };
  }
  const remove = /^(?:remove|drop|take|delete|unqueue|dismiss)\s+(.+?)\s+(?:from|out of|off)\s+(?:my |the |your )?(.+)$/.exec(q);
  if (remove?.[1] && remove[2]) {
    const list = listIn(remove[2]);
    const hits = findAgents(agents, remove[1]);
    if (list && hits.length) return { kind: 'membership', list, agents: hits, member: false };
  }

  // --- open the comparison with specific tools ---------------------------------------------
  const cmp = /^(?:open|show|launch|start|run|set up|setup)\s+(?:a |the )?(?:comparison|compare)(?: engine| panel| layer)?\s+(?:of|between|for|with|on)\s+(.+)$/.exec(q);
  if (cmp?.[1]) {
    const hits = findAgents(agents, cmp[1]);
    if (hits.length >= 2) return { kind: 'openComparison', agents: hits.slice(0, 2) };
  }

  // --- open panels ------------------------------------------------------------------------
  const open = /^(?:open|show|launch|start|bring up|pull up|display|go to|take me to|fire up)\s+(?:me )?(?:up )?(?:the |my |a )?(.+)$/.exec(q);
  if (open?.[1]) {
    for (const [panel, re] of PANEL_ALIASES) if (re.test(open[1]) && open[1].split(' ').length <= 5) return { kind: 'openPanel', panel };
  }
  if (/^take (?:the |my )?bundle$/.test(q)) return { kind: 'openPanel', panel: 'bundle' };

  // --- open an agent's detail view ---------------------------------------------------------
  const detail = /^(?:open|show|view|pull up|bring up|go to|take me to)\s+(?:me )?(?:the )?(?:details?|detail view|page|card|info|listing)?\s*(?:for|of|on)?\s*(.+)$/.exec(q);
  if (detail?.[1]) {
    const hits = findAgents(agents, detail[1]);
    if (hits.length === 1 && normalize(hits[0]!.name).split(' ').length >= detail[1].split(' ').length - 1) {
      return { kind: 'openAgent', agent: hits[0]! };
    }
  }

  // --- category filter ---------------------------------------------------------------------
  const filter = /^(?:filter|show|list|only show|limit|narrow|switch)(?: me)?(?: the)?(?: registry| results| tools| agents)?(?: by| to| down to| for| on)?\s*(?:category )?(?:only )?(.+)$/.exec(q);
  if (filter?.[1]) {
    const raw = filter[1].replace(/^only /, '').trim();
    const stripped = raw.replace(/\b(?:category|categories|tools?|agents?)\b/g, ' ').replace(/\s+/g, ' ').trim();
    for (const target of [raw, stripped]) {
      if (!target) continue;
      for (const [category, phrase] of categoryPhrases()) {
        if (target === phrase) return { kind: 'category', category };
      }
    }
    if (/^(?:all|everything|all categories)$/.test(raw)) return { kind: 'clearFilters' };
  }

  // --- search -----------------------------------------------------------------------------
  const search = /^(?:search|look)(?: the)?(?: registry| grid| list)?(?: for| up)?\s+(.+)$/.exec(q) ??
    /^(?:put|type|enter)\s+(.+?)\s+(?:in|into) (?:the )?search(?: box| bar)?$/.exec(q) ??
    /^(?:filter|narrow)(?: the)?(?: registry| list| grid)?(?: down)? (?:by|for|to) (.+)$/.exec(q);
  if (search?.[1]) {
    const query = search[1].replace(/\b(?:in|on) the (?:registry|grid)\b/g, '').trim();
    if (query) return { kind: 'search', query };
  }

  return null;
};

// ------------------------------------------------------------------------------------------
// Execution
// ------------------------------------------------------------------------------------------

const PANEL_LABEL: Record<PanelName, string> = {
  comparison: 'the Comparison Engine',
  missionControl: 'Mission Control',
  bundle: 'the Take Bundle panel',
  telemetry: 'System Telemetry',
  commandGenerator: 'the Shell Command Generator',
};

const LIST_LABEL: Record<ListName, string> = { compare: 'comparison queue', squad: 'squad', bundle: 'bundle' };

const platformLabel = (p: Platform | null): string => (p === 'macos' ? 'macOS' : p === 'windows' ? 'Windows' : p === 'linux' ? 'Linux' : 'no platform');

const names = (agents: Agent[], ids: string[]): string =>
  ids.length ? ids.map(id => agents.find(a => a.id === id)?.name ?? id).join(', ') : 'empty';

const openLabel = (snap: AppSnapshot, agents: Agent[]): string => {
  if (snap.panel === 'agentDetail') return snap.selectedAgentId ? 'details for ' + names(agents, [snap.selectedAgentId]) : 'an agent detail view';
  return snap.panel ? PANEL_LABEL[snap.panel] : 'nothing';
};

export const describeView = (snap: AppSnapshot, agents: Agent[]): string => {
  const filters = [
    snap.search ? `search “${snap.search}”` : null,
    snap.category !== 'All' ? `category ${snap.category}` : null,
  ].filter(Boolean).join(', ');
  return [
    `You're on page ${snap.page} of ${Math.max(snap.totalPages, 1)}, showing ${snap.resultCount} of ${snap.registrySize} tools for ${platformLabel(snap.platform)}.`,
    `Filters: ${filters || 'none'} · sorted by ${snap.sort} · theme ${snap.theme}.`,
    `Open: ${openLabel(snap, agents)}.`,
    `Comparison queue: ${names(agents, snap.compare)} · Squad: ${names(agents, snap.squad)} · Bundle: ${names(agents, snap.bundle)}.`,
  ].join('\n');
};

export interface CommandResult {
  text: string;
}

/** Applies a command to the live app. The reply states what actually happened. */
export const runAppCommand = (command: AppCommand, app: AppController, agents: Agent[]): CommandResult => {
  const snap = app.snapshot();
  const say = (text: string): CommandResult => ({ text });

  switch (command.kind) {
    case 'search': {
      app.setSearch(command.query);
      const count = app.countMatches({ search: command.query, category: snap.category });
      return say(count === 0
        ? `Searched for “${command.query}” — nothing matches${snap.category !== 'All' ? ` in ${snap.category}` : ''}. Try “clear filters”.`
        : `Searching the registry for “${command.query}” — ${count} tool${count === 1 ? '' : 's'} match.`);
    }
    case 'category': {
      app.setCategory(command.category);
      const count = app.countMatches({ search: snap.search, category: command.category });
      return say(`Filtered to ${command.category} — ${count} tool${count === 1 ? '' : 's'}.`);
    }
    case 'sort':
      app.setSort(command.sort);
      return say(`Sorted by ${command.sort}.`);
    case 'page': {
      const total = Math.max(snap.totalPages, 1);
      const target = command.target === 'next' ? snap.page + 1 : command.target === 'prev' ? snap.page - 1 : command.target;
      if (target < 1 || target > total) return say(`There's no page ${target}. This view has ${total} page${total === 1 ? '' : 's'}.`);
      app.goToPage(target);
      return say(`Page ${target} of ${total}.`);
    }
    case 'clearFilters':
      app.clearFilters();
      return say(`Filters cleared — showing the full ${snap.platform ? platformLabel(snap.platform) + ' ' : ''}registry.`);
    case 'openAgent': {
      if (!app.openAgent(command.agent.id)) return say(`I couldn't open ${command.agent.name}.`);
      return say(`Opened details for ${command.agent.name}. Press Esc to close.`);
    }
    case 'openPanel': {
      if (command.panel === 'comparison' && snap.compare.length < 2) {
        return say(`The Comparison Engine needs two tools in the queue (you have ${snap.compare.length}). Try “add lazygit to comparison”, or “open comparison of aider and goose”.`);
      }
      app.openPanel(command.panel);
      return say(`Opened ${PANEL_LABEL[command.panel]}. Press Esc to close.`);
    }
    case 'close':
      app.closePanels();
      return say('Closed.');
    case 'membership': {
      const verb = command.member ? 'Added' : 'Removed';
      const prep = command.member ? 'to' : 'from';
      for (const a of command.agents) app.setMembership(command.list, a.id, command.member);
      return say(`${verb} ${command.agents.map(a => a.name).join(', ')} ${prep} the ${LIST_LABEL[command.list]}.`);
    }
    case 'clearList':
      app.clearList(command.list);
      return say(`Cleared the ${LIST_LABEL[command.list]}.`);
    case 'openComparison': {
      app.clearList('compare');
      for (const a of command.agents) app.setMembership('compare', a.id, true);
      app.openPanel('comparison');
      return say(`Comparing ${command.agents.map(a => a.name).join(' and ')} in the Comparison Engine. Press Esc to close.`);
    }
    case 'platform':
      app.setPlatform(command.platform);
      return say(`Switched to ${platformLabel(command.platform)} — the registry now shows tools that install there.`);
    case 'theme': {
      app.setTheme(command.theme);
      const t = THEMES[command.theme as keyof typeof THEMES];
      return say(`Theme set to ${t?.name ?? command.theme}${t ? ` (${t.description.toLowerCase()})` : ''}.`);
    }
    case 'sync':
      app.sync();
      return say('Checking repository status for every entry. Results appear on the cards; the last-check time updates when it finishes.');
    case 'verify':
      app.verify();
      return say('Verifying the tools on this page — repo URL and install-command checks, plus GitHub metadata where available.');
    case 'status':
      if (command.about === 'view') return say(describeView(snap, agents));
      return say(`${LIST_LABEL[command.about][0]!.toUpperCase()}${LIST_LABEL[command.about].slice(1)}: ${names(agents, snap[command.about === 'compare' ? 'compare' : command.about])}.`);
  }
};
