
export enum AgentCategory {
  CODING = 'Coding Assistant',
  AUTONOMOUS = 'Autonomous Agent',
  TERMINAL_UTILITY = 'Terminal Utility',
  FRAMEWORK = 'Agent Framework',
  RESEARCH = 'Research/Data',
  INFRASTRUCTURE = 'Infrastructure/Cloud',
  ENTERTAINMENT = 'Entertainment',
  MUSIC = 'Music',
  VIDEO = 'Video',
  // --- Additional Categories for THE_LIST.md coverage ---
  FILE_MANAGER = 'File Manager',
  PRODUCTIVITY = 'Productivity',
  SHELL_UTILITY = 'Shell Utility',
  DEVELOPMENT = 'Development Tool',
  DATABASE = 'Database Client',
  DEVOPS = 'DevOps Tool',
  SECURITY = 'Security Tool',
  TEXT_EDITOR = 'Text Editor',
  MARKDOWN = 'Markdown Tool',
  DATA_PROCESSING = 'Data Processing',
  NETWORK = 'Network Utility',
  SEARCH = 'Search Tool',
  GIT_TOOL = 'Git Tool',
  HTTP_CLIENT = 'HTTP Client',
  THEMING = 'Theming/Customization'
}





export type StarsSource = 'REGISTRY' | 'GITHUB_API' | 'UNKNOWN';

export interface Review {
  id: string;
  user: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

/**
 * Platform-specific installation instructions
 * Provides commands for different operating systems
 */
export interface PlatformInstallCommands {
  /** Default command (usually Unix/macOS) */
  default: string;
  /** Windows PowerShell command */
  windows?: string;
  /** Linux-specific command if different from default */
  linux?: string;
  /** macOS-specific command if different from default */
  macos?: string;
  /** Docker-based installation (cross-platform) */
  docker?: string;
  /** Additional notes or prerequisites */
  notes?: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  category: AgentCategory;
  stars: number;
  language: string;
  /** Primary install command (backward compatible) */
  installCommand: string;
  /** Platform-specific installation commands */
  platformCommands?: PlatformInstallCommands;
  repoUrl: string;
  features: string[];
  tags: string[];
  useCases: string[];
  reviews: Review[];
  isNew?: boolean;
  lastSynced?: string;
  version?: string;
  /** Troubleshooting tips for common installation issues */
  troubleshooting?: string[];

  /**
   * Trust & authority (optional): populated via local verification.
   * Stored locally; never fabricated.
   */
  lastVerified?: string;
  starsSource?: StarsSource;
  repoUpdatedAt?: string;
  verificationNotes?: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
