
import React, { useState } from 'react';
import { Monitor, Command, Terminal, Cpu } from 'lucide-react';

interface PlatformSelectorProps {
    onSelect: (platform: 'windows' | 'linux' | 'macos') => void;
}

const PlatformSelector: React.FC<PlatformSelectorProps> = ({ onSelect }) => {
    const [hovered, setHovered] = useState<string | null>(null);

    const platforms = [
        {
            id: 'macos',
            name: 'macOS',
            icon: Command,
            description: 'Polished Unix. The creative engine.',
            color: '#00C7FF', // Cyanish
        },
        {
            id: 'linux',
            name: 'Linux',
            icon: Terminal,
            description: 'Pure efficiency. No guardrails. The kernel.',
            color: '#FCC200', // Yellowish
        },
        {
            id: 'windows',
            name: 'Windows',
            icon: Monitor,
            description: 'The global standard. WSL2 enhanced.',
            color: '#0078D4', // Blue
        },
    ] as const;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden font-mono selection:bg-cyan-500/30">
            {/* Deep Space Background */}
            <div className="absolute inset-0 z-0 bg-[#030014] overflow-hidden">
                {/* Star texture (pure CSS, no external assets) */}
                <div
                    className="absolute inset-0 opacity-25"
                    style={{
                        backgroundImage: 'radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.6) 50%, transparent 50%), radial-gradient(1px 1px at 60% 70%, rgba(255,255,255,0.45) 50%, transparent 50%), radial-gradient(1px 1px at 80% 20%, rgba(255,255,255,0.5) 50%, transparent 50%), radial-gradient(1px 1px at 35% 80%, rgba(255,255,255,0.35) 50%, transparent 50%), radial-gradient(1px 1px at 90% 60%, rgba(255,255,255,0.4) 50%, transparent 50%), radial-gradient(1px 1px at 10% 55%, rgba(255,255,255,0.3) 50%, transparent 50%)',
                        backgroundSize: '220px 220px, 300px 300px, 260px 260px, 340px 340px, 280px 280px, 320px 320px'
                    }}
                ></div>

                {/* Blue Halo / Nebula */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vw] h-[140vw] md:w-[1000px] md:h-[1000px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-[#0a0a2e]/40 to-transparent blur-[120px] rounded-full animate-pulse-slow mix-blend-screen" />

                {/* Secondary accent glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[150px] mix-blend-overlay" />
            </div>

            <div className="relative z-10 max-w-5xl w-full px-8">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 text-cyan-500 mb-4 animate-fade-in-down border border-cyan-500/30 px-3 py-1 rounded-full bg-cyan-950/20 backdrop-blur-sm">
                        <Cpu size={14} />
                        <span className="text-xs tracking-widest uppercase">System Initialization</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-2">
                        Select Architecture
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
                        Configure the registry for your operating environment.
                        This focuses the data stream to your specific needs.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {platforms.map((platform) => {
                        const Icon = platform.icon;
                        const isHovered = hovered === platform.id;

                        return (
                            <button
                                key={platform.id}
                                onClick={() => onSelect(platform.id)}
                                onMouseEnter={() => setHovered(platform.id)}
                                onMouseLeave={() => setHovered(null)}
                                className="group relative p-8 h-80 rounded-2xl transition-all duration-500 border border-gray-800 text-left flex flex-col justify-between overflow-hidden hover:border-gray-600 bg-gray-950/50 backdrop-blur-md"
                                style={{
                                    boxShadow: isHovered
                                        ? `0 0 40px -10px ${platform.color}40`
                                        : '0 0 0 0 transparent',
                                    borderColor: isHovered ? platform.color : undefined
                                }}
                            >
                                {/* Glow gradient overlay */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                                    style={{
                                        background: `radial-gradient(circle at center, ${platform.color}, transparent 70%)`
                                    }}
                                />

                                <div className="relative z-10">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 md:mb-12"
                                        style={{
                                            backgroundColor: isHovered ? platform.color : '#1f2937',
                                            color: isHovered ? '#000' : '#9ca3af'
                                        }}
                                    >
                                        <Icon size={24} />
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-2">
                                        {platform.name}
                                        {isHovered && <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs font-normal ml-2" style={{ color: platform.color }}>&gt;&gt;</span>}
                                    </h3>
                                    <p className="text-sm text-gray-400 leading-relaxed max-w-[200px]">
                                        {platform.description}
                                    </p>
                                </div>

                                <div
                                    className="relative z-10 text-[10px] uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-2 group-hover:translate-y-0"
                                    style={{ color: platform.color }}
                                >
                                    Initialize {platform.name} &rarr;
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-16 text-center">
                    <div className="text-[10px] text-gray-600 font-mono flex items-center justify-center gap-6">
                        <span>v2.5.0</span>
                        <span className="w-1 h-1 rounded-full bg-gray-800" />
                        <span>FULLY OFFLINE-CAPABLE</span>
                        <span className="w-1 h-1 rounded-full bg-gray-800" />
                        <span>NO API KEYS REQUIRED</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlatformSelector;
