# Upload Queue

The queue is a small transfer channel: each file has its own tile, status and progress ridge. The component owns the queue's state and controls; your application owns the actual HTTP request, authentication, storage destination and retry policy.

One of thirty-five files in this repo. Same idea in each (an ordinary control made of sand that moves like sand), different control.

## Run it

```sh
python3 -m http.server 8000     # from the repo folder
# open http://localhost:8000/upload-queue/
```

`?embed=1` hides the heading and the hint.

## Use it

`upload-queue.js` is the whole control: one file of about 40 KB with the sand engine and its sounds inside it, and no dependencies.

```html
<script src="upload-queue.js"></script>
<sand-upload-queue label="Uploads"></sand-upload-queue>
```

```js
const queue = document.querySelector('sand-upload-queue');
queue.addEventListener('upload-request', ({ detail }) => startYourUpload(detail.item));
// From your transport callback:
queue.update(id, { status: 'uploading', progress: 46 });
queue.update(id, { status: 'complete', progress: 100 });
```

| attribute | what it sets | default |
|---|---|---|
| label | Accessible queue name | Upload queue |

- addFiles(files) returns stable item IDs and emits upload-request once for each new item. It does not start a network request itself.
- update(id, patch) accepts queued, uploading, complete, error and cancelled states. Progress is clamped to 0–100; reaching 100 while uploading completes the item.
- Cancel and retry controls emit upload-cancel and retry-request. The host must cancel or restart the real transfer, then update queue state.
- The queue-change event contains a snapshot of the item list. File objects are retained in memory and are not persisted.

## What happens

| you | it |
|---|---|
| add files | file tiles enter the queue with a waiting state |
| report progress | a carved channel fills beneath the active tile |
| complete a transfer | the tile settles and its status becomes complete |
| cancel or retry | a request event is sent to the host application |

## Limits

- No HTTP transport is built in. Connect upload-request, upload-cancel and retry-request to your own upload service.
- Progress is supplied by the host; the queue does not infer progress from a File object.
- **Needs WebGL2** to draw the sand. Without it the control still works with keys and a screen reader, but nothing is drawn.
- **One live tray per element.** Each instance creates its own WebGL canvas and animation loop.
- **Light backgrounds recommended.** The materials are drawn for a light page.
- **No runtime dependencies.** Load the standalone script with a plain script tag, not as a module.
