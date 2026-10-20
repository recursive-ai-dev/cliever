import { test } from 'node:test';
import assert from 'node:assert/strict';
import { askKira, isKiraAwaiting, resetKira } from '../../services/kira/kiraService';

// Node has no Worker constructor in this bundle's path; the service falls back to the inline model.

test('Kira greets, remembers a preference and recalls it', async () => {
  await resetKira();
  const hello = await askKira('hello');
  assert.equal(hello.act, 'greet');

  const pref = await askKira('I like docker');
  assert.equal(pref.act, 'preference');

  const recall = await askKira('what do you remember about me');
  assert.equal(recall.act, 'recall');
  assert.match(recall.text, /docker/i);
});

test('Kira asks for clarification and reports she is waiting', async () => {
  await resetKira();
  const reply = await askKira('I like bass');
  assert.equal(reply.act, 'clarify');
  assert.equal(await isKiraAwaiting(), true);

  const resolved = await askKira('bass guitar');
  assert.notEqual(resolved.act, 'clarify');
  assert.equal(await isKiraAwaiting(), false);
});

test('Kira explains her CLI registry role', async () => {
  await resetKira();
  const reply = await askKira('what can you do');
  assert.match(reply.text, /CLI registry/);
});
