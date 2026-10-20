/// <reference lib="webworker" />
import kiraModule from './kira-model.generated.js';
import type { KiraModule, KiraRequest, KiraResponse } from './kiraTypes';

const Kira = kiraModule as unknown as KiraModule;

const semantic = new Kira.SemanticEngine(Kira.ARTIFACT);
const dialogue = new Kira.DialogueModel(semantic, Kira.APP_META);

self.onmessage = (event: MessageEvent<KiraRequest>) => {
  const { id, op, payload } = event.data;
  let response: KiraResponse;
  try {
    const value = op === 'step'
      ? dialogue.step(payload.state, payload.event)
      : dialogue.replay(payload.events);
    response = { id, ok: true, value };
  } catch (error: unknown) {
    response = { id, ok: false, error: error instanceof Error ? error.message : String(error) };
  }
  self.postMessage(response);
};
