# Phase 9: Advanced Productivity and Composite Components

> **Status: Complete and CI-verified on `main` (2026-11-21).** All five standalone custom elements, demos, technical guides, concept artwork, registry entries and targeted Chromium assertions are committed. Bundle synchronization, documentation generation, the full 50-component browser suite and GitHub Pages deployment all passed.

## 🎯 Scope

Phase 9 closes the planned 50-component catalogue with five controls that solve higher-level workflow problems:

| # | Component | Element | Responsibility |
|---:|---|---|---|
| 46 | Command Palette | `sand-command` | Search and navigate a local list of application commands |
| 47 | Context Menu | `sand-context-menu` | Present context actions at pointer, touch or keyboard focus |
| 48 | Filter Builder | `sand-filter-builder` | Compose simple structured conditions with AND/OR logic |
| 49 | Data Table | `sand-table` | Search, sort, select and page through tabular records |
| 50 | Kanban Board | `sand-kanban` | Move cards across workflow columns with pointer and keyboard controls |

The five controls share the existing GrainMotion-UI material system: sand height fields, walnut frames, river-stone markers, bamboo-like rails, embedded sounds and standalone script distribution.

## 🧭 Component contracts

### 46. Command Palette

**Element:** `sand-command`

The palette filters in-memory command records by label, description and keywords. It uses a native modal `<dialog>` to enter the browser top layer and provide modal focus containment.

- **Properties:** `commands`, `value`
- **Attributes:** `open`, `placeholder`, `label`, `disabled`
- **Methods:** `show()`, `hide(reason)`, `run(id)`
- **Events:** `command-open`, `command-close`, `select`, `command`
- **Keyboard:** Arrow Up/Down, Home/End, Enter and Escape.
- **Ownership:** the host registers global shortcuts, validates permissions, executes commands, and stores recent actions.

The visible Ctrl K label is illustrative. The element does not install a global shortcut or intercept application shortcuts by itself.

### 47. Context Menu

**Element:** `sand-context-menu`

The context menu can bind to an existing element through `for`, or show its own target surface for a standalone demo. It opens by right-click, touch long-press, ContextMenu or Shift+F10.

- **Properties:** `items`
- **Attributes:** `for`, `label`, `disabled`
- **Methods:** `showAt(x, y)`, `close(reason, restoreFocus)`
- **Events:** `menu-open`, `select`, `menu-select`, `menu-close`
- **Keyboard:** Arrow Up/Down, Home/End, Escape and Tab.
- **Ownership:** the host supplies item permissions, nested actions, and command execution.

The component clamps the menu to the current viewport and removes document listeners when it closes or disconnects.

### 48. Filter Builder

**Element:** `sand-filter-builder`

The filter builder stores a list of conditions and exports a structured query object. It never translates user data into executable SQL or runs a query.

- **Properties:** `fields`, `filters`, `logic`
- **Attributes:** `label`, `disabled`
- **Methods:** `add(field?)`, `remove(index)`, `clear()`, `reset()`, `toQuery()`, `apply()`
- **Events:** `input`, `change`, `apply`, `reset`
- **Field types:** text, number, date and select.
- **Operators:** is, is-not, contains, starts-with, greater-than, less-than, before, after, empty and not-empty.
- **Ownership:** the host validates schema and values, checks authorization, executes the query, and loads results.

Current query shape:

```json
{
  "logic": "AND",
  "conditions": [
    { "field": "status", "operator": "is", "value": "Open" }
  ]
}
```

Only one shared AND/OR group is supported. Nested groups and custom operators are out of scope for this implementation.

### 49. Data Table

**Element:** `sand-table`

The data table uses semantic HTML table markup, stable row IDs, searchable visible columns, stable client-side sorting, multi-row selection, sticky headings and bounded pagination.

