# Interstellar FM

Discover and stream internet radio, save favorite stations, and revisit recent listening history. Built with Expo SDK 58, React Native, Expo Router, and [Radio Browser](https://api.radio-browser.info/).

**Website:** https://andyklimczak.github.io/interstellar-fm/

## Requirements

- Node.js **24 LTS** recommended (`nvm use` reads `.nvmrc`). Expo also supports Node 22.13+ and 26+ within the ranges in `package.json`.
- npm (included with Node).

## Local development

```bash
npm ci
npm run web
```

Use `npm start`, `npm run ios`, or `npm run android` for native development. Background audio and lock-screen controls should be tested on physical devices with a development/release build.

Key directories:

- `app/(tabs)` — Saved, Recent, and Search routes, using Expo Router's supported tab API.
- `components/radio` — station lists, search, and persistent player controls.
- `contexts/radio-context.tsx` — shared `expo-audio` player and local persistence.
- `lib/radio-browser.ts` — HTTPS station discovery, request timeouts, and mirror failover.

## Checks and tests

```bash
npm run check                 # lint, TypeScript, unit tests, root-path web export
npx expo-doctor               # SDK/configuration compatibility checks
```

Browser tests run against the **production static export**, served like a Pages project site (no SPA fallback). They cover asset loading, tab navigation, direct route reloads, search, saved/recent persistence, real audio decoding and controls, and playback errors. API responses and audio are fixtures, so tests do not depend on external station availability.

```bash
npx playwright install chromium
GITHUB_PAGES_BASE_PATH=/interstellar-fm npm run build:web
npm run test:web
```

On Linux CI, install browser system dependencies with `npx playwright install --with-deps chromium`. Playwright retains traces for failed tests in `test-results/`.

## GitHub Pages deployment

Pages is already configured to use **GitHub Actions** in this repository. No `gh-pages` branch, committed `dist/` directory, or deployment token is needed.

1. Push to `master` (or run **Actions → Deploy Web → Run workflow**).
2. `.github/workflows/deploy-web.yml` installs the lockfile with Node 24, runs lint/types/unit tests, and calls `actions/configure-pages`.
3. The build receives Pages' `base_path` as `GITHUB_PAGES_BASE_PATH`. `app.config.ts` applies it as Expo's `experiments.baseUrl`, so scripts, fonts, images, and navigation resolve under `/interstellar-fm/`, not the domain root.
4. Browser tests validate that exact export before `dist/` is uploaded and deployed with the official Pages actions.
5. The deployment job publishes its live URL in the `github-pages` environment.

Pull requests also run the production build and browser tests in `.github/workflows/ci.yml`.

### Preview the Pages build locally

```bash
GITHUB_PAGES_BASE_PATH=/interstellar-fm npm run build:web
node test/web/serve.mjs
# Open http://127.0.0.1:4173/interstellar-fm/
```

A plain `npm run build:web` exports for the domain root. For a user site or custom domain, the deployment workflow obtains the appropriate base path automatically. To preview a root-path export with the same server, use `GITHUB_PAGES_BASE_PATH= node test/web/serve.mjs`.

## Dependency and security maintenance

- Expo/native packages are kept at **SDK-compatible** versions rather than independently upgrading native modules to incompatible majors. Install/update them with `npx expo install` and check with `npx expo-doctor`.
- React, React DOM, and React Server Components are pinned to the patched **19.3.1** release. React/React DOM are excluded from Expo's exact-version check because SDK 58's bundled recommendation is the vulnerable 19.3.0 release.
- `glob` and modern `minimatch` transitive dependencies are overridden to patched releases; the build, lint, unit tests, browser tests, and Expo Doctor validate these overrides. Remove the overrides when upstream packages adopt fixed versions.
- `npm audit` currently reports only low-severity findings caused by Jest's transitive `deepmerge` dependency, for which no patched release is available. Do not run `npm audit fix --force`: it proposes downgrading the toolchain. `npm audit --omit=dev` checks the production dependency tree separately.
- Dependabot groups the Expo/React Native stack. Its auto-merge workflow requires lint, types, tests, and the web build, not just lint.

## Runtime and native release notes

- Search and featured stations use HTTPS streams. Old HTTP-only saved stations cannot play on the HTTPS website; select a secure replacement from Search.
- Station servers may go offline or use codecs unsupported by a browser. Playback failures appear in the player and can be retried. Browser autoplay rules require starting playback with a user interaction.
- Saved/recent stations and volume are stored locally per browser/device, not synced to a server. The API has no app-specific secret or backend requirement.
- Native background playback is enabled through the `expo-audio` config plugin. Microphone/recording permission is disabled because this app only plays audio.
- Before an App Store / Play Store release, review bundle identifiers (`com.interstellarfm.app`), signing, icons, splash art, and store metadata. Native device/store builds are separate from the verified static Pages deployment.

## Contributing

Create a branch, make changes, run the checks above, and open a pull request. See [PRIVACY_POLICY.md](PRIVACY_POLICY.md) and [LICENSE](LICENSE).
