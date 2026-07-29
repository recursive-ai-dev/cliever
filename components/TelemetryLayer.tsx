import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { X, Activity, Database, GitBranch, Gauge, RefreshCw, ShieldCheck, AlertTriangle, Download, RotateCcw, Check } from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { AnalyticsService } from '../services/analyticsService';
import { GitHubService } from '../services/githubService';
import { RegistrySyncService } from '../services/syncService';
import { StorageService } from '../services/storageService';
import { logger } from '../services/logger';
import { copyText } from '../utils/clipboard';

interface TelemetryLayerProps {
  onClose: () => void;
}

const CHART_COLORS = ['#14b8a6', '#22d3ee', '#818cf8', '#f59e0b', '#10b981', '#f472b6', '#a78bfa', '#fb7185'];

const CHARTABLE_METRICS = new Set(['api_response_time', 'render_time']);

const formatBytes = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const formatDuration = (ms: number): string => {
  if (!Number.isFinite(ms) || ms < 0) return '0s';
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ${seconds % 60}s`;
};

const useTelemetrySnapshot = () => {
  const collect = useCallback(() => {
    const exported = AnalyticsService.exportData();
    return {
      session: AnalyticsService.getSessionStats(),
      eventsByType: AnalyticsService.getEventStatsByType(),
      performance: AnalyticsService.getPerformanceStats(),
      errors: AnalyticsService.getErrorStats(),
      health: AnalyticsService.getHealthStatus(),
      readiness: AnalyticsService.getProductionReadiness(),
      github: GitHubService.getHealthStatus(),
      syncCache: RegistrySyncService.getCacheStats(),
      storage: StorageService.getUsageStats(),
      logs: logger.getStats(),
      perfHistory: exported.performance
        .filter(m => CHARTABLE_METRICS.has(m.metricName) && m.unit === 'ms')
        .slice(-30)
        .map((m, idx) => ({ idx: idx + 1, value: Math.round(m.value), metric: m.metricName }))
    };
  }, []);

  const [snapshot, setSnapshot] = useState(collect);

  useEffect(() => {
    const interval = setInterval(() => setSnapshot(collect()), 2000);
    return () => clearInterval(interval);
  }, [collect]);

  const refreshNow = useCallback(() => setSnapshot(collect()), [collect]);

  return { snapshot, refreshNow };
};

const TelemetryLayer: React.FC<TelemetryLayerProps> = ({ onClose }) => {
  const { snapshot, refreshNow } = useTelemetrySnapshot();
  const [exportState, setExportState] = useState<'idle' | 'copied' | 'failed'>('idle');

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const eventTypeData = useMemo(
    () =>
      Object.entries(snapshot.eventsByType)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8),
    [snapshot.eventsByType]
  );

  const totalEvents = useMemo(
    () => eventTypeData.reduce((sum, entry) => sum + entry.value, 0),
    [eventTypeData]
  );

  const handleExport = async () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      session: snapshot.session,
      health: snapshot.health,
      readiness: snapshot.readiness,
      performance: snapshot.performance,
      errors: snapshot.errors,
      eventsByType: snapshot.eventsByType,
      system: {
        github: snapshot.github,
        syncCache: snapshot.syncCache,
        storage: { usedBytes: snapshot.storage.used, availableBytes: snapshot.storage.available },
        logs: snapshot.logs
      },
      analytics: AnalyticsService.exportData()
    };
    const ok = await copyText(JSON.stringify(payload, null, 2));
    setExportState(ok ? 'copied' : 'failed');
    setTimeout(() => setExportState('idle'), 2000);
  };

  const handleReset = () => {
    AnalyticsService.reset();
    refreshNow();
  };

  const healthColor =
    snapshot.health.status === 'healthy'
      ? 'var(--success)'
      : snapshot.health.status === 'degraded'
        ? 'var(--warning)'
        : 'var(--error)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-6xl mx-auto rounded-2xl overflow-hidden flex flex-col max-h-[90vh]"
        style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--accent)', boxShadow: '0 0 50px var(--accent-glow)' }}
        role="dialog"
        aria-label="System telemetry"
      >
        {/* Header */}
        <div
          className="p-4 flex justify-between items-center"
          style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-tertiary)' }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--accent-glow)', border: '1px solid var(--accent)' }}>
              <Gauge size={20} style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <h2 className="text-sm font-mono font-bold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                System Telemetry
              </h2>
              <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                LOCAL MONITORING · NO DATA LEAVES THIS DEVICE · REFRESHES EVERY 2s
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-mono uppercase transition-all"
              style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
              title="Reset analytics counters"
            >
              <RotateCcw size={12} />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-mono uppercase transition-all"
              style={{
                backgroundColor: exportState === 'copied' ? 'var(--accent-glow)' : 'var(--bg-primary)',
                border: exportState === 'copied' ? '1px solid var(--success)' : '1px solid var(--border)',
                color: exportState === 'copied' ? 'var(--success)' : exportState === 'failed' ? 'var(--error)' : 'var(--text-secondary)'
              }}
              title="Copy full telemetry JSON to clipboard"
            >
              {exportState === 'copied' ? <Check size={12} /> : <Download size={12} />}
              <span className="hidden sm:inline">{exportState === 'copied' ? 'Copied' : exportState === 'failed' ? 'Failed' : 'Export'}</span>
            </button>
            <button onClick={onClose} className="transition-colors" style={{ color: 'var(--text-muted)' }} aria-label="Close telemetry">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* KPI row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase" style={{ color: 'var(--text-muted)' }}>
                <ShieldCheck size={12} /> Health
              </div>
              <div className="mt-2 text-2xl font-bold font-mono" style={{ color: healthColor }}>
                {snapshot.health.score}
                <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>/100</span>
              </div>
              <div className="text-[10px] font-mono uppercase" style={{ color: healthColor }}>{snapshot.health.status}</div>
            </div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase" style={{ color: 'var(--text-muted)' }}>
                <Activity size={12} /> Events
              </div>
              <div className="mt-2 text-2xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>{snapshot.session.eventCount}</div>
              <div className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                {snapshot.session.eventsPerMinute.toFixed(1)}/min · {formatDuration(snapshot.session.durationMs)}
              </div>
            </div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase" style={{ color: 'var(--text-muted)' }}>
                <AlertTriangle size={12} /> Errors
              </div>
              <div
                className="mt-2 text-2xl font-bold font-mono"
                style={{ color: snapshot.errors.totalErrors > 0 ? 'var(--warning)' : 'var(--success)' }}
              >
                {snapshot.errors.totalErrors}
              </div>
              <div className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                {snapshot.errors.errorRate.toFixed(2)}/min
              </div>
            </div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase" style={{ color: 'var(--text-muted)' }}>
                <RefreshCw size={12} /> Readiness
              </div>
              <div className="mt-2 text-2xl font-bold font-mono" style={{ color: 'var(--accent)' }}>{snapshot.readiness.score}</div>
              <div className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{snapshot.readiness.overallStatus}</div>
            </div>
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl min-h-[240px]" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
              <div className="text-[10px] font-mono uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
                Events by type
              </div>
              {totalEvents > 0 ? (
                <div className="h-[190px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={eventTypeData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={2}
                        stroke="none"
                      >
                        {eventTypeData.map((entry, idx) => (
                          <Cell key={entry.name} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--bg-secondary)',
                          border: '1px solid var(--border)',
                          borderRadius: 8,
                          fontSize: 11,
                          fontFamily: 'Fira Code, monospace',
                          color: 'var(--text-primary)'
                        }}
                        itemStyle={{ color: 'var(--text-secondary)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[190px] flex items-center justify-center text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                  No events yet — interact with the registry (search, sync, chat).
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl min-h-[240px]" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
              <div className="text-[10px] font-mono uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
                Response time (ms) — last {snapshot.perfHistory.length} samples
              </div>
              {snapshot.perfHistory.length > 0 ? (
                <div className="h-[190px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={snapshot.perfHistory} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                      <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                      <XAxis dataKey="idx" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                      <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--bg-secondary)',
                          border: '1px solid var(--border)',
                          borderRadius: 8,
                          fontSize: 11,
                          fontFamily: 'Fira Code, monospace',
                          color: 'var(--text-primary)'
                        }}
                        itemStyle={{ color: 'var(--text-secondary)' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="var(--accent)"
                        fill="var(--accent-glow)"
                        strokeWidth={2}
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[190px] flex items-center justify-center text-xs font-mono text-center px-6" style={{ color: 'var(--text-muted)' }}>
                  No latency samples yet — send a chat message or generate an analysis.
                </div>
              )}
            </div>
          </div>

          {/* Readiness categories */}
          <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
            <div className="text-[10px] font-mono uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
              Production readiness breakdown
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              {Object.entries(snapshot.readiness.categories).map(([name, data]) => (
                <div key={name}>
                  <div className="flex justify-between text-[10px] font-mono mb-1">
                    <span className="uppercase" style={{ color: 'var(--text-secondary)' }}>{name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{data.score.toFixed(0)}/100</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.max(0, Math.min(100, data.score))}%`,
                        backgroundColor: data.score >= 90 ? 'var(--success)' : data.score >= 75 ? 'var(--accent)' : 'var(--warning)'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System detail grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
                <GitBranch size={12} /> GitHub Uplink
              </div>
              <div className="space-y-1 text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                <div className="flex justify-between"><span>Circuit breaker</span><span style={{ color: snapshot.github.circuitBreakerState === 'closed' ? 'var(--success)' : 'var(--warning)' }}>{snapshot.github.circuitBreakerState.toUpperCase()}</span></div>
                <div className="flex justify-between"><span>Status cache</span><span>{snapshot.syncCache.entries} entries</span></div>
                <div className="flex justify-between"><span>Avg cache age</span><span>{(snapshot.syncCache.avgAgeMs / 1000).toFixed(0)}s</span></div>
              </div>
            </div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
                <Database size={12} /> Local Storage
              </div>
              <div className="space-y-1 text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                <div className="flex justify-between"><span>Used</span><span>{formatBytes(snapshot.storage.used)}</span></div>
                <div className="flex justify-between"><span>Available</span><span>{formatBytes(snapshot.storage.available)}</span></div>
                <div className="flex justify-between"><span>Keys</span><span>{snapshot.storage.keys.length}</span></div>
              </div>
            </div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
                <Activity size={12} /> Logger
              </div>
              <div className="space-y-1 text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                <div className="flex justify-between"><span>Total entries</span><span>{snapshot.logs['total'] ?? 0}</span></div>
                <div className="flex justify-between"><span>Warnings</span><span style={{ color: (snapshot.logs['warn'] ?? 0) > 0 ? 'var(--warning)' : 'inherit' }}>{snapshot.logs['warn'] ?? 0}</span></div>
                <div className="flex justify-between"><span>Errors+</span><span style={{ color: ((snapshot.logs['error'] ?? 0) + (snapshot.logs['critical'] ?? 0)) > 0 ? 'var(--error)' : 'inherit' }}>{(snapshot.logs['error'] ?? 0) + (snapshot.logs['critical'] ?? 0)}</span></div>
              </div>
            </div>
          </div>

          <div className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
            Session {snapshot.session.sessionId} · Telemetry stays in memory and local storage on this device; nothing is transmitted.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelemetryLayer;
