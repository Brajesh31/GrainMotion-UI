# Testing Strategy

## Existing test setup

The repository currently includes:

- `tools/test.mjs`: browser automation using Chrome/Chromium remote debugging.
- `tools/shot.mjs`: screenshot and frame-capture helper.
- `skills/grainmotion-ui/look.mjs`: visual inspection and slowed-CPU timing utility described by the project skill.
- `tools/build.mjs --check`: verifies standalone component files are synchronized with the shared core and configured assets.
- `tools/docs.mjs --check`: verifies generated component documentation, demo pages, registry metadata and `llms.txt` match the specification.

Start a static server from the repository root:

```bash
python3 -m http.server 8000
```

In another terminal, run the existing checks:

```bash
node tools/build.mjs --check
node tools/docs.mjs --check
node tools/test.mjs http://localhost:8000/gallery/
```

The test and screenshot utilities require Chrome or Chromium. Set `CHROME` if the browser executable is not named `chromium`.

## Current test coverage

`tools/test.mjs` now includes checks for the original four controls and the five Phase 1 additions in a mobile-sized Chromium viewport. The updated suite has been committed, but a successful CI run is still required before the release can be called verified. The original-control checks cover:

- Slider drag, input/change events, vertical-swipe handling and keyboard increments.
- Toggle click, Space behavior, change events and vertical-swipe handling.
- Signature stroke creation, input event, PNG export and Backspace undo.
- Thinking state labels and busy/idle semantics.
- Original form-data submission for Slider and Toggle.

The Phase 1 checks added to the test runner cover:

- Checkbox: pointer toggle, Space/Enter, checked state, disabled state and form serialization.
- Radio Group: option selection, arrow-key navigation, selected radio state and form serialization.
- Segmented Control: active segment selection, arrow/Home/End/Space behavior and form serialization.
- Range Slider: lower/upper handle movement, keyboard steps, non-crossing bounds, input/change timing, touch scroll coexistence and `low,high` form serialization.
- Rating: pointer selection, Arrow/Home/End adjustments, accessible value text, disabled state and form serialization.
- Regression: all original four tests must continue to pass with all nine scripts loaded together.
- Component sizing.
- Horizontal overflow at the configured mobile viewport.
- Browser script exceptions.

This does not constitute comprehensive accessibility, browser compatibility, security or real-device testing. Passing the browser suite does not replace manual assistive-technology or physical-device testing.

## Test layers required for new components

### Unit / logic tests

- Default and invalid values.
- State transitions.
- Attribute/property reflection.
- Event ordering and event payloads.
- Reset, cleanup and re-connection.
- Boundary conditions and empty states.

### Interaction tests

- Mouse/pointer interaction.
- Touch and scroll coexistence.
- Drag start, movement, release and cancellation.
- Keyboard behavior.
- Disabled and read-only behavior.
- Rapid and repeated interactions.

### Form tests

Where applicable:

- FormData submission.
- Required and invalid states.
- Disabled controls.
- Reset behavior.
- Custom validation.
- Stable serialization format.

### Accessibility tests

- Accessible name and role.
- State/value announcements.
- Focus order and visibility.
- Keyboard-only workflows.
- Reduced motion.
- Automated accessibility checks.
- Manual screen-reader checks with browser and assistive technology named in results.

### Responsive and visual tests

- Narrow mobile widths.
- Tablet and desktop dimensions.
- High-DPI screens.
- Resize during interaction.
- No unintended horizontal overflow.
- Screenshots of initial, active, disabled, loading, error and completion states as applicable.

### Performance tests

- Cold initialization.
- Sustained animation.
- Input latency.
- Throttled CPU.
- Multiple mounted components.
- Hidden/offscreen suspension.
- Context cleanup and re-connection.

## Component acceptance report

Every component release should record:

- Browser name and version.
- Operating system/device or emulation profile.
- Viewport dimensions and device scale factor.
- Commands run.
- Number of tests passed and failed.
- Screenshot paths for visual states.
- Known issues and skipped tests.
- Whether the original four passed regression checks.

Never use a passing documentation-generation check as proof that component interactions work. Build consistency, functional tests, accessibility tests and visual review are separate checks.
