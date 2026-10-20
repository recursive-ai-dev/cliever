import { Agent } from '../types';

/**
 * Deterministic registry skill: answers "find / what is / install / compare" questions
 * from the agent registry itself. It returns null when a message is not a registry
 * question, which is the cue to hand the turn to Kira.
 */

const STOPWORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'be', 'to', 'for', 'of', 'in', 'on', 'and', 'or', 'with', 'me', 'my',
  'i', 'you', 'it', 'this', 'that', 'these', 'those', 'do', 'does', 'can', 'could', 'should', 'would', 'how',
  'what', 'which', 'who', 'any', 'some', 'good', 'best', 'top', 'find', 'show', 'list', 'give', 'recommend',
  'suggest', 'looking', 'need', 'want', 'tool', 'tools', 'agent', 'agents', 'cli', 'terminal', 'command',
  'line', 'use', 'using', 'please', 'about', 'tell', 'there', 'get', 'have', 'than', 'better', 'like',
]);

const FIND_CUE = /\b(find|search|recommend|suggest|looking for|show me|list|best|top|which|any|options?|alternatives?|tools? (?:for|to)|agents? (?:for|to)|what (?:tools?|agents?))\b/;
const INSTALL_CUE = /\b(install|installing|setup|set up|download|get started with)\b/;
const INFO_CUE = /\b(what is|what's|whats|tell me about|about|explain|describe|info|information|details?|features?|how does|how do i use|worth)\b/;
const COMPARE_CUE = /\b(compare|comparison|versus|vs\.?|difference between|differences between|better than)\b/;

const normalize = (text: string): string => text.toLowerCase().replace(/[^a-z0-9+#.\s-]/g, ' ').replace(/\s+/g, ' ').trim();

const terms = (text: string): string[] =>
  normalize(text)
    .split(' ')
    .map(t => t.replace(/^[-.]+|[-.]+$/g, ''))
    .filter(t => t.length > 1 && !STOPWORDS.has(t))
    .map(t => (t.length > 3 && t.endsWith('s') ? t.slice(0, -1) : t));

const escapeRegExp = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

interface NameIndexEntry {
  agent: Agent;
  pattern: RegExp;
  length: number;
  /** Names that are also ordinary words (fish, warp, bat...) need an explicit tool cue to match. */
  ambiguous: boolean;
}

const COMMON_WORDS = new Set(['fish', 'bat', 'goose', 'warp', 'pass', 'tmux', 'task', 'just', 'act', 'dust', 'bottom', 'broot', 'micro', 'nap', 'tldr', 'fd', 'fzf']);

const buildNameIndex = (agents: Agent[]): NameIndexEntry[] =>
  agents
    .flatMap(agent => {
      const names = new Set<string>([normalize(agent.name), normalize(agent.id.replace(/-/g, ' '))]);
      return [...names]
        .filter(n => n.length >= 2)
        .map(n => ({
          agent,
          pattern: new RegExp(`(?:^|\\s)${escapeRegExp(n)}(?:\\s|$)`),
          length: n.length,
          ambiguous: n.length <= 4 || COMMON_WORDS.has(n),
        }));
    })
    .sort((a, b) => b.length - a.length);

const indexCache = new WeakMap<Agent[], NameIndexEntry[]>();
const nameIndex = (agents: Agent[]): NameIndexEntry[] => {
  let index = indexCache.get(agents);
  if (!index) {
    index = buildNameIndex(agents);
    indexCache.set(agents, index);
  }
  return index;
};

/** Agents named in the message, in order of appearance, longest name first on ties. */
const namedAgents = (agents: Agent[], q: string, hasCue: boolean): Agent[] => {
  const found = new Map<string, { agent: Agent; at: number }>();
  let remaining = ` ${q} `;
  for (const entry of nameIndex(agents)) {
    if (found.has(entry.agent.id)) continue;
    if (entry.ambiguous && !hasCue) continue;
    const match = entry.pattern.exec(remaining);
    if (!match) continue;
    found.set(entry.agent.id, { agent: entry.agent, at: match.index });
    // Blank the matched span so shorter names inside it ("code" in "claude code") don't also match.
    remaining = remaining.slice(0, match.index) + ' '.repeat(match[0].length) + remaining.slice(match.index + match[0].length);
  }
  return [...found.values()].sort((a, b) => a.at - b.at).map(f => f.agent);
};

const scoreAgent = (agent: Agent, queryTerms: string[]): number => {
  if (queryTerms.length === 0) return 0;
  const fields: Array<[string, number]> = [
    [agent.name, 6],
    [agent.tags.join(' '), 4],
    [agent.category, 4],
    [agent.useCases.join(' '), 2],
    [agent.features.join(' '), 1.5],
    [agent.description, 1.5],
    [agent.longDescription, 0.5],
    [agent.language, 1],
  ];
  const haystacks = fields.map(([text, weight]) => ({ terms: new Set(terms(text)), text: normalize(text), weight }));

  let score = 0;
  let matched = 0;
  for (const term of queryTerms) {
    let best = 0;
    for (const h of haystacks) {
      if (h.terms.has(term)) best = Math.max(best, h.weight);
      else if (term.length >= 4 && h.text.includes(term)) best = Math.max(best, h.weight * 0.5);
    }
    if (best > 0) matched++;
    score += best;
  }
  // Reward queries where most terms landed, then use popularity as a gentle tie-break.
  const coverage = matched / queryTerms.length;
  return score * (0.5 + coverage) + Math.log10(agent.stars + 10) * 0.1;
};

const searchAgents = (agents: Agent[], q: string, limit = 5): Agent[] => {
  const queryTerms = terms(q);
  return agents
    .filter(a => !a.archived)
    .map(agent => ({ agent, score: scoreAgent(agent, queryTerms) }))
    .filter(r => r.score >= 2)
    .sort((a, b) => b.score - a.score || b.agent.stars - a.agent.stars || a.agent.name.localeCompare(b.agent.name))
    .slice(0, limit)
    .map(r => r.agent);
};

const stars = (n: number): string => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n));

const oneLine = (a: Agent): string =>
  `- **${a.name}** (${a.category}, ${a.language}, ★${stars(a.stars)}): ${a.description}\n  \`${a.installCommand}\``;

const installBlock = (a: Agent): string => {
  const lines = [`### Install ${a.name}`, '', '```bash', a.installCommand, '```'];
  const pc = a.platformCommands;
  if (pc) {
    const extras: Array<[string, string | undefined]> = [
      ['Windows', pc.windows], ['Linux', pc.linux], ['macOS', pc.macos], ['Docker', pc.docker],
    ];
    for (const [label, cmd] of extras) {
      if (cmd && cmd !== a.installCommand) lines.push('', `**${label}:**`, '```bash', cmd, '```');
    }
    if (pc.notes) lines.push('', `*${pc.notes}*`);
  }
  if (a.troubleshooting?.length) {
    lines.push('', '**If it fails:**', ...a.troubleshooting.slice(0, 3).map(t => `- ${t}`));
  }
  lines.push('', `Repo: ${a.repoUrl}`);
  return lines.join('\n');
};

const infoBlock = (a: Agent): string => {
  const lines = [
    `### ${a.name}`,
    '',
    a.longDescription || a.description,
    '',
    `**Category:** ${a.category} · **Language:** ${a.language} · **Stars:** ${a.stars.toLocaleString()}${a.archived ? ' · **Archived upstream**' : ''}`,
  ];
  if (a.features.length) lines.push('', '**Features:** ' + a.features.slice(0, 5).join(', '));
  if (a.useCases.length) lines.push('', '**Good for:** ' + a.useCases.slice(0, 3).join(' · '));
  lines.push('', '```bash', a.installCommand, '```', '', `Repo: ${a.repoUrl}`);
  return lines.join('\n');
};

const compareBlock = (list: Agent[]): string => {
  const pick = list.slice(0, 3);
  const header = `| | ${pick.map(a => a.name).join(' | ')} |`;
  const divider = `|---|${pick.map(() => '---').join('|')}|`;
  const rows: Array<[string, (a: Agent) => string]> = [
    ['Category', a => a.category],
    ['Language', a => a.language],
    ['Stars', a => a.stars.toLocaleString()],
    ['Install', a => `\`${a.installCommand}\``],
    ['Features', a => a.features.slice(0, 3).join(', ') || '—'],
    ['Status', a => (a.archived ? 'Archived' : a.status ?? 'LIVE')],
  ];
  const body = rows.map(([label, f]) => `| ${label} | ${pick.map(a => f(a).replace(/\|/g, '\\|')).join(' | ')} |`);
  return ['### Comparison', '', header, divider, ...body].join('\n');
};

const categoriesBlock = (agents: Agent[]): string => {
  const counts = new Map<string, number>();
  for (const a of agents) counts.set(a.category, (counts.get(a.category) ?? 0) + 1);
  const rows = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([c, n]) => `- ${c}: ${n}`);
  return [`### Registry overview`, '', `${agents.length} tools across ${counts.size} categories.`, '', ...rows].join('\n');
};

