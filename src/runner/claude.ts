import { execa } from "execa";
import type { Runner, RawResult, TokenUsage } from "./types.js";

export class ClaudeRunner implements Runner {
  name = "claude";
  configFileName = "CLAUDE.md";

  async execute(
    prompt: string,
    sandboxPath: string,
    _configPath: string,
  ): Promise<RawResult> {
    const startTime = Date.now();

    try {
      const result = await execa(
        "claude",
        ["--print", "--output-format", "json", "-p", prompt],
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
      const data = JSON.parse(stdout);
      const usage = data.usage || data.result?.usage || {};
      const input = usage.input_tokens || 0;
      const output = usage.output_tokens || 0;
      return { input, output, total: input + output };
    } catch {
      return { input: 0, output: 0, total: 0 };
    }
  }
}
