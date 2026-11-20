# GrainMotion-UI Expansion Roadmap

## Vision

Grow GrainMotion-UI into a carefully designed library of tactile interface controls made from simulated sand, natural materials and deliberate motion. The original four components define the standard. New components must feel as if they belong to the same physical world, while remaining real, accessible and useful controls.

**Target:** 50 components total, including the four already implemented. This means 46 new components.

**Important:** This is a roadmap, not a completion report. Only Slider, Toggle, Signature and Thinking currently exist as implemented components in the repository.

## Non-negotiable principles

1. Preserve the original four components as the reference implementations. Do not regress their visual behavior, APIs, demos or standalone distribution.
2. Every new component must have a real control function. An animation alone is not a component.
3. Give each component one clear physical metaphor and a distinct interaction idea. Do not reuse the same stone-slide or rake animation indiscriminately.
4. Retain the existing warm sand, walnut, bamboo and river-stone visual identity.
5. Keep standalone custom-element distribution and avoid runtime framework dependencies.
6. Document actual behavior, APIs, accessibility, limits and test evidence.
7. Do not claim browser support, performance, accessibility or test results that have not been verified.
8. Make shared-engine changes deliberately and run regression checks against all existing components.
9. Build for graceful lifecycle management. Do not assume every component will be mounted simultaneously.
10. Treat reduced motion, keyboard access, touch behavior and fallback behavior as product requirements, not optional polish.

## Phase 0: Foundation, audit and system preparation

**Goal:** Establish the standards required to expand without damaging the existing project.

| Workstream | Deliverable | Current status |
|---|---|---|
| Repository audit | Inventory current files, four components, core engine and build scripts | Inspected |
| Existing API baseline | Record element names, properties, methods, attributes and events from current docs/source | Documentation baseline created; further source-level API audit required |
| Design system | Record observed colors, materials, lighting, geometry and motion rules | Initial baseline documented; formal tokens still need implementation |
| Architecture | Explain core engine, stamping process, standalone files and generated docs | Documented |
| Component contract | Define common API, accessibility, lifecycle and distribution standards | Target described; contract implementation pending |
| Assets | Inventory existing artwork, sounds and textures | Initial inventory documented |
| Accessibility | Record existing semantics and known gaps | Baseline documented; remediation pending |
| Performance | Identify WebGL context and simulation constraints | Known issues documented; profiling/remediation pending |
| Testing | Record existing Chromium test coverage and required new checks | Baseline documented; broader coverage pending |
| Documentation system | Keep `tools/spec.mjs` as source of generated component docs, registry and `llms.txt` | Existing mechanism retained; extension pending |

**Exit criteria:** design tokens and component contract approved in code/docs; lifecycle and WebGL constraints tested; accessibility and browser test strategy documented; the original four have a passing regression baseline; new-component scaffolding can be generated without altering their behavior.

## Phase 1: Essential selection controls

**Target after phase:** 9 components total.

| # | Component | Element | Physical interaction |
|---:|---|---|---|
| 5 | Checkbox | `sand-checkbox` | A pebble presses into a circular sand well and leaves a distinct selected imprint. |
| 6 | Radio Group | `sand-radio-group` | A set of stones occupy separate wells; selecting one moves the active marker and releases the former selection. |
| 7 | Segmented Control | `sand-segmented` | A bamboo or wooden marker glides between engraved sections. |
| 8 | Range Slider | `sand-range` | Two independent rakes define a selected interval and move sand around both handles. |
| 9 | Rating | `sand-rating` | Individual pebbles are pressed into wells to represent a discrete rating. |

Required coverage: checked/unchecked and selected states, disabled options, keyboard selection, pointer/touch handling, form semantics where applicable, labels, events and controlled values.

## Phase 2: Text and structured inputs

**Target after phase:** 14 components total.

