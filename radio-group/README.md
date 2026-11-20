# GrainMotion-UI Radio Group

A row of individually pressed wells holds a small stone for each choice. The selected stone rises slightly and glides to the chosen well; the other pebbles remain settled in their own impressions.

A row of river stones marks one selected option in a series of sand wells.

> **Implementation status:** Phase 1 component. This document describes the repository implementation. The component is a standalone custom element bundled with the GrainMotion-UI sand engine.

![Radio Group physical interaction concept](assets/concept.svg)

*Concept diagram, not a runtime screenshot. See the live demo for the implementation.*

## 1. Run the demo

From the repository root:

```bash
python3 -m http.server 8000
```

Open [http://localhost:8000/radio-group/](http://localhost:8000/radio-group/).

The demo uses the same light page, walnut frame, sand surface, dark stones and typography as the original four components.

## 2. Installation

The component is distributed as one standalone JavaScript file. It includes the shared engine and the sound assets it uses.

```bash
npx shadcn add Brajesh31/GrainMotion-UI/radio-group
```

Or copy `radio-group.js` into your project and load it using a normal script tag:

```html
<script src="radio-group.js"></script>
<sand-radio-group
  name="size"
  label="Choose a size"
  options="Small,Medium,Large"
  value="Medium"></sand-radio-group>
```

Do not load the file as an ES module. It registers its custom element when evaluated.

## 3. Basic JavaScript usage

```js
const group = document.querySelector('sand-radio-group');
group.addEventListener('change', () => {
  console.log('Selected size:', group.value);
});
group.value = 'Large';
```

## 4. Attributes

| Attribute | Purpose | Default |
|---|---|---|
| `options` | Comma-separated option labels, up to five | Pebble 1,Pebble 2,Pebble 3 |
| `value` | Initially selected option | First option |
| `label` | Accessible group name | Choose an option |
| `disabled` | Disables all choices | absent |
| `name` | Form field name |  |

## 5. Properties

- `value: string`
- `options: string[] (read-only parsed getter)`
- `disabled: boolean`

The element is form-associated. Give it a `name` attribute to include its value in a parent form. See the form behavior below for the exact serialization.

## 6. Events

- input, emitted when the selected option changes
- change, emitted when the selected option changes

Events bubble so a parent component can listen for them. The `input` event is intended for live updates; `change` indicates a committed selection or completed pointer adjustment.

## 7. Interaction behavior

Choose a pebble well with the pointer, or focus the selected option and use the arrow keys.

| User action | Expected behavior |
|---|---|
| Pointer selection | Updates the value and moves the physical marker through the sand. |
| Keyboard selection | Uses the documented keys and updates accessible state. |
| Value changed through JavaScript | Updates the marker target and form value. |
| Disabled | Prevents user changes and removes the control from normal keyboard interaction. |
| Sound muted | The control remains fully usable without audio. |

## 8. Accessibility

- The custom element exposes a role and accessible name appropriate to the control.
- State or value is reflected through ARIA attributes.
- Keyboard interactions are documented above.
- Focus must remain visible in the host page.
- The visual sand pattern is supplementary. Do not rely on motion or sound alone to communicate the value.

For the Radio Group and Segmented Control, visually hidden native buttons expose the individual radio options to assistive technology. For Range Slider, two visually hidden slider handles expose independent lower and upper values.

## 9. Form integration

The component uses the browser form-associated custom element API. The parent form receives its value when a `name` is present.

```html
<form id="settings">
    value="Medium"></sand-radio-group>
  <button type="submit">Save</button>
</form>
```

The selected option is submitted as its string value.

Form reset restores the initial value. The browser's form-disabled callback is supported.

## 10. Responsive behavior

- The element scales to its CSS width; its height follows its aspect ratio.
- Use a width large enough for the labels and physical interaction to remain legible.
- The demo page is responsive and avoids relying on a fixed desktop-only width.
- Verify the component in the actual host layout, especially when embedded in narrow cards or dialogs.

## 11. Sound design

The control reuses the project's existing recorded stone, tap and settling sounds. Sound is initialized after a user gesture by the shared engine. Set `window.GrainMotionUI.Sound.on = false` to mute the library.

Sound is optional feedback. It is not required to operate the control or understand its current value.

## 12. Performance and lifecycle

- The component uses the shared WebGL2 sand renderer and a 2D overlay for its physical details.
- Each live element currently creates its own WebGL canvas/context.
- Avoid mounting large numbers of live instances simultaneously.
- The host element stops its animation loop when disconnected, following the current shared engine lifecycle.
- The shared engine's broader context and observer cleanup limitations are tracked in [the performance plan](../docs/PERFORMANCE.md).

## 13. Browser requirements

WebGL2 is required for the sand rendering. The current project test baseline is Chromium headless. Safari, Firefox, real devices and screen-reader/browser combinations have not yet been fully verified. See [browser support](../docs/BROWSER-SUPPORT.md).

## 14. Known limitations

- This is an early Phase 1 implementation and needs wider real-device and assistive-technology verification.
- The sand rendering is a visual layer over a functional custom element. When WebGL2 is unavailable, the visual treatment may not render.
- Reduced-motion behavior is not yet fully implemented in the shared engine.
- Options are configured as comma-separated labels and are limited to five choices in this first implementation. A comma cannot be part of an option label.

## 15. Troubleshooting

| Problem | Check |
|---|---|
| Element is blank | Confirm the script path is correct and the browser supports WebGL2. |
| No sound | Interact with the page first and confirm the shared sound setting is enabled. |
| No form value | Add a `name` attribute and confirm the element is inside a form. |
| The control is too small | Set a larger CSS width and check the available layout space. |
| Keyboard interaction does not work | Focus the component or its accessible option/handle, then use the listed keys. |

## 16. Examples

### Listen for changes

```js
const control = document.querySelector('sand-radio-group');
control.addEventListener('change', event => {
  console.log('New value:', control.value ?? control.checked);
});
```

### Mute GrainMotion-UI

```js
window.GrainMotionUI.Sound.on = false;
```

## 17. Related documentation

- [Project component catalog](../docs/COMPONENT-CATALOG.md)
- [Design system](../docs/DESIGN-SYSTEM.md)
- [Accessibility standards](../docs/ACCESSIBILITY.md)
- [Performance requirements](../docs/PERFORMANCE.md)
- [Testing strategy](../docs/TESTING.md)
- [Component creation guide](../docs/COMPONENT-CREATION-GUIDE.md)

## 18. Changelog

- **Phase 1:** Initial implementation and documentation.

