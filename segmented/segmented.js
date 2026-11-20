// GrainMotion-UI Segmented Control: a flat river-stone marker moves between carved sections.
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
});
// <<< sounds
const { Sound, SandTray } = window.GrainMotionUI;

class SandSegmented extends SandTray {
  static formAssociated = true;
  static observedAttributes = ['value', 'label', 'disabled'];
  get aspect() { return .42; }
  constructor() { super(); this._value = ''; this.marker = 0; this.target = 0; this.optionButtons = []; }
  get options() { return (this.getAttribute('options') || 'Day,Week,Month').split(',').map(s => s.trim()).filter(Boolean).slice(0, 5); }
  get value() { return this._value; }
  set value(v) { this.selectValue(String(v), true); }
  get disabled() { return this.hasAttribute('disabled') || !!this._formDisabled; }
  set disabled(v) { this.toggleAttribute('disabled', !!v); this.syncDisabled(); }
  attributeChangedCallback(name, oldValue, newValue) {
    if (!this._ready || oldValue === newValue) return;
    if (name === 'value') this.selectValue(newValue || this.options[0], false);
    if (name === 'label') this.setAttribute('aria-label', newValue || 'Choose a view');
    if (name === 'disabled') this.syncDisabled();
  }
  syncDisabled() {
    this.setAttribute('aria-disabled', String(this.disabled));
    this.optionButtons.forEach(b => { b.disabled = this.disabled; b.tabIndex = !this.disabled && b.dataset.value === this._value ? 0 : -1; });
  }
  formDisabledCallback(v) { this._formDisabled = v; this.syncDisabled(); }
  formResetCallback() { this.selectValue(this.defaultValue, false); }
  init() {
    this._ready = true; this.defaultValue = this.getAttribute('value') || this.options[0];
    this._value = this.options.includes(this.defaultValue) ? this.defaultValue : this.options[0];
    this.setAttribute('role', 'radiogroup'); this.setAttribute('aria-label', this.getAttribute('label') || 'Choose a view');
    this.style.touchAction = 'pan-y'; this.buildOptions(); this.syncDisabled(); this.formValue(this._value);
    this.addEventListener('click', e => { if (!this.disabled && e.target === this) { Sound.wake(); this.selectAt(e.clientX); } });
  }
  buildOptions() {
    for (const b of this.optionButtons) b.remove();
    this.optionButtons = [];
    for (const text of this.options) {
      const b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'radio');
      b.dataset.value = text; b.textContent = text; b.setAttribute('aria-label', text); b.setAttribute('aria-checked', String(text === this._value));
      b.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0';
      b.addEventListener('click', () => { if (!this.disabled) { Sound.wake(); this.selectValue(text, true); } });
      b.addEventListener('focus', () => { this.focusedIndex = this.options.indexOf(text); this.spriteKey = null; });
      b.addEventListener('blur', () => { if (this.focusedIndex === this.options.indexOf(text)) this.focusedIndex = null; this.spriteKey = null; });
      b.addEventListener('keydown', e => this.optionKey(e, text));
      this.append(b); this.optionButtons.push(b);
    }
  }
  optionKey(e, current) {
    if (this.disabled) return;
    const i = this.options.indexOf(current), n = this.options.length;
    let next = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % n;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i + n - 1) % n;
    if (e.key === 'Home') next = 0; if (e.key === 'End') next = n - 1;
    if (next !== null) { e.preventDefault(); Sound.wake(); this.selectValue(this.options[next], true); this.optionButtons[next].focus(); }
    else if (e.key === ' ') { e.preventDefault(); this.selectValue(current, true); }
  }
  selectAt(clientX) {
    const b = this.getBoundingClientRect(), x = (clientX - b.left) / b.width * this.W;
    let best = 0, dist = Infinity;
    this.slotX.forEach((sx, i) => { const d = Math.abs(sx - x); if (d < dist) { dist = d; best = i; } });
    this.selectValue(this.options[best], true);
  }
  selectValue(v, notify) {
    if (!this.options.includes(v)) return;
    const old = this._value; this._value = v; if (!this._ready) return;
    this.target = this.options.indexOf(v); this.formValue(v);
    this.optionButtons.forEach(b => { const on = b.dataset.value === v; b.setAttribute('aria-checked', String(on)); b.tabIndex = on && !this.disabled ? 0 : -1; });
    if (notify && old !== v) { this.dispatchEvent(new Event('input', { bubbles: true })); this.dispatchEvent(new Event('change', { bubbles: true })); Sound.play('tap', .3, 1); }
  }
  layout() {
    const r = this.inner, W = this.W, h = this.h, n = this.options.length;
    this.cy = this.H * .52; this.slotX = this.options.map((_, i) => r.x0 + (i + .5) * (r.x1 - r.x0) / n);
    this.slotW = (r.x1 - r.x0) / n; this.marker = this.target = Math.max(0, this.options.indexOf(this._value));
    for (let y = r.y0; y < r.y1; y++) for (let x = r.x0; x < r.x1; x++) {
      const i = y * W + x; if (!this.inside[i]) continue;
      h[i] = this.lines(x, y, 3, 1.5) * .22;
      const edge = x - r.x0;
      for (let j = 1; j < n; j++) if (Math.abs(edge - j * this.slotW) < 1.5) h[i] -= .24;
    }
    this.relax(r.x0, r.x1, 4); this.dirty = true; this.syncDisabled();
  }
  step(dt) {
    this.marker += (this.target - this.marker) * Math.min(1, dt * 6);
    const i = Math.max(0, Math.min(this.slotX.length - 1, Math.round(this.marker))), x = this.slotX[i] ?? this.W / 2;
    this.stoneShape = [1, this.H * .11];
    this.stone = [x, this.cy, this.slotW * .43, this.H * .22];
  }
  sprites() {
    const c = this.ox, k = this.k, key = this.options.join('|') + '|' + Math.round(this.marker * 100) + '|' + this.focusedIndex;
    if (key === this.spriteKey) return; this.spriteKey = key;
    c.setTransform(k, 0, 0, k, 0, 0); c.clearRect(0, 0, this.W, this.H);
    c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `600 ${Math.max(10, this.H * .14)}px ui-sans-serif, sans-serif`;
    this.options.forEach((label, i) => { c.fillStyle = i === Math.round(this.marker) ? '#f5eddf' : '#67523e'; c.fillText(label, this.slotX[i], this.cy, this.slotW * .85); });
    if (this.focusedIndex != null) { c.strokeStyle = '#2b2a27'; c.lineWidth = 2; c.beginPath(); c.roundRect(this.slotX[this.focusedIndex] - this.slotW * .46, this.cy - this.H * .28, this.slotW * .92, this.H * .56, this.H * .12); c.stroke(); }
  }
}
if (!customElements.get('sand-segmented')) customElements.define('sand-segmented', SandSegmented);
})();
