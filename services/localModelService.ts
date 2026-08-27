import { Agent, AgentCategory } from '../types';
import { logger } from './logger';
import { sanitizeChatMessage, sanitizeDisplayText } from '../utils/sanitization';

const clampStars = (stars: number | undefined): number => {
  if (typeof stars !== 'number' || !Number.isFinite(stars)) return 0;
  return Math.max(0, Math.floor(stars));
};



const safeText = (value: string | undefined): string => sanitizeDisplayText(value ?? '');

const summarizeAgent = (agent: Agent): { summary: string; strengths: string[]; risks: string[] } => {
  const strengths: string[] = [];
  const risks: string[] = [];

  if (agent.features?.length) {
    strengths.push(`Specialties: ${agent.features.slice(0, 3).join(', ')}`);
  }
  strengths.push(`Language: ${agent.language}`);
  strengths.push(`Category: ${agent.category}`);

  if (agent.tags?.includes('autonomous')) {
    risks.push('Requires careful permissioning for autonomous actions.');
  }
  if (agent.tags?.includes('experimental')) {
    risks.push('Marked experimental; expect edge cases.');
  }
  if (!agent.tags || agent.tags.length === 0) {
    risks.push('Tag metadata missing; review repo docs.');
  }

  return {
    summary: `${agent.name} focuses on ${agent.description}`,
    strengths,
    risks,
  };
};

const formatBulletSection = (title: string, lines: string[]): string => {
  const body = lines.length ? lines.map(l => `- ${l}`).join('\n') : '- No data available.';
  return `### ${title}\n${body}`;
};

export const analyzeAgent = async (agent: Agent): Promise<string> => {
  try {
    const { summary, strengths, risks } = summarizeAgent(agent);

    return [
      `## Technical Analysis: ${safeText(agent.name)}`,
      `**Overview:** ${summary}`,
      '',
      formatBulletSection('Key Capabilities', strengths),
      formatBulletSection('Use Cases', [
        `Optimized for ${agent.category} workflows using ${agent.language}.`,
        agent.useCases?.[0] ? safeText(agent.useCases[0]) : 'General CLI automation and development tasks.',
      ]),
      formatBulletSection('Considerations', risks.length ? risks : ['Check repository documentation for system requirements and known issues.']),
      '',
      `**Installation:** \`${agent.installCommand}\``,
      `**Repository:** ${agent.repoUrl}`,
      `**Community:** ${clampStars(agent.stars).toLocaleString()} stars`
    ].join('\n\n');
  } catch (error) {
    logger.error('Local analysis failed', { error });
    return 'Analysis unavailable. Check agent repository for detailed documentation.';
  }
};

/**
 * Options for async operations supporting cancellation
 */
interface AsyncOperationOptions {
  signal?: AbortSignal;
}

/**
 * Computes a weighted compatibility score between 0-100
 * Uses multi-dimensional analysis: category, language, tags overlap
 */
const computeCompatibilityScore = (agentA: Agent, agentB: Agent): { score: number; factors: string[] } => {
  const factors: string[] = [];
  let score = 50; // Base score

  // Category compatibility (±20 points)
  if (agentA.category === agentB.category) {
    score += 20;
    factors.push('Same category (+20)');
  } else {
    // Adjacent categories get partial credit
    const adjacentCategories: Record<string, string[]> = {
      [AgentCategory.CODING]: [AgentCategory.AUTONOMOUS, AgentCategory.FRAMEWORK],
      [AgentCategory.AUTONOMOUS]: [AgentCategory.CODING, AgentCategory.FRAMEWORK],
      [AgentCategory.TERMINAL_UTILITY]: [AgentCategory.INFRASTRUCTURE, AgentCategory.RESEARCH],
      [AgentCategory.FRAMEWORK]: [AgentCategory.CODING, AgentCategory.AUTONOMOUS],
      [AgentCategory.RESEARCH]: [AgentCategory.TERMINAL_UTILITY, AgentCategory.INFRASTRUCTURE],
      [AgentCategory.INFRASTRUCTURE]: [AgentCategory.TERMINAL_UTILITY, AgentCategory.RESEARCH]
    };
    if (adjacentCategories[agentA.category]?.includes(agentB.category)) {
      score += 10;
      factors.push('Related categories (+10)');
    }
  }

  // Language compatibility (±15 points)
  if (agentA.language === agentB.language) {
    score += 15;
    factors.push(`Same language: ${agentA.language} (+15)`);
  }

  // Tags overlap analysis (±15 points based on Jaccard similarity)
  const tagsA = new Set(agentA.tags || []);
  const tagsB = new Set(agentB.tags || []);
  const intersection = new Set([...tagsA].filter(x => tagsB.has(x)));
  const union = new Set([...tagsA, ...tagsB]);
  const jaccardSimilarity = union.size > 0 ? intersection.size / union.size : 0;
  const tagScore = Math.round(jaccardSimilarity * 15);
  if (tagScore > 0) {
    score += tagScore;
    factors.push(`Tag overlap: ${intersection.size} common (+${tagScore})`);
  }

  return { score: Math.min(100, Math.max(0, score)), factors };
};

