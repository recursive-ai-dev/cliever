
import { Agent, AgentCategory } from './types';

/**
 * Date the bundled star counts, versions, and archive flags were last
 * refreshed from upstream (GitHub metadata + package registries).
 */
export const REGISTRY_METADATA_AS_OF = '2026-10-18';

// Exporting TAG_DESCRIPTIONS to provide tooltips for agent tags
export const TAG_DESCRIPTIONS: Record<string, string> = {
  'terminal': 'Built for the command line environment.',
  'open-source': 'Code is publicly available and community-driven.',
  'productivity': 'Designed to speed up development workflows.',
  'rust': 'Built using the high-performance Rust programming language.',
  'proprietary': 'Closed-source tool with managed features.',
  'coding': 'Specialized for software engineering tasks.',
  'autonomous': 'Capable of executing multi-step tasks independently.',
  'sota': 'State-of-the-art model or architecture.',
  'git': 'Deep integration with Git version control.',
  'python': 'Powered by or built with Python.',
  'go': 'Built with the Go programming language.',
  'complex-tasks': 'Optimized for long-running, multi-file operations.',
  'planning': 'Features advanced strategy and task breakdown.',
  'security': 'Focuses on safe execution and data protection.',
  'sandbox': 'Executes code in isolated environments.',
  'github': 'Part of the GitHub ecosystem.',
  'official': 'Maintained by the original service provider.',
  'aws': 'Optimized for Amazon Web Services.',
  'cloud': 'Cloud-native architecture and scaling.',
  'google': 'Built by Google or leverages Google AI.',
  'utility': 'A focused tool for specific CLI operations.',
  'local-llm': 'Runs Large Language Models on local hardware.',
  'inference': 'Focused on high-speed model execution.',
  'gui': 'Features a graphical user interface component.',
  'api': 'Provides a programmable interface for integrations.',
  'distributed': 'Supports multi-node or P2P operations.',
  'privacy': 'Designed to protect user data and local processing.',
  'offline': 'Works without an internet connection.',
  'desktop': 'A standalone application for desktop OS.',
  'mozilla': 'Maintained by the Mozilla Foundation.',
  'foundational': 'Base tool for other agents or frameworks.',
  'portable': 'Runs as a single executable without dependencies.',
  'automation': 'Automates repetitive system tasks.',
  'interpreter': 'Directly executes code in various languages.',
  'local': 'Runs primarily on the local machine.',
  'bash': 'Enhanced shell script generation.',
  'snippets': 'Manages reusable code segments.',
  'prompts': 'Uses curated prompt engineering patterns.',
  'framework': 'A building block for creating other agents.',
  'debugging': 'Aids in finding and fixing code errors.',
  'logging': 'Detailed tracking of model interactions.',
  'experimentation': 'Ideal for testing different models or prompts.',
  'iac': 'Infrastructure as Code automation.',
  'tui': 'Terminal User Interface with visual elements.',
  'rss': 'Syndicated content reader for terminal enthusiasts.',
  'anime': 'Optimized for anime and manga track management.',
  'entertainment': 'Tools for leisure and content consumption.',
  'music': 'Audio playback and library management tools.',
  'video': 'Video downloading, streaming, and playback utilities.',
  'spotify': 'Integrations with the Spotify streaming service.',
  'streaming': 'Tools for handling live or on-demand media streams.',
  'c': 'Written in or for the C programming language.',
  'c++': 'Written in or for the C++ programming language.',
  'organization': 'Helps organize files, notes, or tasks.',
  'player': 'Plays media directly from the terminal.',
  'documentation': 'Generates or renders project documentation.',
  'theming': 'Customizes visual appearance and color schemes.',
  'database': 'Connects to or manages database systems.',
  'data': 'Processes, transforms, or analyzes data sets.',
  'markdown': 'Reads, renders, or edits Markdown content.',
  'devops': 'Supports deployment and operations workflows.',
  'kubernetes': 'Manages Kubernetes clusters and workloads.',
  'docker': 'Manages containers and Docker workflows.',
  'notes': 'Note-taking and knowledge management.',
  'time-tracking': 'Tracks time spent on tasks and projects.',
  'development': 'General-purpose software development tooling.',
  'network': 'Inspects or manages network connections.',
  'ssh': 'Works over or manages SSH connections.',
  'monitoring': 'Watches systems, logs, or metrics.',
  'editor': 'A text editor for code or prose.',
  'download': 'Downloads content from remote sources.',
  'media-player': 'Plays audio or video media.',
  'file-manager': 'Browses and manipulates files and directories.',
  'vim': 'Vim-style modal editing or keybindings.',
  'async': 'Asynchronous or non-blocking execution model.',
  'search': 'Finds content across files, code, or the web.',
  'fuzzy-finder': 'Fuzzy matching for fast interactive search.',
  'lisp': 'Built with or for the Lisp language family.',
  'http': 'Speaks HTTP for API calls and web requests.',
  'curl': 'Transfers data with URLs, curl-compatible.',
  'mysql': 'Works with MySQL or MariaDB databases.',
  'postgresql': 'Works with PostgreSQL databases.',
  'redis': 'Works with Redis key-value stores.',
  'sql': 'Queries or manages SQL databases.',
  'shell': 'Runs as or extends the system shell.',
  'disk-usage': 'Analyzes disk space consumption.',
  'mcp': 'Speaks the Model Context Protocol for tool and data integrations.',
  'context': 'Packages code or documents into LLM-ready context.',
  'multiplexer': 'Runs many terminal sessions in panes, windows, and detachable sessions.',
  'encryption': 'Encrypts files or secrets with modern cryptography.'
};

