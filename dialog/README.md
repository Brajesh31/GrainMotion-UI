# Dialog / Modal

A framed walnut surface rises above the page while the rest of the document falls behind a quiet backdrop. The component uses the browser's native modal dialog, so focus containment and the top layer are genuine browser behavior.

One of forty-five files in this repo. Same idea in each (an ordinary control made of sand that moves like sand), different control.

## Run it

```sh
python3 -m http.server 8000     # from the repo folder
# open http://localhost:8000/dialog/
```

`?embed=1` hides the heading and the hint.

## Use it

`dialog.js` is the whole control: one file of about 30 KB with the sand engine and its sounds inside it, and no dependencies.

```html
<script src="dialog.js"></script>\n<button id="confirm" type="button">Review changes</button>\n<sand-dialog id="review" title="Confirm changes" description="Review before saving.">\n  <p>Your draft is ready to publish.</p>\n</sand-dialog>\n<script>\nconfirm.addEventListener('click', () => review.showModal());\nreview.addEventListener('dialog-close', event => console.log(event.detail.returnValue));\n</script>
```

```js
const modal = document.querySelector('sand-dialog');\nmodal.addEventListener('confirm', () => publishDraft());\nmodal.addEventListener('dialog-close', event => restorePageState(event.detail.returnValue));\nmodal.showModal();
```

| attribute | what it sets | default |
|---|---|---|
| `open` | Reflects native modal open state | absent |
| `title` | Dialog heading | Dialog |
| `description` | Optional accessible description | empty |
| `confirm-label` | Primary action button text | Done |
| `cancel-label` | Secondary action button text | Cancel |
| `close-on-escape` | Allow Escape to close unless value is false | true |
| `close-on-backdrop` | Allow a click on the backdrop to close | absent |
| `label` | Accessible name override | heading |

- The implementation uses the native `<dialog>` element with `showModal()`, allowing the browser to manage the top layer and modal focus containment.
- Caller-provided child nodes are moved into the dialog body without parsing HTML. Use DOM nodes for interactive content and keep ownership in the host.
- The Close, Cancel and Done controls call `close()` with a return value. Done also emits `confirm` before closing.
- The `cancel` event from Escape is prevented and handled according to `close-on-escape`; backdrop closing is opt-in through `close-on-backdrop`.
- The component restores focus to the element that opened it when that element is still connected. Listen for `dialog-open` and `dialog-close`.

## What happens

| you | it |
|---|---|
| call showModal() | the native dialog enters the top layer and the rest of the page becomes inert |
| press Tab | the browser keeps keyboard focus inside the modal |
| confirm or cancel | the return value and close event let the host decide what happens next |

## Limits

- The dialog manages presentation and focus only. It does not validate, submit or persist the form content placed inside it. The caller remains responsible for the opener and business workflow.
- **Needs WebGL2** to draw the sand. Without it the control still works with keys and a screen reader, but nothing is drawn.
- **One live tray per element.** Each is its own WebGL canvas, and browsers keep only about sixteen alive at once, so it is not for long lists.
- **It does not hold still for `prefers-reduced-motion`.** The sand still moves. If that matters on your page, use a plain control there.
- **Drawn for a light page.** The sand and the walnut frame are warm and light; they look pasted on over a dark background.
- **The sand is simulated at one cell per CSS pixel,** so a wider element costs more. Each scales to its CSS `width`; the height follows.
- **Sound is on** after the first touch or key on the page. `GrainMotionUI.Sound.on = false` turns every control quiet.
- **Checked in headless Chromium** with real touch and key events, with the CPU slowed four times. Not tried in Safari or Firefox, on a real phone, or with a screen reader.
