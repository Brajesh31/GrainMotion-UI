# 🪨 GrainMotion-UI Breadcrumbs

A hierarchy is represented as stepping stones through raked sand. Ancestor stones are real links; the final stone is plain current-location text.

## Run the demo
```sh
python3 -m http.server 8000
# open http://localhost:8000/breadcrumbs/
```

## Install and use
```html
<script src="breadcrumbs.js"></script>
<sand-breadcrumbs label="You are here" separator="›" items="Home|/;Library|/library;Components|/library/components;Breadcrumbs"></sand-breadcrumbs>
```

The `items` attribute uses semicolon-separated entries. Use `Label|URL` for ancestors and a plain label for the final/current location. For labels or paths containing delimiters, assign the `items` property with an array of `{ label, href }` objects.

## API

| Attribute / property | Description | Default |
|---|---|---|
| `items` | Semicolon-separated path entries or an array of `{ label, href }` objects | Home, Library, Current project |
| `label` | Navigation landmark name | `Breadcrumb` |
| `separator` | Visible separator between stones | `›` |

### Properties and methods
- `items`: get or set structured entries.
- `links`: current ancestor anchor elements.
- `refresh()`: re-render after changing items.

## Navigation and safety

Ancestor locations render as native anchors and are not intercepted. The final item renders as a `span` with `aria-current="page"`. URLs are accepted only when they resolve to HTTP(S) or safe relative paths; `javascript:`, `data:`, protocol-relative and other schemes are not rendered as links. The component does not generate routes or assume a router.

## Physical design and responsive behavior

A shallow raked trail runs underneath the path. Small river stones sit along it, and the current location uses a darker settled stone. Long labels wrap and the path wraps on narrow screens. Separators are hidden from assistive technology because the navigation structure already communicates hierarchy.

## Limitations
- Up to eight path items.
- Attribute syntax reserves semicolon and vertical bar as delimiters. Use the `items` property for complex paths.
- Link destinations must be supplied by the integrating application.
- Manual assistive-technology and device behavior still need verification.
