# Drawer / Sheet

A wood-framed sheet moves in from the edge of the viewport, carrying a compact workspace or filter surface. It uses a native modal dialog for focus containment while the panel itself follows the selected edge.

One of fifty files in this repo. Same idea in each (an ordinary control made of sand that moves like sand), different control.

## Run it

```sh
python3 -m http.server 8000     # from the repo folder
# open http://localhost:8000/drawer/
```

`?embed=1` hides the heading and the hint.

## Use it

`drawer.js` is the whole control: one file of about 40 KB with the sand engine and its sounds inside it, and no dependencies.

```html
<script src="drawer.js"></script>\n<button id="filters" type="button">Open filters</button>\n<sand-drawer id="sheet" title="Filters" placement="right" size="360px">\n  <p>Choose the filters to apply.</p>\n</sand-drawer>\n<script>\nfilters.addEventListener('click', () => sheet.showModal());\n</script>
```

```js
const sheet = document.querySelector('sand-drawer');\nsheet.setAttribute('placement', 'bottom');\nsheet.showModal();\nsheet.addEventListener('drawer-close', event => saveSheetResult(event.detail.returnValue));
```

| attribute | what it sets | default |
|---|---|---|
| `open` | Reflects native modal open state | absent |
| `title` | Sheet heading | Details |
| `description` | Optional accessible description | empty |
| `placement` | left, right, top or bottom | right |
| `size` | Panel width or height as CSS length; clamped to viewport | 380px |
| `close-on-escape` | Allow Escape to close unless value is false | true |
| `close-on-backdrop` | Allow a click on the backdrop to close | absent |
| `action-label` | Show an optional primary action button | absent |
| `label` | Accessible name override | heading |

- The drawer uses a native modal `<dialog>` to enter the top layer and keep focus within the sheet.
- Set `placement` to `left`, `right`, `top` or `bottom`. The `size` attribute sets the width for side sheets or height for top/bottom sheets and is clamped to the viewport.
- Child DOM nodes are moved into the sheet body without parsing HTML. They remain real host-owned nodes.
- Escape closes by default. Backdrop closing is opt-in with `close-on-backdrop`. The optional action button emits `confirm` before closing.
- Listen for `drawer-open` and `drawer-close`. Focus returns to the opener if it is still connected.

## What happens

| you | it |
|---|---|
| call showModal() | the framed sheet enters from its configured edge |
| change placement | the panel switches to left, right, top or bottom |
| close the sheet | the native modal closes and focus returns to its opener |

## Limits

- The drawer is modal in this phase. Non-modal docked sidebars belong to the layout system. The component does not manage route changes, filter state or persistence.
- **Needs WebGL2** to draw the sand. Without it the control still works with keys and a screen reader, but nothing is drawn.
- **One live tray per element.** Each is its own WebGL canvas, and browsers keep only about sixteen alive at once, so it is not for long lists.
- **It does not hold still for `prefers-reduced-motion`.** The sand still moves. If that matters on your page, use a plain control there.
- **Drawn for a light page.** The sand and the walnut frame are warm and light; they look pasted on over a dark background.
- **The sand is simulated at one cell per CSS pixel,** so a wider element costs more. Each scales to its CSS `width`; the height follows.
- **Sound is on** after the first touch or key on the page. `GrainMotionUI.Sound.on = false` turns every control quiet.
- **Checked in headless Chromium** with real touch and key events, with the CPU slowed four times. Not tried in Safari or Firefox, on a real phone, or with a screen reader.
