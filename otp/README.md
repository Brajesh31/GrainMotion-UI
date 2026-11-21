# GrainMotion-UI OTP / PIN Input

Individual engraved wells represent a numeric one-time code. One native text input preserves paste and one-time-code autofill behavior.

![OTP / PIN Input physical interaction concept](assets/concept.svg)

*Concept diagram, not a runtime screenshot.*

## Live demo

Start a server with `python3 -m http.server 8000` and open `http://localhost:8000/otp/`.

## Installation

```html
<script src="otp.js"></script>
<sand-otp name="verificationCode" label="Verification code" length="6" autocomplete="one-time-code" required></sand-otp>
```

## JavaScript usage

```js
const code = document.querySelector('sand-otp');
code.addEventListener('complete', event => {
  // Submit the code through your secure application flow.
  // Do not log the code or include it in analytics.
  verifyCode(code.value);
});
```

## Attributes

| Attribute | Behavior | Default |
|---|---|---|
| `value` | Initial numeric code | empty |
| `label` | Accessible name | One-time code |
| `length` | Code length, clamped from 4 to 10 | 6 |
| `masked` | Mask digits visually where text-security is supported | absent |
| `name` | Form field name | empty |
| `autocomplete` | Browser one-time-code hint | one-time-code |
| `required` | Required code | absent |
| `disabled` | Disable editing and submission | absent |
| `readonly` | Prevent editing | absent |

## Properties

- `value: string`
- `disabled: boolean`
- `readOnly: boolean`
- `required: boolean`
- `name: string`
- `validity: ValidityState`
- `validationMessage: string`

## Methods

- `focus(options)` and `blur()`
- `checkValidity()` and `reportValidity()`
- `setCustomValidity(message)`

## Events

- input and change, bubble from the internal native input
- complete, dispatched when an input edit reaches the configured length; detail.length only

Native `input` and `change` events bubble from the internal browser input. They retain the native event target, so normal listeners and browser editing behavior continue to work.

## Interaction

The inner field is a real browser-native input or textarea. The sand canvas is a visual layer below it; it does not store or draw the entered text.

| Action | Result |
|---|---|
| Type or delete | The native field edits its value and updates the form-associated custom element. |
| Paste | Browser paste behavior is retained. OTP/PIN input sanitizes to digits and configured length. |
| Focus | The sand layer shows a stylus, shutter or active-well cue. |
| Disabled | Native editing is blocked and the custom element stops participating in form submission. |
| Programmatic value | Assigning `element.value` updates the field and form value. It does not synthesize user input events. |

## Accessibility

- A real native `input` or `textarea` provides keyboard, selection, copy/paste and browser validation behavior.
- The `label` attribute is applied as the internal field's accessible name.
- `disabled`, `readonly` and `required` are forwarded to the native field.
- Search exposes pending work using `aria-busy`.
- OTP uses one native input so browser `autocomplete="one-time-code"` remains available.

## Form integration

All five controls are form-associated. Put `name` on the custom element. The current value is serialized as a string; disabled controls submit no value, and form reset restores the initial `value` attribute.

## Known limitations

- One native input spans the visual wells. This preserves mobile one-time-code autofill and paste, but does not create separately focusable digit inputs.
- The numeric code is sensitive. The complete event exposes only its configured length, not the digits.
- Masked display uses browser text-security styling where supported.
- WebGL2 is required for the sand visual layer, not for native text entry.
- Reduced-motion support and manual screen-reader/device verification remain open.

## Related docs

- [Component catalog](../docs/COMPONENT-CATALOG.md)
- [Accessibility](../docs/ACCESSIBILITY.md)
- [Testing](../docs/TESTING.md)
- [Architecture](../docs/ARCHITECTURE.md)
- [Browser support](../docs/BROWSER-SUPPORT.md)
- [Component creation guide](../docs/COMPONENT-CREATION-GUIDE.md)

## Changelog

- **Phase 2:** Initial implementation, native field integration, demo and documentation.