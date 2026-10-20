/** The slice of Kira's model that cliever relies on. Kira itself is plain JS (see kira/). */

export interface KiraMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  plan?: { act?: string };
}

export interface KiraMemory {
  id: string;
  [key: string]: unknown;
}

export interface KiraState {
  revision: number;
  turn: number;
  messages: KiraMessage[];
  memories: KiraMemory[];
  context?: { pending?: { kind?: string } | null; focus?: unknown };
  [key: string]: unknown;
}

export interface KiraEvent {
  type: 'message';
  text: string;
  seq: number;
  time: number;
}

export interface KiraStepResult {
  state: KiraState;
  plan: { act?: string };
}

export interface KiraEnvelope {
  events: KiraEvent[];
  stateDigest: string;
  [key: string]: unknown;
}

export type KiraRequestBody =
  | { op: 'step'; payload: { state: KiraState; event: KiraEvent } }
  | { op: 'replay'; payload: { events: KiraEvent[] } };

export type KiraRequest = KiraRequestBody & { id: number };

export type KiraResponse =
  | { id: number; ok: true; value: KiraStepResult | KiraState }
  | { id: number; ok: false; error: string };

export interface KiraDialogue {
  step(state: KiraState, event: KiraEvent): KiraStepResult;
  replay(events: KiraEvent[]): KiraState;
}

export interface KiraModule {
  ARTIFACT: unknown;
  SemanticEngine: new (artifact: unknown) => unknown;
  DialogueModel: new (semantic: unknown, meta: unknown) => KiraDialogue;
  initialState(): KiraState;
  hash(value: unknown): string;
  packSession(events: KiraEvent[], state: KiraState, meta: unknown): KiraEnvelope;
  inspectEnvelope(envelope: unknown, meta: unknown): void;
  APP_META: unknown;
  MAX_EVENTS: number;
}
