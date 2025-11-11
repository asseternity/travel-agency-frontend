// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],

    // v4-safe pool settings
    pool: 'forks', // default in v4; most compatible on Windows/WSL
    fileParallelism: false, // one worker; avoids startup races
  },
});
