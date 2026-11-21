# Sortable List

A row of small stone tiles rests in individually carved grooves. Drag a tile to another position, use the keyboard to move it, or press the raised arrow controls. The data order is real and is reported to the host application; the sand marker simply follows the active row.

One of forty-five files in this repo. Same idea in each (an ordinary control made of sand that moves like sand), different control.

## Run it

```sh
python3 -m http.server 8000     # from the repo folder
# open http://localhost:8000/sortable/
```

`?embed=1` hides the heading and the hint.

## Use it

`sortable.js` is the whole control: one file of about 40 KB with the sand engine and its sounds inside it, and no dependencies.

```html
<script src="sortable.js"></script>
<sand-sortable id="tasks" label="Project tasks"></sand-sortable>
<script>
tasks.items = [{ id: 'brief', label: 'Prepare brief' }, { id: 'build', label: 'Build prototype' }];
</script>
```

```js
const list = document.querySelector('sand-sortable');
list.addEventListener('reorder', event => saveOrder(event.detail.order));
list.move(1, 0); // move the second item to the first position
list.value;       // stable IDs in current order
```

| attribute | what it sets | default |
|---|---|---|
| `label` | Accessible list name | Sortable list |
| `disabled` | Disable dragging and move actions | absent |
| `items` | Property array of {id,label,disabled} objects | empty |
| `value` | Ordered array of stable item IDs | items order |

- Set `items` as a property array. IDs must be unique; labels are rendered as text, not interpreted as HTML.
- Drag a row with a mouse, use Arrow Up/Down or Home/End on its handle, or use the visible Move Up/Down buttons.
- `move(fromIndex,toIndex)` moves one row. `reorder` and `change` expose the item, indices, updated items and ordered ID array.
- Disabled items cannot be dragged or moved through the component API.

## What happens

| you | it |
|---|---|
| drag a tile | the row lifts and settles into the new position |
| press Arrow Up/Down | the focused handle reorders the tile and stays focused |
| use Move Up/Down | the tile moves one place and the stone marker follows |

## Limits

- The component manages list order only. Persistence, server synchronization, virtualization and application-specific validation belong to the host.
- **Needs WebGL2** to draw the sand. Without it the control still works with keys and a screen reader, but nothing is drawn.
- **One live tray per element.** Each is its own WebGL canvas, and browsers keep only about sixteen alive at once, so it is not for long lists.
- **It does not hold still for `prefers-reduced-motion`.** The sand still moves. If that matters on your page, use a plain control there.
- **Drawn for a light page.** The sand and the walnut frame are warm and light; they look pasted on over a dark background.
- **The sand is simulated at one cell per CSS pixel,** so a wider element costs more. Each scales to its CSS `width`; the height follows.
- **Sound is on** after the first touch or key on the page. `GrainMotionUI.Sound.on = false` turns every control quiet.
- **Checked in headless Chromium** with real touch and key events, with the CPU slowed four times. Not tried in Safari or Firefox, on a real phone, or with a screen reader.
