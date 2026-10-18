
import { Agent } from '../types';

export type Platform = 'windows' | 'macos' | 'linux';

/**
 * Heuristic to determine if a command string is compatible with Windows
 */
const isWindowsCompatibleCommand = (cmd: string): boolean => {
    const lower = cmd.toLowerCase();
    // Known unix-only package managers/tools
    if (lower.includes('brew ')) return false;
    if (lower.includes('sudo ')) return false;
    if (lower.includes('apt ')) return false;
    if (lower.includes('yum ')) return false;
    if (lower.includes('apk ')) return false;
    if (lower.includes('.sh') && !lower.includes('curl') && !lower.includes('wget')) return false; // simple scripts often bash
    if (/\|\s*(?:sudo\s+)?(?:ba|z)?sh\b/.test(lower)) return false; // curl … | bash installers need a POSIX shell
    if (/^sh -c /.test(lower)) return false;
    if (/\bchmod\b/.test(lower)) return false;
    return true;
};

/**
 * Heuristic to determine if a command string is compatible with Unix (Mac/Linux)
 */
const isUnixCompatibleCommand = (cmd: string): boolean => {
    const lower = cmd.toLowerCase();
    if (lower.includes('winget ')) return false;
    if (lower.includes('choco ')) return false;
    if (lower.includes('scoop ')) return false;
    if (lower.includes('.exe')) return false;
    if (lower.includes('powershell')) return false;
    return true;
};

/** Linux distro package managers that do not exist on macOS. */
const isLinuxOnlyCommand = (cmd: string): boolean =>
    /(?:^|[\s;&|])(?:sudo\s+)?(?:apt|apt-get|dnf|yum|pacman|zypper|apk|snap|yay)\s/.test(cmd.toLowerCase());

/** Whether a single command string can plausibly run as-is on the platform. */
export const isCommandCompatible = (cmd: string, platform: Platform): boolean => {
    if (platform === 'windows') return isWindowsCompatibleCommand(cmd);
    if (platform === 'macos' && isLinuxOnlyCommand(cmd)) return false;
    return isUnixCompatibleCommand(cmd);
};

export const isAgentCompatible = (agent: Agent, platform: Platform): boolean => {
    // If specific platform command exists, it's definitely compatible
    if (agent.platformCommands && agent.platformCommands[platform]) {
        return true;
    }

    // If strict separation is desired, we might consider if the default is compatible
    const defaultCmd = agent.platformCommands?.default || agent.installCommand;

    return isCommandCompatible(defaultCmd, platform);
};

export const getAgentInstallCommand = (agent: Agent, platform: Platform): string => {
    if (agent.platformCommands && agent.platformCommands[platform]) {
        return agent.platformCommands[platform]!;
    }
    return agent.platformCommands?.default || agent.installCommand;
};
