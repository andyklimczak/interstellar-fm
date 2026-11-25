# Interstellar FM

Discover and stream internet radio, save favorite stations, and revisit recent listening history. Built with Expo SDK 58, React Native, Expo Router, and [Radio Browser](https://api.radio-browser.info/).

**Website:** https://interstellarfm.com/

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

Browser tests run against the **production static export**, served like GitHub Pages (no SPA fallback). They cover asset loading, tab navigation, direct route reloads, search, saved/recent persistence, real audio decoding and controls, and playback errors. API responses and audio are fixtures, so tests do not depend on external station availability.

```bash
npx playwright install chromium
npm run build:web
npm run test:web
```

On Linux CI, install browser system dependencies with `npx playwright install --with-deps chromium`. Playwright retains traces for failed tests in `test-results/`.

## GitHub Pages deployment

Pages is already configured to use **GitHub Actions** in this repository. No `gh-pages` branch, committed `dist/` directory, or deployment token is needed.

1. Push to `master` (or run **Actions → Deploy Web → Run workflow**).
2. `.github/workflows/deploy-web.yml` installs the lockfile with Node 24, runs lint/types/unit tests, and calls `actions/configure-pages`.
3. The build receives Pages' `base_path` as `GITHUB_PAGES_BASE_PATH`. `app.config.ts` applies it as Expo's `experiments.baseUrl`. It is empty for `interstellarfm.com`, so scripts, fonts, images, and navigation resolve at the domain root.
4. Browser tests validate that exact export before `dist/` is uploaded and deployed with the official Pages actions.
5. The deployment job publishes its live URL in the `github-pages` environment.

Pull requests also build and test a root-path export in `.github/workflows/ci.yml`. After changing the Pages custom domain, run **Deploy Web** again: changing the domain does not rebuild the asset URLs in the published export.

### Preview the Pages build locally

```bash
npm run build:web
node test/web/serve.mjs
# Open http://127.0.0.1:4173/
```

To preview a project site without a custom domain, set `GITHUB_PAGES_BASE_PATH=/interstellar-fm` for both the build and the preview or test command.

## Dependency and security maintenance

- Expo/native packages are kept at **SDK-compatible** versions rather than independently upgrading native modules to incompatible majors. Install/update them with `npx expo install` and check with `npx expo-doctor`.
- React, React DOM, and React Server Components are pinned to the patched **19.3.1** release. React/React DOM are excluded from Expo's exact-version check because SDK 58's bundled recommendation is the vulnerable 19.3.0 release.
- `glob` and modern `minimatch` transitive dependencies are overridden to patched releases; the build, lint, unit tests, browser tests, and Expo Doctor validate these overrides. Remove the overrides when upstream packages adopt fixed versions.
- `npm audit` currently reports only low-severity findings caused by Jest's transitive `deepmerge` dependency, for which no patched release is available. Do not run `npm audit fix --force`: it proposes downgrading the toolchain. `npm audit --omit=dev` checks the production dependency tree separately.
- Dependabot checks npm and GitHub Actions every Monday at 09:00 UTC, groups routine updates, and groups npm security fixes separately. SDK migrations and incompatible compiler/linter majors remain deliberate manual upgrades. The specific Slider 5.2.2 and Worklets 0.13.1 releases are excluded because they fail SDK 58's dependency validation; revisit these exclusions at the next SDK upgrade. Other future patches and security-update PRs remain enabled.
- CI and deployment both run `npx expo install --check` to reject unsupported native dependency combinations. Routine dependency PRs must also pass lint, types, unit tests, the production export, and browser tests before merging.

### Dependabot automatic squash merges

`.github/workflows/dependabot.yml` uses the same **`DEPENDABOT_AUTOMERGE_PAT`** secret name as `andy-django-boilerplate`. Verified Dependabot PRs from this repository are approved and queued for squash auto-merge only for **minor/patch** updates. Major or unclassified updates require manual review. Auto-merge never bypasses required CI.

The workflow uses `pull_request_target` so its definition comes from the trusted default branch. It never checks out PR code, installs PR dependencies, or runs PR scripts with the token. All code validation runs separately in the unprivileged CI workflow.

Repository settings required (configured for this repository):

- **Allow auto-merge** and **squash merging** enabled.
- `master` requires the GitHub Actions **`validate`** check and an up-to-date branch before merging. This protects the complete CI job, including browser tests.

To finish token setup, create a fine-grained PAT restricted to this repository with **Contents: read/write**, **Pull requests: read/write**, and **Workflows: read/write** (needed for GitHub Actions update PRs). A classic PAT instead needs `repo` and `workflow` scopes. Use a dedicated automation account if desired, and set an expiration/rotation reminder. Merges use a PAT rather than `GITHUB_TOKEN` so they trigger the subsequent CI and Pages deployment.

Store the value under **Settings → Secrets and variables → Actions** and also under **Dependabot** with the same name, so it is available for Dependabot-triggered runs. Do not put it in `.env`, commit it, or paste it into chat. The CLI can prompt for it without printing it:

```bash
gh secret set DEPENDABOT_AUTOMERGE_PAT --repo andyklimczak/interstellar-fm
gh secret set DEPENDABOT_AUTOMERGE_PAT --app dependabot --repo andyklimczak/interstellar-fm
```

Until the secret is present, the workflow logs a setup warning and leaves PRs for manual review. A normal `GITHUB_TOKEN` fallback is intentionally not used. After setting/rotating the secret, re-run the auto-merge workflow for an eligible PR if needed.

## Runtime and native release notes

- Search and featured stations use HTTPS streams. Old HTTP-only saved stations cannot play on the HTTPS website; select a secure replacement from Search.
- Station servers may go offline or use codecs unsupported by a browser. Playback failures appear in the player and can be retried. Browser autoplay rules require starting playback with a user interaction.
- Saved/recent stations and volume are stored locally per browser/device, not synced to a server. The API has no app-specific secret or backend requirement.
- Native background playback is enabled through the `expo-audio` config plugin. Microphone/recording permission is disabled because this app only plays audio.
- Before an App Store / Play Store release, review bundle identifiers (`com.interstellarfm.app`), signing, icons, splash art, and store metadata. Native device/store builds are separate from the verified static Pages deployment.

## Contributing

Create a branch, make changes, run the checks above, and open a pull request. See [PRIVACY_POLICY.md](PRIVACY_POLICY.md) and [LICENSE](LICENSE).
