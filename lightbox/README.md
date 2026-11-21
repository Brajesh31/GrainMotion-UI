# Lightbox Gallery

A set of thumbnail plates sits inside a walnut gallery tray. Opening a plate lifts it into a full-screen viewing surface; the browser's native dialog supplies modal behavior and focus containment.

One of fifty files in this repo. Same idea in each (an ordinary control made of sand that moves like sand), different control.

## Run it

```sh
python3 -m http.server 8000     # from the repo folder
# open http://localhost:8000/lightbox/
```

`?embed=1` hides the heading and the hint.

## Use it

`lightbox.js` is the whole control: one file of about 40 KB with the sand engine and its sounds inside it, and no dependencies.

```html
<script src="lightbox.js"></script>
<sand-lightbox id="gallery" label="Product gallery"></sand-lightbox>
<script>
gallery.items = [{ src: '/images/one.jpg', alt: 'Detail', caption: 'Close detail' }];
</script>
```

```js
const gallery = document.querySelector('sand-lightbox');
gallery.items = [{ src: '/images/one.jpg', alt: 'Detail', caption: 'Close detail' }];
gallery.openAt(0); // gallery.close() dismisses the dialog
```

| attribute | what it sets | default |
|---|---|---|
| label | Accessible gallery/viewer name | Image gallery |
| items | Property array of {src, alt, caption} objects | empty |

- The thumbnail grid uses actual images with alt text. Activating a thumbnail opens a native <dialog> using showModal().
- Escape, Close and backdrop clicks dismiss the dialog. Focus returns to the element that opened the image when that opener remains connected.
- Left/Right keys and Previous/Next buttons navigate images; open, change and close events expose the current index/item.

## What happens

| you | it |
|---|---|
| choose a thumbnail | a framed image opens above the page |
| navigate | the displayed plate changes without closing the viewer |
| press Escape or Close | the viewer closes and focus returns to the opener |

## Limits

- The image URLs are supplied by the host and are not downloaded, proxied or cached by this component.
- Browser-native dialog support is required for the modal viewer.
- **Needs WebGL2** to draw the sand. Without it the control still works with keys and a screen reader, but nothing is drawn.
- **One live tray per element.** Each is its own WebGL canvas, and browsers keep only about sixteen alive at once, so it is not for long lists.
- **It does not hold still for `prefers-reduced-motion`.** The sand still moves. If that matters on your page, use a plain control there.
- **Drawn for a light page.** The sand and the walnut frame are warm and light; they look pasted on over a dark background.
- **The sand is simulated at one cell per CSS pixel,** so a wider element costs more. Each scales to its CSS `width`; the height follows.
- **Sound is on** after the first touch or key on the page. `GrainMotionUI.Sound.on = false` turns every control quiet.
- **Checked in headless Chromium** with real touch and key events, with the CPU slowed four times. Not tried in Safari or Firefox, on a real phone, or with a screen reader.
