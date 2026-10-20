#!/usr/bin/env bash
# npm-to-deb 1.0.1 — standalone npm project to Debian desktop package builder.
# SPDX-License-Identifier: MIT
# Run: bash npm-to-deb.sh /path/to/project --help
# Requires Linux, Node.js >=22.12, npm and dpkg-deb; no global npm installs.
set -euo pipefail
if ! command -v node >/dev/null 2>&1; then
  printf 'Error: Node.js is missing. Install Node.js 24 LTS and npm first.\n' >&2
  exit 127
fi
exec node --input-type=commonjs - "$@" <<'NPM_TO_DEB_JAVASCRIPT'
'use strict';

// npm-to-deb, version 1.0.1. The delivered .sh embeds this Node.js program.
// SPDX-License-Identifier: MIT
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const { spawn, spawnSync } = require('node:child_process');

const HELP = String.raw`
npm-to-deb 1.0.1 — package an npm frontend or Electron app for Debian

Usage:
  bash npm-to-deb.sh [PROJECT_DIRECTORY] [OPTIONS]

Examples:
  bash npm-to-deb.sh ~/code/my-app
  bash npm-to-deb.sh . --name "My App" --icon public/icon.png
  bash npm-to-deb.sh . --dist dist --prebuilt
  bash npm-to-deb.sh . --mode electron --build-script build:electron
  bash npm-to-deb.sh . --maintainer "Your Name <you@example.com>" --arch arm64

Core options:
  --name TEXT             Application-menu / window name (from package.json)
  --package NAME          Debian package and executable name (derived from name)
  --app-id ID             Stable reverse-domain application ID
  --version SEMVER        App version (package.json version, or 1.0.0)
  --description TEXT      Short description (from package.json)
  --maintainer TEXT       Debian maintainer, e.g. "Your Name <you@example.com>"
  --homepage URL          Project homepage; defaults to a reserved example.invalid
                         placeholder when package.json has no homepage
  --icon FILE             Square PNG, at least 256 px; 512 px recommended
  --category CATEGORY     Desktop menu category (default: Utility)
  --arch x64|arm64        Target CPU; amd64/aarch64 aliases accepted
  --out DIRECTORY        Output parent (default: PROJECT/desktop-packages)
  --mode auto|web|electron
                         auto uses Electron only with a declared dependency AND
                         a main entry or builder config; otherwise wraps the web
                         frontend. --dist/--prebuilt imply web in auto mode.

Frontend / build options:
  --dist DIRECTORY       Static output folder, relative to the project
                         Auto: dist, build, out, .output/public, common client
                         and Angular browser folders. Ambiguity is an error.
  --build-script NAME    npm script to run (default: build, if present)
  --build-arg ARG        Argument appended to that script; repeat as needed
                         Example: --build-arg=--base=/
  --skip-build           Install dependencies, then use the existing output
  --prebuilt             WEB mode only: skip project install AND build
  --no-spa               Disable fallback to index.html for SPA page routes
  --width PIXELS         Initial window width (default: 1280)
  --height PIXELS        Initial window height (default: 800)
  --csp POLICY           Optional Content-Security-Policy response header

Packaging / inspection options:
  --builder-config FILE  ELECTRON mode: existing electron-builder configuration
                         Auto-detects electron-builder.* or package.json.build
  --electron-version SPEC
                         web default: latest; Electron mode: installed version
                         Use an exact version to pin the runtime deliberately
  --builder-version SPEC electron-builder 26.x only (default: 26)
  --prepare-only         Generate staging files after frontend build, then stop
                         With --prebuilt: no npm installs, downloads or execution
  --keep-work            Keep the temporary workspace after a successful build
  --allow-root           Allow root in a build container; normally run as yourself
  --help, -h             Show this help

Requirements: Linux, Bash, Node.js >=22.12, npm, dpkg-deb (for final verification),
and internet access for uncached npm packages / Electron / packaging helpers.
Native dependencies can additionally need Python, make, g++, git and development
headers. Prefer a build machine matching your target architecture and the oldest
Debian/Ubuntu release you intend to support, especially with native modules.

Relative --dist, --icon and --builder-config paths start at PROJECT_DIRECTORY.
Relative --out paths start at your current directory. Output gets a new uniquely
named subdirectory per run; previous packages are never overwritten.

The script copies the project to a private temporary directory, omitting Git
metadata, node_modules, caches and previous output. It uses npm ci with an npm
lockfile; otherwise npm install. It runs the project's own install/build hooks
as your user. This is a working copy, NOT a security sandbox: use trusted projects.
Copies include build-time .env/.npmrc files. After build, .env, .env.*, .npmrc and
electron-builder.env are removed from the copy before packaging (never from your
source). Existing Electron apps must read private runtime configuration from the
user environment or userData instead. Failed workspaces may still contain these
files. Symlinks and local dependencies outside the project are rejected.

Web mode ships the built files and an Electron runtime. It does not bundle an
Express/Python backend, start an npm dev server, or convert SSR into static HTML.
Export Next/Nuxt/etc. to static files first, or use an existing Electron project
that already starts its production backend. Absolute asset URLs should use /,
not a hosted-site subdirectory. APIs still need a reachable server and CORS that
accepts the app://bundle origin; this wrapper does not rewrite or proxy them.

The generated renderer has no Node integration; sandbox, context isolation and
web security remain enabled. Device/notification permissions are denied. HTTP(S)
links open in the normal browser. Existing Electron apps retain their own runtime
and security behavior. Neither npm nor Node needs to be installed on the target
desktop; Debian still installs Electron's OS-library dependencies via apt.

No package is installed, published, or uploaded by this script. Install the
result ON DEBIAN/UBUNTU with: sudo apt install ./your-package.deb
Uninstall using its package name: sudo apt remove your-package-name

Implementation references (checked 2026-10-20):
  https://www.electron.build/v26/docs/linux/
  https://www.electron.build/v26/docs/configuration/
  https://www.electronjs.org/docs/latest/api/protocol/
  https://www.electronjs.org/docs/latest/tutorial/security/
`;

