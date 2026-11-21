# Resizable Panels

Several sand-backed panels sit behind thin walnut partitions. Each divider balances the two adjacent sections while keeping their combined width unchanged. The panel metadata and percentages are public state, so a dashboard can save and restore its layout.

One of fifty files in this repo. Same idea in each (an ordinary control made of sand that moves like sand), different control.

## Run it

```sh
python3 -m http.server 8000     # from the repo folder
# open http://localhost:8000/resizable/
```

`?embed=1` hides the heading and the hint.

## Use it

`resizable.js` is the whole control: one file of about 40 KB with the sand engine and its sounds inside it, and no dependencies.

```html
<script src="resizable.js"></script>
<sand-resizable id="layout" label="Dashboard panels"></sand-resizable>
<script>
layout.panels = [{ id: 'summary', label: 'Summary', content: 'Key metrics' }, { id: 'activity', label: 'Activity', content: 'Recent events' }, { id: 'details', label: 'Details', content: 'Selected record' }];
</script>
```

```js
const layout = document.querySelector('sand-resizable');
layout.addEventListener('change', event => savePanelSizes(event.detail.sizes));
layout.resizeBoundary(0, 6); // grow panel 1 by six percentage points
```

| attribute | what it sets | default |
|---|---|---|
| `panels` | Property array of two to four panel descriptors | Three sample panels |
| `sizes` | Panel size percentages; values sum to 100 | Equal or default layout |
| `disabled` | Disable all resize handles | absent |
| `label` | Accessible layout group name | Resizable panels |

- Each panel descriptor accepts `id`, `label`, `content`, `min` and `max`. Content is rendered as text, not HTML.
- Read or set `sizes` as percentages. Use `resizeBoundary(index,delta)` to adjust the panel pair on either side of a divider.
- Each divider is a focusable `role="separator"`. Arrow Left/Right and Home/End provide keyboard resizing; pointer dragging works with mouse and touch.
- `input` is emitted during pointer changes and `change` is emitted on commit. The host is responsible for persisting sizes.

## What happens

| you | it |
|---|---|
| drag a partition | one panel gains space while its neighbor gives up the same amount |
| use arrow keys | the focused partition moves in small increments |
| save sizes | the host stores the public percentage array |

## Limits

- This component intentionally renders panel descriptions as text. Mount full application content in adjacent layout regions rather than injecting arbitrary HTML into panel descriptors.
- **Needs WebGL2** to draw the sand. Without it the control still works with keys and a screen reader, but nothing is drawn.
- **One live tray per element.** Each is its own WebGL canvas, and browsers keep only about sixteen alive at once, so it is not for long lists.
- **It does not hold still for `prefers-reduced-motion`.** The sand still moves. If that matters on your page, use a plain control there.
- **Drawn for a light page.** The sand and the walnut frame are warm and light; they look pasted on over a dark background.
- **The sand is simulated at one cell per CSS pixel,** so a wider element costs more. Each scales to its CSS `width`; the height follows.
- **Sound is on** after the first touch or key on the page. `GrainMotionUI.Sound.on = false` turns every control quiet.
- **Checked in headless Chromium** with real touch and key events, with the CPU slowed four times. Not tried in Safari or Firefox, on a real phone, or with a screen reader.
