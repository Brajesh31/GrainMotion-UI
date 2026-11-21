# IMPORTANT: GrainMotion-UI Project Instructions for ChatGPT and AI Coding Agents

> **Read this file before doing any work in this repository.**
>
> This file is the persistent handover for new ChatGPT conversations and other AI coding sessions. A previous chat may have ended because of conversation limits. Do not assume that chat history is available. Use the repository as the source of truth.

## 1. Mandatory repository workflow

**EDIT THE EXISTING REPOSITORY DIRECTLY. DO NOT CREATE A PULL REQUEST.**

These instructions are mandatory:

1. Work in the existing repository: [Brajesh31/GrainMotion-UI](https://github.com/Brajesh31/GrainMotion-UI).
2. Make changes directly on the existing `main` branch.
3. **Do not create a new branch.**
4. **Do not create, open or use a pull request.**
5. **Do not fork, duplicate or recreate the repository.**
6. Commit completed changes directly to `main`.
7. Never force-push or overwrite unrelated changes. Read the current `main` commit before writing and use a non-force, expected-head update. If the branch has moved, refresh and reconcile rather than overwriting it.
8. If direct editing of `main` is unavailable, stop and clearly report the limitation. Do not silently switch to a branch or PR workflow.
9. After editing, verify the exact files and commit on GitHub. Do not claim a change was made until GitHub confirms it.
10. Keep the user informed of what changed, what was tested, and what remains broken.

The user's explicit instruction is: **"No PR. No new branch. Directly edit the existing files in the repository and commit the changes to main."**

## 2. Work one phase at a time

- Complete only the phase the user has asked to proceed with.
- Do not automatically start the next phase after finishing one.
- Do not add more components while existing components are broken.
- Do not mark a phase complete because its files exist. Use its exit criteria and actual test evidence.
- Preserve the four original components as the design and behavior reference.
- Keep public APIs and standalone usage working unless an intentional change is documented.
- Prefer fixing the underlying issue over weakening, skipping or deleting a failing test.
- Do not mark tests as passed when they have not run.
- Do not claim universal browser, accessibility, security or performance support without evidence.
- Do not ask the user to repeat information already recorded in this file or the linked project documentation.

## 3. Project goal

Bring GrainMotion-UI to a genuine public-library release standard, using [VFX UI Anime](https://github.com/Brajesh31/vfx-ui-anime) as a reference for release discipline and package quality.

The expected end state includes:

- All 50 components working, visually consistent and individually audited.
- The original four restored to the intended quality and behavior.
- A reliable shared sand-rendering core and predictable component lifecycle.
- Complete technical documentation for every component, API, asset, skill and core system.
- A maintainable npm package that developers can install with `npm install grainmotion-ui` (the package name and publication must be verified before use).
- Aggregate and per-component imports, generated bundles, package exports and clean-consumer smoke tests.
- An installable gallery and accurate component catalogue.
- Automated and manual accessibility, responsive, browser and performance verification.
- Security review, dependency/source scanning, safe DOM handling, responsible disclosure and publishing provenance.
- Reproducible CI, versioning, changelog, release notes, npm publishing and GitHub releases.

The npm command above is the desired experience, not a claim that the package is already published.

## 4. Current verified handover

**Repository:** `Brajesh31/GrainMotion-UI`  
**Primary branch:** `main`  
**Last recorded Phase 0 handover commit:** `8a6c94d534c3d300bbff145e1d5bf5439504c3ef`  
**Last recorded full validation run:** [GitHub Actions #502](https://github.com/Brajesh31/GrainMotion-UI/actions/runs/44883655931)  
**Phase 0:** Foundation work complete.  
**Next active task:** Phase 1, restore and verify the original four components.  
**Phase 1 status:** Not started.

At the Phase 0 audit, the repository contained:

- 50 component folders.
- A standalone JavaScript source file, README and demo page in every component folder.
- `core.js` as the shared sand engine source.
- `tools/build.mjs` for generating standalone component bundles.
- `tools/spec.mjs` as component metadata/specification input.
- `tools/docs.mjs` for generated documentation/catalogue/registry outputs.
- `tools/test.mjs` for browser validation.
- `skills/grainmotion-ui/SKILL.md` and related skill resources.
- No root npm package manifest or complete npm publishing workflow at the Phase 0 baseline.

### Phase 0 deliverables

- `docs/PHASE-0-FOUNDATION-AUDIT.md`
- `docs/COMPONENT-CONTRACT.md`
- `design/tokens.css`
- `design/README.md`
- `tools/audit.mjs`
- Updated repository README, architecture, design-system and roadmap documentation.
- Structural audit wired into `.github/workflows/component-tests.yml`.

The provisional token stylesheet is not yet consumed by the legacy component scripts. Do not imply that adding the file changed the existing component visuals.

### Latest recorded test evidence

In GitHub Actions run #502:

- Standalone bundle synchronization passed.
- Generated documentation and registry validation passed.
- The new structural inventory/assets/registry audit passed.
- The full 50-component mobile Chromium test step failed.

The latest recorded browser run reported **228 passing assertions and 11 failing assertions**. Failures recorded in that run:

1. Tooltip: keyboard focus does not open the hint as expected.
2. Tooltip: Escape does not dismiss the hint while preserving trigger focus.
3. Toast: info/success notifications do not pass the polite status announcement check.
4. Alert: info status-region announcement check failed.
5. Alert: error alert-region announcement check failed.
6. Dialog: native modal top-layer/content check failed.
7. Dialog: initial focus containment check failed.
8. Dialog: confirm action/close/focus restoration check failed.
9. Drawer: Escape close/focus-return check failed.
10. Context Menu: named menu/initial focus check failed.
11. Context Menu: arrow navigation skips enabled/disabled items incorrectly.

These are the latest recorded test results, not a guarantee that the failures persist identically on every run. Re-run the suite from the latest `main` before acting on them. Do not hide or waive the failures. Diagnose the current source, fix the real cause and retain meaningful tests.

The original four had passing limited automated checks in the earlier baseline. This is not a visual sign-off and does not override the user's report that they are not working/rendering as intended.

## 5. Active release-recovery phase plan

This is the **active release-hardening plan**. It is separate from the historical component-expansion phases in `docs/ROADMAP.md`. Do not confuse the two numbering systems.

| Active phase | Scope | Exit requirement |
|---|---|---|
| 0 | Foundation inventory, architecture, contract, provisional tokens and structural audit | Completed; foundation artifacts committed and structural audit passed |
| 1 | Restore original four: Slider, Toggle, Signature and Thinking | Each matches the approved visual reference, works across input methods, has focused tests and passes original-four regression |
| 2 | Shared core engine and rendering lifecycle | Correct simulation, WebGL fallback/context handling, resize/disconnect/reconnect, resource cleanup and sound lifecycle |
| 3 | Components 5-9, selection controls | All five audited and individually verified |
| 4 | Components 10-14, text and structured inputs | All five audited and individually verified |
| 5 | Components 15-19, date/time and selection | All five audited and individually verified |
| 6 | Components 20-24, progress/loading | All five audited and individually verified |
| 7 | Components 25-29, navigation | All five audited and individually verified |
| 8 | Components 30-35, media/files | All six audited and individually verified |
| 9 | Components 36-40, list/layout | All five audited and individually verified |
| 10 | Components 41-45, feedback/overlays | All five audited and individually verified |
| 11 | Components 46-50, productivity/composite | All five audited and individually verified |
| 12 | Gallery, catalogue and all demos | Every card, route, preview, search/filter and responsive layout verified |
| 13 | Full documentation and skills | Every component, API, asset, core runtime, skill and troubleshooting document complete and accurate |
| 14 | npm package and developer integration | Aggregate/per-component exports, package allowlist, clean-consumer installation and smoke tests pass |
| 15 | Security and dependency hardening | Security review complete; findings fixed or explicitly assessed; workflow permissions and provenance checked |
| 16 | Cross-browser/accessibility/performance QA | Supported browser/device matrix, keyboard, screen reader, reduced motion and performance evidence recorded |
| 17 | Release automation | CI, versioning, changelog, npm publish and GitHub release workflow verified |
| 18 | Release candidate | Full suite passes; packed tarball tested in a clean consumer; no release blockers |
| 19 | Public release | Verified npm package, matching GitHub release and deployed gallery |

Only one active phase should be implemented per user request. The phase plan can be refined as evidence emerges, but do not skip or silently close phases.

## 6. Phase 1 instructions: original four restoration

When the user says to proceed with Phase 1, work only on:

- `slider/slider.js`, `slider/README.md`, `slider/index.html`
- `toggle/toggle.js`, `toggle/README.md`, `toggle/index.html`
- `signature/signature.js`, `signature/README.md`, `signature/index.html`
- `thinking/thinking.js`, `thinking/README.md`, `thinking/index.html`
- Related original-four assets and test coverage only where required.

Read the source specification and build tooling first. The four standalone component bundles contain a generated/stamped shared-core block. **Edit `core.js` as the shared-core source, not the stamped copy inside a component file.** If `core.js` changes, regenerate bundles with `node tools/build.mjs` and check them with `node tools/build.mjs --check`.

Phase 1 must:

1. Establish real visual references from the intended original design and current live output. Distinguish concept art from screenshots of a running component.
2. Inspect the actual components and their demos. Identify the mismatch before changing code.
3. Restore the signature physical interaction and original design language. Do not replace the sand controls with generic flat HTML widgets just to make a test pass.
4. Verify each component's actual value/state and public API.
5. Verify mouse, pointer, touch and keyboard paths appropriate to each component.
6. Verify sound and mute behavior without making sound necessary for use.
7. Check resizing, narrow layouts, repeated mount/unmount and reconnection.
8. Respect reduced-motion settings and provide a useful visual/semantic fallback if WebGL2 is unavailable.
9. Add deterministic regression tests for the original four.
10. Run bundle synchronization, docs checks, the structural audit and original-four browser tests. Run the full 50-component suite when shared engine behavior is changed.
11. Update component guides and this handover file with the evidence and remaining issues.

Do not begin components 5-50 in Phase 1. Do not start Phase 2 until Phase 1 has been verified and the user asks to continue.

## 7. Required checks and honest reporting

At minimum, inspect and run the scripts that exist in the repository:

```bash
node tools/build.mjs --check
node tools/docs.mjs --check
node tools/audit.mjs
```

The browser test workflow runs the full 50-component mobile Chromium suite. Follow the current workflow definition rather than assuming a command or test result.

For every phase report:

- Files changed and direct commit on `main`.
- Exact GitHub commit SHA.
- Commands/checks executed and actual results.
- Test failures with component and assertion names.
- Remaining known limitations.
- Whether the phase exit criteria are met.
- Which phase is next, without starting it automatically.

Never describe a structural audit as a functional test. Never describe a successful GitHub Pages deployment as proof that the components work.

## 8. Persistent status maintenance

At the end of every completed phase:

1. Update this file's **Current verified handover** and active phase statuses.
2. Update the relevant audit/report and `docs/ROADMAP.md` without deleting older evidence that is still useful.
3. Keep component documentation accurate.
4. Commit all related documentation updates directly to `main`.
5. Verify the committed content on GitHub.

Keep the latest known CI run number, commit SHA, pass/fail count, failure names and links here so another conversation can resume without relying on chat history.

## 9. Copy/paste prompt for a new ChatGPT conversation

Use this prompt when opening a new chat:

> Continue the existing GrainMotion-UI project. First read the root `AGENTS.md` file and follow it as the source of truth. Also inspect the current `main` branch, `docs/ROADMAP.md`, and the latest GitHub Actions results before changing anything. **Do not create a branch, pull request, fork or duplicate repository. Directly edit the existing files on `main` and commit there.** Work on one active release-recovery phase at a time. The last recorded state is Phase 0 complete and Phase 1, restoring the original four components, not started. Verify current status before proceeding. Do not start the next phase automatically.
