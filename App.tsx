
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { AGENTS } from './constants';
import { Agent, AgentCategory, Review, ChatMessage } from './types';
import TerminalHero from './components/TerminalHero';
import AgentCard from './components/AgentCard';
import AgentDetailLayer from './components/AgentDetailLayer';
import ComparisonLayer from './components/ComparisonLayer';
import TakeBundleLayer from './components/TakeBundleLayer';
import CollaborationLayer from './components/CollaborationLayer';
import CommandGenerator from './components/CommandGenerator';
import TelemetryLayer from './components/TelemetryLayer';
import ThemeSelector from './components/ThemeSelector';
import { applyTheme, getStoredTheme } from './utils/theme';
import {
  Search, MessageSquare,
  ArrowUpDown, Terminal, X, Tag,
  Wifi, ChevronLeft, ChevronRight, RefreshCw, Activity,
  Users, SquareTerminal, Gauge
} from 'lucide-react';
import { askExpert } from './services/localModelService';
import { AnalyticsService, AnalyticsEventType } from './services/analyticsService';
import { RegistrySyncService } from './services/syncService';
import { ReviewStorage, VerificationStorage } from './services/storageService';
import { VerificationService } from './services/verificationService';
import { logger } from './services/logger';
import { validateAgents, sanitizeAgent } from './utils/validation';
import { sanitizeChatMessage, sanitizeSearchQuery, getErrorMessage } from './utils/sanitization';


import { agentMatchesQuery } from './utils/search';
import PlatformSelector from './components/PlatformSelector';
import { isAgentCompatible, Platform } from './utils/platform';

/**
 * Validate the static registry once at module load (schema integrity gate).
 * Invalid entries are dropped and reported; valid ones pass through
 * sanitization so every consumer sees clamped, well-formed data.
 */
const BOOT_REGISTRY: Agent[] = (() => {
  const { valid, invalid, warnings } = validateAgents(AGENTS);
  if (invalid.length > 0) {
    logger.error('Registry validation dropped invalid entries', {
      dropped: invalid.map(entry => ({ index: entry.index, errors: entry.errors }))
    });
  }
  if (warnings.length > 0) {
    logger.warn('Registry validation warnings', { warnings: warnings.slice(0, 10), total: warnings.length });
  }
  logger.info('Registry boot validation complete', {
    total: AGENTS.length,
    valid: valid.length,
    invalid: invalid.length
  });
  return valid.map(sanitizeAgent);
})();

/**
 * Validates and merges reviews from storage with agent data
 */
const initializeAgentReviews = (agent: Agent): Agent => {
  const storedReviews = ReviewStorage.getReviews(agent.id);

  // Prime for real users: only show reviews saved locally by users.
  // Any seeded/static reviews in the registry are ignored.
  const uniqueReviews = Array.from(
    new Map(storedReviews.map(r => [r.id, r])).values()
  );

  return {
    ...agent,
    reviews: uniqueReviews.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  };
};

/**
 * Merges local verification metadata (trust signals) into agent data.
 * Never fabricates: only uses locally-stored verification records.
 */
const initializeAgentVerification = (agent: Agent): Agent => {
  const rec = VerificationStorage.get(agent.id);
  if (!rec) return agent;
  return {
    ...agent,
    lastVerified: rec.lastVerified,
    starsSource: rec.starsSource,
    repoUpdatedAt: rec.repoUpdatedAt,
    verificationNotes: rec.verificationNotes
  };
};

