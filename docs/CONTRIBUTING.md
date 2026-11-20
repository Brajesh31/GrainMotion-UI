# Contributing to GrainMotion-UI

## Before opening a change

1. Read the [project roadmap](ROADMAP.md).
2. Read the [design system](DESIGN-SYSTEM.md).
3. Read the [architecture](ARCHITECTURE.md).
4. For a new control, follow the [component creation guide](COMPONENT-CREATION-GUIDE.md).
5. Check the [component catalog](COMPONENT-CATALOG.md) to avoid duplicate concepts.

## Design principles

- Preserve the physical sand interaction identity.
- Start with the underlying control behavior and semantics, then invent the physical metaphor.
- Give each component one memorable interaction idea.
- Keep sand volume believable and displacement visible.
- Motion should feel weighted and deliberate.
- Do not add decorative movement with no semantic or interaction purpose.
- Use the established cream, sand, walnut, bamboo, stone and moss materials.
- Avoid arbitrary color themes that make the controls look like a different product.

## Code and architecture

- Existing components are reference implementations and must pass regression tests.
- Prefer adding a new component in a new directory.
- Treat `core.js` as a shared critical dependency. Shared-engine changes require regression testing for all existing controls.
- The component source specification is `tools/spec.mjs`.
- `tools/docs.mjs` generates README files, demo pages, registry and AI-readable docs.
- `tools/build.mjs` embeds the shared core and configured assets into standalone component files.
- Do not hand-edit generated output without updating its source and regenerating.
- Keep the standalone custom-element delivery model. Framework examples may be provided, but framework packages must not become runtime requirements.
- Avoid adding dependencies without a clear need and documented justification.

## Required contribution content

A new component contribution must include, as applicable:

- Component source file.
- Specification entry.
- Live demo.
- Full component README.
- API and interaction documentation.
- Accessibility and responsive behavior.
- Original assets and documented provenance.
- Automated tests.
- Gallery wiring.
- Registry metadata.
- Updated component catalog and roadmap status.
- Screenshot evidence from a working implementation.
- Changelog entry.

## Verification before merge

Run:

```bash
node tools/build.mjs --check
node tools/docs.mjs --check
node tools/test.mjs http://localhost:8000/gallery/
```

Also verify component-specific tests, accessibility behavior, mobile layout, visual states and performance. Do not mark unrun tests as passed.

## Pull request description

Include:

- What component or behavior is changing.
- Why the design metaphor fits.
- API and compatibility changes.
- Asset changes and provenance.
- Tests actually run.
- Screenshots of the working component.
- Known limitations and follow-up work.
