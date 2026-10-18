/**
 * Install-command helpers.
 *
 * Registry commands are displayed and copied exactly as stored (see
 * TESTING.md "Command Copy Behavior"). Some platform entries are manual
 * instructions rather than shell commands ("Download AppImage from …",
 * "Use WSL …"); those must never be emitted into a script as-is.
 */

/** Returns the command to copy: the stored command, trimmed, never rewritten. */
export const getCopyCommand = (command: string): string => command.trim();

/**
 * Heuristic: shell commands start with a lowercase program name, path, or
 * variable and contain no `<placeholder>` tokens. Prose instructions start
 * with a capitalized word ("Download", "Install via", "Use WSL").
 */
export const isExecutableCommand = (command: string): boolean => {
  const trimmed = command.trim();
  if (!trimmed) return false;
  if (!/^[a-z0-9_.~/$"'(-]/.test(trimmed)) return false;
  if (/<[a-z][\w-]*>/i.test(trimmed)) return false;
  return true;
};
