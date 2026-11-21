# 🗂️ GrainMotion-UI Tabs

A tactile tab system built around a flat river-stone marker that glides between shallow, individually carved wells. The stone is the selected state, while each panel remains real HTML content.

## Run the demo
```sh
python3 -m http.server 8000
# open http://localhost:8000/tabs/
```

## Install and use
```html
<script src="tabs.js"></script>
<sand-tabs tabs="overview:Overview,activity:Activity,settings:Settings" value="overview" label="Project sections">
  <template data-panel="overview"><h3>Overview</h3><p>Actual application content lives here.</p></template>
  <template data-panel="activity"><h3>Recent activity</h3><p>Recent events and updates.</p></template>
  <template data-panel="settings"><h3>Settings</h3><p>Preferences and configuration.</p></template>
</sand-tabs>
```

The file embeds the shared engine and two short sound cues. It has no framework or package dependency.

## API

| Attribute / property | Description | Default |
|---|---|---|
| `tabs` | Comma-separated `id:Label` definitions, up to six | Overview, Activity, Settings |
| `value` | Selected tab identifier; reflected as an attribute | First enabled tab |
| `label` | Accessible name for the tab group | `Content tabs` |
| `orientation` | `horizontal` or `vertical` | `horizontal` |
| `activation` | `automatic` activates on arrow focus; `manual` requires Enter or Space | `automatic` |
| `disabled-tabs` | Comma-separated tab IDs that cannot be selected | none |

Place a `template[data-panel="id"]` child inside the element for each panel. Template contents are cloned into the rendered tabpanel. This preserves authored markup at initialization. Call `refresh()` after changing tab definitions or templates.

### Properties and events
- `value`: read or set the selected tab ID.
- `tabs`: parsed tab definitions.
- `buttons` and `panels`: rendered native buttons and panel elements.
- `refresh()`: rebuilds tab controls and panel associations.
- `change`: bubbling, composed event with `detail = { value, previousValue, index }`.

## Interaction and physical design

The marker is a rounded, low-profile river stone with a soft shadow and natural grey material. Each tab has shallow raked grooves. The marker eases between carved wells instead of teleporting. The selected label sits over the stone; panel content sits on a pale inset sand-paper surface. The marker moves immediately when reduced motion is requested.

## Accessibility

Creates a `tablist`, `tab` buttons, and labelled `tabpanel` elements. Maintains `aria-selected`, `aria-controls`, `aria-labelledby`, and roving `tabindex`. Horizontal lists use Left/Right; vertical lists use Up/Down. Home and End move focus to the first and last tab. Disabled IDs are skipped. Manual mode activates with Enter or Space.

## Limitations and verification
- Up to six tab definitions.
- Definitions use comma-separated `id:Label` pairs. Avoid commas and colons inside IDs or labels.
- There is no built-in router or data loader. The host application owns panel data.
- Chromium automation covers selection, activation mode, disabled tabs, orientation, panel relationships, events and refresh. Real screen-reader and device verification remains required.
- WebGL2 is required for the sand texture, not for tab buttons or panel content.
