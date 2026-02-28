import React from 'react';
import { Palette, Check, ChevronDown } from 'lucide-react';
import { ThemeName, THEMES, applyTheme, getStoredTheme } from '../utils/theme';

interface ThemeSelectorProps {
  className?: string;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ className = '' }) => {
  const [currentTheme, setCurrentTheme] = React.useState<ThemeName>(getStoredTheme);
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Apply theme on mount and change
  React.useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeSelect = (themeName: ThemeName) => {
    setCurrentTheme(themeName);
    setIsOpen(false);
  };

  const current = THEMES[currentTheme];

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
                   hover:bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--border-hover)]"
        style={{ color: 'var(--text-secondary)' }}
        aria-label="Select theme"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Palette size={18} style={{ color: 'var(--accent)' }} />
        <span className="text-sm font-medium hidden sm:inline">{current.name}</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-64 rounded-xl overflow-hidden shadow-2xl z-50
                     border border-[var(--border)]"
          style={{
            background: 'var(--bg-secondary)',
            boxShadow: `0 20px 40px rgba(0,0,0,0.5), 0 0 20px var(--accent-glow)`
          }}
          role="listbox"
          aria-label="Theme options"
        >
          <div className="p-2">
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}>
              Select Theme
            </div>

            {Object.values(THEMES).map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeSelect(theme.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200
                           hover:bg-[var(--bg-tertiary)] group`}
                role="option"
                aria-selected={currentTheme === theme.id}
              >
                {/* Color preview */}
                <div className="flex gap-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: theme.colors.accent }}
                  />
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: theme.colors.bgSecondary }}
                  />
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: theme.colors.textSecondary }}
                  />
                </div>

                {/* Theme info */}
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {theme.name}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {theme.description}
                  </div>
                </div>

                {/* Check mark for selected */}
                {currentTheme === theme.id && (
                  <Check size={16} style={{ color: 'var(--accent)' }} />
                )}
              </button>
            ))}
          </div>

          {/* Footer with keyboard hint */}
          <div
            className="px-4 py-2 text-xs border-t"
            style={{
              color: 'var(--text-muted)',
              borderColor: 'var(--border)',
              background: 'var(--bg-tertiary)'
            }}
          >
            Theme persists across sessions
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
