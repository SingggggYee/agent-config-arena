import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

export async function transformData(
  inputDir: string,
  outputPath: string
): Promise<void> {
  // TODO: Implement
  // 1. Read all .csv files from inputDir
  // 2. Parse CSV rows (no external libraries — use string splitting)
  // 3. Normalize date formats to ISO 8601 (YYYY-MM-DD)
  // 4. Deduplicate by transaction_id, keeping the row with the latest date
  // 5. Fill missing currency with 'USD'
  // 6. Load exchange-rates.json and compute total_usd = amount * rate
  // 7. Sort by date ascending
  // 8. Write output CSV with header: transaction_id,date,amount,currency,product,total_usd
  throw new Error("Not implemented");
}

// CLI entry point
const [inputDir, outputPath] = process.argv.slice(2);
if (!inputDir || !outputPath) {
  console.error("Usage: npx tsx src/transform.ts <inputDir> <outputPath>");
  process.exit(1);
}

transformData(inputDir, outputPath)
  .then(() => console.log(`Output written to ${outputPath}`))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
