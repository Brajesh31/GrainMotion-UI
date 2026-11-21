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

`tools/test.mjs` now loads all fifty controls in a mobile-sized Chromium viewport. Forty-five controls are already CI-verified; the five Phase 9 additions are awaiting the next full run. The latest 45-component GitHub Actions run passed **206 browser assertions with zero failures**, including 27 targeted Phase 7 checks and 26 targeted Phase 8 checks. Standalone bundle synchronization and generated documentation checks passed in the same run, and the corresponding GitHub Pages deployment succeeded. [Validation run](https://github.com/Brajesh31/GrainMotion-UI/actions/runs/44873818303) · [Pages deployment](https://github.com/Brajesh31/GrainMotion-UI/actions/runs/44873818321). Manual screen-reader, physical-device, Safari and Firefox testing remains outstanding. The original-control checks cover:

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
- Regression: all original four tests must continue to pass with all twenty-four scripts loaded together.

The Phase 2, Phase 3 and Phase 4 checks in the passing test runner cover:

- Text Field: real native input value updates, accessible name, and native email validity.
- Textarea: multiline value retention and rows configuration.
- Password Field: masked default, Show/Hide state and value retention. Assertions inspect booleans or lengths only, never print the password.
- Search Field: bubbling search event, busy/aria-busy state, clear behavior and search-clear event.
- OTP/PIN: non-digit sanitation, configured maximum length, one-time-code autocomplete, numeric input mode and a completion event that does not expose the code.
- Phase 2 form serialization: all five fields submit their configured values. The test returns a boolean and does not log password or OTP contents.
- Phase 3 Select: native option value, selected label, required-empty validity and form submission.
- Phase 3 Combobox: datalist connection, exact suggestion selection event and unrestricted free text.
- Phase 3 Date Picker: ISO date value, min/max attributes, unavailable-date custom validity and allowed-date recovery.
- Phase 3 Date Range: ISO start/end serialization, end-before-start validation, unavailable endpoint and required-both-endpoints behavior.
- Phase 3 Time Picker: timezone-free HH:MM value, explicit 12/24-hour readout, and native min/max/step constraints.
- Phase 3 form serialization: Select, Combobox, Date Picker, Date Range and Time Picker are included with the earlier twelve controls.
- Phase 4 Progress Bar: determinate value, max clamping, progressbar semantics and indeterminate aria-valuenow removal.
- Phase 4 Progress Ring: determinate value and indeterminate accessibility semantics.
- Phase 4 Step Indicator: native step button selection, aria-current, change event and disabled state.
- Phase 4 Hourglass Timer: start, pause, resume, reset, cancel, completion event and form value.
- Phase 4 Loading Indicator: status role, aria-busy, active/inactive state and configurable speed.
- Phase 4 form serialization: Step Indicator and Hourglass Timer join the earlier form-associated controls.
- Phase 5 Tabs: tablist/tab/tabpanel roles, panel visibility, change detail, manual activation and disabled-tab state.
- Phase 5 Accordion: native disclosure state, panel labelling, single/multiple-open behavior and disabled items.
- Phase 5 Pagination: named navigation, aria-current, page clamping, total reduction and disabled navigation.
- Phase 5 Breadcrumbs: ancestor links, current-page state, structured property updates and unsafe URL scheme rejection.
- Phase 5 Menu: menu-button semantics, open state, disabled commands, select event, Escape/focus restoration and outside-pointer dismissal.
- Phase 6 Dropzone: accepted/rejected MIME types and file sizes, host events, clearing and disabled picker state.
- Phase 6 Upload Queue: queued file registration, host progress updates, cancellation, retry and clearing.
- Phase 6 Carousel and Lightbox: safe image sources, accessible labels, index changes, native modal behavior, focus restoration and reconnect handling.
- Phase 6 Media Scrubber and Color Picker: media binding/seeking/buffered state and color normalization, format readout, swatches and disabled state.
- Phase 7 Sortable List: stable-ID reordering, keyboard movement, order events and disabled behavior.
- Phase 7 Transfer List: multi-selection, transfer events, move-all and disabled state.
- Phase 7 Split Pane: separator semantics, orientation, keyboard resize, input event and min/max clamping.
- Phase 7 Resizable Panels: panel/separator rendering, adjacent size conservation, keyboard resize, change event and disabled state.
- Phase 7 Tree View: valid roving entry point, nested levels, selection events, visible-node collapse/expand, arrow-key navigation and disabled state.


### Phase 8 feedback and overlay coverage

- Tooltip: pointer/focus description association, preserved `aria-describedby` tokens, Escape dismissal, disabled behavior and viewport-edge placement flip.
- Toast Notification: polite status versus assertive alert roles, action-before-dismiss event ordering, multi-toast corner stacking, live repositioning and hover timer pause.
- Alert Banner: tone-aware live regions, separate action/dismiss events and programmatic restore of a persistent alert.
- Dialog / Modal: native modal top-layer semantics, caller-content preservation, focus containment, confirm/close return values, Escape and opt-in backdrop close.
- Drawer / Sheet: native modal focus behavior, four-edge placement and bounded sizing, Escape/focus restoration, optional action and backdrop dismissal.



### Phase 9 productivity and composite coverage (new, validation pending)

The test runner now contains 30 targeted Phase 9 checks. They are committed but should not be described as passing until the 50-component Actions run completes.

- Command Palette: native modal open/focus, label/description/keyword filtering, Arrow navigation, Enter selection event, close reason, Escape and disabled trigger.
- Context Menu: menu role and initial focus, keyboard navigation that skips disabled actions, selection payload, Escape cleanup and disabled opening.
- Filter Builder: field/operator/value conditions, query serialization, condition edits, add/remove/clear, apply/reset events and disabled controls.
- Data Table: semantic headers, bounded pagination, ascending/descending stable sort, aria-sort, filtering, selection across pages, select-visible and disabled controls.
- Kanban Board: stable card/column rendering, same-column order, cross-column move detail, ArrowRight movement and disabled drag/button state.

The remaining test layers still require manual checks on physical touch devices, Safari and Firefox, and with named screen-reader/browser combinations.

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


## Phase 5 verification result

The 29-component GitHub Actions mobile Chromium suite passed 125 browser assertions with zero failures. The 45 Phase 5 checks exercise all five navigation components and their principal state, keyboard, dynamic update and responsive behavior. Manual screen-reader and physical-device testing remains outstanding.
