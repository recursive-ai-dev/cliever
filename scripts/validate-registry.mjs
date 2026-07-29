#!/usr/bin/env node
/**
 * Registry Integrity Gate (offline, zero-dependency)
 *
 * Asserts the schema invariants from TESTING.md / LOGIC-MAP.md against the
 * live agent registry in constants.ts:
 *   1. Schema integrity — every agent carries all required fields.
 *   2. Uniqueness — agent ids and names never collide (L2: A ∩ B = ∅) so
 *      id-keyed storage (reviews, verification, bundles) stays consistent.
 *   3. Category validity — categories resolve against the AgentCategory enum.
 *   4. URL/command sanity — repo URLs are http(s), install commands non-empty.
 *   5. Tag vocabulary — every tag has a tooltip description (L3 metadata
 *      completeness); reported as warnings.
 *
 * Exit 0 on pass, 1 on failure. Safe to run in CI, pre-commit, or locally.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

// --- Load AgentCategory enum values from types.ts ---------------------------
const typesSrc = fs.readFileSync(path.join(root, 'types.ts'), 'utf8');
const enumMatch = typesSrc.match(/export enum AgentCategory \{([\s\S]*?)\}/);
if (!enumMatch) {
  console.error('FATAL: AgentCategory enum not found in types.ts');
  process.exit(1);
}
const AgentCategory = {};
for (const m of enumMatch[1].matchAll(/(\w+)\s*=\s*'([^']+)'/g)) {
  AgentCategory[m[1]] = m[2];
}

// --- Evaluate constants.ts in a tiny sandbox --------------------------------
// constants.ts intentionally contains only import statements, two exported
// literal declarations, and AgentCategory.* references, so this is safe.
const constantsSrc = fs.readFileSync(path.join(root, 'constants.ts'), 'utf8')
  .replace(/^import[^;]*;\n/gm, '')
  .replace(/^export /gm, '')
  .replace(/: Record<string, string>\s*=/, '=')
  .replace(/: Agent\[\]\s*=/, '=');

let AGENTS, TAG_DESCRIPTIONS;
try {
  ({ AGENTS, TAG_DESCRIPTIONS } = new Function('AgentCategory', `${constantsSrc}; return { AGENTS, TAG_DESCRIPTIONS };`)(AgentCategory));
} catch (error) {
  console.error('FATAL: constants.ts could not be evaluated:', error.message);
  process.exit(1);
}

// --- Assertions --------------------------------------------------------------
const failures = [];
const warnings = [];

const fail = (msg) => failures.push(msg);
const warn = (msg) => warnings.push(msg);

if (!Array.isArray(AGENTS) || AGENTS.length === 0) {
  fail('AGENTS is empty or not an array');
}

const REQUIRED_STRING_FIELDS = ['id', 'name', 'description', 'longDescription', 'language', 'installCommand', 'repoUrl', 'version'];
const REQUIRED_ARRAY_FIELDS = ['features', 'tags', 'useCases', 'reviews'];
const categoryValues = new Set(Object.values(AgentCategory));

const ids = new Map();
const names = new Map();

for (const [index, agent] of (AGENTS ?? []).entries()) {
  const label = agent?.id ?? `index ${index}`;

  for (const field of REQUIRED_STRING_FIELDS) {
    if (typeof agent[field] !== 'string' || agent[field].trim().length === 0) {
      fail(`${label}: required string field '${field}' is missing or empty`);
    }
  }
  for (const field of REQUIRED_ARRAY_FIELDS) {
    if (!Array.isArray(agent[field])) {
      fail(`${label}: required array field '${field}' is missing`);
    }
  }

  if (typeof agent.stars !== 'number' || !Number.isFinite(agent.stars) || agent.stars < 0) {
    fail(`${label}: stars must be a finite non-negative number (got ${agent.stars})`);
  }

  if (!categoryValues.has(agent.category)) {
    fail(`${label}: category '${agent.category}' is not a valid AgentCategory value`);
  }

  try {
    const url = new URL(agent.repoUrl);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      fail(`${label}: repoUrl uses unsafe protocol '${url.protocol}'`);
    }
  } catch {
    fail(`${label}: repoUrl '${agent.repoUrl}' is not a valid URL`);
  }

  if (ids.has(agent.id)) {
    fail(`${label}: duplicate id (first seen at index ${ids.get(agent.id)})`);
  } else {
    ids.set(agent.id, index);
  }
  if (names.has(agent.name)) {
    fail(`${label}: duplicate name '${agent.name}' (first seen at index ${names.get(agent.name)})`);
  } else {
    names.set(agent.name, index);
  }

  for (const tag of agent.tags ?? []) {
    if (!TAG_DESCRIPTIONS[tag]) {
      warn(`${label}: tag '${tag}' has no TAG_DESCRIPTIONS entry`);
    }
  }
}

// --- Report ------------------------------------------------------------------
console.log('CLI-Verse Registry Integrity Gate');
console.log('=================================');
console.log(`Agents scanned:  ${AGENTS.length}`);
console.log(`Unique ids:      ${ids.size}`);
console.log(`Unique names:    ${names.size}`);
console.log(`Categories:      ${categoryValues.size}`);

if (warnings.length > 0) {
  console.log(`\nWarnings (${warnings.length}):`);
  for (const w of warnings.slice(0, 20)) console.log(`  WARN  ${w}`);
  if (warnings.length > 20) console.log(`  ... and ${warnings.length - 20} more`);
}

if (failures.length > 0) {
  console.log(`\nFAILURES (${failures.length}):`);
  for (const f of failures) console.log(`  FAIL  ${f}`);
  process.exit(1);
}

console.log('\nAll registry integrity checks passed.');
process.exit(0);
