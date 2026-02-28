
import React from 'react';
import { Agent } from '../types';
import { Terminal, Star, Check, Plus, Minus, ArrowRightLeft, Activity, Github } from 'lucide-react';
import { suggestCopyCommand } from '../utils/command';

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

const AgentCard: React.FC<AgentCardProps> = React.memo(({ agent, onClick, isInSquad: _isInSquad, onToggleSquad: _onToggleSquad, isComparing, onToggleCompare, isBundled, onToggleBundle, platform }) => {
  const [copied, setCopied] = React.useState(false);

  const installCommand = React.useMemo(() => {
    if (platform && agent.platformCommands && agent.platformCommands[platform]) {
      return agent.platformCommands[platform]!;
    }
    return agent.installCommand;
  }, [agent, platform]);

  const copyCommand = React.useMemo(() => suggestCopyCommand(installCommand), [installCommand]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'LIVE': return { color: 'var(--success)', bg: 'var(--success)', borderColor: 'var(--success)' };
      case 'SYNCING': return { color: 'var(--accent)', bg: 'var(--accent)', borderColor: 'var(--accent)' };
      case 'UPDATE_AVAILABLE': return { color: 'var(--warning)', bg: 'var(--warning)', borderColor: 'var(--warning)' };
      default: return { color: 'var(--text-muted)', bg: 'var(--text-muted)', borderColor: 'var(--text-muted)' };
    }
  };

  const statusStyle = getStatusStyle(agent.status || 'LIVE');

  const getVerificationStyle = (status: Agent['verificationStatus']) => {
    switch (status) {
      case 'VERIFIED':
        return { color: 'var(--success)', label: 'VERIFIED' };
      case 'DEGRADED':
        return { color: 'var(--warning)', label: 'DEGRADED' };
      case 'FAILED':
        return { color: 'var(--error)', label: 'FAILED' };
      default:
        return { color: 'var(--text-muted)', label: 'UNVERIFIED' };
    }
  };

  const verificationStyle = getVerificationStyle(agent.verificationStatus);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(copyCommand).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      setCopied(false);
    });
  };

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
      <div className="px-4 py-2 flex justify-between items-center"
        style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--glass)' }}>
        <div className={`flex items-center gap-2 px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-widest ${agent.status === 'SYNCING' ? 'animate-pulse' : ''}`}
          style={{
            color: statusStyle.color,
            backgroundColor: `color-mix(in srgb, ${statusStyle.bg} 10%, transparent)`,
            border: `1px solid color-mix(in srgb, ${statusStyle.borderColor} 20%, transparent)`
          }}>
          <Activity size={10} />
          {agent.status || 'LIVE'}
        </div>
        <div className="flex items-center gap-2 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          <div
            title={`Verification: ${verificationStyle.label}${agent.lastVerified ? ` (last: ${agent.lastVerified.slice(0, 10)})` : ''}`}
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: verificationStyle.color, boxShadow: `0 0 10px color-mix(in srgb, ${verificationStyle.color} 35%, transparent)` }}
          />
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
              color: copied ? 'var(--success)' : 'var(--bg-primary)',
              border: copied ? '1px solid var(--success)' : '1px solid transparent'
            }}
            title={copied ? 'Copied' : copyCommand}
          >
            {copied ? <Check size={14} /> : <span className="font-mono">$</span>}
            {copied ? (
              'COPIED'
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
