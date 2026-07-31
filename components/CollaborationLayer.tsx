import React, { useEffect, useState } from 'react';
import { Agent } from '../types';
import { X, Users, Play, Bot, MessageSquare } from 'lucide-react';
import { simulateCollaboration } from '../services/localModelService';
import MarkdownText from '../utils/markdown';

interface CollaborationLayerProps {
    squad: Agent[];
    onClose: () => void;
    onRemoveFromSquad: (agent: Agent) => void;
}

const CollaborationLayer: React.FC<CollaborationLayerProps> = ({ squad, onClose, onRemoveFromSquad }) => {
    const [mission, setMission] = useState('');
    const [simulation, setSimulation] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = prevOverflow;
        };
    }, [onClose]);

    const handleRunSimulation = async () => {
        if (!mission.trim()) return;
        setLoading(true);
        const result = await simulateCollaboration(squad, mission);
        setSimulation(result);
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }} role="dialog" aria-modal="true" aria-label="Mission Control">
            {/* Header */}
            <div className="px-6 py-4 flex justify-between items-center" style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--accent-glow)', border: '1px solid var(--accent)' }}>
                        <Users style={{ color: 'var(--accent)' }} size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>MISSION CONTROL</h2>
                        <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>MULTI-AGENT COLLABORATION PROTOCOL</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-full transition-colors" style={{ color: 'var(--text-muted)' }}>
                    <X size={24} />
                </button>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar: Squad Roster */}
                <div className="w-80 p-6 overflow-y-auto" style={{ backgroundColor: 'var(--bg-tertiary)', borderRight: '1px solid var(--border)' }}>
                    <h3 className="text-xs font-mono uppercase mb-4 flex items-center justify-between" style={{ color: 'var(--text-muted)' }}>
                        Active Squad
                        <span className="px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{squad.length}</span>
                    </h3>

                    <div className="space-y-3">
                        {squad.map(agent => (
                            <div key={agent.id} className="group relative p-3 rounded-lg transition-all" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{agent.name}</span>
                                    <button
                                        onClick={() => onRemoveFromSquad(agent)}
                                        className="transition-colors"
                                        style={{ color: 'var(--text-muted)' }}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                                <div className="text-[10px] font-mono inline-block px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                                    {agent.category}
                                </div>
                            </div>
                        ))}
                        {squad.length === 0 && (
                            <div className="text-sm italic text-center py-10 rounded-lg" style={{ color: 'var(--text-muted)', border: '1px dashed var(--border)' }}>
                                No agents recruited.
                                <br />
                                Add agents from the registry.
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content: Mission & Simulation */}
                <div className="flex-1 flex flex-col" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    {/* Mission Input */}
                    <div className="p-6" style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border)' }}>
                        <label className="block text-xs font-mono mb-2 uppercase" style={{ color: 'var(--text-muted)' }}>Mission Objective</label>
                        <div className="flex gap-4">
                            <div className="flex-1 relative">
                                <textarea
                                    className="w-full rounded-lg p-4 text-sm outline-none h-24 resize-none font-mono"
                                    style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                                    placeholder="Describe the task for the squad (e.g., 'Build a full-stack todo app with Python backend and React frontend')"
                                    value={mission}
                                    onChange={(e) => setMission(e.target.value)}
                                    aria-label="Mission objective"
                                />
                            </div>
                            <button
                                onClick={handleRunSimulation}
                                disabled={loading || squad.length < 1 || !mission.trim()}
                                className="w-32 flex flex-col items-center justify-center rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                style={{ backgroundColor: 'var(--accent-glow)', border: '1px solid var(--accent)', color: 'var(--accent)' }}
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin mb-2" />
                                ) : (
                                    <Play size={24} className="mb-2" />
                                )}
                                <span className="text-xs font-bold uppercase">Execute</span>
                            </button>
                        </div>
                    </div>

                    {/* Simulation Output */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        {simulation ? (
                            <div className="max-w-4xl mx-auto">
                                <div className="flex items-center gap-2 mb-6 text-sm font-mono uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                                    <MessageSquare size={16} /> Live Transcript
                                </div>
                                <div className="max-w-none space-y-6">
                                    <MarkdownText content={simulation} className="text-sm leading-relaxed" />
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center space-y-4" style={{ color: 'var(--text-muted)' }}>
                                <Bot size={48} className="opacity-20" />
                                <p className="text-sm font-mono">Waiting for mission parameters...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollaborationLayer;