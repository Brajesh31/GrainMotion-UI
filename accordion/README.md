# 🪵 GrainMotion-UI Accordion

Small walnut lids cover separate sand compartments. Opening a lid lifts it slightly and reveals the compartment beneath. Closing it does not destroy content or reset form values.

## Run the demo
```sh
python3 -m http.server 8000
# open http://localhost:8000/accordion/
```

## Install and use
```html
<script src="accordion.js"></script>
<sand-accordion items="shipping:Shipping,returns:Returns,care:Care" value="shipping" label="Help topics">
  <template data-panel="shipping"><p>Shipping estimates and delivery methods.</p></template>
  <template data-panel="returns"><p>Return windows and exchange information.</p></template>
  <template data-panel="care"><p>Care instructions for your purchase.</p></template>
</sand-accordion>
```

## API

| Attribute / property | Description | Default |
|---|---|---|
| `items` | Comma-separated `id:Label` entries, optional `:disabled` suffix | Shipping, Returns, Care |
| `value` | Open item ID, or comma-separated IDs when `multiple` is present | First enabled item |
| `label` | Accessible group name | `Expandable sections` |
| `multiple` | Allow more than one panel to remain open | absent |
| `collapsible` | Allow the last open item to close in single mode | absent |
| `disabled-items` | Comma-separated disabled item IDs | none |
| `disabled` | Disable all disclosure controls | absent |

Add one `template[data-panel="id"]` per item. Templates are cloned once during `refresh()`; ordinary collapse/expand operations preserve the DOM and form values. Call `refresh()` after changing definitions or templates.

### Properties, methods and events
- `value`: active ID, or comma-separated IDs in multiple mode.
- `openItems`: array of currently open identifiers.
- `items`: parsed item definitions.
- `buttons`, `panels`: rendered header buttons and panel regions.
- `toggle(id)`: open or close one enabled item.
- `refresh()`: rebuild item controls and clone templates.
- `change`: bubbling, composed event with `detail = { value, openItems }`.

## Interaction and physical design

Each header is a walnut lid with a river-stone pull. The open lid rises from its frame and reveals a pale sand compartment with raked texture. Underlying content remains native DOM, so links, inputs and lists work normally. Sand grooves divide the compartments.

## Accessibility

Each header is a real button with `aria-expanded` and `aria-controls`. Each panel is a labelled region. Enter and Space use native button activation. Up/Down move focus between headers; Home and End jump to the first and last. Disabled items cannot open. Collapsed panels use the native `hidden` property.

## Limitations
- Up to five items.
- The `items` attribute uses comma-separated `id:Label` entries.
- This is a disclosure widget, not a nested tree view.
- Screen-reader and real-device verification is required beyond automated Chromium checks.
