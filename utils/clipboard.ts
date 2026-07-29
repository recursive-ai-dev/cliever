/**
 * Clipboard Utilities
 * Provides a resilient copy-to-clipboard primitive with a legacy fallback.
 * The async Clipboard API requires a secure context; the textarea +
 * execCommand path keeps copy working on plain-http origins and older
 * browsers. Both paths report success/failure so callers can surface
 * feedback instead of failing silently.
 */
export const copyText = async (text: string): Promise<boolean> => {
  // Primary path: async Clipboard API (secure contexts only)
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Permission denied or unavailable — fall through to legacy path.
  }

  // Legacy fallback: hidden textarea + document.execCommand('copy')
  try {
    if (typeof document === 'undefined') return false;

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    document.body.appendChild(textarea);

    const previousActive = document.activeElement as HTMLElement | null;
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);

    const succeeded = document.execCommand('copy');
    document.body.removeChild(textarea);

    // Restore focus to whatever the user was doing
    previousActive?.focus?.();

    return succeeded;
  } catch {
    return false;
  }
};
