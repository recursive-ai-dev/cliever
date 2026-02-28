import React, { useEffect, useState } from 'react';
import { Terminal, ArrowRight, Copy, Check, X, Sparkles } from 'lucide-react';
import { generateShellCommand } from '../services/localModelService';

interface CommandGeneratorProps {
  onClose: () => void;
}

const CommandGenerator: React.FC<CommandGeneratorProps> = ({ onClose }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setLoading(true);
    const result = await generateShellCommand(input);
    setOutput(result);
    setLoading(false);
  };

  const handleCopy = () => {
    // Extract code from markdown block if present, otherwise copy whole text
    const codeMatch = output.match(/```(?:bash|zsh|sh)?\n([\s\S]*?)\n```/);
    const textToCopy = codeMatch ? codeMatch[1] : output;
    
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 backdrop-blur-sm" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }} onClick={onClose}></div>
      
    <div className="relative w-full max-w-2xl mx-auto rounded-xl overflow-hidden flex flex-col max-h-[85vh]"
         style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--accent)', boxShadow: '0 0 50px var(--accent-glow)' }}>
        
        {/* Header */}
        <div className="p-4 flex justify-between items-center"
             style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-tertiary)' }}>
            <div className="flex items-center gap-2 font-mono font-bold" style={{ color: 'var(--accent)' }}>
                <Terminal size={18} />
                <span>SHELL_GEN.EXE</span>
            </div>
            <button onClick={onClose} className="transition-colors" style={{ color: 'var(--text-muted)' }}>
                <X size={18} />
            </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
            <div>
                <label className="block text-xs font-mono mb-2 uppercase" style={{ color: 'var(--text-muted)' }}>Natural Language Input</label>
                <form onSubmit={handleGenerate} className="relative">
                    <input 
                        className="w-full rounded-lg pl-4 pr-12 py-3 text-sm outline-none transition-all shadow-inner font-mono"
                        style={{ 
                          backgroundColor: 'var(--bg-primary)', 
                          border: '1px solid var(--border)', 
                          color: 'var(--text-primary)' 
                        }}
                        placeholder="e.g. Find all PDF files modified in the last 7 days..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        autoFocus
                    />
                    <button 
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded transition-all disabled:opacity-50"
                        style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--accent)' }}
                    >
                        {loading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/> : <ArrowRight size={16} />}
                    </button>
                </form>
            </div>

            {/* Output Display */}
            <div className="relative group">
                <div className="absolute -top-3 left-3 px-2 text-xs font-mono"
                     style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>GENERATED OUTPUT</div>
                <div className="rounded-lg p-4 min-h-[120px] font-mono text-sm whitespace-pre-wrap"
                     style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--accent)' }}>
                    {loading ? (
                        <div className="flex items-center gap-2 animate-pulse" style={{ color: 'var(--text-muted)' }}>
                            <Sparkles size={14} />
                            <span>Translating to shell script...</span>
                        </div>
                    ) : output ? (
                        <div className="markdown-content">{output}</div>
                    ) : (
                        <span style={{ color: 'var(--text-muted)' }}>Waiting for input...</span>
                    )}
                </div>
                
                {output && !loading && (
                    <button 
                        onClick={handleCopy}
                        className="absolute top-2 right-2 p-2 rounded transition-colors"
                        style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                        title="Copy Command"
                    >
                        {copied ? <Check size={14} style={{ color: 'var(--success)' }}/> : <Copy size={14}/>}
                    </button>
                )}
            </div>
        </div>
        
        {/* Footer */}
        <div className="p-3 text-[10px] font-mono flex justify-between"
             style={{ backgroundColor: 'var(--bg-tertiary)', borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            <span>POWERED BY LOCAL MODEL</span>
            <span>USE WITH CAUTION</span>
        </div>
      </div>
    </div>
  );
};

export default CommandGenerator;