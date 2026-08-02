/**
 * Jest configuration for ESM + Node.
 * Run with: npm test  (uses --experimental-vm-modules under the hood)
 */
export default {
  testEnvironment: "node",
  transform: {},
  moduleFileExtensions: ["js", "json"],
  testMatch: ["**/tests/**/*.test.js"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  verbose: true,
  forceExit: true,
  testTimeout: 30000,
};
