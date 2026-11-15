# One-tap YouTube playback: evidence and open questions

Last updated: 2026-11-15. This note records why the component has three playback modes and which browser decisions still need testing. A **report** below is a person's observation in an issue or PR; a **device test** is a comparison performed with a real tap in this investigation. Neither establishes behavior for every browser version.

## Current implementation on `safari-preloaded-iframe`

The mode is selected in [`connectedCallback`](src/lite-yt-embed.js). The browser check is a heuristic, not a guarantee about playback capability.

| Mode | Default selection | What happens on tap |
| --- | --- | --- |
| `basic` | Browsers outside the following checks, including desktop Chrome | Create a YouTube iframe with `autoplay=1` after the tap. |
| `api` | Apple browsers other than detected mobile Safari, or a user agent containing `Mobi`; also explicit `js-api` outside mobile Safari | Load the YouTube IFrame Player API, create its iframe after the tap, and call `playVideo()` on player readiness. |
| `prepared` | Detected iPhone/iPad Safari: Apple vendor, no `CriOS`/`FxiOS`/`EdgiOS`, and an `iP…` platform or touch-capable `MacIntel` | Load a YouTube iframe and the API before the tap, keep the poster inert until `onReady`, then call `playVideo()` on the already loaded player. |

`prepared` is an API-based mode, so “API versus prepared” is a timing distinction, not a choice between using and avoiding the API. If preparation fails or times out, the component removes the early iframe and falls back to `basic`, or `api` when `js-api` was requested. The public `getYTPlayer()` / `js-api` use case remains separate from automatic browser compatibility; see [`src/lite-yt-embed.js`](src/lite-yt-embed.js) and the [`js-api` documentation](README.md#access-to-the-youtube-iframe-player-api). The early iframe loads YouTube before any interaction on mobile Safari, with loading and privacy costs described in the [README](README.md#one-tap-playback-in-safari-on-iphone-and-ipad).

## Historical evidence

| Date | Source and evidence | What it supports, and its limit |
| --- | --- | --- |
| 2019–2020 | [Issue #6](https://github.com/paulirish/lite-youtube-embed/issues/6) records intermittent mobile double taps, a Pixel 3 / Android 9 Chrome tester who saw the problem consistently, and a Kiwi Browser on Android report. [Issue #53](https://github.com/paulirish/lite-youtube-embed/issues/53) reports a first-tap failure on Android 10 Chrome. | The original basic path did fail on some older Android setups. These are reports, not a current Android compatibility matrix. |
| 2021 | In [PR #90](https://github.com/paulirish/lite-youtube-embed/pull/90), a tester reported that the API workaround helped macOS Safari but still needed two taps on iPadOS Safari. [PR #109](https://github.com/paulirish/lite-youtube-embed/pull/109) discusses reported first-tap success on desktop Safari and Chrome mobile with the API path, while noting iPadOS Safari remained an exception. | This is the historical reason to retain the API path on desktop Safari and mobile browsers. It does not show that current desktop Safari still needs it. |
| 2022 | [Issue #119](https://github.com/paulirish/lite-youtube-embed/issues/119) reports two clicks in Safari 15.3. Commit [`185af94`](https://github.com/paulirish/lite-youtube-embed/commit/185af94635e47f14334d6660888b8f474a60301e) added Android to the API browser check; [`1f885c2`](https://github.com/paulirish/lite-youtube-embed/commit/1f885c23c51bde033cd9fc33c12ff431be0c2640) changed the check to Apple vendor or `Mobi`. | The broad `Mobi` rule grew from real playback reports, but the commit is a policy change, not independent proof that every mobile browser needs the API. |
| 2023–2024 | The [`ios` branch notes](https://github.com/paulirish/lite-youtube-embed/blob/ios/ios-autoplay.md) trace WebKit media gesture handling and record a desktop Safari experiment where a plain video in an existing frame played with a delay under one second. The [`ios-mute` branch](https://github.com/paulirish/lite-youtube-embed/commit/63db2dc) explored muted playback. | These are useful mechanism and workaround investigations, but a plain HTML video and a YouTube embed are different tests. Muting does not meet the goal of audible one-tap playback. |
| 2025 | [Issue #200](https://github.com/paulirish/lite-youtube-embed/issues/200) reports API-path failures on modern Android Chrome and Firefox and says a static iframe works. | Evidence that the broad mobile API rule can cause trouble. A static iframe does not establish that a *tap-created* `basic` iframe works on those devices. |

## Device tests in this investigation (2026-11)

Before the update to iPadOS 26.7.3, the iPad experiments found that an iframe element present before the tap was insufficient when its YouTube document loaded after the tap; only a YouTube document already loaded before the tap played with sound in that four-case comparison. The earlier OS version was recalled as possibly 17.3.1, but was not confirmed. Earlier API-only successes proved intermittent on repetition. These findings prompted the [prepared-mode implementation](src/lite-yt-embed.js). The raw harness and logs remain local research files; they are not part of this branch.

After the iPad was updated to **iPadOS 26.7.3**, real-tap comparisons in this session produced these user-observed results:

| Device/browser | Path tested | Result |
| --- | --- | --- |
| iPad Safari 26.7.3 | Forced `basic` | Reached YouTube's play button; no audible start from one poster tap. |
| iPad Safari 26.7.3 | Forced `api` (iframe made after tap) | Reached YouTube's play button; no audible start from one poster tap. |
| iPad Safari 26.7.3 | Current `prepared` path | Played with sound from one poster tap; also succeeded on repeated fresh-page checks earlier in the session. |
| Pixel Android Chrome, current version not recorded | Default `api` | Played with sound from one poster tap. |
| Same Pixel Android Chrome | Forced `basic` | Played with sound from one poster tap. |
| Desktop Safari on macOS, versions not yet recorded | Forced `basic` | Stopped at YouTube's play button after one poster click; no autoplay. |
| Same desktop Safari | Forced `api` | Played with sound from one poster click. |
| Same desktop Safari | Forced `prepared` | Played with sound from one poster click. |
| Same desktop Safari | Current default (`api`) | Played with sound from one poster click. |

These are physical-device observations reported by the testers rather than measured with in-frame media instrumentation. The Pixel comparison shows that `basic` *can* work on this phone; one phone does not overturn older Android failure reports. The desktop Safari comparison supports keeping `api` as that browser's default: it succeeded where `basic` failed, while `prepared` also succeeded but loaded YouTube before the click. It does not establish behavior for every Safari version. Desktop Chrome selected `basic` in a local check, but audible playback was not independently verified in this round. No contemporary iPhone Safari A/B test has been completed. The [WebKit change](https://github.com/WebKit/WebKit/commit/21a364afcaee057528c71ae022e8140e5882c414) discussed during the pre-update iPad experiments is consistent with a cross-origin gesture propagation problem, but it does not prove the precise cause on either tested iPadOS version.

## Next decisions and tests

1. Keep `api` as the desktop Safari default based on the comparison above. If revisiting that default, repeat [`testpage/autoplay-modes.html`](testpage/autoplay-modes.html) on other Safari versions and record the versions. The [hosted comparison page](https://paulirish.github.io/lite-youtube-embed/testpage/autoplay-modes.html) uses pinned snapshots of this branch's JavaScript and CSS in `testpage/autoplay-candidate.*`, so its results do not change if `master`'s library files change.
2. Repeat `basic` versus `api` on more current Android devices and browsers, especially Firefox, and capture failures as well as successes. The Pixel result and [issue #200](https://github.com/paulirish/lite-youtube-embed/issues/200) make the broad `Mobi` default worth revisiting.
3. Test current iPhone Safari with `basic`, `api`, and `prepared`. The current prepared check covers iPhone, but this investigation directly verified an iPad only.
4. When changing a default, distinguish the playback result from the cost of preparation: `prepared` starts loading YouTube before a visitor chooses to play, whereas `basic` and `api` defer that work until interaction. Keep the documented `js-api` contract even if a browser no longer selects `api` automatically. See [`src/lite-yt-embed.js`](src/lite-yt-embed.js) and the [README](README.md#one-tap-playback-in-safari-on-iphone-and-ipad).
