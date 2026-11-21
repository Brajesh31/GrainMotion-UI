# 🔢 GrainMotion-UI Pagination

Numbered wells are pressed into a shallow sand track. A low river stone marks the current page, while previous and next controls sit at either end.

## Run the demo
```sh
python3 -m http.server 8000
# open http://localhost:8000/pagination/
```

## Install and use
```html
<script src="pagination.js"></script>
<sand-pagination page="4" total="24" sibling-count="1" boundary-count="1" show-first-last label="Search results"></sand-pagination>
```

## API

| Attribute / property | Description | Default |
|---|---|---|
| `page` | Current 1-based page, clamped to available pages | `1` |
| `total` | Total number of pages, minimum 1 | `1` |
| `sibling-count` | Pages on either side of the current page, 0–3 | `1` |
| `boundary-count` | Page buttons at each boundary, 1–3 | `1` |
| `show-first-last` | Include first and last page buttons | absent |
| `disabled` | Disable every navigation button | absent |
| `label` | Accessible navigation landmark name | `Pagination` |

### Properties and event
- `page`: get or set the current page.
- `total`: get or set total pages.
- `siblingCount`, `boundaryCount`: parsed window settings.
- `buttons`: current page and navigation buttons.
- `setPage(number)`: set a page after clamping to 1..total.
- `change`: bubbling, composed event with `detail = { page, previousPage, total }`.

Ellipses are decorative separators, not controls. A one-page gap is rendered as the missing page number. Previous and next are always present; first and last are optional.

## Physical interaction

Page numbers sit in raised stone-and-sand wells. The selected page uses a broad river stone with natural shadow and a brighter engraved number. The stone moves along the carved channel when the page changes. It represents actual component state.

## Accessibility and integration

The host is a named navigation landmark. Page choices and directional controls are real buttons. The current page has `aria-current="page"`; unavailable navigation controls are disabled. The component changes only the page number. It does not fetch data, alter a router, or scroll automatically. Listen for `change` and let the application load the results.

## Limitations
- Page numbers are 1-based and at least one page always exists.
- The row compresses spacing on narrow screens; it does not implement infinite or cursor-based pagination.
- Manual screen-reader and browser verification remains necessary.
