# Split Pane

Two sand-backed work surfaces meet at a narrow walnut divider. Move the divider to give the primary workspace or its inspector more room. Content remains ordinary DOM supplied by the host; the component only controls the split and its accessible separator.

One of forty-five files in this repo. Same idea in each (an ordinary control made of sand that moves like sand), different control.

## Run it

```sh
python3 -m http.server 8000     # from the repo folder
# open http://localhost:8000/split-pane/
```

`?embed=1` hides the heading and the hint.

## Use it

`split-pane.js` is the whole control: one file of about 40 KB with the sand engine and its sounds inside it, and no dependencies.

```html
<script src="split-pane.js"></script>
<sand-split-pane value="62" axis="horizontal" label="Editor layout">
  <section slot="start">Editor content</section>
  <aside slot="end">Inspector content</aside>
</sand-split-pane>
```

```js
const split = document.querySelector('sand-split-pane');
split.addEventListener('input', event => previewRatio(event.detail.value));
split.value = 68; // first pane receives 68 percent
```

| attribute | what it sets | default |
|---|---|---|
| `value` | First pane size as a percentage | 58 |
| `axis` | `horizontal` (left/right) or `vertical` (top/bottom) | horizontal |
| `min-size` / `max-size` | Minimum and maximum first-pane percentage | 20 / 80 |
| `disabled` | Disable pointer and keyboard resizing | absent |
| `label` | Accessible separator name | Resize panes |

- Place content in direct children with `slot="start"` and `slot="end"`. Content nodes are moved into the two scrollable pane containers without parsing HTML strings.
- `value` is the first pane's percentage. The second pane receives the remaining space after the divider.
- Drag the divider with a pointer or focus it and use the axis arrows, Home or End. The separator exposes `role="separator"` and its current value.
- `input` fires while the divider moves; `change` fires when a pointer drag completes or a keyboard adjustment commits.

## What happens

| you | it |
|---|---|
| drag the divider | one pane grows while the other gives up the same space |
| press an axis arrow | the divider moves by the configured step |
| press Home or End | the first pane moves to its minimum or maximum |

## Limits

- This component provides a single two-pane split. It does not persist sizes, coordinate nested layouts or manage application routing.
- **Needs WebGL2** to draw the sand. Without it the control still works with keys and a screen reader, but nothing is drawn.
- **One live tray per element.** Each is its own WebGL canvas, and browsers keep only about sixteen alive at once, so it is not for long lists.
- **It does not hold still for `prefers-reduced-motion`.** The sand still moves. If that matters on your page, use a plain control there.
- **Drawn for a light page.** The sand and the walnut frame are warm and light; they look pasted on over a dark background.
- **The sand is simulated at one cell per CSS pixel,** so a wider element costs more. Each scales to its CSS `width`; the height follows.
- **Sound is on** after the first touch or key on the page. `GrainMotionUI.Sound.on = false` turns every control quiet.
- **Checked in headless Chromium** with real touch and key events, with the CPU slowed four times. Not tried in Safari or Firefox, on a real phone, or with a screen reader.
