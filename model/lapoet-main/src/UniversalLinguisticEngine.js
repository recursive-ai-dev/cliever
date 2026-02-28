// Copyright 2025 Recursive AI Devs
// Universal Linguistic Engine for AG-TUNE
// Provides production-grade phonetics, morphology, and grammar generation logic.

/**
 * Lightweight, deterministic PRNG with optional seeding for reproducibility.
 */
export class SeededRng {
  constructor(seed = Date.now()) {
    this._state = Number.isFinite(seed) ? seed >>> 0 : Date.now() >>> 0;
  }

  next() {
    // xorshift32 for speed and determinism
    let x = this._state;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    this._state = x >>> 0;
    return (this._state & 0xffffffff) / 0x100000000;
  }
}

/**
 * Minimal EventEmitter to support observability hooks during migration.
 */
export class EventEmitter {
  constructor() {
    this._listeners = new Map();
  }

  on(eventType, callback) {
    if (typeof callback !== 'function') return () => {};
    const arr = this._listeners.get(eventType) || [];
    arr.push(callback);
    this._listeners.set(eventType, arr);
    return () => this.off(eventType, callback);
  }

  off(eventType, callback) {
    const arr = this._listeners.get(eventType);
    if (!arr) return;
    this._listeners.set(eventType, arr.filter(fn => fn !== callback));
  }

  emit(eventType, data) {
    const arr = this._listeners.get(eventType);
    if (!arr || arr.length === 0) return;
    for (const fn of arr) {
      try {
        fn({ type: eventType, data, timestamp: new Date() });
      } catch (err) {
        // Fail-closed: avoid cascading errors
      }
    }
  }
}

/**
 * Universal Linguistic Engine
 * Interface-based architecture with dependency injection and event hooks.
 */
export class UniversalLinguisticEngine {
  constructor(options = {}) {
    const {
      phoneticEngine,
      grammar,
      eventEmitter,
      rng
    } = options;

    this.rng = rng instanceof SeededRng ? rng : new SeededRng();
    this.events = eventEmitter instanceof EventEmitter ? eventEmitter : new EventEmitter();
    this.phonetics = phoneticEngine instanceof DefaultPhoneticEngine ? phoneticEngine : new DefaultPhoneticEngine();
    this.grammar = grammar instanceof DefaultConstraintGrammar ? grammar : new DefaultConstraintGrammar({ rng: this.rng });
  }

  /**
   * Analyze a word for poetic features with observability and validation.
   */
  analyze(word) {
    const safeWord = typeof word === 'string' ? word : '';
    const cleanWord = safeWord.toLowerCase().replace(/[^a-z]/g, '');
    if (!cleanWord) {
      const emptyResult = { word: safeWord, phonemes: '', syllables: 0, stressPattern: [], rhymePart: '' };
      this.events.emit('analysis-complete', emptyResult);
      return emptyResult;
    }

    try {
      const phonemes = this.phonetics.toPhonemes(cleanWord);
      const result = {
        word: safeWord,
        phonemes,
        syllables: this.phonetics.countSyllablesFromPhonemes(phonemes),
        stressPattern: this.phonetics.estimateStress(phonemes),
        rhymePart: this.phonetics.getRhymePart(phonemes)
      };
      this.events.emit('analysis-complete', result);
      return result;
    } catch (error) {
      this.events.emit('error', { stage: 'analysis', error });
      throw error;
    }
  }

  /**
   * Generate a sentence structure based on complexity with event emission.
   */
  generateStructure(complexity = 1) {
    const safeComplexity = Number.isFinite(complexity) && complexity > 0 ? Math.min(complexity, 10) : 1;
    this.events.emit('generation-start', { complexity: safeComplexity });
    try {
      const structure = this.grammar.generate('S', { complexity: safeComplexity });
      this.events.emit('generation-complete', { complexity: safeComplexity, structure });
      return structure;
    } catch (error) {
      this.events.emit('error', { stage: 'generation', error });
      throw error;
    }
  }

  /**
   * Get the grammar in a flat format for the CYK parser
   */
  getGrammar() {
    return this.grammar.getFlatGrammar();
  }
}

/**
 * Legacy adapter to preserve backward compatibility during migration.
 */
export class LegacyAdapter {
  constructor(engine = new UniversalLinguisticEngine()) {
    this.engine = engine;
  }

  analyzeLegacy(word) {
    return this.engine.analyze(word);
  }

