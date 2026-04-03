import Table from "cli-table3";
import chalk from "chalk";
import type { AggregatedResult } from "../scoring/types.js";

export function renderTable(results: AggregatedResult[]): string {
  const table = new Table({
    head: [
      chalk.bold("Config"),
      chalk.bold("Pass Rate"),
      chalk.bold("Avg Tokens"),
      chalk.bold("Avg Time"),
      chalk.bold("Avg Cost"),
      chalk.bold("Score"),
    ],
    colAligns: ["left", "center", "right", "right", "right", "center"],
  });

  for (const r of results) {
    const passColor = r.passRate >= 0.8 ? chalk.green : r.passRate >= 0.5 ? chalk.yellow : chalk.red;
    table.push([
      r.configId,
      passColor(`${Math.round(r.passRate * 100)}%`),
      r.avgTokens.toLocaleString("en-US", { maximumFractionDigits: 0 }),
      `${(r.avgTimeMs / 1000).toFixed(1)}s`,
      `$${r.avgCostUsd.toFixed(4)}`,
      chalk.bold(String(r.score)),
    ]);
  }

  return table.toString();
}
