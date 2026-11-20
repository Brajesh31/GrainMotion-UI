# Component Catalog

This is the single human-readable inventory of GrainMotion-UI components. It distinguishes implemented controls from roadmap proposals.

## Implemented components

| Component | Custom element | Main interaction | Documentation | Status |
|---|---|---|---|---|
| Slider | `sand-slider` | A bamboo rake cuts grooves and pushes a ridge through sand. | [slider/README.md](../slider/README.md) | Implemented |
| Toggle | `sand-toggle` | A river stone glides, leaves a wake and uncovers a pressed symbol. | [toggle/README.md](../toggle/README.md) | Implemented |
| Signature | `sand-signature` | A bamboo stick writes into sand; strokes can be undone or cleared. | [signature/README.md](../signature/README.md) | Implemented |
| Thinking | `sand-thinking` | A stone and self-raking sand show AI activity states. | [thinking/README.md](../thinking/README.md) | Implemented |

## Proposed components

The components below are approved planning candidates, not implemented features. Their physical concepts are preliminary and may be refined during design exploration.

| # | Component | Custom element | Category | Status |
|---:|---|---|---|---|
| 5 | Checkbox | `sand-checkbox` | Selection | Planned |
| 6 | Radio Group | `sand-radio-group` | Selection | Planned |
| 7 | Segmented Control | `sand-segmented` | Selection | Planned |
| 8 | Range Slider | `sand-range` | Range input | Planned |
| 9 | Rating | `sand-rating` | Rating | Planned |
| 10 | Text Field | `sand-input` | Text input | Planned |
| 11 | Textarea | `sand-textarea` | Text input | Planned |
| 12 | Password Field | `sand-password` | Secure input | Planned |
| 13 | Search Field | `sand-search` | Search | Planned |
| 14 | OTP / PIN Input | `sand-otp` | Structured input | Planned |
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
