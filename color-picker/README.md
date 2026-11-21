# Color Picker

A pigment well holds a mineral sample. The native color input opens the browser's color chooser, while named mineral stones provide quick selections without replacing native keyboard and platform behavior.

One of thirty-five files in this repo. Same idea in each (an ordinary control made of sand that moves like sand), different control.

## Run it

```sh
python3 -m http.server 8000     # from the repo folder
# open http://localhost:8000/color-picker/
```

`?embed=1` hides the heading and the hint.

## Use it

`color-picker.js` is the whole control: one file of about 30 KB with the sand engine and its sounds inside it, and no dependencies.

```html
<script src="color-picker.js"></script>
<sand-color-picker name="accent" value="#c28b55" format="hex" label="Accent color"></sand-color-picker>
```

```js
const picker = document.querySelector('sand-color-picker');
picker.addEventListener('input', event => preview(event.detail.hex));
picker.addEventListener('change', event => save(event.detail.value));
picker.value = '#547d73';
```

| attribute | what it sets | default |
|---|---|---|
| value | Selected CSS color; normalized to #rrggbb | #c28b55 |
| format | hex, rgb or hsl readout and submitted value | hex |
| label | Accessible name for the native color control | Choose a colour |
| name | Form field name | absent |
| disabled | Disable color input and mineral swatches | absent |

- The browser's native input[type=color] opens the platform color chooser. The component does not emulate a custom hue/saturation canvas.
- Preset mineral stones select named values. input and change events expose detail.value in the selected format and detail.hex in normalized hexadecimal.
- When a name is present, the normalized selected value is submitted through ElementInternals. The component participates in form reset and disabled-state callbacks.

## What happens

| you | it |
|---|---|
| choose a pigment stone | the sample well changes to that mineral color |
| open the native chooser | the browser color dialog is used |
| change format | the displayed and submitted value is represented as hex, rgb or hsl |

## Limits

- Exact appearance of the native color dialog is browser/OS controlled.
- CSS color names and rgb/hsl strings are normalized to 6-digit hex; alpha/transparency is not preserved.
- **Needs WebGL2** to draw the sand. Without it the control still works with keys and a screen reader, but nothing is drawn.
- **One live tray per element.** Each instance creates its own WebGL canvas and animation loop.
- **Light backgrounds recommended.** The materials are drawn for a light page.
- **No runtime dependencies.** Load the standalone script with a plain script tag, not as a module.
