import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Agent, ChatMessage, Review } from '../types';
import { X, Copy, Check, Cpu, Github, Zap, Star, MessageCircle, Code, Shield, Twitter, Linkedin, Monitor, Apple, Terminal, AlertCircle, MessageSquare, Trash2, Wrench, FileText } from 'lucide-react';
import { analyzeAgent, askExpert, diagnoseInstallError, getInstallationGuide } from '../services/localModelService';
import { VerificationService } from '../services/verificationService';
import { AnalyticsService, AnalyticsEventType } from '../services/analyticsService';
import SimpleTooltip from './SimpleTooltip';
import { suggestCopyCommand } from '../utils/command';
import { copyText } from '../utils/clipboard';
import MarkdownText from '../utils/markdown';
import { TAG_DESCRIPTIONS } from '../constants';
import { getErrorMessage, sanitizeChatMessage, sanitizeDisplayText } from '../utils/sanitization';

interface AgentDetailLayerProps {
    agent: Agent | null;
    onClose: () => void;
    onCompare: (agent: Agent) => void;
    onAddReview: (agentId: string, review: Omit<Review, 'id' | 'date'>) => void;
    onDeleteReview: (agentId: string, reviewId: string) => void;
    onVerificationUpdate: (agentId: string, patch: Partial<Agent>) => void;
    isBundled: boolean;
    onToggleBundle: (agent: Agent) => void;
    platform?: 'windows' | 'linux' | 'macos';
}

/**
 * Detects the user's operating system
 */
const detectOS = (): 'windows' | 'macos' | 'linux' => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('win')) return 'windows';
    if (userAgent.includes('mac')) return 'macos';
    return 'linux';
};