/**
 * Generates recommendation based on use case analysis
 */
const generateRecommendation = (agentA: Agent, agentB: Agent): string => {
  const starsA = clampStars(agentA.stars);
  const starsB = clampStars(agentB.stars);

  // Decision matrix based on multiple factors
  const factors = {
    communityA: starsA > 20000 ? 'strong' : starsA > 5000 ? 'moderate' : 'growing',
    communityB: starsB > 20000 ? 'strong' : starsB > 5000 ? 'moderate' : 'growing',
    maturityA: (agentA.features?.length ?? 0) >= 3 ? 'mature' : 'developing',
    maturityB: (agentB.features?.length ?? 0) >= 3 ? 'mature' : 'developing'
  };

  if (factors.communityA === 'strong' && factors.maturityA === 'mature') {
    if (factors.communityB === 'strong' && factors.maturityB === 'mature') {
      return `Both ${agentA.name} and ${agentB.name} are production-ready. Choose based on specific workflow requirements and team familiarity.`;
    }
    return `${agentA.name} shows stronger production maturity. Consider for critical workflows.`;
  }

  if (factors.communityB === 'strong' && factors.maturityB === 'mature') {
    return `${agentB.name} shows stronger production maturity. Consider for critical workflows.`;
  }

  return 'Both tools are evolving. Evaluate based on specific use case alignment and team expertise.';
};

