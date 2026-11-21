# Image Carousel

Photographs sit in framed walnut plates. The selected plate moves along a shallow sand track while the native controls and accessible text identify the current image.

One of forty-five files in this repo. Same idea in each (an ordinary control made of sand that moves like sand), different control.

## Run it

```sh
python3 -m http.server 8000     # from the repo folder
# open http://localhost:8000/carousel/
```

`?embed=1` hides the heading and the hint.

## Use it

`carousel.js` is the whole control: one file of about 30 KB with the sand engine and its sounds inside it, and no dependencies.

```html
<script src="carousel.js"></script>
<sand-carousel id="photos" label="Project photos"></sand-carousel>
<script>
photos.items = [{ src: '/images/one.jpg', alt: 'Studio', caption: 'Studio light' }];
</script>
```

```js
const carousel = document.querySelector('sand-carousel');
carousel.items = [
  { src: '/images/studio.jpg', alt: 'Studio', caption: 'Studio light' },
  { src: '/images/material.jpg', alt: 'Material', caption: 'Walnut and sand' },
];
carousel.addEventListener('change', event => showImage(event.detail.index));
```

| attribute | what it sets | default |
|---|---|---|
| label | Accessible carousel name | Image carousel |
| index | Initial/current image index (zero-based) | 0 |
| disabled | Disable navigation controls | absent |
| items | Property array of image objects | empty |

- items is a property array of {src, alt, caption}; the component does not parse an arbitrary HTML string into images.
- Previous/next buttons, dot buttons, Left/Right keys and touch swipes change the selected image. Selection wraps at either end.
- Only HTTP(S), blob and data:image URLs are accepted. Images use object-fit:cover within a beveled frame.

## What happens

| you | it |
|---|---|
| select another frame | the framed plate changes and the stone marker moves along the track |
| swipe left or right | the next or previous image is selected |
| press an arrow key | the carousel advances while focus remains within it |

## Limits

- The component does not lazy-fetch remote images beyond the browser's normal image loading and does not implement video slides or automatic autoplay.
- **Needs WebGL2** to draw the sand. Without it the control still works with keys and a screen reader, but nothing is drawn.
- **One live tray per element.** Each is its own WebGL canvas, and browsers keep only about sixteen alive at once, so it is not for long lists.
- **It does not hold still for `prefers-reduced-motion`.** The sand still moves. If that matters on your page, use a plain control there.
- **Drawn for a light page.** The sand and the walnut frame are warm and light; they look pasted on over a dark background.
- **The sand is simulated at one cell per CSS pixel,** so a wider element costs more. Each scales to its CSS `width`; the height follows.
- **Sound is on** after the first touch or key on the page. `GrainMotionUI.Sound.on = false` turns every control quiet.
- **Checked in headless Chromium** with real touch and key events, with the CPU slowed four times. Not tried in Safari or Firefox, on a real phone, or with a screen reader.