  generateLegacy(complexity) {
    return this.engine.generateStructure(complexity);
  }
}

/**
 * Algorithmic Grapheme-to-Phoneme Engine
 * Uses extensive rule sets to estimate pronunciation for English words.
 * This replaces hardcoded rhyme dictionaries.
 */
export class DefaultPhoneticEngine {
  constructor() {
    this.rules = [
      // 1. Pre-processing / Special Endings
      { regex: /tion$/g, repl: 'S u n' },
      { regex: /sion$/g, repl: 'Z u n' },
      { regex: /ough$/g, repl: 'o' }, // simplified (though, rough, cough...)
      { regex: /igh$/g, repl: 'Y' },
      { regex: /ight/g, repl: 'Y t' },

      // 2. Silent E rules (VCVe pattern)
      { regex: /([aeiou])([^aeiou])e$/g, repl: '$1:$2' }, // cake -> c A k (long vowel indicator)

      // 3. Vowel Teams & Diphthongs
      { regex: /ee/g, repl: 'I' }, // feet -> f I t
      { regex: /ea/g, repl: 'I' }, // tea -> t I
      { regex: /oo/g, repl: 'U' }, // moon -> m U n
      { regex: /ou/g, repl: 'W' }, // out -> W t
      { regex: /ow/g, repl: 'W' }, // cow -> c W
      { regex: /ai/g, repl: 'A' }, // rain -> r A n
      { regex: /ay/g, repl: 'A' }, // day -> d A
      { regex: /oa/g, repl: 'O' }, // boat -> b O t
      { regex: /ie/g, repl: 'Y' }, // tie -> t Y
      { regex: /ei/g, repl: 'A' }, // vein -> v A n
      { regex: /oy/g, repl: 'O Y' }, // boy
      { regex: /oi/g, repl: 'O Y' }, // boil
      { regex: /au/g, repl: 'O' },   // auto
      { regex: /aw/g, repl: 'O' },   // law

      // 4. Consonant Digraphs
      { regex: /sh/g, repl: 'S' },
      { regex: /ch/g, repl: 'C' },
      { regex: /th/g, repl: 'T' }, // voiced/unvoiced conflated for simplicity
      { regex: /ph/g, repl: 'F' },
      { regex: /ck/g, repl: 'k' },
      { regex: /wh/g, repl: 'w' },
      { regex: /wr/g, repl: 'r' },
      { regex: /kn/g, repl: 'n' },
      { regex: /gn/g, repl: 'n' },
      { regex: /ng/g, repl: 'G' }, // ring -> r i G

      // 5. Basic Vowels (simplified for poetic approximation)
      // Special rule: y at end usually I or E sound
      { regex: /y$/g, repl: 'E' }, // happy -> h a p E  (often reduced to E or i)

      { regex: /a/g, repl: '@' },
      { regex: /e/g, repl: 'E' },
      { regex: /i/g, repl: 'i' },
      { regex: /o/g, repl: 'o' },
      { regex: /u/g, repl: 'u' },

      // 6. Fixups
      { regex: /:/g, repl: '' }, // remove the silent E marker but keep the long vowel effect?
      // Actually, my silent E rule was: $1:$2. I need to handle the conversion of $1 to long vowel.
      // Let's rely on post-processing for that or just map long vowels directly.
    ];

    // Long vowel mapping for silent E logic
    this.longVowelMap = {
        '@': 'A', // a -> A
        'E': 'I', // e -> I (rare)
        'i': 'Y', // i -> Y (bite)
        'o': 'O', // o -> O (hope)
        'u': 'U'  // u -> U (cute)
    };
  }

