import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AGENTS } from '../../constants';
import { AgentCategory } from '../../types';
import { parseAppCommand, runAppCommand, type AppCommand } from '../../services/appCommands';
import type { AppController, AppSnapshot } from '../../services/appBridge';

const parse = (text: string) => parseAppCommand(text, AGENTS);

test('search commands', () => {
  assert.deepEqual(parse('search for git'), { kind: 'search', query: 'git' });
  assert.deepEqual(parse('please search the registry for docker tools'), { kind: 'search', query: 'docker tools' });
});

test('category and clear commands', () => {
  assert.deepEqual(parse('show terminal utilities'), { kind: 'category', category: AgentCategory.TERMINAL_UTILITY });
  assert.deepEqual(parse('filter by coding assistants'), { kind: 'category', category: AgentCategory.CODING });
  assert.deepEqual(parse('clear filters'), { kind: 'clearFilters' });
  assert.deepEqual(parse('show me everything'), { kind: 'clearFilters' });
});

test('sort, paging, platform, theme', () => {
  assert.deepEqual(parse('sort by name'), { kind: 'sort', sort: 'Name (A-Z)' });
  assert.deepEqual(parse('sort by most popular'), { kind: 'sort', sort: 'Stars (High-Low)' });
  assert.deepEqual(parse('sort by verified'), { kind: 'sort', sort: 'Verified (First)' });
  assert.deepEqual(parse('next page'), { kind: 'page', target: 'next' });
  assert.deepEqual(parse('go to page 3'), { kind: 'page', target: 3 });
  assert.deepEqual(parse('switch to macos'), { kind: 'platform', platform: 'macos' });
  assert.deepEqual(parse('use the synthwave theme'), { kind: 'theme', theme: 'synthwave' });
  assert.deepEqual(parse('switch to the matrix theme'), { kind: 'theme', theme: 'm4trix' });
});

test('panels and details', () => {
  assert.deepEqual(parse('open mission control'), { kind: 'openPanel', panel: 'missionControl' });
  assert.deepEqual(parse('take bundle'), { kind: 'openPanel', panel: 'bundle' });
  assert.deepEqual(parse('can you open telemetry'), { kind: 'openPanel', panel: 'telemetry' });
  assert.deepEqual(parse('I want to open the shell generator'), { kind: 'openPanel', panel: 'commandGenerator' });
  const detail = parse('open lazygit') as Extract<AppCommand, { kind: 'openAgent' }>;
  assert.equal(detail.kind, 'openAgent');
  assert.equal(detail.agent.id, 'lazygit');
});

test('list membership', () => {
  const add = parse('add lazygit to comparison') as Extract<AppCommand, { kind: 'membership' }>;
  assert.equal(add.kind, 'membership');
  assert.equal(add.list, 'compare');
  assert.equal(add.member, true);
  const rm = parse('remove lazygit from my bundle') as Extract<AppCommand, { kind: 'membership' }>;
  assert.equal(rm.list, 'bundle');
  assert.equal(rm.member, false);
  assert.equal((parse('recruit lazygit') as Extract<AppCommand, { kind: 'membership' }>).list, 'squad');
  assert.deepEqual(parse('clear my bundle'), { kind: 'clearList', list: 'bundle' });
});

test('chatter and registry questions are not app commands', () => {
  for (const text of ['hello', 'I like docker', 'what is lazygit', 'find me a coding agent', 'compare lazygit vs lazydocker', 'how do I install ripgrep', 'tell me a joke']) {
    assert.equal(parse(text), null, text);
  }
});

const makeApp = (overrides: Partial<AppSnapshot> = {}) => {
  const calls: string[] = [];
  const snap: AppSnapshot = {
    platform: 'linux', search: '', category: 'All', sort: 'Stars (High-Low)', page: 1, totalPages: 14,
    resultCount: 159, registrySize: 159, theme: 'Default', panel: null, selectedAgentId: null,
    compare: [], squad: [], bundle: [], ...overrides,
  };
  const app: AppController = {
    snapshot: () => snap,
    countMatches: () => 7,
    setSearch: q => calls.push(`search:${q}`),
    setCategory: c => calls.push(`category:${c}`),
    setSort: s => calls.push(`sort:${s}`),
    goToPage: p => calls.push(`page:${p}`),
    clearFilters: () => calls.push('clear'),
    openAgent: id => { calls.push(`agent:${id}`); return true; },
    openPanel: p => calls.push(`panel:${p}`),
    closePanels: () => calls.push('close'),
    setMembership: (l, id, m) => calls.push(`${m ? '+' : '-'}${l}:${id}`),
    clearList: l => calls.push(`clearList:${l}`),
    setPlatform: p => calls.push(`platform:${p}`),
    setTheme: t => calls.push(`theme:${t}`),
    sync: () => calls.push('sync'),
    verify: () => calls.push('verify'),
  };
  return { app, calls };
};

test('commands drive the controller and report what happened', () => {
  const { app, calls } = makeApp();
  const r = runAppCommand(parse('search for git')!, app, AGENTS);
  assert.deepEqual(calls, ['search:git']);
  assert.match(r.text, /7 tools match/);
});

test('paging refuses to leave the result set', () => {
  const { app, calls } = makeApp({ page: 14, totalPages: 14 });
  const r = runAppCommand(parse('next page')!, app, AGENTS);
  assert.deepEqual(calls, []);
  assert.match(r.text, /no page 15/);
});

test('the comparison engine needs two queued tools', () => {
  const { app, calls } = makeApp({ compare: ['lazygit'] });
  const r = runAppCommand(parse('open comparison')!, app, AGENTS);
  assert.deepEqual(calls, []);
  assert.match(r.text, /needs two tools/);
});

test('opening a comparison of two tools queues both and opens the engine', () => {
  const { app, calls } = makeApp();
  runAppCommand(parse('open comparison of lazygit and lazydocker')!, app, AGENTS);
  assert.deepEqual(calls, ['clearList:compare', '+compare:lazygit', '+compare:lazydocker', 'panel:comparison']);
});

test('where am I summarizes the view', () => {
  const { app } = makeApp({ search: 'git', resultCount: 12, compare: ['lazygit'] });
  const r = runAppCommand(parse('where am I')!, app, AGENTS);
  assert.match(r.text, /page 1 of 14/);
  assert.match(r.text, /search “git”/);
  assert.match(r.text, /Comparison queue: lazygit|Comparison queue: Lazygit/i);
});
