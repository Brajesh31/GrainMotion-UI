# Transfer List

Two shallow walnut-edged trays hold small river stones. Select one or more stones in either tray, then move them across the channel. The selected set and each item's side remain ordinary data, ready for the host application to persist.

One of forty files in this repo. Same idea in each (an ordinary control made of sand that moves like sand), different control.

## Run it

```sh
python3 -m http.server 8000     # from the repo folder
# open http://localhost:8000/transfer-list/
```

`?embed=1` hides the heading and the hint.

## Use it

`transfer-list.js` is the whole control: one file of about 40 KB with the sand engine and its sounds inside it, and no dependencies.

```html
<script src="transfer-list.js"></script>
<sand-transfer-list id="fields" label="Included fields"></sand-transfer-list>
<script>
fields.items = [{ id: 'name', label: 'Name', side: 'left' }, { id: 'email', label: 'Email', side: 'right' }];
</script>
```

```js
const transfer = document.querySelector('sand-transfer-list');
transfer.addEventListener('transfer', event => saveFields(event.detail.items));
transfer.select(['name', 'email']);
transfer.moveSelected('right');
```

| attribute | what it sets | default |
|---|---|---|
| `label` | Accessible transfer control name | Transfer items |
| `disabled` | Disable selection and transfer actions | absent |
| `items` | Property array with id, label and side | empty |
| `selected` | Selected item ID array | empty |

- Each item uses `side: 'left'` or `side: 'right'`. An unknown or omitted side starts on the left.
- Click an item to toggle its selection. The selected property can also be assigned from application state.
- `move(ids,target)`, `moveSelected(target)` and `moveAll(target)` update side values and emit `transfer` plus `change`.
- The component does not fetch, filter or persist data. It only changes which tray owns each item.

## What happens

| you | it |
|---|---|
| select stones | the selected tiles lift against the walnut tray |
| move selected | the stones cross to the opposite compartment |
| move all | every enabled item in the source tray transfers |

## Limits

- The component is designed for compact option sets. Large data sets should be filtered or virtualized by the host application.
- **Needs WebGL2** to draw the sand. Without it the control still works with keys and a screen reader, but nothing is drawn.
- **One live tray per element.** Each is its own WebGL canvas, and browsers keep only about sixteen alive at once, so it is not for long lists.
- **It does not hold still for `prefers-reduced-motion`.** The sand still moves. If that matters on your page, use a plain control there.
- **Drawn for a light page.** The sand and the walnut frame are warm and light; they look pasted on over a dark background.
- **The sand is simulated at one cell per CSS pixel,** so a wider element costs more. Each scales to its CSS `width`; the height follows.
- **Sound is on** after the first touch or key on the page. `GrainMotionUI.Sound.on = false` turns every control quiet.
- **Checked in headless Chromium** with real touch and key events, with the CPU slowed four times. Not tried in Safari or Firefox, on a real phone, or with a screen reader.