  /**
   * Converts text to an approximate phoneme representation
   * @param {string} text
   * @returns {string} Phonetic string (internal representation)
   */
  toPhonemes(text) {
    let current = text.toLowerCase();

    // 1. Handle common prefixes/suffixes to isolate root
    // This helps avoid misapplying rules across morpheme boundaries
    current = current.replace(/^un/g, 'un ');
    current = current.replace(/^re/g, 're ');
    current = current.replace(/^in/g, 'in ');
    current = current.replace(/ing$/g, ' ing');
    current = current.replace(/ed$/g, ' ed');
    current = current.replace(/s$/g, ' s');
    current = current.replace(/ly$/g, ' l E');
    current = current.replace(/ment$/g, ' m E n t');

    const parts = current.split(' ');

    const phonemizedParts = parts.map(part => {
      let p = part;

      // Special handling for Silent E to promote the preceding vowel
      // Regex: Vowel + Consonant + e$
      // We do this before the main loop
      if (/([aeiou])([^aeiou])e$/.test(p)) {
          p = p.replace(/([aeiou])([^aeiou])e$/, (match, v, c) => {
             const longV = v.toUpperCase().replace('E', 'I').replace('A', 'A').replace('I', 'Y').replace('O', 'O').replace('U', 'U');
             // Simplified manual mapping
             let lv = v;
             if (v === 'a') lv = 'A';
             else if (v === 'e') lv = 'I';
             else if (v === 'i') lv = 'Y';
             else if (v === 'o') lv = 'O';
             else if (v === 'u') lv = 'U';
             return lv + c;
          });
      }

      // Apply standard rules in order
      for (const rule of this.rules) {
        if (rule.regex.test(p)) {
            p = p.replace(rule.regex, rule.repl);
        }
      }

      // Cleanup
      p = p.replace(/:/g, '');
      return p;
    });

    return phonemizedParts.join('');
  }

  countSyllablesFromPhonemes(phonemes) {
    // Count vowels in our internal representation
    // Vowels are: @, E, i, o, u, A, I, U, W, O, Y
    // Also consider dipthongs as one nucleus
    const vowels = phonemes.match(/[@EiouAIUWOY]+/g);
    return vowels ? vowels.length : 1;
  }

  estimateStress(phonemes) {
    // Logic: English tends to stress the first syllable of nouns/adjectives
    // and second of verbs, but for poetry generation, we might rely on
    // alternation or simple heuristic.
    // Extensive Logic: Weight syllables by vowel "length".
    // Long vowels (A, I, U, O, Y) are more likely to be stressed.
    const syllables = [];
    let currentSyllable = "";

    // Simple syllabification: break after vowel
    for (let char of phonemes) {
        if ("@EiouAIUWOY".includes(char)) {
            currentSyllable += char;
            syllables.push(currentSyllable);
            currentSyllable = "";
        } else {
            currentSyllable += char;
        }
    }
    // Add remaining consonants to last syllable
    if (currentSyllable.length > 0 && syllables.length > 0) {
        syllables[syllables.length - 1] += currentSyllable;
    } else if (currentSyllable.length > 0) {
        syllables.push(currentSyllable);
    }

    return syllables.map(s => {
        // Check if contains long vowel
        if (/[AIUWOY]/.test(s)) return 1;
        // Fallback: alternating stress if no long vowels found?
        // For now, simple weight
        return 0;
    });
  }

  /**
   * Extract the rhyming part (last stressed vowel onwards)
   */
  getRhymePart(phonemes) {
    // Find last vowel
    const matches = [...phonemes.matchAll(/[@EiouAIUWOY]/g)];
    if (matches.length === 0) return phonemes;

    const lastVowelIndex = matches[matches.length - 1].index;
    return phonemes.substring(lastVowelIndex);
  }
}

/**
 * Feature-Based Context-Free Grammar Engine
 * Supports agreement (Number, Person, Tense) and recursive generation.
 */
export class DefaultConstraintGrammar {
  constructor({ rng } = {}) {
    this.rng = rng instanceof SeededRng ? rng : new SeededRng();
    this.lexicon = this._buildProductionLexicon();
  }

