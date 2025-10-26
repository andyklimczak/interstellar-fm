# Interstellar FM Privacy Policy

_Last updated: October 26, 2025_

Interstellar FM (“we”, “our”, “us”) is an open-source radio streaming application built with Expo. This Privacy Policy explains what information we collect, how we use it, and the choices you have. Because Interstellar FM is distributed through app stores, this statement is intended to satisfy the privacy disclosure requirements for Apple’s App Store, Google Play, and other storefronts where the app may be published.

## 1. Information We Collect

Interstellar FM does **not** collect personally identifiable information, analytics data, or usage telemetry.

The only information stored by the app is:

- **Saved stations** – When you mark a station as saved, we store that station’s metadata locally on your device. This information never leaves your device.
- **Recent stations** – The stations you have recently listened to are cached locally to provide a quick history. This history is also stored only on your device.
- **Volume preference** – Your most recent volume level is persisted locally so playback resumes at the same level.

All three data points are stored using Expo’s `AsyncStorage` (React Native’s local key-value storage) and are not transmitted to us.

## 2. Streaming Data

When you play a radio station, the app connects directly to the public streaming URL provided by the station. Audio streams are delivered from the station’s servers, not ours. The app also optionally notifies the [Radio Browser](https://api.radio-browser.info/) directory that a stream was played (to update global click counts). This request includes the station identifier only; no personal data is attached.

Please review the privacy policies of any stations you choose to listen to, as their streams may involve third-party services beyond our control.

## 3. Permission Usage

Interstellar FM requests the following permissions strictly to support playback:

- **Background audio / foreground service** – Allows you to keep listening while the app runs in the background. No additional data is collected when this permission is granted.

No other sensitive permissions (location, contacts, microphone recording, camera, etc.) are requested or used.

## 4. How We Use Information

Because all saved data stays on your device, we do not have access to it. The app reads and writes station metadata, history, and volume from local storage to provide the saved and recent lists along with a consistent playback experience. We do not sell, trade, or share any information with third parties.

## 5. Data Retention and Control

- You can remove saved stations or clear recent history directly within the app (by unfavoriting a station or clearing app storage in your device settings).
- Uninstalling the app deletes all stored data.

## 6. Children’s Privacy

Interstellar FM is intended for general audiences and does not knowingly collect personal information from children under 13. Because no personal data is collected, there is no information to delete or disclose.

## 7. Updates to This Policy

We may update this Privacy Policy to reflect app changes or legal requirements. When we do, we will revise the “Last updated” date above. Significant changes will be noted in the project repository and app release notes when applicable.

## 8. Contact Us

If you have questions about this Privacy Policy or the app, please contact the maintainer at:

`andyklimczak@fastmail.com`

Alternatively, you can open an issue in the project’s GitHub repository.
