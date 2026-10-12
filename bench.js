// Usage: node bench.js <simple|heavy> <port> <label> [--c 5] [--w 1] [--p 2] [--d 20]
//   c = connections, w = autocannon worker threads, p = pipelining, d = duration (seconds)
import autocannon from "autocannon";
import os from "node:os";
import { mkdirSync, appendFileSync } from "node:fs";

const [route, port, label, ...rest] = process.argv.slice(2);
const opt = { c: 5, w: 1, p: 2, d: 20 };
for (let i = 0; i < rest.length; i += 2) opt[rest[i].replace("--", "")] = Number(rest[i + 1]);

const routes = {
  simple: { method: "GET", path: "/simple" },
  heavy: {
    method: "PATCH",
    path: "/api/items/42?filter=newest",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ foo: "bar", count: 7, tags: ["a", "b", "c"] }),
  },
};

const r = routes[route];
if (!r || !port || !label) {
  console.error("Usage: node bench.js <simple|heavy> <port> <label> [--c 5] [--w 1] [--p 2] [--d 20]");
  process.exit(1);
}

const result = await autocannon({
  url: `http://127.0.0.1:${port}${r.path}`,
  method: r.method,
  headers: r.headers,
  body: r.body,
  connections: opt.c,
  pipelining: opt.p,
  duration: opt.d,
  workers: opt.w,
});

const summary = {
  label,
  route,
  settings: opt,
  avgReqPerSec: Math.round(result.requests.average),
  totalRequests: result.requests.total,
  throughputMBps: Number((result.throughput.average / 1e6).toFixed(1)),
  p99LatencyMs: result.latency.p99,
  errors: result.errors,
  timeouts: result.timeouts,
  non2xx: result.non2xx,
  machine: `${os.cpus()[0].model.trim()} x${os.cpus().length}, ${Math.round(os.totalmem() / 2 ** 30)} GB RAM`,
  node: process.version,
  at: new Date().toISOString(),
};

console.log("\n===== RESULT =====");
console.log(`label:          ${summary.label}  (${summary.route} route)`);
console.log(`settings:       connections=${opt.c} workers=${opt.w} pipelining=${opt.p} duration=${opt.d}s`);
console.log(`avg req/sec:    ${summary.avgReqPerSec.toLocaleString()}`);
console.log(`total requests: ${summary.totalRequests.toLocaleString()}`);
console.log(`throughput:     ${summary.throughputMBps} MB/s`);
console.log(`p99 latency:    ${summary.p99LatencyMs} ms`);
console.log(`errors: ${summary.errors}  timeouts: ${summary.timeouts}  non-2xx: ${summary.non2xx}`);
console.log(`machine:        ${summary.machine}`);
if (summary.errors || summary.timeouts || summary.non2xx) {
  console.warn("WARNING: errors/timeouts/non-2xx found. Do NOT trust this run.");
}
mkdirSync("results", { recursive: true });
appendFileSync("results/results.jsonl", JSON.stringify(summary) + "\n");