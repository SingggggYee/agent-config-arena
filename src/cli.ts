import { Command } from "commander";
import { readFile, writeFile, readdir, stat } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import chalk from "chalk";
import { loadTasks } from "./task/loader.js";
import { validateTask } from "./task/validator.js";
import { loadConfigs, loadConfig } from "./config/loader.js";
import { createRunner, listRunners } from "./runner/index.js";
import { executeBenchmark } from "./executor/index.js";
import { aggregateResults } from "./scoring/index.js";
import { renderTable } from "./reporter/table.js";
import { generateLeaderboardMarkdown } from "./reporter/leaderboard.js";
import { log } from "./utils/logger.js";
import type { RunResult } from "./scoring/types.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

function resolveProjectPath(relative: string): string {
  // In development, resolve from project root; in npx, from package root
  return resolve(process.cwd(), relative);
}

export function createCli(): Command {
  const program = new Command();

  program
    .name("agent-config-arena")
    .description(
      "Neutral benchmark arena that tests agent configs on real coding tasks.",
    )
    .version("0.1.0");

  // --- list-tasks ---
  program
    .command("list-tasks")
    .description("List available benchmark tasks")
    .option("-d, --dir <path>", "Tasks directory", "tasks/official")
    .action(async (opts) => {
      const tasks = await loadTasks(resolveProjectPath(opts.dir));
      if (tasks.length === 0) {
        log.warn("No tasks found.");
        return;
      }

      console.log(chalk.bold(`\n  Available Tasks (${tasks.length})\n`));
      for (const t of tasks) {
        const diffColor =
          t.meta.difficulty === "easy"
            ? chalk.green
            : t.meta.difficulty === "medium"
              ? chalk.yellow
              : chalk.red;
        console.log(
          `  ${chalk.bold(t.id.padEnd(25))} ${diffColor(t.meta.difficulty.padEnd(8))} ${t.meta.name}`,
        );
      }
      console.log();
    });

  // --- list-configs ---
  program
    .command("list-configs")
    .description("List available configs")
    .option("-d, --dir <path>", "Configs directory", "configs")
    .action(async (opts) => {
      const configs = await loadConfigs(resolveProjectPath(opts.dir));
      if (configs.length === 0) {
        log.warn("No configs found.");
        return;
      }

      console.log(chalk.bold(`\n  Available Configs (${configs.length})\n`));
      for (const c of configs) {
        const tierColor =
          c.meta.tier === "official" ? chalk.blue : chalk.gray;
        console.log(
          `  ${chalk.bold(c.id.padEnd(25))} ${tierColor(c.meta.tier.padEnd(12))} ${c.meta.description || ""}`,
        );
      }
      console.log();
    });

  // --- validate-task ---
  program
    .command("validate-task")
    .description("Validate a task definition")
    .argument("<path>", "Path to task directory")
    .action(async (taskPath) => {
      const result = await validateTask(resolveProjectPath(taskPath));

      if (result.valid) {
        log.success("Task is valid.");
      } else {
        log.error("Task validation failed:");
        for (const err of result.errors) {
          console.log(chalk.red(`  - ${err}`));
        }
      }

      if (result.warnings.length > 0) {
        console.log(chalk.yellow("\nWarnings:"));
        for (const warn of result.warnings) {
          console.log(chalk.yellow(`  - ${warn}`));
        }
      }

      process.exitCode = result.valid ? 0 : 1;
    });

  // --- run ---
  program
    .command("run")
    .description("Run a single config against tasks")
    .requiredOption("-c, --config <path>", "Config file path")
    .option("-r, --runner <name>", "Runner to use", "claude")
    .option("-t, --tasks <path>", "Tasks directory", "tasks/official")
    .option("--task <id>", "Run specific task only")
    .option("-n, --runs <number>", "Runs per task", "3")
    .option("-o, --output <path>", "Results output directory", "results")
    .option("-v, --verbose", "Show verbose output", false)
    .action(async (opts) => {
      const runner = createRunner(opts.runner);
      const config = await loadConfig(resolveProjectPath(opts.config));
      let tasks = await loadTasks(resolveProjectPath(opts.tasks));

      if (opts.task) {
        tasks = tasks.filter((t) => t.id === opts.task);
        if (tasks.length === 0) {
          log.error(`Task not found: ${opts.task}`);
          process.exitCode = 1;
          return;
        }
      }

      console.log(
        chalk.bold(
          `\nAgent Config Arena - Run\n` +
            `  Runner:  ${runner.name}\n` +
            `  Config:  ${config.meta.name}\n` +
            `  Tasks:   ${tasks.length}\n` +
            `  Runs:    ${opts.runs}x\n`,
        ),
      );

      const results = await executeBenchmark(runner, tasks, [config], {
        runs: parseInt(opts.runs, 10),
        verbose: opts.verbose,
        outputDir: resolveProjectPath(opts.output),
      });

      const aggregated = aggregateResults(results);
      console.log("\n" + renderTable(aggregated));
    });

  // --- compare ---
  program
    .command("compare")
    .description("Compare multiple configs")
    .requiredOption("--configs <path>", "Configs directory")
    .option("-r, --runner <name>", "Runner to use", "claude")
    .option("-t, --tasks <path>", "Tasks directory", "tasks/official")
    .option("-n, --runs <number>", "Runs per task", "3")
    .option("-o, --output <path>", "Results output directory", "results")
    .option("-v, --verbose", "Show verbose output", false)
    .action(async (opts) => {
      const runner = createRunner(opts.runner);
      const configs = await loadConfigs(resolveProjectPath(opts.configs));
      const tasks = await loadTasks(resolveProjectPath(opts.tasks));

      if (configs.length === 0) {
        log.error("No configs found.");
        process.exitCode = 1;
        return;
      }

      console.log(
        chalk.bold(
          `\nAgent Config Arena - Compare\n` +
            `  Runner:  ${runner.name}\n` +
            `  Configs: ${configs.length}\n` +
            `  Tasks:   ${tasks.length}\n` +
            `  Runs:    ${opts.runs}x\n`,
        ),
      );

      const results = await executeBenchmark(runner, tasks, configs, {
        runs: parseInt(opts.runs, 10),
        verbose: opts.verbose,
        outputDir: resolveProjectPath(opts.output),
      });

      const aggregated = aggregateResults(results);
      console.log("\n" + renderTable(aggregated));
    });

  // --- leaderboard ---
  program
    .command("leaderboard")
    .description("Generate leaderboard from existing results")
    .option("-d, --dir <path>", "Results directory", "results")
    .option("-r, --runner <name>", "Filter by runner")
    .option("-o, --output <path>", "Output file", "LEADERBOARD.md")
    .action(async (opts) => {
      const resultsDir = resolveProjectPath(opts.dir);
      const results = await loadAllResults(resultsDir, opts.runner);

      if (results.length === 0) {
        log.warn("No results found. Run benchmarks first.");
        return;
      }

      const aggregated = aggregateResults(results);
      console.log("\n" + renderTable(aggregated));

      const runner = opts.runner || "all";
      const md = generateLeaderboardMarkdown(aggregated, runner);
      await writeFile(resolveProjectPath(opts.output), md);
      log.success(`\nLeaderboard written to ${opts.output}`);
    });

  return program;
}

async function loadAllResults(
  dir: string,
  runnerFilter?: string,
): Promise<RunResult[]> {
  const results: RunResult[] = [];

  async function walk(path: string) {
    let entries: string[];
    try {
      entries = await readdir(path);
    } catch {
      return;
    }

    for (const name of entries) {
      const full = join(path, name);
      const s = await stat(full).catch(() => null);
      if (s?.isDirectory()) {
        await walk(full);
      } else if (name.endsWith(".json")) {
        try {
          const content = await readFile(full, "utf-8");
          const result: RunResult = JSON.parse(content);
          if (!runnerFilter || result.runner === runnerFilter) {
            results.push(result);
          }
        } catch {
          // Skip invalid files
        }
      }
    }
  }

  await walk(dir);
  return results;
}
