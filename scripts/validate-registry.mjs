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
 *   5. Runtime limits — field lengths and array sizes match the boot-time
 *      validator in utils/validation.ts, so an entry that passes here is
 *      never silently dropped in the browser.
 *   6. Optional fields — archived is boolean, platformCommands values are
 *      non-empty strings, and the primary installCommand is a runnable
 *      command rather than prose.
 *   7. Tag vocabulary — every tag has a tooltip description (L3 metadata
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

let AGENTS, TAG_DESCRIPTIONS, REGISTRY_METADATA_AS_OF;
try {
  ({ AGENTS, TAG_DESCRIPTIONS, REGISTRY_METADATA_AS_OF } = new Function('AgentCategory', `${constantsSrc}; return { AGENTS, TAG_DESCRIPTIONS, REGISTRY_METADATA_AS_OF };`)(AgentCategory));
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

if (typeof REGISTRY_METADATA_AS_OF !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(REGISTRY_METADATA_AS_OF) || Number.isNaN(Date.parse(REGISTRY_METADATA_AS_OF))) {
  fail(`REGISTRY_METADATA_AS_OF must be an ISO date (YYYY-MM-DD), got '${REGISTRY_METADATA_AS_OF}'`);
}

// Mirrors validateAgent() in utils/validation.ts.
const MAX_STRING = { id: 50, name: 100, description: 500, longDescription: 2000, language: 50, installCommand: 300, repoUrl: 500 };
const MAX_ARRAY = { features: [20, 100], tags: [20, 30], useCases: [10, 200], reviews: [100, Infinity] };
const PLATFORM_KEYS = new Set(['default', 'windows', 'linux', 'macos', 'docker', 'notes']);

// Mirrors isExecutableCommand() in utils/command.ts.
const isExecutableCommand = (command) => {
  const trimmed = command.trim();
  return /^[a-z0-9_.~/$"'(-]/.test(trimmed) && !/<[a-z][\w-]*>/i.test(trimmed);
};

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

  for (const [field, max] of Object.entries(MAX_STRING)) {
    if (typeof agent[field] === 'string' && agent[field].length > max) {
      fail(`${label}: '${field}' is ${agent[field].length} chars (runtime limit ${max}); the app would drop this entry`);
    }
  }
  for (const [field, [maxItems, maxLen]] of Object.entries(MAX_ARRAY)) {
    const value = agent[field];
    if (!Array.isArray(value)) continue;
    if (value.length > maxItems) fail(`${label}: '${field}' has ${value.length} items (runtime limit ${maxItems})`);
    for (const item of value) {
      if (field !== 'reviews' && (typeof item !== 'string' || item.length === 0 || item.length > maxLen)) {
        fail(`${label}: '${field}' item ${JSON.stringify(item)} must be a 1-${maxLen} char string`);
      }
    }
  }

  if (agent.archived !== undefined && typeof agent.archived !== 'boolean') {
    fail(`${label}: 'archived' must be a boolean when present`);
  }

  if (agent.platformCommands !== undefined) {
    if (typeof agent.platformCommands !== 'object' || agent.platformCommands === null) {
      fail(`${label}: 'platformCommands' must be an object`);
    } else {
      for (const [key, value] of Object.entries(agent.platformCommands)) {
        if (!PLATFORM_KEYS.has(key)) fail(`${label}: unknown platformCommands key '${key}'`);
        if (typeof value !== 'string' || value.trim().length === 0) fail(`${label}: platformCommands.${key} must be a non-empty string`);
      }
    }
  }

  if (typeof agent.installCommand === 'string' && !isExecutableCommand(agent.installCommand)) {
    fail(`${label}: installCommand reads as prose, not a runnable command: '${agent.installCommand}'`);
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
console.log(`Archived:        ${(AGENTS ?? []).filter(a => a.archived).length}`);
console.log(`Metadata as of:  ${REGISTRY_METADATA_AS_OF}`);

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
