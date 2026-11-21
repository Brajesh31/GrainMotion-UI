# Accessibility Standards and Current Baseline

## Purpose

GrainMotion-UI uses unusual visual and tactile interactions. Those interactions must not prevent users from operating the underlying controls. Sand animation is supplementary. State, value and actions must remain available through semantic HTML and accessible APIs.

## Current implementation baseline

The following details are documented by the current component READMEs and source specification:

| Component | Current documented semantics/behavior | Known limitation |
|---|---|---|
| Slider | Slider role, value/minimum/maximum semantics, arrow keys, Page Up/Down, Home/End, visible focus styling in demo. | Broader real screen-reader and browser testing is not recorded. |
| Toggle | Switch role with `aria-checked`; click, Space and Enter behavior. | Broader real screen-reader and browser testing is not recorded. |
| Signature | Named form value as PNG data URL; Backspace undo and Delete clear. | Drawing itself requires a pointer; there is no documented keyboard drawing alternative. |
| Thinking | Status region; `aria-busy` while active and accessible state names. | Broader real screen-reader and browser testing is not recorded. |
| Checkbox | Checkbox role/state, accessible label, Space/Enter, form-associated value and focus treatment. | Screen-reader behavior and full keyboard/touch tests remain unverified. |
| Radio Group | Radiogroup with individual visually hidden radio buttons, arrow/Home/End/Space selection and accessible labels. | Options are capped at five in this version; screen-reader behavior remains unverified. |
| Segmented Control | Radiogroup with visually hidden radio buttons, keyboard selection and individual focus treatment. | Options are capped at five in this version; screen-reader behavior remains unverified. |
| Range Slider | Two visually hidden slider handles with independent values and keyboard controls; visible focus treatment on the matching rake. | Pointer/touch, screen-reader and range-boundary behavior still require runtime verification. |
| Rating | Slider role with value text, arrow/Home/End keys, disabled behavior and visible focus treatment. | Fixed zero-to-five scale; assistive-technology behavior remains unverified. |
| Text Field | A real native input with an accessible name, native editing, browser validation and form association. | Manual screen-reader/browser pairing and external-label patterns have not been verified. |
| Textarea | A real native textarea with multiline editing, paste, selection and internal scrolling. | Manual screen-reader/browser pairing remains unverified. |
| Password Field | A real native password input, masked by default, with a Show/Hide button and `aria-pressed` state. | Credential-manager/autofill behavior and manual screen-reader testing remain unverified. |
| Search Field | A native search input with Enter search event, clear action and `aria-busy` while pending. | Application owns result announcements; manual searchbox announcements remain unverified. |
| OTP / PIN Input | One native numeric text input, one-time-code autocomplete, paste sanitation and a complete event that exposes length only. | Separate digit fields are not used; manual autofill and screen-reader testing on mobile remain unverified. |
| Select / Dropdown | Native select with browser popup, accessible name, keyboard navigation and form-associated value. | Popup appearance varies by browser/platform; manual screen-reader verification remains required. |
| Combobox / Autocomplete | Native text input with datalist, free-text support and a custom exact-suggestion event. | Datalist popup and announcement behavior varies across browser/assistive-technology combinations. |
| Date Picker | Native date input with ISO calendar value, min/max and unavailable-day validation. | Individual unavailable dates are validated after selection, not visually disabled in the popup. Manual calendar keyboard/screen-reader testing remains required. |
| Date Range Picker | Two native date inputs with separate accessible names, range order validation and ISO start/end serialization. | Two calendar popups are native browser UI; manual focus order, required-range and screen-reader testing remains required. |
| Time Picker | Native time input, explicit 12/24-hour readout, min/max/step and timezone-free HH:MM value. | Native popup format is browser/OS locale controlled; the readout is explicit. Manual testing remains required. |
| Progress Bar | Progressbar role, min/max/current value and value text; indeterminate mode omits aria-valuenow. | Manual screen-reader announcement testing remains required. |
| Progress Ring | Progressbar role with the same determinate/indeterminate value semantics as Progress Bar. | Circular motion is decorative; manual screen-reader testing remains required. |
| Step Indicator | Group of native buttons with accessible step labels and aria-current=step for the active step. | Supports up to five steps; manual keyboard/screen-reader workflow testing remains required. |
| Hourglass Timer | Timer role, label, aria-valuetext, native pause/resume/reset/cancel buttons and completion event. | Live announcement frequency and timer use in background tabs require manual testing. |
| Loading Indicator | Status role, polite live region, accessible label and aria-busy reflecting activity. | Manual live-region announcement and reduced-motion testing remains required. |

The project documentation states that current tests run in headless Chromium and that real-device, Safari, Firefox and screen-reader testing has not been completed. See [Browser Support](BROWSER-SUPPORT.md).

### Phase 2 native text controls

Phase 2 deliberately layers actual browser-native inputs above the sand rendering. This preserves native typing, caret movement, selection, paste and built-in validation. The sand layer must never paint the entered text.

