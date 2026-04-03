export interface TokenUsage {
  input: number;
  output: number;
  total: number;
}

export interface RawResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
  tokens: TokenUsage;
}

export interface Runner {
  name: string;
  configFileName: string;
  execute(
    prompt: string,
    sandboxPath: string,
    configPath: string,
  ): Promise<RawResult>;
}
