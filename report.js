// Turns results/results.jsonl into a markdown table you can paste into your README.
// Usage: node report.js
import { readFileSync } from "node:fs";

const rows = readFileSync("results/results.jsonl", "utf8")
  .trim()
  .split("\n")
  .map((line) => JSON.parse(line));

console.log("| Test | Route | Settings (c/w/p/d) | Avg req/s | Total requests | MB/s | p99 ms | Errors |");
console.log("|---|---|---|---:|---:|---:|---:|---:|");
for (const r of rows) {
  const s = r.settings;
  console.log(
    `| ${r.label} | ${r.route} | ${s.c}/${s.w}/${s.p}/${s.d}s | ${r.avgReqPerSec.toLocaleString()} | ${r.totalRequests.toLocaleString()} | ${r.throughputMBps} | ${r.p99LatencyMs} | ${r.errors + r.timeouts + r.non2xx} |`
  );
}
console.log(`\nMachine: ${rows[rows.length - 1].machine} | Node ${rows[rows.length - 1].node}`);