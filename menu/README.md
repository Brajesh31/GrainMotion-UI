# 🧭 GrainMotion-UI Menu / Popover

A river stone lifts from its carved anchor well and reveals a walnut-edged command tray. The tray stays close to its trigger and returns focus when dismissed by Escape or after an action is selected.

## Run the demo
```sh
python3 -m http.server 8000
# open http://localhost:8000/menu/
```

## Install and use
```html
<script src="menu.js"></script>
<sand-menu label="Project actions" items="new:New project,duplicate:Duplicate,archive:Archive:disabled"></sand-menu>
<script>
document.querySelector('sand-menu').addEventListener('select', event => {
  runProjectAction(event.detail.value);
});
</script>
```

## API

| Attribute / property | Description | Default |
|---|---|---|
| `items` | Comma-separated `value:Label` definitions; append `:disabled` to disable an item | New project, Duplicate, Archive |
| `label` | Trigger and menu accessible name | `Actions` |
| `open` | Reflects whether the menu is open | absent |
| `disabled` | Disables the trigger and prevents opening | absent |
| `keep-open` | Keep the menu open after selection | absent |

### Properties and methods
- `open`: get or set visibility.
- `disabled`: get disabled state.
- `trigger`: native trigger button.
- `menuItems`: current menuitem buttons.
- `refresh()`: rebuild items from the `items` attribute.
- `close(restoreFocus = true)`: close and optionally restore focus.

### Event
Selecting an enabled item dispatches a bubbling, composed `select` event with `detail = { value, label }`. It closes unless `keep-open` is present. The component does not execute the selected command.

## Keyboard and dismissal

The trigger opens by click, Enter or Space. ArrowDown opens and focuses the first enabled item; ArrowUp opens and focuses the last. Inside the menu, Up/Down move between enabled items and Home/End jump to the ends. Escape closes and returns focus to the trigger. Tab closes without trapping focus. An outside pointer press also dismisses the menu. The menu repositions on scroll and resize and stays within the viewport.

## Physical design and limitations

The stone trigger lifts slightly; the option tray is a walnut frame with inset sand-toned surfaces and raised action plates. This is a button-triggered command menu, not a general-purpose non-modal popover, dialog or full context menu. For rich interactive content or focus-trapped flows, use a dialog.

## Verification
Chromium automation covers open/close, focus, keyboard movement, selection, disabled items and outside dismissal. Actual assistive-technology and cross-browser behavior still need manual testing.
