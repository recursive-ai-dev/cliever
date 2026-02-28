import { sanitizeChatMessage } from '../utils/sanitization';

interface AsyncOperationOptions {
  signal?: AbortSignal;
}

interface LaPoetCheckpoint {
  vocabulary: Array<[string, number]>;
  embeddings: Array<[string, number[]]>;
  emotionalSpace: Array<[string, number[]]>;
  kernelPCA: {
    nComponents: number;
    degree: number;
    eigenvectors: number[][] | null;
    eigenvalues: number[] | null;
    X_fit: number[][] | null;
  };
  valueEstimator: {
    weights: number[];
    alpha: number;
    gamma: number;
    lambda: number;
  };
  lastCorpusSignature: string | null;
  isTrained: boolean;
  timestamp: string;
}

type Vector = number[];

const CHECKPOINT_URLS: string[] = [
  '/lapoet/agtune-poems-checkpoint.json',
  '/lapoet/agtune-lyrics-checkpoint.json',
];
const CLI_CORPUS_URLS: string[] = [
  '/lapoet/pretraining/cli-commands.txt',
  '/lapoet/pretraining/cli-powershell-windows.txt',
  '/lapoet/pretraining/cli-git-workflows.txt',
  '/lapoet/pretraining/cli-docker-node-python.txt',
  '/lapoet/pretraining/cli-troubleshooting-playbook.txt',
];

const tokenize = (text: string): string[] => {
  const tokens = text.toLowerCase().match(/\b\w+\b/g);
  return tokens ?? [];
};

const dot = (a: Vector, b: Vector): number => {
  const len = Math.min(a.length, b.length);
  let sum = 0;
  for (let i = 0; i < len; i++) sum += (a[i] ?? 0) * (b[i] ?? 0);
  return sum;
};

const norm = (v: Vector): number => Math.sqrt(dot(v, v));

const cosineSimilarity = (a: Vector, b: Vector): number => {
  const denom = norm(a) * norm(b);
  if (!Number.isFinite(denom) || denom <= 0) return 0;
  return dot(a, b) / denom;
};

const averageVectors = (vectors: Vector[]): Vector | null => {
  if (vectors.length === 0) return null;
  const dims = vectors[0]?.length ?? 0;
  if (dims === 0) return null;

  const out = new Array(dims).fill(0);
  for (const v of vectors) {
    for (let i = 0; i < dims; i++) out[i] += v[i] ?? 0;
  }
  for (let i = 0; i < dims; i++) out[i] /= vectors.length;
  return out;
};

type CheckpointState = {
  url: string;
  checkpoint: LaPoetCheckpoint;
  emotionalSpaceMap: Map<string, Vector>;
};

const checkpointStatePromises = new Map<string, Promise<CheckpointState>>();
let availableStatesPromise: Promise<CheckpointState[]> | null = null;
let cliLinesPromise: Promise<string[]> | null = null;

