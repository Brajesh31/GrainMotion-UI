# GrainMotion-UI Documentation

This directory is the project handbook. It documents the current implementation, the planned 50-component catalogue, design rules, architecture, accessibility expectations, performance constraints, testing, contribution workflow and component authoring process.

> **Status:** The repository currently contains four implemented components: Slider, Toggle, Signature and Thinking. The remaining 46 entries in the roadmap are proposals, not available components yet.

## Documentation map

| Document | Purpose |
|---|---|
| [Roadmap](ROADMAP.md) | Phases, component targets, dependencies and completion gates |
| [Component catalog](COMPONENT-CATALOG.md) | Existing components and the full proposed library |
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

- To use a component, read its component-level README in its directory.
- To propose or build a new component, read the [roadmap](ROADMAP.md) and [component creation guide](COMPONENT-CREATION-GUIDE.md).
- To understand the current renderer, read [architecture](ARCHITECTURE.md) and the existing [GrainMotion-UI skill](../skills/grainmotion-ui/SKILL.md).
- To check what is implemented, consult the [component catalog](COMPONENT-CATALOG.md), not the proposed roadmap entries.

## Documentation rule

Every implementation claim must be backed by the current source, a reproducible test, or clearly identified as a target or proposal. A planned feature must never be described as released. Test coverage and browser support must reflect checks that have actually run.
