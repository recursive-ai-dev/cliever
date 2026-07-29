#!/usr/bin/env node
/**
 * Time-bounded LaPoet training regimen (default: 15 minutes).
 *
 * Ingests local poetry from `model/poems/` and produces a checkpoint at:
 *   - public/lapoet/agtune-poems-checkpoint.json
 * Also writes a copy into:
 *   - model/lapoet-main/agtune-poems-checkpoint.json
 *
 * Runs fully offline.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const workspaceRoot = path.resolve(__dirname, '..');

// -----------------------
// Tunables (safe defaults)
// -----------------------
const TOTAL_MINUTES = Number.parseFloat(process.env.LAPOET_MINUTES ?? '15');
const PRETRAIN_GENERAL_EPOCHS = Number.parseInt(process.env.LAPOET_PRETRAIN_GENERAL_EPOCHS ?? '8', 10);
const PRETRAIN_CLI_EPOCHS = Number.parseInt(process.env.LAPOET_PRETRAIN_CLI_EPOCHS ?? '5', 10);

// KernelPCA is O(n^2) in the number of fit samples. Keep this small to prevent OOM
// while still producing a useful emotional-space projection.
const PCA_FIT_SAMPLES = Number.parseInt(process.env.LAPOET_PCA_FIT_SAMPLES ?? '256', 10);

const MIN_LINE_LENGTH = Number.parseInt(process.env.LAPOET_MIN_LINE_LENGTH ?? '10', 10);
const MAX_FILES = Number.parseInt(process.env.LAPOET_MAX_FILES ?? '800', 10);
const MAX_LINES_PER_FILE = Number.parseInt(process.env.LAPOET_MAX_LINES_PER_FILE ?? '250', 10);
const MAX_TRAIN_LINES = Number.parseInt(process.env.LAPOET_MAX_TRAIN_LINES ?? '12000', 10);
const CHUNK_LINES = Number.parseInt(process.env.LAPOET_CHUNK_LINES ?? '1200', 10);
const SAVE_EVERY_MS = Number.parseInt(process.env.LAPOET_SAVE_EVERY_MS ?? '60000', 10); // 1 minute

const POEMS_DIR = path.join(workspaceRoot, 'model', 'poems');
// Fallback corpus when `model/poems/` is absent: the lyrics corpus that ships
// with the repository keeps the training run fully offline and functional.
const POEMS_FALLBACK_DIR = path.join(workspaceRoot, 'model', 'lapoet-main', 'lyrics');
const PRETRAIN_DIR = path.join(workspaceRoot, 'model', 'lapoet-main', 'pretraining');

const resolvePoemsDir = () => {
  if (fs.existsSync(POEMS_DIR)) return { dir: POEMS_DIR, isFallback: false };
  if (fs.existsSync(POEMS_FALLBACK_DIR)) return { dir: POEMS_FALLBACK_DIR, isFallback: true };
  return null;
};

const OUT_PUBLIC = path.join(workspaceRoot, 'public', 'lapoet', 'agtune-poems-checkpoint.json');
const OUT_MODEL = path.join(workspaceRoot, 'model', 'lapoet-main', 'agtune-poems-checkpoint.json');

// -----------------------
// Small local utilities
// -----------------------
const clampInt = (n, min, max) => {
  const v = Number.isFinite(n) ? Math.trunc(n) : min;
  return Math.max(min, Math.min(max, v));
};

const strideSample = (arr, n) => {
  const want = clampInt(n, 0, arr.length);
  if (want === 0) return [];
  if (arr.length <= want) return arr;
  const out = [];
  const step = Math.max(1, Math.floor(arr.length / want));
  for (let i = 0; i < arr.length && out.length < want; i += step) {
    out.push(arr[i]);
  }
  return out;
};

// ============================================================================
// CORE ALGORITHM IMPLEMENTATIONS (Adapted from lapoet-main/train-lyrics.js)
// ============================================================================

class KernelPCA {
  constructor(nComponents = 8, degree = 3) {
    this.nComponents = nComponents;
    this.degree = degree;
    this.eigenvectors = null;
    this.eigenvalues = null;
    this.X_fit = null;
  }

  _polynomialKernel(x, y) {
    const dotProduct = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    return Math.pow(dotProduct + 1, this.degree);
  }

  _centerKernelMatrix(K) {
    const n = K.length;
    const rowMeans = Array(n).fill(0);
    const colMeans = Array(n).fill(0);
    let totalMean = 0;

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        rowMeans[i] += K[i][j];
        colMeans[j] += K[i][j];
        totalMean += K[i][j];
      }
    }

    for (let i = 0; i < n; i++) {
      rowMeans[i] /= n;
      colMeans[i] /= n;
    }
    totalMean /= n * n;

    const centered = Array(n).fill().map(() => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        centered[i][j] = K[i][j] - rowMeans[i] - colMeans[j] + totalMean;
      }
    }

    return centered;
  }

  _eigenDecomposition(matrix) {
    const n = matrix.length;
    const eigenvectors = [];
    const eigenvalues = [];

    for (let k = 0; k < Math.min(this.nComponents, n); k++) {
      let v = Array(n).fill().map(() => Math.random() - 0.5);

      for (let i = 0; i < eigenvectors.length; i++) {
        const dot = v.reduce((sum, vi, idx) => sum + vi * eigenvectors[i][idx], 0);
        v = v.map((vi, idx) => vi - dot * eigenvectors[i][idx]);
      }

      for (let iter = 0; iter < 30; iter++) {
        let newV = Array(n).fill(0);
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            newV[i] += matrix[i][j] * v[j];
          }
        }
        v = newV;

        const nrm = Math.sqrt(v.reduce((sum, vi) => sum + vi * vi, 0));
        v = nrm > 0 ? v.map(vi => vi / nrm) : v;
      }

      let eigenvalue = 0;
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          eigenvalue += v[i] * matrix[i][j] * v[j];
        }
      }

      eigenvectors.push(v);
      eigenvalues.push(Math.abs(eigenvalue));
    }

    return { eigenvectors, eigenvalues };
  }

  fit(X) {
    this.X_fit = X;
    const n = X.length;

    const K = Array(n).fill().map(() => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        K[i][j] = this._polynomialKernel(X[i], X[j]);
      }
    }

    const K_centered = this._centerKernelMatrix(K);
    const { eigenvectors, eigenvalues } = this._eigenDecomposition(K_centered);

    this.eigenvectors = eigenvectors;
    this.eigenvalues = eigenvalues;
  }

  transform(X) {
    const n_fit = this.X_fit.length;
    const n_transform = X.length;
    const result = Array(n_transform).fill().map(() => Array(this.nComponents).fill(0));

    for (let i = 0; i < n_transform; i++) {
      for (let j = 0; j < n_fit; j++) {
        const kij = this._polynomialKernel(X[i], this.X_fit[j]);
        for (let k = 0; k < this.nComponents; k++) {
          result[i][k] += kij * this.eigenvectors[k][j];
        }
      }
    }

    return result;
  }
}

class TDValueEstimator {
  constructor(nFeatures = 16, alpha = 0.01, gamma = 0.95, lambda = 0.8) {
    this.weights = Array(nFeatures).fill(0).map(() => Math.random() * 0.01);
    this.alpha = alpha;
    this.gamma = gamma;
    this.lambda = lambda;
    this.eligibility = Array(nFeatures).fill(0);
  }

  _extractFeatures(state) {
    const features = [];

    const eSpaceCenter = state.eSpaceTraj.reduce((acc, vec) => {
      vec.forEach((v, i) => acc[i] = (acc[i] || 0) + v);
      return acc;
    }, Array(state.eSpaceTraj[0]?.length || 8).fill(0));

    eSpaceCenter.forEach(v => features.push(v / (state.eSpaceTraj.length || 1)));

    features.push(state.meterScore || 0);
    features.push(state.rhymeConsistency || 0);
    features.push(state.novelty || 0);
    features.push(state.lineCount / 100 || 0);
    features.push(state.themeCoherence || 0);

    while (features.length < this.weights.length) features.push(0);
    return features.slice(0, this.weights.length);
  }

  update(state, reward, nextState, done) {
    const phi = this._extractFeatures(state);
    const phiNext = done ? Array(this.weights.length).fill(0) : this._extractFeatures(nextState);

    const v = phi.reduce((sum, f, i) => sum + f * this.weights[i], 0);
    const vNext = phiNext.reduce((sum, f, i) => sum + f * this.weights[i], 0);

    const tdError = reward + (done ? 0 : this.gamma * vNext) - v;

    this.eligibility = this.eligibility.map((e, i) => this.gamma * this.lambda * e + phi[i]);

    this.weights = this.weights.map((w, i) => w + this.alpha * tdError * this.eligibility[i]);

    if (done) this.eligibility.fill(0);

    return tdError;
  }
}

class AGTuneEngine {
  constructor() {
    this.vocabulary = new Map();
    this.embeddings = new Map();
    this.emotionalSpace = new Map();
    this.kernelPCA = new KernelPCA(8, 3);
    this.valueEstimator = new TDValueEstimator(16, 0.01, 0.95, 0.8);
    this.lastCorpusSignature = null;
    this.isTrained = false;
  }

  _tokenize(text) {
    return text.toLowerCase().match(/\b\w+\b/g) || [];
  }

  _corpusSignature(corpus) {
    let hash = 0;
    for (const line of corpus) {
      for (let i = 0; i < line.length; i++) {
        hash = ((hash << 5) - hash) + line.charCodeAt(i);
      }
      hash ^= line.length + corpus.length;
    }
    return `${corpus.length}:${hash}`;
  }

  train(corpus, epochs = 10, incremental = false) {
    const corpusSignature = this._corpusSignature(corpus);
    const shouldRebuild = this.lastCorpusSignature !== corpusSignature || !this.isTrained;

    if (shouldRebuild) {
      if (!incremental) {
        this.vocabulary.clear();
        this.embeddings.clear();
        this.emotionalSpace.clear();
      }

      corpus.forEach(text => {
        this._tokenize(text).forEach(word => {
          this.vocabulary.set(word, (this.vocabulary.get(word) || 0) + 1);
        });
      });

      this.vocabulary.forEach((_freq, word) => {
        if (!this.embeddings.has(word)) {
          this.embeddings.set(word, Array(8).fill(0).map(() => Math.random() * 0.1));
        }
      });

      const window = 3;
      corpus.forEach(text => {
        const tokens = this._tokenize(text);
        tokens.forEach((_word, i) => {
          const word = tokens[i];
          if (!this.embeddings.has(word)) return;
          const embedding = this.embeddings.get(word);

          for (let j = Math.max(0, i - window); j < Math.min(tokens.length, i + window + 1); j++) {
            if (i === j) continue;
            const neighbor = tokens[j];
            if (this.embeddings.has(neighbor)) {
              embedding[j % embedding.length] += 0.1;
            }
          }
        });
      });

      const embeddingVectors = Array.from(this.embeddings.values());
      if (embeddingVectors.length > 0) {
        const fitVectors = strideSample(embeddingVectors, PCA_FIT_SAMPLES);
        this.kernelPCA.fit(fitVectors);

        const transformed = this.kernelPCA.transform(embeddingVectors);
        const words = Array.from(this.embeddings.keys());
        words.forEach((word, i) => {
          this.emotionalSpace.set(word, transformed[i]);
        });
      }

      this.lastCorpusSignature = corpusSignature;
    }

    // TD training pass
    let totalReward = 0;
    for (let epoch = 0; epoch < epochs; epoch++) {
      let epochReward = 0;

      corpus.forEach((text) => {
        const tokens = this._tokenize(text);
        const states = [];

        for (let i = 0; i < Math.min(tokens.length, 10); i++) {
          const word = tokens[i];
          const eVec = this.emotionalSpace.get(word) || Array(8).fill(0);

          states.push({
            eSpaceTraj: [eVec],
            meterScore: Math.random() * 0.5 + 0.5,
            rhymeConsistency: Math.random() * 0.5,
            novelty: 1.0 - (i / tokens.length),
            lineCount: i,
            themeCoherence: 0.7
          });
        }

        for (let i = 0; i < states.length - 1; i++) {
          const reward = 0.5 + Math.random() * 0.3;
          this.valueEstimator.update(states[i], reward, states[i + 1], false);
          epochReward += reward;
        }

        if (states.length > 0) {
          const finalReward = 0.8;
          this.valueEstimator.update(states[states.length - 1], finalReward, states[0], true);
          epochReward += finalReward;
        }
      });

      totalReward += epochReward / Math.max(1, corpus.length);
    }

    this.isTrained = true;
    return totalReward / Math.max(1, epochs);
  }

  saveCheckpoint(filepath, extra = {}) {
    const data = {
      vocabulary: Array.from(this.vocabulary.entries()),
      embeddings: Array.from(this.embeddings.entries()),
      emotionalSpace: Array.from(this.emotionalSpace.entries()),
      kernelPCA: {
        nComponents: this.kernelPCA.nComponents,
        degree: this.kernelPCA.degree,
        eigenvectors: this.kernelPCA.eigenvectors,
        eigenvalues: this.kernelPCA.eigenvalues,
        X_fit: this.kernelPCA.X_fit
      },
      valueEstimator: {
        weights: this.valueEstimator.weights,
        alpha: this.valueEstimator.alpha,
        gamma: this.valueEstimator.gamma,
        lambda: this.valueEstimator.lambda
      },
      lastCorpusSignature: this.lastCorpusSignature,
      isTrained: this.isTrained,
      timestamp: new Date().toISOString(),
      ...extra
    };

    fs.mkdirSync(path.dirname(filepath), { recursive: true });
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  }
}

// ============================================================================
// DATA LOADING
// ============================================================================

const isTextFile = (filename) => {
  const lower = filename.toLowerCase();
  return lower.endsWith('.txt') || lower.endsWith('.md') || lower.endsWith('.text');
};

const loadTxtLines = (filepath) => {
  const content = fs.readFileSync(filepath, 'utf8');
  return content
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length >= MIN_LINE_LENGTH);
};

const walkFiles = (dir) => {
  const out = [];
  const stack = [dir];

  while (stack.length) {
    const current = stack.pop();
    if (!current) continue;

    let entries = [];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const ent of entries) {
      const full = path.join(current, ent.name);
      if (ent.isDirectory()) {
        stack.push(full);
      } else if (ent.isFile() && isTextFile(ent.name)) {
        out.push(full);
      }
    }
  }

  return out;
};

const sampleArray = (arr, n) => {
  if (arr.length <= n) return arr;
  const out = [];
  const step = Math.max(1, Math.floor(arr.length / n));
  for (let i = 0; i < arr.length && out.length < n; i += step) {
    out.push(arr[i]);
  }
  return out;
};

const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
};

const loadPretraining = () => {
  if (!fs.existsSync(PRETRAIN_DIR)) return { general: [], cli: [] };

  const files = fs.readdirSync(PRETRAIN_DIR).filter(f => f.endsWith('.txt'));
  const general = [];
  const cli = [];

  for (const f of files) {
    const lines = loadTxtLines(path.join(PRETRAIN_DIR, f));
    if (f.toLowerCase().startsWith('cli-') || f.toLowerCase().startsWith('git-') || f.toLowerCase().startsWith('docker-') || f.toLowerCase().startsWith('powershell-') || f.toLowerCase().startsWith('windows-')) {
      cli.push(...lines);
    } else {
      general.push(...lines);
    }
  }

  return { general, cli };
};

const loadPoems = () => {
  const resolved = resolvePoemsDir();
  if (!resolved) {
    throw new Error(`No poem/lyrics corpus found. Looked in:\n  - ${POEMS_DIR}\n  - ${POEMS_FALLBACK_DIR}`);
  }

  if (resolved.isFallback) {
    console.log(`[corpus] ${POEMS_DIR} not found; falling back to ${resolved.dir}`);
  }

  const allFiles = walkFiles(resolved.dir);
  const files = sampleArray(allFiles, Math.min(MAX_FILES, allFiles.length));

  const lines = [];
  for (const file of files) {
    const fileLines = loadTxtLines(file).slice(0, MAX_LINES_PER_FILE);
    lines.push(...fileLines);
    if (lines.length >= MAX_TRAIN_LINES) break;
  }

  return lines.slice(0, MAX_TRAIN_LINES);
};

// ============================================================================
// MAIN (15-minute regimen)
// ============================================================================

const formatMs = (ms) => {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const remS = s % 60;
  return `${m}m ${remS}s`;
};

async function main() {
  const totalMs = Math.max(1, Math.floor(TOTAL_MINUTES * 60 * 1000));
  const started = Date.now();
  const endAt = started + totalMs;

  console.log('='.repeat(70));
  console.log('LAPOET POEMS TRAINING (TIME-BOUNDED)');
  console.log('='.repeat(70));
  console.log(`Workspace: ${workspaceRoot}`);
  const resolvedCorpus = resolvePoemsDir();
  console.log(`Poems dir: ${resolvedCorpus ? resolvedCorpus.dir : POEMS_DIR}${resolvedCorpus?.isFallback ? ' (fallback)' : ''}`);
  console.log(`Minutes: ${TOTAL_MINUTES}`);
  console.log(`Output: ${OUT_PUBLIC}`);
  console.log('');

  const engine = new AGTuneEngine();

  // Phase 1: pretraining (kept intentionally short; poems are the heavy portion)
  const { general, cli } = loadPretraining();

  if (general.length > 0) {
    console.log(`[Phase 1] General pretraining: ${general.length} lines x ${PRETRAIN_GENERAL_EPOCHS} epochs`);
    engine.train(general, PRETRAIN_GENERAL_EPOCHS, false);
  } else {
    console.log('[Phase 1] No general pretraining data found; skipping');
  }

  if (cli.length > 0) {
    console.log(`[Phase 1B] CLI pretraining: ${cli.length} lines x ${PRETRAIN_CLI_EPOCHS} epochs`);
    engine.train(cli, PRETRAIN_CLI_EPOCHS, general.length > 0);
  } else {
    console.log('[Phase 1B] No CLI pretraining data found; skipping');
  }

  // Phase 2: poems
  const poems = loadPoems();
  console.log(`\n[Phase 2] Poems loaded: ${poems.length} lines (minLen=${MIN_LINE_LENGTH})`);

  const chunks = chunk(poems, Math.max(50, CHUNK_LINES));
  console.log(`[Phase 2] Training chunks: ${chunks.length} (chunkSize≈${CHUNK_LINES})`);

  let rounds = 0;
  let lastSave = 0;

  while (Date.now() < endAt) {
    const now = Date.now();
    const remaining = endAt - now;

    const chunkIdx = rounds % chunks.length;
    const batch = chunks[chunkIdx];

    // One epoch per batch, incremental to preserve earlier knowledge
    engine.train(batch, 1, true);
    rounds++;

    if (now - lastSave > SAVE_EVERY_MS || remaining < 5000) {
      lastSave = now;
      const extra = {
        trainingProfile: {
          minutesTarget: TOTAL_MINUTES,
          rounds,
          poemsLinesUsed: poems.length,
          chunkLines: CHUNK_LINES,
          maxFiles: MAX_FILES,
          maxLinesPerFile: MAX_LINES_PER_FILE,
          pretrainGeneralEpochs: PRETRAIN_GENERAL_EPOCHS,
          pretrainCliEpochs: PRETRAIN_CLI_EPOCHS
        }
      };

      engine.saveCheckpoint(OUT_PUBLIC, extra);
      engine.saveCheckpoint(OUT_MODEL, extra);

      console.log(`[Save] ${new Date().toISOString()} | rounds=${rounds} | vocab=${engine.vocabulary.size} | remaining=${formatMs(remaining)}`);
    }
  }

  const elapsed = Date.now() - started;
  console.log('\n' + '='.repeat(70));
  console.log('TRAINING COMPLETE');
  console.log('='.repeat(70));
  console.log(`Elapsed: ${formatMs(elapsed)}`);
  console.log(`Rounds: ${rounds}`);
  console.log(`Vocabulary: ${engine.vocabulary.size}`);
  console.log(`Emotional vectors: ${engine.emotionalSpace.size}`);
  console.log(`Checkpoint: ${OUT_PUBLIC}`);
  console.log('');
  console.log('Tip: restart dev server (or hard refresh) to ensure the browser pulls the new checkpoint.');
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
