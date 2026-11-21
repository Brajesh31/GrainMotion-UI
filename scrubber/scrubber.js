// GrainMotion-UI Media Scrubber: a tactile media and file control built on the shared sand tray.
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
  disconnectedCallback() { this.running = false; }
  connectedCallback() {
    if (this.c) { if (!this.running) { this.running = true; this.last = performance.now(); requestAnimationFrame(this.tick); } return; }
    this.style.cssText += ';display:block;position:relative;touch-action:none;outline:none;-webkit-tap-highlight-color:transparent';
    this.c = document.createElement('canvas'); this.c.style.cssText = 'display:block;width:100%;height:auto;pointer-events:none';   // events come from the element itself
    this.o = document.createElement('canvas'); this.o.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none';
    this.append(this.c, this.o);
    this.ox = this.o.getContext('2d');
    this.initGL();
    this.stone = null; this.moss = null;
    this.init?.();
    this.resize(); new ResizeObserver(() => this.resize()).observe(this);
    this.running = true; this.last = performance.now(); this.tick = this.tick.bind(this); requestAnimationFrame(this.tick);
  }
  get aspect() { return 0.2; }
  initGL() {
    const gl = this.gl = this.c.getContext('webgl2', { premultipliedAlpha: true, antialias: false });
    if (!gl) { this.nogl = true; this.u = {}; return; }   // no WebGL2: the control still works, it just isn't drawn
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
    if (this.css === css) return; this.css = css;
    const W = Math.round(css), H = Math.round(css * this.aspect);
    this.W = W; this.H = H; this.k = dpr;
    this.c.width = this.o.width = Math.round(W * dpr); this.c.height = this.o.height = Math.round(H * dpr);
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
    const gl = this.gl; if (gl) { gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R16F, W, H, 0, gl.RED, gl.FLOAT, null); }
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
  render() {
    if (this.nogl) return;
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
  'tap': 'data:audio/mpeg;base64,SUQzBAAAAAAAIlRTU0UAAAAOAAADTGF2ZjYzLjEuMTAxAAAAAAAAAAAAAAD/+2DAAAAAAAAAAAAAAAAAAAAAAABJbmZvAAAADwAAAAcAAAgqAD8/Pz8/Pz8/Pz8/Pz8/YGBgYGBgYGBgYGBgYGCAgICAgICAgICAgICAgJ+fn5+fn5+fn5+fn5+fn7+/v7+/v7+/v7+/v7+/4ODg4ODg4ODg4ODg4OD//////////////////wAAAABMYXZjNjMuMS4AAAAAAAAAAAAAAAAkBSIAAAAAAAAIKo8c7tEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+2DEAAALkKr2FCYAAhIlq3ca8AL//OcOBnizpocGCzTgQAIAcJiGIY7oQExHsYHkJLJ7Qlk9+lJv9DszXv4sMHGxIJjkywcHnU7b3vLBwJZPP338Tg+FgfEAIFwcDGsEFg+Hy4Pg+D//5c/8EP/y4fAFFttisdqtNhsVrEoA/q506bgU4rjjBbIZ/8s8kzQt6aYFMXcQMTSUBwso52QJocYDwW03D/NNC4EFz3Q/wZZakwE3mYewO8v99jc2ZmeuzQlmmfvFY10eRPilHp+Hh/L3Bnf0s1/d7/+9/Kf55zzv5DQfysc8/8755/////9b////88T99H0f/3ZsDjZVWJuTTNz/+2LEB4APRT1QGJWAAd4hbBce8ABQcHeGI7hFIU3LxBGo/D6RB6NzYeFyObEZceQ8LEceDRUiLLkwnnyw+aGg9DyqbGmuaZuZBwzHYHB3nzyF1ak6XzQ/5v6hpTk3/MTfVfPOoaLG665ot3///F///rK5uost63//KFATEDlvEH/oBEEh4rZ5oQG2o4FXzxuopkINAnQjxjuLSjVKfjMDkJETlDFUplO95akmG6Za/5Hve+R8UhllGfE0k7175PI+Q1DV4n6Hlgffyy///882c0H7WrnUH//OP///FjTPfjE83////////72BH8KWoMi3/21IAhlXUgCQAAAAS2UxCgwY1FNw//tgxAcBjwCdSV2HgAGwJOi1go6gXGcOUMRcWLw5EXgdp52sqqgCJcC1EqLktGgihPIKpmNFDYUPDy72IvVgwnqrnhSX0hy3Cj2hquSNnec7/+97zj43ePgIhETlQzKhMRihwGQeEgNA4EmCk0IBOABdDP2jgMNOLCwMVePs6QI0QpNEWJKGCykk2dsKnIImX4lk+pirmajr4370GrtgymgdlTdaaBr0GDIeh0Oqupn4+MD44aHZkBnOR26XZDBHIpfIgc79O/qv5s8NtqRec/YNGFKiRbSpF6PrGOkLRTg3Cb/N0PNiBe/9CBAAACylIQIacQKGRSVw3t6NvnJ4BQ7BU+kb//tgxA0BjwihOMypMpHoF+ZJh6aYDGV/p10rKYOVOmWyBkwJgkCP4IgAAJ4Jgngj/8PiwfBLh4XQokaPp97un0b0CDoUKDu/RJYYKJxTCRyETriS2IStB144RSodAoGC7HkI80Sax6KhEJRwsE0YClmb+8DkqzmhRJS0SqrAyiOpewyy2++4CUw1R5YJo5hSluZTHkz9OpQ4LubWNp1RgsTc6ONWGx1cfIy1C1OJYWttN9tV6ea+1tSv5Ptq/9r/6dDPFB0VHDvOnP/397003v//T+wOA0piXvFeb7dbKDoeCgWIjBKdlhiBDk9C6ggAABJIkXAk2wNYqpmkOw1qaf6Nuggg//tgxAuBjxC5LMw1dAHZmKTVh6U4WNGFDmnFzGDowoxSZ6lurgAqF2vk9zOnqhBNi6xcLQ4AMMuQEaFox/F1h6HeRLKRuKjMx/zGA9QO8PRBZj+oarY8+t6/CwoaMh5QeUBRQ4DrOfUwTvXCaBGInjHlkx2eTrDGtpYhhkqqw6fnWoNLTrN88SyN0DQNFEDGF8hxTj4ayqCgqFjiCyop0m4qVY0YhUFXIiGrl8VJJjKZo4TGAbOHxUWQAoyeOpEGH+f/FZn8BjqoNnjhqjyJK0TWPSh0n/9ISIBRKVyaNTdsXVcKNat0aLjkvX/ZAjkEAAAABTpOg0QPpvG2WMdpwqFXKBVL//tixAwAjQSvJ6ewzMFWlWMo9I3oCODiMmQCKmQpFNRJBiO5qlEk1TAwkd+JwVQUOCh12UTKJsSInpLK7JrIlFd0SBy/zQlEiSRV/l6UFb0qQcCyBT6vrO+RkV5L6/XU9rVO3oQAAsABUT04+jyrVhcYUWFek5PSwyuhSoTNCEMpPEIJPxVnrBYARLGDSxpIVNVqFJpUyibRWKqkynGwwEKI7Gqk20cBUFQ6IS3I2f1flhF/R/yUz21JpQwAAABGAwcJOPU5tbCGBggyEgKRCYZOxgqFRUVFB4CJBWCxIKuoCoq3+WIhIftHmfsW7SLAUiE4xAV0BVlAqAvWkY2vWKEtREYgiP/7YMQlg8noJPLjBETAAAA0gAAABE3f/URVTEFNRTQuMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==',
  'settle': 'data:audio/mpeg;base64,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iIhVLqAAyU220IBHIQ0RYB5CD4lSTHanVnkUqc20cckdSoXM4hcnVBJQVIlWkzYfx/+0f3GE5PR8W1EhPJWYSEPXrx15Tx2IcGJTpEVtcdiTOGTtzN9iPC7bR9+Xff/S3N34dD//+2DEmoAMrFtNwLDBiaAWaXzDDeD9CbRMQ7oSiAAAM/SpyhhSgBUHiY+LNykuPUaPoTdioUpWcSdIrZSCBw7mziaYtatKw4f3Xs6Mj6eZa/pR8vVtEOVL967hUHubqzTZuqXblbVmf6Hwz4jVqSVtQWAIGKYsV+DL89+SQUqa0UsABWjuPDYCRtH96EsebSaodbYIY4L/IEKOgTlzZbB3gp9ouRczhcMqWuxkZbWCizuTar6xrB12DHFB2Uj1VqJ1lyCwzK66PlmvCcpGtL/6Tex1V9tS6Qr6ewrm/k9LdKKbYAoBIJUidX7quf96pxj4dQBEkFAUFAxKlGP/mvVUv6vnm1X/+2LEq4ANBIdBxJhvCZYqZ3zBiilVI1iqSxmY42xw1iqX/dfy2FMFAUMmNdgYlfjeq+pM2oUBQ+GGcSTfDb4fVL+GsP/mN8xjPQzlQVFHz0KncOVMQU1FNC4wVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUgB0IBKRzIyIaeR+qEEiMDT/5GX0IJE5GrBQwUGEcj+WywyYKGBOhkZNb///mrWUECcjVrHPmRlLkdl7I5NZc+7OUMFBhDhl3qF8yLeviwrrFP/x4tNLFDQFFRUkBRUypMQU1FNC4wqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//tgxL0ATNl3L4OYbkmDsWNwMYr4qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//tgxLeDy+044QCMWwAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq',
});
// <<< sounds
const { SandTray, Sound } = window.GrainMotionUI;

