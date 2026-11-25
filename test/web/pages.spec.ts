import { Buffer } from 'node:buffer';
import { test, expect } from '@playwright/test';

declare global {
  interface Window {
    __testAudio: HTMLAudioElement[];
  }
}

const station = {
  stationuuid: 'browser-test-station', name: 'Cosmic Jazz',
  url: 'https://streams.example.com/test.wav',
  url_resolved: 'https://streams.example.com/test.wav',
  favicon: null, country: 'USA', countrycode: 'US', state: '', tags: 'jazz',
  bitrate: 128, homepage: '', lastcheckok: 1, codec: 'PCM', hls: 0,
  votes: 10, clickcount: 100, language: 'English',
};

// A real decodable audio source, without depending on a third-party live stream.
function silentWav() {
  const dataSize = 8000 * 2 * 60;
  const wav = Buffer.alloc(44 + dataSize);
  wav.write('RIFF', 0);
  wav.writeUInt32LE(36 + dataSize, 4);
  wav.write('WAVEfmt ', 8);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(8000, 24);
  wav.writeUInt32LE(16000, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write('data', 36);
  wav.writeUInt32LE(dataSize, 40);
  return wav;
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const NativeAudio = window.Audio;
    window.__testAudio = [];
    window.Audio = class extends NativeAudio {
      constructor(src?: string) {
        super(src);
        window.__testAudio.push(this);
      }
    };
  });
  await page.route('https://*.api.radio-browser.info/**', (route) => route.fulfill({
    json: route.request().url().includes('/json/url/') ? { ok: true } : [station],
  }));
  await page.route(station.url, (route) => route.fulfill({
    contentType: 'audio/wav', body: silentWav(),
  }));
});

test('site root, tabs, and direct route reloads load all assets', async ({ page, baseURL }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => {
    if (response.url().startsWith('http://127.0.0.1:4173/') && response.status() >= 400) {
      errors.push(`${response.status()} ${response.url()}`);
    }
  });
  await page.goto('./');
  await expect(page).toHaveURL(new URL('saved', baseURL).href);
  await expect(page.getByText('No saved stations yet')).toBeVisible();
  for (const tab of ['Search', 'Recent', 'Saved']) {
    await page.getByRole('tab', { name: tab }).click();
    await expect(page).toHaveURL(new URL(tab.toLowerCase(), baseURL).href);
    await page.reload();
    await expect(page.getByRole('tab', { name: tab })).toHaveAttribute('aria-selected', 'true');
  }
  expect(errors).toEqual([]);
});

test('search, saving, audio controls, and history work across reloads', async ({ page }) => {
  await page.goto('search');
  await page.getByPlaceholder('Search radio stations').fill('Cosmic');
  await expect(page.getByRole('button', { name: 'Save Cosmic Jazz', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Save Cosmic Jazz', exact: true }).click();
  // Saving a station must not bubble up and start playback.
  await expect(page.getByRole('button', { name: 'Stop playback' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Play Cosmic Jazz', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Pause playback' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.__testAudio[0]?.currentTime ?? 0)).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Pause playback' }).click();
  await expect.poll(() => page.evaluate(() => window.__testAudio[0]?.paused)).toBe(true);
  await expect(page.getByRole('button', { name: 'Play stream' })).toBeVisible();
  await page.getByRole('button', { name: 'Play stream' }).click();
  await expect.poll(() => page.evaluate(() => window.__testAudio[0]?.paused)).toBe(false);
  await expect(page.getByRole('button', { name: 'Pause playback' })).toBeVisible();
  await page.getByRole('button', { name: 'Stop playback' }).click();
  await expect(page.getByRole('button', { name: 'Stop playback' })).toHaveCount(0);
  await page.getByRole('tab', { name: 'Recent' }).click();
  await expect(page).toHaveURL(/\/recent$/);
  await expect(page.getByRole('button', { name: 'Play Cosmic Jazz', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Play Cosmic Jazz', exact: true })).toBeVisible();
  await page.getByRole('tab', { name: 'Saved' }).click();
  await expect(page).toHaveURL(/\/saved$/);
  await page.reload();
  await page.getByRole('button', { name: 'Unsave Cosmic Jazz', exact: true }).click();
  await expect(page.getByText('No saved stations yet')).toBeVisible();
});

test('an unplayable stream displays a recoverable error', async ({ page }) => {
  await page.route(station.url, (route) => route.fulfill({ status: 404, body: 'Unavailable' }));
  await page.goto('search');
  await page.getByRole('button', { name: 'Play Cosmic Jazz', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Unable to play this stream');
  await expect(page.getByRole('button', { name: 'Play stream' })).toBeVisible();
});
