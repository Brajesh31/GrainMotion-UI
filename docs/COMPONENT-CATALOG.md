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

These five native text and structured-input controls have standalone bundles, live demos, detailed READMEs, concept diagrams, gallery cards and registry entries. The mobile Chromium suite passed all Phase 2 interaction and form assertions. Manual screen-reader and physical-device verification remains outstanding.

| # | Component | Custom element | Main interaction | Documentation | Status |
|---:|---|---|---|---|---|
| 10 | Text Field | `sand-input` | A real native input with a bamboo stylus focus cue. | [README](../input/README.md) · [Demo](../input/) | Implemented, Chromium CI passed |
| 11 | Textarea | `sand-textarea` | A native multiline input over shallow writing grooves. | [README](../textarea/README.md) · [Demo](../textarea/) | Implemented, Chromium CI passed |
| 12 | Password Field | `sand-password` | A native masked credential field with a stone Show/Hide shutter. | [README](../password/README.md) · [Demo](../password/) | Implemented, Chromium CI passed |
| 13 | Search Field | `sand-search` | A native search input with clear action and a moving busy rake. | [README](../search/README.md) · [Demo](../search/) | Implemented, Chromium CI passed |
| 14 | OTP / PIN Input | `sand-otp` | One native numeric input across engraved digit wells. | [README](../otp/README.md) · [Demo](../otp/) | Implemented, Chromium CI passed |

## Phase 3 components

The five selection, calendar and time controls have standalone bundles, live demos, expanded component READMEs, concept artwork, gallery cards and registry entries. All five passed the mobile Chromium interaction and form checks in the nineteen-component validation workflow. Manual screen-reader and physical-device verification remains outstanding.

| # | Component | Custom element | Main interaction | Documentation | Status |
|---:|---|---|---|---|---|
| 15 | Select / Dropdown | `sand-select` | A river stone settles into the chosen option well. | [README](../select/README.md) · [Demo](../select/) | Implemented, Chromium CI passed |
| 16 | Combobox / Autocomplete | `sand-combobox` | A bamboo rake follows the typed query as native suggestions appear. | [README](../combobox/README.md) · [Demo](../combobox/) | Implemented, Chromium CI passed |
| 17 | Date Picker | `sand-date-picker` | An engraved calendar grid holds a pebble on the selected day. | [README](../date-picker/README.md) · [Demo](../date-picker/) | Implemented, Chromium CI passed |
| 18 | Date Range Picker | `sand-date-range` | Two river stones mark the start and end of a date interval. | [README](../date-range/README.md) · [Demo](../date-range/) | Implemented, Chromium CI passed |
| 19 | Time Picker | `sand-time-picker` | A circular sand dial marks the selected time. | [README](../time-picker/README.md) · [Demo](../time-picker/) | Implemented, Chromium CI passed |

## Phase 4 components

The five progress and activity controls now have standalone bundles, demos, expanded READMEs, concept diagrams, gallery cards and registry entries. Their mobile Chromium interaction and form checks passed in the twenty-four-component suite, with 80 assertions and zero failures. Manual screen-reader and physical-device verification remains outstanding.

| # | Component | Custom element | Main interaction | Documentation | Status |
|---:|---|---|---|---|---|
| 20 | Progress Bar | `sand-progress` | A bamboo rake advances through a sand channel. | [README](../progress/README.md) · [Demo](../progress/) | Implemented, Chromium CI passed |
| 21 | Progress Ring | `sand-progress-ring` | A pebble travels around a circular groove. | [README](../progress-ring/README.md) · [Demo](../progress-ring/) | Implemented, Chromium CI passed |
| 22 | Step Indicator | `sand-steps` | Stepping stones show completed, active and upcoming steps. | [README](../steps/README.md) · [Demo](../steps/) | Implemented, Chromium CI passed |
| 23 | Hourglass Timer | `sand-timer` | Sand falls between two chambers with timer controls. | [README](../timer/README.md) · [Demo](../timer/) | Implemented, Chromium CI passed |
| 24 | Loading Indicator | `sand-loader` | A miniature rake loops through a distinct loading pattern. | [README](../loader/README.md) · [Demo](../loader/) | Implemented, Chromium CI passed |

## Phase 5 components

The five navigation components now have standalone bundles, interactive demos, detailed component guides, hand-authored concept SVGs, gallery cards and shadcn registry entries. The shared build and documentation checks and 23 new Phase 5 browser assertions are wired into the validation pipeline. Final CI execution is pending, and manual assistive-technology and physical-device verification remains outstanding. See [Phase 5 implementation contract](PHASE-5-NAVIGATION-SPEC.md) for requirements and known limits.

| # | Component | Custom element | Main interaction | Documentation | Status |
|---:|---|---|---|---|---|
| 25 | Tabs | `sand-tabs` | A flat river stone moves between tab wells; content remains native HTML. | [README](../tabs/README.md) · [Demo](../tabs/) · [Concept](../tabs/assets/concept.svg) | Implemented, CI pending |
| 26 | Accordion | `sand-accordion` | Walnut lids with stone pulls uncover separate sand compartments. | [README](../accordion/README.md) · [Demo](../accordion/) · [Concept](../accordion/assets/concept.svg) | Implemented, CI pending |
| 27 | Pagination | `sand-pagination` | A river stone marks the active numbered well in a carved track. | [README](../pagination/README.md) · [Demo](../pagination/) · [Concept](../pagination/assets/concept.svg) | Implemented, CI pending |
| 28 | Breadcrumbs | `sand-breadcrumbs` | Stepping stones join ancestor links and the current-location marker. | [README](../breadcrumbs/README.md) · [Demo](../breadcrumbs/) · [Concept](../breadcrumbs/assets/concept.svg) | Implemented, CI pending |
| 29 | Menu / Popover | `sand-menu` | A stone trigger lifts a walnut-framed command tray. | [README](../menu/README.md) · [Demo](../menu/) · [Concept](../menu/assets/concept.svg) | Implemented, CI pending |

## Planned components

The components below are roadmap candidates, not implemented features. Their physical concepts are preliminary and may be refined during design exploration.



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