const make=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
const clock=s=>{if(!Number.isFinite(s)||s<0)return '0:00';const n=Math.floor(s);return Math.floor(n/60)+':'+String(n%60).padStart(2,'0');};
class SandScrubber extends SandTray{
 get aspect(){return .32;}
 get media(){return this._media||null;}
 set media(value){
  if(this._media===value)return;
  this.unbindMedia();
  this._media=value&&typeof value.currentTime==='number'?value:null;
  this.bindMedia();
  this.refresh();
 }
 bindMedia(){
  if(!this._media||this._listeners?.length)return;
  this._listeners=[];
  const refresh=()=>this.refresh();
  for(const n of ['timeupdate','durationchange','progress','play','pause','seeking','seeked','ended','loadedmetadata']){this._media.addEventListener(n,refresh);this._listeners.push([n,refresh]);}
 }
 unbindMedia(){
  if(this._media)for(const [n,f] of this._listeners||[])this._media.removeEventListener(n,f);
  this._listeners=[];
 }
 connectedCallback(){super.connectedCallback();this.bindMedia();}

 init(){
  const style=make('style');style.textContent='.gm-scrub-ui{position:absolute;inset:10px;z-index:3;display:grid;grid-template-columns:42px minmax(0,1fr);grid-template-rows:24px 34px;column-gap:10px;align-items:center;padding:9px 12px;border:1px solid #5b4028;border-radius:14px;background:repeating-linear-gradient(174deg,#ffffff08 0 1px,transparent 2px 12px),linear-gradient(145deg,#896644,#583b26);box-shadow:inset 0 1px #ffffff66,inset 0 -3px 7px #2b1b1155,0 5px 13px #38271955;color:#fff0dc;font:500 11px ui-sans-serif,system-ui,sans-serif}.gm-scrub-label{grid-column:1/3;display:flex;justify-content:space-between;gap:8px;font-size:11px}.gm-scrub-state{color:#dfc6a3}.gm-scrub-play{grid-column:1;grid-row:2;width:37px;height:33px;border:1px solid #50351f;border-radius:10px;background:linear-gradient(180deg,#f3e5ce,#cbb18a);box-shadow:inset 0 1px #fff,0 3px 5px #291a1055;color:#4b3522;font-size:14px;cursor:pointer}.gm-scrub-track{position:relative;grid-column:2;grid-row:2;height:12px;border:1px solid #3e2c1d;border-radius:10px;background:linear-gradient(180deg,#3c2a1b,#8a6947);box-shadow:inset 0 2px 4px #20150e99,0 1px #ffffff22}.gm-scrub-buffer,.gm-scrub-played{position:absolute;left:1px;top:2px;height:6px;border-radius:8px;pointer-events:none}.gm-scrub-buffer{width:0;background:linear-gradient(90deg,#d0b48b,#ebd8b6);opacity:.55}.gm-scrub-played{width:0;background:linear-gradient(90deg,#c8a16d,#eddbb8);box-shadow:0 0 5px #f3dbb455}.gm-scrub-range{position:absolute;inset:-9px -1px;width:calc(100% + 2px);height:30px;margin:0;appearance:none;background:transparent;cursor:pointer}.gm-scrub-range::-webkit-slider-runnable-track{height:12px;background:transparent}.gm-scrub-range::-moz-range-track{height:12px;background:transparent}.gm-scrub-range::-webkit-slider-thumb{appearance:none;width:20px;height:20px;margin-top:-4px;border:1px solid #a48a67;border-radius:50%;background:radial-gradient(circle at 30% 23%,#fff8,#fff0 43%),linear-gradient(145deg,#b9b9ae,#5f625e);box-shadow:inset 0 1px #fff,0 3px 6px #1d160f99}.gm-scrub-range::-moz-range-thumb{width:18px;height:18px;border:1px solid #a48a67;border-radius:50%;background:linear-gradient(145deg,#b9b9ae,#5f625e);box-shadow:0 3px 6px #1d160f99}.gm-scrub-range:focus-visible{outline:2px solid #f1dfc3;outline-offset:7px;border-radius:9px}.gm-scrub-ui button:focus-visible{outline:2px solid #f1dfc3;outline-offset:3px}.gm-scrub-ui button:disabled,.gm-scrub-range:disabled{opacity:.45;cursor:not-allowed}';
  this.append(style);this.ui=make('div','gm-scrub-ui');
  const label=make('div','gm-scrub-label');this.title=make('span','',this.getAttribute('label')||'Media position');this.state=make('span','gm-scrub-state','Attach media to scrub');label.append(this.title,this.state);
  this.playButton=make('button','gm-scrub-play','▶');this.playButton.type='button';this.playButton.setAttribute('aria-label','Play media');
  this.track=make('div','gm-scrub-track');this.buffer=make('div','gm-scrub-buffer');this.played=make('div','gm-scrub-played');this.range=make('input','gm-scrub-range');this.range.type='range';this.range.min='0';this.range.max='0';this.range.step='.01';this.range.value='0';this.range.setAttribute('aria-label',this.getAttribute('label')||'Media position');
  this.track.append(this.buffer,this.played,this.range);this.ui.append(label,this.playButton,this.track);this.append(this.ui);
  this.playButton.addEventListener('click',async()=>{if(!this._media)return;try{if(this._media.paused)await this._media.play();else this._media.pause();}catch(error){this.dispatchEvent(new CustomEvent('media-error',{bubbles:true,composed:true,detail:{message:String(error)}}));}});
  this.range.addEventListener('input',()=>{if(!this._media)return;this._media.currentTime=Number(this.range.value);this.refresh();this.dispatchEvent(new CustomEvent('seek',{bubbles:true,composed:true,detail:{time:this._media.currentTime}}));});
  this.range.addEventListener('change',()=>{if(this._media)this.dispatchEvent(new CustomEvent('seeked',{bubbles:true,composed:true,detail:{time:this._media.currentTime}}));});
  this.refresh();
 }
 refresh(){
  if(!this.range)return;
  const m=this._media,d=m&&Number.isFinite(m.duration)?m.duration:0,t=m?Math.min(d||Number(m.currentTime)||0,Number(m.currentTime)||0):0;
  this.range.max=String(d||0);this.range.value=String(t);this.range.disabled=!m||!d||this.hasAttribute('disabled');this.playButton.disabled=!m||this.hasAttribute('disabled');
  this.playButton.textContent=m&&!m.paused?'Ⅱ':'▶';this.playButton.setAttribute('aria-label',m&&!m.paused?'Pause media':'Play media');
  this.title.textContent=this.getAttribute('label')||'Media position';this.state.textContent=m?(clock(t)+' / '+clock(d)):'Attach media to scrub';
  let buffered=0;if(m?.buffered?.length){try{buffered=m.buffered.end(m.buffered.length-1);}catch{}}
  this.buffer.style.width=(d?Math.max(0,Math.min(100,buffered/d*100)):0)+'%';this.played.style.width=(d?Math.max(0,Math.min(100,t/d*100)):0)+'%';
  this.position=d?t/d:0;
 }
 layout(){const r=this.inner;for(let y=r.y0;y<r.y1;y++)for(let x=r.x0;x<r.x1;x++){const i=y*this.W+x;if(this.inside[i])this.h[i]=this.lines(x,y,3,31)*.07;}this.relax(r.x0,r.x1,3);this.dirty=true;}
 step(dt){const p=this.position||0,x=this.inner.x0+p*(this.inner.x1-this.inner.x0);this.stone=[x,this.H*.56,this.H*.06,this.H*.1];this.stoneShape=[1,this.H*.06];}
 disconnectedCallback(){this.unbindMedia();super.disconnectedCallback();}
}
if(!customElements.get('sand-scrubber'))customElements.define('sand-scrubber',SandScrubber);

})();
