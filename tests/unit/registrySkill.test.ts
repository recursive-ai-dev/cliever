import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AGENTS } from '../../constants';
import { answerRegistryQuery, hasRegistryCue, isConversational } from '../../services/registrySkill';

const ask = (q: string, ctx?: string) => answerRegistryQuery(AGENTS, q, ctx);

test('finds tools by topic', () => {
  const r = ask('find me a coding agent');
  assert.ok(r);
  assert.equal(r.topic, 'discovery');
  assert.match(r.body, /Matching tools/);
});

test('describes a named tool', () => {
  const r = ask('what is lazygit');
  assert.ok(r);
  assert.equal(r.topic, 'tool');
  assert.match(r.body, /lazygit/i);
});

test('gives install commands for a named tool', () => {
  const r = ask('how do I install ripgrep');
  assert.ok(r);
  assert.equal(r.topic, 'installation');
  assert.match(r.body, /```bash/);
});

test('compares two named tools', () => {
  const r = ask('compare lazygit vs lazydocker');
  assert.ok(r);
  assert.equal(r.topic, 'comparison');
  assert.match(r.body, /\| Install \|/);
});

test('reports registry size', () => {
  const r = ask('how many tools are there');
  assert.ok(r);
  assert.match(r.body, new RegExp(`${AGENTS.length} tools`));
});

test('resolves "it" against the agent the panel is scoped to', () => {
  const agent = AGENTS[0]!;
  const r = ask('how do I install it', `Agent: ${agent.name}\nCategory: ${agent.category}`);
  assert.ok(r);
  assert.equal(r.topic, 'installation');
  assert.ok(r.body.includes(agent.installCommand));
});

test('unrelated chatter is not a registry question', () => {
  assert.equal(ask('tell me a joke'), null);
  assert.equal(ask('I feel tired today'), null);
});

test('routing helpers separate conversation from registry requests', () => {
  assert.ok(isConversational('hello there'));
  assert.ok(isConversational('I like docker'));
  assert.ok(!hasRegistryCue('I like docker'));
  assert.ok(isConversational('I want to install lazygit'));
  assert.ok(hasRegistryCue('I want to install lazygit'));
});