  _buildProductionLexicon() {
    // Extensive Lexicon categorized by features
    return {
      N: [
        { word: 'heart', feats: { num: 'sg' }, tags: ['concrete', 'body'] },
        { word: 'hearts', feats: { num: 'pl' }, tags: ['concrete', 'body'] },
        { word: 'soul', feats: { num: 'sg' }, tags: ['abstract'] },
        { word: 'souls', feats: { num: 'pl' }, tags: ['abstract'] },
        { word: 'night', feats: { num: 'sg' }, tags: ['time', 'dark'] },
        { word: 'nights', feats: { num: 'pl' }, tags: ['time', 'dark'] },
        { word: 'shadow', feats: { num: 'sg' }, tags: ['dark'] },
        { word: 'shadows', feats: { num: 'pl' }, tags: ['dark'] },
        { word: 'light', feats: { num: 'sg' }, tags: ['light'] },
        { word: 'lights', feats: { num: 'pl' }, tags: ['light'] },
        { word: 'star', feats: { num: 'sg' }, tags: ['light', 'celestial'] },
        { word: 'stars', feats: { num: 'pl' }, tags: ['light', 'celestial'] },
        { word: 'wind', feats: { num: 'sg' }, tags: ['nature'] },
        { word: 'winds', feats: { num: 'pl' }, tags: ['nature'] },
        { word: 'fire', feats: { num: 'sg' }, tags: ['nature', 'destructive'] },
        { word: 'fires', feats: { num: 'pl' }, tags: ['nature', 'destructive'] },
        { word: 'dream', feats: { num: 'sg' }, tags: ['abstract'] },
        { word: 'dreams', feats: { num: 'pl' }, tags: ['abstract'] },
        { word: 'voice', feats: { num: 'sg' }, tags: ['human'] },
        { word: 'voices', feats: { num: 'pl' }, tags: ['human'] },
        { word: 'silence', feats: { num: 'sg' }, tags: ['abstract'] },
        { word: 'time', feats: { num: 'sg' }, tags: ['abstract'] },
        { word: 'river', feats: { num: 'sg' }, tags: ['nature'] },
        { word: 'rivers', feats: { num: 'pl' }, tags: ['nature'] },
        { word: 'ocean', feats: { num: 'sg' }, tags: ['nature'] },
        { word: 'oceans', feats: { num: 'pl' }, tags: ['nature'] },
        { word: 'mountain', feats: { num: 'sg' }, tags: ['nature'] },
        { word: 'mountains', feats: { num: 'pl' }, tags: ['nature'] },
        { word: 'whisper', feats: { num: 'sg' }, tags: ['sound'] },
        { word: 'whispers', feats: { num: 'pl' }, tags: ['sound'] },
        { word: 'ghost', feats: { num: 'sg' }, tags: ['supernatural'] },
        { word: 'ghosts', feats: { num: 'pl' }, tags: ['supernatural'] }
      ],
      V: [
        { word: 'burns', feats: { num: 'sg', tense: 'pres', trans: 'intrans' } },
        { word: 'burn', feats: { num: 'pl', tense: 'pres', trans: 'intrans' } },
        { word: 'fades', feats: { num: 'sg', tense: 'pres', trans: 'intrans' } },
        { word: 'fade', feats: { num: 'pl', tense: 'pres', trans: 'intrans' } },
        { word: 'calls', feats: { num: 'sg', tense: 'pres', trans: 'trans' } },
        { word: 'call', feats: { num: 'pl', tense: 'pres', trans: 'trans' } },
        { word: 'seek', feats: { num: 'pl', tense: 'pres', trans: 'trans' } },
        { word: 'seeks', feats: { num: 'sg', tense: 'pres', trans: 'trans' } },
        { word: 'lost', feats: { tense: 'past', trans: 'intrans' } }, // often used as adj but kept here
        { word: 'found', feats: { tense: 'past', trans: 'trans' } },
        { word: 'weep', feats: { num: 'pl', tense: 'pres', trans: 'intrans' } },
        { word: 'weeps', feats: { num: 'sg', tense: 'pres', trans: 'intrans' } },
        { word: 'sings', feats: { num: 'sg', tense: 'pres', trans: 'intrans' } },
        { word: 'sing', feats: { num: 'pl', tense: 'pres', trans: 'intrans' } },
        { word: 'flows', feats: { num: 'sg', tense: 'pres', trans: 'intrans' } },
        { word: 'flow', feats: { num: 'pl', tense: 'pres', trans: 'intrans' } },
        { word: 'breaks', feats: { num: 'sg', tense: 'pres', trans: 'trans' } },
        { word: 'break', feats: { num: 'pl', tense: 'pres', trans: 'trans' } },
        { word: 'holds', feats: { num: 'sg', tense: 'pres', trans: 'trans' } },
        { word: 'hold', feats: { num: 'pl', tense: 'pres', trans: 'trans' } },
        { word: 'remembers', feats: { num: 'sg', tense: 'pres', trans: 'trans' } },
        { word: 'remember', feats: { num: 'pl', tense: 'pres', trans: 'trans' } }
      ],
      Adj: [
        { word: 'dark' }, { word: 'bright' }, { word: 'cold' }, { word: 'eternal' },
        { word: 'soft' }, { word: 'silent' }, { word: 'broken' }, { word: 'ancient' },
        { word: 'hollow' }, { word: 'fading' }, { word: 'golden' }, { word: 'bitter' },
        { word: 'deep' }, { word: 'vast' }, { word: 'lost' }, { word: 'wild' },
        { word: 'still' }, { word: 'empty' }, { word: 'endless' }, { word: 'fragile' },
        { word: 'crystal' }, { word: 'silver' }, { word: 'crimson' }, { word: 'azure' }
      ],
      Adv: [
        { word: 'softly' }, { word: 'gently' }, { word: 'slowly' }, { word: 'blindly' },
        { word: 'wildly' }, { word: 'forever' }, { word: 'never' }, { word: 'always' },
        { word: 'brightly' }, { word: 'darkly' }, { word: 'silently' }, { word: 'deeply' }
      ],
      Det: [
        { word: 'the', feats: {} },
        { word: 'a', feats: { num: 'sg' } },
        { word: 'my', feats: {} },
        { word: 'our', feats: {} },
        { word: 'this', feats: { num: 'sg' } },
        { word: 'those', feats: { num: 'pl' } },
        { word: 'some', feats: {} },
        { word: 'no', feats: {} }
      ],
      Prep: [
        { word: 'in' }, { word: 'on' }, { word: 'through' }, { word: 'beyond' },
        { word: 'beneath' }, { word: 'against' }, { word: 'with' }, { word: 'without' },
        { word: 'under' }, { word: 'over' }, { word: 'above' }, { word: 'below' },
        { word: 'into' }, { word: 'from' }, { word: 'to' }, { word: 'near' }
      ]
    };
  }

