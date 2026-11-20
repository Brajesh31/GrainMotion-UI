# Design System

## Design intent

GrainMotion-UI treats a UI control as a small physical object in a tray of sand. Sand is not a decorative flat texture. Interaction changes its height, grooves, ridges and settling behavior. The frame, tools and stones should make the interaction feel materially believable.

The four original components establish the reference language:

- Slider: bamboo rake, parallel grooves, displaced ridge and walnut frame.
- Toggle: river stone, carved seal/symbol and persistent wake.
- Signature: bamboo stylus, pressure/speed-sensitive strokes and sand piled along the line.
- Thinking: basalt-like stone and distinct self-raked patterns for different states.

## Observed visual baseline

The values below are taken from current repository styles and shader source. Some material colors are approximations from the shader's RGB values, not a formal token system yet.

| Token | Current value / approximation | Observed use |
|---|---|---|
| Page background | `#E9E4DA` | Warm light page surface |
| Card background | `#F1EDE5` | Component cards |
| Main ink | `#2B2A27` | Text |
| Muted text | `#7C766B` | Secondary copy |
| Divider | `#D6CEC0` | Fine borders and separators |
| Sand base | approximately `#F0E1C4` | Shader sand color |
| Walnut frame | approximately `#604632` | Tray frame and dark wood |
| Moss accent | approximately `#96A654` | Optional natural surface accent |
| Stone | approximately `#5C5E60` | Dark stone material |
| Bamboo | natural warm tan | Tools and styluses; exact shared token not yet defined |

## Material language

### Sand

- Use detailed, fine-grain surfaces with visible relief.
- Grooves should have highlights and shadows, not look like painted lines.
- Displaced sand should be conserved: material removed from one place should form ridges or piles elsewhere.
- Sand must settle naturally after the user releases or moves an object.
- Avoid noisy, excessive sparkle or overly glossy rendering.

### Walnut and wood

- Use dark warm brown frames with restrained bevels.
- Wood should feel tactile and grounded, not like black plastic.
- Maintain consistent frame thickness and rounded geometry unless a component's form requires a different physical construction.

### River stones and basalt

- Use rounded, naturally irregular shapes.
- Keep dark stones matte or subtly satin, with believable highlights and soft cast shadows.
- A stone must have a purpose in the interaction. Do not place decorative rocks without a functional role.

### Bamboo and tools

- Tools should be simple, slender and visibly material-specific.
- A rake, stylus or marker should visibly contact and displace sand.
- Do not reuse the exact same tool for every component.

## Shape and composition

- Original controls favor rounded horizontal trays and simple, centered compositions.
- Circular trays are appropriate for radial patterns, timers and progress rings.
- Larger boards and panels can use rectangular wooden boundaries.
- Give each component enough sand surface to make its interaction legible.
- Keep labels and readouts outside the simulated surface when they are not part of the physical control itself.

## Motion

- Motion should communicate weight, friction and displaced material.
- Heavy stones should glide and settle rather than snap.
- Rakes and styluses should leave a physically coherent trail.
- Transitions must not erase or teleport material without a reason.
- Make animation speed appropriate to the metaphor. Do not apply one universal duration to every interaction.
- Respect `prefers-reduced-motion`; the current originals do not fully meet this target, so this is an identified gap, not an existing guarantee.

## Sound

- Sounds should correspond to visible and meaningful actions.
- Use subtle scraping, tapping, settling and movement sounds.
- Never play sounds for invisible interactions.
- Keep a reliable global mute path through `GrainMotionUI.Sound.on`.
- Audio must not be required to understand state or complete a task.

## Accessibility and contrast

- The physical surface is an enhancement, not the only source of information.
- State must be available through semantic HTML, ARIA and visible readouts as appropriate.
- Preserve visible focus.
- Do not communicate selected/error/success only by color or sound.
- Provide keyboard and non-drag alternatives for interactions that otherwise require precision pointer movement.

## Proposed component-level tokens

A formal token file is not present yet. When implemented, define shared tokens for:

- Page/card/surface/text/muted/border colors.
- Sand, walnut, bamboo, stone and moss material colors.
- Frame thickness, corner radii and inset depths.
- Lighting direction, shadow softness and highlight intensity.
- Tool widths, stone dimensions and minimum hit targets.
- Transition curves and motion durations by interaction type.
- Sound names, gain defaults and mute behavior.

Do not duplicate token values independently across every demo and component. One validated token source should drive reusable styles where feasible.

## Review questions

Before approving a new visual concept, ask:

1. Is the physical metaphor immediately understandable?
2. Does the object actually interact with sand?
3. Is there one distinctive interaction idea?
4. Does the surface remain readable at the intended size?
5. Does it look related to the original four without being a copy?
6. Does the motion preserve the impression of real material?
7. Can the control still be used without seeing or hearing the animation?
