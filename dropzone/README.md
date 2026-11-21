# File Dropzone

A file is a small object arriving at a physical tray. Dragging over the frame raises a settled stone; dropping a valid file makes its tile land in the tray and the sand settle around it. The native file picker remains available for keyboard and touch users.

One of forty-five files in this repo. Same idea in each (an ordinary control made of sand that moves like sand), different control.

## Run it

```sh
python3 -m http.server 8000     # from the repo folder
# open http://localhost:8000/dropzone/
```

`?embed=1` hides the heading and the hint.

## Use it

`dropzone.js` is the whole control: one file of about 40 KB with the sand engine and its sounds inside it, and no dependencies.

```html
<script src="dropzone.js"></script>
<sand-dropzone accept="image/*,.pdf" multiple max-size="10485760" label="Project files"></sand-dropzone>
```

```js
const zone = document.querySelector('sand-dropzone');
zone.addEventListener('files-change', event => queueFiles(event.detail.files));
zone.addEventListener('file-reject', event => showRejected(event.detail.rejected));
// zone.files returns a copy; zone.clear() empties the tray.
```

| attribute | what it sets | default |
|---|---|---|
| accept | Comma-separated MIME types, wildcards or extensions | all files |
| multiple | Accept more than one file | absent |
| max-size | Maximum size of each file, in bytes | no limit |
| disabled | Disable picker and drop handling | absent |
| label | Accessible name for the file area | File upload area |

- The component validates file MIME types/extensions and individual file size before accepting a file. It does not inspect file contents or upload anything.
- The files-change event contains files and rejected entries. file-reject contains only rejected entries and reasons.
- The Choose files button opens a real input[type=file]; drag-and-drop is an additional pointer interaction, not the only way to select files.

## What happens

| you | it |
|---|---|
| drag files over the tray | the recessed border brightens and a stone tile rises |
| drop an accepted file | the file appears as a tile and the sand settles |
| drop an unsupported file | the file is rejected with a readable reason |
| clear the tray | selected files and status are removed |

## Limits

- The component stores File objects in memory for the lifetime of the element. It does not create previews, persist files or send network requests.
- **Needs WebGL2** to draw the sand. Without it the control still works with keys and a screen reader, but nothing is drawn.
- **One live tray per element.** Each is its own WebGL canvas, and browsers keep only about sixteen alive at once, so it is not for long lists.
- **It does not hold still for `prefers-reduced-motion`.** The sand still moves. If that matters on your page, use a plain control there.
- **Drawn for a light page.** The sand and the walnut frame are warm and light; they look pasted on over a dark background.
- **The sand is simulated at one cell per CSS pixel,** so a wider element costs more. Each scales to its CSS `width`; the height follows.
- **Sound is on** after the first touch or key on the page. `GrainMotionUI.Sound.on = false` turns every control quiet.
- **Checked in headless Chromium** with real touch and key events, with the CPU slowed four times. Not tried in Safari or Firefox, on a real phone, or with a screen reader.
