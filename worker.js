import { Queue, Worker } from "bullmq";

const queue = new Queue("afj-jobs", { connection: { host: "localhost", port: 6379 } });
const worker = new Worker("afj-jobs", async job => {
  // Process job
  console.log("Processing job", job.id, job.data);
}, { connection: { host: "localhost", port: 6379 } });

console.log("Worker running");
