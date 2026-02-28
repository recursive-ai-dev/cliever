import { Agent } from '../types';

const normalize = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s._/-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const STOPWORDS = new Set<string>([
  // General English glue words
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'been', 'being', 'but', 'by', 'can', 'could', 'did', 'do', 'does',
  'for', 'from', 'had', 'has', 'have', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'me', 'my', 'of',
  'on', 'or', 'our', 'ours', 'please', 'show', 'tell', 'that', 'the', 'their', 'them', 'then', 'there', 'these',
  'this', 'those', 'to', 'us', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'who', 'why', 'will', 'with',
  'without', 'would', 'you', 'your', 'yours',

  // Common “search intent” filler
  'find', 'search', 'list', 'lookup', 'give', 'get', 'want', 'need', 'help', 'about', 'like'
]);

const stem = (tokenRaw: string): string => {
  const token = tokenRaw;
  if (token.length <= 3) return token;

  // Very light, safe stemming: enough to handle common English inflections without mangling.
  if (token.endsWith('ies') && token.length > 4) return token.slice(0, -3) + 'y';
  if (token.endsWith('ing') && token.length > 5) return token.slice(0, -3);
  if (token.endsWith('ed') && token.length > 4) return token.slice(0, -2);
  if (token.endsWith('ly') && token.length > 4) return token.slice(0, -2);
  if (token.endsWith('es') && token.length > 4) return token.slice(0, -2);
  if (token.endsWith('s') && token.length > 4 && !token.endsWith('ss')) return token.slice(0, -1);
  return token;
};

const tokenize = (query: string): string[] => {
  const q = normalize(query);
  if (!q) return [];
  return q.split(' ').map(t => t.trim()).filter(Boolean);
};

const levenshtein = (aRaw: string, bRaw: string): number => {
  const a = aRaw;
  const b = bRaw;
  if (a === b) return 0;
  if (!a) return b.length;
  if (!b) return a.length;

  const prev = new Array<number>(b.length + 1);
  const curr = new Array<number>(b.length + 1);

  for (let j = 0; j <= b.length; j++) prev[j] = j;

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    const aChar = a[i - 1];
    for (let j = 1; j <= b.length; j++) {
      const cost = aChar === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j]! + 1, // deletion
        curr[j - 1]! + 1, // insertion
        prev[j - 1]! + cost // substitution
      );
    }

    for (let j = 0; j <= b.length; j++) prev[j] = curr[j]!;
  }

  return prev[b.length]!;
};

const expandSynonyms = (token: string): string[] => {
  // Strong-but-controlled synonym expansion.
  // Goal: “related searches” (comprehensive) without turning short tokens into noise.
  const map: Record<string, string[]> = {
    // Git hosting
    gitlab: ['gitlab', 'glab', 'git', 'repo', 'issues', 'merge', 'mr', 'pipeline', 'ci', 'cicd', 'runner'],
    glab: ['glab', 'gitlab', 'git', 'merge', 'mr', 'pipeline', 'ci'],

    github: ['github', 'gh', 'git', 'repo', 'issues', 'pull', 'pr', 'actions', 'workflow', 'ci', 'cicd'],
    gh: ['gh', 'github', 'git', 'pull', 'pr', 'actions', 'workflow'],

    // Infra staples
    kubernetes: ['kubernetes', 'k8s', 'kubectl', 'cluster'],
    kubectl: ['kubectl', 'kubernetes', 'k8s', 'cluster'],
    k8s: ['k8s', 'kubernetes', 'kubectl'],

    terraform: ['terraform', 'tf', 'iac', 'infrastructure'],
    iac: ['iac', 'terraform', 'pulumi'],

    // CLI / shell / terminal
    cli: ['cli', 'terminal', 'shell', 'command', 'console'],
    terminal: ['terminal', 'cli', 'shell', 'console'],
    shell: ['shell', 'terminal', 'cli', 'bash', 'powershell'],
    powershell: ['powershell', 'pwsh', 'shell', 'cli'],
    bash: ['bash', 'shell', 'cli', 'terminal'],

    // Automation / agents
    agent: ['agent', 'autonomous', 'automation'],
    autonomous: ['autonomous', 'agent', 'automation'],
    automation: ['automation', 'autonomous', 'agent'],

    // Chat / prompts
    chat: ['chat', 'assistant', 'prompt'],
    prompt: ['prompt', 'prompts', 'chat'],
    prompts: ['prompts', 'prompt', 'chat'],

    // DevOps-ish terms
    deploy: ['deploy', 'deployment', 'release', 'ship'],
    deployment: ['deployment', 'deploy', 'release'],
    release: ['release', 'deploy', 'deployment'],
    monitor: ['monitor', 'monitoring', 'logs', 'logging'],
    logging: ['logging', 'logs', 'monitoring'],
    logs: ['logs', 'logging', 'monitoring'],
    security: ['security', 'sandbox', 'safe', 'audit'],

    // General git workflow
    git: ['git', 'commit', 'diff', 'branch', 'repo'],
    commit: ['commit', 'git', 'changelog'],
    commits: ['commit', 'git', 'changelog']
  };

  return map[token] ?? [token];
};



