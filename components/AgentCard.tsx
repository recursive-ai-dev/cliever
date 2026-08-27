
import React from 'react';
import { Agent } from '../types';
import { Terminal, Star, Check, Plus, Minus, ArrowRightLeft, Github, Users, AlertTriangle } from 'lucide-react';
import { suggestCopyCommand } from '../utils/command';
import { copyText } from '../utils/clipboard';
import { AnalyticsService, AnalyticsEventType } from '../services/analyticsService';

interface AgentCardProps {
  agent: Agent;
  onClick: (agent: Agent) => void;
  isInSquad: boolean;
  onToggleSquad: (agent: Agent) => void;
  isComparing: boolean;
  onToggleCompare: (agent: Agent) => void;
  isBundled: boolean;
  onToggleBundle: (agent: Agent) => void;
  platform?: 'windows' | 'linux' | 'macos';
}

const AgentCard: React.FC<AgentCardProps> = React.memo(({ agent, onClick, isInSquad, onToggleSquad, isComparing, onToggleCompare, isBundled, onToggleBundle, platform }) => {
  const [copyState, setCopyState] = React.useState<'idle' | 'copied' | 'failed'>('idle');

  const installCommand = React.useMemo(() => {
    if (platform && agent.platformCommands && agent.platformCommands[platform]) {
      return agent.platformCommands[platform]!;
    }
    return agent.installCommand;
  }, [agent, platform]);

  const copyCommand = React.useMemo(() => suggestCopyCommand(installCommand), [installCommand]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    copyText(copyCommand).then((ok) => {
      setCopyState(ok ? 'copied' : 'failed');
      setTimeout(() => setCopyState('idle'), 2000);
      if (ok) {
        AnalyticsService.trackEvent(AnalyticsEventType.AGENT_INSTALL_COPY, {
          agentId: agent.id,
          agentName: agent.name,
          platform: platform ?? 'default'
        });
      } else {
        AnalyticsService.trackError('Clipboard copy failed', { context: 'agent_card_copy', agentId: agent.id }, 'low');
      }
    });
  };

  const copied = copyState === 'copied';

  return (
    <div
      onClick={() => onClick(agent)}
      className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] cursor-pointer flex flex-col h-full"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: isComparing ? '1px solid var(--accent)' : '1px solid var(--border)',
        boxShadow: isComparing ? '0 0 20px var(--accent-glow)' : 'none'
      }}
    >
      {/* HUD Bar */}
      <div className="px-4 py-2 flex justify-end items-center"
        style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--glass)' }}>
        <div className="flex items-center gap-2 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          <Star size={12} style={{ color: 'var(--warning)' }} />
          {agent.stars.toLocaleString()}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 rounded-xl transition-all duration-500"
            style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
            <Terminal size={24} style={{ color: 'var(--text-muted)' }} className="group-hover:text-[var(--accent)]" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onToggleSquad(agent); }}
              className="p-2 rounded-lg transition-all"
              style={{
                backgroundColor: isInSquad ? 'var(--accent-glow)' : 'var(--bg-tertiary)',
                border: isInSquad ? '1px solid var(--accent)' : '1px solid var(--border)',
                color: isInSquad ? 'var(--accent)' : 'var(--text-muted)'
              }}
              title={isInSquad ? 'Remove from squad' : 'Recruit to squad (Mission Control)'}
              aria-label={isInSquad ? 'Remove from squad' : 'Recruit to squad'}
            >
              <Users size={16} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onToggleBundle(agent); }}
              className="p-2 rounded-lg transition-all"
              style={{
                backgroundColor: isBundled ? 'var(--accent-glow)' : 'var(--bg-tertiary)',
                border: isBundled ? '1px solid var(--accent)' : '1px solid var(--border)',
                color: isBundled ? 'var(--accent)' : 'var(--text-muted)'
              }}
              title={isBundled ? 'Remove from bundle' : 'Add to bundle'}
              aria-label={isBundled ? 'Remove from bundle' : 'Add to bundle'}
            >
              {isBundled ? <Minus size={16} /> : <Plus size={16} />}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onToggleCompare(agent); }}
              className="p-2 rounded-lg transition-all"
              style={{
                backgroundColor: isComparing ? 'var(--accent-glow)' : 'var(--bg-tertiary)',
                border: isComparing ? '1px solid var(--accent)' : '1px solid var(--border)',
                color: isComparing ? 'var(--accent)' : 'var(--text-muted)'
              }}
              title={isComparing ? 'Remove from comparison' : 'Add to comparison'}
              aria-label={isComparing ? 'Remove from comparison' : 'Add to comparison'}
            >
              <ArrowRightLeft size={16} />
            </button>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-2 transition-colors font-mono tracking-tight"
          style={{ color: 'var(--text-primary)' }}>
          {agent.name}
        </h3>
        <p className="text-xs font-mono mb-4 uppercase tracking-tighter" style={{ color: 'var(--text-muted)' }}>{agent.category}</p>

        <p className="text-sm mb-6 line-clamp-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {agent.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto mb-6">
          {(agent.tags || []).slice(0, 3).map(tag => (
            <span key={tag} className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-1 rounded"
              style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); window.open(agent.repoUrl, '_blank'); }}
            className="p-2.5 rounded-xl transition-all hover:text-white"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)'
            }}
            title="View Source Repository"
          >
            <Github size={18} />
          </button>
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all"
            style={{
              backgroundColor: copied ? 'var(--accent-glow)' : 'var(--accent)',
              color: copied ? 'var(--success)' : copyState === 'failed' ? 'var(--bg-primary)' : 'var(--bg-primary)',
              border: copied ? '1px solid var(--success)' : copyState === 'failed' ? '1px solid var(--error)' : '1px solid transparent'
            }}
            title={copied ? 'Copied' : copyState === 'failed' ? 'Copy failed — select the command manually' : copyCommand}
          >
            {copied ? <Check size={14} /> : copyState === 'failed' ? <AlertTriangle size={14} style={{ color: 'var(--error)' }} /> : <span className="font-mono">$</span>}
            {copied ? (
              'COPIED'
            ) : copyState === 'failed' ? (
              'COPY_FAILED'
            ) : (
              <span className="font-mono text-[10px] truncate max-w-[220px]">{copyCommand}</span>
            )}
          </button>
        </div>
      </div>

      {/* Decorative scanline */}
      <div className="absolute top-0 left-0 w-full h-px transform -translate-y-full group-hover:translate-y-[400px] transition-transform duration-[2s] ease-linear"
        style={{ background: 'linear-gradient(to right, transparent, var(--accent-glow), transparent)' }}></div>
    </div>
  );
});

export default AgentCard;
