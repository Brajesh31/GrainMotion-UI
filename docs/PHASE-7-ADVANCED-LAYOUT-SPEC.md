# Phase 7: Lists, Drag-and-Drop and Advanced Layout

> **Status:** Complete on `main`. All five standalone controls, gallery wiring, guides, concept SVGs, registry entries and 27 Phase 7 browser assertions are integrated. The 40-component mobile Chromium suite passed **180 assertions with zero failures**; bundle synchronization, generated docs and GitHub Pages deployment passed. [Validation run](https://github.com/Brajesh31/GrainMotion-UI/actions/runs/44872261254) · [Pages deployment](https://github.com/Brajesh31/GrainMotion-UI/actions/runs/44872261277). Manual screen-reader, physical-device, Safari and Firefox checks remain outstanding.

## Design direction

Extend the established sand, walnut, bamboo and river-stone material language into data ordering and layout. These controls must manipulate real host-visible state, not simulate a decorative result disconnected from the underlying data. Native DOM content and keyboard alternatives remain first-class.

## Shared implementation contract

- Each component is an independent JavaScript file with the shared sand engine and its sounds embedded.
- Each public state property returns a copy where mutation could bypass component events.
- IDs must be stable and labels are always inserted as text, never parsed as HTML.
- Drag and pointer resizing must have keyboard alternatives and visible focus.
- Disabled state must propagate to native controls after connection, not only at first render.
- The host application owns server persistence, data fetching, lazy loading and application-specific validation.
- The sand marker is a physical visualization of state; the data API is the source of truth.

## Component 36: Sortable List

**Element:** `sand-sortable`

**API:** `items = [{id,label,disabled}]`, `value` (ordered ID array), `move(fromIndex,toIndex)`; `reorder` and `change` events.

**Interaction:** native drag-and-drop, handle keyboard arrows/Home/End and visible Move Up/Down buttons.

**Acceptance:** stable IDs, duplicate ID filtering, explicit order events, disabled item support, empty state and keyboard focus continuity.

## Component 37: Transfer List

**Element:** `sand-transfer-list`

**API:** `items = [{id,label,side,disabled}]`, `selected`, `select(ids)`, `move(ids,target)`, `moveSelected(target)`, `moveAll(target)`; `transfer` and `change` events.

**Interaction:** select stones in either compartment, then move selected or all enabled items through center controls.

**Acceptance:** multi-selection, stable item IDs, independent side state, event details containing moved IDs and updated items, disabled state and empty compartments.

## Component 38: Split Pane

**Element:** `sand-split-pane`

**API:** `value` (first pane percentage), `axis=horizontal|vertical`, `min-size`, `max-size`, `step`, `disabled`; `input` and `change` events. Direct children assigned to `slot="start"` and `slot="end"` are moved into the two pane containers.

**Interaction:** pointer drag and keyboard arrows/Home/End on a focusable `role="separator"`.

**Acceptance:** horizontal/vertical orientation, accessible value bounds, min/max clamping, native slotted content retention and disabled behavior.

## Component 39: Resizable Panels

**Element:** `sand-resizable`

**API:** `panels = [{id,label,content,min,max}]`, `sizes` (percentage array), `resizeBoundary(index,delta)`; `input` and `change` events.

**Interaction:** two to four panels with pointer and keyboard-adjustable separators. A resize affects only adjacent panels, preserving their combined share.

**Acceptance:** stable panel order, 100-percent total, boundary min/max rules, keyboard separators, disabled behavior and serializable size state.

## Component 40: Tree View

**Element:** `sand-tree`

**API:** nested `items = [{id,label,disabled,children}]`, `value`, `expanded`, `select(id)`, `toggle(id)`; `select`, `change` and `expand` events.

**Interaction:** click to select, separate branch controls to expand/collapse and arrow-key navigation through visible nodes.

**Acceptance:** unique IDs throughout nested data, stable selection, depth metadata, roving focus, Up/Down, Left/Right, Home/End, disabled nodes and empty state.

## Phase-level definition of done

1. All five files match the standalone build manifest, with shared engine and required sounds embedded.
2. Every component has a dedicated demo, generated component guide, concept SVG, gallery card and registry entry.
3. `node tools/build.mjs --check` and `node tools/docs.mjs --check` pass on `main`.
4. The 40-component mobile Chromium suite covers reorder, transfer, separator values, keyboard behavior, disabled states and nested tree selection/expansion.
5. All 35 previously shipped components continue to pass regression checks.
6. GitHub Pages deployment succeeds for the final source commit.
7. Manual screen-reader, physical-device and additional-browser checks are recorded separately; a headless Chromium pass does not prove them.

## Ownership boundaries

Sortable and transfer controls manage in-memory order/side only. Split Pane retains host-owned DOM nodes but does not route or persist content. Resizable Panels renders panel labels/descriptions as text and does not accept arbitrary HTML payloads. Tree View handles the supplied nested node data but does not fetch children or virtualize a large tree.
