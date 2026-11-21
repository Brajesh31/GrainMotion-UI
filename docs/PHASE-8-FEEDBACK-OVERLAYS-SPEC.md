# Phase 8: Feedback and Overlays

> **Status: Complete on `main`.** The 45-component mobile Chromium suite passed **206 assertions with zero failures**, including 26 Phase 8 checks. Bundle synchronization, generated documentation and Pages deployment passed. [Validation run](https://github.com/Brajesh31/GrainMotion-UI/actions/runs/44873818303) · [Pages deployment](https://github.com/Brajesh31/GrainMotion-UI/actions/runs/44873818321). Manual screen-reader, physical-device, Safari and Firefox testing remains outstanding.

## Design direction

Feedback and overlays must be useful controls, not decorative popups. Their semantics, focus behavior, dismissal rules and host-facing events take priority over the sand animation. Reuse native browser behavior where it is stronger than a custom imitation, especially for modal focus containment and Escape handling.

## Shared implementation contract

- Each control is a standalone script with the shared sand engine and its required sound assets embedded.
- Never insert message, title, label or user-provided content with `innerHTML`. Use text nodes or preserve caller-owned DOM nodes.
- Every interactive control has a programmatic name, visible focus, keyboard access and a real disabled/dismissed state.
- Modal surfaces must not create fake focus traps. Use native `<dialog>.showModal()` so the browser owns modal focus containment and the top layer.
- Escape and backdrop behavior must be deterministic and configurable, with safe defaults.
- Live announcements must distinguish passive status from urgent alerts. A toast must not be the only place a critical action or error exists.
- Toasts may coexist. A second notification must not obscure the first or create unbounded invisible timers.
- Closing an overlay must clean up timers, global listeners and transient state. Reconnection must not duplicate listeners or event delivery.
- Application routing, persistence, data fetching and long-running task state remain host responsibilities.

## Component 41: Tooltip

**Element:** `sand-tooltip`

**Markup:** `<sand-tooltip for="save" text="Saves the current draft." placement="top"></sand-tooltip>`; the `for` attribute references a trigger element ID in the same document.

**API:** `text`, `placement=top|right|bottom|left`, `delay`, `disabled`, `open`; `show()` and `hide()`.

**Interaction:** show on pointer hover or keyboard focus, dismiss on pointer exit/focus loss or Escape, and allow explicit programmatic control. The tooltip never receives focus.

**Accessibility:** expose the floating message as `role="tooltip"`; append its ID to the trigger's existing `aria-describedby` tokens and restore the original value on disconnect. Never move focus into a tooltip.

**Acceptance:** mouse and focus trigger, Escape, disabled state, existing described-by preservation, viewport-aware placement and listener cleanup.

## Component 42: Toast Notification

**Element:** `sand-toast`

**Markup:** `<sand-toast message="Saved." tone="success" duration="4500" action-label="Undo"></sand-toast>`.

**API:** `message`, `title`, `tone=info|success|warning|error`, `duration`, `position=top-right|top-left|bottom-right|bottom-left`, `open`; `show(message?)` and `dismiss(reason?)`.

**Events:** `action` when its optional action is activated, and `dismiss` with the dismissal reason.

**Accessibility:** status messages use `role="status"` and polite live announcements; urgent error messages use `role="alert"`. Provide a labelled close button when dismissible.

**Acceptance:** programmatic open/close, configurable auto-dismiss (zero disables it), hover/focus timer pause, action/dismiss events, independent stacking, four corner positions and timer cleanup.

## Component 43: Alert Banner

**Element:** `sand-alert`

**Markup:** `<sand-alert tone="warning" title="Storage almost full" message="Remove unused files to continue." dismissible></sand-alert>`.

**API:** `tone=info|success|warning|error`, `title`, `message`, `dismissible`, `action-label`; `dismiss()` and `show()`.

**Events:** `action` and `dismiss`.

**Accessibility:** status roles and live politeness follow tone; the close and action controls have accessible names.

**Acceptance:** tone changes update semantics and visual marker, message/title update as text, optional action, dismiss and restore, disabled action behavior and narrow viewport layout. Unlike toast, a banner does not auto-dismiss.

## Component 44: Dialog / Modal

**Element:** `sand-dialog`

**Markup:** `<sand-dialog title="Confirm changes" description="Review before saving.">…caller-owned content…</sand-dialog>`.

**API:** `open`, `title`, `description`, `confirm-label`, `cancel-label`, `close-on-backdrop`, `close-on-escape`; `showModal()`, `show()` and `close(returnValue?)`.

**Events:** `dialog-open`, `dialog-close` and `confirm`.

**Accessibility:** use a native modal `<dialog>`, labelled heading, optional description, named close/cancel/confirm controls and native focus containment. Restore focus to the opener when possible.

**Acceptance:** modal top-layer state, content-node preservation, initial focus, Tab containment by native dialog, Escape policy, optional backdrop close, confirm/cancel result values, focus restoration and cleanup on disconnect.

## Component 45: Drawer / Sheet

**Element:** `sand-drawer`

**Markup:** `<sand-drawer title="Filters" placement="right" size="360px">…caller-owned content…</sand-drawer>`.

**API:** `open`, `title`, `description`, `placement=left|right|top|bottom`, `size`, `close-on-backdrop`, `close-on-escape`; `showModal()`, `show()` and `close(returnValue?)`.

**Events:** `drawer-open`, `drawer-close) and `confirm` when an action is supplied.

**Accessibility:** use a native modal `<dialog>` for focus containment, labelled heading, close control and focus restoration. The sheet must remain usable at phone widths and respect dynamic viewport height.

**Acceptance:** four placements, responsive size clamping, modal focus behavior, Escape/backdrop policy, close event, action event, content preservation and mobile viewport bounds.

## Phase-level definition of done

1. All five standalone component files match the build manifest with the correct shared engine and sound markers.
2. Each control has a working demo, generated README, gallery card, registry entry and project-specific concept SVG.
3. Each API, event, accessibility behavior, close/dismiss rule and known limitation is documented.
4. `node tools/build.mjs --check` and `node tools/docs.mjs --check` pass on `main`.
5. The 45-component mobile Chromium suite covers focus, keyboard dismissal, live-region semantics, action events, timer cleanup, overlay stacking and modal lifecycle.
6. All 40 previously implemented components continue to pass regression checks.
7. GitHub Pages deploys the final Phase 8 source commit.
8. Manual screen-reader, physical-device, Safari and Firefox checks are recorded separately; Chromium automation alone does not prove them.

## Out of scope

- Tooltips do not replace help text required to complete a task.
- Toasts do not own network requests, retry logic or persistent error state.
- Alert banners do not fetch or repair application data.
- Dialogs and drawers do not manage application routes or domain-specific forms.
- A drawer is modal in this phase; non-modal docked sidebars belong to the layout system rather than this component.
