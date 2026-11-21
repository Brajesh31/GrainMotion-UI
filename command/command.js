// GrainMotion-UI Phase 9: searchable command palette.
(() => {
// >>> grainmotion-ui core (stamped by tools/build.mjs from core.js: edit core.js, not this)
// The GrainMotion-UI core: the engine every control in the set is built on. A tray is a walnut frame holding a
// height field of sand, simulated at one cell per CSS pixel in JavaScript and lit on the GPU (WebGL2). Controls
// extend SandTray, carve the field, and may draw stones in the shader and sprites on an overlay canvas. Sounds
// are recorded takes played through Web Audio.
//
// This file is the source. tools/build.mjs stamps a copy into every control file, so each file works alone.
// The first one loaded sets window.GrainMotionUI; the others find it there and reuse it.
(() => {
if (window.GrainMotionUI) return;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
// Sound: decoded lazily on the first gesture (browsers keep audio asleep until then). Each control file adds its
// own takes as data URIs with Sound.add({ name: 'data:...' }). Names ending in -b are second takes: play('tap')
// picks between tap and tap-b, so repeats differ. Turn it all off with GrainMotionUI.Sound.on = false.
const Sound = {
  _on: true, ctx: null, buf: {}, src: {},
  get on() { return this._on; },
  set on(v) { this._on = !!v; if (this.master) this.master.gain.setTargetAtTime(this._on ? 1 : 0, this.ctx.currentTime, 0.02); },
  add(map) { Object.assign(this.src, map); if (this.ctx) for (const k in map) this.decode(k); },
  async decode(k) {
    if (this.buf[k] || this.src[k] === true) return; const u = this.src[k]; this.src[k] = true;
    try { const r = await fetch(u); this.buf[k] = await this.ctx.decodeAudioData(await r.arrayBuffer()); } catch {}
  },
  init() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain(); this.master.gain.value = this._on ? 1 : 0; this.master.connect(this.ctx.destination);
    for (const k in this.src) this.decode(k);
  },
  wake() { this.init(); if (this.ctx && this.ctx.state !== 'running') this.ctx.resume(); },
  play(k, gain = 1, rate = 1) {
    if (!this.ctx || !this._on) return;
    if (this.buf[k + '-b'] && Math.random() < 0.5) k += '-b';
    if (!this.buf[k]) return;
    const s = this.ctx.createBufferSource(), g = this.ctx.createGain();
    s.buffer = this.buf[k]; s.playbackRate.value = rate; g.gain.value = gain;
    s.connect(g).connect(this.master); s.start();
  },
  loop(name = 'loop') {
    if (!this.ctx || !this.buf[name]) return null;
    const s = this.ctx.createBufferSource(), g = this.ctx.createGain();
    s.buffer = this.buf[name]; s.loop = true; g.gain.value = 0;
    s.connect(g).connect(this.master); s.start(0, Math.random() * this.buf[name].duration);
    return { s, g };
  },
  toggle() { this.on = !this._on; return this._on; },
};
// the first touch or key anywhere on the page wakes the sound, so a control nobody touches (the thinking state) can be heard too
for (const t of ['pointerdown', 'keydown']) addEventListener(t, () => Sound.wake(), { once: true, capture: true });

const VERT = `#version 300 es
in vec2 a; void main() { gl_Position = vec4(a, 0., 1.); }`;
const FRAG = `#version 300 es
precision highp float;
uniform sampler2D uH;      // sand height, one texel per sim cell
uniform vec2 uRes;         // canvas size in device pixels
uniform vec2 uSim;         // sim grid size in cells
uniform float uPad;        // frame thickness, device pixels
uniform vec4 uStone;       // stone centre and radii, device pixels (rx = 0: no stone)
uniform vec4 uMoss;        // moss centre, radius, feather, device pixels
uniform vec2 uShape;       // stone shape: x = 0 ellipse (zw = radii), 1 rounded slab (zw = half size, y = corner radius)
uniform float uLift;       // how high the stone sits: scales its shadow (1 = resting)
uniform vec2 uStoneA;      // opacity of the stone and of its shadow (1, 1 = solid)
uniform vec4 uSt[4];       // up to four more stones, ellipses: centre and radii, device pixels
uniform vec4 uStP[4];      // and for each: lift, stone opacity, shadow opacity
uniform int uNSt;
out vec4 o;
const vec3 L = vec3(-0.6255, -0.4237, 0.6558);
float hash(vec2 p) {                               // integer hash: no visible pattern on any GPU
  // straight from float to uint, and >> 8u at the end: ivec->uvec casts and float(h & mask)
  // both came out as 0 on an NVIDIA driver, which silently removed all the grain
  uvec2 q = uvec2(floor(p) + 65536.), f = uvec2(fract(p) * 4096.);
  uint h = q.x * 1973u + q.y * 9277u + f.x * 26699u + f.y * 104729u;
  h ^= h >> 13u; h *= 0x5bd1e995u; h ^= h >> 15u; h *= 0x27d4eb2du; h ^= h >> 16u;
  return float(h >> 8u) * (1. / 16777216.);
}
float vnoise(vec2 p) {                             // smooth value noise for the stone's mottling
  vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}
float H(vec2 s) { return texture(uH, s / uSim).r; }
// One stone over the sand: its soft shadow, then its body, lit by the same light.
vec3 stone(vec3 col, vec2 p, vec4 S, vec2 shp, float lift, vec2 A) {
    // the stone's outline: d < 0 inside, in device px; g points outward; t runs 0 at the rim to 1 on top
    vec2 rel = p - S.xy, sh = vec2(0.19, 0.24) * S.w * lift;
    float d, ds, t; vec2 gr;
    if (shp.x < 0.5) {
      vec2 e = rel / S.zw; float r = length(e);
      d = (r - 1.) * S.w; gr = e / max(r, 1e-4);
      ds = (length((rel - sh) / (S.zw * 1.04)) - 1.) * S.w;
      t = 1. - r;
    } else {
      float cr = shp.y;
      vec2 q = abs(rel) - S.zw + cr;
      d = length(max(q, 0.)) + min(max(q.x, q.y), 0.) - cr;
      gr = (q.x > 0. && q.y > 0.) ? normalize(q) * sign(rel) : (q.x > q.y ? vec2(sign(rel.x), 0.) : vec2(0., sign(rel.y)));
      vec2 q2 = abs(rel - sh) - S.zw * 1.04 + cr;
      ds = length(max(q2, 0.)) + min(max(q2.x, q2.y), 0.) - cr;
      t = clamp(-d / (cr * 0.85), 0., 1.);
    }
    // soft shadow cast down and to the right
    col *= 1. - 0.42 * A.y * (1. - smoothstep(-0.45 * S.w * min(lift, 1.5), 0.25 * S.w * max(1., lift), ds));
    if (d < 0. && A.x > 0.) {
      vec3 sn;
      if (shp.x < 0.5) { vec2 e = rel / S.zw; float z = sqrt(max(0., 1. - dot(e, e))); sn = normalize(vec3(e, z * 1.35)); }
      else { float z = sqrt(max(0., 1. - (1. - t) * (1. - t))); sn = normalize(vec3(gr * (1. - t), z * 1.35)); }
      vec2 e = rel / S.zw;
      float sl = max(0., dot(sn, L));
      float mot = 0.86 + 0.24 * vnoise(e * 3.2 + 7.) + 0.06 * hash(p);
      vec3 st = vec3(92., 94., 96.) / 255. * mot * (0.38 + 0.8 * sl);
      st += pow(max(0., dot(reflect(-L, sn), vec3(0, 0, 1))), 18.) * 0.16;   // satin sheen
      float edge = clamp(-d / 1.2, 0., 1.);
      col = mix(col, st, edge * A.x);
    }
  return col;
}
void main() {
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  float fr = uRes.y * 0.5;
  float cxo = clamp(p.x, fr, uRes.x - fr);
  vec2 dvo = vec2(p.x - cxo, p.y - fr);
  float dout = length(dvo) - fr;
  float alpha = clamp(0.5 - dout, 0., 1.);
  if (alpha <= 0.) { o = vec4(0.); return; }
  float rr = (uRes.y - 2. * uPad) * 0.5;
  float cxi = clamp(p.x, uPad + rr, uRes.x - uPad - rr);
  float di = length(vec2(p.x - cxi, p.y - (uPad + rr))) - rr;
  float g = 0.9 + 0.2 * hash(p);
  float px = uRes.y / 208.;                          // one sim-height-208 pixel, for line widths
  vec3 col;
  if (di > 0.) {                                     // walnut frame, soft top-left bevel
    float bev = 1. - min(1., di / (uPad * 0.9));
    float lit = dot(dvo, L.xy) / fr;
    float s = (0.62 + 0.25 * -lit * (1. - bev) + 0.18 * bev) * (0.9 + 0.2 * hash(p * 0.37 + 9.1));
    col = vec3(96., 70., 50.) / 255. * s;
    if (di < 1.5 * px) col *= 0.55;
  } else {
    vec2 s = p / uRes * uSim;
    float hc = H(s);
    float sc = 1.5 * uSim.y / 120.;
    vec3 n = vec3(-(H(s + vec2(1, 0)) - H(s - vec2(1, 0))) * sc, -(H(s + vec2(0, 1)) - H(s - vec2(0, 1))) * sc, 1.);
    n.xy += (vec2(hash(p + 17.3), hash(p + 41.9)) - 0.5) * 0.14;
    n = normalize(n);
    float lit = max(0., dot(n, L));
    float occl = 0.78 + 0.22 * min(1., -di / (uPad * 0.6));
    float crest = 1. + clamp(hc * 0.06, -0.12, 0.07);
    vec3 sand = vec3(240., 225., 196.) / 255.;
    vec3 moss = vec3(150., 166., 84.) / 255.;
    float m = uMoss.z > 0. ? 1. - smoothstep(uMoss.z - uMoss.w, uMoss.z, length(p - uMoss.xy)) : 0.;
    m *= 0.92 + 0.16 * vnoise(p / (14. * px));        // moss takes unevenly
    vec3 alb = mix(sand, moss, clamp(m, 0., 1.));
    col = alb * (0.42 + 0.72 * lit) * occl * g * crest;
    float sp = hash(p * 1.731 + 3.3);
    if (sp > 0.98) col *= vec3(0.8, 0.78, 0.76); else if (sp < 0.02) col = col * 0.6 + vec3(100., 96., 88.) / 255.;
    if (uStone.z > 0.) col = stone(col, p, uStone, uShape, uLift, uStoneA);
    for (int i = 0; i < uNSt; i++) col = stone(col, p, uSt[i], vec2(0.), uStP[i].x, uStP[i].yz);
  }
  o = vec4(min(col, 1.) * alpha, alpha);
}`;

// Shared GL program per page (one per canvas context, but compiled from the same source).
class SandTray extends HTMLElement {
  constructor() { super(); if (this.constructor.formAssociated) this.internals = this.attachInternals(); }
  get reduced() { return reduced.matches; }
  // the form value, for the controls that have one (formAssociated)
  formValue(v) { this.internals?.setFormValue(v); }
  disconnectedCallback() {
    this.running = false;
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }
  connectedCallback() {
    if (this.c) {
      if (!this.running) {
        this.resizeObserver ||= new ResizeObserver(() => this.resize());
        this.resizeObserver.observe(this);
        this.running = true; this.last = performance.now(); requestAnimationFrame(this.tick);
      }
      return;
    }
    this.style.cssText += ';display:block;position:relative;touch-action:none;outline:none;-webkit-tap-highlight-color:transparent';
    this.c = document.createElement('canvas'); this.c.style.cssText = 'display:block;width:100%;height:auto;pointer-events:none';   // events come from the element itself
    this.o = document.createElement('canvas'); this.o.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none';
    this.append(this.c, this.o);
    this.ox = this.o.getContext('2d');
    this.c.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      this.nogl = true; this.c.style.visibility = 'hidden';
      this.fallbackReady = false; this.dirty = true;
    });
    this.c.addEventListener('webglcontextrestored', () => {
      try {
        this.initGL();
        if (this.gl && this.W && this.H) {
          this.gl.bindTexture(this.gl.TEXTURE_2D, this.tex);
          this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.R16F, this.W, this.H, 0, this.gl.RED, this.gl.FLOAT, null);
        }
        this.nogl = false; this.c.style.visibility = 'visible';
        if (this.fallbackCanvas) this.fallbackCanvas.style.display = 'none';
        this.dirty = true;
      } catch (error) {
        this.nogl = true; this.c.style.visibility = 'hidden';
        console.error('GrainMotion-UI: WebGL context restore failed; using the 2D renderer.', error);
      }
    });
    try { this.initGL(); }
    catch (error) {
      this.nogl = true; this.gl = null; this.u = {};
      this.c.style.visibility = 'hidden';
      console.error('GrainMotion-UI: WebGL initialization failed; using the 2D renderer.', error);
    }
    this.stone = null; this.moss = null;
    this.init?.();
    this.resize();
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this);
    this.running = true; this.last = performance.now(); this.tick = this.tick.bind(this); requestAnimationFrame(this.tick);
  }
  get aspect() { return 0.2; }
  initGL() {
    const gl = this.gl = this.c.getContext('webgl2', { premultipliedAlpha: true, antialias: false });
    if (!gl) { this.nogl = true; this.u = {}; this.c.style.visibility = 'hidden'; return; }
    this.nogl = false; this.c.style.visibility = 'visible';
    if (this.fallbackCanvas) this.fallbackCanvas.style.display = 'none';
    const sh = (t, src) => { const s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw gl.getShaderInfoLog(s); return s; };
    const pr = this.prog = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(pr);
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const a = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    this.tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this.u = Object.fromEntries(['uH', 'uRes', 'uSim', 'uPad', 'uStone', 'uMoss', 'uShape', 'uLift', 'uStoneA', 'uNSt'].map(n => [n, gl.getUniformLocation(pr, n)]));
  }
  resize() {
    const css = this.clientWidth || 300, dpr = Math.min(2, devicePixelRatio || 1);
    const sizeChanged = this.css !== css, ratioChanged = this.k !== dpr;
    if (!sizeChanged && !ratioChanged) return;
    this.css = css; this.k = dpr;
    if (!sizeChanged && this.W && this.H) {
      this.c.width = this.o.width = Math.round(this.W * dpr);
      this.c.height = this.o.height = Math.round(this.H * dpr);
      if (this.fallbackCanvas) { this.fallbackCanvas.width = this.c.width; this.fallbackCanvas.height = this.c.height; this.fallbackReady = false; }
      this.dirty = true; this.spriteKey = null;
      return;
    }
    const W = Math.round(css), H = Math.round(css * this.aspect);
    this.W = W; this.H = H;
    this.c.width = this.o.width = Math.round(W * dpr); this.c.height = this.o.height = Math.round(H * dpr);
    if (this.fallbackCanvas) { this.fallbackCanvas.width = this.c.width; this.fallbackCanvas.height = this.c.height; this.fallbackReady = false; }
    this.pad = Math.max(3, Math.round(H * (this.padRatio ?? 0.12)));
    this.h = new Float32Array(W * H);
    this.inside = new Uint8Array(W * H);
    const r = this.inner, rr = (r.y1 - r.y0) / 2;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const cx = Math.min(Math.max(x + 0.5, r.x0 + rr), r.x1 - rr);
      if (Math.hypot(x + 0.5 - cx, y + 0.5 - (r.y0 + rr)) < rr - 0.5) this.inside[y * W + x] = 1;
    }
    this.talus = 0.115 * 208 / Math.max(H, 60);       // steepest slope the sand holds, per cell
    this.moved = [W, 0]; this.dirty = true;
    const gl = this.gl;
    if (gl && !gl.isContextLost()) {
      gl.bindTexture(gl.TEXTURE_2D, this.tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.R16F, W, H, 0, gl.RED, gl.FLOAT, null);
    }
    this.fallbackReady = false;
    this.layout?.();
    this.spriteKey = null;
  }
  get inner() { return { x0: this.pad, x1: this.W - this.pad, y0: this.pad, y1: this.H - this.pad }; }

  // Straight raked lines, n of them across the tray, wandering slightly like a hand on the rake.
  lines(x, y, n, seed = 0) {
    const { y0, y1 } = this.inner, p = (y1 - y0) / n, w = p * 0.28; let v = 0;
    for (let l = 0; l < n; l++) {
      const yc = y0 + p * (l + 0.5) + Math.sin(x * 0.022 + l * 1.7 + seed) * p * 0.05 + Math.sin(x * 0.074 + l + seed) * p * 0.02;
      const t = (y - yc) / w;
      if (t > 3 || t < -3) continue;
      v += this.groove(t);
    }
    return v;
  }
  // One raked groove seen across it: a rounded trough with a low ridge either side.
  groove(t) { const at = t < 0 ? -t : t; return -1.0 * Math.exp(-t * t * 1.3) + 0.4 * Math.exp(-((at - 1.25) ** 2) * 3); }
  // Push `extra` sand from cell i ahead in direction dir (+1/-1 along x), landing k0..k0+reach
  // cells away and spread across ±spread rows: the bow wave in front of whatever moved it.
  push(i, extra, dir, k0, reach, spread) {
    const W = this.W, h = this.h, ins = this.inside;
    if (!this.kw || this.kw.length !== reach + 1) { const a = [0]; let t = 0; for (let k = 1; k <= reach; k++) { const u = k / (reach + 1); a[k] = u * (1 - u) * (1 - u); t += a[k]; } this.kw = a.map(v => v / t); }
    for (let dy = -spread; dy <= spread; dy++) {
      const wy = extra * 0.95 * (1 - Math.abs(dy) / (spread + 1)) / (spread + 1);
      for (let k = 1; k <= reach; k++) {
        let j = i + dy * W + dir * (k0 + k);
        // sand pushed into the rim piles up against it instead of vanishing
        for (let n = 0; n < k0 + k && !ins[j]; n++) j -= dir;
        if (ins[j]) h[j] += wy * this.kw[k];
      }
    }
  }
  // Sand slides downhill until no step is steeper than the talus slope. `wall` (a column) blocks it.
  relax(xa, xb, iters, wall = -9) {
    const { y0, y1 } = this.inner, W = this.W, h = this.h, ins = this.inside, T = this.talus, xs = this.xsmooth || 0, hold = this.hold;
    xa = Math.max(this.inner.x0, Math.floor(xa)); xb = Math.min(this.inner.x1 - 1, Math.ceil(xb));
    let lo = W, hi = 0;
    for (let it = 0; it < iters; it++) {
      for (let y = y0; y < y1 - 1; y++) for (let x = xa; x < xb; x++) {
        const i = y * W + x; if (!ins[i] || (hold && hold[i])) continue;
        let j = i + 1;
        if (ins[j] && x !== wall && !(hold && hold[j])) {
          const d = h[i] - h[j], ex = (d < 0 ? -d : d) - T;
          if (ex > 0) { const m = d > 0 ? ex * 0.22 : -ex * 0.22; h[i] -= m; h[j] += m; if (ex > 2e-3) { if (x < lo) lo = x; if (x > hi) hi = x; } }
          // a little smoothing along x: grooves that run along x are untouched, seams across them fade
          if (xs) { const m = (h[i] - h[j]) * xs; h[i] -= m; h[j] += m; }
        }
        j = i + W;
        if (ins[j] && !(hold && hold[j])) {
          const d = h[i] - h[j], ex = (d < 0 ? -d : d) - T;
          if (ex > 0) { const m = d > 0 ? ex * 0.22 : -ex * 0.22; h[i] -= m; h[j] += m; if (ex > 2e-3) { if (x < lo) lo = x; if (x > hi) hi = x; } }
        }
      }
    }
    if (hi >= lo) { this.moved = [lo, hi]; this.dirty = true; } else this.moved = [W, 0];
  }
  // Canvas 2D compatibility renderer. It draws the same height field and material frame
  // when WebGL2 is unavailable or a browser has evicted a context.
  renderFallback() {
    if (!this.fallbackCanvas) {
      this.fallbackCanvas = document.createElement('canvas');
      this.fallbackCanvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none';
      this.insertBefore(this.fallbackCanvas, this.o);
    }
    this.c.style.visibility = 'hidden';
    this.fallbackCanvas.style.display = 'block';
    const ctx = this.fallbackContext || (this.fallbackContext = this.fallbackCanvas.getContext('2d'));
    if (!ctx || !this.h || !this.inside || !this.W || !this.H) return;

    const W = this.W, H = this.H, k = this.k || 1;
    const width = Math.round(W * k), height = Math.round(H * k);
    if (this.fallbackCanvas.width !== width || this.fallbackCanvas.height !== height) {
      this.fallbackCanvas.width = width; this.fallbackCanvas.height = height; this.fallbackReady = false;
    }
    if (!this.fallbackSand || this.fallbackSand.width !== W || this.fallbackSand.height !== H) {
      this.fallbackSand = document.createElement('canvas');
      this.fallbackSand.width = W; this.fallbackSand.height = H;
      this.fallbackSandContext = this.fallbackSand.getContext('2d');
      this.fallbackReady = false;
    }
    if (this.dirty || !this.fallbackReady) {
      const paint = this.fallbackSandContext;
      const image = paint.createImageData(W, H), pixels = image.data, h = this.h, inside = this.inside;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const i = y * W + x;
        if (!inside[i]) continue;
        const z = h[i] || 0;
        const left = x > 0 ? h[i - 1] : z, right = x + 1 < W ? h[i + 1] : z;
        const up = y > 0 ? h[i - W] : z, down = y + 1 < H ? h[i + W] : z;
        const grain = (((x * 73856093) ^ (y * 19349663)) >>> 0) & 15;
        const shade = Math.max(0.66, Math.min(1.2, 0.91 + (left - right) * 0.15 + (up - down) * 0.12
          + Math.max(-0.1, Math.min(0.1, z * 0.045)) + (grain - 7.5) * 0.0035));
        const p = i * 4;
        pixels[p] = Math.round(239 * shade); pixels[p + 1] = Math.round(223 * shade);
        pixels[p + 2] = Math.round(191 * shade); pixels[p + 3] = 255;
      }
      paint.putImageData(image, 0, 0);
      this.fallbackReady = true;
      this.dirty = false;
    }

    const rounded = (g, x, y, w, h, radius) => {
      const r = Math.max(0, Math.min(radius, w / 2, h / 2));
      g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r);
      g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r);
      g.arcTo(x, y, x + w, y, r); g.closePath();
    };
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, width, height);
    ctx.save(); ctx.shadowColor = 'rgba(45,29,17,.32)'; ctx.shadowBlur = 7 * k; ctx.shadowOffsetY = 2 * k;
    const wood = ctx.createLinearGradient(0, 0, 0, height);
    wood.addColorStop(0, '#8b694c'); wood.addColorStop(0.22, '#6e4e36');
    wood.addColorStop(0.78, '#553a2a'); wood.addColorStop(1, '#78563b');
    rounded(ctx, 0.5 * k, 0.5 * k, width - k, height - k, height / 2);
    ctx.fillStyle = wood; ctx.fill(); ctx.restore();

    const pad = this.pad * k, x = pad, y = pad, w = width - 2 * pad, h = height - 2 * pad;
    ctx.save(); rounded(ctx, x, y, w, h, h / 2); ctx.clip();
    ctx.drawImage(this.fallbackSand, 0, 0, width, height); ctx.restore();
    ctx.lineWidth = Math.max(1, k); rounded(ctx, x, y, w, h, h / 2);
    ctx.strokeStyle = 'rgba(80,54,35,.72)'; ctx.stroke();

    const drawStone = (stone) => {
      if (!stone || !(stone[2] > 0) || !(stone[3] > 0)) return;
      const [sx, sy, rx, ry] = stone;
      ctx.save(); ctx.shadowColor = 'rgba(35,28,23,.42)'; ctx.shadowBlur = Math.max(rx, ry) * 0.22 * k;
      ctx.shadowOffsetX = rx * 0.08 * k; ctx.shadowOffsetY = ry * 0.16 * k;
      const grad = ctx.createRadialGradient((sx - rx * 0.28) * k, (sy - ry * 0.35) * k,
        Math.max(1, rx * 0.08 * k), sx * k, sy * k, Math.max(rx, ry) * 1.2 * k);
      grad.addColorStop(0, '#b9b9b1'); grad.addColorStop(0.55, '#85877f'); grad.addColorStop(1, '#51544f');
      ctx.beginPath(); ctx.ellipse(sx * k, sy * k, rx * k, ry * k, -0.08, 0, Math.PI * 2);
      ctx.fillStyle = grad; ctx.fill(); ctx.shadowColor = 'transparent';
      ctx.strokeStyle = 'rgba(40,39,35,.55)'; ctx.lineWidth = Math.max(1, k); ctx.stroke(); ctx.restore();
    };
    drawStone(this.stone);
    for (const stone of (this.stones || []).slice(0, 4)) drawStone(stone);
    if (this.moss) {
      const [mx, my, radius] = this.moss, r = Math.max(1, radius * k);
      const grad = ctx.createRadialGradient(mx * k, my * k, r * 0.2, mx * k, my * k, r);
      grad.addColorStop(0, 'rgba(81,116,65,.3)'); grad.addColorStop(1, 'rgba(81,116,65,0)');
      ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(mx * k, my * k, r, 0, Math.PI * 2); ctx.fill();
    }
  }
  render() {
    if (this.nogl || !this.gl || this.gl.isContextLost()) {
      this.nogl = true; this.renderFallback(); return;
    }
    if (this.c.style.visibility === 'hidden') this.c.style.visibility = 'visible';
    if (this.fallbackCanvas) this.fallbackCanvas.style.display = 'none';
    const gl = this.gl, k = this.k;
    const key = this.stone ? this.stone.map(v => v.toFixed(2)).join() + '|' + (this.stoneShape || [0, 0]).join() + '|' + (this.lift ?? 1).toFixed(3) + '|' + (this.stoneA || [1, 1]).map(v => v.toFixed(3)).join() : '';
    const st = this.stones || [];                        // [x, y, rx, ry, lift, a, shadow] each
    const skey = st.map(v => v.map(n => n.toFixed(3)).join()).join('|');
    const mkey = this.moss ? this.moss.map(v => v.toFixed(1)).join() : '';
    if (this.dirty || key !== this.stoneKey || skey !== this.stonesKey || mkey !== this.mossKey) {
      gl.bindTexture(gl.TEXTURE_2D, this.tex);
      if (this.dirty) gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, this.W, this.H, gl.RED, gl.FLOAT, this.h);
      gl.viewport(0, 0, this.c.width, this.c.height);
      gl.useProgram(this.prog);
      gl.uniform1i(this.u.uH, 0); gl.uniform2f(this.u.uRes, this.c.width, this.c.height);
      gl.uniform2f(this.u.uSim, this.W, this.H); gl.uniform1f(this.u.uPad, this.pad * k);
      const s = this.stone || [0, 0, 0, 0]; gl.uniform4f(this.u.uStone, s[0] * k, s[1] * k, s[2] * k, s[3] * k);
      const sp = this.stoneShape || [0, 0]; gl.uniform2f(this.u.uShape, sp[0], sp[1] * k); gl.uniform1f(this.u.uLift, this.lift ?? 1);
      const sa = this.stoneA || [1, 1]; gl.uniform2f(this.u.uStoneA, sa[0], sa[1]);
      if (!this.u.uSt) { this.u.uSt = gl.getUniformLocation(this.prog, 'uSt'); this.u.uStP = gl.getUniformLocation(this.prog, 'uStP'); }
      const a = new Float32Array(16), b = new Float32Array(16);
      st.slice(0, 4).forEach((v, i) => { a.set([v[0] * k, v[1] * k, v[2] * k, v[3] * k], i * 4); b.set([v[4], v[5], v[6], 0], i * 4); });
      gl.uniform4fv(this.u.uSt, a); gl.uniform4fv(this.u.uStP, b); gl.uniform1i(this.u.uNSt, Math.min(4, st.length));
      const m = this.moss || [0, 0, 0, 1]; gl.uniform4f(this.u.uMoss, m[0] * k, m[1] * k, m[2] * k, m[3] * k);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      this.dirty = false; this.stoneKey = key; this.stonesKey = skey; this.mossKey = mkey;
    }
  }
  tick(now) {
    if (!this.running) return;
    const dt = Math.min(0.033, (now - this.last) / 1000); this.last = now;
    this.step(dt);
    this.render();
    this.sprites?.();
    requestAnimationFrame(this.tick);
  }
}

