export interface RunResult {
  configId: string;
  taskId: string;
  runner: string;
  runNumber: number;
  timestamp: string;
  passed: boolean;
  tokensInput: number;
  tokensOutput: number;
  tokensTotal: number;
  wallClockMs: number;
  costUsd: number;
  exitCode: number;
  error?: string;
}

export interface AggregatedResult {
  configId: string;
  runner: string;
  passRate: number;
  avgTokens: number;
  avgTimeMs: number;
  avgCostUsd: number;
  score: number;
  taskResults: Map<string, RunResult[]>;
}

export interface ScoringWeights {
  passRate: number;
  tokenEfficiency: number;
  timeEfficiency: number;
  costEfficiency: number;
}

export const DEFAULT_WEIGHTS: ScoringWeights = {
  passRate: 0.4,
  tokenEfficiency: 0.25,
  timeEfficiency: 0.2,
  costEfficiency: 0.15,
};