- **Password:** remains masked by default. The Show/Hide control has a changing accessible name and an `aria-pressed` state. Never include password values in logs, analytics or screenshots.
- **Search:** the search event requests work but does not create results. The integrating application is responsible for announcing result counts and errors. `aria-busy` only indicates that work is pending.
- **OTP/PIN:** one input is used across the visual digit wells to preserve mobile one-time-code autofill and paste. The `complete` event exposes the configured length, not the code. The application must handle the code securely.
- **Text Field and Textarea:** the accessible name is applied to the internal native control. The sand stylus is decorative focus feedback, not a substitute caret.

### Phase 3 selection, date and time controls

Phase 3 uses browser-native controls for all interactive selection. The sand renderer is visual feedback only.

- **Select:** preserve native select semantics and browser-owned popup behavior. Use the actual option value as the form value, not the display label unless they are identical.
- **Combobox:** use one native text input and datalist. Free text is allowed; do not falsely announce that every value must match a suggestion. Native datalist behavior varies by browser.
- **Date Picker:** expose and submit ISO calendar dates (YYYY-MM-DD). Do not convert a calendar date through local timezone APIs. Individual unavailable dates are custom-validated after selection, but cannot be visually disabled in the native popup.
- **Date Range:** give start and end separate accessible names, validate ordering and required endpoints, and document the stable YYYY-MM-DD/YYYY-MM-DD serialization.
- **Time Picker:** keep the value as timezone-free HH:MM. Do not attach a date or convert it to a local timestamp. The explicit format readout is distinct from the native input popup, whose format follows browser locale.

## Requirements for every new component

### Semantics

- Use the appropriate native HTML element or ARIA role.
- Expose the current value and state programmatically.
- Give every interactive control an accessible name.
- Associate labels, descriptions and error messages correctly.
- Use live regions only when the update genuinely needs announcement.
- Do not create invalid or conflicting role/state combinations.

### Keyboard

- Every interactive action must be reachable by keyboard.
- Follow familiar platform key behavior where applicable.
- Preserve a visible focus indicator.
- Provide keyboard alternatives to drag-and-drop and precision pointer actions.
- Avoid unexpected focus movement or keyboard traps.

### Pointer and touch

- Support pointer and touch without preventing ordinary page scrolling unnecessarily.
- Use suitable touch targets and clear hit areas.
- Distinguish taps from drags.
- Handle pointer cancellation, lost capture and leaving the component boundary.
- Do not require dragging if an equivalent button/key interaction can be provided.

### Visual and motion

- Never communicate state only with color, texture, animation or sound.
- Respect `prefers-reduced-motion` and provide an understandable reduced-motion presentation.
- Keep labels and readouts legible against the light surfaces.
- Avoid flashing, rapid repeated motion and motion that blocks interaction.
- Ensure error, success, selected and disabled states have more than one visual cue where appropriate.

### Forms

For form-associated components:

- Define whether the component participates in form submission.
- Document the submitted value and serialization format.
- Support disabled and required behavior appropriately.
- Support reset and validation where expected.
- Ensure labels and validation messages are exposed to assistive technology.
- Never place secrets or private content in debug output.

## Component-specific notes

- **Signature:** preserve pointer drawing, but consider a meaningful typed-signature or alternate input path where product requirements and legal context allow. Do not claim the drawn stroke itself is keyboard-accessible.
- **Range Slider:** expose both handles and values independently, with predictable keyboard increments.
- **Date Picker:** support keyboard calendar navigation and announce the active date, month and selection.
- **Sortable List / Kanban:** provide move-up/down or move-to-column controls as alternatives to drag-and-drop.
- **Carousel / Lightbox:** support previous/next, close, focus restoration and meaningful image alternatives.
- **Dialogs / Drawers:** manage focus, Escape handling, inert background behavior and focus restoration.

## Verification checklist

- [ ] Accessible name is present and meaningful.
- [ ] Role and state/value properties are correct.
- [ ] Keyboard operation works.
- [ ] Focus is visible and predictable.
- [ ] Pointer and touch operation work.
- [ ] Non-drag alternative exists where needed.
- [ ] Reduced-motion behavior is verified.
- [ ] Text and state remain understandable without color/sound.
- [ ] Form behavior and validation are verified where applicable.
- [ ] Screen-reader behavior has been tested with a named assistive technology and browser.
- [ ] Results and known gaps are recorded in the component README.

A checklist is a requirement, not evidence by itself. Mark items complete only after testing.

### Phase 4 progress and activity controls

- **Progress Bar and Progress Ring:** expose role=progressbar, min/max and a current value only in determinate mode. Indeterminate mode must omit aria-valuenow rather than announcing a fabricated percentage.
- **Step Indicator:** each step is a real button with a meaningful accessible name. The active step uses aria-current=step. Do not rely on stone color alone to communicate completion.
- **Hourglass Timer:** expose a timer role and concise aria-valuetext. Pause, resume, reset and cancel are native buttons. Avoid announcing every animation frame; the timer-tick event is emitted at whole-second boundaries.
- **Loading Indicator:** use role=status, aria-live=polite and aria-busy. Set active=false when the operation completes. Respect prefers-reduced-motion by holding the rake still.
- All sand movement and sound remain supplementary. The control's current state and actions must remain understandable without motion, color or audio.

