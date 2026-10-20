import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AGENTS, TAG_DESCRIPTIONS } from '../../constants';
import { answerAppQuestion, buildGlossary } from '../../services/appKnowledge';

const ask = (q: string) => answerAppQuestion(AGENTS, q);

test('explains UI concepts', () => {
  assert.match(ask('what is a squad')!.body, /Recruit to squad/);
  assert.match(ask('what is mission control')!.body, /Squad Collaboration Plan/);
  assert.match(ask('what does DEGRADED mean')!.body, /allow-list/);
  assert.match(ask('explain the bundle')!.body, /install commands/);
  assert.match(ask('what is the circuit breaker')!.body, /15 seconds/);
});

test('bare terms resolve', () => {
  assert.match(ask('telemetry')!.body, /System Telemetry|health/i);
  assert.match(ask('sector')!.body, /12 tools per page/);
});

test('every tag is explained, but only when asked as a tag', () => {
  for (const [tag, description] of Object.entries(TAG_DESCRIPTIONS)) {
    const r = ask(`what does the ${tag} tag mean`);
    assert.ok(r, tag);
    assert.ok(r.body.includes(description), tag);
  }
  assert.equal(ask('what is go'), null);
});

test('themes and categories come from live data', () => {
  assert.match(ask('what is synthwave')!.body, /Synthwave/);
  assert.match(ask('what is a terminal utility')!.body, /Terminal Utility/);
  assert.match(ask('list themes')!.body, /m4trix|Matrix/i);
});

test('help gives an overview that mentions what chat can do', () => {
  const r = ask('help')!;
  assert.match(r.body, /Comparison Engine/);
  assert.match(r.body, /search for git/);
  assert.ok(ask('what can I do here'));
});

test('registry questions and chatter are left alone', () => {
  for (const q of ['what is lazygit', 'find me a coding agent', 'hello', 'I like docker']) assert.equal(ask(q), null, q);
});

test('glossary has no duplicate ids', () => {
  const ids = buildGlossary(AGENTS).entries.map(e => e.id);
  assert.equal(new Set(ids).size, ids.length);
});