const valueOptions = new Map([
  ['--name', 'title'], ['--package', 'packageName'], ['--app-id', 'appId'],
  ['--version', 'version'], ['--description', 'description'],
  ['--maintainer', 'maintainer'], ['--homepage', 'homepage'], ['--icon', 'icon'],
  ['--category', 'category'], ['--arch', 'arch'], ['--out', 'out'],
  ['--mode', 'mode'], ['--dist', 'dist'], ['--build-script', 'buildScript'],
  ['--build-arg', 'buildArg'], ['--width', 'width'], ['--height', 'height'],
  ['--csp', 'csp'], ['--builder-config', 'builderConfig'],
  ['--electron-version', 'electronSpec'], ['--builder-version', 'builderSpec']
]);
const booleanOptions = new Map([
  ['--skip-build', 'skipBuild'], ['--prebuilt', 'prebuilt'], ['--no-spa', 'noSpa'],
  ['--prepare-only', 'prepareOnly'], ['--keep-work', 'keepWork'],
  ['--allow-root', 'allowRoot']
]);
function fail(message) { throw new Error(message); }
function log(message) { console.log(`\n[npm-to-deb] ${message}`); }
function within(root, file) {
  const relative = path.relative(root, file);
  return relative === '' || (!path.isAbsolute(relative) && relative !== '..' && !relative.startsWith(`..${path.sep}`));
}
function readJSON(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (error) { fail(`Cannot read JSON from ${file}: ${error.message}`); }
}
function writeJSON(file, value) { fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n'); }
function fileExists(file) { try { return fs.statSync(file).isFile(); } catch { return false; } }
function builderConfigFiles(project) {
  return ['yml', 'yaml', 'json', 'json5', 'toml', 'js', 'cjs', 'mjs', 'ts']
    .map(ext => path.join(project, `electron-builder.${ext}`)).filter(fileExists);
}
function hasMainEntry(pkg) { return typeof pkg.main === 'string' && pkg.main.trim().length > 0; }
function hasBuilderSettings(pkg) {
  return Boolean(pkg.build && typeof pkg.build === 'object' && !Array.isArray(pkg.build) && Object.keys(pkg.build).length > 0);
}
function selectMode(pkg, project, options) {
  if (options.mode !== 'auto') return options.mode;
  if (options.builderConfig) return 'electron';
  if (options.dist !== undefined || options.prebuilt) return 'web';
  const dependencies = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.optionalDependencies };
  const hasDesktopEntry = hasMainEntry(pkg) || hasBuilderSettings(pkg) || builderConfigFiles(project).length > 0;
  return dependencies.electron && hasDesktopEntry ? 'electron' : 'web';
}
function parseArgs(args) {
  const options = { mode: 'auto', buildArgs: [], builderSpec: '26' };
  let positional = false;
  for (let index = 0; index < args.length; index++) {
    let token = args[index];
    if (token === '--help' || token === '-h') { console.log(HELP); return null; }
    if (token === '--') {
      if (positional || args.length !== index + 2) fail('After --, provide exactly one project directory.');
      options.project = args[++index]; positional = true; continue;
    }
    if (!token.startsWith('-')) {
      if (positional) fail(`Unexpected argument: ${token}. Use --help for syntax.`);
      options.project = token; positional = true; continue;
    }
    const equals = token.indexOf('=');
    let value;
    if (equals >= 0) { value = token.slice(equals + 1); token = token.slice(0, equals); }
    if (booleanOptions.has(token)) {
      if (value !== undefined) fail(`${token} does not take a value.`);
      options[booleanOptions.get(token)] = true; continue;
    }
    if (!valueOptions.has(token)) fail(`Unknown option: ${token}. Use --help for syntax.`);
    if (value === undefined) value = args[++index];
    if (value === undefined || value === '') fail(`${token} needs a value.`);
    if (token === '--build-arg') options.buildArgs.push(value);
    else options[valueOptions.get(token)] = value;
  }
  return options;
}
function oneLine(value, label, max = 300) {
  if (typeof value !== 'string' || !value.trim() || /[\x00-\x1f\x7f]/.test(value) || value.length > max)
    fail(`${label} must be a nonempty single line, at most ${max} characters.`);
  return value.trim();
}
function versionSpec(value, label) {
  if (!/^[a-zA-Z0-9.*+^~<>=| -]+$/.test(value) || value.length > 100)
    fail(`${label} must be an npm version, version range, or dist-tag (not a URL or path).`);
  return value;
}
function makeSlug(value) {
  let slug = value.toLowerCase().replace(/^@/, '').replace(/[^a-z0-9+.-]+/g, '-').replace(/^[^a-z0-9]+/, '').replace(/-+$/, '');
  if (slug.length < 2) slug = `app-${slug || 'desktop'}`;
  return slug;
}
function validatePng(file) {
  const header = Buffer.alloc(24);
  const fd = fs.openSync(file, 'r');
  let size;
  try { size = fs.readSync(fd, header, 0, 24, 0); } finally { fs.closeSync(fd); }
  if (size < 24 || !header.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) || header.toString('ascii', 12, 16) !== 'IHDR')
    fail(`Icon must be a PNG image: ${file}`);
  const width = header.readUInt32BE(16), height = header.readUInt32BE(20);
  if (width !== height || width < 256 || width > 4096) fail(`Icon must be square and 256–4096 pixels (512 recommended): ${file}`);
}

