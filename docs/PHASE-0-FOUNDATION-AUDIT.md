# Phase 0 Foundation Audit

**Audit date:** 2026-11-21  
**Repository:** [Brajesh31/GrainMotion-UI](https://github.com/Brajesh31/GrainMotion-UI)  
**Audited branch:** `main`  
**Baseline commit:** `901599d9106143d87f8cb2eb32be9e576a390b1a`  
**Phase 0 implementation commit:** `68ec65ab2103053a6e2e62e857a098edc6c39bcc`  
**Phase status:** Foundation work complete. The repository as a whole is not release-ready.

## Scope

Phase 0 establishes the project inventory, architecture baseline, shared design tokens, component contract, automated structural audit and honest quality status. It does not repair component behavior or change the visual output of the existing controls. Those changes belong to the component phases and must be tested one phase at a time.

## Verified repository inventory

The audited Git tree contains **259 tracked file blobs** and **50 component folders**. The 50 IDs are declared in `tools/spec.mjs` and represented in the standalone build map in `tools/build.mjs`.

At the audited commit, each of the 50 component folders contains:

- A standalone JavaScript source file named after the folder.
- A component-level `README.md`.
- An `index.html` demo page.

The four original components are `slider`, `toggle`, `signature` and `thinking`. Their folders do not contain `assets/concept.svg`; this is not treated as a missing component requirement because they are the original reference implementations, not later concept-sheet additions.

The repository already contains a shared renderer in `core.js`, standalone bundle generation in `tools/build.mjs`, generated documentation/registry output in `tools/docs.mjs`, a component specification in `tools/spec.mjs`, a browser test runner in `tools/test.mjs`, and the GrainMotion skill at `skills/grainmotion-ui/SKILL.md`.

## Current architecture

- Components are browser-native custom elements with the `sand-` prefix.
- A component can be loaded as a standalone script. The shared core, required sound data and component-specific art are stamped into its source bundle.
- `core.js` is the source of truth for the shared sand engine. Do not edit the stamped copy inside a component file directly.
- The first loaded component initializes `window.GrainMotionUI`; later component bundles reuse that global.
- Sand rendering uses WebGL2. Overlay drawing uses Canvas 2D. Audio uses Web Audio where available.
- `tools/spec.mjs` is the metadata source for component descriptions and generated docs/registry data. Some full technical READMEs and demos are deliberately hand-maintained.
- The current repository is a static gallery and standalone-script collection. It does **not** yet have an npm package manifest, package lockfile, aggregate package entry point or npm publishing workflow.

## Latest automated quality baseline

The latest full component-validation run after Phase 0 changes is [GitHub Actions run #498](https://github.com/Brajesh31/GrainMotion-UI/actions/runs/44883477540) on commit `68ec65ab2103053a6e2e62e857a098edc6c39bcc`.

| Check | Result |
|---|---|
| `node tools/build.mjs --check` | Passed |
| `node tools/docs.mjs --check` | Passed |
| 50-component mobile Chromium suite | 235 assertions passed, 4 failed |
| Structural component/asset/registry audit | Passed |
| GitHub Pages deployment for the Phase 0 commit | Pending at the time of this update |

### Known failures in the latest browser run

1. Tooltip: keyboard focus should open the hint without moving focus.
2. Tooltip: Escape should dismiss the hint while leaving trigger focus unchanged.
3. Toast: informational and success notifications should announce through a polite live region.
4. Context Menu: touch long-press should open the menu at the press point.

These are confirmed failures in the latest recorded run. They are not silently waived. They must be fixed in the corresponding component audit phase and rechecked in the full 50-component suite.

### What the current original-four checks prove

In that same browser run, the current automated checks passed for:

- **Slider:** horizontal drag, vertical-swipe rejection, focus, ArrowLeft step behavior and Home-to-minimum.
- **Toggle:** tap, Space-key toggling and vertical-swipe rejection.
- **Signature:** pointer stroke, PNG export and Backspace undo.
- **Thinking:** the `searching` and `idle` accessible state labels.

This is a limited automated interaction baseline only. It does not prove the four components visually match the intended original designs, look correct on physical devices, behave well with reduced motion, or pass screen-reader testing. The user-reported visual and functional defects remain open for Phase 1.

## Confirmed gaps and risks

| Area | Current evidence | Required work |
|---|---|---|
| Visual fidelity | Existing concepts and descriptive docs exist, but the original-four visual regression baseline is not yet signed off | Capture approved reference screenshots and compare all interaction states during Phase 1 |
| WebGL fallback | Component docs state WebGL2 is required to draw sand; fallback is not a tested release guarantee | Implement and test a visible, usable non-WebGL presentation |
| Reduced motion | Existing component docs explicitly state sand movement continues with `prefers-reduced-motion` | Respect the preference without hiding state or removing functionality |
| Context lifecycle | Core creates a WebGL2 context and uses a `ResizeObserver`; complete disconnect/context-loss recovery is not evidenced by current CI | Test mount, resize, hide, disconnect, reconnect, context loss and cleanup |
| Renderer budget | Current docs warn that each element owns a WebGL canvas and that browser context budgets are limited | Profile and implement a deliberate renderer/lazy-activation budget |
| Browser coverage | Automated CI runs headless Chromium | Add Firefox, Safari where available, physical device and assistive-technology verification |
| Package distribution | No root `package.json`, lockfile, `index.js` or npm publication workflow exists | Build and smoke-test the package in the package phase |
| Security policy | No root `SECURITY.md` exists at the audited commit | Add responsible disclosure and repository security controls in the security phase |
| Contribution policy | `docs/CONTRIBUTING.md` exists; root `CONTRIBUTING.md` is not present | Decide and add the root contributor entry point during release infrastructure work |
| Release metadata | No versioned npm release process exists | Add SemVer, changelog, tarball allowlist, provenance and release gates |

## Phase 0 foundation deliverables

| Deliverable | Location | State |
|---|---|---|
| Repository architecture | [ARCHITECTURE.md](ARCHITECTURE.md) | Updated for 50 components |
| Component contract | [COMPONENT-CONTRACT.md](COMPONENT-CONTRACT.md) | Added |
| Design token source | [../design/tokens.css](../design/tokens.css) | Added, provisional and not yet consumed by current bundles |
| Token usage guidance | [../design/README.md](../design/README.md) | Added |
| Structural and asset audit | [../tools/audit.mjs](../tools/audit.mjs) | Added and passed in run #498 |
| CI audit gate | [../.github/workflows/component-tests.yml](../.github/workflows/component-tests.yml) | Added and passed in run #498 |
| Current blocker register | This document | Added |
| Component-by-component repair | Phases 1–11 | Not started in Phase 0 |

## Phase 0 exit criteria

Phase 0 may be marked complete only when:

- `node tools/build.mjs --check` passes.
- `node tools/docs.mjs --check` passes.
- `node tools/audit.mjs` passes on the same commit in GitHub Actions. This gate passed in run #498.
- The component contract, architecture, design token source and current limitations are documented.
- The original-four automated interaction baseline is recorded. Visual screenshot baselines and their repair work are explicitly handed to Phase 1.
- No Phase 0 change intentionally altered component source or rendered behavior.

**Phase 0 is complete as a foundation phase.** It does not certify all component behavior. The full 50-component browser suite currently has four failures, and visual, accessibility, security, performance and cross-browser sign-off remain mandatory before release.