  /**
   * Helper to select a lexical entry that matches constraints
   */
  _selectEntry(symbol, constraints = {}) {
     if (!this.lexicon[symbol]) return null;

     const candidates = this.lexicon[symbol].filter(entry => {
        // Check constraints (e.g., number agreement)
        for (const [key, val] of Object.entries(constraints)) {
          if (entry.feats && entry.feats[key] && entry.feats[key] !== val) return false;
        }
        return true;
      });

      if (candidates.length === 0) {
        // Fallback: relax constraints if too strict (simple error recovery)
           if (this.lexicon[symbol].length > 0) {
             return this.lexicon[symbol][Math.floor(this.rng.next() * this.lexicon[symbol].length)];
           }
           return null;
         }
         return candidates[Math.floor(this.rng.next() * candidates.length)];
  }

  /**
   * Recursive generator with constraint propagation
   */
  generate(symbol, constraints = {}) {
    const complexity = Number.isFinite(constraints.complexity) ? Math.max(1, Math.min(10, constraints.complexity)) : 1;
    const depth = Number.isFinite(constraints.depth) ? constraints.depth : 0;
    const nextDepth = depth + 1;
    if (nextDepth > complexity * 3) {
      // Safety brake to avoid runaway recursion
      if (this.lexicon[symbol]) {
        const entry = this._selectEntry(symbol, constraints);
        return entry ? entry.word : "?";
      }
      return "?";
    }

    // 1. Base Case: Terminal lookup (if symbol exists in lexicon)
    if (this.lexicon[symbol]) {
      const entry = this._selectEntry(symbol, constraints);
      return entry ? entry.word : "?";
    }

    // 2. Recursive Steps (Grammar Rules)
    switch (symbol) {
      case 'S':
        // S -> NP VP
        // We decide on a 'number' feature for the subject, which propagates to VP
        const num = this.rng.next() > 0.5 ? 'sg' : 'pl';
        return `${this.generate('NP', { num, complexity, depth: nextDepth })} ${this.generate('VP', { num, complexity, depth: nextDepth })}`;

      case 'NP': {
        // NP -> Det N | Det Adj N | N (plural/abstract) | Det Adj Adj N
        const r = this.rng.next();

        // If constraint is not provided, we should decide on one internally so Det and N agree.
        // If external constraints exists (from S), we use them.
        let localConstraints = { ...constraints };
        if (!localConstraints.num) {
          localConstraints.num = this.rng.next() > 0.5 ? 'sg' : 'pl';
        }

        const adjBias = (complexity - 1) * 0.02; // more complexity -> more modifiers
        if (r < 0.35 + adjBias) {
           return `${this.generate('Det', { ...localConstraints, complexity, depth: nextDepth })} ${this.generate('N', { ...localConstraints, complexity, depth: nextDepth })}`;
        }
        if (r < 0.7 + adjBias) {
          return `${this.generate('Det', { ...localConstraints, complexity, depth: nextDepth })} ${this.generate('Adj', { complexity, depth: nextDepth })} ${this.generate('N', { ...localConstraints, complexity, depth: nextDepth })}`;
        }
        if (r < 0.85 + adjBias) {
          return `${this.generate('Det', { ...localConstraints, complexity, depth: nextDepth })} ${this.generate('Adj', { complexity, depth: nextDepth })} ${this.generate('Adj', { complexity, depth: nextDepth })} ${this.generate('N', { ...localConstraints, complexity, depth: nextDepth })}`;
        }

        // Fallback for bare nouns (usually plural or abstract)
        // If constraint is sg, we should probably force a Det unless it's abstract/mass noun
        // For simplicity, we'll just allow it but maybe force plural if no det
        // Actually, if num=sg and we are here, we might just fail to produce valid "Det N" if we skip Det.
        // So let's force Det if sg
        if (localConstraints.num === 'sg') {
             return `${this.generate('Det', { ...localConstraints, complexity, depth: nextDepth })} ${this.generate('N', { ...localConstraints, complexity, depth: nextDepth })}`;
        }
           return this.generate('N', { ...localConstraints, complexity, depth: nextDepth });
      }

      case 'VP':
        // VP -> V | V NP | V PP | Adv V ...
        // Check verb transitivity
        const verbEntry = this._selectEntry('V', constraints);
        if (!verbEntry) return "exists";

        const verb = verbEntry.word;
        const trans = verbEntry.feats?.trans || 'intrans';

        // Optional Adverb prefix
        let prefix = "";
        if (this.rng.next() < 0.25 + (complexity - 1) * 0.01) {
          prefix = this.generate('Adv', { complexity, depth: nextDepth }) + " ";
        }

        if (trans === 'intrans') {
            // Intransitive: V or V PP
                if (this.rng.next() < 0.4 + (complexity - 1) * 0.02) {
                  return `${prefix}${verb} ${this.generate('PP', { complexity, depth: nextDepth })}`;
            }
            return `${prefix}${verb}`;
        } else {
            // Transitive: V NP or V NP PP
            // Note: Object NP doesn't need to agree with Subject (constraints), so we pass empty constraints
            // or specific ones (like Accusative case if we had cases)
            // Passing empty constraints allows NP to pick its own number agreement
             if (this.rng.next() < 0.2 + (complexity - 1) * 0.02) {
               return `${prefix}${verb} ${this.generate('NP', { complexity, depth: nextDepth })} ${this.generate('PP', { complexity, depth: nextDepth })}`;
             }
             return `${prefix}${verb} ${this.generate('NP', { complexity, depth: nextDepth })}`;
        }

      case 'PP':
        return `${this.generate('Prep', { complexity, depth: nextDepth })} ${this.generate('NP', { complexity, depth: nextDepth })}`;

      default:
        return "?";
    }
  }