export const compareAgents = async (
  agentA: Agent,
  agentB: Agent | null,
  options?: AsyncOperationOptions
): Promise<string> => {
  // Check for abort before starting
  if (options?.signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  if (!agentB) return 'Select two agents to compare.';

  const starsA = clampStars(agentA.stars);
  const starsB = clampStars(agentB.stars);
  const starDiff = Math.abs(starsA - starsB);
  const popularityAnalysis = starsA === starsB
    ? 'Both have equal community adoption. Choose based on technical requirements.'
    : starsA > starsB
      ? `${agentA.name} has ${starDiff.toLocaleString()} more stars, indicating stronger community adoption.`
      : `${agentB.name} has ${starDiff.toLocaleString()} more stars, indicating stronger community adoption.`;

  const categoryMatch = agentA.category === agentB.category
    ? `Both tools serve the ${agentA.category} category.`
    : `Different categories: ${agentA.name} focuses on ${agentA.category}, while ${agentB.name} targets ${agentB.category}.`;

  const languageAnalysis = agentA.language === agentB.language
    ? `Both implemented in ${agentA.language}.`
    : `${agentA.name} uses ${agentA.language}, ${agentB.name} uses ${agentB.language}.`;

  const featuresA = agentA.features?.slice(0, 3).join(', ') || '—';
  const featuresB = agentB.features?.slice(0, 3).join(', ') || '—';

  // Compute advanced compatibility metrics
  const compatibility = computeCompatibilityScore(agentA, agentB);
  const recommendation = generateRecommendation(agentA, agentB);

  // Use case alignment analysis
  const useCasesA = agentA.useCases?.slice(0, 2) || [];
  const useCasesB = agentB.useCases?.slice(0, 2) || [];

  // Complementarity analysis - can these tools work together?
  const complementary = agentA.category !== agentB.category &&
    (agentA.tags?.some(t => ['framework', 'foundational', 'api'].includes(t)) ||
      agentB.tags?.some(t => ['framework', 'foundational', 'api'].includes(t)));

  const synergiesSection = complementary
    ? `\n### Synergy Potential\nThese tools have complementary capabilities and could be used together in a pipeline:\n- ${agentA.name} for ${agentA.category.toLowerCase()} tasks\n- ${agentB.name} for ${agentB.category.toLowerCase()} tasks`
    : '';

  return [
    '## Comparison Analysis',
    '',
    `### Compatibility Score: ${compatibility.score}/100`,
    compatibility.factors.length > 0 ? `Factors: ${compatibility.factors.join(', ')}` : '',
    '',
    '| Metric | Agent A | Agent B |',
    '| --- | --- | --- |',
    `| Name | ${safeText(agentA.name)} | ${safeText(agentB.name)} |`,
    `| Category | ${agentA.category} | ${agentB.category} |`,
    `| Language | ${agentA.language} | ${agentB.language} |`,
    `| Stars | ${starsA.toLocaleString()} | ${starsB.toLocaleString()} |`,
    `| Top Features | ${featuresA} | ${featuresB} |`,
    `| Install | ${safeText(agentA.installCommand)} | ${safeText(agentB.installCommand)} |`,
    '',
    '### Key Differences',
    `- **Popularity:** ${popularityAnalysis}`,
    `- **Category:** ${categoryMatch}`,
    `- **Implementation:** ${languageAnalysis}`,
    synergiesSection,
    '',
    '### Use Cases',
    `**${agentA.name}:** ${useCasesA.join(' ')}`,
    `**${agentB.name}:** ${useCasesB.join(' ')}`,
    '',
    `### Recommendation`,
    recommendation
  ].join('\n');
};

export const simulateCollaboration = async (agents: Agent[], task: string): Promise<string> => {
  const sanitizedTask = sanitizeChatMessage(task);
  if (!agents.length) return 'No agents in the squad to simulate.';

  const intro = `## Squad Collaboration Plan: ${sanitizedTask}`;
  const transcript = agents.map((agent, idx) => {
    const role = idx === 0 ? 'Primary Agent' : `Support Agent ${idx}`;
    const capability = agent.features?.[0] ?? agent.category;
    return `**${agent.name}** (${role}):\n- Language: ${agent.language}\n- Capability: ${capability}\n- Focus Area: ${agent.category}\n- Command: \`${agent.installCommand}\``;
  });

  const implementation = [
    '',
    '### Implementation Steps',
    '1. Install all agents using their respective package managers',
    '2. Configure agents according to project requirements',
    '3. Establish data flow and communication protocols',
    '4. Execute task with primary agent coordinating support agents',
    '5. Validate outputs and run integration tests',
    '6. Monitor performance and adjust configuration as needed'
  ];

  return [intro, '', ...transcript, ...implementation].join('\n');
};

/**
 * Command templates for various CLI operations
 * Maps intents to executable shell commands with parameters
 */
const COMMAND_TEMPLATES: Record<string, { pattern: RegExp; command: (matches: string[]) => string; description: string }[]> = {
  file_operations: [
    {
      pattern: /find\s+(all\s+)?(\w+)\s+files?\s+(modified|changed|created)\s+(in\s+)?(?:the\s+)?(?:last\s+)?(\d+)\s+(day|week|month|hour)s?/i,
      command: (m) => {
        const ext = m[2] ?? 'txt';
        const num = parseInt(m[5] ?? '7');
        const unit = m[6]?.toLowerCase();
        const multiplier = unit === 'week' ? 7 : unit === 'month' ? 30 : unit === 'hour' ? 0.0417 : 1;
        const mtime = Math.ceil(num * multiplier);
        return `find . -type f -mtime -${mtime} -iname "*.${ext}"`;
      },
      description: 'Find files by type and modification time'
    },
    {
      pattern: /list\s+(all\s+)?files?\s+(larger|bigger|over)\s+(\d+)\s*(mb|gb|kb)?/i,
      command: (m) => {
        const size = parseInt(m[3] ?? '100');
        const unit = (m[4] ?? 'mb').toLowerCase();
        const suffix = unit === 'gb' ? 'G' : unit === 'kb' ? 'k' : 'M';
        return `find . -type f -size +${size}${suffix} -exec ls -lh {} \\;`;
      },
      description: 'Find large files'
    },
    {
      pattern: /delete\s+(all\s+)?(empty|unused)\s+(files?|folders?|directories?)/i,
      command: (m) => {
        const isDir = /folder|director/i.test(m[3] ?? '');
        return isDir ? 'find . -type d -empty -delete' : 'find . -type f -empty -delete';
      },
      description: 'Remove empty files or directories'
    }
  ],
  git_operations: [
    {
      pattern: /git\s+status/i,
      command: () => 'git status --short --branch',
      description: 'Check git repository status'
    },
    {
      pattern: /(show|list)\s+(recent|last)\s+(\d+)?\s*commits?/i,
      command: (m) => {
        const count = parseInt(m[3] ?? '10');
        return `git log --oneline -n ${count}`;
      },
      description: 'Show recent commits'
    },
    {
      pattern: /undo\s+(last\s+)?commit/i,
      command: () => 'git reset --soft HEAD~1',
      description: 'Undo last commit keeping changes'
    },
    {
      pattern: /(stash|save)\s+(current\s+)?changes/i,
      command: () => 'git stash push -m "WIP: $(date +%Y-%m-%d_%H:%M)"',
      description: 'Stash current changes'
    }
  ],
  docker_operations: [
    {
      pattern: /docker\s+(prune|clean|cleanup)/i,
      command: () => 'docker system prune -af --volumes',
      description: 'Clean up Docker resources'
    },
    {
      pattern: /(list|show)\s+(running\s+)?containers?/i,
      command: () => 'docker ps --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"',
      description: 'List Docker containers'
    },
    {
      pattern: /stop\s+all\s+containers?/i,
      command: () => 'docker stop $(docker ps -q)',
      description: 'Stop all running containers'
    }
  ],
  system_operations: [
    {
      pattern: /(tail|show|view)\s+(the\s+)?logs?/i,
      command: () => 'tail -n 100 -f /var/log/syslog 2>/dev/null || journalctl -f -n 100',
      description: 'View system logs'
    },
    {
      pattern: /(check|show)\s+(disk|storage)\s+(space|usage)/i,
      command: () => 'df -h | head -10',
      description: 'Check disk usage'
    },
    {
      pattern: /(check|show)\s+(memory|ram)\s+(usage)?/i,
      command: () => 'free -h',
      description: 'Check memory usage'
    },
    {
      pattern: /(list|show)\s+(running\s+)?process(es)?/i,
      command: () => 'ps aux --sort=-%mem | head -15',
      description: 'List processes by memory usage'
    }
  ],
  node_operations: [
    {
      pattern: /(npm|node)\s+install/i,
      command: () => 'npm install',
      description: 'Install Node.js dependencies'
    },
    {
      pattern: /(update|upgrade)\s+(all\s+)?packages?/i,
      command: () => 'npm update && npm audit fix',
      description: 'Update packages and fix vulnerabilities'
    },
    {
      pattern: /run\s+(dev|development)\s*(server)?/i,
      command: () => 'npm run dev',
      description: 'Start development server'
    }
  ]
};

const heuristicCommand = (query: string): string => {
  const q = query.toLowerCase().trim();

  // Try to match against all command templates
  for (const category of Object.values(COMMAND_TEMPLATES)) {
    for (const template of category) {
      const match = q.match(template.pattern);
      if (match) {
        try {
          return template.command(match);
        } catch {
          // Pattern matched but command generation failed, continue searching
        }
      }
    }
  }

  // Fallback heuristics for common patterns
  if (q.includes('pdf') && (q.includes('find') || q.includes('search'))) {
    return 'find . -type f -mtime -7 -iname "*.pdf"';
  }
  if (q.includes('count') && q.includes('line')) {
    return 'find . -type f -name "*.ts" -o -name "*.js" | xargs wc -l | tail -1';
  }
  if (q.includes('port') && /\d+/.test(q)) {
    const port = q.match(/\d+/)?.[0] || '3000';
    return `lsof -i :${port} || netstat -tulpn | grep :${port}`;
  }

  return 'echo "Describe the task more concretely (inputs, paths, targets)."';
};

export const generateShellCommand = async (query: string, options?: AsyncOperationOptions): Promise<string> => {
  if (options?.signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  const sanitized = sanitizeChatMessage(query);
  const rawCommand = heuristicCommand(sanitized);

  // For generated commands, we don't sanitize as strictly since these are known patterns
  // But we do validate they don't contain injection attempts from user input
  const hasInjection = /[`$]/.test(sanitized); // Check if user input contained injection
  if (hasInjection) {
    return [
      '### Security Notice',
      'Potential command injection detected in input. Please rephrase your request without special characters.',
      '',
      '**Safe Alternative:**',
      '```bash',
      'echo "Please describe what you want to do in plain language"',
      '```'
    ].join('\n');
  }

  const command = rawCommand;
  return [
    '### Generated Command',
    '```bash',
    command,
    '```',
    '',
    '**Note:** Review command before execution. Adjust paths and parameters for your environment.'
  ].join('\n');
};

/**
 * Knowledge base for expert responses
 * Provides structured information about CLI tools and best practices
 */
const KNOWLEDGE_BASE = {
  installation: {
    keywords: ['install', 'setup', 'configure', 'get started', 'begin'],
    response: (_query: string) => {
      const steps = [
        '1. **Verify Prerequisites:** Check system requirements (Node.js, Python, Docker, etc.)',
        '2. **Package Manager:** Use the appropriate package manager for your ecosystem',
        '3. **Configuration:** Review default settings and adjust for your environment',
        '4. **Verification:** Run the tool with `--version` or `--help` to confirm installation',
        '5. **Documentation:** Bookmark the official docs for reference'
      ];
      return steps.join('\n');
    }
  },
  troubleshooting: {
    keywords: ['error', 'fail', 'problem', 'issue', 'not working', 'broken', 'crash'],
    response: (_query: string) => {
      return [
        '**Diagnostic Steps:**',
        '1. Check error messages and stack traces for specific clues',
        '2. Verify all dependencies are installed and at correct versions',
        '3. Review recent changes that might have caused the issue',
        '4. Check GitHub Issues for similar reported problems',
        '5. Try with verbose/debug flags: `--verbose` or `-v`',
        '',
        '**Common Fixes:**',
        '- Clear cache: `npm cache clean --force` or equivalent',
        '- Reinstall dependencies: Remove lock file and node_modules, reinstall',
        '- Check permissions: Ensure proper read/write access'
      ].join('\n');
    }
  },
  comparison: {
    keywords: ['compare', 'choose', 'which', 'versus', 'vs', 'better', 'difference'],
    response: (_query: string) => {
      return [
        '**Evaluation Criteria:**',
        '| Factor | Weight | Consider |',
        '| --- | --- | --- |',
        '| Team Expertise | High | Existing knowledge and learning curve |',
        '| Community Support | High | GitHub stars, active maintenance, docs quality |',
        '| Integration | Medium | Fits with current tech stack |',
        '| Performance | Medium | Resource usage, speed requirements |',
        '| Features | Medium | Specific capabilities needed |',
        '',
        '**Recommendation:** Start with a proof-of-concept using the tool that best fits your immediate needs.',
        'Consider long-term maintenance and community health over raw feature count.'
      ].join('\n');
    }
  },
  performance: {
    keywords: ['performance', 'optimize', 'slow', 'fast', 'speed', 'efficient'],
    response: (_query: string) => {
      return [
        '**Performance Optimization Checklist:**',
        '1. **Profile First:** Measure before optimizing - use built-in profilers',
        '2. **Caching:** Implement caching for repeated operations',
        '3. **Parallel Processing:** Utilize multi-core processing where available',
        '4. **Resource Limits:** Check memory and CPU allocation',
        '5. **Network:** Minimize API calls, batch requests when possible',
        '',
        '**Tool-Specific Tips:**',
        '- For local LLMs: Use quantized models (GGUF format) for better performance',
        '- For CLI tools: Enable streaming output for large operations',
        '- For automation: Use async/parallel execution patterns'
      ].join('\n');
    }
  },
  security: {
    keywords: ['security', 'safe', 'secure', 'vulnerability', 'audit', 'permission'],
    response: (_query: string) => {
      return [
        '**Security Best Practices:**',
        '1. **Audit Dependencies:** Run `npm audit` or equivalent regularly',
        '2. **Least Privilege:** Grant minimal permissions necessary',
        '3. **Sandboxing:** Use containers or VMs for untrusted code',
        '4. **Input Validation:** Never trust user input, sanitize all inputs',
        '5. **Secrets Management:** Use environment variables, never commit secrets',
        '',
        '**For Autonomous Agents:**',
        '- Review all actions before execution',
        '- Set up approval workflows for destructive operations',
        '- Log all agent activities for auditing'
      ].join('\n');
    }
  },
  workflow: {
    keywords: ['workflow', 'pipeline', 'automate', 'ci', 'cd', 'deploy'],
    response: (_query: string) => {
      return [
        '**Workflow Integration Patterns:**',
        '1. **CI/CD Integration:** Add CLI agents to your pipeline stages',
        '2. **Pre-commit Hooks:** Automate code quality checks',
        '3. **Batch Processing:** Schedule tasks with cron or task runners',
        '4. **Event-Driven:** Trigger actions based on file changes or webhooks',
        '',
        '**Example Pipeline:**',
        '```yaml',
        'stages:',
        '  - lint: Run code quality checks',
        '  - test: Execute test suite',
        '  - review: AI-assisted code review',
        '  - deploy: Automated deployment',
        '```'
      ].join('\n');
    }
  }
};

export const askExpert = async (
  query: string,
  context?: string,
  options?: AsyncOperationOptions
): Promise<string> => {
  if (options?.signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  const sanitized = sanitizeChatMessage(query);
  const ctx = context ? sanitizeChatMessage(context) : 'CLI agent registry';
  const q = sanitized.toLowerCase();

  // Optional trained LaPoet layer (runtime-loaded checkpoint + CLI corpora from /public).
  // Must never break core chat.

  // Match against knowledge base
  let responseSection = '';
  let matchedTopic = 'general';

  for (const [topic, kb] of Object.entries(KNOWLEDGE_BASE)) {
    if (kb.keywords.some(kw => q.includes(kw))) {
      responseSection = kb.response(sanitized);
      matchedTopic = topic;
      break;
    }
  }

  // Generate contextual guidance if no specific match
  if (!responseSection) {
    responseSection = [
      '**General Guidance:**',
      '1. Start by reviewing the official documentation for the tool in question',
      '2. Check the GitHub repository for examples and common patterns',
      '3. Test in a development environment before production deployment',
      '4. Consider using Docker for isolated testing environments',
      '',
      '**Available Resources in Registry:**',
      `- Browse agents by category to find tools for your use case`,
      `- Use the comparison feature to evaluate multiple options`,
      `- Check community ratings and reviews for real-world feedback`
    ].join('\n');
  }

  // Build structured response
  const response = [
    `## Expert Analysis`,
    '',
    `**Topic:** ${matchedTopic.charAt(0).toUpperCase() + matchedTopic.slice(1)}`,
    `**Query:** ${sanitized}`,
    '',
    responseSection,
    '',
    '---',
    `*Context: ${ctx}*`,
    '',
    '**Next Steps:** Explore the registry for relevant tools, or ask a more specific question.'
  ].join('\n');

  return response;
};

/**
 * Installation troubleshooting database
 * Maps error patterns to solutions
 */
const INSTALLATION_TROUBLESHOOTING: Record<string, { pattern: RegExp; solution: string; platforms: string[] }[]> = {
  npm: [
    {
      pattern: /EACCES|permission denied/i,
      solution: 'Permission error. Fix with:\n- Windows: Run PowerShell as Administrator\n- Mac/Linux: Use `sudo npm install -g <package>` or fix npm permissions:\n  ```\n  mkdir ~/.npm-global\n  npm config set prefix \'~/.npm-global\'\n  export PATH=~/.npm-global/bin:$PATH\n  ```',
      platforms: ['windows', 'macos', 'linux']
    },
    {
      pattern: /ENOENT|not found/i,
      solution: 'Node.js or npm not found. Install Node.js 18+ from https://nodejs.org/ or use nvm:\n- Windows: `winget install OpenJS.NodeJS.LTS`\n- Mac: `brew install node`\n- Linux: `curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && sudo apt install -y nodejs`',
      platforms: ['windows', 'macos', 'linux']
    },
    {
      pattern: /ETIMEDOUT|network/i,
      solution: 'Network timeout. Check your internet connection or try:\n- Use a different registry: `npm config set registry https://registry.npmmirror.com`\n- Check proxy settings: `npm config get proxy`',
      platforms: ['windows', 'macos', 'linux']
    }
  ],
  pip: [
    {
      pattern: /permission denied|access is denied/i,
      solution: 'Permission error. Fix with:\n- Use `pip install --user <package>` for user-level install\n- Or use a virtual environment: `python -m venv venv && source venv/bin/activate`\n- Windows: `python -m venv venv && venv\\Scripts\\activate`',
      platforms: ['windows', 'macos', 'linux']
    },
    {
      pattern: /python.*not found|pip.*not found/i,
      solution: 'Python not found. Install Python 3.9+:\n- Windows: `winget install Python.Python.3.12`\n- Mac: `brew install python`\n- Linux: `sudo apt install python3 python3-pip`',
      platforms: ['windows', 'macos', 'linux']
    },
    {
      pattern: /externally-managed-environment/i,
      solution: 'System Python is protected. Use a virtual environment:\n```\npython -m venv ~/myvenv\nsource ~/myvenv/bin/activate\npip install <package>\n```\nOr use pipx for CLI tools: `pipx install <package>`',
      platforms: ['macos', 'linux']
    }
  ],
  brew: [
    {
      pattern: /brew.*not found|command not found.*brew/i,
      solution: 'Homebrew not installed. Install with:\n```\n/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"\n```\nThen add to PATH as instructed.',
      platforms: ['macos', 'linux']
    },
    {
      pattern: /already installed/i,
      solution: 'Package already installed. To upgrade:\n`brew upgrade <package>`\nTo reinstall:\n`brew reinstall <package>`',
      platforms: ['macos', 'linux']
    }
  ],
  winget: [
    {
      pattern: /winget.*not found|not recognized/i,
      solution: 'WinGet not available. Options:\n1. Update Windows to latest version (WinGet comes with App Installer)\n2. Install from Microsoft Store: search "App Installer"\n3. Download from: https://github.com/microsoft/winget-cli/releases',
      platforms: ['windows']
    },
    {
      pattern: /administrator/i,
      solution: 'Administrator required. Right-click PowerShell → "Run as Administrator"',
      platforms: ['windows']
    }
  ],
  docker: [
    {
      pattern: /docker.*not found|daemon.*not running/i,
      solution: 'Docker not running. Fix:\n- Windows/Mac: Open Docker Desktop application\n- Linux: `sudo systemctl start docker`\n\nInstall Docker: https://docs.docker.com/get-docker/',
      platforms: ['windows', 'macos', 'linux']
    },
    {
      pattern: /permission denied.*docker\.sock/i,
      solution: 'Docker permission error on Linux. Add user to docker group:\n```\nsudo usermod -aG docker $USER\nnewgrp docker\n```\nThen logout and login again.',
      platforms: ['linux']
    }
  ],
  curl: [
    {
      pattern: /curl.*not found/i,
      solution: 'curl not installed.\n- Windows: Pre-installed on Windows 10+, or use `winget install curl.curl`\n- Mac: Pre-installed, or `brew install curl`\n- Linux: `sudo apt install curl`',
      platforms: ['windows', 'macos', 'linux']
    },
    {
      pattern: /SSL|certificate/i,
      solution: 'SSL certificate error. Try:\n- Update CA certificates: `sudo update-ca-certificates`\n- Or use `-k` flag (insecure, not recommended for production)',
      platforms: ['macos', 'linux']
    }
  ],
  ollama: [
    {
      pattern: /connection refused|11434/i,
      solution: 'Ollama server not running. Start it with:\n`ollama serve`\n\nOr check if another process is using port 11434:\n- Windows: `netstat -ano | findstr 11434`\n- Mac/Linux: `lsof -i :11434`',
      platforms: ['windows', 'macos', 'linux']
    },
    {
      pattern: /model.*not found|pull/i,
      solution: 'Model not downloaded. Pull a model first:\n`ollama pull llama3.2`\n\nList available models:\n`ollama list`',
      platforms: ['windows', 'macos', 'linux']
    },
    {
      pattern: /GPU|CUDA|out of memory/i,
      solution: 'GPU/Memory issue. Try:\n1. Use a smaller quantized model: `ollama pull llama3.2:1b`\n2. Set GPU layers: `OLLAMA_NUM_GPU=0 ollama serve` (CPU only)\n3. Check GPU drivers are installed (`nvidia-smi` for NVIDIA)',
      platforms: ['windows', 'macos', 'linux']
    }
  ]
};

/**
 * Diagnoses installation errors and provides solutions
 */
export const diagnoseInstallError = (error: string, installCommand: string): string => {
  const sanitizedError = sanitizeChatMessage(error);
  const solutions: string[] = [];

  // Detect package manager from command
  const packageManagers = ['npm', 'pip', 'brew', 'winget', 'docker', 'curl', 'ollama'] as const;
  let detectedManager: string | null = null;

  for (const pm of packageManagers) {
    if (installCommand.toLowerCase().includes(pm)) {
      detectedManager = pm;
      break;
    }
  }

  // Search for matching error patterns
  for (const [manager, patterns] of Object.entries(INSTALLATION_TROUBLESHOOTING)) {
    for (const { pattern, solution } of patterns) {
      if (pattern.test(sanitizedError) || (detectedManager === manager && pattern.test(sanitizedError))) {
        solutions.push(solution);
      }
    }
  }

  if (solutions.length === 0) {
    return [
      '### Installation Troubleshooting',
      '',
      'Unable to automatically diagnose this specific error. General steps:',
      '',
      '1. **Check Prerequisites:** Ensure required runtime (Node.js, Python, Docker) is installed',
      '2. **Update Package Manager:** Run `npm update -g npm` or equivalent',
      '3. **Check Network:** Verify internet connection and proxy settings',
      '4. **Run as Admin:** Try running terminal with elevated privileges',
      '5. **Check Documentation:** Visit the tool\'s GitHub repository for specific installation guides',
      '',
      '**Detected Package Manager:** ' + (detectedManager || 'Unknown'),
      '**Command:** `' + installCommand + '`',
      '',
      'If issues persist, search the error message on the tool\'s GitHub Issues page.'
    ].join('\n');
  }

  return [
    '### Installation Troubleshooting',
    '',
    `Found ${solutions.length} potential solution(s):`,
    '',
    ...solutions.map((s, i) => `**Solution ${i + 1}:**\n${s}`),
    '',
    '---',
    '*If none of these solutions work, check the tool\'s documentation or GitHub Issues.*'
  ].join('\n\n');
};

/**
 * Gets platform-specific installation guidance
 */
export const getInstallationGuide = (agent: Agent): string => {
  const guides: string[] = [
    `## Installation Guide: ${agent.name}`,
    ''
  ];

  // Add platform-specific commands
  if (agent.platformCommands) {
    guides.push('### Platform-Specific Commands', '');

    if (agent.platformCommands.windows) {
      guides.push(`**Windows (PowerShell):**`);
      guides.push('```powershell');
      guides.push(agent.platformCommands.windows);
      guides.push('```');
      guides.push('');
    }

    if (agent.platformCommands.macos) {
      guides.push(`**macOS:**`);
      guides.push('```bash');
      guides.push(agent.platformCommands.macos);
      guides.push('```');
      guides.push('');
    }

    if (agent.platformCommands.linux) {
      guides.push(`**Linux:**`);
      guides.push('```bash');
      guides.push(agent.platformCommands.linux);
      guides.push('```');
      guides.push('');
    }

    if (agent.platformCommands.docker) {
      guides.push(`**Docker (Cross-platform):**`);
      guides.push('```bash');
      guides.push(agent.platformCommands.docker);
      guides.push('```');
      guides.push('');
    }

    if (agent.platformCommands.notes) {
      guides.push(`> 💡 **Note:** ${agent.platformCommands.notes}`);
      guides.push('');
    }
  } else {
    guides.push(`**Default Installation:**`);
    guides.push('```bash');
    guides.push(agent.installCommand);
    guides.push('```');
    guides.push('');
  }

  // Add troubleshooting tips if available
  if (agent.troubleshooting && agent.troubleshooting.length > 0) {
    guides.push('### Troubleshooting', '');
    agent.troubleshooting.forEach((tip, i) => {
      guides.push(`${i + 1}. ${tip}`);
    });
    guides.push('');
  }

  // Add general post-install steps
  guides.push('### After Installation', '');
  guides.push('1. Verify installation by running the tool with `--version` or `--help`');
  guides.push('2. Check the official documentation for configuration options');
  guides.push('3. Set up any required API keys or environment variables');
  guides.push('');
  guides.push(`**Repository:** ${agent.repoUrl}`);

  return guides.join('\n');
};