const fetchJson = async <T>(url: string, options?: AsyncOperationOptions): Promise<T> => {
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
    signal: options?.signal,
    cache: 'force-cache',
  });
  if (!res.ok) {
    throw new Error(`Failed to load ${url}: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
};

const fetchText = async (url: string, options?: AsyncOperationOptions): Promise<string> => {
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Accept': 'text/plain' },
    signal: options?.signal,
    cache: 'force-cache',
  });
  if (!res.ok) {
    throw new Error(`Failed to load ${url}: ${res.status} ${res.statusText}`);
  }
  return res.text();
};

const ensureCheckpointState = (url: string, options?: AsyncOperationOptions): Promise<CheckpointState> => {
  const existing = checkpointStatePromises.get(url);
  if (existing) return existing;

  const promise = (async () => {
    const checkpoint = await fetchJson<LaPoetCheckpoint>(url, options);
    const emotionalSpaceMap = new Map<string, Vector>();
    for (const [word, vec] of checkpoint.emotionalSpace) {
      if (!word || !Array.isArray(vec)) continue;
      emotionalSpaceMap.set(word, vec);
    }
    return { url, checkpoint, emotionalSpaceMap };
  })();

  checkpointStatePromises.set(url, promise);
  return promise;
};

const ensureAvailableCheckpointStates = (options?: AsyncOperationOptions): Promise<CheckpointState[]> => {
  if (!availableStatesPromise) {
    availableStatesPromise = (async () => {
      const settled = await Promise.allSettled(
        CHECKPOINT_URLS.map(url => ensureCheckpointState(url, options))
      );

      const states: CheckpointState[] = [];
      for (const r of settled) {
        if (r.status === 'fulfilled') states.push(r.value);
      }
      return states;
    })();
  }
  return availableStatesPromise;
};

const ensureCliLines = async (options?: AsyncOperationOptions): Promise<string[]> => {
  if (!cliLinesPromise) {
    cliLinesPromise = (async () => {
      const texts = await Promise.all(CLI_CORPUS_URLS.map(url => fetchText(url, options).catch(() => '')));
      const lines = texts
        .flatMap(t => t.split(/\r?\n/))
        .map(l => l.trim())
        .filter(l => l.length >= 8);

      // de-dupe while preserving order
      const seen = new Set<string>();
      const out: string[] = [];
      for (const line of lines) {
        const key = line.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(line);
      }
      return out;
    })();
  }
  return cliLinesPromise;
};

const embedQueryFromState = (state: CheckpointState, query: string): { vec: Vector | null; hits: number } => {
  const tokens = tokenize(query);
  const vecs: Vector[] = [];
  let hits = 0;

  for (const t of tokens) {
    const v = state.emotionalSpaceMap.get(t);
    if (v) {
      hits++;
      vecs.push(v);
    }
  }

  return { vec: averageVectors(vecs), hits };
};

const pickBestStateForQuery = async (query: string, options?: AsyncOperationOptions): Promise<CheckpointState | null> => {
  const states = await ensureAvailableCheckpointStates(options);
  if (states.length === 0) return null;

  const first = states[0];
  if (!first) return null;
  let best: CheckpointState = first;
  let bestHits = -1;

  for (const st of states) {
    const { hits } = embedQueryFromState(st, query);
    if (hits > bestHits) {
      best = st;
      bestHits = hits;
    }
  }

  return best;
};

const findSimilarWords = async (
  queryVec: Vector,
  state: CheckpointState
): Promise<Array<{ word: string; score: number }>> => {
  const map = state.emotionalSpaceMap;
  const scored: Array<{ word: string; score: number }> = [];

  for (const [word, vec] of map.entries()) {
    scored.push({ word, score: cosineSimilarity(queryVec, vec) });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored;
};

const scoreLine = (line: string, queryTokens: Set<string>): number => {
  const lt = tokenize(line);
  if (lt.length === 0) return 0;

  let hits = 0;
  for (const t of lt) {
    if (queryTokens.has(t)) hits++;
  }

  // Stronger weight for earlier hits and concise lines
  const density = hits / Math.max(lt.length, 1);
  const brevity = Math.max(0, 1.2 - line.length / 120);
  return hits * 2 + density + brevity;
};

const findCliHints = async (query: string, options?: AsyncOperationOptions): Promise<string[]> => {
  const queryTokens = new Set(tokenize(query));
  if (queryTokens.size === 0) return [];

  const lines = await ensureCliLines(options);
  const scored = lines
    .map(line => ({ line, score: scoreLine(line, queryTokens) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(x => x.line);

  return scored;
};

export const getTrainedLaPoetHints = async (
  query: string,
  context?: string,
  options?: AsyncOperationOptions
): Promise<string> => {
  const sanitizedQuery = sanitizeChatMessage(query);
  const sanitizedContext = context ? sanitizeChatMessage(context) : '';

  try {
    // Respect abort early
    if (options?.signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    const state = await pickBestStateForQuery(sanitizedQuery, options);
    const cliHints = await findCliHints(sanitizedQuery, options);

    // If the checkpoint can't embed this query (unknown tokens), we still can return corpus hints.
    const queryVec = state ? embedQueryFromState(state, sanitizedQuery).vec : null;
    const similar = queryVec && state ? (await findSimilarWords(queryVec, state)).slice(0, 5) : [];

    if (cliHints.length === 0 && similar.length === 0) {
      return '';
    }

    const lines: string[] = [];

    if (cliHints.length) {
      lines.push('### LaPoet (Trained) CLI Hints');
      lines.push(...cliHints.map(h => `- ${h}`));
    }

    if (similar.length) {
      lines.push('');
      lines.push('### LaPoet (Trained) Related Concepts');
      lines.push(`- ${similar.map(s => `${s.word} (${s.score.toFixed(2)})`).join(', ')}`);
    }

    if (sanitizedContext) {
      lines.push('');
      lines.push(`*Context: ${sanitizedContext}*`);
    }

    if (state) {
      lines.push('');
      lines.push(`*Checkpoint: ${state.url}*`);
    }

    return lines.join('\n');
  } catch (error: unknown) {
    if ((error as Error)?.name === 'AbortError') {
      throw error;
    }
    // Silent fallback: Cliever should still work without this layer.
    return '';
  }
};
