export const suggestCopyCommand = (command: string): string => {
  const trimmed = command.trim();
  if (!trimmed) return '';

  // Heuristic: if the command is a global npm install, prefer a runnable npx form.
  // We keep this intentionally simple ("try"), since binary/package names can differ.
  const npmGlobal = trimmed.match(/^npm\s+(?:install|i)\s+-g\s+(.+)$/i);
  if (npmGlobal) {
    const pkg = (npmGlobal[1] ?? '').trim().split(/\s+/)[0];
    if (pkg) return `npx --yes ${pkg}`;
  }

  return trimmed;
};
