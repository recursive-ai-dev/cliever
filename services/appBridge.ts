import type { Platform } from '../utils/platform';

/**
 * The seam between chat and the app. App.tsx registers a controller that operates on its real
 * React state; chat (askExpert) calls it to drive the UI. Nothing here touches the DOM or React.
 */

export type PanelName = 'comparison' | 'missionControl' | 'bundle' | 'telemetry' | 'commandGenerator';
export type ListName = 'compare' | 'squad' | 'bundle';

export const SORT_OPTIONS = [
  'Stars (High-Low)',
  'Stars (Low-High)',
  'Name (A-Z)',
  'Name (Z-A)',
  'Verified (First)',
] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

export interface AppSnapshot {
  platform: Platform | null;
  search: string;
  category: string;
  sort: string;
  page: number;
  totalPages: number;
  resultCount: number;
  registrySize: number;
  theme: string;
  panel: PanelName | 'agentDetail' | null;
  selectedAgentId: string | null;
  compare: string[];
  squad: string[];
  bundle: string[];
}

export interface AppController {
  snapshot(): AppSnapshot;
  /** Number of tools a filter combination would show, using the same rules as the grid. */
  countMatches(filters: { search: string; category: string }): number;
  setSearch(query: string): void;
  setCategory(category: string): void;
  setSort(sort: SortOption): void;
  goToPage(page: number): void;
  clearFilters(): void;
  openAgent(agentId: string): boolean;
  openPanel(panel: PanelName): void;
  closePanels(): void;
  setMembership(list: ListName, agentId: string, member: boolean): void;
  clearList(list: ListName): void;
  setPlatform(platform: Platform): void;
  setTheme(theme: string): void;
  sync(): void;
  verify(): void;
}

let controller: AppController | null = null;

export const registerAppController = (next: AppController | null): void => {
  controller = next;
};

export const getAppController = (): AppController | null => controller;
