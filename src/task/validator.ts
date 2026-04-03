import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import type { TaskMeta } from "./types.js";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export async function validateTask(taskDir: string): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  const requiredFiles = ["prompt.md", "test.sh", "meta.json"];
  for (const file of requiredFiles) {
    try {
      await access(join(taskDir, file));
    } catch {
      errors.push(`Missing required file: ${file}`);
    }
  }

  try {
    await access(join(taskDir, "scaffold"));
  } catch {
    errors.push("Missing required directory: scaffold/");
  }

  const metaPath = join(taskDir, "meta.json");
  try {
    const content = await readFile(metaPath, "utf-8");
    const meta: TaskMeta = JSON.parse(content);

    if (!meta.id) errors.push("meta.json: missing 'id'");
    if (!meta.name) errors.push("meta.json: missing 'name'");
    if (!meta.difficulty) errors.push("meta.json: missing 'difficulty'");
    if (!["easy", "medium", "hard"].includes(meta.difficulty)) {
      errors.push(`meta.json: invalid difficulty '${meta.difficulty}'`);
    }
    if (!meta.timeoutSeconds || meta.timeoutSeconds <= 0) {
      errors.push("meta.json: 'timeoutSeconds' must be a positive number");
    }
    if (!meta.expectedTokenRange || meta.expectedTokenRange.length !== 2) {
      warnings.push("meta.json: 'expectedTokenRange' should be [min, max]");
    }
  } catch (e) {
    if (!errors.some((err) => err.includes("meta.json"))) {
      errors.push(`meta.json: invalid JSON - ${e}`);
    }
  }

  const promptPath = join(taskDir, "prompt.md");
  try {
    const prompt = await readFile(promptPath, "utf-8");
    if (prompt.trim().length < 20) {
      warnings.push("prompt.md: very short prompt (< 20 chars)");
    }
  } catch {
    // Already caught by requiredFiles check
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
