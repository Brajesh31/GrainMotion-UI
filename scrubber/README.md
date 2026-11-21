# Media Scrubber

A narrow raked channel becomes a media timeline. A stone marks the playhead, a pale ridge shows buffered content, and the native range input makes seeking available to touch, mouse and keyboard users.

One of fifty files in this repo. Same idea in each (an ordinary control made of sand that moves like sand), different control.

## Run it

```sh
python3 -m http.server 8000     # from the repo folder
# open http://localhost:8000/scrubber/
```

`?embed=1` hides the heading and the hint.

## Use it

`scrubber.js` is the whole control: one file of about 40 KB with the sand engine and its sounds inside it, and no dependencies.

```html
<script src="scrubber.js"></script>
<video id="clip" controls src="/media/demo.mp4"></video>
<sand-scrubber id="timeline" label="Clip position"></sand-scrubber>
<script>timeline.media = clip;</script>
```

```js
const media = document.querySelector('video');
const scrubber = document.querySelector('sand-scrubber');
scrubber.media = media;
scrubber.addEventListener('seek', event => logSeek(event.detail.time));
```

| attribute | what it sets | default |
|---|---|---|
| label | Accessible timeline label | Media position |
| disabled | Disable play and seek controls | absent |
| media | HTMLAudioElement/HTMLVideoElement property | null |

- Assign a real audio or video element to the media property. The component listens for timeupdate, durationchange, progress, play, pause, seeking, seeked, loadedmetadata and ended.
- Play/Pause delegates to the media element. Seeking writes its currentTime and emits seek while adjusting and seeked when committed.
- Buffered width is derived from the media element's TimeRanges. The component does not own the source URL or network loading.

## What happens

| you | it |
|---|---|
| play media | the play button reflects the media element's state |
| seek | the stone playhead and media currentTime move together |
| buffer media | the buffered ridge advances along the carved channel |

## Limits

- Duration/currentTime and buffered data are browser media APIs; live streams with unknown duration may not show a seekable range.
- The component does not implement a media player, source selection, captions or transport controls beyond play/pause.
- **Needs WebGL2** to draw the sand. Without it the control still works with keys and a screen reader, but nothing is drawn.
- **One live tray per element.** Each is its own WebGL canvas, and browsers keep only about sixteen alive at once, so it is not for long lists.
- **It does not hold still for `prefers-reduced-motion`.** The sand still moves. If that matters on your page, use a plain control there.
- **Drawn for a light page.** The sand and the walnut frame are warm and light; they look pasted on over a dark background.
- **The sand is simulated at one cell per CSS pixel,** so a wider element costs more. Each scales to its CSS `width`; the height follows.
- **Sound is on** after the first touch or key on the page. `GrainMotionUI.Sound.on = false` turns every control quiet.
- **Checked in headless Chromium** with real touch and key events, with the CPU slowed four times. Not tried in Safari or Firefox, on a real phone, or with a screen reader.
