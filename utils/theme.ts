
export type ThemeName = 'default' | 'synthwave' | 'h3llscape' | 'm4trix';

export interface Theme {
    id: ThemeName;
    name: string;
    description: string;
    colors: {
        bgPrimary: string;
        bgSecondary: string;
        bgTertiary: string;
        textPrimary: string;
        textSecondary: string;
        textMuted: string;
        accent: string;
        accentHover: string;
        accentGlow: string;
        success: string;
        warning: string;
        error: string;
        border: string;
        borderHover: string;
        glass: string;
        scrollTrack: string;
        scrollThumb: string;
    };
}

export const THEMES: Record<ThemeName, Theme> = {
    default: {
        id: 'default',
        name: 'Default',
        description: 'Dark black and greys with teal accents',
        colors: {
            bgPrimary: '#0a0a0a',
            bgSecondary: '#111111',
            bgTertiary: '#1a1a1a',
            textPrimary: '#e5e5e5',
            textSecondary: '#a3a3a3',
            textMuted: '#666666',
            accent: '#14b8a6',
            accentHover: '#2dd4bf',
            accentGlow: 'rgba(20, 184, 166, 0.3)',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            border: 'rgba(255, 255, 255, 0.08)',
            borderHover: 'rgba(20, 184, 166, 0.4)',
            glass: 'rgba(17, 17, 17, 0.8)',
            scrollTrack: '#111111',
            scrollThumb: '#333333',
        }
    },
    synthwave: {
        id: 'synthwave',
        name: 'Synthwave',
        description: 'Neon-soaked 80s retro vibes',
        colors: {
            bgPrimary: '#0f0a1e',
            bgSecondary: '#1a1033',
            bgTertiary: '#251548',
            textPrimary: '#f0e6ff',
            textSecondary: '#c4b5fd',
            textMuted: '#7c5cad',
            accent: '#ff2a6d',
            accentHover: '#ff5c8d',
            accentGlow: 'rgba(255, 42, 109, 0.4)',
            success: '#05ffa1',
            warning: '#ffd319',
            error: '#ff2a6d',
            border: 'rgba(196, 181, 253, 0.15)',
            borderHover: 'rgba(255, 42, 109, 0.4)',
            glass: 'rgba(26, 16, 51, 0.8)',
            scrollTrack: '#1a1033',
            scrollThumb: '#7c5cad',
        }
    },
    h3llscape: {
        id: 'h3llscape',
        name: 'H3llscape',
        description: 'Infernal crimson chaos',
        colors: {
            bgPrimary: '#0a0000',
            bgSecondary: '#1a0505',
            bgTertiary: '#2a0a0a',
            textPrimary: '#ffd4d4',
            textSecondary: '#ff9999',
            textMuted: '#993333',
            accent: '#ff3333',
            accentHover: '#ff5555',
            accentGlow: 'rgba(255, 51, 51, 0.5)',
            success: '#ffaa00',
            warning: '#ff6600',
            error: '#ff0000',
            border: 'rgba(255, 100, 100, 0.15)',
            borderHover: 'rgba(255, 51, 51, 0.4)',
            glass: 'rgba(30, 5, 5, 0.85)',
            scrollTrack: '#1a0505',
            scrollThumb: '#662222',
        }
    },
    m4trix: {
        id: 'm4trix',
        name: 'M4trix',
        description: 'Digital rain, pure code',
        colors: {
            bgPrimary: '#000000',
            bgSecondary: '#001100',
            bgTertiary: '#002200',
            textPrimary: '#00ff00',
            textSecondary: '#00cc00',
            textMuted: '#006600',
            accent: '#00ff00',
            accentHover: '#33ff33',
            accentGlow: 'rgba(0, 255, 0, 0.4)',
            success: '#00ff00',
            warning: '#ccff00',
            error: '#ff3300',
            border: 'rgba(0, 255, 0, 0.15)',
            borderHover: 'rgba(0, 255, 0, 0.4)',
            glass: 'rgba(0, 20, 0, 0.85)',
            scrollTrack: '#001100',
            scrollThumb: '#004400',
        }
    }
};

const THEME_STORAGE_KEY = 'cliever_theme';

/**
 * Applies theme CSS variables to document root
 */
export const applyTheme = (themeName: ThemeName): void => {
    const theme = THEMES[themeName];
    if (!theme) return;

    const root = document.documentElement;
    const { colors } = theme;

    root.style.setProperty('--bg-primary', colors.bgPrimary);
    root.style.setProperty('--bg-secondary', colors.bgSecondary);
    root.style.setProperty('--bg-tertiary', colors.bgTertiary);
    root.style.setProperty('--text-primary', colors.textPrimary);
    root.style.setProperty('--text-secondary', colors.textSecondary);
    root.style.setProperty('--text-muted', colors.textMuted);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--accent-hover', colors.accentHover);
    root.style.setProperty('--accent-glow', colors.accentGlow);
    root.style.setProperty('--success', colors.success);
    root.style.setProperty('--warning', colors.warning);
    root.style.setProperty('--error', colors.error);
    root.style.setProperty('--border', colors.border);
    root.style.setProperty('--border-hover', colors.borderHover);
    root.style.setProperty('--glass', colors.glass);
    root.style.setProperty('--scroll-track', colors.scrollTrack);
    root.style.setProperty('--scroll-thumb', colors.scrollThumb);

    // Store preference
    try {
        localStorage.setItem(THEME_STORAGE_KEY, themeName);
    } catch {
        // Storage unavailable
    }
};

/**
 * Gets stored theme or default
 */
export const getStoredTheme = (): ThemeName => {
    try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        // Migrate old 'terminal' theme to 'default'
        if (stored === 'terminal') {
            return 'default';
        }
        if (stored && stored in THEMES) {
            return stored as ThemeName;
        }
    } catch {
        // Storage unavailable
    }
    return 'default';
};
