# GrainMotion-UI Loading Indicator

An indeterminate loading indicator with a miniature rake that loops through a recognizable sand pattern, distinct from the AI Thinking state.

![Loading Indicator physical interaction concept](assets/concept.svg)

*Original concept illustration, not a runtime screenshot.*

## Live demo

Run a local static server from the repository root:

```bash
python3 -m http.server 8000
```

Open [http://localhost:8000/loader/](http://localhost:8000/loader/).

## Installation

Each component is a standalone JavaScript file with the shared sand engine and its required sounds embedded.

```bash
npx shadcn add Brajesh31/GrainMotion-UI/loader
```

Or load it with a normal script tag:

```html
<script src="loader.js"></script>
<sand-loader label="Loading results"></sand-loader>
```

## JavaScript

```js
const control = document.querySelector('sand-loader');
control.speed = 1.5;
control.active = false;
```

## Attributes and properties

| Attribute / property | Purpose | Default |
|---|---|---|
| `label` | Accessible status label | Loading |
| `active` | Whether work is ongoing | true |
| `speed` | Animation multiplier from 0.25 to 4 | 1 |

Set `active = false` when work completes. `aria-busy` follows the active state.

## Interaction design

An indeterminate loading indicator with a miniature rake that loops through a recognizable sand pattern, distinct from the AI Thinking state.

The rake repeats a short pattern, intentionally distinct from the state-specific AI Thinking control. When prefers-reduced-motion is active, the rake remains still.

## Accessibility

- Status semantics and labels are exposed through ARIA.
- Native buttons remain keyboard operable where applicable.
- The visual sand is supplemental; do not rely on sound or motion alone.
- Reduced-motion preference is respected by the visual animation.
- WebGL2 is needed for the sand artwork; semantics remain on the host element.

## Responsive behavior

The control scales with its CSS width. The demo uses a responsive light layout and avoids fixed desktop-only sizing.

## Known limitations

- The sand surface requires WebGL2.
- Manual screen-reader and physical-device testing remains outstanding.
- Progress and loading indicators are status components, not form inputs.
- The timer uses animation-frame timing and is not a precision alarm clock.
- Step Indicator supports up to five visible steps.

## Related documentation

- [Component catalog](../docs/COMPONENT-CATALOG.md)
- [Accessibility standards](../docs/ACCESSIBILITY.md)
- [Testing strategy](../docs/TESTING.md)
- [Architecture](../docs/ARCHITECTURE.md)
- [Browser support](../docs/BROWSER-SUPPORT.md)
- [Component creation guide](../docs/COMPONENT-CREATION-GUIDE.md)

## Changelog

- **Phase 4:** Initial implementation, demo, documentation and Chromium test coverage.
