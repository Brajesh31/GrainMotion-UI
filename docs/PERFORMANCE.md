# Performance and Rendering

## Current constraints

The current project uses a WebGL2 renderer and a sand height-field simulation. Existing component documentation records these constraints:

- The sand simulation is sized at roughly one simulation cell per CSS pixel.
- The rendered surface uses a WebGL2 shader.
- Each live component has its own WebGL canvas/context.
- Existing project docs warn that browsers keep only a limited number of WebGL contexts alive and cite about sixteen as a practical concern. This is an approximate warning, not a universal browser guarantee.
- Wider and larger live trays increase simulation work.
- The Thinking component is round; the other original controls use horizontal trays.
- The current controls do not fully honor `prefers-reduced-motion`.
- The existing test utility can run with CPU throttling through the companion look tool described in the GrainMotion-UI skill.

## Why expansion needs an explicit performance plan

A page with 50 components must not create 50 active WebGL renderers by default. Even a gallery with 50 preview cards could exceed context budgets or produce excessive CPU/GPU work.

## Recommended performance work

### 1. Lazy activation

- Keep preview cards static until they are near the viewport or explicitly activated.
- Initialize expensive canvases only when needed.
- Pause animation when a component is hidden or outside the viewport.
- Dispose of contexts and listeners when an instance is permanently removed.

### 2. Renderer budget

- Define a measured budget for simultaneously active sand canvases.
- Use a queue or prioritization strategy when more components request rendering than the budget permits.
- Investigate shared rendering infrastructure only after validating that it preserves isolation and the standalone-file contract.
- Provide a graceful non-WebGL presentation when the renderer cannot initialize.

### 3. Simulation and rendering

- Keep simulation resolution independent from device-pixel render resolution.
- Relax only the affected region where possible.
- Avoid allocating large arrays on every animation frame.
- Avoid unnecessary canvas resize operations.
- Keep pointer processing and simulation work bounded.
- Measure on a throttled CPU and at realistic mobile widths.

### 4. Lifecycle

Every new component must specify:

- When the WebGL context is created.
- When animation begins and stops.
- How resize is handled.
- How visibility changes affect rendering.
- What happens on `disconnectedCallback`.
- How listeners, observers, audio nodes and animation frames are released.
- How reconnection works.

### 5. Asset sizes

- Optimize textures and sprite assets.
- Embed only component-specific required assets.
- Record standalone file size and embedded asset size.
- Avoid unnecessary duplication when multiple controls are used on the same page, while preserving independent loading.

## Performance verification

Record these metrics for each component and the full gallery:

| Metric | Record |
|---|---|
| Initial load | Script bytes and time to first usable control |
| Initialization | Time to create and first render the component |
| Frame time | Median and p95 under normal and throttled CPU |
| Interaction | Input-to-visible-response latency |
| Memory | Canvas/context count and memory trends where tooling permits |
| Resize | Time and stability after width/height changes |
| Lifecycle | Resource cleanup after removal and re-connection |
| Gallery | Behavior with lazy previews and many cards |
| Fallback | Behavior when WebGL2 is unavailable |

## Acceptance target

The GrainMotion-UI skill currently suggests aiming for a median frame time around 16.7 ms on its four-times-slowed CPU measurement. Treat this as a project performance target, not a guarantee for every device or component. Report the test machine, browser, dimensions, throttling method and sample count.
