# Performance Optimization

The search function in `src/search.ts` is too slow. The benchmark target is **10,000 ops/sec**; current performance is approximately **500 ops/sec**.

## Requirements

1. **Optimize the `TextIndex` class** in `src/search.ts` to meet the benchmark target of 10,000 ops/sec.
2. **Do not change the public API** - the `TextIndex` class must keep the same method signatures:
   - `addDocument(id: string, text: string): void`
   - `search(query: string): SearchResult[]`
3. **All existing tests must still pass** (`npx vitest run`).
4. **The benchmark must pass** (`npx tsx src/benchmark.ts` must exit with code 0).

## What you CAN change

- Internal implementation of `TextIndex` (data structures, algorithms, caching)
- Add private methods or properties
- Restructure the internal search logic

## What you CANNOT change

- The `SearchResult` interface
- The public method signatures of `TextIndex`
- The test file
- The benchmark file

## Hints

- The current implementation does a full scan of all documents on every search with nested loops - consider building an inverted index.
- String operations like `toLowerCase()` and `split()` are called repeatedly on the same data.
- The corpus documents never change after being added - pre-processing is your friend.
