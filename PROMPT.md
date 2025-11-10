# Interstellar FM – Project Context for Future Agents

Thanks for jumping in! This repo contains **Interstellar FM**, an Expo/React Native app that delivers a smooth internet radio experience. Keep this file fresh whenever scope or implementation details change—it’s your quick-start guide and should stay accurate.

## Goal
Build a mobile-friendly radio player that lets users:
- Browse trending stations.
- Search the [Radio Browser](https://api.radio-browser.info/) catalogue.
- Save favourites locally.
- Stream reliably with simple playback controls (play/pause/stop, volume).

## How It Works
- **UI shell**: Expo Router drives a material top-tab layout (`app/(tabs)/_layout.tsx`) that surfaces the **Saved**, **Recent**, and **Search** stacks, while `/` redirects to `/saved`. `BottomPlayer` sits under the tabs so playback controls are always accessible.
- **State & playback**: `contexts/radio-context.tsx` wraps the tree, combining AsyncStorage for saved stations, recent history, and the last-used volume plus `expo-audio` for streaming via a shared `AudioPlayer`. It wires up iOS/Android lock-screen metadata & controls so the current station shows up system-wide, and exposes helpers like `playStation`, `togglePlayPause`, `stop`, and `setVolume`.
- **Radio Browser integration**: `lib/radio-browser.ts` centralizes API access. It handles host failover, sets a consistent user agent (native only), offers:
  - `searchStations` (with optional sort and limit),
  - `fetchTopStations` for popular lists,
  - `registerStationClick` to report playback to Radio Browser’s analytics.
- **Data structures**: `types/radio.ts` defines the shared `Station` shape used across the app.
- **Screens/components**:
  - `SavedStationsTab` renders saved favourites, reading from the context.
  - `RecentStationsTab` lists the most recently played stations (deduplicated, newest first).
  - `SearchStationsTab` fetches trending (`fetchTopStations`) by default and switches to query results, with order chips for name, click count, votes, and bitrate.
  - `BottomPlayer` (components/radio) shows current station info with stop/play and slider volume control.
  - `StationListItem` is a reusable card used by both tabs.
- **Dependabot**: `.github/dependabot.yml` (daily checks) and `.github/workflows/dependabot.yml` (lint + optional auto-merge) keep dependencies up to date.
- **CI/CD**: `.github/workflows/ci.yml` runs lint + tests on pushes/PRs, while `.github/workflows/deploy-web.yml` builds the Expo web bundle and publishes it to GitHub Pages once checks pass.

## App Store / Play Store readiness
- `app.json` already contains placeholder bundle identifiers (`com.interstellarfm.app`) and requests background audio capabilities (`UIBackgroundModes: ["audio"]` on iOS and foreground media playback + wake lock permissions on Android). Replace identifiers, icons, splash art, and other brand assets before submitting to the stores.
- Background playback is enabled at runtime through `expo-audio`’s `setAudioModeAsync` configuration.

## Testing & Linting
- Component tests live in `components/radio/__tests__` and use Jest + Testing Library, with helpers under `test/test-utils.tsx`.
- Run `npm run lint` and `npm test -- --runInBand` locally; CI enforces both.

## Expectations for Future Work
- Maintain the single source of truth: update context/types first, then screens.
- Prefer extending `lib/radio-browser.ts` for new API calls.
- Keep AsyncStorage data shape compatible or migrate carefully.
- When you add features or restructure flows, revise this `PROMPT.md` so the next agent isn’t lost.

Happy coding—and remember to keep this file up to date! 💫
