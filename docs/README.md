# GrainMotion-UI Documentation

This directory is the project handbook. It documents the current implementation, the planned 50-component catalogue, design rules, architecture, accessibility expectations, performance constraints, testing, contribution workflow and component authoring process.

> **Status:** The repository now contains forty implemented component source bundles across the original set and Phases 1 through 7. Phase 6 is CI-verified; Phase 7 source, gallery entries and interaction tests are integrated, with final bundle/docs/browser validation pending. The remaining ten roadmap entries in Phases 8–9 are proposals, not available components yet.

## Documentation map

| Document | Purpose |
|---|---|
| [Roadmap](ROADMAP.md) | Phases, component targets, dependencies and completion gates |
| [Component catalog](COMPONENT-CATALOG.md) | Existing components and the full proposed library |
| [Phase 6 implementation spec](PHASE-6-MEDIA-FILES-SPEC.md) | Media and file component APIs, interactions and acceptance requirements |
| [Phase 7 implementation spec](PHASE-7-ADVANCED-LAYOUT-SPEC.md) | Lists, transfer flows, split and resize layouts, tree APIs and acceptance requirements |
| [Architecture](ARCHITECTURE.md) | Current sand engine, custom elements, build and documentation generation |
| [Design system](DESIGN-SYSTEM.md) | Existing visual language and rules for new work |
| [Asset catalog](ASSET-CATALOG.md) | Current asset inventory and asset creation standards |
| [Accessibility](ACCESSIBILITY.md) | Existing behavior, requirements and verification criteria |
| [Performance](PERFORMANCE.md) | Known rendering constraints and optimization plan |
| [Testing](TESTING.md) | Existing automated checks and required test coverage |
| [Browser support](BROWSER-SUPPORT.md) | Verified and unverified browser/platform coverage |
| [Contributing](CONTRIBUTING.md) | Change and review workflow |
| [Component creation guide](COMPONENT-CREATION-GUIDE.md) | Repeatable process for designing and implementing a component |

## Start here

- To use a component, read its component-level README in its directory. The forty implemented component guides are: [Slider](../slider/README.md), [Toggle](../toggle/README.md), [Signature](../signature/README.md), [Thinking](../thinking/README.md), [Checkbox](../checkbox/README.md), [Radio Group](../radio-group/README.md), [Segmented](../segmented/README.md), [Range](../range/README.md), [Rating](../rating/README.md), [Text Field](../input/README.md), [Textarea](../textarea/README.md), [Password](../password/README.md), [Search](../search/README.md) and [OTP/PIN](../otp/README.md), [Select](../select/README.md), [Combobox](../combobox/README.md), [Date Picker](../date-picker/README.md), [Date Range](../date-range/README.md) and [Time Picker](../time-picker/README.md), [Progress Bar](../progress/README.md), [Progress Ring](../progress-ring/README.md), [Step Indicator](../steps/README.md), [Hourglass Timer](../timer/README.md), [Loading Indicator](../loader/README.md), [Tabs](../tabs/README.md), [Accordion](../accordion/README.md), [Pagination](../pagination/README.md), [Breadcrumbs](../breadcrumbs/README.md) and [Menu / Popover](../menu/README.md), [File Dropzone](../dropzone/README.md), [Upload Queue](../upload-queue/README.md), [Image Carousel](../carousel/README.md), [Lightbox Gallery](../lightbox/README.md), [Media Scrubber](../scrubber/README.md) and [Color Picker](../color-picker/README.md), [Sortable List](../sortable/README.md), [Transfer List](../transfer-list/README.md), [Split Pane](../split-pane/README.md), [Resizable Panels](../resizable/README.md) and [Tree View](../tree/README.md).
- To propose or build a new component, read the [roadmap](ROADMAP.md) and [component creation guide](COMPONENT-CREATION-GUIDE.md).
- To understand the current renderer, read [architecture](ARCHITECTURE.md) and the existing [GrainMotion-UI skill](../skills/grainmotion-ui/SKILL.md).
- To check what is implemented, consult the [component catalog](COMPONENT-CATALOG.md), not the proposed roadmap entries.

## Documentation rule

Every implementation claim must be backed by the current source, a reproducible test, or clearly identified as a target or proposal. A planned feature must never be described as released. Test coverage and browser support must reflect checks that have actually run.
