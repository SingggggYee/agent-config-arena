# Runner Adapters

## Overview

Runner adapters translate between the arena's execution model and specific agent CLIs.

## Existing Runners

### Claude Code (`claude`)
- Config file: `CLAUDE.md`
- Invocation: `claude --print --output-format json -p <prompt>`
- Token parsing: From JSON response `usage.input_tokens` / `usage.output_tokens`

### Codex CLI (`codex`)
- Config file: `AGENTS.md`
- Invocation: `codex --quiet --auto-edit -p <prompt>`
- Token parsing: From JSONL stream `usage` events

## Adding a New Runner

Implement the `Runner` interface in `src/runner/`:

```typescript
import type { Runner, RawResult, TokenUsage } from "./types.js";

export class MyRunner implements Runner {
  name = "my-runner";
  configFileName = "MY_CONFIG.md";

  async execute(
    prompt: string,
    sandboxPath: string,
    configPath: string,
  ): Promise<RawResult> {
    // 1. Invoke your agent CLI in sandboxPath
    // 2. Capture stdout, stderr, exit code, duration
    // 3. Parse token usage
    // 4. Return RawResult
  }
}
```

Then register it in `src/runner/index.ts`:

```typescript
import { MyRunner } from "./my-runner.js";

const runners: Record<string, () => Runner> = {
  claude: () => new ClaudeRunner(),
  codex: () => new CodexRunner(),
  "my-runner": () => new MyRunner(),
};
```

## Runner Interface

```typescript
interface Runner {
  name: string;
  configFileName: string;
  execute(
    prompt: string,
    sandboxPath: string,
    configPath: string,
  ): Promise<RawResult>;
}

interface RawResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
  tokens: TokenUsage;
}

interface TokenUsage {
  input: number;
  output: number;
  total: number;
}
```