const tokenMatchScore = (tokenRaw: string, haystack: string, haystackWords: Set<string>): number => {
  const token = tokenRaw;
  if (!token) return 0;

  // Best possible: exact word hit
  if (haystackWords.has(token)) return 1;

  // Short tokens are word-only; if not present, score 0.
  if (token.length <= 3) return 0;

  // Substring hit in the full haystack is still strong.
  if (haystack.includes(token)) return 0.85;

  // Light typo tolerance for longer tokens.
  if (token.length < 5) return 0;
  const words = haystack.split(' ');
  const maxDistance = token.length >= 9 ? 2 : 1;
  for (const word of words) {
    if (!word) continue;
    if (Math.abs(word.length - token.length) > maxDistance) continue;
    if (levenshtein(token, word) <= maxDistance) return 0.65;
  }

  return 0;
};

export const agentMatchesQuery = (agent: Agent, query: string): boolean => {
  const tokensRaw = tokenize(query);
  if (tokensRaw.length === 0) return true;

  // Remove stopwords so ordinary English (“show me tools that help with…”) doesn’t over-constrain matches.
  const meaningful = tokensRaw.filter(t => !STOPWORDS.has(t));
  const tokens = (meaningful.length > 0 ? meaningful : tokensRaw).map(stem);

  const haystack = normalize(
    [
      agent.name,
      agent.description,
      agent.longDescription,
      agent.category,
      agent.language,
      agent.repoUrl,
      agent.installCommand,
      ...(agent.tags ?? []),
      ...(agent.features ?? []),
      ...(agent.useCases ?? [])
    ].join(' ')
  );

  const haystackWords = new Set<string>(haystack.split(' ').filter(Boolean));

  // Score-based matching:
  // - For short queries, require a strong hit.
  // - For longer English queries, require a reasonable ratio + at least one strong signal.

  let matched = 0;
  let strongSignals = 0;

  for (const token of tokens) {
    const expanded = expandSynonyms(token).map(normalize).map(stem);
    let best = 0;
    for (const t of expanded) {
      const score = tokenMatchScore(t, haystack, haystackWords);
      if (score > best) best = score;
      if (best >= 1) break;
    }

    if (best >= 0.6) matched++;
    if (best >= 0.85) strongSignals++;
  }

  const total = tokens.length;
  if (total === 0) return true;

  // Single-token searches should behave like “filter by that term”.
  if (total === 1) {
    return strongSignals >= 1;
  }

  const ratio = matched / total;
  // Thresholds tuned to feel “comprehensive” for English phrases
  // while still preventing “everything matches” when you type a paragraph.
  const requiredRatio = total >= 6 ? 0.34 : total >= 4 ? 0.4 : 0.5;
  const requiredMatches = total >= 6 ? 2 : 1;

  return ratio >= requiredRatio && matched >= requiredMatches && strongSignals >= 1;
};