| # | Component | Element | Physical interaction |
|---:|---|---|---|
| 10 | Text Field | `sand-input` | A stylus-like focus marker and subtle tactile impressions accompany a normal text field. |
| 11 | Textarea | `sand-textarea` | A wider writing surface with a moving stylus and restrained sand displacement. |
| 12 | Password Field | `sand-password` | A stone shutter conceals or reveals the entered value without exposing it by default. |
| 13 | Search Field | `sand-search` | A rake/search marker moves while results are pending and settles when the search resolves. |
| 14 | OTP / PIN Input | `sand-otp` | Separate engraved wells represent digits and show the active position. |

Required coverage: labels, placeholders, input and change events, input constraints, paste behavior, autocomplete, validation messages, password reveal behavior, focus and keyboard support. Sensitive values must not be written to logs or exposed in visual assets.

## Phase 3: Selection, calendar and time controls

**Target after phase:** 19 components total.

| # | Component | Element | Physical interaction |
|---:|---|---|---|
| 15 | Select / Dropdown | `sand-select` | A stone moves within a tray of selectable options. |
| 16 | Combobox / Autocomplete | `sand-combobox` | A rake navigates a filtered list of options. |
| 17 | Date Picker | `sand-date-picker` | An engraved calendar with a pebble marking the selected day. |
| 18 | Date Range Picker | `sand-date-range` | Two stones mark the start and end dates, with the interval visible between them. |
| 19 | Time Picker | `sand-time-picker` | A circular time surface with a movable selector and readable time output. |

Required coverage: localization, keyboard calendar navigation, minimum/maximum values, unavailable dates, range validation, 12/24-hour formats, accessible announcements and deterministic timezone handling.

## Phase 4: Progress, loading and activity

**Target after phase:** 24 components total.

| # | Component | Element | Physical interaction |
|---:|---|---|---|
| 20 | Progress Bar | `sand-progress` | An automatically advancing rake leaves a growing trail in a sand channel. |
| 21 | Progress Ring | `sand-progress-ring` | A pebble travels around a circular groove as completion increases. |
| 22 | Step Indicator | `sand-steps` | Stepping stones show completed, active and upcoming steps. |
| 23 | Hourglass Timer | `sand-timer` | Sand falls between two chambers to show remaining time. |
| 24 | Loading Indicator | `sand-loader` | A miniature rake creates a looping, recognizable pattern distinct from AI Thinking. |

Required coverage: determinate/indeterminate behavior, progress values, timer controls, pause/resume/cancel where relevant, completion and error states, reduced-motion behavior and accessible status.

## Phase 5: Navigation components

**Target after phase:** 29 components total.

| # | Component | Element | Physical interaction |
|---:|---|---|---|
| 25 | Tabs | `sand-tabs` | A stone marker glides between carved tab sections. |
| 26 | Accordion | `sand-accordion` | Wooden lids slide aside to reveal separate sand compartments. |
| 27 | Pagination | `sand-pagination` | A marker selects numbered wells along a track. |
| 28 | Breadcrumbs | `sand-breadcrumbs` | Stepping stones form a navigable hierarchy. |
| 29 | Menu / Popover | `sand-menu` | A small stone lifts to reveal an anchored option tray. |

Required coverage: active state, nested/expanded behavior, keyboard navigation, focus management, panel relationships, dismiss behavior and responsive placement.

## Phase 6: Media, file and visual components

**Target after phase:** 35 components total.

| # | Component | Element | Physical interaction |
|---:|---|---|---|
| 30 | File Dropzone | `sand-dropzone` | A file tile drops into a tray and produces an impact and settling effect. |
| 31 | Upload Queue | `sand-upload-queue` | File tiles progress through a carved channel with clear individual states. |
| 32 | Image Carousel | `sand-carousel` | Framed image plates move along a horizontal sand track. |
| 33 | Lightbox Gallery | `sand-lightbox` | A selected image is shown in an expanded frame with accessible navigation. |
| 34 | Media Scrubber | `sand-scrubber` | A rake moves along a playback timeline, showing position and buffered ranges. |
| 35 | Color Picker | `sand-color-picker` | Mineral pigment stones represent colors and selection. |

