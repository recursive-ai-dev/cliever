#!/usr/bin/env node
/**
 * Bundles tests/unit/*.test.ts with esbuild (shipped with Vite) so Node's test runner
 * can execute TypeScript sources that use enums and path imports.
 */
import { build } from 'esbuild';
import { spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const testDir = path.join(root, 'tests', 'unit');
const entries = fs.readdirSync(testDir).filter(f => f.endsWith('.test.ts')).map(f => path.join(testDir, f));
const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'cliever-unit-'));

await build({
  entryPoints: entries,
  outdir,
  bundle: true,
  platform: 'node',
  format: 'esm',
  outExtension: { '.js': '.mjs' },
  logLevel: 'warning',
});

const files = entries.map(f => path.join(outdir, path.basename(f).replace(/\.ts$/, '.mjs')));
const result = spawnSync(process.execPath, ['--test', ...files], { stdio: 'inherit' });
fs.rmSync(outdir, { recursive: true, force: true });
process.exit(result.status ?? 1);