export const AGENTS: Agent[] = [
  // --- 2.0 AI-ENHANCED TERMINAL EMULATORS ---
  {
    id: 'wave-terminal',
    name: 'Wave Terminal',
    description: 'Open-source, IDE-like terminal with graphical widgets and block-based output.',
    longDescription: 'Wave Terminal brings a rich, IDE-like experience to the command line. It features an inline web browser, markdown previews, and command blocks that isolate execution steps for agentic oversight.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 22491,
    language: 'Go',
    installCommand: 'brew install --cask wave',
    platformCommands: {
      default: 'brew install --cask wave',
      windows: 'winget install CommandLine.Wave',
      macos: 'brew install --cask wave',
      linux: 'Download AppImage from github.com/wavetermdev/waveterm/releases',
      notes: 'Cross-platform Electron app. Check releases page for latest builds.'
    },
    repoUrl: 'https://github.com/wavetermdev/waveterm',
    features: ['Integrated AI Chat', 'Built-in Editor', 'Command Blocks', 'Inline Multimedia'],
    tags: ['terminal', 'open-source', 'productivity'],
    useCases: ['Monitoring agent execution plans.', 'Editing remote files.', 'In-terminal documentation browsing.'],
    reviews: [],
    version: '0.14.5'
  },
  {
    id: 'warp',
    name: 'Warp',
    description: 'Rust-based terminal purpose-built for AI-powered collaboration.',
    longDescription: 'Warp is an agentic development environment that unifies tooling across the software lifecycle. It features native agentic workflows and an integrated code review interface.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 65490,
    language: 'Rust',
    installCommand: 'brew install --cask warp',
    platformCommands: {
      default: 'brew install --cask warp',
      windows: 'winget install Warp.Warp',
      macos: 'brew install --cask warp',
      linux: 'curl -fsSL https://releases.warp.dev/install.sh | sh',
      notes: 'Requires account creation. Linux packages are installer scripts; verify chmod +x if needed.'
    },
    repoUrl: 'https://github.com/warpdotdev/warp',
    features: ['Agentic Workflow Integration', 'Warp Drive Collaboration', 'Block-based outputs'],
    tags: ['terminal', 'rust', 'proprietary'],
    useCases: ['Translating intent to bash.', 'Collaborative debugging.', 'Team-shared terminal blocks.'],
    reviews: [],
    version: '2026.10.14'
  },
  // --- 3.0 AGENTIC CODING ASSISTANTS ---
  {
    id: 'claude-code',
    name: 'Claude Code',
    description: 'Anthropic\'s command-line tool for agentic software engineering.',
    longDescription: 'Claude Code is Anthropic\'s agentic coding tool for the terminal. It reads your codebase, edits files, runs commands, and handles git workflows through natural language, with tiered permissions, hooks, subagents, and MCP integrations.',
    category: AgentCategory.AUTONOMOUS,
    stars: 150377,
    language: 'TypeScript',
    installCommand: 'curl -fsSL https://claude.ai/install.sh | bash',
    platformCommands: {
      default: 'curl -fsSL https://claude.ai/install.sh | bash',
      windows: 'irm https://claude.ai/install.ps1 | iex',
      macos: 'brew install --cask claude-code',
      linux: 'curl -fsSL https://claude.ai/install.sh | bash',
      notes: 'The native installer auto-updates. npm installation (`npm install -g @anthropic-ai/claude-code`) is deprecated. Sign in with a Claude account or set ANTHROPIC_API_KEY.'
    },
    repoUrl: 'https://github.com/anthropics/claude-code',
    features: ['Agentic multi-file edits', 'Tiered permissions', 'Hooks and subagents', 'MCP integrations'],
    tags: ['coding', 'autonomous', 'sota'],
    useCases: ['Complex refactoring.', 'Autonomous bug detection.', 'CI/CD pipeline automation.'],
    reviews: [],
    troubleshooting: [
      'Authentication error: run `claude` and complete login, or set ANTHROPIC_API_KEY for API billing',
      'Command not found after install: open a new shell so the updated PATH is picked up',
      'Long sessions: use the `/compact` command to summarize context, or `/clear` to start fresh'
    ],
    version: '2.1.292'
  },
  {
    id: 'cline',
    name: 'Cline',
    description: 'Open-source coding agent with a methodical Plan & Act workflow.',
    longDescription: 'Distinguished by its separation of strategy and implementation. Features Memory Bank system and Checkpoint management for immutable snapshots.',
    category: AgentCategory.CODING,
    stars: 70279,
    language: 'TypeScript',
    installCommand: 'npm install -g cline',
    platformCommands: {
      default: 'npm install -g cline',
      windows: 'npm install -g cline',
      notes: 'Also available as VS Code extension. CLI version is standalone.'
    },
    repoUrl: 'https://github.com/cline/cline',
    features: ['Memory Bank', 'Plan & Act workflow', 'Checkpoint snapshots'],
    tags: ['open-source', 'coding', 'git'],
    useCases: ['Safe experimentation with snapshots.', 'Local-first private coding.', 'Methodical feature planning.'],
    reviews: [],
    version: '3.0.73'
  },
  {
    id: 'aider',
    name: 'Aider',
    description: 'CLI chat tool for pair programming with deep Git integration.',
    longDescription: 'Aider builds a map of the local repository and works seamlessly with Git history to review, amend, and commit changes autonomously.',
    category: AgentCategory.CODING,
    stars: 49595,
    language: 'Python',
    installCommand: 'pip install aider-chat',
    platformCommands: {
      default: 'pip install aider-chat',
      windows: 'pip install aider-chat',
      macos: 'brew install aider',
      notes: 'The upstream-recommended path is `python -m pip install aider-install && aider-install`, which isolates aider in its own environment. Works with OpenAI, Anthropic, and local models.'
    },
    repoUrl: 'https://github.com/Aider-AI/aider',
    features: ['Repository Mapping', 'Deep Git Integration', 'Multi-LLM Support'],
    tags: ['python', 'git', 'coding'],
    useCases: ['Large module refactoring.', 'Managing project-wide code changes.', 'Git conflict resolution.'],
    reviews: [],
    version: '0.86.2'
  },
  {
    id: 'plandex',
    name: 'Plandex',
    description: 'Engineered for massive coding tasks and 2M token context windows.',
    longDescription: 'Plandex manages complex, multi-step tasks across large codebases using tree-sitter indexing and intelligent context caching.',
    category: AgentCategory.CODING,
    stars: 15712,
    language: 'Go',
    installCommand: 'curl -sL https://plandex.ai/install.sh | bash',
    platformCommands: {
      default: 'curl -sL https://plandex.ai/install.sh | bash',
      windows: 'Use WSL and run the Linux install script (no native Windows/PowerShell installer)',
      macos: 'curl -sL https://plandex.ai/install.sh | bash',
      notes: 'Requires Go 1.21+ for building from source. Pre-built binaries available. No Homebrew formula/tap exists.'
    },
    repoUrl: 'https://github.com/plandex-ai/plandex',
    features: ['2M Context window', 'Automated Debugging', 'Tree-sitter indexing'],
    tags: ['go', 'complex-tasks', 'planning'],
    useCases: ['Enterprise-scale codebase navigation.', 'Long-running multi-file implementation.', 'Automated test suite debugging.'],
    reviews: [],
    version: 'v0.12.0'
  },
  {
    id: 'openhands',
    name: 'OpenHands',
    description: 'Security-first autonomous engineering with native sandboxing.',
    longDescription: 'Provides an isolated environment for agents to operate safely, preventing unintended system changes during autonomous development.',
    category: AgentCategory.AUTONOMOUS,
    stars: 91205,
    language: 'Python',
    installCommand: 'uv tool install openhands --python 3.12',
    platformCommands: {
      default: 'uv tool install openhands --python 3.12',
      windows: 'uv tool install openhands --python 3.12',
      notes: 'Launch the terminal UI with `openhands`. For the browser-based interface, install the Agent Canvas: `npm install -g @openhands/agent-canvas`.'
    },
    repoUrl: 'https://github.com/OpenHands/OpenHands',
    features: ['Native Sandboxing', 'Model-Agnostic', 'Secure Isolation'],
    tags: ['python', 'security', 'sandbox'],
    useCases: ['Safe execution of untrusted scripts.', 'Sandboxed feature building.', 'Security analysis of code.'],
    reviews: [],
    version: '1.16.0'
  },
  {
    id: 'gh-copilot',
    name: 'GitHub Copilot CLI',
    description: 'GitHub\'s agentic Copilot coding agent, directly in your terminal.',
    longDescription: 'Copilot CLI brings the Copilot coding agent to the shell. It works with your repositories, issues, and pull requests through GitHub\'s MCP server, edits files, and runs commands behind explicit approvals.',
    category: AgentCategory.CODING,
    stars: 11251,
    language: 'TypeScript',
    installCommand: 'npm install -g @github/copilot',
    platformCommands: {
      default: 'npm install -g @github/copilot',
      windows: 'winget install GitHub.Copilot',
      macos: 'brew install --cask copilot-cli',
      linux: 'curl -fsSL https://gh.io/copilot-install | bash',
      notes: 'Replaces the retired `gh extension install github/gh-copilot`. Requires an active Copilot subscription. Launch with `copilot`.'
    },
    repoUrl: 'https://github.com/github/copilot-cli',
    features: ['Agent Mode Activation', 'Official Workspace Indexing', 'Multi-file Edits'],
    tags: ['github', 'official', 'productivity'],
    useCases: ['Automating PR reviews.', 'Complex workspace navigation.', 'Iterative feature development.'],
    reviews: [],
    version: '1.0.98'
  },
  {
    id: 'amazon-q',
    name: 'Kiro CLI (formerly Amazon Q)',
    description: 'AWS\'s terminal AI agent and shell autocomplete, successor to Amazon Q Developer CLI.',
    longDescription: 'Kiro CLI is the renamed and expanded Amazon Q Developer CLI. It adds an agentic chat that can read and write files and run commands, alongside the inline ghost-text completions for aws, git, npm, docker, and hundreds of other CLIs.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 1980,
    language: 'Rust',
    installCommand: 'curl -fsSL https://cli.kiro.dev/install | bash',
    platformCommands: {
      default: 'curl -fsSL https://cli.kiro.dev/install | bash',
      macos: 'brew install --cask kiro-cli',
      linux: 'curl -fsSL https://cli.kiro.dev/install | bash',
      notes: 'Sign in with AWS Builder ID or IAM Identity Center. No native Windows build; use WSL. The old `amazon-q` cask has been retired.'
    },
    repoUrl: 'https://github.com/aws/amazon-q-developer-cli',
    features: ['Agentic terminal chat', 'Inline ghost-text completions', 'MCP support', 'AWS-native auth'],
    tags: ['aws', 'cloud', 'productivity', 'autonomous'],
    useCases: ['Accelerating AWS deployments.', 'Learning complex CLI flags.', 'Faster terminal navigation.'],
    reviews: [],
    version: '2.32.0'
  },
  {
    id: 'gemini-cli',
    name: 'Gemini CLI',
    description: 'Terminal agent leveraging Google\'s 1M context window models.',
    longDescription: 'Gemini CLI is Google\'s open-source terminal agent. It brings Gemini models with a 1M-token context window to your shell, with built-in tools for file edits, shell commands, Google Search grounding, and MCP extensions.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 107381,
    language: 'TypeScript',
    installCommand: 'npm install -g @google/gemini-cli',
    platformCommands: {
      default: 'npm install -g @google/gemini-cli',
      windows: 'npm install -g @google/gemini-cli',
      macos: 'brew install gemini-cli',
      linux: 'brew install gemini-cli',
      notes: 'npm install requires Node.js 20+. Sign in with a Google account or set GEMINI_API_KEY.'
    },
    repoUrl: 'https://github.com/google-gemini/gemini-cli',
    features: ['1M Context support', 'Native Tool Integration', 'Google Cloud backend'],
    tags: ['google', 'sota', 'utility'],
    useCases: ['Analyzing massive documentation.', 'Fast coding queries.', 'Large-scale repo summarization.'],
    reviews: [],
    version: '0.64.0'
  },
  // --- 4.0 LOCAL FRAMEWORKS ---
  {
    id: 'ollama',
    name: 'Ollama',
    description: 'The industry standard for running open LLMs locally.',
    longDescription: 'Built on llama.cpp, it provides high-throughput performance with broad hardware acceleration across NVIDIA, Apple, and AMD GPUs.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 183094,
    language: 'Go',
    installCommand: 'curl -fsSL https://ollama.com/install.sh | sh',
    platformCommands: {
      default: 'curl -fsSL https://ollama.com/install.sh | sh',
      windows: 'winget install Ollama.Ollama',
      macos: 'brew install ollama',
      linux: 'curl -fsSL https://ollama.com/install.sh | sh',
      docker: 'docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama',
      notes: 'After install, run "ollama pull llama3.2" to download a model. GPU acceleration requires CUDA (NVIDIA) or ROCm (AMD) drivers.'
    },
    repoUrl: 'https://github.com/ollama/ollama',
    features: ['Hardware acceleration', 'Stable tool calling', 'REST API'],
    tags: ['local-llm', 'open-source', 'inference'],
    useCases: ['Private AI serving.', 'Local agent hosting.', 'Offline development.'],
    reviews: [],
    troubleshooting: [
      'Windows: If winget fails, download the installer directly from ollama.com/download/windows',
      'GPU not detected: Ensure CUDA drivers (NVIDIA) or ROCm (AMD) are installed. Check with "nvidia-smi" or "rocm-smi"',
      'Port 11434 in use: Stop existing Ollama or use "ollama serve" with a different port',
      'Model download fails: Check disk space (models are 4-8GB). Use "ollama pull <model>" to retry',
      'Slow performance: Ensure you\'re using a quantized model (Q4_K_M recommended for most GPUs)'
    ],
    version: '0.40.6'
  },
  {
    id: 'lm-studio',
    name: 'LM Studio',
    description: 'Polished desktop interface for managing local models.',
    longDescription: 'Offers the most accessible graphical interface for discovering and running models from Hugging Face with an OpenAI-compatible API server. The bundled `lms` CLI (open source) loads models, starts the server, and scripts LM Studio from the terminal.',
    category: AgentCategory.RESEARCH,
    stars: 5355,
    language: 'C++',
    installCommand: 'brew install --cask lm-studio',
    platformCommands: {
      default: 'brew install --cask lm-studio',
      windows: 'winget install ElementLabs.LMStudio',
      macos: 'brew install --cask lm-studio',
      notes: 'Download directly from lmstudio.ai for all platforms. The app is closed source; star count reflects the open-source `lms` CLI repository.'
    },
    repoUrl: 'https://github.com/lmstudio-ai/lms',
    features: ['Hugging Face integration', 'Visual parameter tuning', 'Local server'],
    tags: ['local-llm', 'gui', 'inference'],
    useCases: ['Visual model benchmarking.', 'Prototyping local agent flows.', 'Low-barrier entry to local AI.'],
    reviews: [],
    version: '0.4.26'
  },
  {
    id: 'localai',
    name: 'LocalAI',
    description: 'Drop-in open-source replacement for the OpenAI API.',
    longDescription: 'Supports text, image, and audio generation locally with production-ready tool calling and P2P distributed inference.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 49598,
    language: 'Go',
    installCommand: 'docker run -p 8080:8080 localai/localai',
    repoUrl: 'https://github.com/mudler/LocalAI',
    features: ['P2P Inference', 'Function calling', 'Multi-modal'],
    tags: ['local-llm', 'api', 'distributed'],
    useCases: ['Enterprise self-hosting.', 'Building tool-using agents locally.', 'Secure on-prem AI stacks.'],
    reviews: [],
    version: 'v4.11.0'
  },
  {
    id: 'llama-cpp',
    name: 'llama.cpp',
    description: 'C/C++ inference engine with a fast, scriptable CLI.',
    longDescription: 'A minimal, portable runtime for quantized LLMs with a CLI that supports chat, embeddings, and batch inference across CPU and GPU backends.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 130843,
    language: 'C++',
    installCommand: 'brew install llama.cpp',
    platformCommands: {
      default: 'brew install llama.cpp',
      windows: 'winget install llama.cpp',
      macos: 'brew install llama.cpp',
      linux: 'brew install llama.cpp',
      notes: 'Pre-built binaries are on the releases page. GPU builds: `cmake -B build -DGGML_CUDA=ON` (NVIDIA); Metal is on by default on Apple silicon.'
    },
    repoUrl: 'https://github.com/ggml-org/llama.cpp',
    features: ['Quantized inference', 'CPU/GPU backends', 'Embeddings CLI'],
    tags: ['local-llm', 'inference', 'foundational'],
    useCases: ['Local model benchmarking.', 'Embedding generation pipelines.', 'Offline inference on commodity hardware.'],
    reviews: [],
    version: '0.7.0'
  },
  {
    id: 'vllm',
    name: 'vLLM',
    description: 'High-throughput LLM serving with a fast CLI entrypoint.',
    longDescription: 'Optimized serving for large models using paged attention, exposing a CLI for launching OpenAI-compatible endpoints and batch inference workers.',
    category: AgentCategory.INFRASTRUCTURE,
    stars: 93849,
    language: 'Python',
    installCommand: 'pip install vllm',
    platformCommands: {
      default: 'pip install vllm',
      notes: 'Requires NVIDIA GPU with CUDA. Minimum 16GB VRAM recommended for most models.'
    },
    repoUrl: 'https://github.com/vllm-project/vllm',
    features: ['Paged attention', 'OpenAI-compatible API', 'Multi-GPU scaling'],
    tags: ['python', 'inference', 'api'],
    useCases: ['Self-hosted model serving.', 'Multi-GPU inference clusters.', 'Low-latency API deployments.'],
    reviews: [],
    version: '0.32.0'
  },
  {
    id: 'litellm',
    name: 'LiteLLM',
    description: 'CLI-friendly proxy to unify LLM providers under one API.',
    longDescription: 'Provides a lightweight CLI for starting a proxy that normalizes request/response formats across OpenAI, Azure, Anthropic, and local backends.',
    category: AgentCategory.INFRASTRUCTURE,
    stars: 61039,
    language: 'Python',
    installCommand: 'pip install litellm',
    platformCommands: {
      default: 'pip install litellm',
      docker: 'docker run -p 4000:4000 ghcr.io/berriai/litellm:main-latest',
      notes: 'Start proxy with "litellm --model gpt-4". Supports 100+ LLM providers.'
    },
    repoUrl: 'https://github.com/BerriAI/litellm',
    features: ['Provider normalization', 'Usage tracking', 'Proxy CLI'],
    tags: ['python', 'api', 'cloud'],
    useCases: ['Unified LLM routing.', 'Multi-provider failover.', 'Centralized usage governance.'],
    reviews: [],
    version: '1.106.0'
  },
  {
    id: 'jan',
    name: 'Jan',
    description: 'Privacy-focused offline ChatGPT alternative.',
    longDescription: 'A comprehensive, 100% offline AI chat experience powered by the Cortex engine for local device execution.',
    category: AgentCategory.RESEARCH,
    stars: 44978,
    language: 'TypeScript',
    installCommand: 'brew install --cask jan',
    platformCommands: {
      default: 'brew install --cask jan',
      windows: 'winget install Jan.Jan',
      macos: 'brew install --cask jan',
      linux: 'Download AppImage from jan.ai',
      notes: '100% offline. No data ever leaves your device.'
    },
    repoUrl: 'https://github.com/janhq/jan',
    features: ['Cortex Engine', '100% Offline', 'Extensions'],
    tags: ['privacy', 'offline', 'desktop'],
    useCases: ['Air-gapped AI chat.', 'Private document analysis.', 'Personal knowledge management.'],
    reviews: [],
    version: '0.8.6'
  },
  {
    id: 'llamafile',
    name: 'Llamafile',
    description: 'Single-executable distribution for Large Language Models.',
    longDescription: 'Mozilla-backed project that packages weights and inference engines into a single multi-platform executable file.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 26388,
    language: 'C++',
    installCommand: 'curl -LO https://huggingface.co/mozilla-ai/llamafile_0.10/resolve/main/Qwen3.5-0.8B-Q8_0.llamafile && chmod +x Qwen3.5-0.8B-Q8_0.llamafile && ./Qwen3.5-0.8B-Q8_0.llamafile',
    platformCommands: {
      default: 'curl -LO https://huggingface.co/mozilla-ai/llamafile_0.10/resolve/main/Qwen3.5-0.8B-Q8_0.llamafile && chmod +x Qwen3.5-0.8B-Q8_0.llamafile && ./Qwen3.5-0.8B-Q8_0.llamafile',
      windows: 'Download the .llamafile from Hugging Face, rename it to end in .exe, and run it',
      notes: 'Single file contains model + inference engine and runs on macOS, Linux, BSD, and Windows. On Windows, download the file, rename it to end in .exe, and run it.'
    },
    repoUrl: 'https://github.com/mozilla-ai/llamafile',
    features: ['Zero installation', 'Single-executable', 'Multi-platform'],
    tags: ['mozilla', 'foundational', 'portable'],
    useCases: ['Portable AI on thumb drives.', 'Simple model distribution.', 'Zero-dependency deployments.'],
    reviews: [],
    version: '0.10.6'
  },
  // --- 5.0 SPECIALIZED AUTOMATION ---
  {
    id: 'open-interpreter',
    name: 'Open Interpreter',
    description: 'Natural language interface for full system control.',
    longDescription: 'Executes code (Python, JS, Shell) locally with unrestricted internet and file access for general-purpose automation.',
    category: AgentCategory.AUTONOMOUS,
    stars: 52000,
    language: 'Python',
    installCommand: 'pip install open-interpreter',
    platformCommands: {
      default: 'pip install open-interpreter',
      notes: 'Requires Python 3.10+. Run with "interpreter" command. Use --safe-mode for restricted execution.'
    },
    repoUrl: 'https://github.com/OpenInterpreter/open-interpreter',
    features: ['OS Control', 'Local Execution', 'Vision support'],
    tags: ['automation', 'interpreter', 'local'],
    useCases: ['Complex desktop automation.', 'Programmatic file analysis.', 'Autonomous research.'],
    reviews: [],
    troubleshooting: [
      'Permission errors: Run terminal as administrator (Windows) or use sudo (Linux/macOS)',
      'Safe mode: Use "--safe-mode" flag to preview actions before execution',
      'Vision not working: Install with "pip install open-interpreter[vision]"'
    ],
    version: '0.4.3'
  },
  {
    id: 'shell-gpt',
    name: 'ShellGPT (sgpt)',
    description: 'Shell productivity tool for generating commands and snippets.',
    longDescription: 'Translates natural language into executable bash commands directly in the terminal. Optimized for shell productivity.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 12292,
    language: 'Python',
    installCommand: 'pip install shell-gpt',
    platformCommands: {
      default: 'pip install shell-gpt',
      notes: 'Set OPENAI_API_KEY environment variable. Use "sgpt" command after install.'
    },
    repoUrl: 'https://github.com/TheR1D/shell_gpt',
    features: ['REPL mode', 'Shell snippets', 'Custom functions'],
    tags: ['bash', 'productivity', 'snippets'],
    useCases: ['Translating intent to regex/ffmpeg.', 'Quick terminal lookup.', 'Interactive terminal chat.'],
    reviews: [],
    version: '1.5.1'
  },
  {
    id: 'aichat',
    name: 'aichat',
    description: 'Rust-based CLI chat assistant with configurable prompts.',
    longDescription: 'Supports multiple providers with session history, role presets, and templated prompts for repeatable terminal workflows.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 10496,
    language: 'Rust',
    installCommand: 'cargo install aichat',
    platformCommands: {
      default: 'cargo install aichat',
      windows: 'scoop install aichat',
      macos: 'brew install aichat',
      notes: 'Rust toolchain required for cargo install. Binaries available for Windows via scoop.'
    },
    repoUrl: 'https://github.com/sigoden/aichat',
    features: ['Multi-provider support', 'Prompt templates', 'Session history'],
    tags: ['rust', 'prompts', 'productivity'],
    useCases: ['Reusable terminal prompt workflows.', 'Fast Q&A during debugging.', 'Scriptable chat history review.'],
    reviews: [],
    version: '0.30.0'
  },
  {
    id: 'mods',
    name: 'Mods',
    description: 'Charmbracelet CLI for chatting with LLMs from the terminal.',
    longDescription: 'Offers a polished TUI for multi-turn chat, local history, and configurable providers with environment-based auth.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 4522,
    language: 'Go',
    installCommand: 'brew install mods',
    platformCommands: {
      default: 'brew install mods',
      windows: 'scoop install mods',
      macos: 'brew install mods',
      linux: 'go install github.com/charmbracelet/mods@latest',
      notes: 'From Charmbracelet team. Beautiful TUI interface.'
    },
    repoUrl: 'https://github.com/charmbracelet/mods',
    features: ['TUI mode', 'Configurable providers', 'Conversation logging'],
    tags: ['go', 'tui', 'utility'],
    useCases: ['Live terminal Q&A.', 'Prompted content drafting.', 'Summarizing logs in place.'],
    reviews: [],
    archived: true,
    version: '1.8.1'
  },
  {
    id: 'opencommit',
    name: 'OpenCommit',
    description: 'Git commit assistant that writes messages from staged diffs.',
    longDescription: 'Parses staged changes to produce structured commit messages, configurable with project templates and conventional commits.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 7539,
    language: 'TypeScript',
    installCommand: 'npm install -g opencommit',
    platformCommands: {
      default: 'npm install -g opencommit',
      notes: 'Run "oco" in a git repo with staged changes. Set up API key with "oco config".'
    },
    repoUrl: 'https://github.com/di-sukharev/opencommit',
    features: ['Conventional commits', 'Diff summarization', 'Template config'],
    tags: ['git', 'productivity', 'utility'],
    useCases: ['Consistent commit messages.', 'Faster code review prep.', 'Reducing manual commit writing.'],
    reviews: [],
    version: '3.3.11'
  },
  {
    id: 'gptcommit',
    name: 'GPTCommit',
    description: 'Automates Git commit messages using local diffs.',
    longDescription: 'Generates structured commit messages by reading staged diffs and supports configurable models and message templates.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 2419,
    language: 'Rust',
    installCommand: 'cargo install --locked gptcommit',
    platformCommands: {
      default: 'cargo install --locked gptcommit',
      macos: 'brew install zurawiki/brews/gptcommit',
      notes: 'Run `gptcommit install` inside a repository to add the prepare-commit-msg hook. Requires an OpenAI-compatible API key.'
    },
    repoUrl: 'https://github.com/zurawiki/gptcommit',
    features: ['Diff parsing', 'Template rules', 'Multiple model backends'],
    tags: ['git', 'productivity', 'utility'],
    useCases: ['Automated commit drafting.', 'Enforcing message conventions.', 'Reducing manual Git workflow time.'],
    reviews: [],
    version: '0.6.0'
  },
  {
    id: 'gptme',
    name: 'gptme',
    description: 'CLI agent that plans tasks and executes tool-based steps.',
    longDescription: 'Combines chat-driven planning with tool execution, enabling multi-step workflows such as refactors, investigations, and command orchestration.',
    category: AgentCategory.AUTONOMOUS,
    stars: 4448,
    language: 'Python',
    installCommand: 'pipx install gptme',
    platformCommands: {
      default: 'pipx install gptme',
      windows: 'pipx install gptme',
      notes: 'Requires Python 3.10+. `uv tool install gptme` also works. Supports local models and MCP out of the box.'
    },
    repoUrl: 'https://github.com/gptme/gptme',
    features: ['Tool execution', 'Plan/act loop', 'Workspace memory'],
    tags: ['python', 'autonomous', 'planning'],
    useCases: ['Multi-step codebase changes.', 'Automated troubleshooting.', 'Repeatable devops runbooks.'],
    reviews: [],
    version: '0.35.1'
  },
  {
    id: 'gpt-engineer',
    name: 'gpt-engineer',
    description: 'CLI for generating and refining full projects from specs.',
    longDescription: 'Turns prompts into structured project scaffolds, iterating with file-based feedback loops for coding workflows.',
    category: AgentCategory.CODING,
    stars: 55025,
    language: 'Python',
    installCommand: 'pip install gpt-engineer',
    platformCommands: {
      default: 'pip install gpt-engineer',
      notes: 'Run "gpte" with a project description. Iterates with feedback for refinement.'
    },
    repoUrl: 'https://github.com/AntonOsika/gpt-engineer',
    features: ['Project scaffolding', 'Iterative refinement', 'Spec-driven builds'],
    tags: ['python', 'coding', 'planning'],
    useCases: ['Rapid project bootstrapping.', 'Spec-driven prototypes.', 'Iterative codebase generation.'],
    reviews: [],
    archived: true,
    version: '0.3.1'
  },
  {
    id: 'gptscript',
    name: 'GPTScript',
    description: 'Natural language programming runtime with a CLI-first workflow.',
    longDescription: 'Defines tasks as scripts, executes tool-backed steps, and composes reusable task graphs with CLI automation.',
    category: AgentCategory.FRAMEWORK,
    stars: 3279,
    language: 'Go',
    installCommand: 'brew install gptscript',
    platformCommands: {
      default: 'brew install gptscript',
      windows: 'winget install gptscript-ai.gptscript',
      notes: 'Create .gpt files with natural language tasks. Run with "gptscript <file>.gpt". Note: the gptscript-ai GitHub org was archived in 2026 and get.gptscript.ai no longer resolves — install via brew/winget or a release binary instead of the old curl script.'
    },
    repoUrl: 'https://github.com/gptscript-ai/gptscript',
    features: ['Scripted agents', 'Tool orchestration', 'Reusable workflows'],
    tags: ['framework', 'automation', 'prompts'],
    useCases: ['Composable automation scripts.', 'Reusable agent workflows.', 'Multi-step CLI pipelines.'],
    reviews: [],
    archived: true,
    version: '0.9.9'
  },
  {
    id: 'fabric',
    name: 'Fabric',
    description: 'Framework for applying crowdsourced prompt patterns to terminal tasks.',
    longDescription: 'Organizes tested prompt patterns for high-quality technical extraction and summarization in the CLI.',
    category: AgentCategory.RESEARCH,
    stars: 44251,
    language: 'Go',
    installCommand: 'go install github.com/danielmiessler/fabric/cmd/fabric@latest',
    repoUrl: 'https://github.com/danielmiessler/Fabric',
    features: ['Pattern Library', 'Consistent outputs', 'Summarization'],
    tags: ['prompts', 'productivity', 'framework'],
    useCases: ['Technical transcription extraction.', 'Structured article summaries.', 'Pattern-based automation.'],
    reviews: [],
    platformCommands: {
      default: 'go install github.com/danielmiessler/fabric/cmd/fabric@latest',
      macos: 'brew install fabric-ai',
      linux: 'brew install fabric-ai',
      notes: 'Run the setup wizard (`--setup`) after installing to configure providers and download patterns.'
    },
    version: '1.4.525'
  },
  {
    id: 'ask-sh',
    name: 'ask.sh',
    description: 'Terminal assistant that reads/writes directly to the shell session.',
    longDescription: 'Eliminates copy-pasting by reading the terminal buffer to understand error context and injecting fixes directly.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 72,
    language: 'Rust',
    installCommand: 'cargo install ask-sh',
    platformCommands: {
      default: 'cargo install ask-sh',
      macos: 'cargo install ask-sh',
      linux: 'cargo install ask-sh',
      notes: 'Reads terminal buffer for context. No copy-paste needed. No Homebrew formula exists; install via cargo.'
    },
    repoUrl: 'https://github.com/combinatrix-ai/ask.sh',
    features: ['Buffer reading', 'Direct injection', 'Context awareness'],
    tags: ['rust', 'debugging', 'productivity'],
    useCases: ['Instant debugging of terminal errors.', 'Command auto-correction.', 'Fast tool navigation.'],
    reviews: [],
    version: '0.5.2'
  },
  {
    id: 'llm-cli',
    name: 'LLM (Simon Willison)',
    description: 'Swiss-army knife for prompting dozens of models from the CLI.',
    longDescription: 'A versatile utility for prompting and model interaction. Logs all interactions to SQLite for historical reference.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 12629,
    language: 'Python',
    installCommand: 'pip install llm',
    platformCommands: {
      default: 'pip install llm',
      notes: 'Extensible via plugins. Install plugins with "llm install llm-<plugin>". All prompts logged to SQLite.'
    },
    repoUrl: 'https://github.com/simonw/llm',
    features: ['Plugin system', 'SQLite logging', 'Multi-model support'],
    tags: ['python', 'logging', 'experimentation'],
    useCases: ['Benchmarking different prompts.', 'Scripting AI interactions.', 'Preserving conversation history.'],
    reviews: [],
    version: '0.36'
  },
  // --- 6.0 FOUNDATIONAL TOOLS ---
  {
    id: 'aws-cli',
    name: 'AWS CLI',
    description: 'Official tool for managing Amazon Web Services resources.',
    longDescription: 'The foundational command-line instrument for cloud management and infrastructure orchestration.',
    category: AgentCategory.INFRASTRUCTURE,
    stars: 17302,
    language: 'Python',
    installCommand: 'brew install awscli',
    platformCommands: {
      default: 'brew install awscli',
      windows: 'msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi',
      macos: 'brew install awscli',
      linux: 'curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && unzip awscliv2.zip && sudo ./aws/install',
      notes: 'Configure with "aws configure". Requires AWS access keys.'
    },
    repoUrl: 'https://github.com/aws/aws-cli',
    features: ['Comprehensive coverage', 'Automation ready', 'Consistent syntax'],
    tags: ['aws', 'cloud', 'foundational'],
    useCases: ['Infrastructure automation.', 'Managing S3/EC2 via scripts.', 'CI/CD pipeline integration.'],
    reviews: [],
    version: '2.38.1'
  },
  // --- 6.5 ENTERTAINMENT & LEISURE ---
  {
    id: 'newsboat',
    name: 'Newsboat',
    description: 'An extendable RSS feed reader for text terminals.',
    longDescription: 'Newsboat is an actively maintained fork of Newsbeuter, offering a lean and fast RSS/Atom reader with an integrated HTML renderer and powerful filtering capabilities.',
    category: AgentCategory.ENTERTAINMENT,
    stars: 3927,
    language: 'C++',
    installCommand: 'brew install newsboat',
    platformCommands: {
      default: 'brew install newsboat',
      linux: 'sudo apt install newsboat',
      macos: 'brew install newsboat',
      notes: 'Available on all major Linux distributions via native package managers (apt, dnf, pacman).'
    },
    repoUrl: 'https://github.com/newsboat/newsboat',
    features: ['Keyboard-driven interaction', 'OPML Import/Export', 'Query Feeds', 'Podcast support (Podboat)'],
    tags: ['terminal', 'rss', 'entertainment', 'open-source'],
    useCases: ['Distraction-free news consumption.', 'Automated feed filtering.', 'Offline article reading.'],
    reviews: [],
    version: '2.45'
  },
  {
    id: 'mal-cli',
    name: 'mal-cli',
    description: 'MyAnimeList client for the terminal.',
    longDescription: 'A high-performance terminal interface for the official MyAnimeList API, built with Rust and Ratatui for a smooth, keyboard-first anime tracking experience.',
    category: AgentCategory.ENTERTAINMENT,
    stars: 162,
    language: 'Rust',
    installCommand: 'cargo install mal-cli-rs',
    platformCommands: {
      default: 'cargo install mal-cli-rs',
      linux: 'yay -S mal-cli',
      notes: 'Requires a MyAnimeList API token for full synchronization.'
    },
    repoUrl: 'https://github.com/L4z3x/mal-cli',
    features: ['Ratatui TUI', 'Tokio async runtime', 'Inline image support', 'GPU rendering support'],
    tags: ['rust', 'anime', 'entertainment', 'tui'],
    useCases: ['Fast anime list management.', 'Browsing seasonal airings.', 'Quickly updating episode counts.'],
    reviews: [],
    version: '0.2.1'
  }

  ,
  // --- 7.0 BASELINE DEV CLIs (CREDIBILITY STAPLES) ---
  {
    id: 'github-cli',
    name: 'GitHub CLI (gh)',
    description: 'Official GitHub CLI for PRs, issues, releases, and workflows.',
    longDescription: 'GitHub CLI (gh) brings GitHub workflows into the terminal: create/view PRs, manage issues, run Actions workflows, and authenticate securely. It is a common baseline tool for modern GitHub-centric teams.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 46670,
    language: 'Go',
    installCommand: 'brew install gh',
    platformCommands: {
      default: 'brew install gh',
      windows: 'winget install GitHub.cli',
      macos: 'brew install gh',
      linux: 'sudo apt install gh',
      notes: 'Authenticate with `gh auth login` after install.'
    },
    repoUrl: 'https://github.com/cli/cli',
    features: ['PR/Issue management', 'GitHub Actions integration', 'Auth + tokens', 'Release tooling'],
    tags: ['git', 'github', 'official', 'productivity'],
    useCases: ['Create and review PRs from terminal.', 'Manage issues during triage.', 'Trigger and monitor GitHub Actions workflows.'],
    reviews: [],
    version: '2.102.0'
  },
  {
    id: 'gitlab-cli',
    name: 'GitLab CLI (glab)',
    description: 'GitLab CLI for merge requests, issues, pipelines, and releases.',
    longDescription: 'GitLab CLI (glab) is a practical terminal companion for GitLab workflows: create and review merge requests, manage issues, and interact with CI pipelines from the command line.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 1106,
    language: 'Go',
    installCommand: 'brew install glab',
    platformCommands: {
      default: 'brew install glab',
      windows: 'winget install GitLab.glab',
      macos: 'brew install glab',
      linux: 'sudo apt install glab',
      notes: 'Authenticate with `glab auth login` after install.'
    },
    repoUrl: 'https://gitlab.com/gitlab-org/cli',
    features: ['Merge request workflows', 'Issue management', 'Pipeline inspection', 'Release tooling'],
    tags: ['git', 'open-source', 'productivity'],
    useCases: ['Open and review merge requests quickly.', 'Check CI pipeline status in terminal.', 'Manage issues without leaving the CLI.'],
    reviews: [],
    version: '1.123.0'
  },
  {
    id: 'terraform',
    name: 'Terraform',
    description: 'Infrastructure as Code CLI for provisioning cloud resources.',
    longDescription: 'Terraform is a foundational IaC CLI for defining and provisioning infrastructure across cloud providers. It is often used alongside automation and agentic tooling for repeatable deployments.',
    category: AgentCategory.INFRASTRUCTURE,
    stars: 49891,
    language: 'Go',
    installCommand: 'brew tap hashicorp/tap && brew install hashicorp/tap/terraform',
    platformCommands: {
      default: 'brew tap hashicorp/tap && brew install hashicorp/tap/terraform',
      windows: 'winget install Hashicorp.Terraform',
      macos: 'brew tap hashicorp/tap && brew install hashicorp/tap/terraform',
      linux: 'wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg && echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list && sudo apt update && sudo apt install terraform',
      notes: 'Run `terraform -help` to verify; providers download on first use. `terraform` is not in default Ubuntu/Debian apt repos — the official HashiCorp apt repo must be added first.'
    },
    repoUrl: 'https://github.com/hashicorp/terraform',
    features: ['Multi-cloud provisioning', 'State management', 'Plan/apply workflows', 'Provider ecosystem'],
    tags: ['iac', 'cloud', 'automation'],
    useCases: ['Provision dev/staging/prod consistently.', 'Automate infrastructure changes in CI.', 'Codify infrastructure review via plans.'],
    reviews: [],
    version: 'v1.16.5'
  },
  {
    id: 'kubectl',
    name: 'kubectl',
    description: 'Official Kubernetes CLI for cluster management and debugging.',
    longDescription: 'kubectl is the standard CLI for interacting with Kubernetes clusters. It is a common baseline tool in modern infra stacks and pairs well with automation and AI-assisted troubleshooting.',
    category: AgentCategory.INFRASTRUCTURE,
    stars: 128234,
    language: 'Go',
    installCommand: 'brew install kubectl',
    platformCommands: {
      default: 'brew install kubectl',
      windows: 'winget install Kubernetes.kubectl',
      macos: 'brew install kubectl',
      linux: 'curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.33/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg && echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.33/deb/ /" | sudo tee /etc/apt/sources.list.d/kubernetes.list && sudo apt update && sudo apt install kubectl',
      notes: 'Use `kubectl version --client` to verify install. `kubectl` is not in default Ubuntu/Debian apt repos — add the pkgs.k8s.io community repo first.'
    },
    repoUrl: 'https://github.com/kubernetes/kubernetes',
    features: ['Cluster control', 'Resource inspection', 'Logs/exec debugging', 'Context switching'],
    tags: ['cloud', 'utility', 'official'],
    useCases: ['Debug workloads with logs and exec.', 'Inspect cluster resources quickly.', 'Operate clusters in CI/CD.'],
    reviews: [],
    version: 'v1.34.12'
  },

  // --- 8.0 ADDITIONAL CODING AGENTS (USER REQUESTED) ---
  {
    id: 'ra-aid',
    name: 'RA.Aid',
    description: 'Standalone coding agent built on LangGraph for multi-step development tasks.',
    longDescription: 'RA.Aid (pronounced "raid") helps with research, planning, and implementation of multi-step development tasks. It can optionally integrate with aider via the --use-aider flag.',
    category: AgentCategory.AUTONOMOUS,
    stars: 2223,
    language: 'Python',
    installCommand: 'pip install ra-aid',
    platformCommands: {
      default: 'pip install ra-aid',
      windows: 'pip install ra-aid',
      notes: 'Windows: you may also need `pip install pywin32`. See repo README for prerequisites and API key setup.'
    },
    repoUrl: 'https://github.com/ai-christianson/RA.Aid',
    features: ['LangGraph task execution', 'Research/plan/implement workflow', 'Optional aider integration'],
    tags: ['python', 'autonomous', 'planning'],
    useCases: ['Autonomous multi-step feature implementation.', 'Research-only investigations over a codebase.', 'Plan generation and guided execution.'],
    reviews: [],
    version: '0.30.2'
  },
  {
    id: 'qwen-code',
    name: 'Qwen Code',
    description: 'Open-source AI coding agent that lives in your terminal.',
    longDescription: 'Qwen Code is an open-source terminal agent optimized for Qwen3-Coder models. It supports interactive and headless usage and can connect to OpenAI-compatible APIs.',
    category: AgentCategory.CODING,
    stars: 28546,
    language: 'TypeScript',
    installCommand: 'npm install -g @qwen-code/qwen-code@latest',
    platformCommands: {
      default: 'npm install -g @qwen-code/qwen-code@latest',
      windows: 'irm https://qwen-code-assets.oss-cn-hangzhou.aliyuncs.com/installation/install-qwen-standalone.ps1 | iex',
      macos: 'brew install qwen-code',
      linux: 'brew install qwen-code',
      notes: 'npm install requires Node.js 22+. Start with `qwen` inside your project directory.'
    },
    repoUrl: 'https://github.com/QwenLM/qwen-code',
    features: ['Terminal-first agent', 'Headless mode for scripts/CI', 'OpenAI-compatible providers'],
    tags: ['terminal', 'open-source', 'coding'],
    useCases: ['Large codebase Q&A from the terminal.', 'Headless automation in CI.', 'Interactive refactors with approvals.'],
    reviews: [],
    version: '0.25.2'
  },
  {
    id: 'crush',
    name: 'Crush',
    description: 'Charmbracelet AI coding agent for your favourite terminal.',
    longDescription: 'Crush is a terminal coding agent with multi-model support, session workflows, and extensibility via MCP servers (stdio/http/sse).',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 28632,
    language: 'Go',
    installCommand: 'npm install -g @charmland/crush',
    platformCommands: {
      default: 'npm install -g @charmland/crush',
      windows: 'winget install charmbracelet.crush',
      macos: 'brew install charmbracelet/tap/crush',
      linux: 'brew install charmbracelet/tap/crush',
      notes: 'Also supports MCP servers and LSP integrations. See repo docs for config.'
    },
    repoUrl: 'https://github.com/charmbracelet/crush',
    features: ['Multi-model support', 'MCP extensibility', 'Terminal UI sessions'],
    tags: ['tui', 'terminal', 'go'],
    useCases: ['Interactive coding assistance in terminal.', 'Project sessions with context.', 'Extending tools via MCP servers.'],
    reviews: [],
    version: '0.98.1'
  },
  {
    id: 'cloudflare-vibesdk',
    name: 'Cloudflare VibeSDK',
    description: 'Open-source vibe coding platform and reference implementation on Cloudflare.',
    longDescription: 'Cloudflare VibeSDK is an open-source full-stack AI webapp generator built on Cloudflare Workers + Durable Objects, with sandboxed previews and optional GitHub export flows.',
    category: AgentCategory.FRAMEWORK,
    stars: 5411,
    language: 'TypeScript',
    installCommand: 'npm install @cf-vibesdk/sdk',
    platformCommands: {
      default: 'npm install @cf-vibesdk/sdk',
      windows: 'npm install @cf-vibesdk/sdk',
      notes: 'This installs the SDK; the platform itself is deployed via Cloudflare (see repo for setup/deploy).'
    },
    repoUrl: 'https://github.com/cloudflare/vibesdk',
    features: ['Full-stack vibe coding platform', 'Sandboxed previews', 'TypeScript SDK'],
    tags: ['cloud', 'framework', 'api'],
    useCases: ['Run your own vibe-coding platform.', 'Programmatic access via TS SDK.', 'Deploy on Cloudflare infrastructure.'],
    reviews: [],
    version: 'v1.5.0'
  },
  {
    id: 'vibekit',
    name: 'VibeKit',
    description: 'Security/sandbox layer for running coding agents locally.',
    longDescription: 'VibeKit runs coding agents in isolated environments with redaction and observability. It aims to reduce risk when executing agent-generated code.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 1864,
    language: 'TypeScript',
    installCommand: 'npm install -g vibekit',
    platformCommands: {
      default: 'npm install -g vibekit',
      windows: 'npm install -g vibekit',
      notes: 'Uses Docker for local sandboxing. See repo docs for setup.'
    },
    repoUrl: 'https://github.com/superagent-ai/vibekit',
    features: ['Local sandbox execution', 'Built-in redaction', 'Observability tooling'],
    tags: ['security', 'sandbox', 'open-source'],
    useCases: ['Run agent outputs safely in containers.', 'Redact secrets during agent runs.', 'Instrument agent execution with logs/traces.'],
    reviews: [],
    version: '0.0.4'
  },
  {
    id: 'mistral-vibe',
    name: 'Mistral Vibe',
    description: 'Mistral\'s open-source CLI coding assistant.',
    longDescription: 'Mistral Vibe is a command-line coding assistant with a tool-based workflow for reading/writing files, searching code, and running commands, with safety prompts for tool approval.',
    category: AgentCategory.CODING,
    stars: 5132,
    language: 'Python',
    installCommand: 'uv tool install mistral-vibe',
    platformCommands: {
      default: 'uv tool install mistral-vibe',
      windows: 'uv tool install mistral-vibe',
      macos: 'curl -LsSf https://mistral.ai/vibe/install.sh | bash',
      linux: 'curl -LsSf https://mistral.ai/vibe/install.sh | bash',
      notes: '`pip install mistral-vibe` also works. Vibe asks before trusting folders that contain a `.vibe` directory.'
    },
    repoUrl: 'https://github.com/mistralai/mistral-vibe',
    features: ['Tool-based coding workflow', 'Project-aware context', 'Safety prompts for execution'],
    tags: ['python', 'open-source', 'coding'],
    useCases: ['Interactive refactors and debugging.', 'Non-interactive scripting via prompt mode.', 'Project-aware codebase exploration.'],
    reviews: [],
    version: '2.26.1'
  },
  {
    id: 'deepcode-hkuds',
    name: 'DeepCode',
    description: 'Open agentic coding system with multi-agent workflow and MCP integration.',
    longDescription: 'DeepCode is a multi-agent coding system that supports research-to-code workflows, with CLI and web interfaces and optional MCP server integrations for tooling.',
    category: AgentCategory.AUTONOMOUS,
    stars: 16716,
    language: 'Python',
    installCommand: 'uv tool install --python 3.12 deepcode-hku',
    platformCommands: {
      default: 'uv tool install --python 3.12 deepcode-hku',
      windows: 'uv tool install --python 3.12 deepcode-hku',
      notes: 'Requires provider API keys (see repo Quick Start). On Windows, install uv first with `winget install --id astral-sh.uv --exact`.'
    },
    repoUrl: 'https://github.com/HKUDS/DeepCode',
    features: ['Multi-agent orchestration', 'CLI and web UI', 'MCP tool integrations'],
    tags: ['python', 'autonomous', 'complex-tasks'],
    useCases: ['Paper-to-code reproduction workflows.', 'Long-running multi-step implementations.', 'Tool-augmented coding via MCP servers.'],
    reviews: [],
    version: '2.3.1'
  },
  {
    id: 'gentleman-guardian-angel',
    name: 'Gentleman Guardian Angel (gga)',
    description: 'Provider-agnostic AI code review as a git hook (pure Bash).',
    longDescription: 'Runs on every commit and reviews staged files against your project rules (e.g., AGENTS.md). Works with multiple provider CLIs (Claude, Gemini, Codex, OpenCode, Ollama, etc.).',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 1182,
    language: 'Shell',
    installCommand: 'brew install gentleman-programming/tap/gga',
    platformCommands: {
      default: 'brew install gentleman-programming/tap/gga',
      notes: 'Also supports manual install via git clone + ./install.sh. Requires a provider CLI available on PATH.'
    },
    repoUrl: 'https://github.com/Gentleman-Programming/gentleman-guardian-angel',
    features: ['Git hook integration', 'Provider-agnostic', 'Strict pass/fail mode'],
    tags: ['git', 'automation', 'security'],
    useCases: ['Enforce coding standards on every commit.', 'Block commits that violate rules.', 'Run lightweight AI review in CI.'],
    reviews: [],
    version: 'v2.8.1'
  },
  {
    id: 'grok-cli',
    name: 'Grok CLI',
    description: 'Open-source terminal coding assistant with tool usage and MCP support.',
    longDescription: 'Grok CLI provides an interactive and headless terminal agent with file operations, command execution, and optional MCP server integrations.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 3490,
    language: 'TypeScript',
    installCommand: 'curl -fsSL https://raw.githubusercontent.com/superagent-ai/grok-cli/main/install.sh | bash',
    platformCommands: {
      default: 'curl -fsSL https://raw.githubusercontent.com/superagent-ai/grok-cli/main/install.sh | bash',
      windows: 'bun add -g grok-dev',
      notes: 'Alternative (requires Bun): `bun add -g grok-dev`. Needs an xAI API key. The old `@vibe-kit/grok-cli` npm package is no longer updated.'
    },
    repoUrl: 'https://github.com/superagent-ai/grok-cli',
    features: ['Interactive terminal UI', 'Headless mode for scripts', 'MCP extensibility'],
    tags: ['terminal', 'open-source', 'coding'],
    useCases: ['Terminal-based coding assistance.', 'Automation via headless prompts.', 'Extending the agent with MCP tools.'],
    reviews: [],
    version: 'latest'
  },
  // --- 9.0 MUSIC & AUDIO ---
  {
    id: 'cmus',
    name: 'cmus',
    description: 'Small, fast and powerful console music player.',
    longDescription: 'cmus (C* Music Player) is a lightweight, fast, and powerful ncurses-based music player. It supports a wide range of audio formats and is designed to run on Unix-like operating systems.',
    category: AgentCategory.MUSIC,
    stars: 6266,
    language: 'C',
    installCommand: 'brew install cmus',
    platformCommands: {
      default: 'brew install cmus',
      linux: 'sudo apt install cmus',
      macos: 'brew install cmus',
      notes: 'Launch with `cmus`. use keys 1-7 to change views.'
    },
    repoUrl: 'https://github.com/cmus/cmus',
    features: ['Gapless playback', 'Vi-style keybindings', 'Playlist management', 'Queue support'],
    tags: ['terminal', 'music', 'entertainment', 'c'],
    useCases: ['Lightweight music playback.', 'Headless jukebox.', 'Distraction-free listening.'],
    reviews: [],
    version: '2.12.0'
  },
  {
    id: 'beets',
    name: 'beets',
    description: 'The ultimate music library management system.',
    longDescription: 'Beets is a powerful command-line tool for managing your music library. It catalogs your collection, automatically improving metadata using the MusicBrainz database.',
    category: AgentCategory.MUSIC,
    stars: 15770,
    language: 'Python',
    installCommand: 'pip install beets',
    platformCommands: {
      default: 'pip install beets',
      notes: 'Requires Python. Run `beet import <path>` to organize music.'
    },
    repoUrl: 'https://github.com/beetbox/beets',
    features: ['Auto-tagging', 'Plugin system', 'Album art fetcher', 'Duplicate detection'],
    tags: ['python', 'music', 'organization', 'automation'],
    useCases: ['Fixing messy music tags.', 'Organizing folder structures.', 'Fetching album art automatically.'],
    reviews: [],
    version: '2.14.1'
  },
  {
    id: 'ncmpcpp',
    name: 'ncmpcpp',
    description: 'Featureful ncurses Music Player Daemon (MPD) client.',
    longDescription: 'ncmpcpp is a highly customizable and powerful MPD client for the terminal. It features a tag editor, playlist editor, visualizer, and fetching of lyrics/artist info.',
    category: AgentCategory.MUSIC,
    stars: 2498,
    language: 'C++',
    installCommand: 'brew install ncmpcpp',
    platformCommands: {
      default: 'brew install ncmpcpp',
      linux: 'sudo apt install ncmpcpp',
      macos: 'brew install ncmpcpp',
      notes: 'Requires a running MPD server. Connects to localhost:6600 by default.'
    },
    repoUrl: 'https://github.com/ncmpcpp/ncmpcpp',
    features: ['Visualizer', 'Tag editor', 'Lyrics fetcher', 'Library browser'],
    tags: ['terminal', 'music', 'tui', 'c++'],
    useCases: ['Advanced MPD control.', 'Visualizing audio in terminal.', 'Managing massive libraries.'],
    reviews: [],
    version: '0.10.1'
  },
  {
    id: 'spotatui',
    name: 'spotatui',
    description: 'Spotify client for the terminal.',
    longDescription: 'A Spotify client for the terminal written in Rust. It utilizes the Spotify Web API to control playback and browse your library directly from the command line.',
    category: AgentCategory.MUSIC,
    stars: 1533,
    language: 'Rust',
    installCommand: 'cargo install spotatui',
    platformCommands: {
      default: 'cargo install spotatui',
      notes: 'Requires Spotify Premium for playback control. Need to setup API keys.'
    },
    repoUrl: 'https://github.com/LargeModGames/spotatui',
    features: ['Spotify Connect', 'Library browsing', 'Playback control', 'TUI interface'],
    tags: ['rust', 'music', 'spotify', 'tui'],
    useCases: ['Controlling Spotify from terminal.', 'Lightweight Spotify interface.', 'Browsing playlists without GUI.'],
    reviews: [],
    version: '0.46.0'
  },
  // --- 10.0 VIDEO & STREAMING ---
  {
    id: 'yt-dlp',
    name: 'yt-dlp',
    description: 'Feature-rich command-line video downloader.',
    longDescription: 'yt-dlp is a fork of youtube-dl with additional features and fixes. It downloads videos from YouTube and hundreds of other sites, with advanced format selection and filtering.',
    category: AgentCategory.VIDEO,
    stars: 199017,
    language: 'Python',
    installCommand: 'pip install yt-dlp',
    platformCommands: {
      default: 'pip install yt-dlp',
      linux: 'sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && sudo chmod a+rx /usr/local/bin/yt-dlp',
      macos: 'brew install yt-dlp',
      windows: 'winget install yt-dlp',
      notes: 'Frequently updated. keeping it up-to-date is recommended for site compatibility.'
    },
    repoUrl: 'https://github.com/yt-dlp/yt-dlp',
    features: ['SponsorBlock integration', 'Format selection', 'Playlist downloading', 'Metadata extraction'],
    tags: ['python', 'video', 'automation', 'utility'],
    useCases: ['Archiving YouTube channels.', 'Downloading educational videos.', 'Extracting audio from video clips.'],
    reviews: [],
    version: '2026.8.19'
  },
  {
    id: 'mpv',
    name: 'mpv',
    description: 'Command line media player.',
    longDescription: 'mpv is a free, open source, and cross-platform media player. It supports a wide variety of video file formats, audio and video codecs, and subtitle types.',
    category: AgentCategory.VIDEO,
    stars: 37305,
    language: 'C',
    installCommand: 'brew install mpv',
    platformCommands: {
      default: 'brew install mpv',
      linux: 'sudo apt install mpv',
      macos: 'brew install mpv',
      windows: 'winget install mpv',
      notes: 'Highly scriptable via Lua. Can play streams directly from yt-dlp.'
    },
    repoUrl: 'https://github.com/mpv-player/mpv',
    features: ['GPU video decoding', 'High quality scaling', 'Scriptable (Lua)', 'On-screen controller'],
    tags: ['c', 'video', 'entertainment', 'player'],
    useCases: ['Playing local video files.', 'Streaming network video.', 'Minimalist video playback.'],
    reviews: [],
    version: '0.41.0'
  },
  {
    id: 'streamlink',
    name: 'streamlink',
    description: 'CLI for extracting streams to a video player.',
    longDescription: 'Streamlink is a CLI utility which pipes video streams from various services into a video player, such as VLC or mpv, allowing you to avoid buggy/heavy web players.',
    category: AgentCategory.VIDEO,
    stars: 11840,
    language: 'Python',
    installCommand: 'pip install streamlink',
    platformCommands: {
      default: 'pip install streamlink',
      macos: 'brew install streamlink',
      notes: 'Works best with mpv or VLC installed.'
    },
    repoUrl: 'https://github.com/streamlink/streamlink',
    features: ['Plugin system', 'Player piping', 'HLS/DASH support', 'Low latency'],
    tags: ['python', 'video', 'streaming', 'utility'],
    useCases: ['Watching Twitch/YouTube in VLC.', 'Recording live streams.', 'Bypassing browser-based players.'],
    reviews: [],
    version: '8.6.2'
  },

  // ============================================================================
  // --- 11.0 FILE MANAGERS ---
  // ============================================================================
  {
    id: 'ranger',
    name: 'ranger',
    description: 'A console file manager with VI key bindings.',
    longDescription: 'Ranger is a console-based file manager that features a VI-style interface, file previews for many formats, and a customizable command system for power users.',
    category: AgentCategory.FILE_MANAGER,
    stars: 17423,
    language: 'Python',
    installCommand: 'pip install ranger-fm',
    platformCommands: {
      default: 'pip install ranger-fm',
      linux: 'sudo apt install ranger',
      macos: 'brew install ranger',
      notes: 'Install optional: highlight (syntax), w3m (images), atool (archives).'
    },
    repoUrl: 'https://github.com/ranger/ranger',
    features: ['VI keybindings', 'File previews', 'Multi-pane navigation', 'Extensible plugins'],
    tags: ['terminal', 'python', 'productivity', 'open-source'],
    useCases: ['Keyboard-first file navigation.', 'Previewing files without opening.', 'Batch file operations.'],
    reviews: [],
    version: '1.9.4'
  },
  {
    id: 'nnn',
    name: 'nnn',
    description: 'Blazing fast terminal file browser with disk usage analyzer.',
    longDescription: 'nnn is a tiny, nearly 0-config file manager with excellent keyboard shortcuts, built-in disk usage, and extensive plugin system for extending functionality.',
    category: AgentCategory.FILE_MANAGER,
    stars: 22086,
    language: 'C',
    installCommand: 'brew install nnn',
    platformCommands: {
      default: 'brew install nnn',
      linux: 'sudo apt install nnn',
      macos: 'brew install nnn',
      windows: 'scoop install nnn',
      notes: 'Launch with `nnn`. Press `?` for help.'
    },
    repoUrl: 'https://github.com/jarun/nnn',
    features: ['Disk usage analysis', 'Fuzzy search', 'Plugin system', 'Desktop integration'],
    tags: ['terminal', 'c', 'productivity', 'open-source'],
    useCases: ['Fast directory navigation.', 'Analyzing disk usage.', 'File operations with plugins.'],
    reviews: [],
    version: '5.3'
  },
  {
    id: 'yazi',
    name: 'yazi',
    description: 'Blazing fast terminal file manager written in Rust.',
    longDescription: 'Yazi is an async terminal file manager with image preview support, bulk renaming, and incredible speed powered by Rust and Tokio.',
    category: AgentCategory.FILE_MANAGER,
    stars: 42738,
    language: 'Rust',
    installCommand: 'cargo install yazi-fm',
    platformCommands: {
      default: 'cargo install yazi-fm',
      linux: 'cargo install yazi-fm',
      macos: 'brew install yazi',
      windows: 'scoop install yazi',
      notes: 'Supports image previews with ueberzugpp or kitty terminal.'
    },
    repoUrl: 'https://github.com/sxyazi/yazi',
    features: ['Async I/O', 'Image preview', 'Bulk rename', 'Lua plugins'],
    tags: ['rust', 'terminal', 'productivity', 'open-source'],
    useCases: ['Ultra-fast file browsing.', 'Image previews in terminal.', 'Customizable workflows.'],
    reviews: [],
    version: '26.5.6'
  },
  {
    id: 'lf',
    name: 'lf',
    description: 'Terminal file manager written in Go.',
    longDescription: 'lf (list files) is a highly customizable terminal file manager inspired by ranger, designed to be fast and minimal while remaining user-friendly.',
    category: AgentCategory.FILE_MANAGER,
    stars: 9550,
    language: 'Go',
    installCommand: 'brew install lf',
    platformCommands: {
      default: 'brew install lf',
      linux: 'sudo apt install lf',
      macos: 'brew install lf',
      windows: 'scoop install lf',
      notes: 'Single binary. Config in ~/.config/lf/lfrc'
    },
    repoUrl: 'https://github.com/gokcehan/lf',
    features: ['Async file operations', 'Custom commands', 'Previewer support', 'Cross-platform'],
    tags: ['go', 'terminal', 'productivity', 'open-source'],
    useCases: ['Configurable file management.', 'Integration with shell scripts.', 'Cross-platform workflow.'],
    reviews: [],
    version: '42'
  },

  // ============================================================================
  // --- 12.0 SEARCH TOOLS ---
  // ============================================================================
  {
    id: 'fzf',
    name: 'fzf',
    description: 'A command-line fuzzy finder.',
    longDescription: 'fzf is an interactive Unix filter for command-line that can be used with any list: files, processes, command history, bookmarks, git commits, and more.',
    category: AgentCategory.SEARCH,
    stars: 83582,
    language: 'Go',
    installCommand: 'brew install fzf',
    platformCommands: {
      default: 'brew install fzf',
      linux: 'sudo apt install fzf',
      macos: 'brew install fzf',
      windows: 'scoop install fzf',
      notes: 'Run `$(brew --prefix)/opt/fzf/install` to install shell integrations.'
    },
    repoUrl: 'https://github.com/junegunn/fzf',
    features: ['Fuzzy search', 'Shell integration', 'Vim plugin', 'Preview pane'],
    tags: ['go', 'terminal', 'productivity', 'open-source'],
    useCases: ['Fast file navigation.', 'Command history search.', 'Interactive git operations.'],
    reviews: [],
    version: '0.74.5'
  },
  {
    id: 'ripgrep',
    name: 'ripgrep',
    description: 'Recursively searches directories for a regex pattern.',
    longDescription: 'ripgrep is line-oriented search tool that recursively searches your current directory for a regex pattern. It respects your .gitignore and is incredibly fast.',
    category: AgentCategory.SEARCH,
    stars: 69147,
    language: 'Rust',
    installCommand: 'brew install ripgrep',
    platformCommands: {
      default: 'brew install ripgrep',
      linux: 'sudo apt install ripgrep',
      macos: 'brew install ripgrep',
      windows: 'scoop install ripgrep',
      notes: 'Run with `rg <pattern>`. Faster than grep, ag, and ack.'
    },
    repoUrl: 'https://github.com/BurntSushi/ripgrep',
    features: ['Multi-threaded', 'Respects gitignore', 'Regex support', 'File type filtering'],
    tags: ['rust', 'terminal', 'productivity', 'open-source'],
    useCases: ['Fast code search.', 'Finding patterns in large codebases.', 'CI/CD log scanning.'],
    reviews: [],
    version: '15.2.0'
  },
  {
    id: 'fd',
    name: 'fd',
    description: 'A simple, fast and user-friendly alternative to find.',
    longDescription: 'fd is a simple, fast, and user-friendly alternative to the classic find command. It has intuitive syntax, colorized output, and respects .gitignore.',
    category: AgentCategory.SEARCH,
    stars: 44773,
    language: 'Rust',
    installCommand: 'brew install fd',
    platformCommands: {
      default: 'brew install fd',
      linux: 'sudo apt install fd-find',
      macos: 'brew install fd',
      windows: 'scoop install fd',
      notes: 'On Ubuntu/Debian the command is `fdfind` due to name conflict.'
    },
    repoUrl: 'https://github.com/sharkdp/fd',
    features: ['Intuitive syntax', 'Colorized output', 'Smart case', 'Parallel execution'],
    tags: ['rust', 'terminal', 'productivity', 'open-source'],
    useCases: ['Finding files by name.', 'Batch file processing.', 'Replacing complex find commands.'],
    reviews: [],
    version: '10.5.0'
  },
  {
    id: 'zoxide',
    name: 'zoxide',
    description: 'A smarter cd command that learns your habits.',
    longDescription: 'Zoxide is a smarter cd command that tracks your most-used directories and lets you jump to them with partial matching. Inspired by z and autojump.',
    category: AgentCategory.SEARCH,
    stars: 40012,
    language: 'Rust',
    installCommand: 'brew install zoxide',
    platformCommands: {
      default: 'brew install zoxide',
      linux: 'curl -sSfL https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh | sh',
      macos: 'brew install zoxide',
      windows: 'scoop install zoxide',
      notes: 'Add `eval "$(zoxide init zsh)"` to your shell rc file.'
    },
    repoUrl: 'https://github.com/ajeetdsouza/zoxide',
    features: ['Frecency ranking', 'Fuzzy matching', 'Shell integration', 'Cross-shell support'],
    tags: ['rust', 'terminal', 'productivity', 'open-source'],
    useCases: ['Jumping to frequently used dirs.', 'Faster navigation.', 'Cross-platform directory hopping.'],
    reviews: [],
    version: '0.10.0'
  },

  // ============================================================================
  // --- 13.0 SHELL UTILITIES ---
  // ============================================================================
  {
    id: 'dust',
    name: 'dust',
    description: 'A more intuitive version of du written in Rust.',
    longDescription: 'dust provides a user-friendly alternative to du for analyzing disk usage. It shows a visual breakdown of space usage in a directory tree.',
    category: AgentCategory.SHELL_UTILITY,
    stars: 12477,
    language: 'Rust',
    installCommand: 'brew install dust',
    platformCommands: {
      default: 'brew install dust',
      linux: 'cargo install du-dust',
      macos: 'brew install dust',
      windows: 'scoop install dust',
      notes: 'Run `dust` in any directory to see space usage breakdown.'
    },
    repoUrl: 'https://github.com/bootandy/dust',
    features: ['Visual bars', 'Colored output', 'Fast traversal', 'Ignore hidden files'],
    tags: ['rust', 'terminal', 'utility', 'open-source'],
    useCases: ['Finding large files/folders.', 'Disk space analysis.', 'Cleaning up storage.'],
    reviews: [],
    version: '1.2.6'
  },
  {
    id: 'duf',
    name: 'duf',
    description: 'A better df alternative with colorful output.',
    longDescription: 'duf is a Disk Usage/Free utility with better output than df. It shows all mounted filesystems with colored progress bars and human-readable sizes.',
    category: AgentCategory.SHELL_UTILITY,
    stars: 15334,
    language: 'Go',
    installCommand: 'brew install duf',
    platformCommands: {
      default: 'brew install duf',
      linux: 'sudo apt install duf',
      macos: 'brew install duf',
      windows: 'scoop install duf',
      notes: 'Just run `duf` to see all mounted filesystems.'
    },
    repoUrl: 'https://github.com/muesli/duf',
    features: ['Colorful output', 'Human readable', 'JSON output', 'Theme support'],
    tags: ['go', 'terminal', 'utility', 'open-source'],
    useCases: ['Checking disk space.', 'Monitoring mounted devices.', 'System administration.'],
    reviews: [],
    version: '0.9.1'
  },
  {
    id: 'tldr',
    name: 'tldr',
    description: 'Simplified and community-driven man pages.',
    longDescription: 'tldr provides simplified, practical examples for command-line tools. Instead of reading long man pages, get practical examples in seconds.',
    category: AgentCategory.SHELL_UTILITY,
    stars: 63942,
    language: 'Multiple',
    installCommand: 'npm install -g tldr',
    platformCommands: {
      default: 'npm install -g tldr',
      linux: 'pip install tldr',
      macos: 'brew install tlrc',
      windows: 'npm install -g tldr',
      notes: 'Run `tldr <command>` to get quick examples. Update cache with `tldr --update`. Homebrew formula `tldr` is deprecated; use `tlrc` (the Rust client) on macOS instead.'
    },
    repoUrl: 'https://github.com/tldr-pages/tldr',
    features: ['Practical examples', 'Community maintained', 'Offline mode', 'Multi-language'],
    tags: ['terminal', 'productivity', 'documentation', 'open-source'],
    useCases: ['Quick command reference.', 'Learning CLI tools.', 'Faster than man pages.'],
    reviews: [],
    version: '3.5.0'
  },
  {
    id: 'thefuck',
    name: 'The Fuck',
    description: 'Corrects your previous console command.',
    longDescription: 'The Fuck is a magnificent app that corrects errors in previous console commands. Type "fuck" to get a corrected command suggestion.',
    category: AgentCategory.SHELL_UTILITY,
    stars: 97883,
    language: 'Python',
    installCommand: 'pip install thefuck',
    platformCommands: {
      default: 'pip install thefuck',
      linux: 'pip install thefuck',
      macos: 'brew install thefuck',
      windows: 'pip install thefuck',
      notes: 'Add `eval $(thefuck --alias)` to your shell rc. Alias is customizable.'
    },
    repoUrl: 'https://github.com/nvbn/thefuck',
    features: ['Typo correction', 'Git shortcuts', 'Package manager fixes', 'Extensible rules'],
    tags: ['python', 'terminal', 'productivity', 'open-source'],
    useCases: ['Fixing typos quickly.', 'Correcting sudo mistakes.', 'Git command shortcuts.'],
    reviews: [],
    version: '3.32'
  },
  {
    id: 'starship',
    name: 'starship',
    description: 'Minimal, blazing-fast shell prompt for any shell.',
    longDescription: 'Starship is a minimal, highly customizable prompt for any shell. It shows the information you need while staying fast and unobtrusive.',
    category: AgentCategory.THEMING,
    stars: 60227,
    language: 'Rust',
    installCommand: 'brew install starship',
    platformCommands: {
      default: 'brew install starship',
      linux: 'curl -sS https://starship.rs/install.sh | sh',
      macos: 'brew install starship',
      windows: 'scoop install starship',
      notes: 'Add `eval "$(starship init zsh)"` to your shell rc file.'
    },
    repoUrl: 'https://github.com/starship/starship',
    features: ['Cross-shell', 'Git status', 'Language versions', 'Custom modules'],
    tags: ['rust', 'terminal', 'theming', 'open-source'],
    useCases: ['Beautiful shell prompts.', 'Displaying project/env info.', 'Consistent prompts across shells.'],
    reviews: [],
    version: '1.27.0'
  },

  // ============================================================================
  // --- 14.0 HTTP CLIENTS ---
  // ============================================================================
  {
    id: 'httpie',
    name: 'HTTPie',
    description: 'A user-friendly command-line HTTP client.',
    longDescription: 'HTTPie is a user-friendly HTTP client for the API era with JSON support, syntax highlighting, persistent sessions, and an intuitive syntax.',
    category: AgentCategory.HTTP_CLIENT,
    stars: 38657,
    language: 'Python',
    installCommand: 'pip install httpie',
    platformCommands: {
      default: 'pip install httpie',
      linux: 'pip install httpie',
      macos: 'brew install httpie',
      windows: 'pip install httpie',
      notes: 'Use `http` for colorful output or `https` for SSL. Supports plugins.'
    },
    repoUrl: 'https://github.com/httpie/cli',
    features: ['Syntax highlighting', 'JSON support', 'Sessions', 'Form and file uploads'],
    tags: ['python', 'api', 'productivity', 'open-source'],
    useCases: ['Testing APIs.', 'Debugging HTTP requests.', 'Interactive API exploration.'],
    reviews: [],
    version: '3.2.4'
  },
  {
    id: 'curlie',
    name: 'curlie',
    description: 'The power of curl with the ease of HTTPie.',
    longDescription: 'curlie is a frontend for curl that brings the ease of use of HTTPie without changing the syntax. It adds syntax highlighting and formatted output to curl.',
    category: AgentCategory.HTTP_CLIENT,
    stars: 3731,
    language: 'Go',
    installCommand: 'brew install curlie',
    platformCommands: {
      default: 'brew install curlie',
      linux: 'go install github.com/rs/curlie@latest',
      macos: 'brew install curlie',
      windows: 'scoop install curlie',
      notes: 'Use curlie exactly like curl but get colorized output.'
    },
    repoUrl: 'https://github.com/rs/curlie',
    features: ['curl compatibility', 'Syntax highlighting', 'Formatted output', 'All curl options'],
    tags: ['go', 'api', 'productivity', 'open-source'],
    useCases: ['Better curl output.', 'API testing.', 'Keeping curl muscle memory.'],
    reviews: [],
    version: '1.8.2'
  },

  // ============================================================================
  // --- 15.0 DATABASE CLIENTS ---
  // ============================================================================
  {
    id: 'mycli',
    name: 'mycli',
    description: 'A MySQL client with auto-completion and syntax highlighting.',
    longDescription: 'mycli is a terminal client for MySQL with auto-completion and syntax highlighting. It supports multi-line mode, table output, and vim editing mode.',
    category: AgentCategory.DATABASE,
    stars: 11981,
    language: 'Python',
    installCommand: 'pip install mycli',
    platformCommands: {
      default: 'pip install mycli',
      linux: 'pip install mycli',
      macos: 'brew install mycli',
      windows: 'pip install mycli',
      notes: 'Connect with `mycli -u user -h host database`.'
    },
    repoUrl: 'https://github.com/dbcli/mycli',
    features: ['Auto-completion', 'Syntax highlighting', 'Multi-line mode', 'Vim mode'],
    tags: ['python', 'database', 'productivity', 'open-source'],
    useCases: ['Interactive MySQL queries.', 'Database administration.', 'Faster SQL development.'],
    reviews: [],
    version: '2.30.0'
  },
  {
    id: 'usql',
    name: 'usql',
    description: 'Universal command-line interface for SQL databases.',
    longDescription: 'usql is a universal command-line interface for PostgreSQL, MySQL, SQLite, Oracle, and many other SQL databases. One tool for all your database needs.',
    category: AgentCategory.DATABASE,
    stars: 10145,
    language: 'Go',
    installCommand: 'brew install xo/xo/usql',
    platformCommands: {
      default: 'brew install xo/xo/usql',
      linux: 'go install github.com/xo/usql@latest',
      macos: 'brew install xo/xo/usql',
      windows: 'scoop install usql',
      notes: 'Connect with URLs: `usql postgres://user:pass@host/db`. usql is not in homebrew-core; requires the xo/xo tap.'
    },
    repoUrl: 'https://github.com/xo/usql',
    features: ['Multi-database', 'Auto-completion', 'Copy support', 'Meta-commands'],
    tags: ['go', 'database', 'productivity', 'open-source'],
    useCases: ['Universal database access.', 'Working with multiple DB types.', 'One tool for all databases.'],
    reviews: [],
    version: 'v0.21.6'
  },

  // ============================================================================
  // --- 16.0 DATA PROCESSING ---
  // ============================================================================
  {
    id: 'jq',
    name: 'jq',
    description: 'Lightweight and flexible command-line JSON processor.',
    longDescription: 'jq is like sed for JSON data. It can slice, filter, map, and transform structured data with ease using a powerful expression language.',
    category: AgentCategory.DATA_PROCESSING,
    stars: 35843,
    language: 'C',
    installCommand: 'brew install jq',
    platformCommands: {
      default: 'brew install jq',
      linux: 'sudo apt install jq',
      macos: 'brew install jq',
      windows: 'scoop install jq',
      notes: 'Pipe JSON to `jq` or use `jq \'.key\' file.json`'
    },
    repoUrl: 'https://github.com/jqlang/jq',
    features: ['JSON slicing', 'Filtering', 'Transformation', 'Scripting'],
    tags: ['c', 'data', 'productivity', 'open-source'],
    useCases: ['Parsing API responses.', 'Transforming JSON files.', 'CLI data pipelines.'],
    reviews: [],
    version: '1.8.2'
  },
  {
    id: 'yq',
    name: 'yq',
    description: 'Lightweight and portable command-line YAML processor.',
    longDescription: 'yq is a lightweight YAML processor that uses jq-like syntax. It can slice, filter, and transform YAML, JSON, XML, CSV, and properties files.',
    category: AgentCategory.DATA_PROCESSING,
    stars: 16109,
    language: 'Go',
    installCommand: 'brew install yq',
    platformCommands: {
      default: 'brew install yq',
      linux: 'sudo snap install yq',
      macos: 'brew install yq',
      windows: 'scoop install yq',
      notes: 'Uses jq-like syntax. Supports YAML, JSON, XML, CSV.'
    },
    repoUrl: 'https://github.com/mikefarah/yq',
    features: ['YAML processing', 'Multi-format', 'In-place editing', 'jq compatibility'],
    tags: ['go', 'data', 'productivity', 'open-source'],
    useCases: ['Editing Kubernetes manifests.', 'CI/CD config manipulation.', 'YAML parsing.'],
    reviews: [],
    version: '4.54.1'
  },
  {
    id: 'glow',
    name: 'glow',
    description: 'Render markdown on the CLI, with style.',
    longDescription: 'glow is a terminal-based markdown reader with glamour. It renders markdown beautifully in the terminal with customizable themes.',
    category: AgentCategory.MARKDOWN,
    stars: 27680,
    language: 'Go',
    installCommand: 'brew install glow',
    platformCommands: {
      default: 'brew install glow',
      linux: 'sudo snap install glow',
      macos: 'brew install glow',
      windows: 'scoop install glow',
      notes: 'Run `glow README.md` or `glow` for TUI mode. Not in default Debian/Ubuntu apt repos; use snap, or add Charm\'s apt repo (repo.charm.sh) if you need apt specifically.'
    },
    repoUrl: 'https://github.com/charmbracelet/glow',
    features: ['Styled rendering', 'Stash mode', 'Theme support', 'Pager integration'],
    tags: ['go', 'markdown', 'productivity', 'open-source'],
    useCases: ['Reading docs in terminal.', 'Previewing README files.', 'Beautiful markdown rendering.'],
    reviews: [],
    version: '3.0.0'
  },

  // ============================================================================
  // --- 17.0 SECURITY TOOLS ---
  // ============================================================================
  {
    id: 'pass',
    name: 'pass',
    description: 'The standard Unix password manager.',
    longDescription: 'pass is a simple password manager following the Unix philosophy. It stores passwords in GPG-encrypted files organized in a directory tree.',
    category: AgentCategory.SECURITY,
    stars: 0,
    language: 'Bash',
    installCommand: 'brew install pass',
    platformCommands: {
      default: 'brew install pass',
      linux: 'sudo apt install pass',
      macos: 'brew install pass',
      windows: 'Install via WSL or use pass-winmenu',
      notes: 'Requires GPG key setup. Init with `pass init <gpg-id>`.'
    },
    repoUrl: 'https://www.passwordstore.org/',
    features: ['GPG encryption', 'Git integration', 'Clipboard support', 'Extensions'],
    tags: ['bash', 'security', 'privacy', 'open-source'],
    useCases: ['Password management.', 'Git-synced secrets.', 'CLI credential access.'],
    reviews: [],
    version: '1.7.4'
  },
  {
    id: 'gopass',
    name: 'gopass',
    description: 'The slightly more awesome standard Unix password manager.',
    longDescription: 'gopass is a feature-rich rewrite of pass in Go. It adds team sharing, multiple stores, and improved usability while staying compatible.',
    category: AgentCategory.SECURITY,
    stars: 7254,
    language: 'Go',
    installCommand: 'brew install gopass',
    platformCommands: {
      default: 'brew install gopass',
      linux: 'sudo apt install gopass',
      macos: 'brew install gopass',
      windows: 'scoop install gopass',
      notes: 'Compatible with pass. Supports team-based stores.'
    },
    repoUrl: 'https://github.com/gopasspw/gopass',
    features: ['Team support', 'Multiple stores', 'Audit commands', 'TOTP support'],
    tags: ['go', 'security', 'privacy', 'open-source'],
    useCases: ['Team password sharing.', 'Multiple password stores.', 'Password auditing.'],
    reviews: [],
    version: '1.17.4'
  },

  // ============================================================================
  // --- 18.0 DEVOPS TOOLS ---
  // ============================================================================
  {
    id: 'k9s',
    name: 'k9s',
    description: 'Kubernetes CLI to manage clusters in style.',
    longDescription: 'k9s provides a terminal UI to interact with your Kubernetes clusters. It makes observing and managing your clusters easy.',
    category: AgentCategory.DEVOPS,
    stars: 34807,
    language: 'Go',
    installCommand: 'brew install k9s',
    platformCommands: {
      default: 'brew install k9s',
      linux: 'sudo snap install k9s',
      macos: 'brew install k9s',
      windows: 'scoop install k9s',
      notes: 'Uses your kubectl config. Launch with `k9s`.'
    },
    repoUrl: 'https://github.com/derailed/k9s',
    features: ['Real-time dashboard', 'Log streaming', 'Shell access', 'Resource management'],
    tags: ['go', 'devops', 'kubernetes', 'open-source'],
    useCases: ['Kubernetes cluster monitoring.', 'Pod debugging.', 'Resource navigation.'],
    reviews: [],
    version: '0.51.0'
  },
  {
    id: 'lazydocker',
    name: 'lazydocker',
    description: 'A simple terminal UI for Docker and Docker Compose.',
    longDescription: 'lazydocker is a terminal UI for managing Docker containers, images, volumes, and networks. It makes Docker management simple and visual.',
    category: AgentCategory.DEVOPS,
    stars: 53027,
    language: 'Go',
    installCommand: 'brew install lazydocker',
    platformCommands: {
      default: 'brew install lazydocker',
      linux: 'curl https://raw.githubusercontent.com/jesseduffield/lazydocker/master/scripts/install_update_linux.sh | bash',
      macos: 'brew install lazydocker',
      windows: 'scoop install lazydocker',
      notes: 'Just run `lazydocker` to start the TUI.'
    },
    repoUrl: 'https://github.com/jesseduffield/lazydocker',
    features: ['Container management', 'Log viewing', 'Stats dashboard', 'Docker Compose'],
    tags: ['go', 'devops', 'docker', 'open-source'],
    useCases: ['Docker container management.', 'Viewing container logs.', 'Docker Compose projects.'],
    reviews: [],
    version: '0.25.2'
  },
  {
    id: 'ctop',
    name: 'ctop',
    description: 'Top-like interface for container metrics.',
    longDescription: 'ctop provides a concise, real-time overview of running containers similar to top for processes. Works with Docker and runc.',
    category: AgentCategory.DEVOPS,
    stars: 17843,
    language: 'Go',
    installCommand: 'brew install ctop',
    platformCommands: {
      default: 'brew install ctop',
      linux: 'sudo wget https://github.com/bcicen/ctop/releases/download/v0.7.7/ctop-0.7.7-linux-amd64 -O /usr/local/bin/ctop && sudo chmod +x /usr/local/bin/ctop',
      macos: 'brew install ctop',
      windows: 'docker run --rm -ti --name=ctop -v /var/run/docker.sock:/var/run/docker.sock quay.io/vektorlab/ctop:latest',
      notes: 'Run `ctop` to see container metrics in real-time.'
    },
    repoUrl: 'https://github.com/bcicen/ctop',
    features: ['Real-time metrics', 'Container management', 'Sorting', 'Filter containers'],
    tags: ['go', 'devops', 'docker', 'open-source'],
    useCases: ['Container resource monitoring.', 'Docker performance analysis.', 'Quick container overview.'],
    reviews: [],
    version: '0.7.7'
  },

  // ============================================================================
  // --- 19.0 GIT TOOLS ---
  // ============================================================================
  {
    id: 'tig',
    name: 'tig',
    description: 'Text-mode interface for Git.',
    longDescription: 'tig is an ncurses-based text-mode interface for Git. It allows you to browse changes in a Git repository and view commit logs.',
    category: AgentCategory.GIT_TOOL,
    stars: 13369,
    language: 'C',
    installCommand: 'brew install tig',
    platformCommands: {
      default: 'brew install tig',
      linux: 'sudo apt install tig',
      macos: 'brew install tig',
      windows: 'Included with Git for Windows (since 2.14.2), or use Cygwin',
      notes: 'Run `tig` in any git repo to browse history. No Scoop/Chocolatey package exists; on Windows it ships bundled with Git for Windows.'
    },
    repoUrl: 'https://github.com/jonas/tig',
    features: ['Log browsing', 'Diff viewing', 'Blame view', 'Staging interface'],
    tags: ['c', 'git', 'productivity', 'open-source'],
    useCases: ['Git log exploration.', 'Viewing file blame.', 'Interactive staging.'],
    reviews: [],
    version: '2.6.1'
  },
  {
    id: 'gitui',
    name: 'gitui',
    description: 'Blazing fast terminal-ui for git written in Rust.',
    longDescription: 'gitui provides a blazing fast terminal interface for Git. It aims to provide all the comfort of a Git GUI in a terminal environment.',
    category: AgentCategory.GIT_TOOL,
    stars: 22561,
    language: 'Rust',
    installCommand: 'brew install gitui',
    platformCommands: {
      default: 'brew install gitui',
      linux: 'cargo install gitui',
      macos: 'brew install gitui',
      windows: 'scoop install gitui',
      notes: 'Run `gitui` in any git repo. Supports custom keybindings.'
    },
    repoUrl: 'https://github.com/gitui-org/gitui',
    features: ['Fast performance', 'Async Git', 'Staging chunks', 'Commit signing'],
    tags: ['rust', 'git', 'productivity', 'open-source'],
    useCases: ['Fast Git interactions.', 'Staging and committing.', 'Git history browsing.'],
    reviews: [],
    version: '0.28.1'
  },
  {
    id: 'git-delta',
    name: 'delta',
    description: 'A syntax-highlighting pager for git, diff, and grep output.',
    longDescription: 'delta is a viewer for git and diff output with syntax highlighting, line numbers, side-by-side layout, and more. Makes diffs beautiful.',
    category: AgentCategory.GIT_TOOL,
    stars: 32521,
    language: 'Rust',
    installCommand: 'brew install git-delta',
    platformCommands: {
      default: 'brew install git-delta',
      linux: 'cargo install git-delta',
      macos: 'brew install git-delta',
      windows: 'scoop install delta',
      notes: 'Add to .gitconfig: [core] pager = delta'
    },
    repoUrl: 'https://github.com/dandavison/delta',
    features: ['Syntax highlighting', 'Side-by-side', 'Line numbers', 'Merge conflict style'],
    tags: ['rust', 'git', 'productivity', 'open-source'],
    useCases: ['Beautiful git diffs.', 'Code review in terminal.', 'Diff visualization.'],
    reviews: [],
    version: '0.20.1'
  },

  // ============================================================================
  // --- 20.0 PRODUCTIVITY & NOTE TAKING ---
  // ============================================================================
  {
    id: 'taskwarrior',
    name: 'Taskwarrior',
    description: 'Free and open source task management from the command line.',
    longDescription: 'Taskwarrior manages your TODO list from the command line. It is flexible, fast, and unobtrusive with powerful reporting and filtering.',
    category: AgentCategory.PRODUCTIVITY,
    stars: 6107,
    language: 'C++',
    installCommand: 'brew install task',
    platformCommands: {
      default: 'brew install task',
      linux: 'sudo apt install taskwarrior',
      macos: 'brew install task',
      windows: 'Install via WSL (no native Windows package; Scoop\'s "task" is an unrelated build tool)',
      notes: 'Add tasks with `task add`. List with `task list`. See `task help`.'
    },
    repoUrl: 'https://github.com/GothenburgBitFactory/taskwarrior',
    features: ['Tags & projects', 'Dependencies', 'Recurrence', 'Sync support'],
    tags: ['c++', 'productivity', 'terminal', 'open-source'],
    useCases: ['Task management.', 'Project tracking.', 'GTD workflows.'],
    reviews: [],
    version: '3.5.0'
  },
  {
    id: 'nb',
    name: 'nb',
    description: 'CLI note‑taking, bookmarking, archiving, and knowledge base app.',
    longDescription: 'nb is a command-line and local web note‑taking, bookmarking, archiving, and knowledge base application with Git-backed syncing and encryption.',
    category: AgentCategory.PRODUCTIVITY,
    stars: 8420,
    language: 'Bash',
    installCommand: 'brew install nb',
    platformCommands: {
      default: 'brew install nb',
      linux: 'sudo curl -L https://raw.github.com/xwmx/nb/master/nb -o /usr/local/bin/nb && sudo chmod +x /usr/local/bin/nb',
      macos: 'brew install nb',
      notes: 'Uses Git for sync. Supports encryption with GPG/age.'
    },
    repoUrl: 'https://github.com/xwmx/nb',
    features: ['Git sync', 'Encryption', 'Bookmarks', 'Search & browse'],
    tags: ['bash', 'productivity', 'notes', 'open-source'],
    useCases: ['Note taking.', 'Bookmarking.', 'Personal knowledge base.'],
    reviews: [],
    version: '7.25.5'
  },
  {
    id: 'watson',
    name: 'Watson',
    description: 'A wonderful CLI to track your time.',
    longDescription: 'Watson is a tool to help you monitor your time. You can tell Watson when you start working on a project and it will track time until you stop.',
    category: AgentCategory.PRODUCTIVITY,
    stars: 2542,
    language: 'Python',
    installCommand: 'pip install td-watson',
    platformCommands: {
      default: 'pip install td-watson',
      linux: 'pip install td-watson',
      macos: 'brew install watson',
      notes: 'Start tracking: `watson start <project>`. Stop: `watson stop`.'
    },
    repoUrl: 'https://github.com/jazzband/Watson',
    features: ['Project tracking', 'Tags', 'Reports', 'Export formats'],
    tags: ['python', 'productivity', 'time-tracking', 'open-source'],
    useCases: ['Time tracking.', 'Client billing.', 'Productivity analysis.'],
    reviews: [],
    version: '2.1.0'
  },

  // ============================================================================
  // --- 21.0 DEVELOPMENT TOOLS ---
  // ============================================================================
  {
    id: 'just',
    name: 'just',
    description: 'A handy way to save and run project-specific commands.',
    longDescription: 'just is a command runner that provides a convenient way to save and run project-specific commands. It is a modern, better make alternative.',
    category: AgentCategory.DEVELOPMENT,
    stars: 36261,
    language: 'Rust',
    installCommand: 'brew install just',
    platformCommands: {
      default: 'brew install just',
      linux: 'cargo install just',
      macos: 'brew install just',
      windows: 'scoop install just',
      notes: 'Create a `justfile` in your project. Run `just <recipe>`.'
    },
    repoUrl: 'https://github.com/casey/just',
    features: ['Recipe runner', 'Cross-platform', 'Variables', 'Dependencies'],
    tags: ['rust', 'development', 'productivity', 'open-source'],
    useCases: ['Project task running.', 'Build automation.', 'Replacing Makefiles.'],
    reviews: [],
    version: '1.59.0'
  },
  {
    id: 'grex',
    name: 'grex',
    description: 'A command-line tool for generating regular expressions.',
    longDescription: 'grex generates regular expressions from user-provided test cases. It simplifies the sometimes frustrating experience of writing and reading regexes.',
    category: AgentCategory.DEVELOPMENT,
    stars: 8219,
    language: 'Rust',
    installCommand: 'brew install grex',
    platformCommands: {
      default: 'brew install grex',
      linux: 'cargo install grex',
      macos: 'brew install grex',
      windows: 'scoop install grex',
      notes: 'Run `grex "test1" "test2"` to generate regex matching inputs.'
    },
    repoUrl: 'https://github.com/pemistahl/grex',
    features: ['Pattern inference', 'Character classes', 'Anchors', 'Quantifiers'],
    tags: ['rust', 'development', 'utility', 'open-source'],
    useCases: ['Generating regexes.', 'Learning regex patterns.', 'Data validation.'],
    reviews: [],
    version: '1.4.6'
  },
  {
    id: 'asciinema',
    name: 'asciinema',
    description: 'Record and share terminal sessions.',
    longDescription: 'asciinema lets you record your terminal sessions and share them as lightweight, embeddable, and linkable ASCII casts with asciinema.org.',
    category: AgentCategory.DEVELOPMENT,
    stars: 17869,
    language: 'Rust',
    installCommand: 'brew install asciinema',
    platformCommands: {
      default: 'brew install asciinema',
      linux: 'cargo install --locked --git https://github.com/asciinema/asciinema',
      macos: 'brew install asciinema',
      notes: 'Record with `asciinema rec`. Version 3 is a Rust rewrite; distro packages and `pip install asciinema` may still ship the legacy 2.x Python release.'
    },
    repoUrl: 'https://github.com/asciinema/asciinema',
    features: ['Terminal recording', 'Lightweight files', 'Embedding', 'Live streaming'],
    tags: ['rust', 'development', 'documentation', 'open-source'],
    useCases: ['Recording demos.', 'Documentation.', 'Sharing terminal sessions.'],
    reviews: [],
    version: '3.2.1'
  },

  // ============================================================================
  // --- 22.0 NETWORK UTILITIES ---
  // ============================================================================
  {
    id: 'mosh',
    name: 'mosh',
    description: 'Mobile shell that allows roaming and intermittent connectivity.',
    longDescription: 'mosh (mobile shell) is a replacement for SSH that maintains connection across intermittent connectivity, IP address changes, and sleep/resume.',
    category: AgentCategory.NETWORK,
    stars: 14566,
    language: 'C++',
    installCommand: 'brew install mosh',
    platformCommands: {
      default: 'brew install mosh',
      linux: 'sudo apt install mosh',
      macos: 'brew install mosh',
      notes: 'Use like ssh: `mosh user@host`. Server must also have mosh installed.'
    },
    repoUrl: 'https://github.com/mobile-shell/mosh',
    features: ['Roaming', 'Local echo', 'Connection persistence', 'UDP based'],
    tags: ['c++', 'network', 'ssh', 'open-source'],
    useCases: ['Unreliable connections.', 'Mobile development.', 'Long-running sessions.'],
    reviews: [],
    version: '1.4.0'
  },
  {
    id: 'bandwhich',
    name: 'bandwhich',
    description: 'Terminal bandwidth utilization tool.',
    longDescription: 'bandwhich is a CLI utility for displaying current bandwidth utilization by process, connection, and remote IP/hostname.',
    category: AgentCategory.NETWORK,
    stars: 11993,
    language: 'Rust',
    installCommand: 'brew install bandwhich',
    platformCommands: {
      default: 'brew install bandwhich',
      linux: 'cargo install bandwhich',
      macos: 'brew install bandwhich',
      windows: 'cargo install bandwhich',
      notes: 'Requires root/sudo on most systems for packet capture.'
    },
    repoUrl: 'https://github.com/imsnif/bandwhich',
    features: ['Per-process bandwidth', 'Connection tracking', 'Remote host display', 'Real-time updates'],
    tags: ['rust', 'network', 'monitoring', 'open-source'],
    useCases: ['Bandwidth monitoring.', 'Finding bandwidth hogs.', 'Network debugging.'],
    reviews: [],
    version: '0.23.1'
  },

  // ============================================================================
  // --- 23.0 TEXT EDITORS ---
  // ============================================================================
  {
    id: 'neovim',
    name: 'Neovim',
    description: 'Hyperextensible Vim-based text editor.',
    longDescription: 'Neovim is a refactor of Vim focused on extensibility and usability. It features a built-in LSP client, Lua configuration, and async plugins.',
    category: AgentCategory.TEXT_EDITOR,
    stars: 103029,
    language: 'C/Lua',
    installCommand: 'brew install neovim',
    platformCommands: {
      default: 'brew install neovim',
      linux: 'sudo apt install neovim',
      macos: 'brew install neovim',
      windows: 'scoop install neovim',
      notes: 'Launch with `nvim`. Config in ~/.config/nvim/init.lua'
    },
    repoUrl: 'https://github.com/neovim/neovim',
    features: ['Built-in LSP', 'Lua config', 'Async plugins', 'Treesitter'],
    tags: ['c', 'editor', 'productivity', 'open-source'],
    useCases: ['Code editing.', 'IDE-like features.', 'Extensible workflows.'],
    reviews: [],
    version: '0.12.6'
  },
  {
    id: 'helix',
    name: 'Helix',
    description: 'A post-modern modal text editor.',
    longDescription: 'Helix is a terminal-based modal editor with batteries included. It features built-in LSP support, syntax highlighting via tree-sitter, and a selection-first design.',
    category: AgentCategory.TEXT_EDITOR,
    stars: 46631,
    language: 'Rust',
    installCommand: 'brew install helix',
    platformCommands: {
      default: 'brew install helix',
      linux: 'sudo snap install helix --classic',
      macos: 'brew install helix',
      windows: 'scoop install helix',
      notes: 'Launch with `hx`. Built-in LSP and tree-sitter support. Not in official Debian/Ubuntu apt repos; use snap, flatpak, or the AppImage from the releases page.'
    },
    repoUrl: 'https://github.com/helix-editor/helix',
    features: ['Built-in LSP', 'Tree-sitter', 'Multiple cursors', 'Selection-first'],
    tags: ['rust', 'editor', 'productivity', 'open-source'],
    useCases: ['Modal editing.', 'Zero-config coding.', 'Modern Vi alternative.'],
    reviews: [],
    version: '25.07.1'
  },
  {
    id: 'micro',
    name: 'micro',
    description: 'A modern and intuitive terminal-based text editor.',
    longDescription: 'micro is a modern, easy-to-use terminal-based text editor that strives to be easy to use while being fully customizable. Think of it as nano with modern features.',
    category: AgentCategory.TEXT_EDITOR,
    stars: 29719,
    language: 'Go',
    installCommand: 'brew install micro',
    platformCommands: {
      default: 'brew install micro',
      linux: 'curl https://getmic.ro | bash',
      macos: 'brew install micro',
      windows: 'scoop install micro',
      notes: 'Intuitive keybindings (Ctrl+S save, Ctrl+Q quit). Supports plugins.'
    },
    repoUrl: 'https://github.com/micro-editor/micro',
    features: ['Syntax highlighting', 'Plugin system', 'Mouse support', 'Multi-cursor'],
    tags: ['go', 'editor', 'productivity', 'open-source'],
    useCases: ['Quick file editing.', 'Easy terminal editor.', 'nano replacement.'],
    reviews: [],
    version: '2.0.15'
  },

  // --- VIDEO & MEDIA ---
  {
    id: 'youtube-dl',
    name: 'youtube-dl',
    description: 'Download videos from YouTube and many other sites.',
    longDescription: 'The classic video downloader supporting 1000+ sites. Download videos, playlists, channels with format selection and subtitle support.',
    category: AgentCategory.VIDEO,
    stars: 141316,
    language: 'Python',
    installCommand: 'pip install youtube-dl',
    platformCommands: {
      default: 'pip install youtube-dl',
      windows: 'pip install youtube-dl',
      macos: 'pip install youtube-dl',
      linux: 'sudo apt install youtube-dl || pip install youtube-dl',
      notes: 'Homebrew removed the youtube-dl formula (Nov 2024) in favor of yt-dlp, so `brew install youtube-dl` no longer works — use pip on macOS instead. For latest features, use yt-dlp instead (youtube-dl fork).'
    },
    repoUrl: 'https://github.com/ytdl-org/youtube-dl',
    features: ['1000+ sites', 'Quality selection', 'Playlist support', 'Subtitles'],
    tags: ['python', 'video', 'download', 'open-source'],
    useCases: ['Download videos for offline viewing.', 'Archive content.', 'Extract audio.'],
    reviews: [],
    version: '2021.12.17'
  },

  // --- FILE MANAGERS ---

  // --- SEARCH TOOLS ---

  // ============================================================================
  // --- 24.0 CLASSIC TEXT EDITORS ---
  // ============================================================================
  {
    id: 'vim',
    name: 'Vim',
    description: 'The ubiquitous text editor.',
    longDescription: 'Vim is a highly configurable text editor built to enable efficient text editing. It is an improved version of the vi editor distributed with most UNIX systems.',
    category: AgentCategory.TEXT_EDITOR,
    stars: 41194,
    language: 'C',
    installCommand: 'brew install vim',
    platformCommands: {
      default: 'brew install vim',
      linux: 'sudo apt install vim',
      macos: 'brew install vim',
      windows: 'scoop install vim',
      notes: 'Pre-installed on most Unix systems. Launch with `vim`. Config in ~/.vimrc'
    },
    repoUrl: 'https://github.com/vim/vim',
    features: ['Modal editing', 'Extensible plugins', 'Cross-platform', 'Macros'],
    tags: ['c', 'editor', 'productivity', 'open-source'],
    useCases: ['Server administration.', 'Quick file edits.', 'Modal text editing.'],
    reviews: [],
    version: '9.2.1200'
  },
  {
    id: 'emacs',
    name: 'Emacs',
    description: 'An extensible, customizable, free/libre text editor — and more.',
    longDescription: 'GNU Emacs is the extensible, self-documenting text editor. Emacs has over 10,000 built-in commands and can be extended with Emacs Lisp.',
    category: AgentCategory.TEXT_EDITOR,
    stars: 5218,
    language: 'C/Emacs Lisp',
    installCommand: 'brew install emacs',
    platformCommands: {
      default: 'brew install emacs',
      linux: 'sudo apt install emacs',
      macos: 'brew install emacs',
      windows: 'scoop install emacs',
      notes: 'Launch with `emacs`. Config in ~/.emacs or ~/.emacs.d/init.el'
    },
    repoUrl: 'https://git.savannah.gnu.org/cgit/emacs.git',
    features: ['Extensible via Lisp', 'Built-in packages', 'Org mode', 'Terminal \u0026 GUI'],
    tags: ['lisp', 'editor', 'productivity', 'open-source'],
    useCases: ['Writing \u0026 note-taking.', 'Software development.', 'Literate programming.'],
    reviews: [],
    version: '31.1'
  },
  {
    id: 'kakoune',
    name: 'Kakoune',
    description: 'Modal editor inspired by Vim.',
    longDescription: 'Kakoune is a code editor heavily inspired by Vim with a focus on interactivity and incremental results. Features multiple selections and a selection-first design.',
    category: AgentCategory.TEXT_EDITOR,
    stars: 11107,
    language: 'C++',
    installCommand: 'brew install kakoune',
    platformCommands: {
      default: 'brew install kakoune',
      linux: 'sudo apt install kakoune',
      macos: 'brew install kakoune',
      windows: 'Build from source or use WSL',
      notes: 'Launch with `kak`. Features multiple selections and selection-first editing.'
    },
    repoUrl: 'https://github.com/mawww/kakoune',
    features: ['Multiple selections', 'Incremental search', 'Client-server', 'Orthogonal design'],
    tags: ['c++', 'editor', 'productivity', 'open-source'],
    useCases: ['Modal editing.', 'Multiple cursors.', 'Selection-based editing.'],
    reviews: [],
    version: '2026.05.21'
  },

  // ============================================================================
  // --- 25.0 HTTP CLIENTS ---
  // ============================================================================
  {
    id: 'http-prompt',
    name: 'HTTP Prompt',
    description: 'Interactive HTTP client featuring autocomplete and syntax highlighting.',
    longDescription: 'An interactive command-line HTTP client built on HTTPie with persistent context, autocomplete, and an intuitive interface for API testing.',
    category: AgentCategory.HTTP_CLIENT,
    stars: 9110,
    language: 'Python',
    installCommand: 'pip install http-prompt',
    platformCommands: {
      default: 'pip install http-prompt',
      linux: 'pip install http-prompt',
      macos: 'pip install http-prompt',
      windows: 'pip install http-prompt',
      notes: 'Interactive prompt with autocomplete. Uses HTTPie under the hood.'
    },
    repoUrl: 'https://github.com/httpie/http-prompt',
    features: ['Autocomplete', 'Persistent context', 'Syntax highlighting', 'HTTPie integration'],
    tags: ['python', 'http', 'api', 'open-source'],
    useCases: ['Interactive API exploration.', 'Testing APIs.', 'Learning REST APIs.'],
    reviews: [],
    version: '2.1.0'
  },
  {
    id: 'atac',
    name: 'ATAC',
    description: 'A feature-full TUI API client made in Rust.',
    longDescription: 'ATAC (Arguably a Terminal API Client) is a full-featured TUI for API testing with collections, environments, and a beautiful interface.',
    category: AgentCategory.HTTP_CLIENT,
    stars: 3737,
    language: 'Rust',
    installCommand: 'cargo install atac',
    platformCommands: {
      default: 'cargo install atac',
      linux: 'cargo install atac',
      macos: 'brew install atac',
      windows: 'cargo install atac',
      notes: 'Full TUI interface similar to Postman. Supports collections.'
    },
    repoUrl: 'https://github.com/Julien-cpsn/ATAC',
    features: ['TUI interface', 'Collections', 'Environments', 'WebSocket support'],
    tags: ['rust', 'http', 'api', 'tui'],
    useCases: ['API testing with TUI.', 'Managing API collections.', 'Testing WebSockets.'],
    reviews: [],
    version: '0.24.0'
  },

  // ============================================================================
  // --- 26.0 DATABASE CLIENTS ---
  // ============================================================================
  {
    id: 'pgcli',
    name: 'pgcli',
    description: 'Postgres client with autocompletion and syntax highlighting.',
    longDescription: 'pgcli is a command-line interface for Postgres with auto-completion and syntax highlighting. Makes working with PostgreSQL databases a pleasure.',
    category: AgentCategory.DATABASE,
    stars: 13417,
    language: 'Python',
    installCommand: 'pip install pgcli',
    platformCommands: {
      default: 'pip install pgcli',
      linux: 'sudo apt install pgcli',
      macos: 'brew install pgcli',
      windows: 'pip install pgcli',
      notes: 'Connect with `pgcli postgresql://user:pass@host:port/dbname`'
    },
    repoUrl: 'https://github.com/dbcli/pgcli',
    features: ['Auto-completion', 'Syntax highlighting', 'Pretty printing', 'Smart completion'],
    tags: ['python', 'database', 'postgresql', 'open-source'],
    useCases: ['PostgreSQL management.', 'Query development.', 'Database administration.'],
    reviews: [],
    version: '4.7.1'
  },
  {
    id: 'iredis',
    name: 'iredis',
    description: 'Redis client with autocompletion and syntax highlighting.',
    longDescription: 'iredis is a terminal client for Redis with auto-completion and syntax highlighting. Supports Redis Cluster and provides a better user experience than redis-cli.',
    category: AgentCategory.DATABASE,
    stars: 2763,
    language: 'Python',
    installCommand: 'pip install iredis',
    platformCommands: {
      default: 'pip install iredis',
      linux: 'pip install iredis',
      macos: 'pip install iredis',
      windows: 'pip install iredis',
      notes: 'Connect with `iredis -h host -p port`. Supports Redis Cluster.'
    },
    repoUrl: 'https://github.com/laixintao/iredis',
    features: ['Auto-completion', 'Syntax highlighting', 'Redis Cluster', 'Pipeline commands'],
    tags: ['python', 'database', 'redis', 'open-source'],
    useCases: ['Redis database management.', 'Cache debugging.', 'Redis Cluster operations.'],
    reviews: [],
    version: '1.16.1'
  },

  // ============================================================================
  // --- 27.0 GIT UTILITIES ---
  // ============================================================================
  {
    id: 'git-extras',
    name: 'git-extras',
    description: 'Git utilities -- repo summary, repl, changelog population, and more.',
    longDescription: 'GIT utilities -- repo summary, repl, changelog population, author commit percentages and more. Adds dozens of useful git commands.',
    category: AgentCategory.GIT_TOOL,
    stars: 18120,
    language: 'Shell',
    installCommand: 'brew install git-extras',
    platformCommands: {
      default: 'brew install git-extras',
      linux: 'sudo apt install git-extras',
      macos: 'brew install git-extras',
      windows: 'Install via Git for Windows or use WSL',
      notes: 'Adds 60+ git commands. Run `git extras --help` for list.'
    },
    repoUrl: 'https://github.com/tj/git-extras',
    features: ['60+ commands', 'Repo summaries', 'Changelog generation', 'Git aliases'],
    tags: ['shell', 'git', 'productivity', 'open-source'],
    useCases: ['Extended Git workflows.', 'Repository analysis.', 'Changelog generation.'],
    reviews: [],
    version: '7.5.0'
  },
  {
    id: 'lazygit',
    name: 'Lazygit',
    description: 'Simple terminal UI for git commands.',
    longDescription: 'A simple terminal UI for git commands. Lazygit is a minimal terminal interface for Git with keyboard shortcuts and visual feedback.',
    category: AgentCategory.GIT_TOOL,
    stars: 83098,
    language: 'Go',
    installCommand: 'brew install lazygit',
    platformCommands: {
      default: 'brew install lazygit',
      linux: 'sudo add-apt-repository ppa:lazygit-team/release \u0026\u0026 sudo apt install lazygit',
      macos: 'brew install lazygit',
      windows: 'scoop install lazygit',
      notes: 'Run `lazygit` in any git repo. Keyboard-driven interface.'
    },
    repoUrl: 'https://github.com/jesseduffield/lazygit',
    features: ['TUI interface', 'Staging', 'Rebasing', 'Cherry-picking'],
    tags: ['go', 'git', 'tui', 'open-source'],
    useCases: ['Visual Git operations.', 'Interactive staging.', 'Git workflow management.'],
    reviews: [],
    version: '0.66.2'
  },

  // ============================================================================
  // --- 28.0 SHELL UTILITIES ---
  // ============================================================================
  {
    id: 'bat',
    name: 'bat',
    description: 'A cat clone with syntax highlighting.',
    longDescription: 'bat is a cat clone with wings. It supports syntax highlighting for a large number of programming and markup languages, Git integration, and automatic paging.',
    category: AgentCategory.SHELL_UTILITY,
    stars: 60813,
    language: 'Rust',
    installCommand: 'brew install bat',
    platformCommands: {
      default: 'brew install bat',
      linux: 'sudo apt install bat',
      macos: 'brew install bat',
      windows: 'scoop install bat',
      notes: 'On Debian/Ubuntu the apt package installs the binary as `batcat` (name clash with bacula-console-qt); alias it to `bat` or symlink manually. Use `bat --style=plain` for plain output.'
    },
    repoUrl: 'https://github.com/sharkdp/bat',
    features: ['Syntax highlighting', 'Git integration', 'Automatic paging', 'Line numbers'],
    tags: ['rust', 'shell', 'productivity', 'open-source'],
    useCases: ['Viewing code files.', 'Git diff viewing.', 'Replacing cat.'],
    reviews: [],
    version: '0.26.1'
  },
  {
    id: 'eza',
    name: 'eza',
    description: 'A modern replacement for ls.',
    longDescription: 'eza is a modern replacement for the venerable file-listing command-line program ls. It uses colours to distinguish file types and metadata, and has Git awareness.',
    category: AgentCategory.SHELL_UTILITY,
    stars: 23518,
    language: 'Rust',
    installCommand: 'brew install eza',
    platformCommands: {
      default: 'brew install eza',
      linux: 'cargo install eza',
      macos: 'brew install eza',
      windows: 'cargo install eza',
      notes: 'Modern ls replacement. Use `eza --icons` for icons.'
    },
    repoUrl: 'https://github.com/eza-community/eza',
    features: ['Git awareness', 'Colors \u0026 icons', 'Tree view', 'Extended attributes'],
    tags: ['rust', 'shell', 'productivity', 'open-source'],
    useCases: ['Better file listing.', 'Git status in ls.', 'Replacing ls.'],
    reviews: [],
    version: '0.23.5'
  },
  {
    id: 'lsd',
    name: 'lsd',
    description: 'The next gen ls command.',
    longDescription: 'lsd (LSDeluxe) is a rewrite of GNU ls with lots of added features like colors, icons, tree-view, and more. Built in Rust.',
    category: AgentCategory.SHELL_UTILITY,
    stars: 16257,
    language: 'Rust',
    installCommand: 'brew install lsd',
    platformCommands: {
      default: 'brew install lsd',
      linux: 'sudo apt install lsd',
      macos: 'brew install lsd',
      windows: 'scoop install lsd',
      notes: 'ls with icons and colors. Use `lsd --tree` for tree view.'
    },
    repoUrl: 'https://github.com/lsd-rs/lsd',
    features: ['Icons', 'Colors', 'Tree view', 'Git integration'],
    tags: ['rust', 'shell', 'productivity', 'open-source'],
    useCases: ['Enhanced file listing.', 'Visual directory browsing.', 'Replacing ls.'],
    reviews: [],
    version: '1.2.0'
  },
  {
    id: 'ncdu',
    name: 'NCDu',
    description: 'A disk usage analyzer with an ncurses interface.',
    longDescription: 'NCDu (NCurses Disk Usage) is a disk usage analyzer with an ncurses interface. It provides a fast way to see what directories are using your disk space.',
    category: AgentCategory.SHELL_UTILITY,
    stars: 0,
    language: 'C',
    installCommand: 'brew install ncdu',
    platformCommands: {
      default: 'brew install ncdu',
      linux: 'sudo apt install ncdu',
      macos: 'brew install ncdu',
      windows: 'Install via WSL or Cygwin',
      notes: 'Run `ncdu` to analyze current directory. Interactive TUI.'
    },
    repoUrl: 'https://dev.yorhel.nl/ncdu',
    features: ['Interactive TUI', 'Fast scanning', 'Delete files', 'Export results'],
    tags: ['c', 'shell', 'disk-usage', 'open-source'],
    useCases: ['Disk space analysis.', 'Finding large directories.', 'Cleaning storage.'],
    reviews: [],
    version: '2.9.2'
  },
  // --- 29.0 NEXT-GEN CODING AGENTS ---
  {
    id: 'openai-codex',
    name: 'OpenAI Codex CLI',
    description: 'OpenAI\'s open-source coding agent that runs locally in your terminal.',
    longDescription: 'Codex CLI is a lightweight, Rust-based coding agent from OpenAI. It reads your repository, proposes and applies edits, and runs commands inside an OS-level sandbox with configurable approval modes, so you decide how much autonomy it gets.',
    category: AgentCategory.AUTONOMOUS,
    stars: 129364,
    language: 'Rust',
    installCommand: 'npm install -g @openai/codex',
    platformCommands: {
      default: 'npm install -g @openai/codex',
      windows: 'powershell -ExecutionPolicy ByPass -c "irm https://chatgpt.com/codex/install.ps1 | iex"',
      macos: 'brew install --cask codex',
      linux: 'curl -fsSL https://chatgpt.com/codex/install.sh | sh',
      notes: 'Sign in with a ChatGPT plan or set OPENAI_API_KEY. Start with `codex` inside a project directory.'
    },
    repoUrl: 'https://github.com/openai/codex',
    features: ['Sandboxed command execution', 'Configurable approval modes', 'Multimodal prompts', 'MCP client support'],
    tags: ['coding', 'autonomous', 'sandbox', 'open-source', 'rust'],
    useCases: ['Implementing features from a natural-language spec.', 'Explaining unfamiliar codebases.', 'Running scripted, non-interactive fixes in CI.'],
    reviews: [],
    troubleshooting: [
      'Login loop: run `codex login` again, or export OPENAI_API_KEY to use API billing instead of a ChatGPT plan',
      'Sandbox blocks a command: re-run with a less restrictive approval mode only in a trusted repository'
    ],
    version: '0.163.0'
  },
  {
    id: 'opencode',
    name: 'opencode',
    description: 'Provider-agnostic, open-source AI coding agent built for the terminal.',
    longDescription: 'opencode is a terminal-native coding agent with a polished TUI, LSP-aware context, multi-session support, and a client/server architecture. It works with Anthropic, OpenAI, Google, and local models, so you are never locked to a single provider.',
    category: AgentCategory.CODING,
    stars: 216457,
    language: 'TypeScript',
    installCommand: 'curl -fsSL https://opencode.ai/v2/install | bash',
    platformCommands: {
      default: 'curl -fsSL https://opencode.ai/v2/install | bash',
      windows: 'npm i -g @opencode/cli@latest',
      macos: 'brew install opencode',
      linux: 'curl -fsSL https://opencode.ai/v2/install | bash',
      notes: 'Remove versions older than 0.1.x before installing. `brew install anomalyco/tap/opencode-v2` tracks releases faster than the core formula.'
    },
    repoUrl: 'https://github.com/anomalyco/opencode',
    features: ['Any-provider model support', 'LSP-aware context', 'Multi-session TUI', 'Client/server architecture'],
    tags: ['coding', 'open-source', 'tui', 'local-llm'],
    useCases: ['Switching between hosted and local models mid-project.', 'Running parallel agent sessions on one repo.', 'Remote-driving an agent from another client.'],
    reviews: [],
    version: '2.0.32'
  },
  {
    id: 'goose',
    name: 'goose',
    description: 'Open-source, extensible on-machine agent that goes beyond code suggestions.',
    longDescription: 'goose is a local AI agent that can build projects, run and debug code, and orchestrate workflows end to end. It is extended through MCP servers, works with any LLM provider, and ships as both a CLI and a desktop app.',
    category: AgentCategory.AUTONOMOUS,
    stars: 55395,
    language: 'Rust',
    installCommand: 'curl -fsSL https://github.com/aaif-goose/goose/releases/download/stable/download_cli.sh | bash',
    platformCommands: {
      default: 'curl -fsSL https://github.com/aaif-goose/goose/releases/download/stable/download_cli.sh | bash',
      macos: 'brew install block-goose-cli',
      linux: 'curl -fsSL https://github.com/aaif-goose/goose/releases/download/stable/download_cli.sh | bash',
      notes: 'Run `goose configure` to pick a provider. Windows users can install the desktop app from goose-docs.ai or run the CLI script inside WSL.'
    },
    repoUrl: 'https://github.com/aaif-goose/goose',
    features: ['MCP extension system', 'Any-LLM provider support', 'Recipes for repeatable workflows', 'CLI and desktop app'],
    tags: ['autonomous', 'open-source', 'automation', 'mcp', 'rust'],
    useCases: ['Scaffolding and running a new project end to end.', 'Automating repetitive engineering chores.', 'Chaining MCP tools into one workflow.'],
    reviews: [],
    version: '1.55.0'
  },
  {
    id: 'cursor-cli',
    name: 'Cursor CLI',
    description: 'Cursor\'s coding agent, headless or interactive, straight from the terminal.',
    longDescription: 'Cursor CLI brings the Cursor agent to any terminal. It can edit files, run shell commands with approval, and be scripted in non-interactive mode for CI and automation, using the same rules and models as the Cursor editor.',
    category: AgentCategory.CODING,
    stars: 0,
    language: 'TypeScript',
    installCommand: 'curl https://cursor.com/install -fsS | bash',
    platformCommands: {
      default: 'curl https://cursor.com/install -fsS | bash',
      macos: 'brew install --cask cursor-cli',
      linux: 'curl https://cursor.com/install -fsS | bash',
      notes: 'Closed source; requires a Cursor account. On Windows, run the install script inside WSL. Launch with `cursor-agent`.'
    },
    repoUrl: 'https://cursor.com/cli',
    features: ['Interactive and headless modes', 'Shared editor rules', 'Approval-gated shell commands', 'Multi-model support'],
    tags: ['coding', 'proprietary', 'automation'],
    useCases: ['Running Cursor agents in CI pipelines.', 'Editing remote machines over SSH.', 'Keeping one rule set across editor and terminal.'],
    reviews: [],
    version: '2026.10.16'
  },
  {
    id: 'kilo-cli',
    name: 'Kilo Code CLI',
    description: 'Open-source agentic engineering platform with a terminal-first CLI.',
    longDescription: 'Kilo Code combines planning, coding, and debugging modes in one agent. The CLI exposes the same orchestration as the IDE extensions, supports hundreds of models through a single gateway or your own keys, and runs headless for automation.',
    category: AgentCategory.CODING,
    stars: 27596,
    language: 'TypeScript',
    installCommand: 'npm install -g @kilocode/cli',
    platformCommands: {
      default: 'npm install -g @kilocode/cli',
      windows: 'npm install -g @kilocode/cli',
      macos: 'brew install Kilo-Org/tap/kilo',
      linux: 'curl -fsSL https://kilo.ai/cli/install | bash',
      notes: 'Start with `kilo` in a project directory. Bring your own API keys or use a Kilo account.'
    },
    repoUrl: 'https://github.com/Kilo-Org/kilocode',
    features: ['Architect / Code / Debug modes', 'Bring-your-own-key models', 'Headless automation', 'MCP marketplace'],
    tags: ['coding', 'open-source', 'planning'],
    useCases: ['Planning a refactor before touching code.', 'Comparing models on the same task.', 'Unattended fixes in scripts.'],
    reviews: [],
    version: '7.8.12'
  },
  {
    id: 'continue-cli',
    name: 'Continue CLI',
    description: 'Continue\'s open-source agent, packaged as a terminal tool (`cn`).',
    longDescription: 'The Continue CLI runs the Continue coding agent outside the IDE. It reuses your Continue configuration, models, rules, and MCP tools, and can run interactively or headless to power CI checks and background agents.',
    category: AgentCategory.CODING,
    stars: 36193,
    language: 'TypeScript',
    installCommand: 'npm i -g @continuedev/cli',
    platformCommands: {
      default: 'npm i -g @continuedev/cli',
      windows: 'irm https://raw.githubusercontent.com/continuedev/continue/main/extensions/cli/scripts/install.ps1 | iex',
      linux: 'curl -fsSL https://raw.githubusercontent.com/continuedev/continue/main/extensions/cli/scripts/install.sh | bash',
      macos: 'curl -fsSL https://raw.githubusercontent.com/continuedev/continue/main/extensions/cli/scripts/install.sh | bash',
      notes: 'npm install requires Node.js 20+. Launch with `cn`.'
    },
    repoUrl: 'https://github.com/continuedev/continue',
    features: ['Shared IDE configuration', 'Headless CI mode', 'Custom rules and prompts', 'MCP tool support'],
    tags: ['coding', 'open-source', 'automation'],
    useCases: ['Enforcing team rules as CI checks.', 'Reusing IDE agent setups in the terminal.', 'Background agents on pull requests.'],
    reviews: [],
    version: '1.5.47'
  },
  {
    id: 'kimi-code',
    name: 'Kimi Code CLI',
    description: 'Moonshot AI\'s next-generation terminal coding agent.',
    longDescription: 'Kimi Code CLI is the successor to the archived Python Kimi CLI. It is a TypeScript terminal agent tuned for Kimi models that reads and edits code, runs shell commands, and integrates with editors through the Agent Client Protocol.',
    category: AgentCategory.CODING,
    stars: 7891,
    language: 'TypeScript',
    installCommand: 'curl -fsSL https://code.kimi.com/kimi-code/install.sh | bash',
    platformCommands: {
      default: 'curl -fsSL https://code.kimi.com/kimi-code/install.sh | bash',
      windows: 'irm https://code.kimi.com/kimi-code/install.ps1 | iex',
      macos: 'brew install kimi-code',
      linux: 'curl -fsSL https://code.kimi.com/kimi-code/install.sh | bash',
      notes: 'Also on npm as @moonshot-ai/kimi-code. Uninstall the legacy `kimi-cli` (uv tool uninstall kimi-cli) after migrating.'
    },
    repoUrl: 'https://github.com/MoonshotAI/kimi-code',
    features: ['Kimi model integration', 'Shell command execution', 'Agent Client Protocol support', 'MCP tools'],
    tags: ['coding', 'open-source', 'autonomous'],
    useCases: ['Long-context code navigation.', 'Driving an agent from Zed or other ACP editors.', 'Migrating from the legacy Kimi CLI.'],
    reviews: [],
    version: '2.2.0'
  },
  {
    id: 'letta-code',
    name: 'Letta Code',
    description: 'Memory-first coding agent that learns your codebase across sessions.',
    longDescription: 'Letta Code is a terminal agent built on Letta\'s stateful agent platform. Instead of starting from zero each session, it keeps long-term memory about your projects and preferences and improves the more you use it.',
    category: AgentCategory.AUTONOMOUS,
    stars: 3635,
    language: 'TypeScript',
    installCommand: 'npm install -g @letta-ai/letta-code',
    platformCommands: {
      default: 'npm install -g @letta-ai/letta-code',
      windows: 'npm install -g @letta-ai/letta-code',
      notes: 'Requires Node.js. Connect to Letta Cloud or a self-hosted Letta server.'
    },
    repoUrl: 'https://github.com/letta-ai/letta-code',
    features: ['Persistent agent memory', 'Model-agnostic', 'Self-hostable backend', 'Skill learning'],
    tags: ['coding', 'autonomous', 'open-source'],
    useCases: ['Long-running projects that need continuity.', 'Teaching an agent team conventions once.', 'Self-hosted stateful agents.'],
    reviews: [],
    version: '0.34.17'
  },
  {
    id: 'claude-squad',
    name: 'Claude Squad',
    description: 'Run and manage multiple AI coding agents in parallel from one TUI.',
    longDescription: 'Claude Squad manages several terminal agents such as Claude Code, Codex, Aider, and Gemini CLI side by side. Each task gets its own git worktree and tmux session, so agents work in isolation and you review changes before they land.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 8597,
    language: 'Go',
    installCommand: 'brew install claude-squad',
    platformCommands: {
      default: 'brew install claude-squad',
      macos: 'brew install claude-squad',
      linux: 'curl -fsSL https://raw.githubusercontent.com/smtg-ai/claude-squad/main/install.sh | bash',
      notes: 'Requires tmux and git. Launch with `cs`.'
    },
    repoUrl: 'https://github.com/smtg-ai/claude-squad',
    features: ['Parallel agent sessions', 'Isolated git worktrees', 'Review-before-apply diffs', 'Auto-accept background mode'],
    tags: ['coding', 'tui', 'git', 'productivity'],
    useCases: ['Fanning one backlog out to several agents.', 'Comparing agent outputs on the same task.', 'Keeping experimental changes off the main branch.'],
    reviews: [],
    version: '1.0.20'
  },
  {
    id: 'ccusage',
    name: 'ccusage',
    description: 'Token usage and cost reports for coding-agent CLIs, from local logs.',
    longDescription: 'ccusage reads the local session logs written by Claude Code and other agent CLIs and turns them into daily, monthly, session, and billing-window reports. Nothing leaves your machine; it simply parses files already on disk.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 19031,
    language: 'Rust',
    installCommand: 'npm install -g ccusage',
    platformCommands: {
      default: 'npm install -g ccusage',
      windows: 'npm install -g ccusage',
      notes: 'Or run without installing: `npx ccusage@latest`.'
    },
    repoUrl: 'https://github.com/ccusage/ccusage',
    features: ['Daily and monthly reports', 'Per-session breakdowns', 'Billing-window tracking', 'JSON output'],
    tags: ['utility', 'privacy', 'offline', 'monitoring'],
    useCases: ['Tracking agent spend per project.', 'Spotting runaway sessions.', 'Exporting usage for budgeting.'],
    reviews: [],
    version: '20.0.36'
  },
  // --- 30.0 AI CONTEXT & PROTOCOL TOOLING ---
  {
    id: 'spec-kit',
    name: 'Spec Kit',
    description: 'GitHub\'s toolkit for spec-driven development with AI coding agents.',
    longDescription: 'Spec Kit\'s `specify` CLI bootstraps a project for spec-driven development: you write the intent and constraints first, then guide any supported agent through plan, task, and implementation phases with consistent slash commands.',
    category: AgentCategory.FRAMEWORK,
    stars: 141128,
    language: 'Python',
    installCommand: 'uv tool install specify-cli',
    platformCommands: {
      default: 'uv tool install specify-cli',
      windows: 'uv tool install specify-cli',
      notes: 'Requires uv. Run `specify init <project>` and choose your agent (Claude Code, Copilot, Gemini CLI, Codex, and more).'
    },
    repoUrl: 'https://github.com/github/spec-kit',
    features: ['Spec → plan → tasks workflow', 'Multi-agent templates', 'Project constitution files', 'Slash-command scaffolding'],
    tags: ['framework', 'planning', 'github', 'open-source'],
    useCases: ['Keeping agents aligned with written requirements.', 'Standardizing agent workflows across a team.', 'Greenfield projects with clear specs.'],
    reviews: [],
    version: '1.2.1'
  },
  {
    id: 'mcp-inspector',
    name: 'MCP Inspector',
    description: 'Official visual and CLI tool for testing Model Context Protocol servers.',
    longDescription: 'MCP Inspector connects to any MCP server over stdio or HTTP and lets you list and call tools, read resources, and render prompts. It runs as a web UI, a scriptable CLI, or a TUI, making it the standard way to debug MCP integrations.',
    category: AgentCategory.DEVELOPMENT,
    stars: 11090,
    language: 'TypeScript',
    installCommand: 'npm install -g @modelcontextprotocol/inspector',
    platformCommands: {
      default: 'npm install -g @modelcontextprotocol/inspector',
      windows: 'npm install -g @modelcontextprotocol/inspector',
      notes: 'Usually run on demand: `npx @modelcontextprotocol/inspector` (web UI), add `--cli` or `--tui` for terminal modes.'
    },
    repoUrl: 'https://github.com/modelcontextprotocol/inspector',
    features: ['Web UI, CLI, and TUI modes', 'Tool and resource explorer', 'stdio and HTTP transports', 'Request history'],
    tags: ['mcp', 'debugging', 'official', 'open-source'],
    useCases: ['Debugging a new MCP server.', 'Scripting MCP smoke tests in CI.', 'Exploring third-party MCP tools before wiring them in.'],
    reviews: [],
    version: '2.11.0'
  },
  {
    id: 'repomix',
    name: 'Repomix',
    description: 'Packs an entire repository into one AI-friendly file.',
    longDescription: 'Repomix walks a local or remote repository, respects ignore rules, and emits a single XML, Markdown, or plain-text file with a directory tree and token counts. Built-in secret scanning keeps credentials out of what you paste into an LLM.',
    category: AgentCategory.DEVELOPMENT,
    stars: 28793,
    language: 'TypeScript',
    installCommand: 'npm install -g repomix',
    platformCommands: {
      default: 'npm install -g repomix',
      windows: 'npm install -g repomix',
      macos: 'brew install repomix',
      linux: 'brew install repomix',
      notes: 'Or run without installing: `npx repomix@latest`. Can also run as an MCP server (`repomix --mcp`).'
    },
    repoUrl: 'https://github.com/yamadashy/repomix',
    features: ['Token counting', 'Secret scanning', 'Remote repository packing', 'MCP server mode'],
    tags: ['context', 'productivity', 'security', 'open-source'],
    useCases: ['Giving a chat model full-repo context.', 'Code review prompts for large diffs.', 'Archiving a codebase snapshot as text.'],
    reviews: [],
    version: '1.18.1'
  },
  {
    id: 'gitingest',
    name: 'Gitingest',
    description: 'Turns any Git repository into a prompt-friendly text digest.',
    longDescription: 'Gitingest summarizes a repository into a structured text digest with file tree, contents, and size statistics. Use it from the CLI, as a Python library, or by swapping "hub" for "ingest" in any GitHub URL.',
    category: AgentCategory.DEVELOPMENT,
    stars: 15917,
    language: 'Python',
    installCommand: 'pipx install gitingest',
    platformCommands: {
      default: 'pipx install gitingest',
      windows: 'pipx install gitingest',
      macos: 'brew install gitingest',
      notes: 'Run `gitingest <path-or-url>`; private repositories need a GitHub token via --token.'
    },
    repoUrl: 'https://github.com/coderamp-labs/gitingest',
    features: ['CLI and Python API', 'Include/exclude patterns', 'Token estimates', 'Private repo support'],
    tags: ['context', 'python', 'open-source'],
    useCases: ['Fast repository summaries for LLM prompts.', 'Comparing project structures.', 'Feeding docs pipelines.'],
    reviews: [],
    version: '0.3.1'
  },
  {
    id: 'mlx-lm',
    name: 'MLX LM',
    description: 'Run and fine-tune LLMs on Apple silicon with Apple\'s MLX framework.',
    longDescription: 'MLX LM provides `mlx_lm.generate`, `mlx_lm.chat`, `mlx_lm.server`, and LoRA fine-tuning commands that run natively on Apple silicon unified memory, pulling quantized models directly from the Hugging Face Hub.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 7386,
    language: 'Python',
    installCommand: 'pip install mlx-lm',
    platformCommands: {
      default: 'pip install mlx-lm',
      macos: 'brew install mlx-lm',
      notes: 'Apple silicon (M-series) Macs only. `uv tool install mlx-lm` is also supported.'
    },
    repoUrl: 'https://github.com/ml-explore/mlx-lm',
    features: ['Native Apple silicon inference', 'LoRA / QLoRA fine-tuning', 'OpenAI-compatible server', 'Model quantization'],
    tags: ['local-llm', 'inference', 'python', 'offline'],
    useCases: ['Private local chat on a MacBook.', 'Fine-tuning small models on-device.', 'Serving a local OpenAI-compatible endpoint.'],
    reviews: [],
    version: '0.32.2'
  },
  {
    id: 'ramalama',
    name: 'RamaLama',
    description: 'Run AI models in OCI containers, with GPU detection handled for you.',
    longDescription: 'RamaLama pulls models from Hugging Face, Ollama, or OCI registries and serves them inside Podman or Docker containers matched to your GPU. It keeps inference isolated from the host and makes models as portable as container images.',
    category: AgentCategory.INFRASTRUCTURE,
    stars: 3087,
    language: 'Python',
    installCommand: 'pip install ramalama',
    platformCommands: {
      default: 'pip install ramalama',
      macos: 'brew install ramalama',
      linux: 'curl -fsSL https://ramalama.ai/install.sh | bash',
      notes: 'Requires Podman or Docker. Try `ramalama run granite` to get started.'
    },
    repoUrl: 'https://github.com/containers/ramalama',
    features: ['Automatic GPU image selection', 'Rootless container isolation', 'Multiple model registries', 'OpenAI-compatible serving'],
    tags: ['local-llm', 'inference', 'docker', 'privacy'],
    useCases: ['Sandboxed local inference.', 'Shipping models as OCI artifacts.', 'Reproducible model serving across machines.'],
    reviews: [],
    version: '0.25.0'
  },
  {
    id: 'crewai',
    name: 'CrewAI',
    description: 'Framework and CLI for orchestrating teams of role-playing AI agents.',
    longDescription: 'CrewAI lets you define agents with roles, goals, and tools, then compose them into crews and event-driven flows. The `crewai` CLI scaffolds projects, runs crews, and manages training and testing loops.',
    category: AgentCategory.FRAMEWORK,
    stars: 59796,
    language: 'Python',
    installCommand: 'uv tool install crewai',
    platformCommands: {
      default: 'uv tool install crewai',
      windows: 'uv tool install crewai',
      notes: 'Requires uv and Python 3.10+. Scaffold with `crewai create crew <name>`, run with `crewai run`.'
    },
    repoUrl: 'https://github.com/crewAIInc/crewAI',
    features: ['Role-based agent crews', 'Event-driven flows', 'Project scaffolding CLI', 'Tool integrations'],
    tags: ['framework', 'python', 'autonomous', 'open-source'],
    useCases: ['Multi-agent research pipelines.', 'Content generation with reviewer agents.', 'Business process automation.'],
    reviews: [],
    version: '1.15.28'
  },
  {
    id: 'smolagents',
    name: 'smolagents',
    description: 'Hugging Face\'s barebones library for agents that think in code.',
    longDescription: 'smolagents builds agents that write and execute Python snippets as their actions, which tends to need fewer steps than JSON tool calling. It ships `smolagent` and `webagent` CLI entry points and supports sandboxed execution backends.',
    category: AgentCategory.FRAMEWORK,
    stars: 29907,
    language: 'Python',
    installCommand: 'pip install "smolagents[toolkit]"',
    platformCommands: {
      default: 'pip install "smolagents[toolkit]"',
      windows: 'pip install "smolagents[toolkit]"',
      notes: 'Use a sandbox (E2B, Docker, or similar) for code execution with untrusted inputs.'
    },
    repoUrl: 'https://github.com/huggingface/smolagents',
    features: ['Code-as-action agents', 'Model-agnostic', 'Sandboxed executors', 'Hub tool sharing'],
    tags: ['framework', 'python', 'sandbox', 'open-source'],
    useCases: ['Lightweight research agents.', 'Prototyping tool-using agents quickly.', 'Teaching agent fundamentals.'],
    reviews: [],
    version: '1.26.0'
  },
  {
    id: 'langgraph-cli',
    name: 'LangGraph CLI',
    description: 'Build, run, and deploy stateful LangGraph agents from the command line.',
    longDescription: 'The LangGraph CLI scaffolds agent projects from templates, runs a local development server with hot reload and the LangGraph Studio UI, and builds Docker images for deploying long-running, stateful agent graphs.',
    category: AgentCategory.FRAMEWORK,
    stars: 43219,
    language: 'Python',
    installCommand: 'pip install -U "langgraph-cli[inmem]"',
    platformCommands: {
      default: 'pip install -U "langgraph-cli[inmem]"',
      windows: 'pip install -U "langgraph-cli[inmem]"',
      notes: 'Start a project with `langgraph new`, develop with `langgraph dev`, build images with `langgraph build`.'
    },
    repoUrl: 'https://github.com/langchain-ai/langgraph',
    features: ['Project templates', 'Hot-reload dev server', 'Studio debugging UI', 'Docker image builds'],
    tags: ['framework', 'python', 'docker', 'open-source'],
    useCases: ['Developing durable multi-step agents.', 'Human-in-the-loop workflows.', 'Packaging agents for production.'],
    reviews: [],
    version: '0.4.36'
  },
  // --- 31.0 SHELLS, MULTIPLEXERS & PROMPTS ---
  {
    id: 'atuin',
    name: 'Atuin',
    description: 'Magical shell history: searchable, synced, and stored in SQLite.',
    longDescription: 'Atuin replaces your shell history with a SQLite database that records context such as exit code, duration, and directory. A full-screen search UI replaces Ctrl-R, and optional end-to-end encrypted sync keeps history consistent across machines.',
    category: AgentCategory.SHELL_UTILITY,
    stars: 31999,
    language: 'Rust',
    installCommand: 'brew install atuin',
    platformCommands: {
      default: 'brew install atuin',
      windows: 'scoop install atuin',
      macos: 'brew install atuin',
      linux: 'curl --proto \'=https\' --tlsv1.2 -LsSf https://setup.atuin.sh | sh',
      notes: 'Add the shell hook (e.g. `eval "$(atuin init zsh)"`), then `atuin import auto` to bring in existing history.'
    },
    repoUrl: 'https://github.com/atuinsh/atuin',
    features: ['Full-screen history search', 'Encrypted multi-device sync', 'Rich command context', 'Usage statistics'],
    tags: ['shell', 'rust', 'productivity', 'search'],
    useCases: ['Finding that one command from last month.', 'Sharing history between laptop and servers.', 'Auditing which commands fail most.'],
    reviews: [],
    version: '18.24.1'
  },
  {
    id: 'zellij',
    name: 'Zellij',
    description: 'Terminal workspace and multiplexer with batteries included.',
    longDescription: 'Zellij is a modern terminal multiplexer with discoverable keybindings, floating and stacked panes, layouts defined in KDL, session resurrection, and a WebAssembly plugin system.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 35658,
    language: 'Rust',
    installCommand: 'brew install zellij',
    platformCommands: {
      default: 'brew install zellij',
      windows: 'scoop install zellij',
      macos: 'brew install zellij',
      linux: 'cargo install --locked zellij',
      notes: 'Start with `zellij`; the status bar shows every keybinding mode.'
    },
    repoUrl: 'https://github.com/zellij-org/zellij',
    features: ['Floating and stacked panes', 'Declarative layouts', 'Session resurrection', 'WASM plugins'],
    tags: ['multiplexer', 'terminal', 'rust', 'productivity'],
    useCases: ['Persistent remote work sessions.', 'Reproducible dev layouts.', 'Watching several agents at once.'],
    reviews: [],
    version: '0.45.1'
  },
  {
    id: 'tmux',
    name: 'tmux',
    description: 'The classic terminal multiplexer for persistent, scriptable sessions.',
    longDescription: 'tmux lets one terminal host many windows and panes, detach and reattach sessions over SSH, and script layouts from the shell. It is the foundation many agent orchestrators use to run work in the background.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 49918,
    language: 'C',
    installCommand: 'brew install tmux',
    platformCommands: {
      default: 'brew install tmux',
      macos: 'brew install tmux',
      linux: 'sudo apt install tmux',
      notes: 'No native Windows build; use it inside WSL. Prefix key is Ctrl-b by default.'
    },
    repoUrl: 'https://github.com/tmux/tmux',
    features: ['Detachable sessions', 'Panes and windows', 'Scriptable control', 'Copy mode'],
    tags: ['multiplexer', 'terminal', 'c', 'ssh'],
    useCases: ['Keeping jobs alive after SSH disconnects.', 'Pair programming on a shared session.', 'Backgrounding long agent runs.'],
    reviews: [],
    version: '3.8'
  },
  {
    id: 'nushell',
    name: 'Nushell',
    description: 'A new type of shell where pipelines carry structured data.',
    longDescription: 'Nushell treats command output as tables and records instead of plain text, so you can filter, sort, and transform JSON, CSV, YAML, and SQLite with one consistent language. It runs natively on Linux, macOS, and Windows.',
    category: AgentCategory.SHELL_UTILITY,
    stars: 40643,
    language: 'Rust',
    installCommand: 'brew install nushell',
    platformCommands: {
      default: 'brew install nushell',
      windows: 'scoop install nu',
      macos: 'brew install nushell',
      linux: 'cargo install nu --locked',
      notes: 'Launch with `nu`. Configuration lives in `$nu.config-path`.'
    },
    repoUrl: 'https://github.com/nushell/nushell',
    features: ['Structured data pipelines', 'Built-in format parsers', 'Cross-platform', 'Typed custom commands'],
    tags: ['shell', 'rust', 'data'],
    useCases: ['Querying JSON APIs without jq.', 'Cross-platform scripts that run on Windows.', 'Interactive data exploration.'],
    reviews: [],
    version: '0.116.1'
  },
  {
    id: 'fish',
    name: 'fish shell',
    description: 'The friendly interactive shell with great defaults out of the box.',
    longDescription: 'fish provides syntax highlighting, autosuggestions from history, and tab completions generated from man pages with zero configuration. Version 4 is a full rewrite in Rust.',
    category: AgentCategory.SHELL_UTILITY,
    stars: 34297,
    language: 'Rust',
    installCommand: 'brew install fish',
    platformCommands: {
      default: 'brew install fish',
      macos: 'brew install fish',
      linux: 'sudo apt install fish',
      notes: 'No native Windows build; use WSL or MSYS2. Not POSIX-compatible, so keep bash for portable scripts.'
    },
    repoUrl: 'https://github.com/fish-shell/fish-shell',
    features: ['Autosuggestions', 'Syntax highlighting', 'Man-page completions', 'Web-based config'],
    tags: ['shell', 'rust', 'productivity'],
    useCases: ['A pleasant interactive shell with no setup.', 'Discovering flags through completions.', 'Teaching newcomers the command line.'],
    reviews: [],
    version: '4.9.3'
  },
  {
    id: 'gum',
    name: 'Gum',
    description: 'Glamorous, interactive building blocks for shell scripts.',
    longDescription: 'Gum from Charm adds prompts, choosers, fuzzy filters, spinners, confirmations, and styled text to plain shell scripts with single commands, so you can build friendly CLIs without writing Go.',
    category: AgentCategory.SHELL_UTILITY,
    stars: 24508,
    language: 'Go',
    installCommand: 'brew install gum',
    platformCommands: {
      default: 'brew install gum',
      windows: 'scoop install gum',
      macos: 'brew install gum',
      linux: 'go install github.com/charmbracelet/gum@latest',
      notes: 'Example: `gum choose "fix" "feat" "docs"` inside a commit helper script.'
    },
    repoUrl: 'https://github.com/charmbracelet/gum',
    features: ['Interactive prompts', 'Fuzzy filtering', 'Spinners and progress', 'Styled output'],
    tags: ['shell', 'go', 'tui', 'bash'],
    useCases: ['Interactive commit-message helpers.', 'Friendly install scripts.', 'Menus for team runbooks.'],
    reviews: [],
    version: '2.0.2'
  },
  {
    id: 'oh-my-posh',
    name: 'Oh My Posh',
    description: 'Prompt theme engine for any shell, on any OS.',
    longDescription: 'Oh My Posh renders a fast, themeable prompt for PowerShell, bash, zsh, fish, nushell, and more, with segments for git, languages, cloud contexts, and battery. Hundreds of community themes ship with it.',
    category: AgentCategory.THEMING,
    stars: 23589,
    language: 'Go',
    installCommand: 'brew install oh-my-posh',
    platformCommands: {
      default: 'brew install oh-my-posh',
      windows: 'scoop install oh-my-posh',
      macos: 'brew install oh-my-posh',
      linux: 'curl -s https://ohmyposh.dev/install.sh | bash -s',
      notes: 'Install a Nerd Font for icons, then add the init line for your shell from ohmyposh.dev.'
    },
    repoUrl: 'https://github.com/JanDeDobbeleer/oh-my-posh',
    features: ['Any-shell support', 'Hundreds of themes', 'Git and cloud segments', 'Transient prompt'],
    tags: ['theming', 'shell', 'go'],
    useCases: ['One prompt across PowerShell and zsh.', 'Showing Kubernetes/AWS context at a glance.', 'Customizing terminal aesthetics.'],
    reviews: [],
    version: '31.8.0'
  },
  {
    id: 'fastfetch',
    name: 'Fastfetch',
    description: 'Fast, highly customizable system information display.',
    longDescription: 'Fastfetch prints system information next to a distro logo, like neofetch but written in C for speed. It supports dozens of modules, JSON configuration, and custom logos, and runs on Linux, macOS, Windows, and BSD.',
    category: AgentCategory.THEMING,
    stars: 24937,
    language: 'C',
    installCommand: 'brew install fastfetch',
    platformCommands: {
      default: 'brew install fastfetch',
      windows: 'scoop install fastfetch',
      macos: 'brew install fastfetch',
      linux: 'sudo apt install fastfetch',
      notes: 'Generate a config with `fastfetch --gen-config`.'
    },
    repoUrl: 'https://github.com/fastfetch-cli/fastfetch',
    features: ['Dozens of info modules', 'Custom logos', 'JSON configuration', 'Cross-platform'],
    tags: ['theming', 'c', 'utility'],
    useCases: ['Terminal startup banners.', 'Quick hardware/OS summaries for bug reports.', 'Rice screenshots.'],
    reviews: [],
    version: '2.70.0'
  },
  // --- 32.0 DEVELOPER WORKFLOW ---
  {
    id: 'uv',
    name: 'uv',
    description: 'Extremely fast Python package and project manager, written in Rust.',
    longDescription: 'uv replaces pip, pip-tools, pipx, poetry, pyenv, and virtualenv with one tool that is 10-100x faster. It manages Python versions, lockfiles, workspaces, and globally installed tools (`uv tool install`).',
    category: AgentCategory.DEVELOPMENT,
    stars: 90706,
    language: 'Rust',
    installCommand: 'curl -LsSf https://astral.sh/uv/install.sh | sh',
    platformCommands: {
      default: 'curl -LsSf https://astral.sh/uv/install.sh | sh',
      windows: 'powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"',
      macos: 'brew install uv',
      linux: 'curl -LsSf https://astral.sh/uv/install.sh | sh',
      notes: 'Many Python agent CLIs in this registry install with `uv tool install`.'
    },
    repoUrl: 'https://github.com/astral-sh/uv',
    features: ['Python version management', 'Universal lockfiles', 'Tool installs (pipx replacement)', 'Workspaces'],
    tags: ['python', 'rust', 'development', 'productivity'],
    useCases: ['Installing Python CLIs in isolation.', 'Reproducible project environments.', 'Fast CI dependency installs.'],
    reviews: [],
    version: '0.13.1'
  },
  {
    id: 'mise',
    name: 'mise',
    description: 'Polyglot dev tool, env var, and task manager (asdf successor).',
    longDescription: 'mise installs and switches versions of Node, Python, Go, Rust, and hundreds of other tools per directory, loads environment variables like direnv, and runs project tasks, all from one `mise.toml`.',
    category: AgentCategory.DEVELOPMENT,
    stars: 34943,
    language: 'Rust',
    installCommand: 'curl https://mise.run | sh',
    platformCommands: {
      default: 'curl https://mise.run | sh',
      windows: 'scoop install mise',
      macos: 'brew install mise',
      linux: 'curl https://mise.run | sh',
      notes: 'Activate in your shell: `eval "$(mise activate zsh)"` (or bash/fish).'
    },
    repoUrl: 'https://github.com/jdx/mise',
    features: ['Per-directory tool versions', 'Environment management', 'Task runner', 'asdf plugin compatibility'],
    tags: ['development', 'rust', 'productivity'],
    useCases: ['Pinning Node and Python versions per repo.', 'Replacing asdf, nvm, and pyenv.', 'Project task automation.'],
    reviews: [],
    version: '2026.10.14'
  },
  {
    id: 'direnv',
    name: 'direnv',
    description: 'Loads and unloads environment variables based on the current directory.',
    longDescription: 'direnv hooks into your shell and evaluates an `.envrc` file when you enter a directory, exporting project-specific variables and unloading them when you leave. Every `.envrc` must be explicitly allowed first.',
    category: AgentCategory.DEVELOPMENT,
    stars: 15486,
    language: 'Go',
    installCommand: 'brew install direnv',
    platformCommands: {
      default: 'brew install direnv',
      windows: 'scoop install direnv',
      macos: 'brew install direnv',
      linux: 'sudo apt install direnv',
      notes: 'Add `eval "$(direnv hook zsh)"` to your shell rc, then `direnv allow` in each project.'
    },
    repoUrl: 'https://github.com/direnv/direnv',
    features: ['Per-directory env vars', 'Explicit allow-listing', 'Shell-agnostic hooks', 'stdlib helpers'],
    tags: ['development', 'go', 'shell', 'security'],
    useCases: ['Scoping API keys to one project.', 'Auto-activating virtualenvs.', 'Per-repo cloud profiles.'],
    reviews: [],
    version: '2.38.2'
  },
  {
    id: 'hyperfine',
    name: 'hyperfine',
    description: 'Statistical command-line benchmarking tool.',
    longDescription: 'hyperfine runs commands repeatedly with warmup runs, reports mean, standard deviation, and outliers, compares multiple commands side by side, and exports results to Markdown, JSON, or CSV.',
    category: AgentCategory.DEVELOPMENT,
    stars: 29111,
    language: 'Rust',
    installCommand: 'brew install hyperfine',
    platformCommands: {
      default: 'brew install hyperfine',
      windows: 'scoop install hyperfine',
      macos: 'brew install hyperfine',
      linux: 'sudo apt install hyperfine',
      notes: 'Example: `hyperfine --warmup 3 "fd -e ts" "find . -name \'*.ts\'"`.'
    },
    repoUrl: 'https://github.com/sharkdp/hyperfine',
    features: ['Statistical analysis', 'Warmup and prepare steps', 'Parameter scans', 'Markdown/JSON export'],
    tags: ['development', 'rust', 'utility'],
    useCases: ['Proving a performance fix.', 'Comparing CLI alternatives.', 'Regression benchmarks in CI.'],
    reviews: [],
    version: '2.0.0'
  },
  {
    id: 'tokei',
    name: 'tokei',
    description: 'Counts lines of code, comments, and blanks, fast.',
    longDescription: 'tokei scans a codebase and reports code, comment, and blank line counts per language across more than 200 languages, with output as tables, JSON, or YAML.',
    category: AgentCategory.DEVELOPMENT,
    stars: 14984,
    language: 'Rust',
    installCommand: 'brew install tokei',
    platformCommands: {
      default: 'brew install tokei',
      windows: 'scoop install tokei',
      macos: 'brew install tokei',
      linux: 'cargo install tokei',
      notes: 'Run `tokei` in a project root; respects .gitignore.'
    },
    repoUrl: 'https://github.com/XAMPPRocky/tokei',
    features: ['200+ languages', 'Comment-aware counting', 'JSON/YAML output', 'gitignore support'],
    tags: ['development', 'rust', 'utility'],
    useCases: ['Sizing a codebase before an agent run.', 'Tracking project growth.', 'Language breakdowns for reports.'],
    reviews: [],
    version: '15.0.0'
  },
  {
    id: 'chezmoi',
    name: 'chezmoi',
    description: 'Manage your dotfiles across multiple machines, securely.',
    longDescription: 'chezmoi keeps dotfiles in a git repository and applies them with per-machine templates, encrypted secrets, and password-manager integrations, so one source of truth works on every laptop and server.',
    category: AgentCategory.PRODUCTIVITY,
    stars: 21932,
    language: 'Go',
    installCommand: 'brew install chezmoi',
    platformCommands: {
      default: 'brew install chezmoi',
      windows: 'scoop install chezmoi',
      macos: 'brew install chezmoi',
      linux: 'sh -c "$(curl -fsLS get.chezmoi.io)"',
      notes: 'Bootstrap a new machine with `chezmoi init --apply <github-user>`.'
    },
    repoUrl: 'https://github.com/twpayne/chezmoi',
    features: ['Machine-specific templates', 'Encrypted secrets', 'Password manager integration', 'Git-backed'],
    tags: ['organization', 'go', 'git', 'security'],
    useCases: ['Setting up a new laptop in minutes.', 'Sharing configs between macOS and Linux.', 'Keeping secrets out of public dotfiles.'],
    reviews: [],
    version: '2.73.2'
  },
  {
    id: 'calcurse',
    name: 'calcurse',
    description: 'Text-based calendar and scheduling organizer.',
    longDescription: 'calcurse is an ncurses calendar, appointment, and todo manager with configurable notifications, iCalendar import/export, and a scriptable non-interactive mode.',
    category: AgentCategory.PRODUCTIVITY,
    stars: 1308,
    language: 'C',
    installCommand: 'brew install calcurse',
    platformCommands: {
      default: 'brew install calcurse',
      macos: 'brew install calcurse',
      linux: 'sudo apt install calcurse',
      notes: 'No native Windows build; use WSL. Data lives in ~/.local/share/calcurse.'
    },
    repoUrl: 'https://github.com/lfos/calcurse',
    features: ['Appointments and todos', 'iCal import/export', 'Notifications', 'Non-interactive mode'],
    tags: ['organization', 'tui', 'c', 'time-tracking'],
    useCases: ['Keyboard-driven scheduling.', 'Syncing with CalDAV via iCal.', 'Agenda output in scripts.'],
    reviews: [],
    version: '4.8.2'
  },
  // --- 33.0 DATA, HTTP & SEARCH ---
  {
    id: 'xh',
    name: 'xh',
    description: 'Friendly and fast tool for sending HTTP requests.',
    longDescription: 'xh reimplements the HTTPie interface as a single Rust binary with fast startup, colorized output, sessions, and the ability to translate requests into curl commands.',
    category: AgentCategory.HTTP_CLIENT,
    stars: 8124,
    language: 'Rust',
    installCommand: 'brew install xh',
    platformCommands: {
      default: 'brew install xh',
      windows: 'scoop install xh',
      macos: 'brew install xh',
      linux: 'curl -sfL https://raw.githubusercontent.com/ducaale/xh/master/install.sh | sh',
      notes: 'HTTPie-compatible syntax: `xh post httpbin.org/post name=ada`.'
    },
    repoUrl: 'https://github.com/ducaale/xh',
    features: ['HTTPie-style syntax', 'Single static binary', 'Sessions', 'curl translation'],
    tags: ['http', 'api', 'rust'],
    useCases: ['Quick API calls while debugging.', 'Readable request examples in docs.', 'Converting requests to curl.'],
    reviews: [],
    version: '0.26.2'
  },
  {
    id: 'posting',
    name: 'Posting',
    description: 'Modern API client that lives in your terminal.',
    longDescription: 'Posting is a keyboard-driven HTTP client TUI with collections stored as readable YAML, environment files, autocompletion, a command palette, and scripting hooks, a Postman-style workflow without leaving the terminal.',
    category: AgentCategory.HTTP_CLIENT,
    stars: 12520,
    language: 'Python',
    installCommand: 'uv tool install posting',
    platformCommands: {
      default: 'uv tool install posting',
      windows: 'uv tool install posting',
      macos: 'brew install posting',
      notes: 'Posting 3 (a Go rewrite) is in beta: `brew install darrenburns/homebrew/posting@beta`.'
    },
    repoUrl: 'https://github.com/darrenburns/posting',
    features: ['YAML collections', 'Environment files', 'Command palette', 'Pre/post request scripts'],
    tags: ['http', 'api', 'tui'],
    useCases: ['Version-controlling API collections.', 'Testing endpoints over SSH.', 'Replacing a GUI API client.'],
    reviews: [],
    version: '2.11.1'
  },
  {
    id: 'harlequin',
    name: 'Harlequin',
    description: 'The SQL IDE for your terminal.',
    longDescription: 'Harlequin is a terminal SQL IDE with a data catalog, query editor, and results viewer. It speaks DuckDB and SQLite out of the box and supports Postgres, MySQL, BigQuery, Snowflake, and more through adapters.',
    category: AgentCategory.DATABASE,
    stars: 6464,
    language: 'Python',
    installCommand: 'uv tool install harlequin',
    platformCommands: {
      default: 'uv tool install harlequin',
      windows: 'uv tool install harlequin',
      macos: 'brew install harlequin',
      notes: 'Add adapters as extras, e.g. `uv tool install "harlequin[postgres]"`.'
    },
    repoUrl: 'https://github.com/tconbeer/harlequin',
    features: ['Data catalog browser', 'Multi-tab query editor', 'Result export', 'Adapter ecosystem'],
    tags: ['sql', 'database', 'tui', 'python'],
    useCases: ['Exploring DuckDB/Parquet files.', 'Querying production replicas over SSH.', 'Lightweight SQL work without a GUI.'],
    reviews: [],
    version: '2.16.2'
  },
  {
    id: 'visidata',
    name: 'VisiData',
    description: 'Terminal spreadsheet multitool for exploring tabular data.',
    longDescription: 'VisiData opens CSV, JSON, Excel, SQLite, Parquet, and dozens of other formats in an interactive grid. Sort, filter, pivot, join, and plot millions of rows using only the keyboard.',
    category: AgentCategory.DATA_PROCESSING,
    stars: 9332,
    language: 'Python',
    installCommand: 'pip install visidata',
    platformCommands: {
      default: 'pip install visidata',
      windows: 'pip install visidata',
      macos: 'brew install visidata',
      notes: 'Launch with `vd <file>`. Some formats need optional Python dependencies.'
    },
    repoUrl: 'https://github.com/saulpw/visidata',
    features: ['Dozens of input formats', 'Pivot tables and joins', 'Frequency analysis', 'Command replay'],
    tags: ['data', 'tui', 'python'],
    useCases: ['Sanity-checking a CSV export.', 'Ad-hoc data analysis on servers.', 'Quick frequency counts on logs.'],
    reviews: [],
    version: '3.4'
  },
  {
    id: 'television',
    name: 'Television',
    description: 'Fast, portable, general-purpose fuzzy finder TUI.',
    longDescription: 'Television (`tv`) is a fuzzy finder built around channels: files, text, git repos, environment variables, and anything else you define. It features live previews and shell integration for smart autocompletion.',
    category: AgentCategory.SEARCH,
    stars: 6355,
    language: 'Rust',
    installCommand: 'brew install television',
    platformCommands: {
      default: 'brew install television',
      windows: 'scoop install television',
      macos: 'brew install television',
      linux: 'cargo install --locked television',
      notes: 'Run `tv` for files or `tv text` for grep-style search; channels are configurable TOML files.'
    },
    repoUrl: 'https://github.com/alexpasmantier/television',
    features: ['Pluggable channels', 'Live previews', 'Shell integration', 'Custom keybindings'],
    tags: ['fuzzy-finder', 'search', 'rust', 'tui'],
    useCases: ['Jumping between files and repos.', 'Searching code with previews.', 'Building custom pickers.'],
    reviews: [],
    version: '0.15.9'
  },
  {
    id: 'ast-grep',
    name: 'ast-grep',
    description: 'Structural code search, lint, and rewrite powered by tree-sitter.',
    longDescription: 'ast-grep matches code by syntax tree patterns instead of text, so searches survive formatting differences. It doubles as a linter with YAML rules and a codemod tool for large-scale, safe rewrites.',
    category: AgentCategory.SEARCH,
    stars: 16246,
    language: 'Rust',
    installCommand: 'brew install ast-grep',
    platformCommands: {
      default: 'brew install ast-grep',
      windows: 'scoop install ast-grep',
      macos: 'brew install ast-grep',
      linux: 'npm install -g @ast-grep/cli',
      notes: 'Binary is `ast-grep` (alias `sg`). Example: `ast-grep -p "console.log($A)" -l ts`.'
    },
    repoUrl: 'https://github.com/ast-grep/ast-grep',
    features: ['Syntax-aware search', 'YAML lint rules', 'Codemod rewrites', 'LSP server'],
    tags: ['search', 'rust', 'development'],
    useCases: ['Migrating deprecated APIs across a monorepo.', 'Custom lint rules without plugins.', 'Precise code search for agents.'],
    reviews: [],
    version: '0.51.0'
  },
  {
    id: 'presenterm',
    name: 'presenterm',
    description: 'Markdown slideshows rendered right in your terminal.',
    longDescription: 'presenterm turns a Markdown file into a terminal slide deck with themes, images, code highlighting, executable code blocks, LaTeX and Mermaid rendering, and PDF export.',
    category: AgentCategory.MARKDOWN,
    stars: 8923,
    language: 'Rust',
    installCommand: 'brew install presenterm',
    platformCommands: {
      default: 'brew install presenterm',
      windows: 'scoop install presenterm',
      macos: 'brew install presenterm',
      linux: 'cargo install --locked presenterm',
      notes: 'Images render best in kitty, iTerm2, or WezTerm.'
    },
    repoUrl: 'https://github.com/mfontanini/presenterm',
    features: ['Markdown slides', 'Executable code blocks', 'Image support', 'PDF export'],
    tags: ['markdown', 'rust', 'documentation'],
    useCases: ['Live-coding talks.', 'Version-controlled presentations.', 'Team demos without leaving the terminal.'],
    reviews: [],
    version: '0.16.1'
  },
  // --- 34.0 SECURITY, NETWORK & INFRA ---
  {
    id: 'trivy',
    name: 'Trivy',
    description: 'All-in-one scanner for vulnerabilities, misconfigurations, and secrets.',
    longDescription: 'Trivy scans container images, filesystems, git repositories, Kubernetes clusters, and IaC for known CVEs, misconfigurations, exposed secrets, and license issues, and can emit SBOMs.',
    category: AgentCategory.SECURITY,
    stars: 38376,
    language: 'Go',
    installCommand: 'brew install trivy',
    platformCommands: {
      default: 'brew install trivy',
      windows: 'scoop install trivy',
      macos: 'brew install trivy',
      linux: 'brew install trivy',
      docker: 'docker run --rm aquasec/trivy image python:3.12-alpine',
      notes: 'First run downloads the vulnerability database. Example: `trivy fs .`.'
    },
    repoUrl: 'https://github.com/aquasecurity/trivy',
    features: ['CVE scanning', 'IaC misconfiguration checks', 'Secret detection', 'SBOM generation'],
    tags: ['security', 'docker', 'kubernetes', 'devops'],
    useCases: ['Gating container images in CI.', 'Auditing Terraform before apply.', 'Generating SBOMs for releases.'],
    reviews: [],
    version: '0.76.0'
  },
  {
    id: 'gitleaks',
    name: 'Gitleaks',
    description: 'Finds secrets such as API keys and tokens in git history and files.',
    longDescription: 'Gitleaks scans repositories, directories, and stdin for hard-coded secrets using hundreds of built-in rules plus your own, and runs as a pre-commit hook or CI step to stop leaks before they ship.',
    category: AgentCategory.SECURITY,
    stars: 30078,
    language: 'Go',
    installCommand: 'brew install gitleaks',
    platformCommands: {
      default: 'brew install gitleaks',
      windows: 'scoop install gitleaks',
      macos: 'brew install gitleaks',
      linux: 'brew install gitleaks',
      docker: 'docker run --rm -v "$PWD":/repo zricethezav/gitleaks:latest git /repo',
      notes: 'Scan the current repo with `gitleaks git .`; use `gitleaks dir` for non-git folders.'
    },
    repoUrl: 'https://github.com/gitleaks/gitleaks',
    features: ['Full git history scanning', 'Custom rules', 'Pre-commit integration', 'SARIF reports'],
    tags: ['security', 'git', 'go'],
    useCases: ['Checking agent-generated commits for keys.', 'Pre-commit secret blocking.', 'Auditing legacy repositories.'],
    reviews: [],
    version: '8.30.1'
  },
  {
    id: 'age',
    name: 'age',
    description: 'Simple, modern, and secure file encryption.',
    longDescription: 'age encrypts files with small explicit keys, SSH keys, or passphrases and has no configuration options to get wrong. It composes cleanly with pipes and is the backend for tools like sops and chezmoi.',
    category: AgentCategory.SECURITY,
    stars: 23925,
    language: 'Go',
    installCommand: 'brew install age',
    platformCommands: {
      default: 'brew install age',
      windows: 'scoop bucket add extras && scoop install age',
      macos: 'brew install age',
      linux: 'sudo apt install age',
      notes: 'Generate a key with `age-keygen -o key.txt`; encrypt with `age -r <recipient> file > file.age`.'
    },
    repoUrl: 'https://github.com/FiloSottile/age',
    features: ['X25519 keys', 'SSH key recipients', 'Passphrase mode', 'Pipe-friendly'],
    tags: ['security', 'encryption', 'go'],
    useCases: ['Encrypting backups.', 'Sharing secrets with teammates via SSH keys.', 'Encrypting dotfile secrets.'],
    reviews: [],
    version: '1.3.2'
  },
  {
    id: 'trippy',
    name: 'Trippy',
    description: 'Network diagnostics combining traceroute and ping in a TUI.',
    longDescription: 'Trippy merges traceroute and ping into one interactive view with per-hop latency, loss, jitter, ASN lookups, GeoIP maps, and ICMP, UDP, or TCP probing.',
    category: AgentCategory.NETWORK,
    stars: 8052,
    language: 'Rust',
    installCommand: 'brew install trippy',
    platformCommands: {
      default: 'brew install trippy',
      windows: 'scoop install trippy',
      macos: 'brew install trippy',
      linux: 'cargo install trippy --locked',
      notes: 'Raw sockets need elevated privileges: run `sudo trip example.com` on Unix.'
    },
    repoUrl: 'https://github.com/fujiapple852/trippy',
    features: ['Per-hop statistics', 'ICMP/UDP/TCP probes', 'ASN and GeoIP lookups', 'Multiple targets'],
    tags: ['network', 'rust', 'tui', 'monitoring'],
    useCases: ['Locating packet loss on a route.', 'Comparing paths to multiple hosts.', 'Network troubleshooting over SSH.'],
    reviews: [],
    version: '0.13.0'
  },
  {
    id: 'gping',
    name: 'gping',
    description: 'Ping, but with a live graph.',
    longDescription: 'gping plots latency for one or more hosts as a real-time terminal graph, and can also graph the execution time of arbitrary commands.',
    category: AgentCategory.NETWORK,
    stars: 12709,
    language: 'Rust',
    installCommand: 'brew install gping',
    platformCommands: {
      default: 'brew install gping',
      windows: 'scoop install gping',
      macos: 'brew install gping',
      linux: 'cargo install gping',
      notes: 'Graph several hosts at once: `gping 1.1.1.1 8.8.8.8`.'
    },
    repoUrl: 'https://github.com/orf/gping',
    features: ['Live latency graph', 'Multiple hosts', 'Command timing mode', 'Cross-platform'],
    tags: ['network', 'rust', 'monitoring'],
    useCases: ['Watching Wi-Fi stability.', 'Comparing DNS resolvers.', 'Spotting latency spikes during deploys.'],
    reviews: [],
    version: '1.21.0'
  },
  {
    id: 'croc',
    name: 'croc',
    description: 'Securely send files and folders between any two computers.',
    longDescription: 'croc transfers files over an end-to-end encrypted relay using a short code phrase. It works across NATs, resumes interrupted transfers, and runs on every major OS.',
    category: AgentCategory.NETWORK,
    stars: 40595,
    language: 'Go',
    installCommand: 'brew install croc',
    platformCommands: {
      default: 'brew install croc',
      windows: 'scoop install croc',
      macos: 'brew install croc',
      linux: 'curl https://getcroc.schollz.com | bash',
      notes: 'Sender runs `croc send file`; receiver types the printed code phrase.'
    },
    repoUrl: 'https://github.com/schollz/croc',
    features: ['End-to-end encryption (PAKE)', 'Resumable transfers', 'NAT traversal via relay', 'Self-hostable relay'],
    tags: ['network', 'security', 'go'],
    useCases: ['Moving files between laptop and server.', 'Sharing large files without cloud storage.', 'Transfers across different OSes.'],
    reviews: [],
    version: '11.5.4'
  },
  {
    id: 'rclone',
    name: 'rclone',
    description: 'rsync for cloud storage, supporting 70+ providers.',
    longDescription: 'rclone syncs, copies, mounts, and serves files across S3, Google Drive, Dropbox, OneDrive, Backblaze B2, SFTP, and dozens more, with client-side encryption and bandwidth controls.',
    category: AgentCategory.INFRASTRUCTURE,
    stars: 60296,
    language: 'Go',
    installCommand: 'brew install rclone',
    platformCommands: {
      default: 'brew install rclone',
      windows: 'scoop install rclone',
      macos: 'brew install rclone',
      linux: 'sudo -v ; curl https://rclone.org/install.sh | sudo bash',
      notes: 'Configure remotes interactively with `rclone config`.'
    },
    repoUrl: 'https://github.com/rclone/rclone',
    features: ['70+ storage backends', 'Client-side encryption', 'FUSE mounts', 'Bisync'],
    tags: ['cloud', 'go', 'automation'],
    useCases: ['Offsite backups to S3/B2.', 'Migrating between cloud drives.', 'Mounting buckets as local folders.'],
    reviews: [],
    version: '1.75.2'
  },
  {
    id: 'btop',
    name: 'btop',
    description: 'Gorgeous resource monitor for CPU, memory, disks, network, and processes.',
    longDescription: 'btop is the C++ successor to bashtop and bpytop, showing live graphs for CPU, memory, disks, network, and GPUs alongside a sortable, filterable process list with mouse support and themes.',
    category: AgentCategory.DEVOPS,
    stars: 34986,
    language: 'C++',
    installCommand: 'brew install btop',
    platformCommands: {
      default: 'brew install btop',
      windows: 'scoop install btop',
      macos: 'brew install btop',
      linux: 'sudo apt install btop',
      notes: 'On Windows, Scoop installs btop4win, a separately maintained port with the same interface.'
    },
    repoUrl: 'https://github.com/aristocratos/btop',
    features: ['Live system graphs', 'GPU monitoring', 'Process tree and filters', 'Themes'],
    tags: ['monitoring', 'c++', 'tui'],
    useCases: ['Watching local model inference load.', 'Finding runaway processes.', 'Server health at a glance.'],
    reviews: [],
    version: '1.4.7'
  },
  {
    id: 'gh-dash',
    name: 'gh-dash',
    description: 'Rich terminal dashboard for GitHub pull requests and issues.',
    longDescription: 'gh-dash is a GitHub CLI extension that shows configurable sections of PRs and issues, with previews, checkout, diff, review, and merge actions bound to keys.',
    category: AgentCategory.GIT_TOOL,
    stars: 12630,
    language: 'Go',
    installCommand: 'gh extension install dlvhdr/gh-dash',
    platformCommands: {
      default: 'gh extension install dlvhdr/gh-dash',
      windows: 'gh extension install dlvhdr/gh-dash',
      notes: 'Requires the GitHub CLI (`gh`) and `gh auth login`. Launch with `gh dash`.'
    },
    repoUrl: 'https://github.com/dlvhdr/gh-dash',
    features: ['Configurable PR/issue sections', 'Inline previews', 'Keyboard actions', 'Custom commands'],
    tags: ['git', 'github', 'tui', 'go'],
    useCases: ['Triaging review requests.', 'Watching agent-opened PRs.', 'Managing issues across repos.'],
    reviews: [],
    version: 'v4.26.0'
  },
  {
    id: 'jujutsu',
    name: 'Jujutsu (jj)',
    description: 'Git-compatible version control that is simpler and more powerful.',
    longDescription: 'Jujutsu treats the working copy as a commit, records every operation for easy undo, and makes rebasing and conflict handling first-class, while storing data in a regular Git repository so it works with existing remotes.',
    category: AgentCategory.GIT_TOOL,
    stars: 32012,
    language: 'Rust',
    installCommand: 'brew install jj',
    platformCommands: {
      default: 'brew install jj',
      windows: 'scoop install jj',
      macos: 'brew install jj',
      linux: 'cargo install --locked --bin jj jj-cli',
      notes: 'Use `jj git init --colocate` inside an existing Git repo to try it side by side.'
    },
    repoUrl: 'https://github.com/jj-vcs/jj',
    features: ['Working copy as a commit', 'Operation log with undo', 'First-class conflicts', 'Git backend'],
    tags: ['git', 'rust', 'development'],
    useCases: ['Painless stacked changes.', 'Undoing any operation safely.', 'Managing agent experiments as cheap commits.'],
    reviews: [],
    version: '0.46.0'
  },
  {
    id: 'ffmpeg',
    name: 'FFmpeg',
    description: 'The universal toolkit to record, convert, and stream audio and video.',
    longDescription: 'FFmpeg decodes, encodes, transcodes, muxes, filters, and streams virtually every media format. Its CLI underpins yt-dlp, mpv, OBS, and most video tooling.',
    category: AgentCategory.VIDEO,
    stars: 65335,
    language: 'C',
    installCommand: 'brew install ffmpeg',
    platformCommands: {
      default: 'brew install ffmpeg',
      windows: 'scoop install ffmpeg',
      macos: 'brew install ffmpeg',
      linux: 'sudo apt install ffmpeg',
      notes: 'Example: `ffmpeg -i input.mov -c:v libx264 -crf 23 output.mp4`.'
    },
    repoUrl: 'https://github.com/FFmpeg/FFmpeg',
    features: ['Hundreds of codecs', 'Filter graphs', 'Streaming protocols', 'Hardware acceleration'],
    tags: ['video', 'c', 'streaming'],
    useCases: ['Converting screen recordings.', 'Extracting audio tracks.', 'Live streaming pipelines.'],
    reviews: [],
    version: '9.0.2'
  },
  {
    id: 'cava',
    name: 'cava',
    description: 'Console-based audio spectrum visualizer.',
    longDescription: 'cava renders a real-time bar spectrum of whatever audio is playing, using PipeWire, PulseAudio, ALSA, or macOS input sources, with configurable colors, gradients, and smoothing.',
    category: AgentCategory.MUSIC,
    stars: 6470,
    language: 'C',
    installCommand: 'brew install cava',
    platformCommands: {
      default: 'brew install cava',
      macos: 'brew install cava',
      linux: 'sudo apt install cava',
      notes: 'On macOS, route audio through a loopback device (e.g. BlackHole) so cava can hear system output.'
    },
    repoUrl: 'https://github.com/karlstav/cava',
    features: ['Real-time spectrum bars', 'Multiple audio backends', 'Gradients and themes', 'Raw output mode'],
    tags: ['music', 'c', 'entertainment'],
    useCases: ['Visualizing music next to cmus or ncmpcpp.', 'Desktop rice setups.', 'Feeding bar data to status bars.'],
    reviews: [],
    version: '1.0.0'
  }
];
