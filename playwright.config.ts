import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test/web',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: 'http://127.0.0.1:4173/interstellar-fm/',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node test/web/serve.mjs',
    url: 'http://127.0.0.1:4173/interstellar-fm/',
    reuseExistingServer: !process.env.CI,
  },
});
