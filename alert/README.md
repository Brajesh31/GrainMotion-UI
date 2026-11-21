# Alert Banner

A broad raised strip of sand holds a mineral marker beside a message that should remain visible until it is resolved. Unlike a toast, an alert does not disappear on a timer.

One of forty-five files in this repo. Same idea in each (an ordinary control made of sand that moves like sand), different control.

## Run it

```sh
python3 -m http.server 8000     # from the repo folder
# open http://localhost:8000/alert/
```

`?embed=1` hides the heading and the hint.

## Use it

`alert.js` is the whole control: one file of about 30 KB with the sand engine and its sounds inside it, and no dependencies.

```html
<script src="alert.js"></script>\n<sand-alert tone="warning" title="Storage almost full" message="Remove unused files to continue." dismissible></sand-alert>
```

```js
const alert = document.querySelector('sand-alert');\nalert.addEventListener('action', () => openStorageSettings());\nalert.addEventListener('dismiss', () => markNoticeHidden());
```

| attribute | what it sets | default |
|---|---|---|
| `tone` | info, success, warning or error | info |
| `title` | Optional banner heading | empty |
| `message` | Banner body text | empty |
| `dismissible` | Show a close button | absent |
| `action-label` | Optional action button text | absent |
| `dismissed` | Reflects whether the banner is hidden | absent |

- The alert uses `role=status` with polite announcements for info/success, and `role=alert` with assertive announcements for warning/error.
- Set `dismissible` to show the close control. Call `dismiss()` programmatically or `show()` to restore it.
- The optional action button dispatches an `action` event. The alert does not close automatically after an action.
- Message and title are inserted as text. Application state, persistence and remediation remain host responsibilities.

## What happens

| you | it |
|---|---|
| show a warning | a raised sand strip and attention stone signal a persistent message |
| activate the action | the host receives an action event and can open its workflow |
| dismiss the banner | the host receives a dismiss event and can restore the banner later |

## Limits

- An alert banner remains until dismissed; it is not a toast and has no auto-dismiss timer. It does not fetch data, resolve the alert or persist dismissal state.
- **Needs WebGL2** to draw the sand. Without it the control still works with keys and a screen reader, but nothing is drawn.
- **One live tray per element.** Each is its own WebGL canvas, and browsers keep only about sixteen alive at once, so it is not for long lists.
- **It does not hold still for `prefers-reduced-motion`.** The sand still moves. If that matters on your page, use a plain control there.
- **Drawn for a light page.** The sand and the walnut frame are warm and light; they look pasted on over a dark background.
- **The sand is simulated at one cell per CSS pixel,** so a wider element costs more. Each scales to its CSS `width`; the height follows.
- **Sound is on** after the first touch or key on the page. `GrainMotionUI.Sound.on = false` turns every control quiet.
- **Checked in headless Chromium** with real touch and key events, with the CPU slowed four times. Not tried in Safari or Firefox, on a real phone, or with a screen reader.
