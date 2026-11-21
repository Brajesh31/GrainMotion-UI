# Tooltip

A small stone of information appears beside the control that needs it. The hint is connected to its trigger through aria-describedby, opens on pointer hover or keyboard focus, and never steals focus from the control.

One of forty-five files in this repo. Same idea in each (an ordinary control made of sand that moves like sand), different control.

## Run it

```sh
python3 -m http.server 8000     # from the repo folder
# open http://localhost:8000/tooltip/
```

`?embed=1` hides the heading and the hint.

## Use it

`tooltip.js` is the whole control: one file of about 40 KB with the sand engine and its sounds inside it, and no dependencies.

```html
<script src="tooltip.js"></script>\n<button id="save" type="button">Save draft</button>\n<sand-tooltip for="save" text="Saves the current draft." placement="top" delay="250"></sand-tooltip>
```

```js
const tip = document.querySelector('sand-tooltip');\ntip.show(); // show it programmatically\ntip.hide(); // dismiss it without moving focus
```

| attribute | what it sets | default |
|---|---|---|
| `for` | ID of the trigger element in the same document | required |
| `text` | Tooltip message, inserted as text | empty |
| `placement` | Preferred placement: top, right, bottom or left | top |
| `delay` | Show delay in milliseconds, clamped to 0–2000 | 350 |
| `disabled` | Disable tooltip display | absent |
| `open` | Reflects open state | absent |

- The tooltip is associated with the trigger using `aria-describedby`. Existing description IDs are preserved and the tooltip's ID is removed on disconnect.
- Pointer hover and keyboard focus show the hint. Pointer exit, focus loss and Escape hide it; the tooltip itself never receives focus.
- Use `show()` and `hide()` for programmatic control, or read/write the `open` property.
- The tooltip only positions the hint. It does not add a trigger button or make a non-interactive element interactive.

## What happens

| you | it |
|---|---|
| hover or focus the trigger | a short delay lets the small information stone appear |
| press Escape | the tooltip closes without changing trigger focus |
| remove the tooltip | its described-by token and event listeners are cleaned up |

## Limits

- A tooltip is for short, non-interactive supplementary text. Use a dialog, popover or disclosure for content containing links, controls or longer instructions. `for` must resolve to an element in the same document.
- **Needs WebGL2** to draw the sand. Without it the control still works with keys and a screen reader, but nothing is drawn.
- **One live tray per element.** Each is its own WebGL canvas, and browsers keep only about sixteen alive at once, so it is not for long lists.
- **It does not hold still for `prefers-reduced-motion`.** The sand still moves. If that matters on your page, use a plain control there.
- **Drawn for a light page.** The sand and the walnut frame are warm and light; they look pasted on over a dark background.
- **The sand is simulated at one cell per CSS pixel,** so a wider element costs more. Each scales to its CSS `width`; the height follows.
- **Sound is on** after the first touch or key on the page. `GrainMotionUI.Sound.on = false` turns every control quiet.
- **Checked in headless Chromium** with real touch and key events, with the CPU slowed four times. Not tried in Safari or Firefox, on a real phone, or with a screen reader.
