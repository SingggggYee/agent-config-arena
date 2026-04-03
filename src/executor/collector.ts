import { execa } from "execa";
import { readFile, cp } from "node:fs/promises";
import { join } from "node:path";
import type { RawResult } from "../runner/types.js";
import type { RunResult } from "../scoring/types.js";
import type { Task } from "../task/types.js";
import { calculateCost } from "../utils/cost.js";

export async function runTestVerification(
  sandboxPath: string,
  task: Task,
): Promise<boolean> {
  try {
    const testSrc = task.testPath;
    const testDest = join(sandboxPath, "test.sh");
    await cp(testSrc, testDest);

    const result = await execa("bash", ["test.sh"], {
      cwd: sandboxPath,
      timeout: (task.meta.timeoutSeconds || 120) * 1000,
      reject: false,
    });

    return result.exitCode === 0;
  } catch {
    return false;
  }
}

export function collectResult(
  configId: string,
  taskId: string,
  runnerName: string,
  runNumber: number,
  rawResult: RawResult,
  passed: boolean,
): RunResult {
  return {
    configId,
    taskId,
    runner: runnerName,
    runNumber,
    timestamp: new Date().toISOString(),
    passed,
    tokensInput: rawResult.tokens.input,
    tokensOutput: rawResult.tokens.output,
    tokensTotal: rawResult.tokens.total,
    wallClockMs: rawResult.durationMs,
    costUsd: calculateCost(
      runnerName,
      rawResult.tokens.input,
      rawResult.tokens.output,
    ),
    exitCode: rawResult.exitCode,
    error: rawResult.exitCode !== 0 ? rawResult.stderr.slice(0, 500) : undefined,
  };
}
