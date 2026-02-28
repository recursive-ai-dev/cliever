import React, { useEffect, useRef, useState } from 'react';
import { Cpu, MessageSquare, ShieldCheck, Wifi, X } from 'lucide-react';
import { askExpert } from '../services/localModelService';
import { getErrorMessage, sanitizeChatMessage } from '../utils/sanitization';

interface TerminalHeroProps {
  isScanning?: boolean;
}

const TerminalHero: React.FC<TerminalHeroProps> = ({ isScanning = false }) => {
  const [text, setText] = useState('');
  const fullText = "> INITIALIZING REGISTRY KERNEL...\n> ESTABLISHING SECURE UPLINK...\n> CONNECTING TO GLOBAL AI INDEX...\n> FEED ONLINE.";

  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'model'; text: string }>>([
    { role: 'model', text: 'LaPoet link online. Ask me about agents, installs, or workflows.' }
  ]);
  const chatRequestIdRef = useRef<number>(0);
  const chatAbortRef = useRef<AbortController | null>(null);
  const suppressAbortMessageRef = useRef(false);

  useEffect(() => {
    let i = 0;
    setText(''); // Reset on mount
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 35);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      chatAbortRef.current?.abort('component-unmount');
    };
  }, []);

  useEffect(() => {
    if (!chatOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeChat();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [chatOpen]);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const sanitizedInput = sanitizeChatMessage(chatInput);
    const requestId = Date.now();
    chatRequestIdRef.current = requestId;

    // Abort any in-flight request to prevent races
    if (chatAbortRef.current) {
      chatAbortRef.current.abort('replaced');
    }
    const controller = new AbortController();
    chatAbortRef.current = controller;

    setChatHistory(prev => [...prev, { role: 'user', text: sanitizedInput }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await askExpert(sanitizedInput, 'Hero CLI window (LaPoet overlay chat)', {
        signal: controller.signal,
      });
      const isLatest = chatRequestIdRef.current === requestId;
      if (isLatest) {
        setChatHistory(prev => [...prev, { role: 'model', text: response }]);
      }
    } catch (error: unknown) {
      const isLatest = chatRequestIdRef.current === requestId;
      if (!isLatest) return;

      if ((error as Error)?.name === 'AbortError') {
        if (suppressAbortMessageRef.current) {
          suppressAbortMessageRef.current = false;
          return;
        }
        setChatHistory(prev => [...prev, { role: 'model', text: 'Request cancelled. You can retry.' }]);
        return;
      }

      setChatHistory(prev => [
        ...prev,
        { role: 'model', text: `Error: ${sanitizeChatMessage(getErrorMessage(error))}` },
      ]);
    } finally {
      if (chatRequestIdRef.current === requestId) {
        setChatLoading(false);
      }
    }
  };

  const closeChat = () => {
    if (chatAbortRef.current) {
      suppressAbortMessageRef.current = true;
      chatAbortRef.current.abort('chat-closed');
    }
    setChatLoading(false);
    setChatOpen(false);
  };

  return (
    <div className="relative w-full min-h-[420px] md:min-h-[520px] flex items-center justify-center overflow-hidden border-b py-12 md:py-0"
         style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-40"
           style={{ backgroundImage: 'linear-gradient(to right, var(--bg-tertiary) 1px, transparent 1px), linear-gradient(to bottom, var(--bg-tertiary) 1px, transparent 1px)', backgroundSize: '2rem 2rem' }}></div>
      
      {/* Radial Gradient */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, var(--accent-glow) 0%, transparent 70%)' }}></div>

      <div className="relative z-10 max-w-4xl w-full px-6 flex flex-col md:flex-row gap-8 items-center">
        
        {/* Left: Text Content */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-wrap gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider"
                 style={{ backgroundColor: 'var(--accent-glow)', border: '1px solid var(--border-hover)', color: 'var(--accent)' }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)' }}></span>
              System v2.5
            </div>
            {isScanning && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider animate-pulse"
                   style={{ backgroundColor: 'var(--accent-glow)', border: '1px solid var(--success)', color: 'var(--success)' }}>
                <Wifi size={12} />
                SCANNING FEED...
              </div>
            )}
          </div>
          
           <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-transparent bg-clip-text"
               style={{ backgroundImage: 'linear-gradient(to right, var(--text-primary), var(--accent-hover), var(--accent))' }}>
            cliever
          </h1>
           <p className="text-base md:text-xl max-w-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            The live, self-updating registry for the next generation of <span style={{ color: 'var(--accent)' }}>Autonomous Coding Agents</span>.
          </p>

           <div className="flex flex-wrap gap-3 pt-4">
             <div className="flex items-center gap-2 text-xs md:text-sm font-mono" style={{ color: 'var(--text-muted)' }}>
                <Cpu size={16} />
               <span>Local Model Powered</span>
             </div>
             <div className="flex items-center gap-2 text-xs md:text-sm font-mono" style={{ color: 'var(--text-muted)' }}>
                <ShieldCheck size={16} />
                <span>Verified Tools</span>
             </div>
          </div>
        </div>

        {/* Right: Terminal Visual */}
        <div className="flex-1 w-full max-w-md">
          <div className="rounded-lg shadow-2xl overflow-hidden font-mono text-xs md:text-sm relative"
               style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <div className="px-4 py-2 flex items-center gap-2"
                     style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border)' }}>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--error)', opacity: 0.7 }}></div>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--warning)', opacity: 0.7 }}></div>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--success)', opacity: 0.7 }}></div>
                    <span className="ml-2" style={{ color: 'var(--text-muted)' }}>root@cliever:~</span>

                    <div className="ml-auto flex items-center gap-2">
                      <button
                        onClick={() => setChatOpen(true)}
                        className="flex items-center gap-2 px-2 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider transition-all"
                        style={{
                          backgroundColor: 'var(--bg-secondary)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-muted)'
                        }}
                        aria-label="Open LaPoet chat"
                        type="button"
                      >
                        <MessageSquare size={12} style={{ color: 'var(--accent)' }} />
                        <span className="hidden sm:inline">CHAT</span>
                      </button>
                    </div>
                </div>
                <div className="p-4 h-64 whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--accent)' }}>
                    {text}
                    {isScanning && <span className="block mt-2" style={{ color: 'var(--accent-hover)' }}>&gt; DETECTING NEW PROTOCOLS...</span>}
                    <span className="animate-pulse">_</span>
                </div>

                {chatOpen && (
                  <div
                    className="absolute inset-0 z-20 flex flex-col"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}
                  >
                    <div
                      className="px-4 py-2 flex items-center justify-between"
                      style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border)' }}
                    >
                      <div className="flex items-center gap-2">
                        <MessageSquare size={14} style={{ color: 'var(--accent)' }} />
                        <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                          LaPoet Chat
                        </span>
                      </div>
                      <button
                        onClick={closeChat}
                        className="p-1 rounded-md transition-all"
                        style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                        aria-label="Close chat"
                        type="button"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                      {chatHistory.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className="max-w-[90%] rounded-lg p-2 whitespace-pre-wrap leading-relaxed"
                            style={
                              msg.role === 'user'
                                ? {
                                    backgroundColor: 'var(--accent-glow)',
                                    color: 'var(--accent)',
                                    border: '1px solid var(--accent)'
                                  }
                                : {
                                    backgroundColor: 'var(--bg-primary)',
                                    color: 'var(--text-secondary)',
                                    border: '1px solid var(--border)'
                                  }
                            }
                          >
                            {msg.text}
                          </div>
                        </div>
                      ))}
                      {chatLoading && (
                        <div className="animate-pulse" style={{ color: 'var(--accent)' }}>
                          &gt; THINKING...
                        </div>
                      )}
                    </div>

                    <form
                      onSubmit={handleChatSubmit}
                      className="p-3"
                      style={{ borderTop: '1px solid var(--border)', backgroundColor: 'var(--bg-tertiary)' }}
                    >
                      <input
                        className="w-full rounded-lg px-3 py-2 text-xs focus:outline-none font-mono"
                        style={{
                          backgroundColor: 'var(--bg-primary)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-primary)'
                        }}
                        placeholder="ASK_LAPOET..."
                        value={chatInput}
                        onChange={(e) => setChatInput(sanitizeChatMessage(e.target.value))}
                      />
                    </form>
                  </div>
                )}

                {/* Scanline overlay */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-white/5 to-transparent h-4 w-full animate-scanline opacity-30"></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalHero;