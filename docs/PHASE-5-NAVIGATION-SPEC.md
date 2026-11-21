# Phase 5: Navigation Components

> Status: **In progress**. This document is the implementation contract for components 25–29. It is not evidence that the components are implemented or released.

## Phase objective

Add five navigation and disclosure controls while preserving GrainMotion-UI's physical language: warm sand, walnut frames, bamboo details, river stones, tactile movement and restrained sound. Each component must remain a useful semantic control when WebGL2, sound or animation is unavailable.

The original four components and the completed Phases 1–4 are regression baselines. Do not rewrite or refactor them to make Phase 5 easier.

## Shared implementation rules

- Use the established `sand-` custom-element naming convention.
- Keep component source standalone, with the shared engine and only required sound assets embedded by `tools/build.mjs`.
- Keep behavior native-first: semantic buttons, links, tablists, tab panels and disclosure controls must remain available to keyboard and assistive-technology users.
- Expose documented properties/attributes and dispatch predictable, bubbling, composed events where appropriate.
- Support pointer, touch, keyboard, disabled states, focus visibility, resize, disconnect/reconnect and no-WebGL fallback.
- Respect `prefers-reduced-motion`; do not make state changes depend on animation completion.
- Avoid opening overlays outside the viewport. Restore focus after dismissing transient menus.
- Keep the visual metaphor functional. A moving stone, lid or stepping stone must communicate a real state change, not merely decorate a generic widget.
- Add original concept artwork under each component's `assets/` folder. Label concept diagrams accurately; do not present them as runtime screenshots.
- Add complete component README, live demo, gallery card, registry entry, `llms.txt` entry and automated browser coverage.
- Run build synchronization, documentation generation checks and the full regression suite before calling any component complete.

## Component 25: Tabs

**Element:** `sand-tabs`

**Physical concept:** A flat river-stone marker glides between shallow carved tab wells. The active tab has a clear inset and a low ridge; inactive wells remain visible without competing with the selected state.

**Required behavior**
- Support a single selected tab and associated panel.
- Use the tablist/tab/tabpanel roles and stable `id`, `aria-controls`, `aria-labelledby`, `aria-selected` and roving `tabindex` relationships.
- Support horizontal and vertical orientation.
- Arrow keys move focus; Home/End move to first/last tab. Manual activation uses Enter/Space; automatic activation is permitted only when panel changes are immediate.
- Disabled tabs are skipped by keyboard navigation and cannot become active.
- Expose selected value through a property and documented `change` event.
- Define behavior for dynamic tab additions/removals and when the active tab is removed.
- Do not hide panel content from the accessibility tree incorrectly.

**Acceptance checks**
- Pointer selection, keyboard focus movement, activation mode, disabled tabs, orientation, panel relationships, selected-value reflection, event detail, resize and reconnect.
- Verify focus remains predictable when a tab or panel is dynamically removed.

## Component 26: Accordion

**Element:** `sand-accordion`

**Physical concept:** Each item is a small wooden lid over its own sand compartment. Opening a lid lifts it and reveals the compartment; closing it settles the lid without clearing the content state.

**Required behavior**
- Support single-open and multiple-open modes.
- Support optional collapsible behavior in single-open mode.
- Use native buttons for headers with `aria-expanded` and `aria-controls`, and correctly labelled panels.
- Support disabled items and a predictable initial-open configuration.
- Preserve panel content and form values when collapsed.
- Expose open item identifiers and a documented `change` event.
- Animation must not delay semantic state updates; reduced-motion mode changes state without decorative movement.

**Acceptance checks**
- Open/close, single vs multiple mode, collapsible rules, disabled items, keyboard activation, ARIA relationships, content persistence, event payload, dynamic item changes and reconnect.

## Component 27: Pagination

**Element:** `sand-pagination`

**Physical concept:** Numbered wells are pressed into a shallow sand track. A small stone marks the current page; previous/next stones sit at the ends of the track.

**Required behavior**
- Expose `page`, `total` (or total pages), `siblingCount`, `boundaryCount`, `disabled` and accessible `label` configuration with documented defaults.
- Render a compact, deterministic page window with ellipses when needed.
- Provide previous/next and first/last navigation where configured.
- Use real buttons, mark the current page with `aria-current="page"`, and disable unavailable navigation.
- Clamp or reject out-of-range page values consistently.
- Dispatch a `change` event with the new page and do not assume data fetching is part of the component.

**Acceptance checks**
- First/middle/last page windows, ellipsis boundaries, sibling/boundary counts, disabled state, keyboard operation, page clamping, event payload and small-screen overflow.

## Component 28: Breadcrumbs

**Element:** `sand-breadcrumbs`

**Physical concept:** Small stepping stones form a path through a hierarchy. The current location is a larger, settled stone; prior locations are navigable stones separated by subtle sand trails.

**Required behavior**
- Render a semantic navigation landmark with an accessible label.
- Use real links for navigable ancestors and plain text with `aria-current="page"` for the current location.
- Accept structured items with stable labels and URLs; never synthesize unsafe URLs.
- Support a configurable separator without using it as the only indication of hierarchy.
- Handle long paths and narrow viewports without horizontal page overflow.
- Do not intercept normal browser navigation or invent client-side routing.

**Acceptance checks**
- Landmark naming, link destinations, current-page semantics, separator rendering, long labels, empty/single-item paths, keyboard focus and responsive layout.

## Component 29: Menu / Popover

**Element:** `sand-menu`

**Physical concept:** A small stone lifts from a carved anchor well and reveals a walnut-edged option tray. The tray appears close to its trigger and settles into place; dismissing it returns the stone and focus to the trigger.

**Required behavior**
- Distinguish a command menu from a generic informational popover. Phase 5 scope is a button-triggered command menu with optional non-interactive descriptive content, not a full dialog system.
- Use a real trigger button and a semantic menu with menuitem buttons/links as appropriate.
- Support click/tap, Enter/Space, ArrowUp/ArrowDown, Home/End, Escape and outside-pointer dismissal.
- Manage initial focus, roving focus, disabled items and focus restoration.
- Position the tray within the viewport and update placement on resize/scroll.
- Support `open` state reflection and a documented `select` event; selection closes the menu unless explicitly configured otherwise.
- Avoid trapping focus as a modal would. Do not claim full dialog/popover parity.

**Acceptance checks**
- Trigger activation, menu keyboard model, disabled items, selection event, Escape/outside dismissal, focus restoration, viewport collision handling, resize/scroll and reconnect.

## Phase-level definition of done

Phase 5 is complete only when all five components have:
1. Standalone source bundles and required assets.
2. Working, responsive demos and complete component READMEs.
3. Original component-specific concept artwork and accurate asset documentation.
4. Gallery integration, registry metadata and AI-readable catalog entries.
5. Automated interaction, keyboard, accessibility-semantic, responsive and lifecycle tests.
6. A passing full regression run for all 29 components, including the original four.
7. Build and docs checks passing with no stale generated files.
8. A recorded browser/device test environment and an explicit list of unverified accessibility/browser checks.

A component must remain marked **in progress** until its own acceptance checks pass. Phase 5 must not be marked complete based only on generated documentation or a visually convincing demo.
