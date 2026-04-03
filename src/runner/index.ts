import type { Runner } from "./types.js";
import { ClaudeRunner } from "./claude.js";
import { CodexRunner } from "./codex.js";

const runners: Record<string, () => Runner> = {
  claude: () => new ClaudeRunner(),
  codex: () => new CodexRunner(),
};

export function createRunner(name: string): Runner {
  const factory = runners[name];
  if (!factory) {
    throw new Error(
      `Unknown runner: ${name}. Available: ${Object.keys(runners).join(", ")}`,
    );
  }
  return factory();
}

export function listRunners(): string[] {
  return Object.keys(runners);
}

export type { Runner, RawResult, TokenUsage } from "./types.js";