  getFlatGrammar() {
    // Returns a simplified version for the CYK parser or other components that expect the old format
    // This bridges the gap between the new logic and the old interface
    const grammar = {};
    const symbols = Object.keys(this.lexicon);

    // Add terminals
    symbols.forEach(sym => {
        grammar[sym] = this.lexicon[sym].map(o => o.word);
    });

    // Add rules (Synthesized)
    // Updated to reflect the richer structure we now support
    grammar['S'] = [['NP', 'VP'], ['VP'], ['S', 'PP']];
    grammar['NP'] = [['Det', 'N'], ['N'], ['Adj', 'N'], ['NP', 'PP'], ['Det', 'Adj', 'N']];
    grammar['VP'] = [['V', 'NP'], ['V'], ['Adv', 'VP'], ['VP', 'PP'], ['Adv', 'V'], ['V', 'PP']];
    grammar['PP'] = [['P', 'NP'], ['Prep', 'NP']];

    // Ensure all lexical categories are present as non-terminals
    grammar['Det'] = this.lexicon['Det'].map(o => o.word);
    grammar['Adj'] = this.lexicon['Adj'].map(o => o.word);
    grammar['N'] = this.lexicon['N'].map(o => o.word);
    grammar['V'] = this.lexicon['V'].map(o => o.word);
    grammar['P'] = this.lexicon['Prep'].map(o => o.word); // Mapping Prep to P
    grammar['Prep'] = this.lexicon['Prep'].map(o => o.word);
    grammar['Adv'] = this.lexicon['Adv'].map(o => o.word);

    return grammar;
  }
}