- **Properties:** `columns`, `rows`, `selected`, `filter`, `sortBy`, `sortDirection`, `page`, `pageSize`
- **Attributes:** `label`, `disabled`, `page-size`
- **Methods:** `sort(key)`, `select(id, checked)`, `selectVisible(ids, checked)`, `setFilter(query)`
- **Events:** `filter`, `sort`, `select`, `change`, `row-activate`
- **Selection:** select-all applies to visible records on the current page; selected IDs persist when page/filter state changes.
- **Ownership:** the host manages remote data, server-side sorting/filtering, persistence, row editing and authorization.

The implementation uses pagination rather than a virtual scroller. It renders no more than the configured page size (clamped to 1–100) and defaults to five rows. Virtualization is not justified for this bounded local rendering contract. For large or remote datasets, page data at the host/backend.

### 50. Kanban Board

**Element:** `sand-kanban`

The Kanban board groups cards into uniquely identified columns. Native drag-and-drop is supplemented by visible directional controls and keyboard movement.

- **Properties:** `columns`, `value` (alias)
- **Attributes:** `label`, `disabled`
- **Methods:** `moveCard(cardId, columnId, index?)`, `action(cardId, direction)`
- **Events:** `move`, `change`, `select`
- **Keyboard:** Arrow Left/Right moves between columns, Arrow Up/Down reorders within a column, and Home/End moves to the start/end.
- **Ownership:** the host persists the returned columns and owns card editing, permissions, swimlanes, remote updates and conflict handling.

Card IDs must be unique across the complete board. Drag-and-drop is never the only available interaction.

## ♿ Accessibility and input requirements

- Every interactive action is a real button or a native input/select control, with a programmatic name.
- Disabled commands, menu items, filter controls, table actions and cards must be unavailable to keyboard and pointer activation.
- Keyboard alternatives must remain available for palette navigation, context menus, sorting, selection and Kanban movement.
- The native dialog is used for the command palette, not a hand-built focus trap.
- The data grid retains native table semantics, sortable header buttons, `aria-sort`, labelled row selection and visible page navigation.
- The context menu restores focus to its target when it closes by keyboard or selection.
- Drag-and-drop and touch long-press are enhancements. They are not accepted as the only input path.
- Labels and cell values are inserted as text, not interpreted as HTML.

## 📱 Responsive and performance contract

- All five demo pages constrain their component width to the available viewport.
- Filter rows reflow for narrow widths; the table and Kanban columns use local scrolling for wide content.
- Table pagination bounds DOM rows. Other components intentionally render the supplied command list, conditions, menu items or cards.
- No component promises virtualization for unbounded data.
- Each custom element keeps the existing standalone bundle format with the shared engine and its sound assets embedded.
- Real WebGL context count and memory remain a page-level constraint; applications should not mount dozens of live sand trays on one screen.

## ✅ Phase completion gates

Phase 9 can be marked complete only after all of the following are verified on `main`:

1. `node tools/build.mjs --check` confirms all 50 standalone bundles contain the current engine and sound assets.
2. `node tools/docs.mjs --check` confirms README/demo generation, 50 registry records and the AI-readable project guide.
3. `node tools/test.mjs` passes the original regression suite plus the 30 targeted Phase 9 checks in mobile Chromium.
4. The 50-component GitHub Pages gallery and all five standalone demo routes deploy successfully.
5. Test results, assertion totals, CI run links and deployment evidence are recorded here and in the roadmap.
6. Remaining limitations, especially browser context limits, touch drag behavior, server integration and assistive-technology gaps, are documented without overstating coverage.

## 🧪 Current verification status

Source, component specification, five standalone demos, five technical guides, five concept SVGs, gallery cards, registry entries and Phase 9 browser assertions are on `main`.

**Verified:** [50-component mobile Chromium run](https://github.com/Brajesh31/GrainMotion-UI/actions/runs/44878408790) passed 239 checks with zero failures, including all 33 Phase 9 checks. The [GitHub Pages deployment](https://github.com/Brajesh31/GrainMotion-UI/actions/runs/44878408728) also succeeded on the same commit. Bundle synchronization and generated documentation/registry checks passed. Manual Safari, Firefox, real-device and screen-reader testing remain separate follow-up work; the CI result is not a substitute for that coverage.
