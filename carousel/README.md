# Image Carousel

Photographs sit in framed walnut plates. The selected plate moves along a shallow sand track while the native controls and accessible text identify the current image.

One of thirty-five files in this repo. Same idea in each (an ordinary control made of sand that moves like sand), different control.

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
- **One live tray per element.** Each instance creates its own WebGL canvas and animation loop.
- **Light backgrounds recommended.** The materials are drawn for a light page.
- **No runtime dependencies.** Load the standalone script with a plain script tag, not as a module.
