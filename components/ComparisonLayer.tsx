import React, { useState, useEffect } from 'react';
import { Agent } from '../types';
import { X, Sparkles, Code, Star, Box, List, Terminal } from 'lucide-react';
import { compareAgents } from '../services/localModelService';
import MarkdownText from '../utils/markdown';

interface ComparisonLayerProps {
    agentA: Agent;
    agentB: Agent | null;
    onClose: () => void;
    onClear: () => void;
}

interface ComparisonOutcome {
    pair: string;
    result: string;
    error: string | null;
}

const ComparisonLayer: React.FC<ComparisonLayerProps> = ({ agentA, agentB, onClose, onClear }) => {
    const [outcome, setOutcome] = useState<ComparisonOutcome | null>(null);

    // Result/error/loading are all derived from pair-keyed outcome state, so
    // changing the pair automatically invalidates what is rendered — no
    // synchronous state resets inside effects required.
    const pairKey = agentA && agentB ? `${agentA.id}:${agentB.id}` : null;
    const result = outcome && pairKey && outcome.pair === pairKey ? outcome.result : '';
    const error = outcome && pairKey && outcome.pair === pairKey ? outcome.error : null;
    const loading = pairKey !== null && (!outcome || outcome.pair !== pairKey);

    useEffect(() => {
        if (!agentA || !agentB) return;

        const pair = `${agentA.id}:${agentB.id}`;
        const controller = new AbortController();
        let active = true;

        // State updates happen in promise callbacks (external-system
        // notification), never synchronously in the effect body.
        compareAgents(agentA, agentB, { signal: controller.signal })
            .then(res => {
                if (active) setOutcome({ pair, result: res, error: null });
            })
            .catch((err: unknown) => {
                if (!active) return;
                if ((err as Error)?.name === 'AbortError') {
                    setOutcome({ pair, result: '', error: 'Comparison cancelled.' });
                    return;
                }
                setOutcome({ pair, result: '', error: 'Comparison failed. Please retry.' });
            });

        return () => {
            active = false;
            controller.abort('pair-changed-or-unmount');
        };
    }, [agentA, agentB]);

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

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 transform translate-y-0 max-h-[88vh] overflow-y-auto flex flex-col rounded-t-3xl md:rounded-none"
            style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--accent)', boxShadow: '0 -5px 50px rgba(0,0,0,0.9)' }}
            role="dialog" aria-modal="true" aria-label="Agent comparison engine">
            <div className="max-w-7xl mx-auto w-full p-4 md:p-6 flex-1 flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-mono font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <Sparkles size={20} style={{ color: 'var(--accent)' }} />
                        AGENT COMPARISON ENGINE
                    </h3>
                    <div className="flex gap-2">
                        <button onClick={onClear} className="text-sm px-3 py-1 font-mono uppercase transition-colors"
                            style={{ color: 'var(--text-muted)' }}>Reset</button>
                        <button onClick={onClose} className="rounded-full p-1 transition-colors"
                            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }} aria-label="Close comparison"><X size={20} /></button>
                    </div>
                </div>

                {/* Agents Header */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {/* Slot A */}
                    <div className="col-span-1 p-4 rounded relative text-center"
                        style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 text-xs font-mono rounded"
                            style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>AGENT A</div>
                        <h4 className="font-bold text-xl mb-1" style={{ color: 'var(--text-primary)' }}>{agentA.name}</h4>
                        <div className="text-xs font-mono inline-block px-2 py-1 rounded"
                            style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-secondary)' }}>{agentA.category}</div>
                    </div>

                    {/* VS */}
                    <div className="col-span-1 flex flex-col items-center justify-center">
                        <span className="font-black text-4xl italic select-none" style={{ color: 'var(--text-muted)' }}>VS</span>
                    </div>

                    {/* Slot B */}
                    <div className="col-span-1 p-4 rounded relative text-center"
                        style={{ backgroundColor: 'var(--accent-glow)', border: '1px solid var(--accent)' }}>
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 text-xs font-mono rounded"
                            style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--accent)', border: '1px solid var(--accent)' }}>AGENT B</div>
                        {agentB ? (
                            <>
                                <h4 className="font-bold text-xl mb-1" style={{ color: 'var(--accent)' }}>{agentB.name}</h4>
                                <div className="text-xs font-mono inline-block px-2 py-1 rounded"
                                    style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--accent)' }}>{agentB.category}</div>
                            </>
                        ) : (
                            <div className="h-full flex items-center justify-center text-sm animate-pulse" style={{ color: 'var(--text-muted)' }}>
                                Select another agent...
                            </div>
                        )}
                    </div>
                </div>

                {/* Static Comparison Table */}
                {agentB && (
                    <div className="mb-8 rounded-lg p-4" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                        <h4 className="text-xs font-mono uppercase mb-4 pb-2"
                            style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>Direct Metric Comparison</h4>

                        <div className="space-y-2">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-3 text-sm" style={{ borderBottom: '1px solid var(--border)' }}>
                                <div className="flex items-center gap-2 font-mono" style={{ color: 'var(--text-muted)' }}>
                                    <Code size={14} /> Language
                                </div>
                                <div className="text-center" style={{ color: 'var(--text-primary)' }}>{agentA.language}</div>
                                <div className="text-center font-bold" style={{ color: 'var(--accent)' }}>{agentB.language}</div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-3 text-sm" style={{ borderBottom: '1px solid var(--border)' }}>
                                <div className="flex items-center gap-2 font-mono" style={{ color: 'var(--text-muted)' }}>
                                    <Star size={14} /> Popularity
                                </div>
                                <div className="text-center" style={{ color: 'var(--text-primary)' }}>{`${(agentA.stars / 1000).toFixed(1)}k Stars`}</div>
                                <div className="text-center font-bold" style={{ color: 'var(--accent)' }}>{`${(agentB.stars / 1000).toFixed(1)}k Stars`}</div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-3 text-sm" style={{ borderBottom: '1px solid var(--border)' }}>
                                <div className="flex items-center gap-2 font-mono" style={{ color: 'var(--text-muted)' }}>
                                    <Box size={14} /> Primary Category
                                </div>
                                <div className="text-center" style={{ color: 'var(--text-primary)' }}>{agentA.category}</div>
                                <div className="text-center font-bold" style={{ color: 'var(--accent)' }}>{agentB.category}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-3 text-sm">
                            <div className="flex items-center gap-2 font-mono" style={{ color: 'var(--text-muted)' }}>
                                <List size={14} /> Top Features
                            </div>
                            <div className="text-center text-xs space-y-1" style={{ color: 'var(--text-secondary)' }}>
                                {(agentA.features || []).slice(0, 3).map(f => <div key={f} className="px-2 py-1 rounded" style={{ backgroundColor: 'var(--bg-tertiary)' }}>{f}</div>)}
                            </div>
                            <div className="text-center text-xs space-y-1" style={{ color: 'var(--accent)' }}>
                                {(agentB.features || []).slice(0, 3).map(f => <div key={f} className="px-2 py-1 rounded" style={{ backgroundColor: 'var(--accent-glow)' }}>{f}</div>)}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-3 text-sm mt-2 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                            <div className="flex items-center gap-2 font-mono" style={{ color: 'var(--text-muted)' }}>
                                <Terminal size={14} /> Install
                            </div>
                            <div className="text-center font-mono text-[10px] break-all p-2 rounded"
                                style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-muted)' }}>{agentA.installCommand}</div>
                            <div className="text-center font-mono text-[10px] break-all p-2 rounded"
                                style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--accent)' }}>{agentB.installCommand}</div>
                        </div>
                    </div>
                )}

                {/* AI Results Area */}
                {agentA && agentB && (
                    <div className="flex-1 rounded min-h-[200px] flex flex-col"
                        style={{ backgroundColor: 'var(--glass)', border: '1px solid var(--border)' }}>
                        <div className="px-4 py-2 flex items-center justify-between"
                            style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border)' }}>
                            <span className="text-xs font-mono uppercase flex items-center gap-2" style={{ color: 'var(--accent)' }}>
                                <Sparkles size={12} /> Local Model Analysis
                            </span>
                        </div>
                        <div className="p-6">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-12 gap-3">
                                    <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                                        style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}></div>
                                    <p className="font-mono text-sm animate-pulse" style={{ color: 'var(--accent)' }}>Consulting AI Knowledge Base...</p>
                                </div>
                            ) : (
                                <div>
                                    {error ? (
                                        <div className="font-mono text-sm rounded p-3"
                                            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error)', color: 'var(--error)' }}>{error}</div>
                                    ) : (
                                        <MarkdownText content={result || 'Awaiting comparison output.'} className="text-sm" />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComparisonLayer;
