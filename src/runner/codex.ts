import { execa } from "execa";
import type { Runner, RawResult, TokenUsage } from "./types.js";

export class CodexRunner implements Runner {
  name = "codex";
  configFileName = "AGENTS.md";

  async execute(
    prompt: string,
    sandboxPath: string,
    _configPath: string,
  ): Promise<RawResult> {
    const startTime = Date.now();

    try {
      const result = await execa(
        "codex",
        ["--quiet", "--auto-edit", "-p", prompt],
        {
          cwd: sandboxPath,
          timeout: 300_000,
          reject: false,
        },
      );

      const durationMs = Date.now() - startTime;
      const tokens = this.parseTokens(result.stdout);

      return {
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.exitCode ?? 1,
        durationMs,
        tokens,
      };
    } catch (error) {
      return {
        stdout: "",
        stderr: String(error),
        exitCode: 1,
        durationMs: Date.now() - startTime,
        tokens: { input: 0, output: 0, total: 0 },
      };
    }
  }

  private parseTokens(stdout: string): TokenUsage {
    try {
      const lines = stdout.split("\n").filter((l) => l.trim());
      let input = 0;
      let output = 0;

      for (const line of lines) {
        try {
          const event = JSON.parse(line);
          if (event.usage) {
            input += event.usage.input_tokens || 0;
            output += event.usage.output_tokens || 0;
          }
        } catch {
          continue;
        }
      }

      return { input, output, total: input + output };
    } catch {
      return { input: 0, output: 0, total: 0 };
    }
  }
}
