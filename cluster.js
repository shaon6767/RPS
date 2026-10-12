// Runs one server file in many processes (one per CPU core).
// Usage: node cluster.js servers/cpeak.js 12
import cluster from "node:cluster";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const file = process.argv[2];
const cores = os.availableParallelism ? os.availableParallelism() : os.cpus().length;
const count = Number(process.argv[3]) || cores;

if (!file) {
  console.error("Usage: node cluster.js <server-file> [workers]");
  process.exit(1);
}

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid}: starting ${count} workers for ${file}`);
  for (let i = 0; i < count; i++) cluster.fork();
  cluster.on("exit", (worker, code) => {
    console.log(`Worker ${worker.process.pid} exited with code ${code}`);
  });
} else {
  await import(pathToFileURL(path.resolve(file)).href);
}