import React, { useEffect, useMemo, useState } from 'react';
import { X, Copy, Check, Monitor, Apple, Terminal, AlertCircle } from 'lucide-react';
import { Agent } from '../types';
import { copyText } from '../utils/clipboard';

export type BundleOS = 'windows' | 'macos' | 'linux';

interface TakeBundleLayerProps {
  agents: Agent[];
  bundledAgentIds: string[];
  onClose: () => void;
}

const detectOS = (): BundleOS => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes('win')) return 'windows';
  if (userAgent.includes('mac')) return 'macos';
  return 'linux';
};

const pickCommandForOS = (agent: Agent, os: BundleOS): string => {
  const pc = agent.platformCommands;
  if (!pc) return agent.installCommand;

  if (os === 'windows') return pc.windows || pc.docker || pc.default || agent.installCommand;
  if (os === 'macos') return pc.macos || pc.default || pc.docker || agent.installCommand;
  return pc.linux || pc.default || pc.docker || agent.installCommand;
};

const TakeBundleLayer: React.FC<TakeBundleLayerProps> = ({ agents, bundledAgentIds, onClose }) => {
  const [os, setOS] = useState<BundleOS>(() => detectOS());
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');

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

  const bundledAgents = useMemo(() => {
    const byId = new Map(agents.map(a => [a.id, a] as const));
    return bundledAgentIds
      .map(id => byId.get(id))
      .filter((a): a is Agent => Boolean(a));
  }, [agents, bundledAgentIds]);

  const commands = useMemo(() => {
    return bundledAgents.map(a => ({
      id: a.id,
      name: a.name,
      command: pickCommandForOS(a, os),
      notes: a.platformCommands?.notes
    }));
  }, [bundledAgents, os]);

  const outputText = useMemo(() => {
    if (commands.length === 0) return '';

    const header = `# Bundle commands (${os})\n`;
    const body = commands
      .map(c => {
        const comment = `\n# ${c.name}\n`;
        const cmd = c.command;
        const note = c.notes ? `\n# Note: ${c.notes}\n` : '';
        return `${comment}${cmd}${note}`;
      })
      .join('\n');

    return `${header}\n${body}`.trim();
  }, [commands, os]);

  const handleCopyAll = async () => {
    const ok = await copyText(outputText);
    setCopyState(ok ? 'copied' : 'failed');
    setTimeout(() => setCopyState('idle'), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-3xl mx-auto rounded-2xl overflow-hidden flex flex-col max-h-[85vh]"
        style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--accent)', boxShadow: '0 0 50px var(--accent-glow)' }}
      >
        <div
          className="p-4 flex justify-between items-center"
          style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-tertiary)' }}
        >
          <div className="flex items-center gap-3">
            <div className="text-xs font-mono font-bold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
              TAKE_BUNDLE
            </div>
            <div className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
              {bundledAgentIds.length} command{bundledAgentIds.length === 1 ? '' : 's'} saved
            </div>
          </div>
          <button onClick={onClose} className="transition-colors" style={{ color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Operating System
              </div>
              <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                Commands auto-adjust using each tool’s platform instructions when available.
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setOS('windows')}
                className="px-3 py-2 rounded-lg text-xs font-mono transition-all"
                style={{
                  backgroundColor: os === 'windows' ? 'var(--accent-glow)' : 'var(--bg-primary)',
                  border: os === 'windows' ? '1px solid var(--accent)' : '1px solid var(--border)',
                  color: os === 'windows' ? 'var(--accent)' : 'var(--text-muted)'
                }}
                title="Windows"
              >
                <span className="inline-flex items-center gap-2">
                  <Monitor size={14} /> Windows
                </span>
              </button>
              <button
                onClick={() => setOS('macos')}
                className="px-3 py-2 rounded-lg text-xs font-mono transition-all"
                style={{
                  backgroundColor: os === 'macos' ? 'var(--accent-glow)' : 'var(--bg-primary)',
                  border: os === 'macos' ? '1px solid var(--accent)' : '1px solid var(--border)',
                  color: os === 'macos' ? 'var(--accent)' : 'var(--text-muted)'
                }}
                title="macOS"
              >
                <span className="inline-flex items-center gap-2">
                  <Apple size={14} /> macOS
                </span>
              </button>
              <button
                onClick={() => setOS('linux')}
                className="px-3 py-2 rounded-lg text-xs font-mono transition-all"
                style={{
                  backgroundColor: os === 'linux' ? 'var(--accent-glow)' : 'var(--bg-primary)',
                  border: os === 'linux' ? '1px solid var(--accent)' : '1px solid var(--border)',
                  color: os === 'linux' ? 'var(--accent)' : 'var(--text-muted)'
                }}
                title="Linux"
              >
                <span className="inline-flex items-center gap-2">
                  <Terminal size={14} /> Linux
                </span>
              </button>
            </div>
          </div>

          <div className="relative">
            <div
              className="absolute -top-3 left-3 px-2 text-xs font-mono"
              style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }}
            >
              BUNDLE_OUTPUT
            </div>

            <div
              className="rounded-xl p-4 font-mono text-xs whitespace-pre-wrap min-h-[200px]"
              style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            >
              {outputText || 'No bundle items yet. Use the + buttons on agents to add commands.'}
            </div>

            {outputText && (
              <button
                onClick={handleCopyAll}
                className="absolute top-2 right-2 p-2 rounded transition-colors"
                style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                title={copyState === 'failed' ? 'Copy failed — select the text manually' : 'Copy bundle output'}
                aria-label="Copy bundle output"
              >
                {copyState === 'copied' ? <Check size={14} style={{ color: 'var(--success)' }} /> : copyState === 'failed' ? <AlertCircle size={14} style={{ color: 'var(--error)' }} /> : <Copy size={14} />}
              </button>
            )}
          </div>

          <div className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
            Saved in browser storage as commands-only; no external calls.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeBundleLayer;