const App: React.FC = () => {
  // Initialize theme on mount
  useEffect(() => {
    applyTheme(getStoredTheme());
  }, []);

  // Initialize agents with stored reviews
  const [agents, setAgents] = useState<Agent[]>(() =>
    BOOT_REGISTRY.map(a => {
      const withRuntime = {
        ...a,
        lastSynced: new Date().toISOString()
      };
      return initializeAgentVerification(initializeAgentReviews(withRuntime));
    })
  );
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [compareAgentA, setCompareAgentA] = useState<Agent | null>(null);
  const [compareAgentB, setCompareAgentB] = useState<Agent | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  // Sync Engine State
  const [isGlobalSyncing, setIsGlobalSyncing] = useState(false);
  const [lastGlobalSync, setLastGlobalSync] = useState(new Date().toLocaleTimeString());

  const [isGlobalVerifying, setIsGlobalVerifying] = useState(false);
  const [lastGlobalVerify, setLastGlobalVerify] = useState<string | null>(null);

  // Squad State
  const [squad, setSquad] = useState<Agent[]>([]);
  const [showCollab, setShowCollab] = useState(false);

  // System Tool Modals
  const [showCommandGenerator, setShowCommandGenerator] = useState(false);
  const [showTelemetry, setShowTelemetry] = useState(false);

  // Bundle State (commands-only persistence)
  const [bundledAgentIds, setBundledAgentIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('cliever_bundle_agent_ids');
      const parsed = raw ? (JSON.parse(raw) as unknown) : [];
      return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
    } catch {
      return [];
    }
  });
  const [showTakeBundle, setShowTakeBundle] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('Stars (High-Low)');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Chat State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('cliever_chat_history');
      return saved ? JSON.parse(saved) : [
        { role: 'model', text: 'cliever Node initialized. Direct metadata pulling active. How can I assist?' }
      ];
    } catch {
      return [{ role: 'model', text: 'cliever Node initialized. Direct metadata pulling active. How can I assist?' }];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cliever_chat_history', JSON.stringify(chatHistory));
    } catch (e) {
      console.error('Failed to save chat history', e);
    }
  }, [chatHistory]);

  const [chatLoading, setChatLoading] = useState(false);
  const chatRequestIdRef = useRef<number>(0);
  const chatAbortRef = useRef<AbortController | null>(null);

  // Platform State
  const [globalPlatform, setGlobalPlatform] = useState<Platform | null>(null);

  // Handlers (Memoized)
  const handleAgentClick = React.useCallback((a: Agent) => {
    setSelectedAgent(a);
    AnalyticsService.trackEvent(AnalyticsEventType.AGENT_VIEW, {
      agentId: a.id,
      agentName: a.name,
      category: a.category
    });
  }, []);

  const handleToggleSquad = React.useCallback((a: Agent) => {
    setSquad(prev => prev.some(s => s.id === a.id) ? prev.filter(s => s.id !== a.id) : [...prev, a]);
  }, []);

  const handleOpenCollab = React.useCallback(() => {
    setShowCollab(true);
    AnalyticsService.trackEvent(AnalyticsEventType.COLLABORATION_STARTED, {
      squadSize: squad.length,
      agentIds: squad.map(s => s.id)
    });
  }, [squad]);

  const handleOpenComparison = React.useCallback(() => {
    setShowComparison(true);
    if (compareAgentA && compareAgentB) {
      AnalyticsService.trackEvent(AnalyticsEventType.COMPARISON_STARTED, {
        agentA: compareAgentA.id,
        agentB: compareAgentB.id
      });
    }
  }, [compareAgentA, compareAgentB]);

  const handleToggleCompare = React.useCallback((a: Agent) => {
    if (compareAgentA?.id === a.id) setCompareAgentA(null);
    else if (compareAgentB?.id === a.id) setCompareAgentB(null);
    else if (!compareAgentA) setCompareAgentA(a);
    else if (!compareAgentB) setCompareAgentB(a);
    else {
      // Both slots filled - shift B to A, new agent becomes B
      setCompareAgentA(compareAgentB);
      setCompareAgentB(a);
    }
  }, [compareAgentA, compareAgentB]);

  const handleToggleBundle = React.useCallback((a: Agent) => {
    setBundledAgentIds(prev => {
      if (prev.includes(a.id)) return prev.filter(id => id !== a.id);
      return [...prev, a.id];
    });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('cliever_bundle_agent_ids', JSON.stringify(bundledAgentIds));
    } catch {
      // Storage unavailable
    }
  }, [bundledAgentIds]);

  /**
   * Handle adding a new review with persistence
   */
  const handleAddReview = useCallback((agentId: string, review: Omit<Review, 'id' | 'date'>) => {
    const newReview = ReviewStorage.addReview(agentId, review);

    if (newReview) {
      // Update agent state with new review
      setAgents(prev => prev.map(agent => {
        if (agent.id !== agentId) return agent;

        const existingReviews = agent.reviews || [];
        return {
          ...agent,
          reviews: [newReview, ...existingReviews]
        };
      }));

      // Update selected agent if it's the one being reviewed
      setSelectedAgent(prev => {
        if (!prev || prev.id !== agentId) return prev;
        return {
          ...prev,
          reviews: [newReview, ...(prev.reviews || [])]
        };
      });

      // Track analytics
      AnalyticsService.trackEvent(AnalyticsEventType.REVIEW_ADDED, {
        agentId,
        rating: review.rating
      });
    }
  }, []);

  /**
   * Delete a locally-stored review
   */
  const handleDeleteReview = useCallback((agentId: string, reviewId: string) => {
    const deleted = ReviewStorage.deleteReview(agentId, reviewId);
    if (!deleted) return;

    const withoutReview = (agent: Agent): Agent =>
      agent.id === agentId
        ? { ...agent, reviews: (agent.reviews || []).filter(r => r.id !== reviewId) }
        : agent;

    setAgents(prev => prev.map(withoutReview));
    setSelectedAgent(prev => (prev ? withoutReview(prev) : prev));

    AnalyticsService.trackEvent(AnalyticsEventType.REVIEW_DELETED, { agentId });
  }, []);

  /**
   * Persisted verification updates from AgentDetailLayer
   */
  const handleVerificationUpdate = useCallback((agentId: string, patch: Partial<Agent>) => {
    setAgents(prev => prev.map(agent => (agent.id === agentId ? { ...agent, ...patch } : agent)));
    setSelectedAgent(prev => (prev && prev.id === agentId ? { ...prev, ...patch } : prev));
  }, []);

  // Filter & Sort Logic (Memoized for performance)
  const sortedFilteredAgents = useMemo(() => {
    const result = agents.filter(agent => {
      const matchesSearch = agentMatchesQuery(agent, searchQuery);
      const matchesCategory = selectedCategory === 'All' || agent.category === selectedCategory;
      const matchesPlatform = globalPlatform ? isAgentCompatible(agent, globalPlatform) : true;
      return matchesSearch && matchesCategory && matchesPlatform;
    });

    return result.sort((a, b) => {
      switch (sortBy) {
        case 'Stars (High-Low)': return b.stars - a.stars;
        case 'Stars (Low-High)': return a.stars - b.stars;
        case 'Name (A-Z)': return a.name.localeCompare(b.name);
        case 'Name (Z-A)': return b.name.localeCompare(a.name);
        default: return 0;
      }
    });
  }, [agents, searchQuery, selectedCategory, sortBy, globalPlatform]);

  // Pagination Logic
  const totalPages = Math.ceil(sortedFilteredAgents.length / itemsPerPage);
  const paginatedAgents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedFilteredAgents.slice(start, start + itemsPerPage);
  }, [sortedFilteredAgents, currentPage]);

  // Clamp the page when filters shrink the result set. This adjust-during-render
  // pattern is the React-sanctioned alternative to a setState-in-effect loop.
  if (totalPages === 0 && currentPage !== 1) {
    setCurrentPage(1);
  } else if (totalPages > 0 && currentPage > totalPages) {
    setCurrentPage(totalPages);
  }

  // Initialize analytics and log production readiness on mount
  useEffect(() => {
    // Log production readiness status
    const readiness = AnalyticsService.getProductionReadiness();
    console.log('🚀 CLI-Verse Production Status:');
    console.log(`   Overall Score: ${readiness.score}/100 - ${readiness.overallStatus}`);
    console.log('   Category Breakdown:');
    Object.entries(readiness.categories).forEach(([name, data]) => {
      console.log(`   - ${name}: ${data.score}/100 ${data.status}`);
    });

    // Track app initialization
    AnalyticsService.trackEvent(AnalyticsEventType.PERFORMANCE_METRIC, {
      metric: 'app_init',
      timestamp: Date.now()
    });
  }, []);

  useEffect(() => {
    return () => {
      chatAbortRef.current?.abort('component-unmount');
    };
  }, []);

  // Deterministic Status Checker (Background Loop)
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(a => ({
        ...a,
        isActive: RegistrySyncService.checkStatus(a)
      })));
      // Keep selectedAgent status in sync with the background refresh
      setSelectedAgent(prev => {
        if (!prev) return prev;
        return { ...prev, isActive: RegistrySyncService.checkStatus(prev) };
      });
    }, 30000); // Check status every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!searchQuery) return;
    const handle = setTimeout(() => {
      if (searchQuery.length > 2) {
        AnalyticsService.trackEvent(AnalyticsEventType.SEARCH_QUERY, {
          query: searchQuery,
          length: searchQuery.length
        });
      }
    }, 350);

    return () => clearTimeout(handle);
  }, [searchQuery]);

  const handleGlobalSync = async () => {
    setIsGlobalSyncing(true);
    setChatHistory(prev => [...prev, { role: 'model', text: '> PULLING LATEST METADATA FROM REGISTRY NODES...' }]);

    // Logic: Force all visible agents into SYNCING state
// Sync UI indicator can be handled without mutating agent properties or left out.

    // Use production-grade batch sync service
    try {
      await RegistrySyncService.syncMultipleAgents(agents, 5);

      setAgents(prev => prev.map(a => ({
        ...a,
        lastSynced: new Date().toISOString()
      })));

      // Keep selectedAgent in sync to prevent stale status in the detail modal
      setSelectedAgent(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          lastSynced: new Date().toISOString()
        };
      });

      setLastGlobalSync(new Date().toLocaleTimeString());
      setChatHistory(prev => [...prev, { role: 'model', text: `> REGISTRY SYNCHRONIZED.` }]);
    } catch (error) {
      console.error('Sync failed:', error);
      setChatHistory(prev => [...prev, { role: 'model', text: '> SYNC ERROR. FALLING BACK TO CACHED DATA.' }]);

      // Fallback to cached/live status
      setAgents(prev => prev.map(a => ({
        ...a,
        lastSynced: new Date().toISOString()
      })));
      setSelectedAgent(prev => prev ? { ...prev, lastSynced: new Date().toISOString() } : prev);
    } finally {
      setIsGlobalSyncing(false);
    }
  };

  const handleVerifyVisible = async () => {
    if (isGlobalVerifying) return;
    setIsGlobalVerifying(true);

    AnalyticsService.trackEvent(AnalyticsEventType.SYNC_TRIGGERED, {
      action: 'verify_visible',
      page: currentPage,
      totalPages,
      count: paginatedAgents.length
    });

    try {
      const updates = await Promise.allSettled(
        paginatedAgents.map(async (a) => {
          const { agentPatch } = await VerificationService.verifyAgent(a);
          return { id: a.id, patch: agentPatch };
        })
      );

      setAgents(prev => {
        const patchById = new Map<string, Partial<Agent>>();
        for (const u of updates) {
          if (u.status === 'fulfilled') {
            patchById.set(u.value.id, u.value.patch);
          }
        }

        return prev.map(agent => {
          const patch = patchById.get(agent.id);
          return patch ? { ...agent, ...patch } : agent;
        });
      });

      setSelectedAgent(prev => {
        if (!prev) return prev;
        const found = updates.find(u => u.status === 'fulfilled' && u.value.id === prev.id);
        if (found && found.status === 'fulfilled') {
          return { ...prev, ...found.value.patch };
        }
        return prev;
      });

      setLastGlobalVerify(new Date().toLocaleTimeString());
    } finally {
      setIsGlobalVerifying(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const sanitizedInput = sanitizeChatMessage(chatInput);
    const userMsg = sanitizedInput;
    const requestId = Date.now();
    chatRequestIdRef.current = requestId;

    // Abort any in-flight request to prevent races
    if (chatAbortRef.current) {
      chatAbortRef.current.abort('replaced');
    }
    const controller = new AbortController();
    chatAbortRef.current = controller;

    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setChatLoading(true);

    AnalyticsService.trackEvent(AnalyticsEventType.CHAT_MESSAGE_SENT, {
      messageLength: userMsg.length,
      context: 'main_chat'
    });

    const startTime = performance.now();
    const context = `Registry Context: ${agents.length} tools indexed. Sector ${currentPage}/${totalPages} active.`;

    try {
      const response = await askExpert(userMsg, context, { signal: controller.signal });
      const isLatest = chatRequestIdRef.current === requestId;

      if (isLatest) {
        const responseTime = performance.now() - startTime;
        AnalyticsService.trackPerformance('api_response_time', responseTime, 'ms');
        setChatHistory(prev => [...prev, { role: 'model', text: response }]);
      }
    } catch (error: unknown) {
      const isLatest = chatRequestIdRef.current === requestId;
      if (!isLatest) return;

      if ((error as Error)?.name === 'AbortError') {
        setChatHistory(prev => [...prev, { role: 'model', text: 'Request cancelled. You can retry.' }]);
        return;
      }

      const errorMessage = getErrorMessage(error);
      AnalyticsService.trackError(new Error(errorMessage), { context: 'chat_submit' }, 'medium');
      setChatHistory(prev => [...prev, { role: 'model', text: 'Error: The local engine could not complete that request. Try rephrasing or retry.' }]);
    } finally {
      if (chatRequestIdRef.current === requestId) {
        setChatLoading(false);
      }
    }
  };

  const categories = ['All', ...Object.values(AgentCategory)];

  if (!globalPlatform) {
    return <PlatformSelector onSelect={setGlobalPlatform} />;
  }

  return (
    <div className="min-h-screen font-sans selection:bg-cyan-500/30 selection:text-cyan-200"
      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>

      {/* HUD / Navigation */}
      <nav className="sticky top-0 z-30 backdrop-blur-md border-b px-6 py-4 flex justify-between items-center glass-panel"
        style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-6">
          <div className="font-mono font-bold text-xl tracking-tighter" style={{ color: 'var(--text-primary)' }}>
            clie<span style={{ color: 'var(--accent)' }}>ver</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[10px] font-mono uppercase tracking-widest border-l pl-6"
            style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2">
              <Activity size={12} style={{ color: 'var(--success)' }} />
              STATUS: <span style={{ color: 'var(--text-primary)' }}>OPERATIONAL</span>
            </div>
            <div className="flex items-center gap-2">
              <Wifi size={12} style={{ color: 'var(--accent)' }} />
              NODES: <span style={{ color: 'var(--text-primary)' }}>{agents.length}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <ThemeSelector />
          <button
            onClick={() => setShowTelemetry(true)}
            className="p-2 rounded-full transition-all border"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border)',
              color: 'var(--text-secondary)'
            }}
            aria-label="Open system telemetry"
            title="System Telemetry"
          >
            <Gauge size={16} />
          </button>
          <button
            onClick={() => setShowCommandGenerator(true)}
            className="p-2 rounded-full transition-all border"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border)',
              color: 'var(--text-secondary)'
            }}
            aria-label="Open shell command generator"
            title="Shell Command Generator (Natural Language → Shell)"
          >
            <SquareTerminal size={16} />
          </button>
          <button
            onClick={handleOpenCollab}
            className="relative p-2 rounded-full transition-all border"
            style={{
              backgroundColor: squad.length > 0 ? 'var(--accent-glow)' : 'var(--bg-secondary)',
              borderColor: squad.length > 0 ? 'var(--accent)' : 'var(--border)',
              color: squad.length > 0 ? 'var(--accent)' : 'var(--text-secondary)'
            }}
            aria-label={`Open Mission Control (${squad.length} agents in squad)`}
            title="Mission Control (Multi-Agent Squad)"
          >
            <Users size={16} />
            {squad.length > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-mono font-bold flex items-center justify-center"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
              >
                {squad.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setShowTakeBundle(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 border rounded-lg text-xs font-mono transition-all"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: bundledAgentIds.length > 0 ? 'var(--accent)' : 'var(--border)',
              color: bundledAgentIds.length > 0 ? 'var(--accent)' : 'var(--text-secondary)'
            }}
            aria-label="Take bundle"
            title="Take bundle"
          >
            <Tag size={14} />
            <span className="hidden sm:inline">TAKE_BUNDLE</span>
            <span className="text-[10px]">{bundledAgentIds.length}</span>
          </button>
          <button
            onClick={handleGlobalSync}
            disabled={isGlobalSyncing}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 border rounded-lg text-xs font-mono transition-all"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: isGlobalSyncing ? 'var(--accent)' : 'var(--border)',
              color: isGlobalSyncing ? 'var(--accent)' : 'var(--text-secondary)'
            }}
            aria-label={isGlobalSyncing ? 'Syncing registry' : 'Force sync registry'}
          >
            <RefreshCw size={14} className={isGlobalSyncing ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">{isGlobalSyncing ? 'SYNCING...' : 'FORCE_SYNC'}</span>
          </button>
          <button
            onClick={handleVerifyVisible}
            disabled={isGlobalVerifying}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 border rounded-lg text-xs font-mono transition-all"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: isGlobalVerifying ? 'var(--accent)' : 'var(--border)',
              color: isGlobalVerifying ? 'var(--accent)' : 'var(--text-secondary)'
            }}
            title={lastGlobalVerify ? `Last verify: ${lastGlobalVerify}` : 'Verify current page agents'}
            aria-label={isGlobalVerifying ? 'Verifying visible agents' : 'Verify visible agents'}
          >
            <RefreshCw size={14} className={isGlobalVerifying ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">{isGlobalVerifying ? 'VERIFYING...' : 'VERIFY_VISIBLE'}</span>
          </button>
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="p-2 rounded-full transition-all"
            style={{
              backgroundColor: chatOpen ? 'var(--accent)' : 'var(--bg-secondary)',
              color: chatOpen ? 'var(--bg-primary)' : 'var(--text-secondary)',
              borderWidth: chatOpen ? 0 : 1,
              borderColor: 'var(--border)',
              boxShadow: chatOpen ? '0 0 20px var(--accent-glow)' : 'none'
            }}
            aria-label={chatOpen ? 'Close system chat' : 'Open system chat'}
            title="System Chat"
          >
            <MessageSquare size={18} />
          </button>
          <button
            onClick={() => setGlobalPlatform(null)}
            className="p-2 rounded-full transition-all border border-dashed"
            style={{ borderColor: 'var(--text-muted)', color: 'var(--text-muted)' }}
            title={`Change Platform (Current: ${globalPlatform})`}
            aria-label={`Change platform, currently ${globalPlatform}`}
          >
            <Terminal size={18} />
          </button>
        </div>
      </nav>

      <TerminalHero isScanning={isGlobalSyncing} />

      {/* Registry Tools Section */}
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">

        {/* Advanced Sector Controls */}
        <div className="flex flex-col gap-6 mb-12">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                    AnalyticsService.trackEvent(AnalyticsEventType.FILTER_APPLIED, {
                      filterType: 'category',
                      value: cat
                    });
                  }}
                  className="whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-mono transition-all border"
                  style={{
                    backgroundColor: selectedCategory === cat ? 'var(--accent-glow)' : 'transparent',
                    borderColor: selectedCategory === cat ? 'var(--accent)' : 'var(--border)',
                    color: selectedCategory === cat ? 'var(--accent)' : 'var(--text-muted)'
                  }}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="text-[10px] font-mono uppercase" style={{ color: 'var(--text-muted)' }}>
              Last Global Sync: {lastGlobalSync}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={16} style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="SEARCH_REGISTRY_METADATA..."
                value={searchQuery}
                onChange={(e) => {
                  const sanitized = sanitizeSearchQuery(e.target.value);
                  setSearchQuery(sanitized);
                }}
                className="w-full rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none font-mono shadow-inner transition-all"
                style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                aria-label="Search registry"
              />
            </div>

            <div className="relative min-w-[200px]">
              <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2" size={14} style={{ color: 'var(--text-muted)' }} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none rounded-xl pl-11 pr-8 py-3 text-sm focus:outline-none font-mono cursor-pointer"
                style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                aria-label="Sort agents"
              >
                <option>Stars (High-Low)</option>
                <option>Stars (Low-High)</option>
                <option>Name (A-Z)</option>
                <option>Name (Z-A)</option>
                <option>Verified (First)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {paginatedAgents.map(agent => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onClick={handleAgentClick}
              isInSquad={squad.some(s => s.id === agent.id)}
              onToggleSquad={handleToggleSquad}
              isComparing={compareAgentA?.id === agent.id || compareAgentB?.id === agent.id}
              onToggleCompare={handleToggleCompare}
              isBundled={bundledAgentIds.includes(agent.id)}
              onToggleBundle={handleToggleBundle}
              platform={globalPlatform}
            />
          ))}
        </div>

        {/* Sector Navigation (Pagination) */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-6 py-8" style={{ borderTop: '1px solid var(--border)' }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg transition-all disabled:opacity-20"
              style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
              aria-label="Previous page"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-3 font-mono text-sm">
              <span style={{ color: 'var(--text-muted)' }}>SECTOR</span>
              <span className="font-bold" style={{ color: 'var(--accent)' }}>{currentPage}</span>
              <span style={{ color: 'var(--border)' }}>/</span>
              <span style={{ color: 'var(--text-muted)' }}>{totalPages}</span>
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg transition-all disabled:opacity-20"
              style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
              aria-label="Next page"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </main>

      {/* Global Modals */}
      {selectedAgent && (
        <AgentDetailLayer
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
          onCompare={(a) => { setCompareAgentA(a); setSelectedAgent(null); }}
          onAddReview={handleAddReview}
          onDeleteReview={handleDeleteReview}
          onVerificationUpdate={handleVerificationUpdate}
          isBundled={bundledAgentIds.includes(selectedAgent.id)}
          onToggleBundle={handleToggleBundle}
          platform={globalPlatform}
        />
      )}

      {showTakeBundle && (
        <TakeBundleLayer
          agents={agents}
          bundledAgentIds={bundledAgentIds}
          onClose={() => setShowTakeBundle(false)}
        />
      )}

      {showCollab && (
        <CollaborationLayer
          squad={squad}
          onClose={() => setShowCollab(false)}
          onRemoveFromSquad={handleToggleSquad}
        />
      )}

      {showCommandGenerator && (
        <CommandGenerator onClose={() => setShowCommandGenerator(false)} />
      )}

      {showTelemetry && (
        <TelemetryLayer onClose={() => setShowTelemetry(false)} />
      )}

      {(compareAgentA || compareAgentB) && !showComparison && (
        <div className="fixed bottom-6 left-4 right-4 md:right-8 md:left-auto z-40 backdrop-blur-xl p-4 rounded-2xl shadow-2xl flex flex-col md:flex-row md:items-center gap-4 md:gap-6 animate-slide-in-up max-w-sm md:max-w-none"
          style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--accent)' }}>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase" style={{ color: 'var(--accent)' }}>Comparison Queue</span>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: compareAgentA ? 'var(--accent)' : 'var(--border)' }}></div>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: compareAgentB ? 'var(--accent)' : 'var(--border)' }}></div>
              <span className="text-xs font-mono ml-2" style={{ color: 'var(--text-primary)' }}>
                {compareAgentA?.name || '...'} vs {compareAgentB?.name || '...'}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleOpenComparison}
              disabled={!compareAgentA || !compareAgentB}
              className="px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all disabled:opacity-30"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
            >
              Analyze
            </button>
            <button onClick={() => { setCompareAgentA(null); setCompareAgentB(null); }} className="p-2" style={{ color: 'var(--text-muted)' }} aria-label="Clear comparison queue"><X size={16} /></button>
          </div>
        </div>
      )}

      {showComparison && compareAgentA && (
        <ComparisonLayer
          agentA={compareAgentA}
          agentB={compareAgentB}
          onClose={() => setShowComparison(false)}
          onClear={() => { setCompareAgentA(null); setCompareAgentB(null); setShowComparison(false); }}
        />
      )}

      {/* Persistent System Chat */}
      {chatOpen && (
        <div className="fixed inset-x-4 md:left-auto md:right-8 bottom-20 w-auto md:w-96 max-w-[640px] h-[65vh] md:h-[500px] rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden animate-slide-in-up"
          style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
          <div className="p-4 flex justify-between items-center" style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
            <span className="text-[10px] font-mono font-bold flex items-center gap-2 uppercase tracking-[0.2em]" style={{ color: 'var(--accent)' }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--success)' }}></div>
              Terminal_Guardian
            </span>
            <button onClick={() => setChatOpen(false)} style={{ color: 'var(--text-muted)' }} aria-label="Close chat"><X size={14} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-[85%] rounded-lg p-3"
                  style={msg.role === 'user'
                    ? { backgroundColor: 'var(--accent-glow)', color: 'var(--accent)', border: '1px solid var(--accent)' }
                    : { backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {chatLoading && <div className="animate-pulse" style={{ color: 'var(--accent)' }}>&gt; ANALYZING DATA STREAM...</div>}
          </div>
          <form onSubmit={handleChatSubmit} className="p-3" style={{ borderTop: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)' }}>
            <input
              className="w-full rounded-lg px-4 py-2 text-xs focus:outline-none font-mono"
              style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              placeholder="QUERY_REGISTRY..."
              value={chatInput}
              onChange={(e) => {
                const sanitized = sanitizeChatMessage(e.target.value);
                setChatInput(sanitized);
              }}
              aria-label="Chat with the local engine"
            />
          </form>
        </div>
      )}
    </div>
  );
};

export default App;
