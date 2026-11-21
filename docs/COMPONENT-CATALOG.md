# Component Catalog

This is the single human-readable inventory of GrainMotion-UI components. It distinguishes implemented controls from roadmap proposals.

## Implemented components

| Component | Custom element | Main interaction | Documentation | Status |
|---|---|---|---|---|
| Slider | `sand-slider` | A bamboo rake cuts grooves and pushes a ridge through sand. | [slider/README.md](../slider/README.md) | Implemented |
| Toggle | `sand-toggle` | A river stone glides, leaves a wake and uncovers a pressed symbol. | [toggle/README.md](../toggle/README.md) | Implemented |
| Signature | `sand-signature` | A bamboo stick writes into sand; strokes can be undone or cleared. | [signature/README.md](../signature/README.md) | Implemented |
| Thinking | `sand-thinking` | A stone and self-raking sand show AI activity states. | [thinking/README.md](../thinking/README.md) | Implemented |

## Phase 1 components

The five selection controls have standalone source files, demos, component READMEs, concept diagrams, gallery cards and registry entries. Their automated mobile Chromium checks have passed; manual screen-reader and physical-device verification remains outstanding.

| # | Component | Custom element | Main interaction | Documentation | Status |
|---:|---|---|---|---|---|
| 5 | Checkbox | `sand-checkbox` | A stone rolls aside to reveal a checkmark pressed into a sand well. | [README](../checkbox/README.md) · [Demo](../checkbox/) | Implemented, Chromium CI passed |
| 6 | Radio Group | `sand-radio-group` | A selected pebble moves between individual option wells. | [README](../radio-group/README.md) · [Demo](../radio-group/) | Implemented, Chromium CI passed |
| 7 | Segmented Control | `sand-segmented` | A flat stone marker glides between carved segments. | [README](../segmented/README.md) · [Demo](../segmented/) | Implemented, Chromium CI passed |
| 8 | Range Slider | `sand-range` | Two bamboo rakes define an interval through the sand. | [README](../range/README.md) · [Demo](../range/) | Implemented, Chromium CI passed |
| 9 | Rating | `sand-rating` | Five pebbles sit in separate wells; one marks the rating. | [README](../rating/README.md) · [Demo](../rating/) | Implemented, Chromium CI passed |

## Phase 2 components

These five native text and structured-input controls have standalone bundles, live demos, detailed READMEs, concept diagrams, gallery cards and registry entries. The Phase 2 interaction suite is not yet verified, so these are marked implemented with verification pending until CI passes.

| # | Component | Custom element | Main interaction | Documentation | Status |
|---:|---|---|---|---|---|
| 10 | Text Field | `sand-input` | A real native input with a bamboo stylus focus cue. | [README](../input/README.md) · [Demo](../input/) | Implemented, verification pending |
| 11 | Textarea | `sand-textarea` | A native multiline input over shallow writing grooves. | [README](../textarea/README.md) · [Demo](../textarea/) | Implemented, verification pending |
| 12 | Password Field | `sand-password` | A native masked credential field with a stone Show/Hide shutter. | [README](../password/README.md) · [Demo](../password/) | Implemented, verification pending |
| 13 | Search Field | `sand-search` | A native search input with clear action and a moving busy rake. | [README](../search/README.md) · [Demo](../search/) | Implemented, verification pending |
| 14 | OTP / PIN Input | `sand-otp` | One native numeric input across engraved digit wells. | [README](../otp/README.md) · [Demo](../otp/) | Implemented, verification pending |

## Planned components

The components below are roadmap candidates, not implemented features. Their physical concepts are preliminary and may be refined during design exploration.

| # | Component | Custom element | Category | Status |
|---:|---|---|---|---|
| 15 | Select / Dropdown | `sand-select` | Selection | Planned |
| 16 | Combobox / Autocomplete | `sand-combobox` | Searchable selection | Planned |
| 17 | Date Picker | `sand-date-picker` | Date and time | Planned |
| 18 | Date Range Picker | `sand-date-range` | Date and time | Planned |
| 19 | Time Picker | `sand-time-picker` | Date and time | Planned |
| 20 | Progress Bar | `sand-progress` | Progress | Planned |
| 21 | Progress Ring | `sand-progress-ring` | Progress | Planned |
| 22 | Step Indicator | `sand-steps` | Progress | Planned |
| 23 | Hourglass Timer | `sand-timer` | Time | Planned |
| 24 | Loading Indicator | `sand-loader` | Loading | Planned |
| 25 | Tabs | `sand-tabs` | Navigation | Planned |
| 26 | Accordion | `sand-accordion` | Disclosure | Planned |
| 27 | Pagination | `sand-pagination` | Navigation | Planned |
| 28 | Breadcrumbs | `sand-breadcrumbs` | Navigation | Planned |
| 29 | Menu / Popover | `sand-menu` | Navigation / overlay | Planned |
| 30 | File Dropzone | `sand-dropzone` | File input | Planned |
| 31 | Upload Queue | `sand-upload-queue` | File handling | Planned |
| 32 | Image Carousel | `sand-carousel` | Media | Planned |
| 33 | Lightbox Gallery | `sand-lightbox` | Media / overlay | Planned |
| 34 | Media Scrubber | `sand-scrubber` | Media | Planned |
| 35 | Color Picker | `sand-color-picker` | Color input | Planned |
| 36 | Sortable List | `sand-sortable` | Drag and drop | Planned |
| 37 | Transfer List | `sand-transfer-list` | Selection / data | Planned |
| 38 | Split Pane | `sand-split-pane` | Layout | Planned |
| 39 | Resizable Panels | `sand-resizable` | Layout | Planned |
| 40 | Tree View | `sand-tree` | Data navigation | Planned |
| 41 | Tooltip | `sand-tooltip` | Feedback / overlay | Planned |
| 42 | Toast Notification | `sand-toast` | Feedback | Planned |
| 43 | Alert Banner | `sand-alert` | Feedback | Planned |
| 44 | Dialog / Modal | `sand-dialog` | Overlay | Planned |
| 45 | Drawer / Sheet | `sand-drawer` | Overlay | Planned |
| 46 | Command Palette | `sand-command` | Productivity | Planned |
| 47 | Context Menu | `sand-context-menu` | Productivity / overlay | Planned |
| 48 | Filter Builder | `sand-filter-builder` | Data / productivity | Planned |
| 49 | Data Table | `sand-table` | Data display | Planned |
| 50 | Kanban Board | `sand-kanban` | Data / productivity | Planned |

## Naming and API conventions

- Custom elements use the `sand-` prefix and a lowercase, hyphenated name.
- Component directory names match the component ID and JavaScript filename.
- Use native HTML semantics where possible; use custom-element behavior only where it provides a genuine benefit.
- Attribute/property names should follow familiar platform conventions such as `value`, `checked`, `disabled`, `required`, `name`, `min`, `max` and `step` where they make sense.
- Events should follow native conventions where practical and be documented precisely.
- Components should not silently invent incompatible APIs for the same concept.

## Status definitions

- **Implemented:** source file, demo, component README and registry/documentation output exist in the current repository.
- **In progress:** implementation is underway but not all definition-of-done checks pass.
- **Planned:** candidate in the roadmap; no availability should be implied.
- **Deferred:** intentionally postponed due to complexity, performance, accessibility or scope concerns.