window.GrainMotionUI = { Sound, SandTray, version: 1 };
})();
// <<< grainmotion-ui core
// >>> sounds (stamped by tools/build.mjs from sounds/)
window.GrainMotionUI.Sound.add({
  'stone': 'data:audio/mpeg;base64,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',
  'tap': 'data:audio/mpeg;base64,SUQzBAAAAAAAIlRTU0UAAAAOAAADTGF2ZjYzLjEuMTAxAAAAAAAAAAAAAAD/+2DAAAAAAAAAAAAAAAAAAAAAAABJbmZvAAAADwAAAAcAAAgqAD8/Pz8/Pz8/Pz8/Pz8/YGBgYGBgYGBgYGBgYGCAgICAgICAgICAgICAgJ+fn5+fn5+fn5+fn5+fn7+/v7+/v7+/v7+/v7+/4ODg4ODg4ODg4ODg4OD//////////////////wAAAABMYXZjNjMuMS4AAAAAAAAAAAAAAAAkBSIAAAAAAAAIKo8c7tEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+2DEAAALkKr2FCYAAhIlq3ca8AL//OcOBnizpocGCzTgQAIAcJiGIY7oQExHsYHkJLJ7Qlk9+lJv9DszXv4sMHGxIJjkywcHnU7b3vLBwJZPP338Tg+FgfEAIFwcDGsEFg+Hy4Pg+D//5c/8EP/y4fAFFttisdqtNhsVrEoA/q506bgU4rjjBbIZ/8s8kzQt6aYFMXcQMTSUBwso52QJocYDwW03D/NNC4EFz3Q/wZZakwE3mYewO8v99jc2ZmeuzQlmmfvFY10eRPilHp+Hh/L3Bnf0s1/d7/+9/Kf55zzv5DQfysc8/8755/////9b////88T99H0f/3ZsDjZVWJuTTNz/+2LEB4APRT1QGJWAAd4hbBce8ABQcHeGI7hFIU3LxBGo/D6RB6NzYeFyObEZceQ8LEceDRUiLLkwnnyw+aGg9DyqbGmuaZuZBwzHYHB3nzyF1ak6XzQ/5v6hpTk3/MTfVfPOoaLG665ot3///F///rK5uost63//KFATEDlvEH/oBEEh4rZ5oQG2o4FXzxuopkINAnQjxjuLSjVKfjMDkJETlDFUplO95akmG6Za/5Hve+R8UhllGfE0k7175PI+Q1DV4n6Hlgffyy///882c0H7WrnUH//OP///FjTPfjE83////////72BH8KWoMi3/21IAhlXUgCQAAAAS2UxCgwY1FNw//tgxAcBjwCdSV2HgAGwJOi1go6gXGcOUMRcWLw5EXgdp52sqqgCJcC1EqLktGgihPIKpmNFDYUPDy72IvVgwnqrnhSX0hy3Cj2hquSNnec7/+97zj43ePgIhETlQzKhMRihwGQeEgNA4EmCk0IBOABdDP2jgMNOLCwMVePs6QI0QpNEWJKGCykk2dsKnIImX4lk+pirmajr4370GrtgymgdlTdaaBr0GDIeh0Oqupn4+MD44aHZkBnOR26XZDBHIpfIgc79O/qv5s8NtqRec/YNGFKiRbSpF6PrGOkLRTg3Cb/N0PNiBe/9CBAAACylIQIacQKGRSVw3t6NvnJ4BQ7BU+kb//tgxA0BjwihOMypMpHoF+ZJh6aYDGV/p10rKYOVOmWyBkwJgkCP4IgAAJ4Jgngj/8PiwfBLh4XQokaPp97un0b0CDoUKDu/RJYYKJxTCRyETriS2IStB144RSodAoGC7HkI80Sax6KhEJRwsE0YClmb+8DkqzmhRJS0SqrAyiOpewyy2++4CUw1R5YJo5hSluZTHkz9OpQ4LubWNp1RgsTc6ONWGx1cfIy1C1OJYWttN9tV6ea+1tSv5Ptq/9r/6dDPFB0VHDvOnP/397003v//T+wOA0piXvFeb7dbKDoeCgWIjBKdlhiBDk9C6ggAABJIkXAk2wNYqpmkOw1qaf6Nuggg//tgxAuBjxC5LMw1dAHZmKTVh6U4WNGFDmnFzGDowoxSZ6lurgAqF2vk9zOnqhBNi6xcLQ4AMMuQEaFox/F1h6HeRLKRuKjMx/zGA9QO8PRBZj+oarY8+t6/CwoaMh5QeUBRQ4DrOfUwTvXCaBGInjHlkx2eTrDGtpYhhkqqw6fnWoNLTrN88SyN0DQNFEDGF8hxTj4ayqCgqFjiCyop0m4qVY0YhUFXIiGrl8VJJjKZo4TGAbOHxUWQAoyeOpEGH+f/FZn8BjqoNnjhqjyJK0TWPSh0n/9ISIBRKVyaNTdsXVcKNat0aLjkvX/ZAjkEAAAABTpOg0QPpvG2WMdpwqFXKBVL//tixAwAjQSvJ6ewzMFWlWMo9I3oCODiMmQCKmQpFNRJBiO5qlEk1TAwkd+JwVQUOCh12UTKJsSInpLK7JrIlFd0SBy/zQlEiSRV/l6UFb0qQcCyBT6vrO+RkV5L6/XU9rVO3oQAAsABUT04+jyrVhcYUWFek5PSwyuhSoTNCEMpPEIJPxVnrBYARLGDSxpIVNVqFJpUyibRWKqkynGwwEKI7Gqk20cBUFQ6IS3I2f1flhF/R/yUz21JpQwAAABGAwcJOPU5tbCGBggyEgKRCYZOxgqFRUVFB4CJBWCxIKuoCoq3+WIhIftHmfsW7SLAUiE4xAV0BVlAqAvWkY2vWKEtREYgiP/7YMQlg8noJPLjBETAAAA0gAAABE3f/URVTEFNRTQuMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==',
});
// <<< sounds
const { SandTray, Sound } = window.GrainMotionUI;
const make=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
const emit=(el,name,detail)=>el.dispatchEvent(new CustomEvent(name,{bubbles:true,composed:true,detail}));
class SandCommand extends SandTray{
  static get observedAttributes(){return ['label','placeholder','open','disabled'];}
  constructor(){super();this._ready=false;this._commands=[];this._active=0;this._opener=null;}
  get aspect(){return .28;}
  get open(){return !!this.dialog?.open;}
  set open(v){v?this.show():this.hide('property');}
  get disabled(){return this.hasAttribute('disabled');}
  set disabled(v){this.toggleAttribute('disabled',!!v);this.syncDisabled?.();}
  get commands(){return this._commands.map(x=>({...x}));}
  set commands(v){const seen=new Set();this._commands=(Array.isArray(v)?v:[]).map((x,i)=>{const id=String(x?.id??'command-'+(i+1));if(seen.has(id))return null;seen.add(id);return{id,label:String(x?.label??id),description:String(x?.description||''),keywords:String(x?.keywords||''),shortcut:String(x?.shortcut||''),disabled:!!x?.disabled};}).filter(Boolean);this.renderResults?.();}
  get value(){return this.filtered?.()[this._active]?.id||'';}
  set value(v){const index=this.filtered?.().findIndex(item=>item.id===String(v));if(index>=0){this._active=index;this.syncActive?.();}}
  attributeChangedCallback(name,old,value){if(!this._ready||old===value)return;if(name==='open'){if(value!==null)this.show();else this.hide('attribute');}else if(name==='disabled')this.syncDisabled();else this.syncLabels();}
  init(){
    this._ready=true;this.style.touchAction='pan-y';
    if(!this._commands.length)this.commands=[{id:'new',label:'Create new project',description:'Start with a blank workspace',keywords:'add create project',shortcut:'N'},{id:'search',label:'Search files',description:'Find a file or document',keywords:'find lookup'},{id:'settings',label:'Open settings',description:'Manage workspace preferences',keywords:'preferences config'},{id:'export',label:'Export workspace',description:'Download the current project',keywords:'download save'}];
    const style=make('style');style.textContent='.gm-command-ui{position:absolute;inset:9px;display:grid;place-items:center;z-index:3}.gm-command-trigger{display:flex;align-items:center;gap:12px;min-width:min(270px,100%);height:48px;padding:0 17px;border:1px solid #725338;border-radius:16px;background:linear-gradient(145deg,#96714c,#5c3f29);box-shadow:inset 0 1px #ffffff88,0 7px 13px #38271955;color:#fff2df;font:700 12px ui-sans-serif,system-ui,sans-serif;cursor:pointer}.gm-command-trigger:before{content:"";width:16px;height:16px;border:2px solid #f5e4ca;border-radius:50%;box-shadow:inset 0 0 0 4px #6b4b30}.gm-command-trigger kbd{margin-left:auto;padding:3px 7px;border:1px solid #ead5b4aa;border-radius:6px;color:#f7e8d2;font:11px ui-monospace,monospace}.gm-command-trigger:disabled{opacity:.45;cursor:not-allowed}.gm-command-trigger:focus-visible,.gm-command-item:focus-visible{outline:2px solid #382719;outline-offset:3px}.gm-command-dialog{width:min(560px,calc(100vw - 28px));max-width:none;max-height:min(74dvh,620px);padding:0;border:1px solid #745638;border-radius:18px;background:linear-gradient(150deg,#f3e7d3,#d9c3a0);color:#493522;box-shadow:0 24px 70px #23170f88,inset 0 1px #fff;overflow:hidden}.gm-command-dialog::backdrop{background:#2018109c;backdrop-filter:blur(3px)}.gm-command-panel{display:flex;flex-direction:column;max-height:min(74dvh,620px)}.gm-command-search{width:100%;height:54px;padding:0 18px;border:0;border-bottom:1px solid #bba17b;background:#fff8ed;color:#493522;font:600 15px ui-sans-serif,system-ui,sans-serif;outline-offset:-3px}.gm-command-results{overflow:auto;padding:8px;display:grid;gap:4px}.gm-command-item{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:3px 12px;width:100%;padding:10px 12px;border:1px solid transparent;border-radius:10px;background:transparent;text-align:left;color:#4b3926;cursor:pointer}.gm-command-item[aria-selected=true],.gm-command-item:hover{border-color:#a78b65;background:linear-gradient(145deg,#b69d79,#92744f);color:#fff5e6;box-shadow:inset 0 1px #fff8,0 2px 4px #4b382322}.gm-command-name{font:700 13px ui-sans-serif,system-ui,sans-serif}.gm-command-description{grid-column:1;color:#80694b;font:11px ui-sans-serif,system-ui,sans-serif}.gm-command-item[aria-selected=true] .gm-command-description{color:#fff0db}.gm-command-shortcut{grid-column:2;grid-row:1/3;align-self:center;font:11px ui-monospace,monospace;opacity:.8}.gm-command-empty{padding:24px;text-align:center;color:#7c674a;font-size:12px}.gm-command-foot{padding:9px 13px;border-top:1px solid #c2aa87;color:#80694b;font:11px ui-sans-serif,system-ui,sans-serif}@media(prefers-reduced-motion:reduce){.gm-command-item{transition:none}}';
    this.append(style);this.ui=make('div','gm-command-ui');this.trigger=make('button','gm-command-trigger');this.trigger.type='button';this.trigger.append(make('span','','Open command palette'),make('kbd','','Ctrl K'));this.trigger.setAttribute('aria-haspopup','dialog');this.trigger.setAttribute('aria-label',this.getAttribute('label')||'Open commands');this.trigger.addEventListener('click',()=>this.show());this.ui.append(this.trigger);this.append(this.ui);
    this.dialog=make('dialog','gm-command-dialog');this.dialog.setAttribute('aria-label',this.getAttribute('label')||'Command palette');this.panel=make('div','gm-command-panel');this.search=make('input','gm-command-search');this.search.type='search';this.search.placeholder=this.getAttribute('placeholder')||'Search commands';this.search.setAttribute('aria-label','Search commands');this.search.setAttribute('autocomplete','off');this.search.setAttribute('spellcheck','false');this.search.addEventListener('input',()=>{this._active=0;this.renderResults();});this.search.addEventListener('keydown',e=>this.onKey(e));
    this.results=make('div','gm-command-results');this.results.setAttribute('role','listbox');this.results.setAttribute('aria-label','Available commands');this.foot=make('div','gm-command-foot','↑ ↓ Navigate · Enter Run · Esc Close');this.panel.append(this.search,this.results,this.foot);this.dialog.append(this.panel);this.append(this.dialog);
    this.dialog.addEventListener('cancel',e=>{e.preventDefault();this.hide('escape');});this.dialog.addEventListener('click',e=>{if(e.target===this.dialog)this.hide('backdrop');});this.dialog.addEventListener('close',()=>{if(this._open)this.finishClose(this.dialog.returnValue||'close');});
    this.renderResults();this.syncLabels();this.syncDisabled();if(this.hasAttribute('open'))this.show();
  }
  syncLabels(){if(!this.trigger)return;this.dialog.setAttribute('aria-label',this.getAttribute('label')||'Command palette');this.search.placeholder=this.getAttribute('placeholder')||'Search commands';}
  syncDisabled(){if(this.trigger)this.trigger.disabled=this.disabled;if(this.disabled&&this.open)this.hide('disabled');}
  filtered(){const q=this.search?.value.trim().toLocaleLowerCase()||'';return this._commands.filter(x=>!q||[x.label,x.description,x.keywords].join(' ').toLocaleLowerCase().includes(q));}
  renderResults(){if(!this.results)return;const rows=this.filtered();this.results.replaceChildren();if(!rows.length){this.results.append(make('div','gm-command-empty','No matching commands'));this._active=-1;return;}this._active=Math.max(0,Math.min(this._active,rows.length-1));rows.forEach((item,i)=>{const b=make('button','gm-command-item');b.type='button';b.disabled=this.disabled||item.disabled;b.dataset.commandId=item.id;b.setAttribute('role','option');b.setAttribute('aria-selected',String(i===this._active));b.append(make('span','gm-command-name',item.label),make('span','gm-command-description',item.description));if(item.shortcut)b.append(make('span','gm-command-shortcut',item.shortcut));b.addEventListener('mouseenter',()=>{this._active=i;this.syncActive();});b.addEventListener('click',()=>this.run(item.id));this.results.append(b);});}
  syncActive(){if(!this.results)return;const rows=[...this.results.querySelectorAll('[role=option]')];rows.forEach((b,i)=>b.setAttribute('aria-selected',String(i===this._active)));rows[this._active]?.scrollIntoView?.({block:'nearest'});}
  onKey(e){const all=this.filtered();if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(!all.length)return;const dir=e.key==='ArrowDown'?1:-1;let index=this._active;for(let n=0;n<all.length;n++){index=(index+dir+all.length)%all.length;if(!all[index].disabled)break;}this._active=index;this.syncActive();}else if(e.key==='Enter'){e.preventDefault();const item=all[this._active];if(item&&!item.disabled)this.run(item.id);}else if(e.key==='Home'||e.key==='End'){e.preventDefault();this._active=e.key==='Home'?all.findIndex(x=>!x.disabled):all.map(x=>!x.disabled).lastIndexOf(true);this.syncActive();}else if(e.key==='Escape'){e.preventDefault();this.hide('escape');}}
  show(){if(this.disabled||!this.dialog||this.dialog.open)return false;this._opener=document.activeElement;this.search.value='';this._active=0;this.renderResults();this.dialog.showModal();this._open=true;this.setAttribute('open','');this.trigger.setAttribute('aria-expanded','true');this.search.focus();emit(this,'command-open',{});Sound.play('stone',.2);return true;}
  finishClose(reason){this._open=false;this.removeAttribute('open');this.trigger?.setAttribute('aria-expanded','false');const opener=this._opener;this._opener=null;if(opener?.isConnected&&opener.focus)opener.focus();emit(this,'command-close',{reason});}
  hide(reason='close'){if(!this.dialog?.open)return false;const why=String(reason);this.dialog.close(why);if(this._open)this.finishClose(why);Sound.play('tap',.14);return true;}
  run(id){const item=this._commands.find(x=>x.id===String(id));if(!item||item.disabled||this.disabled)return false;const detail={id:item.id,label:item.label,command:{...item}};emit(this,'select',detail);emit(this,'command',detail);Sound.play('stone',.22);this.hide('select');return true;}
  layout(){if(!this.W)return;const r=this.inner;for(let y=r.y0;y<r.y1;y++)for(let x=r.x0;x<r.x1;x++){const i=y*this.W+x;if(this.inside[i])this.h[i]=this.lines(x,y,4,19)*.05;}this.relax(r.x0,r.x1,3);this.dirty=true;this.step();}
  step(dt){const target=this.open?1:0;if(this.reduced)this.marker=target;else this.marker+=(target-this.marker)*Math.min(1,(dt||.016)*7);this.stone=[this.W*.5,this.H*.5,this.H*.07,this.H*.08];}
}
if(!customElements.get('sand-command'))customElements.define('sand-command',SandCommand);
})();