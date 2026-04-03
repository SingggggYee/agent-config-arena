# Task 05: Data Pipeline Transform

Implement a data transform pipeline in `src/transform.ts`.

## Requirements

1. **Read CSV files** from the `data/` directory (all `.csv` files)
2. **Normalize date formats** to ISO 8601 (`YYYY-MM-DD`). Input dates may be in formats like:
   - `2024-01-15` (already ISO)
   - `01/20/2024` (MM/DD/YYYY)
   - `Feb 10 2024` (Mon DD YYYY)
3. **Deduplicate rows** by `transaction_id` — when duplicates exist, keep the row with the latest date
4. **Fill missing currency** with `'USD'`
5. **Compute `total_usd`** by multiplying `amount` by the exchange rate from `data/exchange-rates.json`
6. **Output a single clean CSV** sorted ascending by date, with columns: `transaction_id,date,amount,currency,product,total_usd`

## Entry Point

The transform should run via:

```bash
npx tsx src/transform.ts <inputDir> <outputPath>
```

Where `<inputDir>` is the directory containing CSV and JSON files, and `<outputPath>` is where the output CSV should be written.

## Constraints

- Do NOT use external CSV parsing libraries — use built-in Node.js string parsing
- Round `total_usd` to 2 decimal places
- The output CSV must have a header row
