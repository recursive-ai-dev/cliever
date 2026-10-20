import type {
  KiraDialogue,
  KiraEnvelope,
  KiraEvent,
  KiraModule,
  KiraRequestBody,
  KiraResponse,
  KiraState,
  KiraStepResult,
} from './kiraTypes';

const STORAGE_KEY = 'cliever-kira-session';
const REQUEST_TIMEOUT_MS = 30_000;
// Optional follow-ups ('detail', 'offer') are not worth intercepting registry questions for.
const REQUIRED_ANSWERS = new Set(['sense', 'topicSense', 'semanticSense', 'confirmName']);

interface AsyncOperationOptions {
  signal?: AbortSignal;
}

export interface KiraReply {
  text: string;
  /** Kira's dialogue act for the turn (greet, recall, clarify, ...). */
  act: string;
}

/**
 * Kira's model runs in a Web Worker when available, and inline otherwise.
 * Both paths load the same generated module, so replies are identical.
 */
class KiraBridge {
  private worker: Worker | null = null;
  private inline: KiraDialogue | null = null;
  private pending = new Map<number, { resolve: (v: KiraStepResult | KiraState) => void; reject: (e: Error) => void; timer: ReturnType<typeof setTimeout> }>();
  private serial = 0;

  async request(request: KiraRequestBody): Promise<KiraStepResult | KiraState> {
    if (!this.worker && !this.inline) await this.start();
    if (this.inline) return this.runInline(request);

    return new Promise((resolve, reject) => {
      const id = ++this.serial;
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error('Kira timed out.'));
      }, REQUEST_TIMEOUT_MS);
      this.pending.set(id, { resolve, reject, timer });
      this.worker?.postMessage({ ...request, id });
    });
  }

  private runInline(request: KiraRequestBody): KiraStepResult | KiraState {
    const dialogue = this.inline as KiraDialogue;
    return request.op === 'step'
      ? dialogue.step(request.payload.state, request.payload.event)
      : dialogue.replay(request.payload.events);
  }

  private async start(): Promise<void> {
    try {
      const worker = new Worker(new URL('./kira.worker.ts', import.meta.url), { type: 'module' });
      worker.onmessage = (event: MessageEvent<KiraResponse>) => {
        const response = event.data;
        const entry = this.pending.get(response.id);
        if (!entry) return;
        clearTimeout(entry.timer);
        this.pending.delete(response.id);
        if (response.ok) entry.resolve(response.value);
        else entry.reject(new Error(response.error));
      };
      worker.onerror = () => {
        for (const entry of this.pending.values()) {
          clearTimeout(entry.timer);
          entry.reject(new Error('Kira worker failed.'));
        }
        this.pending.clear();
        worker.terminate();
        this.worker = null;
      };
      this.worker = worker;
    } catch {
      const Kira = await loadKira();
      this.inline = new Kira.DialogueModel(new Kira.SemanticEngine(Kira.ARTIFACT), Kira.APP_META);
    }
  }
}

let kiraModule: Promise<KiraModule> | null = null;
const loadKira = (): Promise<KiraModule> => {
  kiraModule ??= import('./kira-model.generated.js').then(m => m.default as unknown as KiraModule);
  return kiraModule;
};

const readEnvelope = (): KiraEnvelope | null => {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as KiraEnvelope) : null;
  } catch {
    return null;
  }
};

const writeEnvelope = (envelope: KiraEnvelope | null): void => {
  try {
    if (envelope) globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(envelope));
    else globalThis.localStorage?.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be unavailable or full; Kira keeps working for this page load.
  }
};

/**
 * A single persistent Kira conversation. State is rebuilt by replaying the saved
 * event log and checked against its digest, so a corrupt save is discarded rather
 * than trusted. Turns run one at a time.
 */
class KiraSession {
  private bridge = new KiraBridge();
  private state: KiraState | null = null;
  private events: KiraEvent[] = [];
  private queue: Promise<unknown> = Promise.resolve();

  say(text: string, options?: AsyncOperationOptions): Promise<KiraReply> {
    const turn = this.queue.then(() => this.turn(text, options));
    this.queue = turn.catch(() => undefined);
    return turn;
  }

  /** True when Kira asked a clarifying question that needs a specific answer (a meaning choice or a confirmation). */
  awaiting(): Promise<boolean> {
    if (!this.state && !readEnvelope()) return Promise.resolve(false);
    const check = this.queue.then(async () => {
      const state = await this.ready(await loadKira());
      const kind = state.context?.pending?.kind;
      return kind !== undefined && REQUIRED_ANSWERS.has(kind);
    });
    this.queue = check.catch(() => undefined);
    return check.catch(() => false);
  }

  reset(): Promise<void> {
    const done = this.queue.then(() => {
      this.state = null;
      this.events = [];
      writeEnvelope(null);
    });
    this.queue = done.catch(() => undefined);
    return done;
  }

  private async ready(Kira: KiraModule): Promise<KiraState> {
    if (this.state) return this.state;

    const saved = readEnvelope();
    if (saved) {
      try {
        Kira.inspectEnvelope(saved, Kira.APP_META);
        const restored = (await this.bridge.request({ op: 'replay', payload: { events: saved.events } })) as KiraState;
        if (Kira.hash(restored) !== saved.stateDigest) throw new Error('Saved conversation did not replay exactly');
        this.state = restored;
        this.events = saved.events;
        return restored;
      } catch {
        writeEnvelope(null);
      }
    }

    this.state = Kira.initialState();
    this.events = [];
    return this.state;
  }

  private async turn(text: string, options?: AsyncOperationOptions): Promise<KiraReply> {
    if (options?.signal?.aborted) throw new DOMException('Aborted', 'AbortError');

    const Kira = await loadKira();
    let state = await this.ready(Kira);

    // The event log is capped; start a fresh conversation rather than refusing to answer.
    if (this.events.length >= Kira.MAX_EVENTS - 1) {
      state = Kira.initialState();
      this.events = [];
    }

    const event: KiraEvent = { type: 'message', text, seq: state.revision + 1, time: Date.now() };
    const result = (await this.bridge.request({ op: 'step', payload: { state, event } })) as KiraStepResult;
    if (options?.signal?.aborted) throw new DOMException('Aborted', 'AbortError');

    this.events = [...this.events, event];
    this.state = result.state;
    writeEnvelope(Kira.packSession(this.events, result.state, Kira.APP_META));

    const last = [...result.state.messages].reverse().find(m => m.role === 'assistant');
    return { text: last?.text ?? '', act: last?.plan?.act ?? result.plan?.act ?? 'reply' };
  }
}

const session = new KiraSession();

export const askKira = (text: string, options?: AsyncOperationOptions): Promise<KiraReply> => session.say(text, options);

export const isKiraAwaiting = (): Promise<boolean> => session.awaiting();

export const resetKira = (): Promise<void> => session.reset();
