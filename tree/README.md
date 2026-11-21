# Tree View

Branches are carved into a sand bed, with a river stone marking the selected node. Expand and collapse folders to reveal paths; the tree remains a real nested data structure and uses a roving keyboard focus model for navigation.

One of forty files in this repo. Same idea in each (an ordinary control made of sand that moves like sand), different control.

## Run it

```sh
python3 -m http.server 8000     # from the repo folder
# open http://localhost:8000/tree/
```

`?embed=1` hides the heading and the hint.

## Use it

`tree.js` is the whole control: one file of about 40 KB with the sand engine and its sounds inside it, and no dependencies.

```html
<script src="tree.js"></script>
<sand-tree id="files" label="Project files"></sand-tree>
<script>
files.items = [{ id: 'src', label: 'src', children: [{ id: 'components', label: 'components' }] }];
files.expanded = ['src'];
</script>
```

```js
const tree = document.querySelector('sand-tree');
tree.addEventListener('select', event => openNode(event.detail.value));
tree.value = 'components';
tree.toggle('src');
```

| attribute | what it sets | default |
|---|---|---|
| `items` | Nested property array with id, label, children and disabled | Sample project tree |
| `value` | Selected node ID | First active node |
| `expanded` | Array of expanded parent IDs | Workspace and src |
| `disabled` | Disable selection and expansion | absent |
| `label` | Accessible tree name | Tree view |

- Each node accepts `id`, `label`, `disabled` and a nested `children` array. IDs must be unique across the whole tree.
- Set `expanded` to restore expanded branches. `toggle(id)` expands or collapses a parent; `select(id)` sets the active node.
- Arrow Up/Down moves through visible nodes, Arrow Right expands or enters a child, Arrow Left collapses or moves to the parent, and Home/End move to the first/last visible node.
- The tree emits `select` and `change` for selection, and `expand` for branch changes. The host owns loading children and persistence.

## What happens

| you | it |
|---|---|
| expand a branch | child rows appear under the carved path |
| select a node | the marker settles beside the active branch |
| use arrow keys | focus follows the visible hierarchy without leaving the tree |

## Limits

- The component renders the supplied tree in one DOM pass. Lazy loading, virtualized very large trees, checkbox selection and context menus are host responsibilities.
- **Needs WebGL2** to draw the sand. Without it the control still works with keys and a screen reader, but nothing is drawn.
- **One live tray per element.** Each is its own WebGL canvas, and browsers keep only about sixteen alive at once, so it is not for long lists.
- **It does not hold still for `prefers-reduced-motion`.** The sand still moves. If that matters on your page, use a plain control there.
- **Drawn for a light page.** The sand and the walnut frame are warm and light; they look pasted on over a dark background.
- **The sand is simulated at one cell per CSS pixel,** so a wider element costs more. Each scales to its CSS `width`; the height follows.
- **Sound is on** after the first touch or key on the page. `GrainMotionUI.Sound.on = false` turns every control quiet.
- **Checked in headless Chromium** with real touch and key events, with the CPU slowed four times. Not tried in Safari or Firefox, on a real phone, or with a screen reader.
