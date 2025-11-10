# Interstellar FM

Interstellar FM is an Expo / React Native app for discovering and streaming internet radio. It features a saved-stations library, fast search backed by [radio-browser.info](https://api.radio-browser.info/), and a persistent mini player that keeps streams going in the background.

## Requirements
- Node.js 18 or newer (Node 20 recommended)
- npm (comes with Node)
- Expo CLI (installed automatically via `npx` when running scripts)

## Local Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the app:
   ```bash
   npm start
   ```
   Choose iOS, Android, or Web from the Expo dev tools to launch the app.

Key directories:
- `app/(tabs)` – file-based routes for Saved and Search tabs.
- `components/radio` – UI pieces for station cards, tabs, and the bottom player.
- `contexts/radio-context.tsx` – global audio/state provider powered by `expo-audio`.
- `lib/radio-browser.ts` – Radio Browser API client and helpers.

## Testing & Linting
```bash
npm run lint
npm test -- --runInBand
```
Tests use Jest with React Native Testing Library (`components/radio/__tests__`). Mock utilities live under `test/test-utils.tsx`.

## Deploying the Web Build
- Static export: `npm run build:web` (outputs to `dist/`).
- GitHub Pages deployment runs automatically via `.github/workflows/deploy-web.yml` when pushing to `master`.

## Store Readiness
- `app.json` includes placeholder bundle identifiers (`com.interstellarfm.app`) and background audio settings (iOS `UIBackgroundModes: ["audio"]`, Android foreground service permissions). Update identifiers, app icons, splash art, and metadata before submitting to the App Store / Play Store.

## Environment & Production Notes
- Radio search relies on the public Radio Browser API; if you deploy to production, consider caching results or selecting a preferred mirror.
- Background playback uses `expo-audio` with a shared `AudioPlayer`, including iOS lock-screen metadata/controls so the current station shows up while the device is sleeping. Confirm behavior on physical devices before shipping.

## Contributing
1. Fork & clone the repo.
2. Create a feature branch.
3. Run lint/tests before pushing.
4. Open a pull request describing the change.

Happy listening! 🎧
