import { defineConfig } from '@playwright/test';

const basePath = (process.env.GITHUB_PAGES_BASE_PATH ?? '').replace(/\/$/, '');
const baseURL = `http://127.0.0.1:4173${basePath}/`;

export default defineConfig({
  testDir: './test/web',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node test/web/serve.mjs',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
});
