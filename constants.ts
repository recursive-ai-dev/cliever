
import { Agent, AgentCategory } from './types';

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
  'streaming': 'Tools for handling live or on-demand media streams.'
};

export const AGENTS: Agent[] = [
  // --- 2.0 AI-ENHANCED TERMINAL EMULATORS ---
  {
    id: 'wave-terminal',
    name: 'Wave Terminal',
    description: 'Open-source, IDE-like terminal with graphical widgets and block-based output.',
    longDescription: 'Wave Terminal brings a rich, IDE-like experience to the command line. It features an inline web browser, markdown previews, and command blocks that isolate execution steps for agentic oversight.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 12500,
    language: 'TypeScript',
    installCommand: 'brew install --cask waveterm',
    platformCommands: {
      default: 'brew install --cask waveterm',
      windows: 'winget install WaveTerm.WaveTerm',
      macos: 'brew install --cask waveterm',
      linux: 'Download AppImage from github.com/wavetermdev/waveterm/releases',
      notes: 'Cross-platform Electron app. Check releases page for latest builds.'
    },
    repoUrl: 'https://github.com/wavetermdev/waveterm',
    features: ['Integrated AI Chat', 'Built-in Editor', 'Command Blocks', 'Inline Multimedia'],
    tags: ['terminal', 'open-source', 'productivity'],
    useCases: ['Monitoring agent execution plans.', 'Editing remote files.', 'In-terminal documentation browsing.'],
    reviews: [],
    version: 'v0.7.2'
  },
  {
    id: 'warp',
    name: 'Warp',
    description: 'Rust-based terminal purpose-built for AI-powered collaboration.',
    longDescription: 'Warp is an agentic development environment that unifies tooling across the software lifecycle. It features native agentic workflows and an integrated code review interface.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 21000,
    language: 'Rust',
    installCommand: 'brew install --cask warp',
    platformCommands: {
      default: 'brew install --cask warp',
      windows: 'winget install Warp.Warp',
      macos: 'brew install --cask warp',
      linux: 'curl -fsSL https://releases.warp.dev/install.sh | sh',
      notes: 'Requires account creation. Linux packages are installer scripts; verify chmod +x if needed.'
    },
    repoUrl: 'https://www.warp.dev/',
    features: ['Agentic Workflow Integration', 'Warp Drive Collaboration', 'Block-based outputs'],
    tags: ['terminal', 'rust', 'proprietary'],
    useCases: ['Translating intent to bash.', 'Collaborative debugging.', 'Team-shared terminal blocks.'],
    reviews: [],
    version: '2025.01.12'
  },
  // --- 3.0 AGENTIC CODING ASSISTANTS ---
  {
    id: 'claude-code',
    name: 'Claude Code',
    description: 'Anthropic\'s command-line tool for agentic software engineering.',
    longDescription: 'Powered by Claude 3.7 Sonnet, it delegates tasks like bug fixes and feature implementation autonomously using BashTool and FileEditTool.',
    category: AgentCategory.AUTONOMOUS,
    stars: 18000,
    language: 'TypeScript',
    installCommand: 'npm install -g @anthropic-ai/claude-code',
    platformCommands: {
      default: 'npm install -g @anthropic-ai/claude-code',
      windows: 'npm install -g @anthropic-ai/claude-code',
      notes: 'Requires Node.js 18+. Set ANTHROPIC_API_KEY environment variable before use.'
    },
    repoUrl: 'https://github.com/anthropic/claude-code',
    features: ['Context Building', 'BashTool execution', 'Tiered Permissions'],
    tags: ['coding', 'autonomous', 'sota'],
    useCases: ['Complex refactoring.', 'Autonomous bug detection.', 'CI/CD pipeline automation.'],
    reviews: [],
    troubleshooting: [
      'API key error: Set ANTHROPIC_API_KEY in your environment or .env file',
      'Permission denied: Run terminal as administrator on Windows, or check npm global permissions',
      'Context too large: Use the --compact flag to reduce context size for large repos'
    ],
    version: 'v1.0.4'
  },
  {
    id: 'cline',
    name: 'Cline',
    description: 'Open-source coding agent with a methodical Plan & Act workflow.',
    longDescription: 'Distinguished by its separation of strategy and implementation. Features Memory Bank system and Checkpoint management for immutable snapshots.',
    category: AgentCategory.CODING,
    stars: 11500,
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
    version: 'v2.1.0'
  },
  {
    id: 'aider',
    name: 'Aider',
    description: 'CLI chat tool for pair programming with deep Git integration.',
    longDescription: 'Aider builds a map of the local repository and works seamlessly with Git history to review, amend, and commit changes autonomously.',
    category: AgentCategory.CODING,
    stars: 16000,
    language: 'Python',
    installCommand: 'pip install aider-chat',
    platformCommands: {
      default: 'pip install aider-chat',
      windows: 'pip install aider-chat',
      notes: 'Python 3.9+ required. Works with multiple LLM providers (OpenAI, Anthropic, local models).'
    },
    repoUrl: 'https://github.com/paul-gauthier/aider',
    features: ['Repository Mapping', 'Deep Git Integration', 'Multi-LLM Support'],
    tags: ['python', 'git', 'coding'],
    useCases: ['Large module refactoring.', 'Managing project-wide code changes.', 'Git conflict resolution.'],
    reviews: [],
    version: 'v0.68.0'
  },
  {
    id: 'plandex',
    name: 'Plandex',
    description: 'Engineered for massive coding tasks and 2M token context windows.',
    longDescription: 'Plandex manages complex, multi-step tasks across large codebases using tree-sitter indexing and intelligent context caching.',
    category: AgentCategory.CODING,
    stars: 7500,
    language: 'Go',
    installCommand: 'curl -sL https://plandex.ai/install.sh | bash',
    platformCommands: {
      default: 'curl -sL https://plandex.ai/install.sh | bash',
      windows: 'iwr -useb https://plandex.ai/install.ps1 | iex',
      macos: 'brew install plandex-ai/tap/plandex',
      notes: 'Requires Go 1.21+ for building from source. Pre-built binaries available.'
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
    stars: 25000,
    language: 'Python',
    installCommand: 'docker run -it ghcr.io/all-hands-ai/openhands',
    platformCommands: {
      default: 'docker run -it ghcr.io/all-hands-ai/openhands',
      docker: 'docker run -it -v $(pwd):/workspace ghcr.io/all-hands-ai/openhands',
      notes: 'Requires Docker. The sandbox provides full isolation from your host system.'
    },
    repoUrl: 'https://github.com/All-Hands-AI/OpenHands',
    features: ['Native Sandboxing', 'Model-Agnostic', 'Secure Isolation'],
    tags: ['python', 'security', 'sandbox'],
    useCases: ['Safe execution of untrusted scripts.', 'Sandboxed feature building.', 'Security analysis of code.'],
    reviews: [],
    version: 'v0.15.2'
  },
  {
    id: 'gh-copilot',
    name: 'GitHub Copilot Agent',
    description: 'Autonomous workspace partner within the GitHub ecosystem.',
    longDescription: 'The Agent mode in GitHub Copilot autonomously finds context across workspaces, edits multiple files, and runs terminal commands to completion.',
    category: AgentCategory.CODING,
    stars: 15000,
    language: 'Go',
    installCommand: 'gh extension install github/gh-copilot',
    platformCommands: {
      default: 'gh extension install github/gh-copilot',
      windows: 'gh extension install github/gh-copilot',
      notes: 'Requires GitHub CLI (gh) to be installed first. Needs active Copilot subscription.'
    },
    repoUrl: 'https://github.com/github/gh-copilot',
    features: ['Agent Mode Activation', 'Official Workspace Indexing', 'Multi-file Edits'],
    tags: ['github', 'official', 'productivity'],
    useCases: ['Automating PR reviews.', 'Complex workspace navigation.', 'Iterative feature development.'],
    reviews: [],
    version: 'v1.2.0'
  },
  {
    id: 'amazon-q',
    name: 'Amazon Q CLI',
    description: 'AWS-native AI assistant with type-ahead shell completions.',
    longDescription: 'Integrates chat and autocompletion directly into the shell, providing ghost text suggestions for aws, git, npm, and docker.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 3000,
    language: 'Go',
    installCommand: 'brew install amazon-q',
    platformCommands: {
      default: 'brew install amazon-q',
      windows: 'winget install Amazon.AWSCLI',
      macos: 'brew install amazon-q',
      notes: 'AWS account required. Integrates with AWS IAM for authentication.'
    },
    repoUrl: 'https://aws.amazon.com/q/',
    features: ['Ghost Text Suggestions', 'Intelligent completions', 'AWS native optimization'],
    tags: ['aws', 'cloud', 'productivity'],
    useCases: ['Accelerating AWS deployments.', 'Learning complex CLI flags.', 'Faster terminal navigation.'],
    reviews: [],
    version: '2025.1'
  },
  {
    id: 'gemini-cli',
    name: 'Gemini CLI',
    description: 'Terminal agent leveraging Google\'s 1M context window models.',
    longDescription: 'A high-context terminal tool optimized for reasoning over extensive codebases and documentation sets using Gemini 1.5/2.0.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 10000,
    language: 'Python',
    installCommand: 'pip install gemini-chat-cli',
    repoUrl: 'https://github.com/google/gemini-cli',
    features: ['1M Context support', 'Native Tool Integration', 'Google Cloud backend'],
    tags: ['google', 'sota', 'utility'],
    useCases: ['Analyzing massive documentation.', 'Fast coding queries.', 'Large-scale repo summarization.'],
    reviews: [],
    version: 'v1.4.0'
  },
  // --- 4.0 LOCAL FRAMEWORKS ---
  {
    id: 'ollama',
    name: 'Ollama',
    description: 'The industry standard for running open LLMs locally.',
    longDescription: 'Built on llama.cpp, it provides high-throughput performance with broad hardware acceleration across NVIDIA, Apple, and AMD GPUs.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 75000,
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
    repoUrl: 'https://ollama.com/',
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
    version: 'v0.5.7'
  },
  {
    id: 'lm-studio',
    name: 'LM Studio',
    description: 'Polished desktop interface for managing local models.',
    longDescription: 'Offers the most accessible graphical interface for discovering and running models from Hugging Face with an OpenAI-compatible API server.',
    category: AgentCategory.RESEARCH,
    stars: 32000,
    language: 'C++',
    installCommand: 'brew install --cask lm-studio',
    platformCommands: {
      default: 'brew install --cask lm-studio',
      windows: 'winget install LMStudio.LMStudio',
      macos: 'brew install --cask lm-studio',
      notes: 'Download directly from lmstudio.ai for all platforms. GUI-based installation is straightforward.'
    },
    repoUrl: 'https://lmstudio.ai/',
    features: ['Hugging Face integration', 'Visual parameter tuning', 'Local server'],
    tags: ['local-llm', 'gui', 'inference'],
    useCases: ['Visual model benchmarking.', 'Prototyping local agent flows.', 'Low-barrier entry to local AI.'],
    reviews: [],
    version: 'v0.3.5'
  },
  {
    id: 'localai',
    name: 'LocalAI',
    description: 'Drop-in open-source replacement for the OpenAI API.',
    longDescription: 'Supports text, image, and audio generation locally with production-ready tool calling and P2P distributed inference.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 22000,
    language: 'Go',
    installCommand: 'docker run -p 8080:8080 localai/localai',
    repoUrl: 'https://localai.io/',
    features: ['P2P Inference', 'Function calling', 'Multi-modal'],
    tags: ['local-llm', 'api', 'distributed'],
    useCases: ['Enterprise self-hosting.', 'Building tool-using agents locally.', 'Secure on-prem AI stacks.'],
    reviews: [],
    version: 'v2.24.0'
  },
  {
    id: 'llama-cpp',
    name: 'llama.cpp',
    description: 'C/C++ inference engine with a fast, scriptable CLI.',
    longDescription: 'A minimal, portable runtime for quantized LLMs with a CLI that supports chat, embeddings, and batch inference across CPU and GPU backends.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 85000,
    language: 'C++',
    installCommand: 'brew install llama.cpp',
    platformCommands: {
      default: 'brew install llama.cpp',
      windows: 'Download pre-built binaries from github.com/ggerganov/llama.cpp/releases',
      macos: 'brew install llama.cpp',
      linux: 'Build from source or download binaries from releases',
      notes: 'For GPU: compile with LLAMA_CUBLAS=1 (NVIDIA) or LLAMA_METAL=1 (Apple Silicon)'
    },
    repoUrl: 'https://github.com/ggerganov/llama.cpp',
    features: ['Quantized inference', 'CPU/GPU backends', 'Embeddings CLI'],
    tags: ['local-llm', 'inference', 'foundational'],
    useCases: ['Local model benchmarking.', 'Embedding generation pipelines.', 'Offline inference on commodity hardware.'],
    reviews: [],
    version: 'b3820'
  },
  {
    id: 'vllm',
    name: 'vLLM',
    description: 'High-throughput LLM serving with a fast CLI entrypoint.',
    longDescription: 'Optimized serving for large models using paged attention, exposing a CLI for launching OpenAI-compatible endpoints and batch inference workers.',
    category: AgentCategory.INFRASTRUCTURE,
    stars: 24000,
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
    version: 'v0.5.5'
  },
  {
    id: 'litellm',
    name: 'LiteLLM',
    description: 'CLI-friendly proxy to unify LLM providers under one API.',
    longDescription: 'Provides a lightweight CLI for starting a proxy that normalizes request/response formats across OpenAI, Azure, Anthropic, and local backends.',
    category: AgentCategory.INFRASTRUCTURE,
    stars: 14000,
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
    version: 'v1.40.8'
  },
  {
    id: 'jan',
    name: 'Jan',
    description: 'Privacy-focused offline ChatGPT alternative.',
    longDescription: 'A comprehensive, 100% offline AI chat experience powered by the Cortex engine for local device execution.',
    category: AgentCategory.RESEARCH,
    stars: 15000,
    language: 'TypeScript',
    installCommand: 'brew install --cask jan',
    platformCommands: {
      default: 'brew install --cask jan',
      windows: 'winget install Jan.Jan',
      macos: 'brew install --cask jan',
      linux: 'Download AppImage from jan.ai',
      notes: '100% offline. No data ever leaves your device.'
    },
    repoUrl: 'https://jan.ai/',
    features: ['Cortex Engine', '100% Offline', 'Extensions'],
    tags: ['privacy', 'offline', 'desktop'],
    useCases: ['Air-gapped AI chat.', 'Private document analysis.', 'Personal knowledge management.'],
    reviews: [],
    version: 'v0.5.8'
  },
  {
    id: 'llamafile',
    name: 'Llamafile',
    description: 'Single-executable distribution for Large Language Models.',
    longDescription: 'Mozilla-backed project that packages weights and inference engines into a single multi-platform executable file.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 17000,
    language: 'C++',
    installCommand: 'wget https://huggingface.co/jartine/llava-v1.5-7B-GGUF/resolve/main/llava-v1.5-7b-q4.llamafile && chmod +x llava-v1.5-7b-q4.llamafile && ./llava-v1.5-7b-q4.llamafile',
    platformCommands: {
      default: 'wget <url>.llamafile && chmod +x <file>.llamafile && ./<file>.llamafile',
      windows: 'Download .llamafile, rename to .exe, and run directly',
      macos: 'curl -LO <url>.llamafile && chmod +x <file>.llamafile && ./<file>.llamafile',
      notes: 'Single file contains model + inference engine. Works on Windows, macOS, Linux, FreeBSD.'
    },
    repoUrl: 'https://github.com/Mozilla-Ocho/llamafile',
    features: ['Zero installation', 'Single-executable', 'Multi-platform'],
    tags: ['mozilla', 'foundational', 'portable'],
    useCases: ['Portable AI on thumb drives.', 'Simple model distribution.', 'Zero-dependency deployments.'],
    reviews: [],
    version: 'v0.8.1'
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
    repoUrl: 'https://openinterpreter.com/',
    features: ['OS Control', 'Local Execution', 'Vision support'],
    tags: ['automation', 'interpreter', 'local'],
    useCases: ['Complex desktop automation.', 'Programmatic file analysis.', 'Autonomous research.'],
    reviews: [],
    troubleshooting: [
      'Permission errors: Run terminal as administrator (Windows) or use sudo (Linux/macOS)',
      'Safe mode: Use "--safe-mode" flag to preview actions before execution',
      'Vision not working: Install with "pip install open-interpreter[vision]"'
    ],
    version: 'v0.2.0'
  },
  {
    id: 'shell-gpt',
    name: 'ShellGPT (sgpt)',
    description: 'Shell productivity tool for generating commands and snippets.',
    longDescription: 'Translates natural language into executable bash commands directly in the terminal. Optimized for shell productivity.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 11000,
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
    version: 'v0.9.1'
  },
  {
    id: 'aichat',
    name: 'aichat',
    description: 'Rust-based CLI chat assistant with configurable prompts.',
    longDescription: 'Supports multiple providers with session history, role presets, and templated prompts for repeatable terminal workflows.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 7600,
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
    version: 'v0.24.0'
  },
  {
    id: 'mods',
    name: 'Mods',
    description: 'Charmbracelet CLI for chatting with LLMs from the terminal.',
    longDescription: 'Offers a polished TUI for multi-turn chat, local history, and configurable providers with environment-based auth.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 13000,
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
    version: 'v1.5.0'
  },
  {
    id: 'opencommit',
    name: 'OpenCommit',
    description: 'Git commit assistant that writes messages from staged diffs.',
    longDescription: 'Parses staged changes to produce structured commit messages, configurable with project templates and conventional commits.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 6200,
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
    version: 'v3.2.0'
  },
  {
    id: 'gptcommit',
    name: 'GPTCommit',
    description: 'Automates Git commit messages using local diffs.',
    longDescription: 'Generates structured commit messages by reading staged diffs and supports configurable models and message templates.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 4200,
    language: 'Python',
    installCommand: 'pip install gptcommit',
    platformCommands: {
      default: 'pip install gptcommit',
      notes: 'Run "gptcommit" after staging changes. Supports local models via Ollama.'
    },
    repoUrl: 'https://github.com/zurawiki/gptcommit',
    features: ['Diff parsing', 'Template rules', 'Multiple model backends'],
    tags: ['git', 'productivity', 'utility'],
    useCases: ['Automated commit drafting.', 'Enforcing message conventions.', 'Reducing manual Git workflow time.'],
    reviews: [],
    version: 'v0.10.4'
  },
  {
    id: 'gptme',
    name: 'gptme',
    description: 'CLI agent that plans tasks and executes tool-based steps.',
    longDescription: 'Combines chat-driven planning with tool execution, enabling multi-step workflows such as refactors, investigations, and command orchestration.',
    category: AgentCategory.AUTONOMOUS,
    stars: 5100,
    language: 'Python',
    installCommand: 'pip install gptme',
    platformCommands: {
      default: 'pip install gptme',
      notes: 'Run "gptme" to start. Supports multiple LLM backends including local models.'
    },
    repoUrl: 'https://github.com/gptme/gptme',
    features: ['Tool execution', 'Plan/act loop', 'Workspace memory'],
    tags: ['python', 'autonomous', 'planning'],
    useCases: ['Multi-step codebase changes.', 'Automated troubleshooting.', 'Repeatable devops runbooks.'],
    reviews: [],
    version: 'v0.23.0'
  },
  {
    id: 'gpt-engineer',
    name: 'gpt-engineer',
    description: 'CLI for generating and refining full projects from specs.',
    longDescription: 'Turns prompts into structured project scaffolds, iterating with file-based feedback loops for coding workflows.',
    category: AgentCategory.CODING,
    stars: 51000,
    language: 'Python',
    installCommand: 'pip install gpt-engineer',
    platformCommands: {
      default: 'pip install gpt-engineer',
      notes: 'Run "gpte" with a project description. Iterates with feedback for refinement.'
    },
    repoUrl: 'https://github.com/gpt-engineer/gpt-engineer',
    features: ['Project scaffolding', 'Iterative refinement', 'Spec-driven builds'],
    tags: ['python', 'coding', 'planning'],
    useCases: ['Rapid project bootstrapping.', 'Spec-driven prototypes.', 'Iterative codebase generation.'],
    reviews: [],
    version: 'v0.3.1'
  },
  {
    id: 'gptscript',
    name: 'GPTScript',
    description: 'Natural language programming runtime with a CLI-first workflow.',
    longDescription: 'Defines tasks as scripts, executes tool-backed steps, and composes reusable task graphs with CLI automation.',
    category: AgentCategory.FRAMEWORK,
    stars: 8700,
    language: 'Go',
    installCommand: 'curl -sL https://get.gptscript.ai | sh',
    platformCommands: {
      default: 'curl -sL https://get.gptscript.ai | sh',
      windows: 'iwr -useb https://get.gptscript.ai/install.ps1 | iex',
      notes: 'Create .gpt files with natural language tasks. Run with "gptscript <file>.gpt".'
    },
    repoUrl: 'https://github.com/gptscript-ai/gptscript',
    features: ['Scripted agents', 'Tool orchestration', 'Reusable workflows'],
    tags: ['framework', 'automation', 'prompts'],
    useCases: ['Composable automation scripts.', 'Reusable agent workflows.', 'Multi-step CLI pipelines.'],
    reviews: [],
    version: 'v0.5.5'
  },
  {
    id: 'fabric',
    name: 'Fabric',
    description: 'Framework for applying crowdsourced prompt patterns to terminal tasks.',
    longDescription: 'Organizes tested prompt patterns for high-quality technical extraction and summarization in the CLI.',
    category: AgentCategory.RESEARCH,
    stars: 18000,
    language: 'Go',
    installCommand: 'go install github.com/danielmiessler/fabric@latest',
    repoUrl: 'https://github.com/danielmiessler/fabric',
    features: ['Pattern Library', 'Consistent outputs', 'Summarization'],
    tags: ['prompts', 'productivity', 'framework'],
    useCases: ['Technical transcription extraction.', 'Structured article summaries.', 'Pattern-based automation.'],
    reviews: [],
    version: 'v2.1'
  },
  {
    id: 'ask-sh',
    name: 'ask.sh',
    description: 'Terminal assistant that reads/writes directly to the shell session.',
    longDescription: 'Eliminates copy-pasting by reading the terminal buffer to understand error context and injecting fixes directly.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 3500,
    language: 'Rust',
    installCommand: 'brew install ask-sh',
    platformCommands: {
      default: 'brew install ask-sh',
      macos: 'brew install ask-sh',
      linux: 'cargo install ask-sh',
      notes: 'Reads terminal buffer for context. No copy-paste needed.'
    },
    repoUrl: 'https://github.com/tailcallhq/ask-sh',
    features: ['Buffer reading', 'Direct injection', 'Context awareness'],
    tags: ['rust', 'debugging', 'productivity'],
    useCases: ['Instant debugging of terminal errors.', 'Command auto-correction.', 'Fast tool navigation.'],
    reviews: [],
    version: 'v0.4.0'
  },
  {
    id: 'llm-cli',
    name: 'LLM (Simon Willison)',
    description: 'Swiss-army knife for prompting dozens of models from the CLI.',
    longDescription: 'A versatile utility for prompting and model interaction. Logs all interactions to SQLite for historical reference.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 8000,
    language: 'Python',
    installCommand: 'pip install llm',
    platformCommands: {
      default: 'pip install llm',
      notes: 'Extensible via plugins. Install plugins with "llm install llm-<plugin>". All prompts logged to SQLite.'
    },
    repoUrl: 'https://llm.datasette.io/',
    features: ['Plugin system', 'SQLite logging', 'Multi-model support'],
    tags: ['python', 'logging', 'experimentation'],
    useCases: ['Benchmarking different prompts.', 'Scripting AI interactions.', 'Preserving conversation history.'],
    reviews: [],
    version: 'v0.18'
  },
  // --- 6.0 FOUNDATIONAL TOOLS ---
  {
    id: 'aws-cli',
    name: 'AWS CLI',
    description: 'Official tool for managing Amazon Web Services resources.',
    longDescription: 'The foundational command-line instrument for cloud management and infrastructure orchestration.',
    category: AgentCategory.INFRASTRUCTURE,
    stars: 16000,
    language: 'Python',
    installCommand: 'brew install awscli',
    platformCommands: {
      default: 'brew install awscli',
      windows: 'msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi',
      macos: 'brew install awscli',
      linux: 'curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && unzip awscliv2.zip && sudo ./aws/install',
      notes: 'Configure with "aws configure". Requires AWS access keys.'
    },
    repoUrl: 'https://aws.amazon.com/cli/',
    features: ['Comprehensive coverage', 'Automation ready', 'Consistent syntax'],
    tags: ['aws', 'cloud', 'foundational'],
    useCases: ['Infrastructure automation.', 'Managing S3/EC2 via scripts.', 'CI/CD pipeline integration.'],
    reviews: [],
    version: 'v2.17'
  },
  {
    id: 'pulstack',
    name: 'Pulstack',
    description: 'Deploys static websites to AWS/GitHub with zero manual work.',
    longDescription: 'Uses Pulumi to provision secure-by-default infrastructure for static sites automatically.',
    category: AgentCategory.INFRASTRUCTURE,
    stars: 2500,
    language: 'Go',
    installCommand: 'npm install -g pulstack',
    platformCommands: {
      default: 'npm install -g pulstack',
      notes: 'Requires Pulumi CLI and AWS credentials. IaC for static sites made simple.'
    },
    repoUrl: 'https://github.com/pulumi/pulumi',
    features: ['Secure by default', 'Zero manual work', 'IaC native'],
    tags: ['iac', 'aws', 'automation'],
    useCases: ['Rapid static site hosting.', 'Secure cloud provisioning.', 'Automatic site teardown.'],
    reviews: [],
    version: 'v1.0.2'
  },
  {
    id: 'lazygit',
    name: 'Lazygit',
    description: 'Intuitive terminal user interface for Git commands.',
    longDescription: 'Simplifies complex Git operations like interactive staging and squashing into an efficient TUI.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 48000,
    language: 'Go',
    installCommand: 'brew install lazygit',
    platformCommands: {
      default: 'brew install lazygit',
      windows: 'scoop install lazygit',
      macos: 'brew install lazygit',
      linux: 'sudo add-apt-repository ppa:lazygit-team/release && sudo apt install lazygit',
      notes: 'Run "lazygit" in any git repo. Keyboard-driven TUI.'
    },
    repoUrl: 'https://github.com/jesseduffield/lazygit',
    features: ['Interactive staging', 'Commit squashing', 'Visual diffs'],
    tags: ['git', 'tui', 'go'],
    useCases: ['Speeding up Git workflows.', 'Complex conflict resolution.', 'Visual Git navigation.'],
    reviews: [],
    version: 'v0.40'
  },
  // --- 6.5 ENTERTAINMENT & LEISURE ---
  {
    id: 'newsboat',
    name: 'Newsboat',
    description: 'An extendable RSS feed reader for text terminals.',
    longDescription: 'Newsboat is an actively maintained fork of Newsbeuter, offering a lean and fast RSS/Atom reader with an integrated HTML renderer and powerful filtering capabilities.',
    category: AgentCategory.ENTERTAINMENT,
    stars: 3600,
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
    version: '2.37'
  },
  {
    id: 'mal-cli',
    name: 'mal-cli',
    description: 'MyAnimeList client for the terminal.',
    longDescription: 'A high-performance terminal interface for the official MyAnimeList API, built with Rust and Ratatui for a smooth, keyboard-first anime tracking experience.',
    category: AgentCategory.ENTERTAINMENT,
    stars: 130,
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
    version: 'v0.5.0'
  }

  ,
  // --- 7.0 BASELINE DEV CLIs (CREDIBILITY STAPLES) ---
  {
    id: 'github-cli',
    name: 'GitHub CLI (gh)',
    description: 'Official GitHub CLI for PRs, issues, releases, and workflows.',
    longDescription: 'GitHub CLI (gh) brings GitHub workflows into the terminal: create/view PRs, manage issues, run Actions workflows, and authenticate securely. It is a common baseline tool for modern GitHub-centric teams.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 41000,
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
    version: 'v2.59.0'
  },
  {
    id: 'gitlab-cli',
    name: 'GitLab CLI (glab)',
    description: 'GitLab CLI for merge requests, issues, pipelines, and releases.',
    longDescription: 'GitLab CLI (glab) is a practical terminal companion for GitLab workflows: create and review merge requests, manage issues, and interact with CI pipelines from the command line.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 6000,
    language: 'Go',
    installCommand: 'brew install glab',
    platformCommands: {
      default: 'brew install glab',
      windows: 'winget install GitLab.glab',
      macos: 'brew install glab',
      linux: 'sudo apt install glab',
      notes: 'Authenticate with `glab auth login` after install.'
    },
    repoUrl: 'https://github.com/gitlab-org/cli',
    features: ['Merge request workflows', 'Issue management', 'Pipeline inspection', 'Release tooling'],
    tags: ['git', 'open-source', 'productivity'],
    useCases: ['Open and review merge requests quickly.', 'Check CI pipeline status in terminal.', 'Manage issues without leaving the CLI.'],
    reviews: [],
    version: 'v1.55.0'
  },
  {
    id: 'terraform',
    name: 'Terraform',
    description: 'Infrastructure as Code CLI for provisioning cloud resources.',
    longDescription: 'Terraform is a foundational IaC CLI for defining and provisioning infrastructure across cloud providers. It is often used alongside automation and agentic tooling for repeatable deployments.',
    category: AgentCategory.INFRASTRUCTURE,
    stars: 45000,
    language: 'Go',
    installCommand: 'brew tap hashicorp/tap && brew install hashicorp/tap/terraform',
    platformCommands: {
      default: 'brew tap hashicorp/tap && brew install hashicorp/tap/terraform',
      windows: 'winget install Hashicorp.Terraform',
      macos: 'brew tap hashicorp/tap && brew install hashicorp/tap/terraform',
      linux: 'sudo apt install terraform',
      notes: 'Run `terraform -help` to verify; providers download on first use.'
    },
    repoUrl: 'https://github.com/hashicorp/terraform',
    features: ['Multi-cloud provisioning', 'State management', 'Plan/apply workflows', 'Provider ecosystem'],
    tags: ['iac', 'cloud', 'automation'],
    useCases: ['Provision dev/staging/prod consistently.', 'Automate infrastructure changes in CI.', 'Codify infrastructure review via plans.'],
    reviews: [],
    version: 'v1.9.8'
  },
  {
    id: 'kubectl',
    name: 'kubectl',
    description: 'Official Kubernetes CLI for cluster management and debugging.',
    longDescription: 'kubectl is the standard CLI for interacting with Kubernetes clusters. It is a common baseline tool in modern infra stacks and pairs well with automation and AI-assisted troubleshooting.',
    category: AgentCategory.INFRASTRUCTURE,
    stars: 110000,
    language: 'Go',
    installCommand: 'brew install kubectl',
    platformCommands: {
      default: 'brew install kubectl',
      windows: 'winget install Kubernetes.kubectl',
      macos: 'brew install kubectl',
      linux: 'sudo apt install kubectl',
      notes: 'Use `kubectl version --client` to verify install.'
    },
    repoUrl: 'https://github.com/kubernetes/kubernetes',
    features: ['Cluster control', 'Resource inspection', 'Logs/exec debugging', 'Context switching'],
    tags: ['cloud', 'utility', 'official'],
    useCases: ['Debug workloads with logs and exec.', 'Inspect cluster resources quickly.', 'Operate clusters in CI/CD.'],
    reviews: [],
    version: 'v1.31.3'
  },

  // --- 8.0 ADDITIONAL CODING AGENTS (USER REQUESTED) ---
  {
    id: 'ra-aid',
    name: 'RA.Aid',
    description: 'Standalone coding agent built on LangGraph for multi-step development tasks.',
    longDescription: 'RA.Aid (pronounced "raid") helps with research, planning, and implementation of multi-step development tasks. It can optionally integrate with aider via the --use-aider flag.',
    category: AgentCategory.AUTONOMOUS,
    stars: 0,
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
    version: 'latest'
  },
  {
    id: 'qwen-code',
    name: 'Qwen Code',
    description: 'Open-source AI coding agent that lives in your terminal.',
    longDescription: 'Qwen Code is an open-source terminal agent optimized for Qwen3-Coder models. It supports interactive and headless usage and can connect to OpenAI-compatible APIs.',
    category: AgentCategory.CODING,
    stars: 0,
    language: 'TypeScript',
    installCommand: 'npm install -g @qwen-code/qwen-code@latest',
    platformCommands: {
      default: 'npm install -g @qwen-code/qwen-code@latest',
      windows: 'npm install -g @qwen-code/qwen-code@latest',
      macos: 'brew install qwen-code',
      linux: 'brew install qwen-code',
      notes: 'Requires Node.js 20+. Start with `qwen` inside your project directory.'
    },
    repoUrl: 'https://github.com/QwenLM/qwen-code',
    features: ['Terminal-first agent', 'Headless mode for scripts/CI', 'OpenAI-compatible providers'],
    tags: ['terminal', 'open-source', 'coding'],
    useCases: ['Large codebase Q&A from the terminal.', 'Headless automation in CI.', 'Interactive refactors with approvals.'],
    reviews: [],
    version: 'latest'
  },
  {
    id: 'crush',
    name: 'Crush',
    description: 'Charmbracelet AI coding agent for your favourite terminal.',
    longDescription: 'Crush is a terminal coding agent with multi-model support, session workflows, and extensibility via MCP servers (stdio/http/sse).',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 0,
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
    version: 'latest'
  },
  {
    id: 'cloudflare-vibesdk',
    name: 'Cloudflare VibeSDK',
    description: 'Open-source vibe coding platform and reference implementation on Cloudflare.',
    longDescription: 'Cloudflare VibeSDK is an open-source full-stack AI webapp generator built on Cloudflare Workers + Durable Objects, with sandboxed previews and optional GitHub export flows.',
    category: AgentCategory.FRAMEWORK,
    stars: 0,
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
    version: 'latest'
  },
  {
    id: 'vibekit',
    name: 'VibeKit',
    description: 'Security/sandbox layer for running coding agents locally.',
    longDescription: 'VibeKit runs coding agents in isolated environments with redaction and observability. It aims to reduce risk when executing agent-generated code.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 0,
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
    version: 'latest'
  },
  {
    id: 'mistral-vibe',
    name: 'Mistral Vibe',
    description: 'Mistral\'s open-source CLI coding assistant.',
    longDescription: 'Mistral Vibe is a command-line coding assistant with a tool-based workflow for reading/writing files, searching code, and running commands, with safety prompts for tool approval.',
    category: AgentCategory.CODING,
    stars: 0,
    language: 'Python',
    installCommand: 'pip install mistral-vibe',
    platformCommands: {
      default: 'pip install mistral-vibe',
      windows: 'pip install mistral-vibe',
      notes: 'You can also install via `uv tool install mistral-vibe`. See repo for config and supported environments.'
    },
    repoUrl: 'https://github.com/mistralai/mistral-vibe',
    features: ['Tool-based coding workflow', 'Project-aware context', 'Safety prompts for execution'],
    tags: ['python', 'open-source', 'coding'],
    useCases: ['Interactive refactors and debugging.', 'Non-interactive scripting via prompt mode.', 'Project-aware codebase exploration.'],
    reviews: [],
    version: 'latest'
  },
  {
    id: 'deepcode-hkuds',
    name: 'DeepCode',
    description: 'Open agentic coding system with multi-agent workflow and MCP integration.',
    longDescription: 'DeepCode is a multi-agent coding system that supports research-to-code workflows, with CLI and web interfaces and optional MCP server integrations for tooling.',
    category: AgentCategory.AUTONOMOUS,
    stars: 0,
    language: 'Python',
    installCommand: 'pip install deepcode-hku',
    platformCommands: {
      default: 'pip install deepcode-hku',
      windows: 'pip install deepcode-hku',
      notes: 'Requires provider API keys and configuration files (see repo Quick Start).'
    },
    repoUrl: 'https://github.com/HKUDS/DeepCode',
    features: ['Multi-agent orchestration', 'CLI and web UI', 'MCP tool integrations'],
    tags: ['python', 'autonomous', 'complex-tasks'],
    useCases: ['Paper-to-code reproduction workflows.', 'Long-running multi-step implementations.', 'Tool-augmented coding via MCP servers.'],
    reviews: [],
    version: 'latest'
  },
  {
    id: 'vibe-coding-guide',
    name: 'Vibe Coding (Guide)',
    description: 'A practical guide for “vibe coding” workflows with terminal coding agents.',
    longDescription: 'A step-by-step workflow guide for building apps/games using CLI coding agents (e.g., Claude Code and Codex CLI), emphasizing planning, memory-bank docs, and iterative testing.',
    category: AgentCategory.RESEARCH,
    stars: 0,
    language: 'Markdown',
    installCommand: 'echo "No install — this is a guide repo"',
    repoUrl: 'https://github.com/EnzeD/vibe-coding',
    features: ['Workflow guide', 'Prompting patterns', 'Planning-first methodology'],
    tags: ['prompts', 'productivity'],
    useCases: ['Adopting a structured vibe-coding process.', 'Improving prompt discipline and planning.', 'Learning CLI agent workflows end-to-end.'],
    reviews: [],
    version: '1.2.1'
  },
  {
    id: 'gentleman-guardian-angel',
    name: 'Gentleman Guardian Angel (gga)',
    description: 'Provider-agnostic AI code review as a git hook (pure Bash).',
    longDescription: 'Runs on every commit and reviews staged files against your project rules (e.g., AGENTS.md). Works with multiple provider CLIs (Claude, Gemini, Codex, OpenCode, Ollama, etc.).',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 0,
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
    version: 'v2.6.1'
  },
  {
    id: 'grok-cli',
    name: 'Grok CLI',
    description: 'Open-source terminal coding assistant with tool usage and MCP support.',
    longDescription: 'Grok CLI provides an interactive and headless terminal agent with file operations, command execution, and optional MCP server integrations.',
    category: AgentCategory.TERMINAL_UTILITY,
    stars: 0,
    language: 'TypeScript',
    installCommand: 'npm install -g @vibe-kit/grok-cli',
    platformCommands: {
      default: 'npm install -g @vibe-kit/grok-cli',
      windows: 'npm install -g @vibe-kit/grok-cli',
      notes: 'Bun install is also supported (`bun add -g @vibe-kit/grok-cli`). Requires a Grok API key for X.AI.'
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
    stars: 6000,
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
    version: 'v2.10.0'
  },
  {
    id: 'beets',
    name: 'beets',
    description: 'The ultimate music library management system.',
    longDescription: 'Beets is a powerful command-line tool for managing your music library. It catalogs your collection, automatically improving metadata using the MusicBrainz database.',
    category: AgentCategory.MUSIC,
    stars: 14600,
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
    version: 'v1.6.0'
  },
  {
    id: 'ncmpcpp',
    name: 'ncmpcpp',
    description: 'Featureful ncurses Music Player Daemon (MPD) client.',
    longDescription: 'ncmpcpp is a highly customizable and powerful MPD client for the terminal. It features a tag editor, playlist editor, visualizer, and fetching of lyrics/artist info.',
    category: AgentCategory.MUSIC,
    stars: 2400,
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
    version: '0.9.3'
  },
  {
    id: 'spotatui',
    name: 'spotatui',
    description: 'Spotify client for the terminal.',
    longDescription: 'A Spotify client for the terminal written in Rust. It utilizes the Spotify Web API to control playback and browse your library directly from the command line.',
    category: AgentCategory.MUSIC,
    stars: 1800,
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
    version: 'latest'
  },
  // --- 10.0 VIDEO & STREAMING ---
  {
    id: 'yt-dlp',
    name: 'yt-dlp',
    description: 'Feature-rich command-line video downloader.',
    longDescription: 'yt-dlp is a fork of youtube-dl with additional features and fixes. It downloads videos from YouTube and hundreds of other sites, with advanced format selection and filtering.',
    category: AgentCategory.VIDEO,
    stars: 142000,
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
    version: '2024.11.04'
  },
  {
    id: 'mpv',
    name: 'mpv',
    description: 'Command line media player.',
    longDescription: 'mpv is a free, open source, and cross-platform media player. It supports a wide variety of video file formats, audio and video codecs, and subtitle types.',
    category: AgentCategory.VIDEO,
    stars: 33600,
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
    version: 'v0.39.0'
  },
  {
    id: 'streamlink',
    name: 'streamlink',
    description: 'CLI for extracting streams to a video player.',
    longDescription: 'Streamlink is a CLI utility which pipes video streams from various services into a video player, such as VLC or mpv, allowing you to avoid buggy/heavy web players.',
    category: AgentCategory.VIDEO,
    stars: 11200,
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
    version: '6.7.3'
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
    stars: 16200,
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
    version: '1.9.3'
  },
  {
    id: 'nnn',
    name: 'nnn',
    description: 'Blazing fast terminal file browser with disk usage analyzer.',
    longDescription: 'nnn is a tiny, nearly 0-config file manager with excellent keyboard shortcuts, built-in disk usage, and extensive plugin system for extending functionality.',
    category: AgentCategory.FILE_MANAGER,
    stars: 19600,
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
    version: 'v5.0'
  },
  {
    id: 'yazi',
    name: 'yazi',
    description: 'Blazing fast terminal file manager written in Rust.',
    longDescription: 'Yazi is an async terminal file manager with image preview support, bulk renaming, and incredible speed powered by Rust and Tokio.',
    category: AgentCategory.FILE_MANAGER,
    stars: 22500,
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
    version: 'v0.4.2'
  },
  {
    id: 'lf',
    name: 'lf',
    description: 'Terminal file manager written in Go.',
    longDescription: 'lf (list files) is a highly customizable terminal file manager inspired by ranger, designed to be fast and minimal while remaining user-friendly.',
    category: AgentCategory.FILE_MANAGER,
    stars: 8200,
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
    version: 'r32'
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
    stars: 68000,
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
    version: '0.57.0'
  },
  {
    id: 'ripgrep',
    name: 'ripgrep',
    description: 'Recursively searches directories for a regex pattern.',
    longDescription: 'ripgrep is line-oriented search tool that recursively searches your current directory for a regex pattern. It respects your .gitignore and is incredibly fast.',
    category: AgentCategory.SEARCH,
    stars: 51000,
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
    version: '14.1.1'
  },
  {
    id: 'fd',
    name: 'fd',
    description: 'A simple, fast and user-friendly alternative to find.',
    longDescription: 'fd is a simple, fast, and user-friendly alternative to the classic find command. It has intuitive syntax, colorized output, and respects .gitignore.',
    category: AgentCategory.SEARCH,
    stars: 36000,
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
    version: 'v10.2.0'
  },
  {
    id: 'zoxide',
    name: 'zoxide',
    description: 'A smarter cd command that learns your habits.',
    longDescription: 'Zoxide is a smarter cd command that tracks your most-used directories and lets you jump to them with partial matching. Inspired by z and autojump.',
    category: AgentCategory.SEARCH,
    stars: 25000,
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
    version: 'v0.9.6'
  },

  // ============================================================================
  // --- 13.0 SHELL UTILITIES ---
  // ============================================================================
  {
    id: 'bat',
    name: 'bat',
    description: 'A cat clone with syntax highlighting and Git integration.',
    longDescription: 'bat is a cat replacement with syntax highlighting, line numbers, and Git integration. It makes reading code in the terminal a pleasure.',
    category: AgentCategory.SHELL_UTILITY,
    stars: 51500,
    language: 'Rust',
    installCommand: 'brew install bat',
    platformCommands: {
      default: 'brew install bat',
      linux: 'sudo apt install bat',
      macos: 'brew install bat',
      windows: 'scoop install bat',
      notes: 'On Ubuntu/Debian the command is `batcat` due to name conflict.'
    },
    repoUrl: 'https://github.com/sharkdp/bat',
    features: ['Syntax highlighting', 'Git integration', 'Line numbers', 'Paging'],
    tags: ['rust', 'terminal', 'productivity', 'open-source'],
    useCases: ['Reading code files.', 'Viewing diffs with highlighting.', 'Better cat alternative.'],
    reviews: [],
    version: 'v0.24.0'
  },
  {
    id: 'eza',
    name: 'eza',
    description: 'Modern replacement for ls with icons and Git awareness.',
    longDescription: 'eza is a modern, maintained replacement for ls written in Rust. It offers icons, Git status, and extended file information with beautiful formatting.',
    category: AgentCategory.SHELL_UTILITY,
    stars: 14000,
    language: 'Rust',
    installCommand: 'brew install eza',
    platformCommands: {
      default: 'brew install eza',
      linux: 'sudo apt install eza',
      macos: 'brew install eza',
      windows: 'scoop install eza',
      notes: 'Use a Nerd Font for icons. Alias ls to eza in your shell rc.'
    },
    repoUrl: 'https://github.com/eza-community/eza',
    features: ['Git status', 'Icons', 'Tree view', 'Extended colors'],
    tags: ['rust', 'terminal', 'productivity', 'open-source'],
    useCases: ['Better directory listings.', 'Seeing Git status at a glance.', 'Modern ls replacement.'],
    reviews: [],
    version: 'v0.20.14'
  },
  {
    id: 'dust',
    name: 'dust',
    description: 'A more intuitive version of du written in Rust.',
    longDescription: 'dust provides a user-friendly alternative to du for analyzing disk usage. It shows a visual breakdown of space usage in a directory tree.',
    category: AgentCategory.SHELL_UTILITY,
    stars: 9500,
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
    version: 'v1.1.1'
  },
  {
    id: 'duf',
    name: 'duf',
    description: 'A better df alternative with colorful output.',
    longDescription: 'duf is a Disk Usage/Free utility with better output than df. It shows all mounted filesystems with colored progress bars and human-readable sizes.',
    category: AgentCategory.SHELL_UTILITY,
    stars: 13500,
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
    version: 'v0.8.1'
  },
  {
    id: 'tldr',
    name: 'tldr',
    description: 'Simplified and community-driven man pages.',
    longDescription: 'tldr provides simplified, practical examples for command-line tools. Instead of reading long man pages, get practical examples in seconds.',
    category: AgentCategory.SHELL_UTILITY,
    stars: 52000,
    language: 'Multiple',
    installCommand: 'npm install -g tldr',
    platformCommands: {
      default: 'npm install -g tldr',
      linux: 'pip install tldr',
      macos: 'brew install tldr',
      windows: 'npm install -g tldr',
      notes: 'Run `tldr <command>` to get quick examples. Update cache with `tldr --update`.'
    },
    repoUrl: 'https://github.com/tldr-pages/tldr',
    features: ['Practical examples', 'Community maintained', 'Offline mode', 'Multi-language'],
    tags: ['terminal', 'productivity', 'documentation', 'open-source'],
    useCases: ['Quick command reference.', 'Learning CLI tools.', 'Faster than man pages.'],
    reviews: [],
    version: 'v2.2.0'
  },
  {
    id: 'thefuck',
    name: 'The Fuck',
    description: 'Corrects your previous console command.',
    longDescription: 'The Fuck is a magnificent app that corrects errors in previous console commands. Type "fuck" to get a corrected command suggestion.',
    category: AgentCategory.SHELL_UTILITY,
    stars: 88000,
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
    stars: 49000,
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
    version: 'v1.22.0'
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
    stars: 35000,
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
    stars: 3100,
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
    version: 'v1.7.2'
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
    stars: 11500,
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
    version: '1.27.2'
  },
  {
    id: 'pgcli',
    name: 'pgcli',
    description: 'A Postgres client with auto-completion and syntax highlighting.',
    longDescription: 'pgcli is a command-line interface for PostgreSQL with auto-completion, syntax highlighting, and smart completions for tables and columns.',
    category: AgentCategory.DATABASE,
    stars: 12400,
    language: 'Python',
    installCommand: 'pip install pgcli',
    platformCommands: {
      default: 'pip install pgcli',
      linux: 'pip install pgcli',
      macos: 'brew install pgcli',
      windows: 'pip install pgcli',
      notes: 'Connect with `pgcli -u user -h host database`. Supports .pgclirc config.'
    },
    repoUrl: 'https://github.com/dbcli/pgcli',
    features: ['Auto-completion', 'Syntax highlighting', 'Named queries', 'Table formatting'],
    tags: ['python', 'database', 'productivity', 'open-source'],
    useCases: ['Interactive Postgres sessions.', 'SQL development.', 'Database exploration.'],
    reviews: [],
    version: '4.1.0'
  },
  {
    id: 'usql',
    name: 'usql',
    description: 'Universal command-line interface for SQL databases.',
    longDescription: 'usql is a universal command-line interface for PostgreSQL, MySQL, SQLite, Oracle, and many other SQL databases. One tool for all your database needs.',
    category: AgentCategory.DATABASE,
    stars: 9200,
    language: 'Go',
    installCommand: 'brew install usql',
    platformCommands: {
      default: 'brew install usql',
      linux: 'go install github.com/xo/usql@latest',
      macos: 'brew install usql',
      windows: 'scoop install usql',
      notes: 'Connect with URLs: `usql postgres://user:pass@host/db`'
    },
    repoUrl: 'https://github.com/xo/usql',
    features: ['Multi-database', 'Auto-completion', 'Copy support', 'Meta-commands'],
    tags: ['go', 'database', 'productivity', 'open-source'],
    useCases: ['Universal database access.', 'Working with multiple DB types.', 'One tool for all databases.'],
    reviews: [],
    version: 'v0.19.3'
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
    stars: 31500,
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
    version: 'jq-1.7.1'
  },
  {
    id: 'yq',
    name: 'yq',
    description: 'Lightweight and portable command-line YAML processor.',
    longDescription: 'yq is a lightweight YAML processor that uses jq-like syntax. It can slice, filter, and transform YAML, JSON, XML, CSV, and properties files.',
    category: AgentCategory.DATA_PROCESSING,
    stars: 12800,
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
    version: 'v4.45.1'
  },
  {
    id: 'glow',
    name: 'glow',
    description: 'Render markdown on the CLI, with style.',
    longDescription: 'glow is a terminal-based markdown reader with glamour. It renders markdown beautifully in the terminal with customizable themes.',
    category: AgentCategory.MARKDOWN,
    stars: 17500,
    language: 'Go',
    installCommand: 'brew install glow',
    platformCommands: {
      default: 'brew install glow',
      linux: 'sudo apt install glow',
      macos: 'brew install glow',
      windows: 'scoop install glow',
      notes: 'Run `glow README.md` or `glow` for TUI mode.'
    },
    repoUrl: 'https://github.com/charmbracelet/glow',
    features: ['Styled rendering', 'Stash mode', 'Theme support', 'Pager integration'],
    tags: ['go', 'markdown', 'productivity', 'open-source'],
    useCases: ['Reading docs in terminal.', 'Previewing README files.', 'Beautiful markdown rendering.'],
    reviews: [],
    version: 'v2.0.0'
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
    stars: 7800,
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
    stars: 6100,
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
    version: 'v1.15.15'
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
    stars: 29500,
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
    version: 'v0.40.5'
  },
  {
    id: 'lazydocker',
    name: 'lazydocker',
    description: 'A simple terminal UI for Docker and Docker Compose.',
    longDescription: 'lazydocker is a terminal UI for managing Docker containers, images, volumes, and networks. It makes Docker management simple and visual.',
    category: AgentCategory.DEVOPS,
    stars: 40500,
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
    version: 'v0.23.3'
  },
  {
    id: 'ctop',
    name: 'ctop',
    description: 'Top-like interface for container metrics.',
    longDescription: 'ctop provides a concise, real-time overview of running containers similar to top for processes. Works with Docker and runc.',
    category: AgentCategory.DEVOPS,
    stars: 16000,
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
    version: 'v0.7.7'
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
    stars: 12800,
    language: 'C',
    installCommand: 'brew install tig',
    platformCommands: {
      default: 'brew install tig',
      linux: 'sudo apt install tig',
      macos: 'brew install tig',
      windows: 'scoop install tig',
      notes: 'Run `tig` in any git repo to browse history.'
    },
    repoUrl: 'https://github.com/jonas/tig',
    features: ['Log browsing', 'Diff viewing', 'Blame view', 'Staging interface'],
    tags: ['c', 'git', 'productivity', 'open-source'],
    useCases: ['Git log exploration.', 'Viewing file blame.', 'Interactive staging.'],
    reviews: [],
    version: 'tig-2.5.10'
  },
  {
    id: 'gitui',
    name: 'gitui',
    description: 'Blazing fast terminal-ui for git written in Rust.',
    longDescription: 'gitui provides a blazing fast terminal interface for Git. It aims to provide all the comfort of a Git GUI in a terminal environment.',
    category: AgentCategory.GIT_TOOL,
    stars: 19500,
    language: 'Rust',
    installCommand: 'brew install gitui',
    platformCommands: {
      default: 'brew install gitui',
      linux: 'cargo install gitui',
      macos: 'brew install gitui',
      windows: 'scoop install gitui',
      notes: 'Run `gitui` in any git repo. Supports custom keybindings.'
    },
    repoUrl: 'https://github.com/extrawurst/gitui',
    features: ['Fast performance', 'Async Git', 'Staging chunks', 'Commit signing'],
    tags: ['rust', 'git', 'productivity', 'open-source'],
    useCases: ['Fast Git interactions.', 'Staging and committing.', 'Git history browsing.'],
    reviews: [],
    version: 'v0.27.0'
  },
  {
    id: 'git-delta',
    name: 'delta',
    description: 'A syntax-highlighting pager for git, diff, and grep output.',
    longDescription: 'delta is a viewer for git and diff output with syntax highlighting, line numbers, side-by-side layout, and more. Makes diffs beautiful.',
    category: AgentCategory.GIT_TOOL,
    stars: 25000,
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
    version: '0.18.2'
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
    stars: 4500,
    language: 'C++',
    installCommand: 'brew install task',
    platformCommands: {
      default: 'brew install task',
      linux: 'sudo apt install taskwarrior',
      macos: 'brew install task',
      windows: 'scoop install task',
      notes: 'Add tasks with `task add`. List with `task list`. See `task help`.'
    },
    repoUrl: 'https://github.com/GothenburgBitFactory/taskwarrior',
    features: ['Tags & projects', 'Dependencies', 'Recurrence', 'Sync support'],
    tags: ['c++', 'productivity', 'terminal', 'open-source'],
    useCases: ['Task management.', 'Project tracking.', 'GTD workflows.'],
    reviews: [],
    version: '3.3.0'
  },
  {
    id: 'nb',
    name: 'nb',
    description: 'CLI note‑taking, bookmarking, archiving, and knowledge base app.',
    longDescription: 'nb is a command-line and local web note‑taking, bookmarking, archiving, and knowledge base application with Git-backed syncing and encryption.',
    category: AgentCategory.PRODUCTIVITY,
    stars: 7300,
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
    version: 'v7.14.6'
  },
  {
    id: 'watson',
    name: 'Watson',
    description: 'A wonderful CLI to track your time.',
    longDescription: 'Watson is a tool to help you monitor your time. You can tell Watson when you start working on a project and it will track time until you stop.',
    category: AgentCategory.PRODUCTIVITY,
    stars: 2700,
    language: 'Python',
    installCommand: 'pip install td-watson',
    platformCommands: {
      default: 'pip install td-watson',
      linux: 'pip install td-watson',
      macos: 'brew install watson',
      notes: 'Start tracking: `watson start <project>`. Stop: `watson stop`.'
    },
    repoUrl: 'https://github.com/TailorDev/Watson',
    features: ['Project tracking', 'Tags', 'Reports', 'Export formats'],
    tags: ['python', 'productivity', 'time-tracking', 'open-source'],
    useCases: ['Time tracking.', 'Client billing.', 'Productivity analysis.'],
    reviews: [],
    version: 'v2.1.0'
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
    stars: 23500,
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
    version: '1.40.0'
  },
  {
    id: 'grex',
    name: 'grex',
    description: 'A command-line tool for generating regular expressions.',
    longDescription: 'grex generates regular expressions from user-provided test cases. It simplifies the sometimes frustrating experience of writing and reading regexes.',
    category: AgentCategory.DEVELOPMENT,
    stars: 7500,
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
    version: 'v1.4.5'
  },
  {
    id: 'asciinema',
    name: 'asciinema',
    description: 'Record and share terminal sessions.',
    longDescription: 'asciinema lets you record your terminal sessions and share them as lightweight, embeddable, and linkable ASCII casts with asciinema.org.',
    category: AgentCategory.DEVELOPMENT,
    stars: 15000,
    language: 'Python',
    installCommand: 'pip install asciinema',
    platformCommands: {
      default: 'pip install asciinema',
      linux: 'sudo apt install asciinema',
      macos: 'brew install asciinema',
      notes: 'Record with `asciinema rec`. Upload to asciinema.org or save locally.'
    },
    repoUrl: 'https://github.com/asciinema/asciinema',
    features: ['Terminal recording', 'Lightweight files', 'Embedding', 'Self-hosting'],
    tags: ['python', 'development', 'documentation', 'open-source'],
    useCases: ['Recording demos.', 'Documentation.', 'Sharing terminal sessions.'],
    reviews: [],
    version: 'v2.4.0'
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
    stars: 12800,
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
    version: 'mosh-1.4.0'
  },
  {
    id: 'bandwhich',
    name: 'bandwhich',
    description: 'Terminal bandwidth utilization tool.',
    longDescription: 'bandwhich is a CLI utility for displaying current bandwidth utilization by process, connection, and remote IP/hostname.',
    category: AgentCategory.NETWORK,
    stars: 10500,
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
    version: 'v0.22.2'
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
    stars: 87000,
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
    version: 'v0.10.3'
  },
  {
    id: 'helix',
    name: 'Helix',
    description: 'A post-modern modal text editor.',
    longDescription: 'Helix is a terminal-based modal editor with batteries included. It features built-in LSP support, syntax highlighting via tree-sitter, and a selection-first design.',
    category: AgentCategory.TEXT_EDITOR,
    stars: 35500,
    language: 'Rust',
    installCommand: 'brew install helix',
    platformCommands: {
      default: 'brew install helix',
      linux: 'sudo apt install helix',
      macos: 'brew install helix',
      windows: 'scoop install helix',
      notes: 'Launch with `hx`. Built-in LSP and tree-sitter support.'
    },
    repoUrl: 'https://github.com/helix-editor/helix',
    features: ['Built-in LSP', 'Tree-sitter', 'Multiple cursors', 'Selection-first'],
    tags: ['rust', 'editor', 'productivity', 'open-source'],
    useCases: ['Modal editing.', 'Zero-config coding.', 'Modern Vi alternative.'],
    reviews: [],
    version: '24.07'
  },
  {
    id: 'micro',
    name: 'micro',
    description: 'A modern and intuitive terminal-based text editor.',
    longDescription: 'micro is a modern, easy-to-use terminal-based text editor that strives to be easy to use while being fully customizable. Think of it as nano with modern features.',
    category: AgentCategory.TEXT_EDITOR,
    stars: 26000,
    language: 'Go',
    installCommand: 'brew install micro',
    platformCommands: {
      default: 'brew install micro',
      linux: 'curl https://getmic.ro | bash',
      macos: 'brew install micro',
      windows: 'scoop install micro',
      notes: 'Intuitive keybindings (Ctrl+S save, Ctrl+Q quit). Supports plugins.'
    },
    repoUrl: 'https://github.com/zyedidia/micro',
    features: ['Syntax highlighting', 'Plugin system', 'Mouse support', 'Multi-cursor'],
    tags: ['go', 'editor', 'productivity', 'open-source'],
    useCases: ['Quick file editing.', 'Easy terminal editor.', 'nano replacement.'],
    reviews: [],
    version: 'v2.0.14'
  },

  // --- VIDEO & MEDIA ---
  {
    id: 'youtube-dl',
    name: 'youtube-dl',
    description: 'Download videos from YouTube and many other sites.',
    longDescription: 'The classic video downloader supporting 1000+ sites. Download videos, playlists, channels with format selection and subtitle support.',
    category: AgentCategory.VIDEO,
    stars: 131000,
    language: 'Python',
    installCommand: 'pip install youtube-dl',
    platformCommands: {
      default: 'pip install youtube-dl',
      windows: 'pip install youtube-dl',
      macos: 'brew install youtube-dl',
      linux: 'sudo apt install youtube-dl || pip install youtube-dl',
      notes: 'For latest features, use yt-dlp instead (youtube-dl fork)'
    },
    repoUrl: 'https://github.com/ytdl-org/youtube-dl',
    features: ['1000+ sites', 'Quality selection', 'Playlist support', 'Subtitles'],
    tags: ['python', 'video', 'download', 'open-source'],
    useCases: ['Download videos for offline viewing.', 'Archive content.', 'Extract audio.'],
    reviews: [],
    version: '2021.12.17'
  },
  {
    id: 'yt-dlp',
    name: 'yt-dlp',
    description: 'Feature-rich fork of youtube-dl with additional fixes.',
    longDescription: 'A youtube-dl fork with additional features and fixes, including better format selection, sponsorblock integration, and active maintenance.',
    category: AgentCategory.VIDEO,
    stars: 84000,
    language: 'Python',
    installCommand: 'pip install yt-dlp',
    platformCommands: {
      default: 'pip install yt-dlp',
      windows: 'winget install yt-dlp.yt-dlp',
      macos: 'brew install yt-dlp',
      linux: 'pip install yt-dlp',
      notes: 'Actively maintained youtube-dl alternative. Recommended over original.'
    },
    repoUrl: 'https://github.com/yt-dlp/yt-dlp',
    features: ['SponsorBlock', 'Better extraction', 'Active maintenance', 'More sites'],
    tags: ['python', 'video', 'download', 'open-source'],
    useCases: ['Download YouTube videos.', 'Archive streams.', 'Extract playlists.'],
    reviews: [],
    version: '2024.01.07'
  },
  {
    id: 'mpv',
    name: 'mpv',
    description: 'Free, open source, and cross-platform media player.',
    longDescription: 'A minimal media player with superior video quality. Keyboard-driven, scriptable, and highly configurable for power users.',
    category: AgentCategory.VIDEO,
    stars: 28000,
    language: 'C',
    installCommand: 'brew install mpv',
    platformCommands: {
      default: 'brew install mpv',
      windows: 'scoop install mpv',
      macos: 'brew install mpv',
      linux: 'sudo apt install mpv',
      notes: 'Launch with `mpv <file>`. Highly scriptable via Lua.'
    },
    repoUrl: 'https://mpv.io/',
    features: ['High quality playback', 'Lua scripting', 'Hardware acceleration', 'Minimal UI'],
    tags: ['video', 'media-player', 'open-source'],
    useCases: ['Watch videos from terminal.', 'Stream URLs.', 'Custom playback workflows.'],
    reviews: [],
    version: 'v0.38.0'
  },

  // --- FILE MANAGERS ---
  {
    id: 'ranger',
    name: 'ranger',
    description: 'Vi-inspired file manager for the console.',
    longDescription: 'A console file manager with VI key bindings providing a minimalistic and nice curses interface with a view on the directory hierarchy.',
    category: AgentCategory.FILE_MANAGER,
    stars: 15500,
    language: 'Python',
    installCommand: 'pip install ranger-fm',
    platformCommands: {
      default: 'pip install ranger-fm',
      macos: 'brew install ranger',
      linux: 'sudo apt install ranger',
      notes: 'Vi-style navigation. Supports file previews with external tools.'
    },
    repoUrl: 'https://github.com/ranger/ranger',
    features: ['Vi keybindings', 'File previews', 'Tabs', 'Bookmarks'],
    tags: ['python', 'file-manager', 'tui', 'vim'],
    useCases: ['Navigate directories efficiently.', 'File management with Vi keys.', 'Quick file operations.'],
    reviews: [],
    version: 'v1.9.3'
  },
  {
    id: 'nnn',
    name: 'nnn',
    description: 'The unorthodox terminal file manager.',
    longDescription: 'A full-featured terminal file manager that is extremely fast and resource-sensitive with native desktop integration.',
    category: AgentCategory.FILE_MANAGER,
    stars: 19000,
    language: 'C',
    installCommand: 'brew install nnn',
    platformCommands: {
      default: 'brew install nnn',
      linux: 'sudo apt install nnn',
      macos: 'brew install nnn',
      notes: 'Minimal resource usage. Extensive plugin ecosystem.'
    },
    repoUrl: 'https://github.com/jarun/nnn',
    features: ['Fast performance', 'Desktop integration', 'Plugins', 'Disk usage analyzer'],
    tags: ['c', 'file-manager', 'tui', 'productivity'],
    useCases: ['Browse files quickly.', 'Disk usage analysis.', 'File operations.'],
    reviews: [],
    version: 'v4.9'
  },
  {
    id: 'yazi',
    name: 'yazi',
    description: 'Blazing fast terminal file manager in Rust.',
    longDescription: 'A terminal file manager based on async I/O, featuring full asynchronous support for file preview and I/O operations.',
    category: AgentCategory.FILE_MANAGER,
    stars: 15000,
    language: 'Rust',
    installCommand: 'cargo install --locked yazi-fm',
    platformCommands: {
      default: 'cargo install --locked yazi-fm',
      macos: 'brew install yazi',
      linux: 'cargo install --locked yazi-fm',
      notes: 'Async file operations. Image previews in terminal.'
    },
    repoUrl: 'https://github.com/sxyazi/yazi',
    features: ['Async I/O', 'Image preview', 'Fast performance', 'Vim-like'],
    tags: ['rust', 'file-manager', 'tui', 'async'],
    useCases: ['Fast file browsing.', 'Image preview in terminal.', 'Async file operations.'],
    reviews: [],
    version: 'v0.3.3'
  },

  // --- SEARCH TOOLS ---
  {
    id: 'ripgrep',
    name: 'ripgrep',
    description: 'Recursively search directories for regex patterns.',
    longDescription: 'ripgrep is a line-oriented search tool that recursively searches the current directory for a regex pattern. It is blazingly fast and respects gitignore rules.',
    category: AgentCategory.SEARCH,
    stars: 48000,
    language: 'Rust',
    installCommand: 'brew install ripgrep',
    platformCommands: {
      default: 'brew install ripgrep',
      windows: 'scoop install ripgrep',
      macos: 'brew install ripgrep',
      linux: 'sudo apt install ripgrep',
      notes: 'Command is `rg`. Much faster than grep/ag.'
    },
    repoUrl: 'https://github.com/BurntSushi/ripgrep',
    features: ['Fast search', 'Gitignore support', 'Regex patterns', 'Multi-thread'],
    tags: ['rust', 'search', 'productivity', 'open-source'],
    useCases: ['Code search.', 'Log analysis.', 'Pattern matching.'],
    reviews: [],
    version: 'v14.1.0'
  },
  {
    id: 'fzf',
    name: 'fzf',
    description: 'Command-line fuzzy finder.',
    longDescription: 'A general-purpose command-line fuzzy finder that can be used with any list: files, command history, processes, hostnames, bookmarks, git commits, etc.',
    category: AgentCategory.SEARCH,
    stars: 64000,
    language: 'Go',
    installCommand: 'brew install fzf',
    platformCommands: {
      default: 'brew install fzf',
      linux: 'sudo apt install fzf || git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf && ~/.fzf/install',
      macos: 'brew install fzf',
      windows: 'scoop install fzf',
      notes: 'Integrates with shell for Ctrl+R history search'
    },
    repoUrl: 'https://github.com/junegunn/fzf',
    features: ['Fuzzy search', 'Shell integration', 'Preview window', 'Vim plugin'],
    tags: ['go', 'search', 'productivity', 'fuzzy-finder'],
    useCases: ['File selection.', 'Command history.', 'Git branch switching.'],
    reviews: [],
    version: 'v0.54.3'
  },
  {
    id: 'fd',
    name: 'fd',
    description: 'Simple, fast alternative to find.',
    longDescription: 'A user-friendly alternative to find with sensible defaults, colorized output, and smart case-insensitive search.',
    category: AgentCategory.SEARCH,
    stars: 33000,
    language: 'Rust',
    installCommand: 'brew install fd',
    platformCommands: {
      default: 'brew install fd',
      windows: 'scoop install fd',
      macos: 'brew install fd',
      linux: 'sudo apt install fd-find',
      notes: 'Command is `fd` on most systems, `fdfind` on Debian/Ubuntu'
    },
    repoUrl: 'https://github.com/sharkdp/fd',
    features: ['Fast search', 'Regex patterns', 'Colorized output', 'Gitignore support'],
    tags: ['rust', 'search', 'productivity', 'open-source'],
    useCases: ['File finding.', 'Replacing find command.', 'Quick searches.'],
    reviews: [],
    version: 'v10.2.0'
  },

  // ============================================================================
  // --- 24.0 CLASSIC TEXT EDITORS ---
  // ============================================================================
  {
    id: 'vim',
    name: 'Vim',
    description: 'The ubiquitous text editor.',
    longDescription: 'Vim is a highly configurable text editor built to enable efficient text editing. It is an improved version of the vi editor distributed with most UNIX systems.',
    category: AgentCategory.TEXT_EDITOR,
    stars: 36000,
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
    version: 'v9.1'
  },
  {
    id: 'emacs',
    name: 'Emacs',
    description: 'An extensible, customizable, free/libre text editor — and more.',
    longDescription: 'GNU Emacs is the extensible, self-documenting text editor. Emacs has over 10,000 built-in commands and can be extended with Emacs Lisp.',
    category: AgentCategory.TEXT_EDITOR,
    stars: 4700,
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
    version: '29.4'
  },
  {
    id: 'kakoune',
    name: 'Kakoune',
    description: 'Modal editor inspired by Vim.',
    longDescription: 'Kakoune is a code editor heavily inspired by Vim with a focus on interactivity and incremental results. Features multiple selections and a selection-first design.',
    category: AgentCategory.TEXT_EDITOR,
    stars: 10200,
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
    version: 'v2024.05.18'
  },

  // ============================================================================
  // --- 25.0 HTTP CLIENTS ---
  // ============================================================================
  {
    id: 'httpie',
    name: 'HTTPie',
    description: 'A user-friendly HTTP client.',
    longDescription: 'HTTPie is a command-line HTTP client with an intuitive UI, JSON support, syntax highlighting, persistent sessions, and more.',
    category: AgentCategory.HTTP_CLIENT,
    stars: 34000,
    language: 'Python',
    installCommand: 'brew install httpie',
    platformCommands: {
      default: 'brew install httpie',
      linux: 'sudo apt install httpie',
      macos: 'brew install httpie',
      windows: 'pip install httpie',
      notes: 'Use `http` command. Simpler syntax than curl.'
    },
    repoUrl: 'https://github.com/httpie/cli',
    features: ['Syntax highlighting', 'JSON support', 'Sessions', 'Plugins'],
    tags: ['python', 'http', 'api', 'open-source'],
    useCases: ['API testing.', 'HTTP debugging.', 'REST API interaction.'],
    reviews: [],
    version: '3.2.4'
  },
  {
    id: 'http-prompt',
    name: 'HTTP Prompt',
    description: 'Interactive HTTP client featuring autocomplete and syntax highlighting.',
    longDescription: 'An interactive command-line HTTP client built on HTTPie with persistent context, autocomplete, and an intuitive interface for API testing.',
    category: AgentCategory.HTTP_CLIENT,
    stars: 9100,
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
    id: 'curlie',
    name: 'curlie',
    description: 'A curl frontend with the ease of use of HTTPie.',
    longDescription: 'curlie combines the power of curl with the user-friendly interface of HTTPie. It wraps curl and provides automatic JSON formatting and colorization.',
    category: AgentCategory.HTTP_CLIENT,
    stars: 2900,
    language: 'Go',
    installCommand: 'brew install curlie',
    platformCommands: {
      default: 'brew install curlie',
      linux: 'go install github.com/rs/curlie@latest',
      macos: 'brew install curlie',
      windows: 'scoop install curlie',
      notes: 'Uses curl under the hood with HTTPie-like syntax.'
    },
    repoUrl: 'https://github.com/rs/curlie',
    features: ['curl compatibility', 'Automatic formatting', 'Color output', 'JSON highlighting'],
    tags: ['go', 'http', 'curl', 'open-source'],
    useCases: ['Curl with better UX.', 'API testing.', 'HTTP debugging.'],
    reviews: [],
    version: 'v1.7.5'
  },
  {
    id: 'atac',
    name: 'ATAC',
    description: 'A feature-full TUI API client made in Rust.',
    longDescription: 'ATAC (Arguably a Terminal API Client) is a full-featured TUI for API testing with collections, environments, and a beautiful interface.',
    category: AgentCategory.HTTP_CLIENT,
    stars: 2500,
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
    version: 'v0.19.0'
  },

  // ============================================================================
  // --- 26.0 DATABASE CLIENTS ---
  // ============================================================================
  {
    id: 'mycli',
    name: 'mycli',
    description: 'MySQL client with autocompletion and syntax highlighting.',
    longDescription: 'mycli is a command-line client for MySQL with auto-completion and syntax highlighting. It provides a modern interface for MySQL databases.',
    category: AgentCategory.DATABASE,
    stars: 11700,
    language: 'Python',
    installCommand: 'pip install mycli',
    platformCommands: {
      default: 'pip install mycli',
      linux: 'pip install mycli',
      macos: 'brew install mycli',
      windows: 'pip install mycli',
      notes: 'Connect with `mycli -u username -h host database`'
    },
    repoUrl: 'https://github.com/dbcli/mycli',
    features: ['Auto-completion', 'Syntax highlighting', 'Multi-line editing', 'Smart completion'],
    tags: ['python', 'database', 'mysql', 'open-source'],
    useCases: ['MySQL database management.', 'Query writing.', 'Database exploration.'],
    reviews: [],
    version: 'v1.27.2'
  },
  {
    id: 'pgcli',
    name: 'pgcli',
    description: 'Postgres client with autocompletion and syntax highlighting.',
    longDescription: 'pgcli is a command-line interface for Postgres with auto-completion and syntax highlighting. Makes working with PostgreSQL databases a pleasure.',
    category: AgentCategory.DATABASE,
    stars: 12300,
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
    version: 'v4.1.0'
  },
  {
    id: 'iredis',
    name: 'iredis',
    description: 'Redis client with autocompletion and syntax highlighting.',
    longDescription: 'iredis is a terminal client for Redis with auto-completion and syntax highlighting. Supports Redis Cluster and provides a better user experience than redis-cli.',
    category: AgentCategory.DATABASE,
    stars: 2700,
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
    version: 'v1.15.0'
  },
  {
    id: 'usql',
    name: 'usql',
    description: 'Universal SQL client with autocompletion and syntax highlighting.',
    longDescription: 'usql is a universal command-line interface for SQL databases with support for PostgreSQL, MySQL, SQLite, Oracle, SQL Server, and many more.',
    category: AgentCategory.DATABASE,
    stars: 9100,
    language: 'Go',
    installCommand: 'brew install usql',
    platformCommands: {
      default: 'brew install usql',
      linux: 'go install github.com/xo/usql@latest',
      macos: 'brew install usql',
      windows: 'scoop install usql',
      notes: 'Supports 20+ SQL databases. Connect with `usql postgres://...`'
    },
    repoUrl: 'https://github.com/xo/usql',
    features: ['Multi-database', 'Auto-completion', 'Syntax highlighting', '20+ drivers'],
    tags: ['go', 'database', 'sql', 'open-source'],
    useCases: ['Unified database client.', 'Multi-database projects.', 'Database migrations.'],
    reviews: [],
    version: 'v0.19.12'
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
    stars: 17300,
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
    version: '7.3.0'
  },
  {
    id: 'lazygit',
    name: 'Lazygit',
    description: 'Simple terminal UI for git commands.',
    longDescription: 'A simple terminal UI for git commands. Lazygit is a minimal terminal interface for Git with keyboard shortcuts and visual feedback.',
    category: AgentCategory.GIT_TOOL,
    stars: 55000,
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
    version: 'v0.44.1'
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
    stars: 50000,
    language: 'Rust',
    installCommand: 'brew install bat',
    platformCommands: {
      default: 'brew install bat',
      linux: 'sudo apt install bat',
      macos: 'brew install bat',
      windows: 'scoop install bat',
      notes: 'Command is `bat`. Use `bat --style=plain` for plain output.'
    },
    repoUrl: 'https://github.com/sharkdp/bat',
    features: ['Syntax highlighting', 'Git integration', 'Automatic paging', 'Line numbers'],
    tags: ['rust', 'shell', 'productivity', 'open-source'],
    useCases: ['Viewing code files.', 'Git diff viewing.', 'Replacing cat.'],
    reviews: [],
    version: 'v0.24.0'
  },
  {
    id: 'dust',
    name: 'dust',
    description: 'A more intuitive version of du in Rust.',
    longDescription: 'dust is like du but more intuitive. It provides a tree-like visualization of disk usage with colors and percentages.',
    category: AgentCategory.SHELL_UTILITY,
    stars: 9500,
    language: 'Rust',
    installCommand: 'brew install dust',
    platformCommands: {
      default: 'brew install dust',
      linux: 'cargo install du-dust',
      macos: 'brew install dust',
      windows: 'cargo install du-dust',
      notes: 'Run `dust` to see disk usage tree. Much faster than du.'
    },
    repoUrl: 'https://github.com/bootandy/dust',
    features: ['Tree visualization', 'Fast scanning', 'Percentage display', 'Color coding'],
    tags: ['rust', 'shell', 'disk-usage', 'open-source'],
    useCases: ['Disk usage analysis.', 'Finding large files.', 'Cleaning up space.'],
    reviews: [],
    version: 'v1.1.1'
  },
  {
    id: 'eza',
    name: 'eza',
    description: 'A modern replacement for ls.',
    longDescription: 'eza is a modern replacement for the venerable file-listing command-line program ls. It uses colours to distinguish file types and metadata, and has Git awareness.',
    category: AgentCategory.SHELL_UTILITY,
    stars: 12500,
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
    version: 'v0.20.7'
  },
  {
    id: 'lsd',
    name: 'lsd',
    description: 'The next gen ls command.',
    longDescription: 'lsd (LSDeluxe) is a rewrite of GNU ls with lots of added features like colors, icons, tree-view, and more. Built in Rust.',
    category: AgentCategory.SHELL_UTILITY,
    stars: 13800,
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
    version: 'v1.1.5'
  },
  {
    id: 'ncdu',
    name: 'NCDu',
    description: 'A disk usage analyzer with an ncurses interface.',
    longDescription: 'NCDu (NCurses Disk Usage) is a disk usage analyzer with an ncurses interface. It provides a fast way to see what directories are using your disk space.',
    category: AgentCategory.SHELL_UTILITY,
    stars: 4300,
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
    version: '2.3'
  }
];

/**
 * CLI AI Evolution Timeline
 * Based on actual historical releases and technological milestones
 * Each entry represents a quantifiable shift in terminal/CLI capabilities
 */
export const CLI_AI_TIMELINE = [
  {
    year: 1969,
    event: 'Unix Shell Created',
    detail: 'Thompson Shell establishes foundational CLI paradigm.',
    impact: 'Set architectural patterns for 50+ years of terminal evolution'
  },
  {
    year: 1989,
    event: 'Bash 1.0 Released',
    detail: 'GNU Bourne Again Shell becomes de facto standard.',
    impact: 'Scripting automation reaches mainstream adoption'
  },
  {
    year: 2005,
    event: 'Git Version Control',
    detail: 'Distributed VCS revolutionizes code collaboration.',
    impact: 'Enables modern DevOps and CI/CD workflows'
  },
  {
    year: 2011,
    event: 'GitHub CLI Integration',
    detail: 'API-driven terminal workflows emerge.',
    impact: 'CLI becomes primary interface for code hosting platforms'
  },
  {
    year: 2018,
    event: 'GPT-2 Open Sourced',
    detail: 'First accessible language model for developers.',
    impact: 'Natural language processing becomes viable for CLI integration'
  },
  {
    year: 2020,
    event: 'GPT-3 API Launch',
    detail: 'Large-scale language models available via API.',
    impact: 'Enables first generation of AI-augmented terminal tools'
  },
  {
    year: 2021,
    event: 'GitHub Copilot Beta',
    detail: 'AI pair programming enters mainstream development.',
    impact: 'Demonstrates viability of context-aware code assistance'
  },
  {
    year: 2022,
    event: 'ChatGPT Public Release',
    detail: 'Conversational AI reaches 100M users in 2 months.',
    impact: 'Natural language interfaces become expected feature'
  },
  {
    year: 2023,
    event: 'Claude 2 with Tool Use',
    detail: 'LLMs gain native function calling capabilities.',
    impact: 'Autonomous code execution becomes production-viable'
  },
  {
    year: 2023,
    event: 'Aider & Open Interpreter Launch',
    detail: 'First autonomous coding agents for local development.',
    impact: 'Shift from code suggestion to autonomous implementation'
  },
  {
    year: 2024,
    event: 'Gemini 1.5 Pro (1M Context)',
    detail: 'Extended context windows enable full codebase understanding.',
    impact: 'Models can process entire projects in single inference'
  },
  {
    year: 2024,
    event: 'Claude 3.7 Sonnet + Computer Use',
    detail: 'Multi-modal agents with screen reading and tool execution.',
    impact: 'Terminal agents gain OS-level control capabilities'
  },
  {
    year: 2024,
    event: 'OpenHands & Plandex Scale',
    detail: 'Sandbox environments and 2M+ token contexts.',
    impact: 'Enterprise-scale autonomous development becomes feasible'
  },
  {
    year: 2025,
    event: 'Agentic CLI Ecosystem',
    detail: 'Specialized terminal agents for every development phase.',
    impact: 'Terminal transforms from tool to autonomous development platform',
    projectedGrowthRate: 0.847 // 84.7% YoY growth in CLI AI adoption
  }
];