// Preserve internal links, rewriting absolute links to their staged equivalents.
// Never follow a project symlink into another checkout or the user's home tree.
function copyTree(source, destination, omitted = [], web = false) {
  const root = fs.realpathSync(source);
  const skipNames = new Set(['node_modules', '.git', '.hg', '.svn', '.cache', '.npm', '.pnpm-store']);
  function copy(from, to) {
    if (omitted.some(item => within(item, from))) return;
    const name = path.basename(from);
    if (from !== root && (skipNames.has(name) || (web && (name === '.npmrc' || /^\.env(?:\.|$)/.test(name))))) return;
    const info = fs.lstatSync(from);
    if (info.isSymbolicLink()) {
      let target;
      try { target = fs.realpathSync(from); }
      catch { fail(`Dangling symlink cannot be staged: ${from}`); }
      if (!within(root, target)) fail(`Symlink leaves the project/build folder: ${from}\nMake its target part of the project first.`);
      if (omitted.some(item => within(item, target))) fail(`Symlink points into excluded output: ${from}`);
      const newTarget = path.join(destination, path.relative(root, target));
      fs.symlinkSync(path.relative(path.dirname(to), newTarget) || '.', to);
    } else if (info.isDirectory()) {
      fs.mkdirSync(to, { recursive: true, mode: 0o755 });
      fs.chmodSync(to, 0o755);
      for (const child of fs.readdirSync(from).sort()) copy(path.join(from, child), path.join(to, child));
    } else if (info.isFile()) {
      fs.copyFileSync(from, to);
      fs.chmodSync(to, (info.mode & 0o111) ? 0o755 : 0o644);
    } else fail(`Unsupported special file in project: ${from}`);
  }
  copy(root, destination);
}
function removeBuildConfiguration(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.name === '.npmrc' || /^\.env(?:\.|$)/.test(entry.name) || entry.name === 'electron-builder.env') {
      fs.rmSync(file, { recursive: true, force: true });
    } else if (entry.isDirectory() && entry.name !== 'node_modules') removeBuildConfiguration(file);
  }
}
function checkLocalDependencies(pkg, manifestDirectory, projectRoot = manifestDirectory) {
  for (const group of ['dependencies', 'devDependencies', 'optionalDependencies']) {
    for (const [name, spec] of Object.entries(pkg[group] || {})) {
      if (typeof spec === 'string' && /^(file:|link:|\.\.?\/)/.test(spec)) {
        let local;
        try { local = decodeURIComponent(spec.replace(/^(file:|link:)/, '')); }
        catch { fail(`Dependency ${name} has an invalid local path: ${spec}`); }
        if (path.isAbsolute(local) || local.startsWith('~') || local.includes('\\'))
          fail(`Dependency ${name} uses an absolute/home-based local path (${spec}).\nChange it to a relative file: path before staging, or package prebuilt web output.`);
        const target = path.resolve(manifestDirectory, local);
        if (!within(projectRoot, target)) fail(`Dependency ${name} points outside this project (${spec}).\nRun from a self-contained workspace root, or package a prebuilt web output.`);
      }
    }
  }
}
function checkWorkspaceDependencies(projectRoot) {
  function walk(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory() && entry.name !== 'node_modules' && !entry.name.startsWith('.')) walk(file);
      else if (entry.isFile() && entry.name === 'package.json') checkLocalDependencies(readJSON(file), directory, projectRoot);
    }
  }
  walk(projectRoot);
}
function findDist(project, explicit) {
  if (explicit !== undefined) {
    const folder = path.resolve(project, explicit);
    if (!within(project, folder)) fail('--dist must be inside the project directory.');
    if (!fileExists(path.join(folder, 'index.html'))) fail(`No index.html in --dist folder: ${folder}`);
    const real = fs.realpathSync(folder);
    if (!within(project, real)) fail('--dist resolves outside the copied project.');
    return real;
  }
  const guesses = ['dist', 'build', 'out', '.output/public', 'dist/client', 'build/client', 'dist/browser'];
  const dist = path.join(project, 'dist');
  if (fs.existsSync(dist) && fs.statSync(dist).isDirectory()) {
    for (const child of fs.readdirSync(dist, { withFileTypes: true })) {
      if (child.isDirectory()) guesses.push(`dist/${child.name}`, `dist/${child.name}/browser`);
    }
  }
  const matches = [...new Set(guesses.map(item => path.join(project, item)).filter(folder => fileExists(path.join(folder, 'index.html'))).map(folder => fs.realpathSync(folder)))];
  if (matches.some(folder => !within(project, folder))) fail('A detected build folder points outside the copied project.');
  if (matches.length === 1) return matches[0];
  if (matches.length > 1) fail(`Several build folders contain index.html:\n${matches.map(folder => '  ' + path.relative(project, folder)).join('\n')}\nChoose one explicitly with --dist.`);
  fail('No deployable static index.html was found. Use --dist path/to/build-output.\nIf the app uses SSR, export it to static HTML first. An Express/Next production server\nneeds explicit backend integration; npm start is not a desktop packaging strategy.');
}

