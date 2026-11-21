// GrainMotion-UI Phase 7: advanced list and layout controls.
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
// >>> sounds
window.GrainMotionUI.Sound.add({
  'stone': 'data:audio/mpeg;base64,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
+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
qWQhhI2h5OqFWsqlIKPSJKBlOKtm1QstdYqRAISRIy1SRAISRAJEiRrzJoKA
QCRJVRJIKhArAUNNhDef++BX8G/iFBXWEwVCO78VwKDf135Hc/woKCgp3hQ3
gUFVTEFNRTQuMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVAIRp89CrZ63N
rU3NcJ6xKVFHaXYmRhnQl3GekskgcjsYKGBgwhyOz/2MUEhyOximVSP6KqfK
iL9URU///3KYGDIHjXxYVDJkFhcRuios3///9XFhfAoVFg8qTEFNRTQuMKqq
qqqqqqqqqqqqqqqqqqqqqqqqqqqq//tgxK0AC9TvGwYYdEGHESJAJ5j5qqqq
qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq
qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq
qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq
qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq
qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq
qqqqqqqqqqqqqqqq//tixLQDyyUAviC8S0AAADSAAAAEqqqqqqqqqqqqqqqq
qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq
qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq
qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq
qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq
qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq
qqqqqg==',
  'tap': 'data:audio/mpeg;base64,SUQzBAAAAAAAIlRTU0UAAAAOAAADTGF2ZjYzLjEuMTAxAAAAAAAAAAAAAAD/
+2DAAAAAAAAAAAAAAAAAAAAAAABJbmZvAAAADwAAAAcAAAgqAD8/Pz8/Pz8/
Pz8/Pz8/YGBgYGBgYGBgYGBgYGCAgICAgICAgICAgICAgJ+fn5+fn5+fn5+f
n5+fn7+/v7+/v7+/v7+/v7+/4ODg4ODg4ODg4ODg4OD/////////////////
/wAAAABMYXZjNjMuMS4AAAAAAAAAAAAAAAAkBSIAAAAAAAAIKo8c7tEAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+2DEAAALkKr2
FCYAAhIlq3ca8AL//OcOBnizpocGCzTgQAIAcJiGIY7oQExHsYHkJLJ7Qlk9
+lJv9DszXv4sMHGxIJjkywcHnU7b3vLBwJZPP338Tg+FgfEAIFwcDGsEFg+H
y4Pg+D//5c/8EP/y4fAFFttisdqtNhsVrEoA/q506bgU4rjjBbIZ/8s8kzQt
6aYFMXcQMTSUBwso52QJocYDwW03D/NNC4EFz3Q/wZZakwE3mYewO8v99jc2
ZmeuzQlmmfvFY10eRPilHp+Hh/L3Bnf0s1/d7/+9/Kf55zzv5DQfysc8/875
5/////9b////88T99H0f/3ZsDjZVWJuTTNz/+2LEB4APRT1QGJWAAd4hbBce
8ABQcHeGI7hFIU3LxBGo/D6RB6NzYeFyObEZceQ8LEceDRUiLLkwnnyw+aGg
9DyqbGmuaZuZBwzHYHB3nzyF1ak6XzQ/5v6hpTk3/MTfVfPOoaLG665ot3//
/F///rK5uost63//KFATEDlvEH/oBEEh4rZ5oQG2o4FXzxuopkINAnQjxjuL
SjVKfjMDkJETlDFUplO95akmG6Za/5Hve+R8UhllGfE0k7175PI+Q1DV4n6H
lgffyy///882c0H7WrnUH//OP///FjTPfjE83////////72BH8KWoMi3/21I
AhlXUgCQAAAAS2UxCgwY1FNw//tgxAcBjwCdSV2HgAGwJOi1go6gXGcOUMRc
WLw5EXgdp52sqqgCJcC1EqLktGgihPIKpmNFDYUPDy72IvVgwnqrnhSX0hy3
Cj2hquSNnec7/+97zj43ePgIhETlQzKhMRihwGQeEgNA4EmCk0IBOABdDP2j
gMNOLCwMVePs6QI0QpNEWJKGCykk2dsKnIImX4lk+pirmajr4370Grtgymgd
lTdaaBr0GDIeh0Oqupn4+MD44aHZkBnOR26XZDBHIpfIgc79O/qv5s8NtqRe
c/YNGFKiRbSpF6PrGOkLRTg3Cb/N0PNiBe/9CBAAACylIQIacQKGRSVw3t6N
vnJ4BQ7BU+kb//tgxA0BjwihOMypMpHoF+ZJh6aYDGV/p10rKYOVOmWyBkwJ
gkCP4IgAAJ4Jgngj/8PiwfBLh4XQokaPp97un0b0CDoUKDu/RJYYKJxTCRyE
TriS2IStB144RSodAoGC7HkI80Sax6KhEJRwsE0YClmb+8DkqzmhRJS0SqrA
yiOpewyy2++4CUw1R5YJo5hSluZTHkz9OpQ4LubWNp1RgsTc6ONWGx1cfIy1
C1OJYWttN9tV6ea+1tSv5Ptq/9r/6dDPFB0VHDvOnP/397003v//T+wOA0pi
XvFeb7dbKDoeCgWIjBKdlhiBDk9C6ggAABJIkXAk2wNYqpmkOw1qaf6Nuggg
//tgxAuBjxC5LMw1dAHZmKTVh6U4WNGFDmnFzGDowoxSZ6lurgAqF2vk9zOn
qhBNi6xcLQ4AMMuQEaFox/F1h6HeRLKRuKjMx/zGA9QO8PRBZj+oarY8+t6/
CwoaMh5QeUBRQ4DrOfUwTvXCaBGInjHlkx2eTrDGtpYhhkqqw6fnWoNLTrN8
8SyN0DQNFEDGF8hxTj4ayqCgqFjiCyop0m4qVY0YhUFXIiGrl8VJJjKZo4TG
AbOHxUWQAoyeOpEGH+f/FZn8BjqoNnjhqjyJK0TWPSh0n/9ISIBRKVyaNTds
XVcKNat0aLjkvX/ZAjkEAAAABTpOg0QPpvG2WMdpwqFXKBVL//tixAwAjQSv
J6ewzMFWlWMo9I3oCODiMmQCKmQpFNRJBiO5qlEk1TAwkd+JwVQUOCh12UTK
JsSInpLK7JrIlFd0SBy/zQlEiSRV/l6UFb0qQcCyBT6vrO+RkV5L6/XU9rVO
3oQAAsABUT04+jyrVhcYUWFek5PSwyuhSoTNCEMpPEIJPxVnrBYARLGDSxpI
VNVqFJpUyibRWKqkynGwwEKI7Gqk20cBUFQ6IS3I2f1flhF/R/yUz21JpQwA
AABGAwcJOPU5tbCGBggyEgKRCYZOxgqFRUVFB4CJBWCxIKuoCoq3+WIhIftH
mfsW7SLAUiE4xAV0BVlAqAvWkY2vWKEtREYgiP/7YMQlg8noJPLjBETAAAA0
gAAABE3f/URVTEFNRTQuMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
VVVVVVVVVVVVVVVVVVVVVVVVVQ==',
});
// <<< sounds
const { SandTray, Sound } = window.GrainMotionUI;
const make = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; };
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, Number(n) || 0));
const emit = (el, name, detail) => el.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true, detail }));
class SandResizable extends SandTray {
  static get observedAttributes() { return ['disabled','label']; }
  get aspect() { return .7; }
  get disabled() { return this.hasAttribute('disabled'); }
  attributeChangedCallback() { this.syncHandles?.(); }
  get panels() { return (this._panels||[]).map(x=>({...x})); }
  set panels(value) {
    this._panels=(Array.isArray(value)?value:[]).slice(0,4).map((x,i)=>({
      id:String(x?.id??'panel-'+(i+1)),label:String(x?.label??'Panel '+(i+1)),
      content:String(x?.content??''),min:clamp(x?.min??18,8,45),max:clamp(x?.max??65,35,90)
    }));
    if(this._panels.length<2)this._panels=[{id:'left',label:'Overview',content:'Project summary and key information',min:18,max:65},{id:'right',label:'Inspector',content:'Selected item details and settings',min:18,max:65}];
    this._sizes=this._panels.map(x=>100/this._panels.length);this.renderPanels?.();
  }
  get sizes() { return (this._sizes||[]).slice(); }
  set sizes(value) { this.setSizes(value,true); }
  init() {
    this.style.touchAction='pan-y';
    this._panels=this._panels||[
      {id:'overview',label:'Overview',content:'Project summary, status and key information.',min:20,max:60},
      {id:'activity',label:'Activity',content:'Recent changes, reviews and deployment events.',min:20,max:60},
      {id:'inspector',label:'Inspector',content:'Details for the selected component.',min:20,max:60},
    ];
    this._sizes=this._panels.length===3?[31,38,31]:this._panels.map(()=>100/this._panels.length);
    const style=make('style');
    style.textContent='.gm-resize-ui{position:absolute;inset:9px;z-index:3;display:grid;gap:0;overflow:hidden;border:1px solid #684a2d;border-radius:14px;background:linear-gradient(145deg,#725237,#4a321f);box-shadow:inset 0 1px #fff6,0 5px 12px #38261955;color:#4c3927;font:500 10px/1.4 ui-sans-serif,system-ui,sans-serif}.gm-res-panel{min-width:0;min-height:0;overflow:auto;padding:11px 9px;background:linear-gradient(145deg,#f5ead8,#dfcaa8);box-shadow:inset 0 1px #fff9,inset 0 -3px 8px #73532e1a}.gm-res-panel:nth-of-type(even){background:repeating-linear-gradient(176deg,#80654308 0 1px,transparent 1px 12px),linear-gradient(145deg,#eddfc7,#d8c09a)}.gm-res-title{margin:0 0 7px;padding-bottom:5px;border-bottom:1px solid #b79a70;color:#5a4128;font-size:11px;font-weight:750}.gm-res-copy{margin:0;color:#776044;font-size:9px;line-height:1.5}.gm-res-handle{position:relative;z-index:2;min-width:13px;padding:0;border:0;border-left:1px solid #4d341f;border-right:1px solid #c7a77a;background:repeating-linear-gradient(180deg,#e0c79d 0 3px,#ad8b5c 3px 6px);box-shadow:inset 1px 0 #fff7;cursor:col-resize;touch-action:none}.gm-res-handle:before{content:\\\"\\\";position:absolute;left:50%;top:50%;width:5px;height:40px;transform:translate(-50%,-50%);border-radius:5px;background:radial-gradient(circle,#5c442b 1px,transparent 1.5px) center/5px 6px}.gm-res-handle:focus-visible{outline:2px solid #2d2117;outline-offset:-3px}.gm-resize-ui[aria-disabled=true] .gm-res-handle{opacity:.4;cursor:not-allowed}@media(max-width:430px){.gm-res-panel{padding:8px 6px}.gm-res-title{font-size:10px}.gm-res-copy{font-size:8px}}';
    this.append(style);
    this.ui=make('div','gm-resize-ui');this.ui.setAttribute('role','group');this.ui.setAttribute('aria-label',this.getAttribute('label')||'Resizable panels');this.append(this.ui);
    this.renderPanels();
  }
  renderPanels() {
    if(!this.ui)return;
    this.ui.replaceChildren();
    const columns=[];
    this._panels.forEach((panel,i)=>{
      const section=make('section','gm-res-panel');section.setAttribute('aria-label',panel.label);
      section.append(make('h3','gm-res-title',panel.label),make('p','gm-res-copy',panel.content));this.ui.append(section);
      columns.push(String(this._sizes[i])+'fr');
      if(i<this._panels.length-1){
        const b=make('button','gm-res-handle');b.type='button';b.dataset.boundary=String(i);b.setAttribute('role','separator');b.setAttribute('aria-orientation','vertical');b.setAttribute('aria-label','Resize '+panel.label+' and '+this._panels[i+1].label);b.tabIndex=0;
        b.addEventListener('pointerdown',e=>this.beginResize(i,e));
        b.addEventListener('pointermove',e=>this.continueResize(e));
        b.addEventListener('pointerup',()=>this.endResize());
        b.addEventListener('pointercancel',()=>this.endResize());
        b.addEventListener('keydown',e=>this.onResizeKey(e,i));
        this.ui.append(b);columns.push('14px');
      }
    });
    this.ui.style.gridTemplateColumns=columns.join(' ');
    this.syncHandles();
  }
  beginResize(index,e) {
    if(this.disabled)return;e.preventDefault();const r=this.ui.getBoundingClientRect();
    this._drag={index,pointer:e.clientX,start:this._sizes.slice(),width:r.width};
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }
  continueResize(e) {
    if(!this._drag||this.disabled)return;
    const d=this._drag,delta=(e.clientX-d.pointer)/Math.max(1,d.width)*100;
    d.pointer=e.clientX;this.resizeBoundary(d.index,delta,false);
  }
  endResize() { if(!this._drag)return;this._drag=null;emit(this,'change',{sizes:this.sizes}); }
  resizeBoundary(index,delta,notify=true) {
    if(this.disabled||index<0||index>=this._panels.length-1)return false;
    const next=this._sizes.slice(),a=this._panels[index],b=this._panels[index+1];
    const pair=next[index]+next[index+1],minLeft=Math.max(a.min,pair-b.max),maxLeft=Math.min(a.max,pair-b.min);
    const value=clamp(next[index]+Number(delta),minLeft,maxLeft);
    const diff=value-next[index];if(Math.abs(diff)<.001)return false;
    next[index]=value;next[index+1]-=diff;this._sizes=next;this.applySizes();
    this.stone=[this.inner.x0+(next.slice(0,index+1).reduce((s,v)=>s+v,0)/100)*(this.inner.x1-this.inner.x0),this.H*.5,this.H*.055,this.H*.07];
    if(notify)emit(this,'change',{sizes:this.sizes,boundary:index});else emit(this,'input',{sizes:this.sizes,boundary:index});
    return true;
  }
  setSizes(value,notify=true) {
    if(!Array.isArray(value)||value.length!==this._panels.length)return false;
    const nums=value.map(x=>Math.max(0,Number(x)||0)),sum=nums.reduce((a,b)=>a+b,0);
    if(!sum)return false;this._sizes=nums.map(x=>x/sum*100);this.applySizes();
    if(notify)emit(this,'change',{sizes:this.sizes});return true;
  }
  applySizes() {
    if(!this.ui)return;
    const cols=[];this._panels.forEach((p,i)=>{cols.push(String(this._sizes[i])+'fr');if(i<this._panels.length-1)cols.push('14px');});
    this.ui.style.gridTemplateColumns=cols.join(' ');this.syncHandles();
  }
  syncHandles() {
    if(!this.ui)return;
    this.ui.setAttribute('aria-disabled',String(this.disabled));
    this.ui.querySelectorAll('.gm-res-handle').forEach((b,i)=>{
      const total=this._sizes.slice(0,i+1).reduce((s,v)=>s+v,0);
      b.disabled=this.disabled;b.setAttribute('aria-valuemin',String(this._panels[i].min));b.setAttribute('aria-valuemax',String(100-this._panels[i+1].min));b.setAttribute('aria-valuenow',String(Math.round(total)));
    });
  }
  onResizeKey(e,index) {
    if(this.disabled)return;let delta=0;
    if(e.key==='ArrowLeft')delta=-2;else if(e.key==='ArrowRight')delta=2;else if(e.key==='Home')delta=this._panels[index].min-this._sizes[index];else if(e.key==='End')delta=this._panels[index].max-this._sizes[index];else return;
    e.preventDefault();this.resizeBoundary(index,delta,true);
  }
  layout() {
    if(!this.W)return;const r=this.inner;
    for(let y=r.y0;y<r.y1;y++)for(let x=r.x0;x<r.x1;x++){const i=y*this.W+x;if(this.inside[i])this.h[i]=this.lines(x,y,4,34)*.045;}
    this.relax(r.x0,r.x1,3);this.dirty=true;this.step();
  }
  step() {
    const x=this.inner.x0+(this.inner.x1-this.inner.x0)*(this._sizes?.[0]||33)/100;
    this.stone=[x,this.H*.5,this.H*.055,this.H*.075];
  }
}
if (!customElements.get('sand-resizable')) customElements.define('sand-resizable',SandResizable);
})();
