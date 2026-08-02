import mongoose from "mongoose";
import env from "./env.js";
import logger from "../utils/logger.js";

/**
 * Establish a resilient MongoDB connection with sane pooling defaults.
 * Retries with exponential backoff so transient Atlas hiccups don't crash boot.
 * @param {string} uri - Mongo connection string.
 * @param {number} attempt - Current retry attempt (internal).
 */
export async function connectDB(uri = env.mongoUri, attempt = 1) {
  const maxAttempts = 5;
  try {
    mongoose.set("strictQuery", true);
    const conn = await mongoose.connect(uri, {
      autoIndex: !env.isProd,
      maxPoolSize: 20,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    logger.info(
      `MongoDB connected: ${conn.connection.host}/${conn.connection.name}`
    );
    return conn;
  } catch (err) {
    logger.error(`MongoDB connection error (attempt ${attempt}): ${err.message}`);
    if (attempt >= maxAttempts) throw err;
    const delay = Math.min(1000 * 2 ** attempt, 15000);
    await new Promise((r) => setTimeout(r, delay));
    return connectDB(uri, attempt + 1);
  }
}

export async function disconnectDB() {
  await mongoose.connection.close();
  logger.info("MongoDB connection closed");
}

export default connectDB;