Required coverage: MIME/type and size restrictions, preview lifecycle, upload progress/error/cancel, keyboard navigation, previous/next controls, media API integration, color value formats and accessible labels.

## Phase 7: Lists, drag-and-drop and layout

**Target after phase:** 40 components total.

| # | Component | Element | Physical interaction |
|---:|---|---|---|
| 36 | Sortable List | `sand-sortable` | Stone tiles reorder inside carved grooves. |
| 37 | Transfer List | `sand-transfer-list` | Stones move between two sand compartments. |
| 38 | Split Pane | `sand-split-pane` | A stone divider changes the size of two sand trays. |
| 39 | Resizable Panels | `sand-resizable` | Wooden partitions resize panels and disturb surrounding sand. |
| 40 | Tree View | `sand-tree` | Branches are etched into sand, with stones marking expandable nodes. |

Required coverage: ordering, transfer, selection, nested data, keyboard alternatives to dragging, responsive constraints, persistence options and large-list performance.

## Phase 8: Feedback and overlays

**Target after phase:** 45 components total.

| # | Component | Element | Physical interaction |
|---:|---|---|---|
| 41 | Tooltip | `sand-tooltip` | A small information stone appears beside the focused or hovered element. |
| 42 | Toast Notification | `sand-toast` | A stone rolls into a miniature tray, displays a message and exits. |
| 43 | Alert Banner | `sand-alert` | A raised sand strip and mineral marker communicate status. |
| 44 | Dialog / Modal | `sand-dialog` | A framed sand surface appears above the page with actions. |
| 45 | Drawer / Sheet | `sand-drawer` | A wood-framed sand panel enters from a screen edge. |

Required coverage: focus trapping where appropriate, Escape behavior, dismissal rules, stacking, live-region announcements, action controls, backdrop interaction and mobile positioning.

## Phase 9: Advanced productivity and composite components

**Target after phase:** 50 components total.

| # | Component | Element | Physical interaction |
|---:|---|---|---|
| 46 | Command Palette | `sand-command` | A central stone navigates a searchable command list. |
| 47 | Context Menu | `sand-context-menu` | A carved menu appears at a context-menu or long-press position. |
| 48 | Filter Builder | `sand-filter-builder` | Filter conditions are represented by stones connected by logical grooves. |
| 49 | Data Table | `sand-table` | A structured board uses sand markers for selection, sorting and filtering. |
| 50 | Kanban Board | `sand-kanban` | Cards move between columns with material movement and settling. |

Required coverage: complex state, sorting/filtering, keyboard interaction, virtualization when justified, responsive layout, and persistence/integration contracts.

## Definition of done for each component

A component is not complete because its demo looks convincing. It must pass all applicable checks:

- A distinct physical interaction concept that fits the GrainMotion-UI world.
- Correct underlying control semantics and a functional API.
- Complete custom-element lifecycle and cleanup.
- Keyboard, pointer and touch behavior appropriate to the control.
- Accessibility semantics, focus handling and accessible alternatives.
- Form integration when the component represents form data.
- Responsive behavior and sensible minimum dimensions.
- Appropriate original visual assets and sound assets, with documented provenance.
- Standalone distribution with no runtime framework requirement.
- A complete README and working live demo.
- API, design, interaction, accessibility, limitations and troubleshooting documentation.
- Automated tests for the supported behavior and regression coverage for existing controls.
- Verified performance on a deliberately slowed CPU and recorded test environment.
- No false browser-support or accessibility claims.

## Release milestones

| Milestone | Scope | Total component target |
|---|---|---:|
| Foundation | Phase 0 | 4 existing |
| Release 1 | Phases 1–2 | 14 |
| Release 2 | Phases 3–4 | 24 |
| Release 3 | Phases 5–6 | 35 |
| Release 4 | Phases 7–8 | 45 |
| Release 5 | Phase 9 | 50 |

Milestone targets are planning figures. Mark a component implemented only after its source, demo, generated registry/docs and verification are committed.
