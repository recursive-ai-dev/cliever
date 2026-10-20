interface AsyncOperationOptions {
  signal?: AbortSignal;
}

const CLI_CORPUS_URLS: string[] = [
  '/corpus/cli-commands.txt',
  '/corpus/cli-powershell-windows.txt',
  '/corpus/cli-git-workflows.txt',
  '/corpus/cli-docker-node-python.txt',
  '/corpus/cli-troubleshooting-playbook.txt',
];

let cliLinesPromise: Promise<string[]> | null = null;

const tokenize = (text: string): string[] => text.toLowerCase().match(/\b\w+\b/g) ?? [];

const fetchText = async (url: string, options?: AsyncOperationOptions): Promise<string> => {
  const res = await fetch(url, { headers: { Accept: 'text/plain' }, signal: options?.signal, cache: 'force-cache' });
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status} ${res.statusText}`);
  return res.text();
};

const ensureCliLines = (options?: AsyncOperationOptions): Promise<string[]> => {
  cliLinesPromise ??= (async () => {
    const texts = await Promise.all(CLI_CORPUS_URLS.map(url => fetchText(url, options).catch(() => '')));
    const seen = new Set<string>();
    const out: string[] = [];
    for (const line of texts.flatMap(t => t.split(/\r?\n/)).map(l => l.trim()).filter(l => l.length >= 8)) {
      const key = line.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(line);
    }
    return out;
  })();
  return cliLinesPromise;
};

const scoreLine = (line: string, queryTokens: Set<string>): number => {
  const lineTokens = tokenize(line);
  if (lineTokens.length === 0) return 0;
  const hits = lineTokens.filter(t => queryTokens.has(t)).length;
  const density = hits / lineTokens.length;
  const brevity = Math.max(0, 1.2 - line.length / 120);
  return hits * 2 + density + brevity;
};

/** Best-matching lines from the bundled CLI how-to corpus. Never throws except on abort. */
export const findCliHints = async (query: string, options?: AsyncOperationOptions): Promise<string[]> => {
  const queryTokens = new Set(tokenize(query));
  if (queryTokens.size === 0) return [];
  try {
    const lines = await ensureCliLines(options);
    return lines
      .map(line => ({ line, score: scoreLine(line, queryTokens) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(x => x.line);
  } catch (error: unknown) {
    if ((error as Error)?.name === 'AbortError') throw error;
    return [];
  }
};