let activeChild = null;
let interrupted = false;
let stopSignal = 'SIGINT';
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => {
  interrupted = true; stopSignal = signal;
  if (activeChild) { try { process.kill(-activeChild.pid, signal); } catch {} }
});
function checkInterrupted() { if (interrupted) fail(`Interrupted by ${stopSignal}.`); }
async function run(command, args, cwd, extraEnv = {}) {
  checkInterrupted();
  log(`Running ${[command, ...args].map(arg => JSON.stringify(arg)).join(' ')}`);
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, env: { ...process.env, ...extraEnv }, stdio: 'inherit', detached: true });
    activeChild = child;
    child.on('error', error => { activeChild = null; reject(new Error(`Cannot start ${command}: ${error.message}`)); });
    child.on('close', (code, signal) => {
      if (activeChild === child) activeChild = null;
      if (code === 0 && !interrupted) resolve();
      else reject(new Error(`${path.basename(command)} failed (${signal || `exit ${code}`}). See its output above.`));
    });
  });
  checkInterrupted();
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!options) return;
  const [major, minor] = process.versions.node.split('.').map(Number);
  if (major < 22 || (major === 22 && minor < 12)) fail('Use Node.js 22.12 or newer; Node 24 LTS is recommended.');
  if (process.platform !== 'linux') fail('Run this script on Linux (a Linux build container also works).');
  if (process.getuid?.() === 0 && !options.allowRoot) fail('Run as your regular user, without sudo. For a root build container, pass --allow-root.');
  if (!['auto', 'web', 'electron'].includes(options.mode)) fail('--mode must be auto, web, or electron.');
  const project = fs.realpathSync(path.resolve(options.project || '.'));
  const original = readJSON(path.join(project, 'package.json'));
  if (!original || typeof original !== 'object' || Array.isArray(original)) fail('package.json must contain a JSON object.');
  for (const key of ['dist', 'builderConfig']) {
    if (options[key] !== undefined) {
      const resolved = path.resolve(project, options[key]);
      if (!within(project, resolved)) fail(`--${key === 'dist' ? 'dist' : 'builder-config'} must be inside the project.`);
      options[key] = path.relative(project, resolved) || '.';
    }
  }
  const allDeps = { ...original.dependencies, ...original.devDependencies, ...original.optionalDependencies };
  if (options.builderConfig && (options.dist !== undefined || options.prebuilt))
    fail('--builder-config cannot be combined with --dist or --prebuilt. Choose web wrapping or existing Electron packaging.');
  let mode = selectMode(original, project, options);
  if (options.prebuilt && mode !== 'web') fail('--prebuilt is for web mode. Electron runtime dependencies need an npm install.');
  if (options.builderConfig && mode !== 'electron') fail('--builder-config applies to --mode electron only.');
  if (options.dist && mode !== 'web') fail('--dist applies to web mode. Electron apps use their existing main entry and build config.');
  if (mode === 'electron' && !allDeps.electron) fail('Electron mode needs an electron dependency in package.json. Otherwise use --mode web.');
  if (!options.prebuilt && original.packageManager && !original.packageManager.startsWith('npm@'))
    fail(`This project declares ${original.packageManager}. This script installs with npm.\nBuild with its declared package manager first, then use --mode web --prebuilt --dist OUTPUT.`);
  if (!options.prebuilt) checkLocalDependencies(original, project);
  const packageName = options.packageName || original.build?.deb?.packageName || original.build?.linux?.packageName || makeSlug(original.name || path.basename(project));
  if (!/^[a-z0-9][a-z0-9+.-]{1,79}$/.test(packageName)) fail('--package must be 2–80 lowercase Debian-name characters: letters, digits, +, -, .');
  const title = oneLine(options.title || original.productName || original.build?.productName || original.build?.extraMetadata?.productName || (original.name || packageName).split('/').pop(), 'App name', 100);
  if (/[\\/]/.test(title)) fail('App display name cannot contain / or \\. Use --name "My App" for a scoped npm package.');
  const version = options.version || original.version || '1.0.0';
  if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/.test(version))
    fail('App version must be semantic x.y.z, optionally with a prerelease/build suffix. Use --version 1.0.0.');
  const description = oneLine(options.description || original.description || `${title} desktop application`, 'Description');
  const author = typeof original.author === 'string' ? original.author :
    original.author?.name && original.author?.email ? `${original.author.name} <${original.author.email}>` : '';
  const maintainer = oneLine(options.maintainer || original.build?.deb?.maintainer || original.build?.linux?.maintainer || (/<[^<>\s]+@[^<>\s]+>/.test(author) ? author : 'Local Builder <builder@localhost>'), 'Maintainer');
  if (!/^[^<>]+<[^<>\s@]+@[^<>\s@]+>$/.test(maintainer)) fail('--maintainer must look like "Your Name <you@example.com>".');
  const appId = options.appId || original.build?.appId || `local.npm.${packageName.replace(/[^a-z0-9-]/g, '-')}`;
  if (!/^[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)+$/.test(appId)) fail('--app-id must be a reverse-domain ID, e.g. io.example.myapp.');
  const homepage = options.homepage || (/^https?:\/\//.test(original.homepage || '') ? original.homepage : `https://example.invalid/${packageName}`);
  if (homepage) {
    const url = new URL(oneLine(homepage, 'Homepage', 2000));
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) fail('--homepage must be an http(s) URL without credentials.');
  }
  const category = options.category || original.build?.linux?.category || 'Utility';
  if (!['AudioVideo', 'Audio', 'Video', 'Development', 'Education', 'Game', 'Graphics', 'Network', 'Office', 'Science', 'Settings', 'System', 'Utility'].includes(category))
    fail('Choose a standard desktop menu category, e.g. Utility, Development, Game, Graphics, or Office.');
  const archAliases = { amd64: 'x64', x86_64: 'x64', aarch64: 'arm64', x64: 'x64', arm64: 'arm64' };
  const arch = archAliases[options.arch || process.arch];
  if (!arch) fail('Supported targets are --arch x64 and --arch arm64.');
  const width = Number(options.width || 1280), height = Number(options.height || 800);
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 480 || height < 320 || width > 7680 || height > 4320)
    fail('Window size must be integer pixels: width 480–7680, height 320–4320.');
  if (options.csp && /[\r\n\0]/.test(options.csp)) fail('--csp cannot contain newline or NUL characters.');
  const builderSpec = versionSpec(options.builderSpec, 'Builder version');
  if (options.electronSpec) versionSpec(options.electronSpec, 'Electron version');
  const outputParent = path.resolve(options.out || path.join(project, 'desktop-packages'));
  if (within(outputParent, project)) fail('--out must not be the project root or an ancestor. Use a dedicated output subfolder.');
  const buildScript = options.buildScript || (original.scripts?.build ? 'build' : null);
  if (options.buildScript && !original.scripts?.[options.buildScript]) fail(`package.json has no script named ${options.buildScript}.`);
  if (options.buildArgs.length && (options.skipBuild || options.prebuilt || !buildScript)) fail('--build-arg needs an enabled npm build script.');
  if (spawnSync('npm', ['--version'], { encoding: 'utf8' }).status !== 0) fail('npm is not available on PATH. Install Node.js and npm first.');
  if (!options.prepareOnly && spawnSync('dpkg-deb', ['--version'], { encoding: 'utf8' }).status !== 0)
    fail('dpkg-deb is required to verify the package. Install your distribution\'s dpkg package first.');
  let iconSource;
  if (options.icon) { iconSource = fs.realpathSync(path.resolve(project, options.icon)); validatePng(iconSource); }
  else if (mode === 'web') {
    for (const candidate of ['build/icon.png', 'assets/icon.png', 'public/icon.png', 'icon.png']) {
      const file = path.join(project, candidate);
      if (fileExists(file)) { try { validatePng(file); iconSource = file; break; } catch {} }
    }
  }
  log(`${title} ${version} | ${mode} mode | ${packageName} | ${arch}`);
  if (arch !== process.arch) log('Cross-architecture target selected. Native addons must be rebuilt for the target; use matching build hardware if they fail.');
  if (maintainer === 'Local Builder <builder@localhost>') log('Using local-only maintainer metadata. Set --maintainer before distributing this package.');
  if (homepage.startsWith('https://example.invalid/')) log('Using a reserved example.invalid homepage placeholder. Set --homepage before distributing this package.');
  let work;
  let success = false;
  let finalDirectory;
  try {
    work = fs.mkdtempSync(path.join(os.tmpdir(), 'npm-to-deb-'));
    fs.chmodSync(work, 0o700);
    if (within(project, fs.realpathSync(work))) fail('TMPDIR must be outside the source project. Use TMPDIR=/tmp.');
    const staged = path.join(work, 'project');
    log(`Staging project in ${work}`);
    copyTree(project, staged, [outputParent]);
    if (!options.prebuilt) {
      checkWorkspaceDependencies(staged);
      const install = fileExists(path.join(staged, 'npm-shrinkwrap.json')) || fileExists(path.join(staged, 'package-lock.json')) ? 'ci' : 'install';
      await run('npm', [install, '--include=dev', '--include=optional', '--no-audit', '--no-fund'], staged, { NODE_ENV: 'development' });
      if (!options.skipBuild && buildScript)
        await run('npm', ['run', buildScript, ...(options.buildArgs.length ? ['--', ...options.buildArgs] : [])], staged, { NODE_ENV: 'production' });
      else log(options.skipBuild ? 'Using existing build output (--skip-build).' : 'No build script; looking for existing deployable files.');
    } else log('Using prebuilt files; project install/build scripts are skipped.');
    checkInterrupted();
    const builtPackage = readJSON(path.join(staged, 'package.json'));
    if (!builtPackage || typeof builtPackage !== 'object' || Array.isArray(builtPackage)) fail('The staged package.json must contain a JSON object after build.');
    // Some build scripts generate the desktop entry or its configuration.
    // Honor that result, while keeping explicit web/Electron choices intact.
    if (mode === 'web' && selectMode(builtPackage, staged, options) === 'electron') {
      mode = 'electron';
      if (!options.icon) iconSource = undefined;
      log('The build declared an Electron entry/configuration; using Electron mode.');
    } else if (mode === 'web' && options.mode === 'auto' && allDeps.electron && options.dist === undefined && !options.prebuilt) {
      log('Electron is installed, but no desktop entry/configuration is declared. Wrapping the frontend in web mode.');
    }
    removeBuildConfiguration(staged);
    const toolchain = path.join(work, 'toolchain');
    fs.mkdirSync(toolchain);
    let electronSpec = options.electronSpec || 'latest';
    if (mode === 'electron' && !options.electronSpec) {
      const installed = path.join(staged, 'node_modules/electron/package.json');
      if (!fileExists(installed)) fail('The staged npm install did not provide electron. Declare it as a development dependency.');
      electronSpec = readJSON(installed).version;
    }
    writeJSON(path.join(toolchain, 'package.json'), { name: 'npm-to-deb-toolchain', version: '1.0.0', private: true });
    let appDirectory = staged;
    let distRelative = null;
    let config;
    let inheritedExternalConfig = false;
    if (mode === 'web') {
      const dist = findDist(staged, options.dist);
      distRelative = path.relative(staged, dist) || '.';
      log(`Static output: ${distRelative}`);
      appDirectory = path.join(work, 'desktop-app');
      fs.mkdirSync(appDirectory);
      copyTree(dist, path.join(appDirectory, 'web'), [], true);
      fs.writeFileSync(path.join(appDirectory, 'main.cjs'), `(${desktopRuntime.toString()})();\n`);
      writeJSON(path.join(appDirectory, 'desktop-config.json'), { title, packageName, width, height, spa: !options.noSpa, csp: options.csp });
      writeJSON(path.join(appDirectory, 'package.json'), {
        name: packageName, productName: title, desktopName: `${packageName}.desktop`, version, description,
        main: 'main.cjs', author: maintainer, homepage, license: original.license || 'UNLICENSED', private: true
      });
      config = {
        extends: null, asar: true, npmRebuild: false,
        files: ['main.cjs', 'desktop-config.json', 'web/**/*', 'icon.png', 'package.json'],
        linux: { category }
      };
    } else {
      let external;
      if (options.builderConfig) {
        const file = path.resolve(staged, options.builderConfig);
        if (!within(staged, file) || !fileExists(file)) fail('--builder-config must identify a file inside the project.');
        external = file;
      } else {
        const configs = builderConfigFiles(staged);
        if (configs.length > 1) fail('Several electron-builder configuration files exist. Select one with --builder-config.');
        external = configs[0];
      }
      const builtSettings = hasBuilderSettings(builtPackage);
      if (external && builtSettings && !options.builderConfig) fail('Both package.json.build and electron-builder config exist. Select the file explicitly with --builder-config, or remove the ambiguity in your source project.');
      // extends lets electron-builder load JS/YAML and preserve resources/hooks.
      config = external ? { extends: external } : { extends: null, ...(builtSettings ? builtPackage.build : {}) };
      inheritedExternalConfig = Boolean(external);
      if (!external && !builtSettings && !hasMainEntry(builtPackage))
        fail('Electron mode needs package.json.main or an existing electron-builder configuration.\nFor a browser frontend, rerun with --mode web. For an existing Electron app,\npoint package.json.main at its actual Electron main-process entry, or supply\n--builder-config FILE.');
      if (external) log(`Using existing electron-builder configuration: ${path.relative(staged, external)}`);
      else log(builtSettings ? 'Using package.json.build configuration.' : 'Using Electron defaults and package.json.main.');
      // Keep the app's npm name/version: self-referential imports and existing
      // data paths may depend on them. Debian identity is configured separately.
      const stagedPackage = builtPackage;
      if (!stagedPackage.homepage) stagedPackage.homepage = homepage;
      if (!stagedPackage.author) stagedPackage.author = maintainer;
      if (!stagedPackage.description) stagedPackage.description = description;
      writeJSON(path.join(staged, 'package.json'), stagedPackage);
      config.extraMetadata = {
        ...(config.extraMetadata || {}), desktopName: `${packageName}.desktop`,
        ...(options.version ? { version } : {}),
        ...(options.description ? { description } : {}),
        ...(options.title ? { productName: title } : {}),
        ...(options.homepage ? { homepage } : {})
      };
    }
    const packOutput = path.join(work, 'packages');
    if (!inheritedExternalConfig || options.appId) config.appId = appId;
    if (!inheritedExternalConfig || options.title) config.productName = title;
    config.artifactName = `${packageName}_\${version}_\${arch}.\${ext}`;
    config.directories = { ...(config.directories || {}), output: packOutput };
    config.linux = {
      ...(config.linux || {}), target: ['deb'], executableName: packageName,
      ...(!inheritedExternalConfig || options.maintainer ? { maintainer } : {}),
      ...(!inheritedExternalConfig || options.category ? { category } : {})
    };
    config.deb = { ...(config.deb || {}), packageName, ...(options.maintainer ? { maintainer } : {}) };
    // Explicitly disable publishing regardless of inherited project settings.
    config.publish = null;
    if (iconSource) {
      const icon = path.join(work, 'desktop-icon.png');
      fs.copyFileSync(iconSource, icon);
      config.linux.icon = icon;
      if (mode === 'web') fs.copyFileSync(iconSource, path.join(appDirectory, 'icon.png'));
    }
    const configFile = path.join(work, 'electron-builder.json');
    writeJSON(configFile, config);
    const manifest = {
      generator: 'npm-to-deb 1.0.1', createdAt: new Date().toISOString(), mode,
      packageName, title: inheritedExternalConfig && !options.title ? null : title,
      version: mode === 'electron' && !options.version ? null : version,
      appId: inheritedExternalConfig && !options.appId ? null : appId,
      metadataNote: mode === 'electron' ? 'Null metadata is inherited from the existing application or electron-builder configuration.' : undefined,
      architecture: arch, node: process.versions.node,
      buildScript: options.skipBuild || options.prebuilt ? null : buildScript,
      buildArgs: options.buildArgs, staticOutput: distRelative,
      maintainer: inheritedExternalConfig && !options.maintainer ? null : maintainer, homepage,
      requestedElectron: electronSpec, requestedBuilder: builderSpec
    };
    writeJSON(path.join(work, 'build-info.json'), manifest);
    if (options.prepareOnly) {
      log(`Prepared application: ${appDirectory}\nConfiguration: ${configFile}\nNo desktop packaging downloads were performed. Workspace retained for inspection.`);
      success = true; return;
    }
    // Tool installs do not need lifecycle hooks. Electron-builder downloads its
    // own target runtime; skipping electron's installer avoids a duplicate fetch.
    await run('npm', ['install', '--ignore-scripts', '--include=dev', '--include=optional', '--no-audit', '--no-fund', '--save-exact', '--save-dev', `electron-builder@${builderSpec}`, `electron@${electronSpec}`], toolchain, { NODE_ENV: 'development' });
    const builderVersion = readJSON(path.join(toolchain, 'node_modules/electron-builder/package.json')).version;
    const electronVersion = readJSON(path.join(toolchain, 'node_modules/electron/package.json')).version;
    if (!builderVersion.startsWith('26.')) fail(`This script uses electron-builder 26 configuration; resolved ${builderVersion}. Select --builder-version 26.`);
    if (mode === 'web' && Number(electronVersion.split('.')[0]) < 35) fail('The generated wrapper requires Electron 35 or newer. Choose a currently supported release.');
    config.electronVersion = electronVersion;
    writeJSON(configFile, config);
    if (mode === 'web') {
      const pkg = readJSON(path.join(appDirectory, 'package.json'));
      pkg.devDependencies = { electron: electronVersion };
      writeJSON(path.join(appDirectory, 'package.json'), pkg);
    }
    log(`Resolved Electron ${electronVersion}; electron-builder ${builderVersion}.`);
    const builder = path.join(toolchain, 'node_modules/.bin/electron-builder');
    await run(builder, ['--projectDir', appDirectory, '--config', configFile, '--linux', 'deb', `--${arch}`, '--publish', 'never'], appDirectory, { CSC_IDENTITY_AUTO_DISCOVERY: 'false' });
    const packages = fs.readdirSync(packOutput).filter(name => name.endsWith('.deb'));
    if (packages.length !== 1) fail(`Expected one .deb, found ${packages.length}. Inspect ${packOutput}.`);
    const packageFile = path.join(packOutput, packages[0]);
    const inspect = spawnSync('dpkg-deb', ['--field', packageFile, 'Package', 'Version', 'Architecture'], { encoding: 'utf8' });
    if (inspect.status !== 0) fail(`dpkg-deb could not read the generated package: ${inspect.stderr || inspect.error || inspect.status}`);
    const fields = Object.fromEntries(inspect.stdout.trim().split('\n').map(line => {
      const colon = line.indexOf(':'); return [line.slice(0, colon), line.slice(colon + 1).trim()];
    }));
    if (fields.Package !== packageName || fields.Architecture !== (arch === 'x64' ? 'amd64' : 'arm64'))
      fail(`Package identity mismatch: ${JSON.stringify(fields)}. Inspect the existing deb configuration for overrides.`);
    const archive = spawnSync('dpkg-deb', ['--contents', packageFile], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
    if (archive.status !== 0 || !/\.\/usr\/share\/applications\/[^\n]+\.desktop(?:\s|$)/m.test(archive.stdout))
      fail('The generated package has no verified application-menu .desktop file. Inspect the package before installing it.');
    checkInterrupted();
    fs.mkdirSync(outputParent, { recursive: true });
    finalDirectory = fs.mkdtempSync(path.join(outputParent, `${packageName}-${fields.Version}-${arch}-`));
    fs.copyFileSync(packageFile, path.join(finalDirectory, packages[0]));
    const digest = crypto.createHash('sha256');
    for await (const chunk of fs.createReadStream(packageFile)) digest.update(chunk);
    const hash = digest.digest('hex');
    fs.writeFileSync(path.join(finalDirectory, 'SHA256SUMS'), `${hash}  ${packages[0]}\n`);
    writeJSON(path.join(finalDirectory, 'build-info.json'), { ...manifest, version: fields.Version, electronVersion, builderVersion, debian: fields, file: packages[0], sha256: hash });
    fs.copyFileSync(path.join(toolchain, 'package-lock.json'), path.join(finalDirectory, 'packager-package-lock.json'));
    success = true;
    const shellQuote = value => `'${value.replace(/'/g, `'\\''`)}'`;
    log(`Created: ${path.join(finalDirectory, packages[0])}\nVerified package: ${fields.Package} ${fields.Version} (${fields.Architecture})\nSHA-256 and exact tool versions are saved alongside it.\n\nOn the target Debian/Ubuntu desktop:\n  sudo apt install ${shellQuote(path.join(finalDirectory, packages[0]))}\nTo remove it:\n  sudo apt remove ${shellQuote(packageName)}`);
  } finally {
    if (work && success && !options.keepWork && !options.prepareOnly) fs.rmSync(work, { recursive: true, force: true });
    else if (work) log(`Workspace retained: ${work}`);
    if (!success && finalDirectory) log(`Output copy was interrupted; treat this directory as incomplete: ${finalDirectory}`);
  }
}

function desktopRuntime() {
  'use strict';
  const { app, BrowserWindow, Menu, dialog, net, protocol, screen, session, shell } = require('electron');
  const fs = require('node:fs');
  const path = require('node:path');
  const { pathToFileURL } = require('node:url');
  const config = require('./desktop-config.json');
  const startURL = 'app://bundle/';
  const webDirectory = path.join(__dirname, 'web');
  const csp = typeof config.csp === 'string' && config.csp.trim()
    ? config.csp : "object-src 'none'; base-uri 'self'";
  let window = null;
  let webRoot;
  let stateFile;

  // Keep storage and the single-instance lock stable when the display title changes.
  // The packager supplies the Debian package name; never use a user-facing title here.
  if (config.packageName !== undefined) {
    if (typeof config.packageName !== 'string' || !/^[a-z0-9][a-z0-9+.-]+$/.test(config.packageName)) {
      throw new Error('desktop-config.json packageName must be a valid Debian package name');
    }
    const stableDirectory = path.join(app.getPath('appData'), config.packageName);
    fs.mkdirSync(stableDirectory, { recursive: true, mode: 0o700 });
    app.setPath('userData', stableDirectory);
    app.setPath('sessionData', stableDirectory);
  }

  // A standard origin supports /assets/... URLs, localStorage, and client-side routing.
  // Intentionally do not bypass CSP or grant service-worker registration privileges.
  protocol.registerSchemesAsPrivileged([{
    scheme: 'app',
    privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true }
  }]);
  app.enableSandbox();
  if (!app.requestSingleInstanceLock()) {
    app.quit();
    return;
  }

  function isLocal(input) {
    try {
      const u = new URL(input);
      // WHATWG URL.origin is "null" for custom schemes: compare every authority field.
      return u.protocol === 'app:' && u.hostname === 'bundle' && !u.port && !u.username && !u.password;
    } catch { return false; }
  }

  function contained(root, candidate) {
    const relative = path.relative(root, candidate);
    return relative !== '..' && !relative.startsWith('..' + path.sep) && !path.isAbsolute(relative);
  }

  function failure(status, message) {
    const error = new Error(message);
    error.httpStatus = status;
    return error;
  }

  function checkedPath(candidate) {
    if (!contained(webRoot, candidate)) throw failure(403, 'Forbidden');
    try {
      const actual = fs.realpathSync(candidate);
      if (!contained(webRoot, actual)) throw failure(403, 'Forbidden');
      const stat = fs.statSync(actual);
      return { file: actual, regular: stat.isFile(), directory: stat.isDirectory() };
    } catch (error) {
      if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return null;
      throw error;
    }
  }

  function plainResponse(request, status, text, extraHeaders = {}) {
    return new Response(request.method === 'HEAD' ? null : text, {
      status,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff', ...extraHeaders }
    });
  }

  async function serveAsset(request) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return plainResponse(request, 405, 'Method not allowed', { Allow: 'GET, HEAD' });
    }
    try {
      if (!isLocal(request.url)) throw failure(403, 'Forbidden');
      const u = new URL(request.url);
      let pathname;
      try { pathname = decodeURIComponent(u.pathname || '/'); }
      catch { throw failure(400, 'Malformed URL encoding'); }
      if (pathname.includes('\0') || pathname.includes('\\') || pathname.split('/').includes('..')) {
        throw failure(403, 'Forbidden');
      }
      const requested = path.resolve(webRoot, '.' + pathname);
      let asset = checkedPath(requested);
      if (asset && asset.directory) {
        asset = checkedPath(path.join(requested, 'index.html'));
        if (asset && asset.regular && !pathname.endsWith('/')) {
          // Keep relative assets in exported /page/index.html pages under /page/.
          u.pathname += '/';
          return new Response(null, { status: 308, headers: { Location: u.href } });
        }
      }
      if (!asset && !path.extname(pathname)) asset = checkedPath(requested + '.html');

      const navigation = request.mode === 'navigate' || request.destination === 'document'
        || (request.headers.get('accept') || '').toLowerCase().includes('text/html');
      const extension = path.extname(pathname).toLowerCase();
      // Never return HTML for a missing script, stylesheet, JSON request, or image.
      const pageRoute = !extension || extension === '.html' || extension === '.htm';
      if ((!asset || !asset.regular) && config.spa !== false && navigation && pageRoute) {
        asset = checkedPath(path.join(webRoot, 'index.html'));
      }
      if (!asset || !asset.regular) throw failure(404, 'Not found');

      // Chromium streams bundled files (including ASAR files); it also handles byte ranges.
      const headers = {};
      const range = request.headers.get('range');
      if (range) headers.Range = range;
      const response = await net.fetch(pathToFileURL(asset.file).href, { headers });
      const resultHeaders = new Headers(response.headers);
      resultHeaders.set('Content-Security-Policy', csp);
      resultHeaders.set('X-Content-Type-Options', 'nosniff');
      resultHeaders.set('Cache-Control', 'no-cache');
      const mime = {
        '.html': 'text/html; charset=utf-8', '.htm': 'text/html; charset=utf-8',
        '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
        '.css': 'text/css; charset=utf-8', '.json': 'application/json',
        '.wasm': 'application/wasm', '.svg': 'image/svg+xml'
      }[path.extname(asset.file).toLowerCase()];
      if (mime) resultHeaders.set('Content-Type', mime);
      if (request.method === 'HEAD' && response.body) await response.body.cancel();
      return new Response(request.method === 'HEAD' ? null : response.body, {
        status: response.status, statusText: response.statusText, headers: resultHeaders
      });
    } catch (error) {
      if (!error.httpStatus) console.error('Asset request failed:', error);
      return plainResponse(request, error.httpStatus || 500, error.httpStatus ? error.message : 'Unable to load asset');
    }
  }

  function openWebLink(input) {
    try {
      const u = new URL(input);
      if ((u.protocol === 'https:' || u.protocol === 'http:') && !u.username && !u.password) {
        void shell.openExternal(u.href).catch(error => console.error('Cannot open link:', error));
      }
    } catch { /* Ignore malformed URLs and non-web protocols. */ }
  }

  function restoreBounds() {
    let saved = {};
    try {
      if (fs.statSync(stateFile).size < 16384) saved = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
    } catch { /* First launch or invalid prior state: use default geometry. */ }
    if (!saved || typeof saved !== 'object') saved = {};
    const integer = (value, low, high, fallback) => Number.isInteger(value) && value >= low && value <= high ? value : fallback;
    const bounds = {
      width: integer(saved.width, 320, 16384, integer(config.width, 320, 16384, 1280)),
      height: integer(saved.height, 240, 16384, integer(config.height, 240, 16384, 800))
    };
    const x = integer(saved.x, -1000000, 1000000, null);
    const y = integer(saved.y, -1000000, 1000000, null);
    const display = x !== null && y !== null && screen.getAllDisplays().find(({ workArea: area }) =>
      x < area.x + area.width - 80 && x + bounds.width > area.x + 80
      && y < area.y + area.height - 80 && y + bounds.height > area.y + 80);
    const area = display ? display.workArea : screen.getPrimaryDisplay().workArea;
    bounds.width = Math.min(bounds.width, area.width);
    bounds.height = Math.min(bounds.height, area.height);
    if (display) {
      bounds.x = Math.min(Math.max(x, area.x), area.x + area.width - bounds.width);
      bounds.y = Math.min(Math.max(y, area.y), area.y + area.height - bounds.height);
    }
    return { bounds, maximized: saved.maximized === true };
  }

  function showLoadError(error) {
    if (!window || window.isDestroyed() || error.code === 'ERR_ABORTED') return;
    console.error('Window load failed:', error);
    window.show();
    dialog.showErrorBox(config.title || app.getName(), 'The application page could not be loaded.\n\n' + error.message);
  }

  function createWindow() {
    const saved = restoreBounds();
    const icon = path.join(__dirname, 'icon.png');
    window = new BrowserWindow({
      ...saved.bounds,
      title: config.title || app.getName(),
      show: false,
      backgroundColor: '#15181d',
      ...(fs.existsSync(icon) ? { icon } : {}),
      webPreferences: {
        nodeIntegration: false, contextIsolation: true, sandbox: true,
        webSecurity: true, webviewTag: false, allowRunningInsecureContent: false
      }
    });
    const contents = window.webContents;
    const guardNavigation = (event, legacyURL, _legacySameDocument, legacyMainFrame) => {
      const url = event.url || legacyURL;
      if (!isLocal(url)) {
        event.preventDefault();
        if ((event.isMainFrame ?? legacyMainFrame) !== false) openWebLink(url);
      }
    };
    contents.on('will-frame-navigate', guardNavigation);
    contents.on('will-navigate', guardNavigation);
    contents.on('will-redirect', guardNavigation);
    contents.on('will-attach-webview', event => event.preventDefault());
    contents.setWindowOpenHandler(({ url }) => {
      if (isLocal(url)) void window.loadURL(url).catch(showLoadError);
      else openWebLink(url);
      return { action: 'deny' };
    });
    contents.on('render-process-gone', (_event, details) => {
      if (details.reason !== 'clean-exit') showLoadError(new Error('Renderer stopped: ' + details.reason + '. Use View → Reload to retry.'));
    });
    window.once('ready-to-show', () => {
      if (window && !window.isDestroyed()) {
        if (saved.maximized) window.maximize();
        window.show();
      }
    });
    window.on('close', () => {
      try {
        fs.mkdirSync(path.dirname(stateFile), { recursive: true });
        const temporary = stateFile + '.' + process.pid + '.tmp';
        fs.writeFileSync(temporary, JSON.stringify({ ...window.getNormalBounds(), maximized: window.isMaximized() }), { mode: 0o600 });
        fs.renameSync(temporary, stateFile);
      } catch (error) { console.error('Cannot save window geometry:', error); }
    });
    window.on('closed', () => { window = null; });
    void window.loadURL(startURL).catch(showLoadError);
  }

  app.on('second-instance', () => {
    if (window) {
      if (window.isMinimized()) window.restore();
      window.show();
      window.focus();
    }
  });
  app.on('window-all-closed', () => app.quit());
  app.whenReady().then(() => {
    webRoot = fs.realpathSync(webDirectory);
    stateFile = path.join(app.getPath('userData'), 'desktop-window.json');
    session.defaultSession.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));
    session.defaultSession.setPermissionCheckHandler(() => false);
    if (session.defaultSession.setDevicePermissionHandler) session.defaultSession.setDevicePermissionHandler(() => false);
    session.defaultSession.protocol.handle('app', serveAsset);
    Menu.setApplicationMenu(Menu.buildFromTemplate([
      { label: 'File', submenu: [{ role: 'close' }, { role: 'quit' }] },
      { label: 'Edit', submenu: [{ role: 'undo' }, { role: 'redo' }, { type: 'separator' }, { role: 'cut' }, { role: 'copy' }, { role: 'paste' }, { role: 'selectAll' }] },
      { label: 'View', submenu: [{ role: 'reload' }, { role: 'forceReload' }, { role: 'toggleDevTools' }, { type: 'separator' }, { role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' }, { role: 'togglefullscreen' }] }
    ]));
    createWindow();
  }).catch(error => {
    console.error('Application startup failed:', error);
    dialog.showErrorBox(config.title || app.getName(), 'Application startup failed.\n\n' + error.message);
    app.quit();
  });
}

main().catch(error => {
  console.error(`\n[npm-to-deb] ERROR: ${error.message}`);
  process.exitCode = interrupted ? (stopSignal === 'SIGTERM' ? 143 : 130) : 1;
});

NPM_TO_DEB_JAVASCRIPT
