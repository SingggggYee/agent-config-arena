// Pricing per million tokens (USD), as of 2026-04
const PRICING: Record<string, { input: number; output: number }> = {
  claude: { input: 3.0, output: 15.0 },
  codex: { input: 2.5, output: 10.0 },
};

export function calculateCost(
  runner: string,
  inputTokens: number,
  outputTokens: number,
): number {
  const pricing = PRICING[runner] || PRICING.claude;
  return (
    (inputTokens / 1_000_000) * pricing.input +
    (outputTokens / 1_000_000) * pricing.output
  );
}