/** The agent a chat is scoped to, parsed from the "Agent: <name>" line the agent panel supplies. */
const contextAgent = (agents: Agent[], context?: string): Agent | null => {
  const match = context?.match(/^Agent: (.+)$/m);
  if (!match?.[1]) return null;
  const name = match[1].trim();
  return agents.find(a => a.name === name) ?? null;
};

export interface RegistryAnswer {
  topic: string;
  body: string;
}

export const answerRegistryQuery = (agents: Agent[], query: string, context?: string): RegistryAnswer | null => {
  const q = normalize(query);
  if (!q) return null;

  const wantsCompare = COMPARE_CUE.test(q);
  const wantsInstall = INSTALL_CUE.test(q);
  const wantsInfo = INFO_CUE.test(q);
  const wantsFind = FIND_CUE.test(q);
  const hasCue = wantsCompare || wantsInstall || wantsInfo || wantsFind || q.split(' ').length <= 3;

  if (/\b(categories|what kinds? of|what types? of)\b/.test(q) || /\bhow many (tools|agents)\b/.test(q)) {
    return { topic: 'registry', body: categoriesBlock(agents) };
  }

  const named = namedAgents(agents, q, hasCue);
  const scoped = contextAgent(agents, context);
  const refersToScoped = scoped && /\b(it|this|this tool|this agent|its)\b/.test(q);

  if (wantsCompare) {
    const pair = named.length >= 2 ? named : scoped && named.length === 1 && named[0] !== scoped ? [scoped, ...named] : named;
    if (pair.length >= 2) return { topic: 'comparison', body: compareBlock(pair) };
  }

  const subject = named[0] ?? (refersToScoped ? scoped : null);

  if (subject && wantsInstall) return { topic: 'installation', body: installBlock(subject) };

  if (subject && (wantsInfo || named.length > 0 || refersToScoped)) {
    // Bare "install" questions about the scoped agent without a cue word still land here.
    return { topic: 'tool', body: infoBlock(subject) };
  }

  if (scoped && wantsInstall && !named.length) return { topic: 'installation', body: installBlock(scoped) };

  if (wantsFind || (!subject && q.split(' ').length >= 2 && wantsInfo)) {
    const results = searchAgents(agents, q);
    if (results.length > 0) {
      return { topic: 'discovery', body: ['### Matching tools', '', ...results.map(oneLine)].join('\n') };
    }
  }

  return null;
};

/** True when the message asks for something specific from the registry (install, compare, find, explain). */
export const hasRegistryCue = (query: string): boolean => {
  const q = normalize(query);
  return INSTALL_CUE.test(q) || COMPARE_CUE.test(q) || FIND_CUE.test(q) || INFO_CUE.test(q);
};

/** True when a message is plainly addressed to Kira rather than the registry. */
export const isConversational = (query: string): boolean => {
  const q = normalize(query);
  return (
    /^(hi|hello|hey|yo|howdy|good (morning|afternoon|evening)|thanks|thank you|thx|bye|goodbye|see you|cheers)\b/.test(q) ||
    /^(i|i m|im|i ve|ive|my|me|we|remember|forget|call me)\b/.test(q) ||
    /\b(joke|writing prompt|who are you|what can you do|how are you|what do you remember|what are you)\b/.test(q)
  );
};
