import { readFile, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { rm } from "node:fs/promises";
import type { Runner } from "../runner/types.js";
import type { Task } from "../task/types.js";
import type { Config } from "../config/types.js";
import type { RunResult } from "../scoring/types.js";
import { createSandbox } from "./sandbox.js";
import { runTestVerification, collectResult } from "./collector.js";
import { log } from "../utils/logger.js";

export interface ExecuteOptions {
  runs: number;
  verbose: boolean;
  outputDir: string;
}

export async function executeRun(
  runner: Runner,
  task: Task,
  config: Config,
  runNumber: number,
  options: ExecuteOptions,
): Promise<RunResult> {
  const prompt = await readFile(task.promptPath, "utf-8");
  const sandbox = await createSandbox(
    task.scaffoldPath,
    config.content,
    runner.configFileName,
  );

  try {
    if (options.verbose) {
      log.info(`  Run ${runNumber}: executing in ${sandbox.path}`);
    }

    const rawResult = await runner.execute(prompt, sandbox.path, config.filePath);
    const passed = await runTestVerification(sandbox.path, task);
    const result = collectResult(
      config.id,
      task.id,
      runner.name,
      runNumber,
      rawResult,
      passed,
    );

    await storeResult(result, options.outputDir);
    return result;
  } finally {
    await rm(sandbox.path, { recursive: true, force: true }).catch(() => {});
  }
}

export async function executeBenchmark(
  runner: Runner,
  tasks: Task[],
  configs: Config[],
  options: ExecuteOptions,
): Promise<RunResult[]> {
  const allResults: RunResult[] = [];

  for (const config of configs) {
    log.info(`\nConfig: ${config.meta.name} (${config.id})`);

    for (const task of tasks) {
      log.info(`  Task: ${task.meta.name} (${task.id})`);

      for (let run = 1; run <= options.runs; run++) {
        const result = await executeRun(runner, task, config, run, options);
        allResults.push(result);

        const status = result.passed ? "PASS" : "FAIL";
        log.info(
          `    Run ${run}: ${status} | ${result.tokensTotal} tokens | ${result.wallClockMs}ms | $${result.costUsd.toFixed(4)}`,
        );
      }
    }
  }

  return allResults;
}

async function storeResult(
  result: RunResult,
  outputDir: string,
): Promise<void> {
  const dir = join(
    outputDir,
    result.runner,
    result.configId,
    result.taskId,
  );
  await mkdir(dir, { recursive: true });

  const filename = `${result.timestamp.replace(/[:.]/g, "-")}_run${result.runNumber}.json`;
  await writeFile(join(dir, filename), JSON.stringify(result, null, 2));
}
