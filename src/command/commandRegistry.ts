/**
 * Command Registry
 * Central in-memory store for all registered AppCommands.
 * Supports dynamic registration per module without coupling to React.
 */

import { AppCommand } from './commandTypes';

const _registry = new Map<string, AppCommand>();

export function registerCommand(cmd: AppCommand): void {
  _registry.set(cmd.id, cmd);
}

export function unregisterCommand(id: string): void {
  _registry.delete(id);
}

export function getCommand(id: string): AppCommand | undefined {
  return _registry.get(id);
}

export function getAllCommands(): AppCommand[] {
  return Array.from(_registry.values()).filter((c) => !c.hidden);
}

export function executeCommand(id: string): boolean {
  const cmd = _registry.get(id);
  if (!cmd) return false;
  cmd.execute();
  return true;
}