const AgentDetailLayer: React.FC<AgentDetailLayerProps> = ({ agent, onClose, onCompare, onAddReview, onDeleteReview, onVerificationUpdate, isBundled, onToggleBundle, platform }) => {
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');

    // LaPoet Chat (agent-scoped)
    const [lapoetChatOpen, setLapoetChatOpen] = useState(false);
    const [lapoetChatInput, setLapoetChatInput] = useState('');
    const [lapoetChatLoading, setLapoetChatLoading] = useState(false);
    const [lapoetChatHistory, setLapoetChatHistory] = useState<ChatMessage[]>([
        { role: 'model', text: 'LaPoet ready. Ask about installation, tradeoffs, or workflow fit.' }
    ]);
    const lapoetChatRequestIdRef = useRef<number>(0);
    const lapoetChatAbortRef = useRef<AbortController | null>(null);

    const [verifying, setVerifying] = useState(false);
    const [verifyCopied, setVerifyCopied] = useState(false);
    const [exportCopied, setExportCopied] = useState(false);

    // Review Form State
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewUser, setReviewUser] = useState('');
    const [formVisible, setFormVisible] = useState(false);

    // Platform Selection State
    const detectedOS = useMemo(() => detectOS(), []);
    const [selectedPlatform, setSelectedPlatform] = useState<'default' | 'windows' | 'macos' | 'linux' | 'docker'>(
        platform || (detectedOS === 'windows' ? 'windows' : 'default')
    );
    const [showTroubleshooting, setShowTroubleshooting] = useState(false);

    // Install Doctor (error diagnosis) State
    const [installErrorInput, setInstallErrorInput] = useState('');
    const [installDiagnosis, setInstallDiagnosis] = useState<string | null>(null);
    const [guideCopied, setGuideCopied] = useState(false);

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

    if (!agent) return null;

    const tags = agent.tags ?? [];
    const reviews = agent.reviews ?? [];
    const useCases = agent.useCases ?? [];
    const safeLongDescription = sanitizeDisplayText(agent.longDescription || agent.description);

    // Get install command based on selected platform
    const getInstallCommand = (): string => {
        if (agent.platformCommands) {
            const cmd = agent.platformCommands[selectedPlatform];
            if (cmd) return cmd;
        }
        return agent.installCommand;
    };

    const currentCommand = getInstallCommand();
    const displayCommand = suggestCopyCommand(currentCommand);

    const handleCopy = () => {
        const toCopy = suggestCopyCommand(currentCommand);
        copyText(toCopy).then((ok) => {
            setCopyState(ok ? 'copied' : 'failed');
            setTimeout(() => setCopyState('idle'), 2000);
            if (ok) {
                AnalyticsService.trackEvent(AnalyticsEventType.AGENT_INSTALL_COPY, {
                    agentId: agent.id,
                    agentName: agent.name,
                    platform: selectedPlatform
                });
            } else {
                AnalyticsService.trackError('Clipboard copy failed', { context: 'agent_detail_copy', agentId: agent.id }, 'low');
            }
        });
    };

    const handleCopyInstallGuide = () => {
        const guide = getInstallationGuide(agent);
        copyText(guide).then((ok) => {
            setGuideCopied(ok);
            setTimeout(() => setGuideCopied(false), 2000);
        });
    };

    const handleDiagnoseInstall = () => {
        if (!installErrorInput.trim()) return;
        const result = diagnoseInstallError(installErrorInput, agent.installCommand);
        setInstallDiagnosis(result);
    };

    const copied = copyState === 'copied';

    const handleVerify = async () => {
        if (verifying) return;
        setVerifying(true);
        try {
            const { agentPatch } = await VerificationService.verifyAgent(agent);
            onVerificationUpdate(agent.id, agentPatch);
            setVerifyCopied(true);
            setTimeout(() => setVerifyCopied(false), 2000);
        } finally {
            setVerifying(false);
        }
    };

    const handleExportReviews = async () => {
        const payload = {
            exportedAt: new Date().toISOString(),
            agent: {
                id: agent.id,
                name: agent.name,
                category: agent.category,
                language: agent.language,
                stars: agent.stars,
                repoUrl: agent.repoUrl,
                installCommand: agent.installCommand,
                version: agent.version
            },
            verification: {
                verificationStatus: agent.verificationStatus ?? 'UNVERIFIED',
                lastVerified: agent.lastVerified ?? null,
                starsSource: agent.starsSource ?? 'REGISTRY',
                repoUpdatedAt: agent.repoUpdatedAt ?? null,
                verificationNotes: agent.verificationNotes ?? []
            },
            reviews
        };
        const ok = await copyText(JSON.stringify(payload, null, 2));
        setExportCopied(ok);
        setTimeout(() => setExportCopied(false), 2000);
    };

    const verificationColor = (status: Agent['verificationStatus']): string => {
        if (status === 'VERIFIED') return 'var(--success)';
        if (status === 'DEGRADED') return 'var(--warning)';
        if (status === 'FAILED') return 'var(--error)';
        return 'var(--text-muted)';
    };

    const handleAnalysis = async () => {
        if (loading) return;
        setLoading(true);
        const result = await analyzeAgent(agent);
        setAnalysis(result);
        setLoading(false);
    };

    const buildAgentChatContext = (a: Agent): string => {
        const tags = a.tags?.length ? a.tags.join(', ') : 'none';
        const topFeatures = a.features?.slice(0, 5).join(', ') || 'none';
        const topUseCases = a.useCases?.slice(0, 5).join(' | ') || 'none';

        return [
            `Agent: ${a.name}`,
            `Category: ${a.category}`,
            `Language: ${a.language}`,
            `Stars: ${a.stars}`,
            `Repo: ${a.repoUrl}`,
            `Install: ${a.installCommand}`,
            `Tags: ${tags}`,
            `Top features: ${topFeatures}`,
            `Top use cases: ${topUseCases}`
        ].join('\n');
    };

    const handleLapoetChatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (lapoetChatLoading) return;
        if (!lapoetChatInput.trim()) return;

        const sanitizedInput = sanitizeChatMessage(lapoetChatInput);
        const requestId = Date.now();
        lapoetChatRequestIdRef.current = requestId;

        // Abort any in-flight request (agent panel chat only)
        if (lapoetChatAbortRef.current) {
            lapoetChatAbortRef.current.abort('replaced');
        }
        const controller = new AbortController();
        lapoetChatAbortRef.current = controller;

        setLapoetChatHistory(prev => [...prev, { role: 'user', text: sanitizedInput }]);
        setLapoetChatInput('');
        setLapoetChatLoading(true);

        const context = buildAgentChatContext(agent);

        try {
            const response = await askExpert(sanitizedInput, context, { signal: controller.signal });
            const isLatest = lapoetChatRequestIdRef.current === requestId;
            if (isLatest) {
                setLapoetChatHistory(prev => [...prev, { role: 'model', text: response }]);
            }
        } catch (error: unknown) {
            const isLatest = lapoetChatRequestIdRef.current === requestId;
            if (!isLatest) return;

            if ((error as Error)?.name === 'AbortError') {
                setLapoetChatHistory(prev => [...prev, { role: 'model', text: 'Request cancelled. You can retry.' }]);
                return;
            }

            setLapoetChatHistory(prev => [
                ...prev,
                { role: 'model', text: `Error: ${getErrorMessage(error)}` }
            ]);
        } finally {
            if (lapoetChatRequestIdRef.current === requestId) {
                setLapoetChatLoading(false);
            }
        }
    };

    const handleShare = (platform: 'twitter' | 'linkedin') => {
        const text = `Check out ${agent.name}: ${agent.description} #cliever`;
        const url = window.location.href;

        let shareUrl = '';
        if (platform === 'twitter') {
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        } else {
            shareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text + ' ' + url)}`;
        }

        window.open(shareUrl, '_blank', 'width=600,height=400');
    };

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (reviewUser.trim() && reviewComment.trim()) {
            onAddReview(agent.id, {
                user: sanitizeDisplayText(reviewUser.trim()),
                rating: reviewRating,
                comment: sanitizeDisplayText(reviewComment.trim())
            });
            setReviewUser('');
            setReviewComment('');
            setFormVisible(false);
        }
    };

    const avgRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : 'N/A';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative w-full max-w-5xl glass-panel rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                role="dialog" aria-modal="true" aria-label={`${agent.name} details`}>

                {/* Header */}
                <div className="p-6 flex justify-between items-center"
                    style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-tertiary)' }}>
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl"
                            style={{ backgroundColor: 'var(--accent-glow)', border: '1px solid var(--border-hover)' }}>
                            <Cpu size={32} style={{ color: 'var(--accent)' }} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{agent.name}</h2>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="font-mono text-sm" style={{ color: 'var(--accent)' }}>{agent.category}</span>
                                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--text-muted)' }}></span>
                                <span className="text-sm flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                                    <Star size={12} style={{ color: 'var(--warning)' }} className="fill-current" /> {avgRating} Rating
                                </span>
                                <div className="flex gap-1 ml-2">
                                    {tags.map(tag => (
                                        <SimpleTooltip key={tag} content={TAG_DESCRIPTIONS[tag] || tag}>
                                            <span className="text-[10px] px-1.5 py-0.5 rounded cursor-help"
                                                style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>#{tag}</span>
                                        </SimpleTooltip>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleShare('twitter')}
                            className="p-2 rounded-full transition-colors"
                            style={{ color: 'var(--text-secondary)' }}
                            title="Share on Twitter"
                        >
                            <Twitter size={20} />
                        </button>
                        <button
                            onClick={() => handleShare('linkedin')}
                            className="p-2 rounded-full transition-colors"
                            style={{ color: 'var(--text-secondary)' }}
                            title="Share on LinkedIn"
                        >
                            <Linkedin size={20} />
                        </button>
                        <div className="h-6 w-[1px] mx-2" style={{ backgroundColor: 'var(--border)' }}></div>
                        <button onClick={onClose} className="p-2 rounded-full transition-colors" style={{ color: 'var(--text-secondary)' }}>
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Two-Column Layout for Content */}
                <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row">

                    {/* Left Column: Details */}
                    <div className="flex-1 p-6 space-y-8" style={{ backgroundColor: 'var(--bg-primary)', borderRight: '1px solid var(--border)' }}>

                        {/* Description */}
                        <div>
                            <h3 className="text-xs font-mono mb-2 uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                                <Shield size={14} /> Mission Profile
                            </h3>
                            <p className="leading-relaxed text-lg" style={{ color: 'var(--text-primary)' }}>{safeLongDescription}</p>
                        </div>

                        {/* Technical Specs */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 rounded" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
                                <span className="text-xs block mb-1" style={{ color: 'var(--text-muted)' }}>Language</span>
                                <div className="font-mono flex items-center gap-2" style={{ color: 'var(--accent)' }}>
                                    <Code size={14} /> {agent.language}
                                </div>
                            </div>
                            <div className="p-3 rounded" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
                                <span className="text-xs block mb-1" style={{ color: 'var(--text-muted)' }}>GitHub Stars</span>
                                <div className="font-mono flex items-center gap-2" style={{ color: 'var(--warning)' }}>
                                    <Star size={14} /> {(agent.stars / 1000).toFixed(1)}k
                                </div>
                            </div>
                        </div>

                        {/* Provenance & Verification */}
                        <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
                            <div className="flex items-center justify-between gap-4">
                                <h3 className="text-xs font-mono uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                                    Provenance & Verification
                                </h3>
                                <button
                                    onClick={handleVerify}
                                    disabled={verifying}
                                    className="text-[10px] uppercase px-3 py-1.5 rounded transition-colors disabled:opacity-40"
                                    style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--accent)', border: '1px solid var(--accent)' }}
                                >
                                    {verifying ? 'VERIFYING...' : verifyCopied ? 'UPDATED' : 'VERIFY'}
                                </button>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                                <div>
                                    <div style={{ color: 'var(--text-muted)' }}>Source</div>
                                    <div style={{ color: 'var(--text-primary)' }}>Registry entry (local)</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--text-muted)' }}>Status</div>
                                    <div className="font-mono" style={{ color: verificationColor(agent.verificationStatus) }}>
                                        {agent.verificationStatus || 'UNVERIFIED'}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--text-muted)' }}>Stars Source</div>
                                    <div style={{ color: 'var(--text-primary)' }}>{agent.starsSource || 'REGISTRY'}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--text-muted)' }}>Last Verified</div>
                                    <div style={{ color: 'var(--text-primary)' }}>{agent.lastVerified ? agent.lastVerified.slice(0, 10) : '—'}</div>
                                </div>
                            </div>

                            {agent.repoUpdatedAt && (
                                <div className="mt-3 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                                    Repo updated: {agent.repoUpdatedAt.slice(0, 10)}
                                </div>
                            )}
                            {agent.verificationNotes && agent.verificationNotes.length > 0 && (
                                <div className="mt-3 text-[11px] space-y-1" style={{ color: 'var(--text-muted)' }}>
                                    {agent.verificationNotes.slice(0, 5).map((n, idx) => (
                                        <div key={idx}>- {n}</div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-3 text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                                Verification runs locally; GitHub metadata may be rate-limited.
                            </div>
                        </div>

                        {/* Tactical Usage (Use Cases) */}
                        <div>
                            <h3 className="text-xs font-mono mb-3 uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                                <Zap size={14} /> Tactical Usage
                            </h3>
                            <ul className="space-y-2">
                                {useCases.map((useCase, idx) => (
                                    <li key={idx} className="flex gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                        <span className="font-bold" style={{ color: 'var(--accent)' }}>0{idx + 1}.</span>
                                        {useCase}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Install Command with Platform Selection */}
                        <div>
                            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                                <h3 className="text-xs font-mono uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Installation</h3>

                                <div className="flex items-center gap-2">
                                <button
                                    onClick={handleCopyInstallGuide}
                                    className="px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all"
                                    style={{
                                        backgroundColor: guideCopied ? 'var(--accent-glow)' : 'var(--bg-tertiary)',
                                        border: guideCopied ? '1px solid var(--success)' : '1px solid var(--border)',
                                        color: guideCopied ? 'var(--success)' : 'var(--text-muted)'
                                    }}
                                    title="Copy full platform install guide to clipboard"
                                >
                                    <span className="inline-flex items-center gap-1.5">
                                        <FileText size={12} /> {guideCopied ? 'COPIED' : 'GUIDE'}
                                    </span>
                                </button>
                                <button
                                    onClick={() => onToggleBundle(agent)}
                                    className="px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all"
                                    style={{
                                        backgroundColor: isBundled ? 'var(--accent-glow)' : 'var(--bg-tertiary)',
                                        border: isBundled ? '1px solid var(--accent)' : '1px solid var(--border)',
                                        color: isBundled ? 'var(--accent)' : 'var(--text-muted)'
                                    }}
                                    title={isBundled ? 'Remove from bundle' : 'Add to bundle'}
                                >
                                    {isBundled ? 'IN_BUNDLE' : '+ BUNDLE'}
                                </button>
                                </div>

                                {/* Platform Selector */}
                                {agent.platformCommands && (
                                    <div className="flex gap-1">
                                        {agent.platformCommands.windows && (
                                            <button
                                                onClick={() => setSelectedPlatform('windows')}
                                                className="p-1.5 rounded text-xs transition-colors"
                                                style={{
                                                    backgroundColor: selectedPlatform === 'windows' ? 'var(--accent-glow)' : 'var(--bg-tertiary)',
                                                    color: selectedPlatform === 'windows' ? 'var(--accent)' : 'var(--text-muted)',
                                                    border: selectedPlatform === 'windows' ? '1px solid var(--accent)' : '1px solid var(--border)'
                                                }}
                                                title="Windows (PowerShell)"
                                            >
                                                <Monitor size={12} />
                                            </button>
                                        )}
                                        {(agent.platformCommands.macos || agent.platformCommands.default) && (
                                            <button
                                                onClick={() => setSelectedPlatform('macos')}
                                                className="p-1.5 rounded text-xs transition-colors"
                                                style={{
                                                    backgroundColor: selectedPlatform === 'macos' ? 'var(--accent-glow)' : 'var(--bg-tertiary)',
                                                    color: selectedPlatform === 'macos' ? 'var(--accent)' : 'var(--text-muted)',
                                                    border: selectedPlatform === 'macos' ? '1px solid var(--accent)' : '1px solid var(--border)'
                                                }}
                                                title="macOS"
                                            >
                                                <Apple size={12} />
                                            </button>
                                        )}
                                        {agent.platformCommands.linux && (
                                            <button
                                                onClick={() => setSelectedPlatform('linux')}
                                                className="p-1.5 rounded text-xs transition-colors"
                                                style={{
                                                    backgroundColor: selectedPlatform === 'linux' ? 'var(--accent-glow)' : 'var(--bg-tertiary)',
                                                    color: selectedPlatform === 'linux' ? 'var(--accent)' : 'var(--text-muted)',
                                                    border: selectedPlatform === 'linux' ? '1px solid var(--accent)' : '1px solid var(--border)'
                                                }}
                                                title="Linux"
                                            >
                                                <Terminal size={12} />
                                            </button>
                                        )}
                                        {agent.platformCommands.docker && (
                                            <button
                                                onClick={() => setSelectedPlatform('docker')}
                                                className="p-1.5 rounded text-xs transition-colors"
                                                style={{
                                                    backgroundColor: selectedPlatform === 'docker' ? 'var(--accent-glow)' : 'var(--bg-tertiary)',
                                                    color: selectedPlatform === 'docker' ? 'var(--accent)' : 'var(--text-muted)',
                                                    border: selectedPlatform === 'docker' ? '1px solid var(--accent)' : '1px solid var(--border)'
                                                }}
                                                title="Docker (Cross-platform)"
                                            >
                                                🐳
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setSelectedPlatform('default')}
                                            className="px-2 py-1 rounded text-[10px] transition-colors"
                                            style={{
                                                backgroundColor: selectedPlatform === 'default' ? 'var(--accent-glow)' : 'var(--bg-tertiary)',
                                                color: selectedPlatform === 'default' ? 'var(--accent)' : 'var(--text-muted)',
                                                border: selectedPlatform === 'default' ? '1px solid var(--accent)' : '1px solid var(--border)'
                                            }}
                                            title="Default"
                                        >
                                            Default
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="rounded-lg p-4 font-mono text-sm group relative"
                                style={{ backgroundColor: 'var(--bg-primary)', border: copyState === 'failed' ? '1px solid var(--error)' : '1px solid var(--border)' }}>
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <button
                                        onClick={handleCopy}
                                        className="p-1 rounded transition-colors"
                                        style={{ color: 'var(--text-muted)' }}
                                        title={copyState === 'failed' ? 'Copy failed — select the command manually' : 'Copy install command'}
                                        aria-label="Copy install command"
                                    >
                                        {copied ? <Check size={16} style={{ color: 'var(--success)' }} /> : copyState === 'failed' ? <AlertCircle size={16} style={{ color: 'var(--error)' }} /> : <Copy size={16} />}
                                    </button>
                                </div>
                                <span style={{ color: 'var(--accent)' }} className="select-none">{selectedPlatform === 'windows' ? '> ' : '$ '}</span>
                                <span className="break-all" style={{ color: 'var(--text-secondary)' }}>{displayCommand}</span>
                            </div>

                            {/* Platform Notes */}
                            {agent.platformCommands?.notes && (
                                <p className="text-[11px] mt-2 italic" style={{ color: 'var(--text-muted)' }}>
                                    💡 {agent.platformCommands.notes}
                                </p>
                            )}

                            {/* Troubleshooting Section */}
                            {agent.troubleshooting && agent.troubleshooting.length > 0 && (
                                <div className="mt-4">
                                    <button
                                        onClick={() => setShowTroubleshooting(!showTroubleshooting)}
                                        className="flex items-center gap-2 text-[10px] transition-colors"
                                        style={{ color: 'var(--warning)' }}
                                    >
                                        <AlertCircle size={12} />
                                        {showTroubleshooting ? 'Hide' : 'Show'} Troubleshooting Tips
                                    </button>

                                    {showTroubleshooting && (
                                        <ul className="mt-3 space-y-2 pl-3" style={{ borderLeft: '2px solid var(--warning)', opacity: 0.7 }}>
                                            {agent.troubleshooting.map((tip, idx) => (
                                                <li key={idx} className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                                    <span style={{ color: 'var(--warning)' }}>•</span> {tip}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}

                            {/* Install Doctor: diagnose real installation errors offline */}
                            <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
                                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                                    <Wrench size={12} /> Install Doctor
                                </div>
                                <p className="text-[11px] mb-3" style={{ color: 'var(--text-muted)' }}>
                                    Paste an installation error message to get an offline diagnosis for this tool's package manager.
                                </p>
                                <div className="flex gap-2">
                                    <input
                                        className="flex-1 rounded px-2 py-1.5 text-xs font-mono outline-none"
                                        style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                                        placeholder="e.g. npm ERR! EACCES: permission denied..."
                                        value={installErrorInput}
                                        onChange={(e) => setInstallErrorInput(e.target.value)}
                                        aria-label="Installation error message"
                                    />
                                    <button
                                        onClick={handleDiagnoseInstall}
                                        disabled={!installErrorInput.trim()}
                                        className="px-3 py-1.5 rounded text-[10px] font-mono font-bold uppercase transition-all disabled:opacity-30"
                                        style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--accent)', border: '1px solid var(--accent)' }}
                                    >
                                        Diagnose
                                    </button>
                                </div>
                                {installDiagnosis && (
                                    <div className="mt-3 p-2 rounded" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                                        <MarkdownText content={installDiagnosis} className="text-xs" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* AI Analysis Section */}
                        <div className="pt-6" style={{ borderTop: '1px solid var(--border)' }}>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xs font-mono uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--accent)' }}>
                                    <Zap size={14} /> Local Model Analysis
                                </h3>
                                {!analysis && !loading && (
                                    <button
                                        onClick={handleAnalysis}
                                        className="text-[10px] uppercase px-3 py-1.5 rounded transition-colors"
                                        style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--accent)', border: '1px solid var(--accent)' }}
                                    >
                                        Generate Intel
                                    </button>
                                )}
                            </div>

                            {loading && (
                                <div className="flex items-center gap-2 text-sm animate-pulse" style={{ color: 'var(--text-muted)' }}>
                                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--accent)' }}></span>
                                    Analyzing repository patterns...
                                </div>
                            )}

                            {analysis && (
                                <div className="p-4 rounded-lg text-sm leading-relaxed"
                                    style={{ backgroundColor: 'var(--accent-glow)', border: '1px solid var(--accent)', color: 'var(--text-secondary)' }}>
                                    <MarkdownText content={analysis} />
                                </div>
                            )}
                        </div>

                        {/* LaPoet Chat Section */}
                        <div className="pt-6" style={{ borderTop: '1px solid var(--border)' }}>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xs font-mono uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--accent)' }}>
                                    <MessageSquare size={14} /> LaPoet Chat
                                </h3>
                                <button
                                    onClick={() => setLapoetChatOpen(v => !v)}
                                    className="text-[10px] uppercase px-3 py-1.5 rounded transition-colors"
                                    style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                                >
                                    {lapoetChatOpen ? 'Hide' : 'Open'}
                                </button>
                            </div>

                            {lapoetChatOpen && (
                                <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-tertiary)' }}>
                                    <div className="max-h-64 overflow-y-auto p-3 space-y-3 font-mono text-xs" style={{ backgroundColor: 'var(--bg-primary)' }}>
                                        {lapoetChatHistory.map((msg, idx) => (
                                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                <div
                                                    className="max-w-[90%] rounded-lg p-3 whitespace-pre-wrap"
                                                    style={msg.role === 'user'
                                                        ? { backgroundColor: 'var(--accent-glow)', color: 'var(--accent)', border: '1px solid var(--accent)' }
                                                        : { backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }
                                                    }
                                                >
                                                    {msg.text}
                                                </div>
                                            </div>
                                        ))}
                                        {lapoetChatLoading && (
                                            <div className="animate-pulse" style={{ color: 'var(--accent)' }}>
                                                &gt; ANALYZING...
                                            </div>
                                        )}
                                    </div>

                                    <form onSubmit={handleLapoetChatSubmit} className="p-3" style={{ borderTop: '1px solid var(--border)' }}>
                                        <div className="flex gap-2">
                                            <input
                                                className="flex-1 rounded-lg px-3 py-2 text-xs focus:outline-none font-mono"
                                                style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                                                placeholder="Ask LaPoet about this tool..."
                                                aria-label="Ask the local engine about this tool"
                                                value={lapoetChatInput}
                                                onChange={(e) => setLapoetChatInput(sanitizeChatMessage(e.target.value))}
                                                disabled={lapoetChatLoading}
                                            />
                                            <button
                                                type="submit"
                                                disabled={lapoetChatLoading || !lapoetChatInput.trim()}
                                                className="px-3 rounded-lg text-[10px] font-bold uppercase transition-all disabled:opacity-30"
                                                style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
                                            >
                                                Send
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Reviews */}
                    <div className="lg:w-1/3 flex flex-col" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                        <div className="p-6 flex justify-between items-center sticky top-0 z-10" style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                            <div>
                                <h3 className="font-mono text-sm flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                                    <MessageCircle size={16} /> COMMUNITY FEED
                                </h3>
                                <div className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                                    Local-only reviews (this device)
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleExportReviews}
                                    className="text-xs px-3 py-1 rounded transition-colors"
                                    style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                                    title="Copy reviews JSON to clipboard"
                                >
                                    {exportCopied ? 'Copied' : 'Export'}
                                </button>
                                <button
                                    onClick={() => setFormVisible(!formVisible)}
                                    className="text-xs px-3 py-1 rounded transition-colors"
                                    style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                                >
                                    {formVisible ? 'Cancel' : 'Add Review'}
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                            {/* Review Form */}
                            {formVisible && (
                                <form onSubmit={handleSubmitReview} className="p-4 rounded-lg mb-6 animate-pulse-fast-once" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
                                    <h4 className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Submit Log</h4>
                                    <div className="space-y-3">
                                        <input
                                            className="w-full rounded p-2 text-sm outline-none"
                                            style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                                            placeholder="Operative Name"
                                            aria-label="Your display name"
                                            value={reviewUser}
                                            onChange={e => setReviewUser(e.target.value)}
                                            required
                                        />
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setReviewRating(star)}
                                                    className="transition-colors"
                                                    style={{ color: reviewRating >= star ? 'var(--warning)' : 'var(--border)' }}
                                                >
                                                    <Star size={16} fill={reviewRating >= star ? "currentColor" : "none"} />
                                                </button>
                                            ))}
                                        </div>
                                        <textarea
                                            className="w-full rounded p-2 text-sm outline-none h-20"
                                            style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                                            placeholder="Transmission content..."
                                            aria-label="Review content"
                                            value={reviewComment}
                                            onChange={e => setReviewComment(e.target.value)}
                                            required
                                        />
                                        <button type="submit" className="w-full py-2 rounded text-sm transition-colors"
                                            style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--accent)', border: '1px solid var(--accent)' }}>
                                            Transmit
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Review List */}
                            {reviews.length === 0 ? (
                                <div className="text-center text-sm py-10 italic" style={{ color: 'var(--text-muted)' }}>
                                    No transmissions received yet.
                                </div>
                            ) : (
                                reviews.map(review => (
                                    <div key={review.id} className="relative pl-4 pb-2 group/review" style={{ borderLeft: '2px solid var(--border)' }}>
                                        <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--border)', border: '1px solid var(--bg-primary)' }}></div>
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-mono text-xs" style={{ color: 'var(--accent)' }}>{review.user}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{review.date}</span>
                                                <button
                                                    onClick={() => onDeleteReview(agent.id, review.id)}
                                                    className="opacity-0 group-hover/review:opacity-100 focus:opacity-100 transition-opacity p-0.5 rounded"
                                                    style={{ color: 'var(--text-muted)' }}
                                                    title="Delete this review"
                                                    aria-label={`Delete review by ${review.user}`}
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex mb-2" style={{ color: 'var(--warning)' }}>
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={10} fill={i < review.rating ? "currentColor" : "none"} style={{ color: i < review.rating ? 'var(--warning)' : 'var(--border)' }} />
                                            ))}
                                        </div>
                                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>"{review.comment}"</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="p-6 flex gap-4" style={{ borderTop: '1px solid var(--border)', backgroundColor: 'var(--bg-secondary)' }}>
                    <a
                        href={agent.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-colors"
                        style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                    >
                        <Github size={18} />
                        Access Repository
                    </a>
                    <button
                        onClick={() => onCompare(agent)}
                        className="flex-1 py-3 rounded-lg font-medium transition-colors"
                        style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)', boxShadow: '0 0 15px var(--accent-glow)' }}
                    >
                        Add to Comparison
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AgentDetailLayer;