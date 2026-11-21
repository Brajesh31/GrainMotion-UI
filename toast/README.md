# Toast Notification

A small walnut tray receives a river stone, announces a status message and settles out of view. Notifications can coexist, pause their timer while the user points at or focuses them, and expose an optional action.

One of fifty files in this repo. Same idea in each (an ordinary control made of sand that moves like sand), different control.

## Run it

```sh
python3 -m http.server 8000     # from the repo folder
# open http://localhost:8000/toast/
```

`?embed=1` hides the heading and the hint.

## Use it

`toast.js` is the whole control: one file of about 40 KB with the sand engine and its sounds inside it, and no dependencies.

```html
<script src="toast.js"></script>\n<sand-toast id="notice" tone="success" title="Saved" message="Your changes are stored." duration="4500"></sand-toast>\n<script>\nnotice.show();\nnotice.addEventListener('dismiss', event => console.log(event.detail.reason));\n</script>
```

```js
const notice = document.querySelector('sand-toast');\nnotice.show('Profile updated');\nnotice.addEventListener('action', () => undoLastChange());\nnotice.addEventListener('dismiss', event => recordDismissReason(event.detail.reason));
```

| attribute | what it sets | default |
|---|---|---|
| `message` | Notification body text | empty |
| `title` | Optional short heading | empty |
| `tone` | info, success, warning or error | info |
| `duration` | Auto-dismiss time in milliseconds; zero disables timeout | 4500 |
| `position` | top-right, top-left, bottom-right or bottom-left | top-right |
| `action-label` | Optional action button text | absent |
| `dismissible` | Show the close button; defaults on unless set to false | true |
| `open` | Reflects whether the toast is visible | absent |

- Call `show(message?)` to display the toast and `dismiss(reason?)` to close it. Reasons include `programmatic`, `timeout`, `action` and `close`.
- An optional action button dispatches `action` and then dismisses the toast. The close button dispatches `dismiss`.
- Info and success use `role=status` with polite live announcements. Warning and error use `role=alert` with assertive announcements.
- The timer pauses while the toast is hovered or contains keyboard focus. Set `duration="0"` for a persistent toast.
- Multiple toast elements can be open at once. The component stacks them by corner; the host owns the application-level notification queue.

## What happens

| you | it |
|---|---|
| call show() | the stone settles into a corner tray and the message is announced |
| hover or focus the toast | the automatic dismissal timer pauses |
| activate its action | the action event is emitted before the toast closes |

## Limits

- A toast is transient feedback, not a durable error log or the only way to access a critical action. The component does not persist notifications across page loads or manage a network operation.
- **Needs WebGL2** to draw the sand. Without it the control still works with keys and a screen reader, but nothing is drawn.
- **One live tray per element.** Each is its own WebGL canvas, and browsers keep only about sixteen alive at once, so it is not for long lists.
- **It does not hold still for `prefers-reduced-motion`.** The sand still moves. If that matters on your page, use a plain control there.
- **Drawn for a light page.** The sand and the walnut frame are warm and light; they look pasted on over a dark background.
- **The sand is simulated at one cell per CSS pixel,** so a wider element costs more. Each scales to its CSS `width`; the height follows.
- **Sound is on** after the first touch or key on the page. `GrainMotionUI.Sound.on = false` turns every control quiet.
- **Checked in headless Chromium** with real touch and key events, with the CPU slowed four times. Not tried in Safari or Firefox, on a real phone, or with a screen reader.
