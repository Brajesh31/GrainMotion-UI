# Browser and Platform Support

## Current verified scope

The repository's current component documentation says its automated interaction checks were run in headless Chromium with real touch and keyboard events, using CPU throttling in the visual inspection workflow.

The existing notes explicitly say the project has not yet been broadly tested in:

- Safari.
- Firefox.
- Real mobile devices.
- Screen readers and a wider assistive-technology matrix.

Do not interpret the use of standards-based custom elements, pointer events or WebGL2 as proof that every browser/version is supported.

## Capability requirements

| Capability | Why it matters | Fallback expectation |
|---|---|---|
| Custom Elements | Registers `sand-*` elements | Explain unsupported browser behavior or provide a plain HTML fallback |
| WebGL2 | Draws the sand surface | Preserve usable semantics and provide a non-WebGL presentation |
| Pointer Events | Unified pointer/touch/mouse interaction | Do not silently lose basic interaction |
| Web Audio API | Plays interaction sounds | Controls must remain usable when audio is unavailable or muted |
| Canvas 2D | Draws overlay sprites and signatures | Explain reduced visual behavior if unavailable |

## Required browser matrix for expansion

Before claiming support for a browser, test the actual built component there.

| Browser / platform | Current status | Required future verification |
|---|---|---|
| Chromium desktop | Automated headless tests documented | Manual desktop interaction and visual review |
| Chrome Android | Not verified on a physical device | Touch, scrolling, audio and performance |
| Safari macOS | Not verified | WebGL2, custom elements, pointer behavior and audio |
| Safari iOS | Not verified | Touch, viewport behavior, audio unlock and performance |
| Firefox desktop | Not verified | WebGL2, pointer and custom-element behavior |
| Firefox Android | Not verified | Touch and mobile performance |
| Screen readers | Not verified broadly | Named browser/AT combinations and critical workflows |

## Reporting policy

- Record exact browser versions and dates.
- Separate automated headless results from manual device results.
- Mark untested combinations as **Not tested**.
- Do not use badges claiming universal support without a maintained test matrix.
- Document browser-specific limitations in the affected component README.
