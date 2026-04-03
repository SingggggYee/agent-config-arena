import { TextIndex } from "./search.js";

const TARGET_OPS_PER_SEC = 10_000;
const TOTAL_OPERATIONS = 1000;

const searchQueries = [
  "machine learning",
  "deep learning neural",
  "web development",
  "database optimization",
  "security",
  "cloud computing",
  "container orchestration",
  "testing",
  "design patterns",
  "data processing",
  "network protocol",
  "programming language",
  "performance monitoring",
  "distributed systems",
  "real time",
  "algorithm",
  "computing",
  "application development",
  "architecture",
  "automation",
];

function runBenchmark(): void {
  const index = new TextIndex();

  // Warm up
  for (let i = 0; i < 10; i++) {
    index.search("warmup query");
  }

  // Benchmark
  const startTime = performance.now();

  for (let i = 0; i < TOTAL_OPERATIONS; i++) {
    const query = searchQueries[i % searchQueries.length];
    const results = index.search(query);
    // Prevent dead code elimination
    if (results.length < 0) console.log("impossible");
  }

  const endTime = performance.now();
  const durationMs = endTime - startTime;
  const durationSec = durationMs / 1000;
  const opsPerSec = Math.round(TOTAL_OPERATIONS / durationSec);

  console.log(`Benchmark Results:`);
  console.log(`  Operations: ${TOTAL_OPERATIONS}`);
  console.log(`  Duration: ${durationMs.toFixed(1)}ms`);
  console.log(`  Throughput: ${opsPerSec.toLocaleString()} ops/sec`);
  console.log(`  Target: ${TARGET_OPS_PER_SEC.toLocaleString()} ops/sec`);
  console.log();

  if (opsPerSec >= TARGET_OPS_PER_SEC) {
    console.log(`PASS: ${opsPerSec.toLocaleString()} ops/sec >= ${TARGET_OPS_PER_SEC.toLocaleString()} ops/sec`);
    process.exit(0);
  } else {
    console.log(`FAIL: ${opsPerSec.toLocaleString()} ops/sec < ${TARGET_OPS_PER_SEC.toLocaleString()} ops/sec`);
    process.exit(1);
  }
}

runBenchmark();
