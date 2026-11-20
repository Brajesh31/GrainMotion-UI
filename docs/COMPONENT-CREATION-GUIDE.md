# Component Creation Guide

This guide describes how to create a new GrainMotion-UI control while preserving the design, architecture and documentation standards of the original four.

## 1. Start with the real control

Write down the standard UI behavior before designing the sand metaphor:

- What is the control's purpose?
- What values or states does it own?
- What are its keyboard interactions?
- What events does it dispatch?
- Does it submit a form value?
- What is its disabled, read-only, invalid or loading behavior?
- What assistive-technology semantics are required?

A control that does not work without its animation is not finished.

## 2. Choose one physical idea

Choose a physical object and action that make the control understandable. Examples already established by the originals:

- Slider: rake position and carved grooves.
- Toggle: stone travel and an uncovered symbol.
- Signature: stylus stroke and displaced sand.
- Thinking: distinct sand patterns for distinct states.

For a new component, make the physical idea distinct. Avoid merely changing the shape or color of a slider.

## 3. Write the interaction specification

Before coding, document:

| Topic | Questions |
|---|---|
| Initial state | What does the untouched component look like? |
| User action | What can the user click, drag, type, press or select? |
| Physical response | What part moves and how does it displace sand? |
| Completion | What indicates that the action has finished? |
| Reversal | How does undo, deselection or reset work? |
| Feedback | What visual and sound feedback is meaningful? |
| Accessibility | How does a user perform the same action without the visual metaphor? |
| Lifecycle | What happens on resize, hide, disconnect and reconnect? |

## 4. Inspect the engine

Read:

- [core.js](../core.js)
- [GrainMotion-UI skill](../skills/grainmotion-ui/SKILL.md)
- [starter.html](../skills/grainmotion-ui/starter.html)

The skill describes the `SandTray` lifecycle and helpers. Verify all internal APIs against current source before depending on them. Do not copy internal assumptions from another component without checking whether they fit the new geometry.

## 5. Implement the custom element

The current pattern extends `SandTray` and uses its lifecycle:

- `aspect` defines the component's height/width ratio.
- `init()` sets up semantics, event listeners and keyboard behavior.
- `layout()` initializes geometry and sand state.
- `step(dt)` advances animation and simulation.
- `sprites()` paints tools or other overlays.

Implementation requirements:

- Use a unique `sand-*` element name.
- Expose a predictable property/attribute API.
- Reflect attributes and properties consistently where appropriate.
- Dispatch documented events with sensible timing.
- Keep the component usable if sound is unavailable.
- Preserve sand volume when carving or pushing.
- Handle pointer cancellation and touch scrolling correctly.
- Clean up animation, listeners, observers and audio resources when disconnected.
- Provide a reduced-motion behavior.
- Do not assume a WebGL context will always be available.

## 6. Add sound and artwork only when needed

- Add component-specific sounds in `sounds/`.
- Configure embedding in `tools/build.mjs`.
- Add required sprite assets under a clear asset path.
- Keep only required assets in the standalone file.
- Record provenance and optimization information in the asset catalog.
- Make every sound optional and respect the shared mute setting.

## 7. Add the component to the source specification

Add a structured entry to `tools/spec.mjs` with accurate:

- ID, display name, custom-element tag and categories.
- Description and physical concept.
- Detailed introduction.
- Demo markup, instructions and wiring script.
- Usage example.
- JavaScript API example.
- Attributes and defaults.
- Keyboard and accessibility notes.
- Interaction behavior table.
- Known component-specific limits.

The current specification is intentionally concise and generated content depends on its fields. When expanding it, update `tools/docs.mjs` in the same change to generate the additional API, accessibility and design documents consistently.

## 8. Create demo and documentation

Generate existing standard outputs with:

```bash
node tools/docs.mjs
```

Then add or update the complete component docs described in [the roadmap](ROADMAP.md). Include screenshots of the running component; label generated concept art as concept art, not as a working screenshot.

## 9. Build standalone distribution

Configure the component and its required sounds/art in `tools/build.mjs`, then run:

```bash
node tools/build.mjs
node tools/build.mjs --check
```

Confirm the built file works alone with a plain script tag and does not require the shared `core.js` to be fetched separately.

## 10. Test and inspect

Run the build/docs checks and existing regression test. Add dedicated tests for the new component:

- API/defaults and state behavior.
- Keyboard, pointer and touch workflows.
- Forms and validation where applicable.
- Accessibility and focus management.
- Responsive and resize behavior.
- Lifecycle cleanup and reconnection.
- Reduced motion and no-WebGL fallback.
- Performance on a throttled CPU.

Inspect screenshots at multiple points in the animation. Do not rely solely on one initial screenshot.

## 11. Update project-wide records

Update:

- [Component catalog](COMPONENT-CATALOG.md).
- [Roadmap](ROADMAP.md).
- [Asset catalog](ASSET-CATALOG.md) when assets change.
- [Accessibility](ACCESSIBILITY.md) when behavior or requirements change.
- [Testing](TESTING.md) with test coverage.
- [Browser support](BROWSER-SUPPORT.md) with actual results.
- Main README and `llms.txt` via the generator.
- Registry metadata via the generator.

## 12. Definition of done

The component is complete only when its source, working demo, generated outputs, full docs, assets, tests, accessibility path, lifecycle behavior and performance review are all ready. The original four must still pass their regression tests.
