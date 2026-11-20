<div align="center">

# GrainMotion-UI

### Interfaces shaped by sand, motion, and interaction.

A collection of four experimental UI controls built from a real-time sand simulation. Each control turns a familiar interaction into something tactile: a rake becomes a slider, a river stone becomes a toggle, a stick becomes a signature pad, and a moving rock becomes an AI activity indicator.

[**Explore the live gallery**](https://brajesh31.github.io/GrainMotion-UI/) · [Components](#-the-components) · [Installation](#-installation) · [Documentation](#-documentation)

![GrainMotion-UI complete component gallery](gallery/title.svg)

<p>
  <a href="https://github.com/Brajesh31/GrainMotion-UI/actions/workflows/pages.yml"><img src="https://github.com/Brajesh31/GrainMotion-UI/actions/workflows/pages.yml/badge.svg" alt="GitHub Pages deployment"></a>
  <img src="https://img.shields.io/badge/WebGL2-powered-8B7355" alt="WebGL2 powered">
  <img src="https://img.shields.io/badge/Dependencies-none-6D8B74" alt="No dependencies">
  <img src="https://img.shields.io/badge/Components-4-C49A6C" alt="Four components">
</p>

</div>

---

## ✨ What is GrainMotion-UI?

GrainMotion-UI is a set of standalone custom elements that simulate sand as a height field and render it with a WebGL2 shader. Instead of placing a conventional control inside a decorative skin, each interaction changes the sand itself.

- **Tactile interaction:** grooves, ridges, wakes, and settling sand respond to user input.
- **Standalone components:** each control is delivered as a single JavaScript file with its engine and sounds embedded.
- **No runtime dependencies:** no framework or package installation is required to use the controls.
- **Native-feeling behavior:** keyboard interaction, form integration where supported, and custom-element APIs.
- **Designed to be explored:** each component has a live demo and its own documentation.

## 🎛️ The components

Each component has its own live demo, usage guide, and source file.

| Component | Preview | What it does | Demo |
|---|---|---|---|
| **Sand Slider** | A bamboo rake cuts grooves through the sand and pushes a small ridge ahead of it. | [Open demo](https://brajesh31.github.io/GrainMotion-UI/slider/) · [Documentation](slider/README.md) |
| **Sand Toggle** | A smooth river stone glides across its tray, leaving a wake and uncovering a symbol. | [Open demo](https://brajesh31.github.io/GrainMotion-UI/toggle/) · [Documentation](toggle/README.md) |
| **Sand Signature** | Write with a stick that behaves like a brush, then export the signature as a transparent PNG. | [Open demo](https://brajesh31.github.io/GrainMotion-UI/signature/) · [Documentation](signature/README.md) |
| **Sand Thinking** | A rock moves through the sand to represent thinking, searching, tool use, writing, and idle states. | [Open demo](https://brajesh31.github.io/GrainMotion-UI/thinking/) · [Documentation](thinking/README.md) |

> The gallery image above shows the component set together. The concept artwork below documents visual exploration and design direction, not additional live component screenshots.

## 🖼️ Visual exploration

The project grew through a series of visual studies exploring how familiar controls could be expressed through sand, stones, grooves, and physical movement.

<div align="center">

<table>
  <tr>
    <td align="center" width="50%">
      <img src="making-of/concept/01-set.webp" alt="Early GrainMotion-UI control set concept" width="100%">
      <br><strong>01 · The control set</strong>
    </td>
    <td align="center" width="50%">
      <img src="making-of/concept/02-toggle.webp" alt="Stone toggle visual concept" width="100%">
      <br><strong>02 · Stone toggle study</strong>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="making-of/concept/03-slider.webp" alt="Rake slider visual concept" width="100%">
      <br><strong>03 · Rake slider study</strong>
    </td>
    <td align="center" width="50%">
      <img src="making-of/concept/09-board-toggle.webp" alt="Alternative toggle board concept" width="100%">
      <br><strong>04 · Toggle explorations</strong>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="making-of/concept/13-camera-panel.webp" alt="Camera and composition concept study" width="100%">
      <br><strong>05 · Composition study</strong>
    </td>
    <td align="center" width="50%">
      <img src="making-of/concept/rocks.webp" alt="Rock shape and material exploration" width="100%">
      <br><strong>06 · Stone and material study</strong>
    </td>
  </tr>
</table>

</div>

See [making-of/](making-of/) for the design notes, concept images, and prompts behind the visual direction.

## ⚙️ How it works

The sand is simulated, not a static texture. A height field stores the sand surface, JavaScript updates it as controls move, and a WebGL2 shader lights the surface to reveal grooves, ridges, shadows, and highlights.

- **Simulation:** the sand height field changes as the user interacts with a control.
- **Relaxation:** displaced sand settles toward its angle of rest.
- **Rendering:** WebGL2 shades the surface and gives the sand its depth.
- **Sound:** embedded audio recordings respond to interaction.
- **Custom elements:** each component registers a reusable HTML element.

The shared engine is available through `window.GrainMotionUI`. Each control file contains the engine and its own required assets, so it can be loaded independently.

## 🚀 Installation

### Add a component with the shadcn CLI

Run the command for the component you want:

```bash
npx shadcn add Brajesh31/GrainMotion-UI/slider
npx shadcn add Brajesh31/GrainMotion-UI/toggle
npx shadcn add Brajesh31/GrainMotion-UI/signature
npx shadcn add Brajesh31/GrainMotion-UI/thinking
```

The files are intended to be placed in `public/grainmotion-ui/`.

### Use a component directly

You can also copy the relevant JavaScript file into your project and load it with a regular script tag.

```html
<script src="/grainmotion-ui/slider.js"></script>
<sand-slider value="40" label="Volume"></sand-slider>
```

Other elements:

```html
<script src="/grainmotion-ui/toggle.js"></script>
<sand-toggle label="Focus mode"></sand-toggle>

<script src="/grainmotion-ui/signature.js"></script>
<sand-signature name="signature"></sand-signature>

<script src="/grainmotion-ui/thinking.js"></script>
<sand-thinking state="thinking"></sand-thinking>
```

For the thinking component, update its state as your agent works:

```js
const indicator = document.querySelector("sand-thinking");

indicator.state = "searching";
// Supported states: thinking, searching, tool, writing, idle
```

Check each component's documentation for its attributes, properties, events, and form behavior.

## 🔊 Sound controls

Sound starts after the first user touch or key interaction. You can mute the shared sound engine:

```js
window.GrainMotionUI.Sound.on = false;
```

## 🧑‍💻 Run locally

Clone the repository and start a local static server:

```bash
git clone https://github.com/Brajesh31/GrainMotion-UI.git
cd GrainMotion-UI
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000) to explore the gallery.

## 🛠️ Development

The repository includes scripts for building the standalone controls, generating documentation, capturing screenshots, and testing interactions.

| File | Purpose |
|---|---|
| `core.js` | Shared sand simulation and rendering engine |
| `tools/build.mjs` | Stamps the shared engine and embedded assets into each control |
| `tools/docs.mjs` | Generates component documentation, demo pages, registry metadata, and `llms.txt` from the component specification |
| `tools/spec.mjs` | Central component specification |
| `tools/test.mjs` | Exercises controls with touch and keyboard interactions |
| `tools/shot.mjs` | Captures browser screenshots |
| `skills/grainmotion-ui/` | Agent skill, engine reference, starter example, and visual inspection helper |

Useful commands:

```bash
node tools/build.mjs
node tools/build.mjs --check
node tools/docs.mjs
node tools/docs.mjs --check
node tools/test.mjs http://localhost:8000/gallery/
```

The browser test and screenshot utilities require Chrome or Chromium. See the individual scripts for their arguments and environment options.

## 📚 Documentation

- [Live component gallery](https://brajesh31.github.io/GrainMotion-UI/)
- [Slider documentation](slider/README.md)
- [Toggle documentation](toggle/README.md)
- [Signature documentation](signature/README.md)
- [Thinking documentation](thinking/README.md)
- [Agent skill](skills/grainmotion-ui/SKILL.md)
- [AI-readable project guide](llms.txt)
- [Design process and concept artwork](making-of/README.md)

## ⚠️ Known limitations

- **WebGL2 required for rendering.** Without WebGL2, the controls may remain keyboard-operable, but the sand visuals will not render.
- **Light backgrounds recommended.** The sand and walnut frame are designed for a light page.
- **Multiple live canvases have a browser limit.** Each component creates its own WebGL canvas, so avoid mounting large numbers simultaneously.
- **Reduced motion is not fully implemented.** The sand continues moving when `prefers-reduced-motion` is enabled.
- **Browser and assistive technology coverage is limited.** The current project notes testing in headless Chromium; broader browser, real-device, and screen-reader testing is still needed.

## 📄 License

This project is distributed under the MIT License. See [LICENSE](LICENSE) for the license text and required copyright notice.

---

<div align="center">

**GrainMotion-UI**

*Let the interface leave a mark.*

[Live Demo](https://brajesh31.github.io/GrainMotion-UI/) · [GitHub Repository](https://github.com/Brajesh31/GrainMotion-UI)

</div>
