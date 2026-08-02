import { createApp } from "./app.js";
import { connectDB, disconnectDB } from "./config/db.js";
import env, { validateEnv } from "./config/env.js";
import logger from "./utils/logger.js";

// Surface config problems immediately (fatal in production).
const missing = validateEnv();
if (missing.length) logger.warn(`Missing env vars (using defaults): ${missing.join(", ")}`);

const app = createApp();
let server;

async function start() {
  await connectDB();
  server = app.listen(env.port, () => {
    logger.info(`🚀 Server running in ${env.nodeEnv} mode on http://localhost:${env.port}`);
    logger.info(`   API base: ${env.apiPrefix}`);
  });
}

/** Graceful shutdown so in-flight requests finish and connections close cleanly. */
async function shutdown(signal) {
  logger.info(`${signal} received. Shutting down gracefully...`);
  if (server) {
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
    // Force-exit if it hangs.
    setTimeout(() => process.exit(1), 10000).unref();
  } else {
    process.exit(0);
  }
}

process.on("unhandledRejection", (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`);
});
process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.message}\n${err.stack}`);
  process.exit(1);
});
["SIGINT", "SIGTERM"].forEach((sig) => process.on(sig, () => shutdown(sig)));

start().catch((err) => {
  logger.error(`Failed to start server: ${err.message}`);
  process.exit(1);
});

export default app;
