// node tools/test.mjs [URL]   drives every control in the gallery with real touch and key events at phone width,
// checks form values and sideways scroll, and exits 1 on a failure. Needs Chrome or Chromium (CHROME=... if it is
// somewhere unusual) and the repo being served: python3 -m http.server 8000, then the default URL works.
import { spawn } from 'node:child_process';
import { rmSync, mkdtempSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const URL_ = process.argv[2] || 'http://localhost:8000/gallery/';
const PORT = await new Promise((res) => { const s = createServer(); s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => res(p)); }); });
const PROFILE = mkdtempSync(join(tmpdir(), 'grainmotion-ui-'));
const chromeOutput = { stdout: '', stderr: '' };
const chrome = spawn(process.env.CHROME || 'chromium', [
  '--headless=new', '--no-sandbox', '--disable-dev-shm-usage', '--no-first-run', '--hide-scrollbars',
  '--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
  '--remote-allow-origins=*', `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFILE}`, 'about:blank'
], { stdio: ['ignore', 'pipe', 'pipe'] });
chrome.stdout.on('data', chunk => { chromeOutput.stdout = (chromeOutput.stdout + chunk.toString()).slice(-4000); });
chrome.stderr.on('data', chunk => { chromeOutput.stderr = (chromeOutput.stderr + chunk.toString()).slice(-8000); });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let targets, lastTargetResponse = 'No response received from Chrome DevTools';
for (let i = 0; i < 100; i++) {
  if (chrome.exitCode !== null) break;
  try {
    const response = await fetch(`http://127.0.0.1:${PORT}/json/list`);
    const body = await response.text();
    lastTargetResponse = `HTTP ${response.status}: ${body.slice(0, 800)}`;
    const parsed = JSON.parse(body);
    if (response.ok && Array.isArray(parsed) && parsed.some(t => t.type === 'page' && t.webSocketDebuggerUrl)) {
      targets = parsed; break;
    }
  } catch (error) { lastTargetResponse = String(error); }
  await sleep(200);
}
const pageTarget = Array.isArray(targets) ? targets.find(t => t.type === 'page' && t.webSocketDebuggerUrl) : null;
if (!pageTarget) {
  chrome.kill();
  throw new Error(`Chrome DevTools did not expose a page target on port ${PORT}. Exit code: ${chrome.exitCode}. Last response: ${lastTargetResponse}. Chrome stderr: ${chromeOutput.stderr}`);
}
const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0; const pending = new Map(); const logs = [];
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } if (m.method === 'Runtime.exceptionThrown') logs.push('EXC ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text)); });
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, (m) => (m.error ? rej(new Error(`${method}: ${m.error.message}`)) : res(m.result))); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true }); if (r.exceptionDetails) logs.push('EVAL ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text)); return r.result.value; };
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 900, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true });
await send('Page.enable'); await send('Page.navigate', { url: URL_ }); await sleep(1800);
// E(tag) is the element; a point in it is given as fractions of its box
const E = (tag) => `document.querySelector('${tag}')`;
const at = async (tag, fx = 0.5, fy = 0.5) => JSON.parse(await ev(`(() => { const e = ${E(tag)}; e.scrollIntoView({ block: 'center' }); const b = e.getBoundingClientRect(); return JSON.stringify([b.left + b.width * ${fx}, b.top + b.height * ${fy}]); })()`));
const touch = (type, x, y) => send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
const tap = async (tag, fx, fy) => { const [x, y] = await at(tag, fx, fy); await sleep(150); await touch('touchStart', x, y); await touch('touchEnd', x, y); };
const swipe = async (x0, y0, x1, y1) => { await touch('touchStart', x0, y0); for (let i = 1; i <= 6; i++) { await touch('touchMove', x0 + (x1 - x0) * i / 6, y0 + (y1 - y0) * i / 6); await sleep(30); } await touch('touchEnd', x1, y1); };
const key = async (k, code) => { await send('Input.dispatchKeyEvent', { type: 'keyDown', key: k, code: k, windowsVirtualKeyCode: code, ...(k === 'Enter' ? { text: '\r' } : k === ' ' ? { text: ' ' } : {}) }); await send('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code: k, windowsVirtualKeyCode: code }); };
const focus = (tag) => ev(`${E(tag)}.focus()`);
// count the events each element fires, so a check can ask whether change really reached the page
await ev(`window.__n = {}; for (const t of ['click', 'input', 'change', 'submit']) document.addEventListener(t, (e) => { const k = e.target.localName + ' ' + t; __n[k] = (__n[k] || 0) + 1; })`);
const fired = (k) => ev(`__n[${JSON.stringify(k)}] || 0`);
let fails = 0;
const check = (name, ok, got) => { if (!ok) fails++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${got !== undefined ? `  ->  ${got}` : ''}`); };

{ // slider: a sideways drag moves it, a vertical swipe does not, and the arrow keys do
  const val = () => ev(`${E('sand-slider')}.value`);
  const [x0, y] = await at('sand-slider', 0.45, 0.5), [x1] = await at('sand-slider', 0.9, 0.5); await sleep(200);
  await swipe(x0, y, x1, y); await sleep(1200); const v1 = await val();
  check('slider: sideways drag raises it, with input and a change', v1 > 75 && (await fired('sand-slider input')) > 0 && (await fired('sand-slider change')) >= 1, v1);
  await swipe(x0, y, x0 + 2, y - 70); await sleep(600);
  check('slider: a vertical swipe leaves it alone', (await val()) === v1, await val());
  await focus('sand-slider');
  const focused = await ev(`document.activeElement === ${E('sand-slider')}`);
  const targetBefore = await ev(`${E('sand-slider')}.target`);
  await key('ArrowLeft', 37); await sleep(1400);
  const targetAfter = await ev(`${E('sand-slider')}.target`), afterKey = await val();
  check('slider: host receives keyboard focus', focused === true, focused);
  check('slider: ArrowLeft updates the rake target', targetAfter < targetBefore, targetBefore + ' -> ' + targetAfter);
  const expectedSliderStep = await ev("document.querySelector('sand-slider').inc / (document.querySelector('sand-slider').max - document.querySelector('sand-slider').min)");
  check('slider: ArrowLeft changes the target by exactly one configured step', Math.abs((targetBefore - targetAfter) - expectedSliderStep) < 0.002, targetBefore + ' -> ' + targetAfter);
  await key('Home', 36); await sleep(1500);
  check('slider: Home takes it to the minimum', (await val()) === 0, await val());
}
{ // toggle: tap on, Space off, a vertical swipe switches nothing
  const on = () => ev(`${E('sand-toggle')}.checked`);
  await tap('sand-toggle'); await sleep(300);
  check('toggle: tap switches it on and fires change', (await on()) === true && (await fired('sand-toggle change')) === 1);
  await focus('sand-toggle'); await key(' ', 32); await sleep(300);
  check('toggle: Space switches it off', (await on()) === false);
  const [x, y] = await at('sand-toggle', 0.5, 0.5); await sleep(150); await swipe(x, y, x + 3, y - 80); await sleep(400);
  check('toggle: a vertical swipe switches nothing', (await on()) === false && (await fired('sand-toggle change')) === 2, await fired('sand-toggle change'));
}
{ // signature: a stroke, then Backspace takes it away
  const [x0, y0] = await at('sand-signature', 0.25, 0.5), [x1, y1] = await at('sand-signature', 0.7, 0.4); await sleep(200);
  await swipe(x0, y0, x1, y1); await sleep(300);
  check('signature: a stroke signs it and fires input', (await ev(`${E('sand-signature')}.empty`)) === false && (await fired('sand-signature input')) >= 1);
  check('signature: toDataURL gives a PNG', /^data:image\/png;base64,/.test(await ev(`${E('sand-signature')}.toDataURL()`)));
  await focus('sand-signature'); await key('Backspace', 8); await sleep(500);
  check('signature: Backspace undoes it', (await ev(`${E('sand-signature')}.empty`)) === true);
}
{ // thinking: the state is what a screen reader hears
  await ev(`${E('sand-thinking')}.state = 'searching'`); await sleep(200);
  check('thinking: searching is read out as Searching', (await ev(`${E('sand-thinking')}.getAttribute('aria-label')`)) === 'Searching');
  await ev(`${E('sand-thinking')}.state = 'idle'`); await sleep(200);
  check('thinking: idle is Ready and not busy', (await ev(`${E('sand-thinking')}.getAttribute('aria-label') + ' ' + ${E('sand-thinking')}.getAttribute('aria-busy')`)) === 'Ready false');
}
{ // checkbox: visual checkmark state, click and Space toggle it
  const el = E('sand-checkbox');
  await tap('sand-checkbox'); await sleep(300);
  check('checkbox: tap checks it and reflects aria-checked', (await ev(`${el}.checked`)) === true && (await ev(`${el}.getAttribute('aria-checked')`)) === 'true');
  await focus('sand-checkbox'); await key(' ', 32); await sleep(250);
  check('checkbox: Space unchecks it', (await ev(`${el}.checked`)) === false && (await ev(`${el}.getAttribute('aria-checked')`)) === 'false');
  await ev(`${el}.disabled = true`);
  check('checkbox: disabled state is exposed', (await ev(`${el}.getAttribute('aria-disabled')`)) === 'true');
}
{ // radio group: selecting a stone updates the value; arrow keys move through options
  await tap('sand-radio-group', 0.83, 0.5); await sleep(250);
  check('radio group: pointer selects the nearest option', (await ev(`${E('sand-radio-group')}.value`)) === 'Overnight');
  await ev(`${E('sand-radio-group')}.querySelector('button[data-value="Overnight"]').focus()`);
  await key('ArrowLeft', 37); await sleep(250);
  check('radio group: ArrowLeft selects the previous option', (await ev(`${E('sand-radio-group')}.value`)) === 'Express');
  check('radio group: selected child exposes aria-checked', (await ev(`${E('sand-radio-group')}.querySelector('button[data-value="Express"]').getAttribute('aria-checked')`)) === 'true');
}
{ // segmented control: a flat stone moves between carved options
  await tap('sand-segmented', 0.83, 0.5); await sleep(250);
  check('segmented: pointer selects the last section', (await ev(`${E('sand-segmented')}.value`)) === 'Month');
  await ev(`${E('sand-segmented')}.querySelector('button[data-value="Month"]').focus()`);
  await key('ArrowLeft', 37); await sleep(250);
  check('segmented: ArrowLeft selects the previous section', (await ev(`${E('sand-segmented')}.value`)) === 'Week');
}
{ // range slider: the two bamboo handles stay ordered and can be keyboard-adjusted
  const el = E('sand-range');
  const beforeLow = await ev(`${el}.low`), beforeHigh = await ev(`${el}.high`);
  const [x0, y] = await at('sand-range', 0.25, 0.5), [x1] = await at('sand-range', 0.43, 0.5);
  await sleep(150); await swipe(x0, y, x1, y); await sleep(350);
  const low = await ev(`${el}.low`), high = await ev(`${el}.high`);
  check('range: dragging the lower rake changes only the lower bound', low > beforeLow && low < high && high === beforeHigh, low + ',' + high);
  await ev(`${el}.querySelector('[role="slider"]').focus()`);
  await key('ArrowRight', 39); await sleep(150);
  check('range: focused lower handle responds to ArrowRight', (await ev(`${el}.low`)) > low);
}
{ // rating: pebble selection, accessible value text and keyboard endpoint
  await tap('sand-rating', 0.85, 0.5); await sleep(200);
  check('rating: pointer selects a value from one to five', (await ev(`${E('sand-rating')}.value`)) === 4);
  check('rating: value text is announced', (await ev(`${E('sand-rating')}.getAttribute('aria-valuetext')`)) === '4 of 5');
  await focus('sand-rating'); await key('End', 35); await sleep(150);
  check('rating: End sets the maximum rating', (await ev(`${E('sand-rating')}.value`)) === 5);
}

{ // text field: native input, accessible name and validation
  await ev("document.querySelector('sand-input').field.value = 'Brajesh'; document.querySelector('sand-input').field.dispatchEvent(new Event('input', { bubbles: true }))");
  check('text field: native input updates the custom-element value', (await ev("document.querySelector('sand-input').value === 'Brajesh'")) === true);
  check('text field: accessible name is applied to the native input', (await ev("document.querySelector('sand-input').field.getAttribute('aria-label')")) === 'Display name');
  await ev("document.querySelector('sand-input').setAttribute('type', 'email'); document.querySelector('sand-input').field.value = 'not-an-email'");
  check('text field: native email validation is retained', (await ev("document.querySelector('sand-input').checkValidity()")) === false);
  await ev("document.querySelector('sand-input').removeAttribute('type')");
}
{ // textarea: multiline text and native row configuration
  await ev("document.querySelector('sand-textarea').field.value = 'first' + String.fromCharCode(10) + 'second'; document.querySelector('sand-textarea').field.dispatchEvent(new Event('input', { bubbles: true }))");
  check('textarea: multiline text is retained', (await ev("document.querySelector('sand-textarea').value.includes(String.fromCharCode(10))")) === true);
  check('textarea: native rows configuration is applied', (await ev("document.querySelector('sand-textarea').field.rows")) === 4);
}
{ // password: hidden by default, revealable, and re-masked without losing value
  check('password: native field is masked by default', (await ev("document.querySelector('sand-password').field.type")) === 'password');
  await ev("document.querySelector('sand-password').value = 'do-not-print-this'");
  await ev("document.querySelector('sand-password').querySelector('button').click()");
  check('password: Show reveals the field and updates aria-pressed', (await ev("document.querySelector('sand-password').revealed && document.querySelector('sand-password').field.type === 'text' && document.querySelector('sand-password').querySelector('button').getAttribute('aria-pressed') === 'true'")) === true);
  await ev("document.querySelector('sand-password').querySelector('button').click()");
  check('password: Hide re-masks the field while retaining its value', (await ev("document.querySelector('sand-password').field.type === 'password' && document.querySelector('sand-password').value.length === 17")) === true);
}
{ // search: custom request event, busy state and clear action
  await ev("window.__phase2 = { search: 0, clear: 0, complete: 0 }; document.addEventListener('search', () => __phase2.search++); document.addEventListener('search-clear', () => __phase2.clear++); document.addEventListener('complete', () => __phase2.complete++)");
  await ev("document.querySelector('sand-search').value = 'grain motion'");
  await ev("document.querySelector('sand-search').search()");
  check('search: request dispatches a bubbling search event', (await ev("__phase2.search")) === 1);
  await ev("document.querySelector('sand-search').busy = true");
  check('search: busy state is exposed through aria-busy', (await ev("document.querySelector('sand-search').getAttribute('aria-busy')")) === 'true');
  await ev("document.querySelector('sand-search').clear()");
  check('search: clear resets the field and dispatches search-clear', (await ev("document.querySelector('sand-search').value === '' && __phase2.clear === 1")) === true);
}
{ // OTP/PIN: numeric sanitation, configured length, autofill hint and completion
  await ev("document.querySelector('sand-otp').field.value = '12a34 567890'; document.querySelector('sand-otp').field.dispatchEvent(new Event('input', { bubbles: true }))");
  check('OTP: non-digits are removed and value is capped at six', (await ev("document.querySelector('sand-otp').value.length === 6 && /^[0-9]+$/.test(document.querySelector('sand-otp').value)")) === true);
  check('OTP: one-time-code autocomplete and numeric input mode are retained', (await ev("document.querySelector('sand-otp').field.autocomplete === 'one-time-code' && document.querySelector('sand-otp').field.inputMode === 'numeric'")) === true);
  check('OTP: complete event fires without exposing the digits', (await ev("__phase2.complete === 1")) === true);
}





{ // select: native options, label, value and required validation
  await ev("window.__phase3Select = { value: '', label: '', requiredInvalid: false, validChoice: false }; const s = document.querySelector('sand-select'); s.field.value = 'express'; s.field.dispatchEvent(new Event('change', { bubbles: true })); window.__phase3Select.value = s.value; window.__phase3Select.label = s.field.selectedOptions[0].textContent; s.required = true; s.field.value = ''; window.__phase3Select.requiredInvalid = !s.checkValidity(); s.field.value = 'standard'; window.__phase3Select.validChoice = s.checkValidity();");
  check('select: native selection updates the host value', (await ev("window.__phase3Select.value")) === 'express');
  check('select: selected label and form value stay distinct', (await ev("window.__phase3Select.label")) === 'Express');
  check('select: required empty choice is invalid', (await ev("window.__phase3Select.requiredInvalid")) === true);
  check('select: valid choice clears required error', (await ev("window.__phase3Select.validChoice")) === true);
}
{ // combobox: datalist suggestions, free text and committed suggestion event
  await ev("window.__phase3Combo = { selected: 0, value: '', freeText: false, connected: false }; const combo = document.querySelector('sand-combobox'); combo.addEventListener('option-selected', event => { window.__phase3Combo.selected++; window.__phase3Combo.value = event.detail.value; }); combo.field.value = 'BLR'; combo.field.dispatchEvent(new Event('input', { bubbles: true })); combo.field.dispatchEvent(new Event('change', { bubbles: true })); window.__phase3Combo.freeText = false; combo.field.value = 'A free text value'; combo.field.dispatchEvent(new Event('input', { bubbles: true })); window.__phase3Combo.freeText = combo.value === 'A free text value'; window.__phase3Combo.connected = combo.field.list === combo.list && combo.list.options.length >= 4;");
  check('combobox: exact suggestion emits option-selected', (await ev("window.__phase3Combo.selected === 1 && window.__phase3Combo.value === 'BLR'")) === true);
  check('combobox: unlisted free text remains allowed', (await ev("window.__phase3Combo.freeText")) === true);
  check('combobox: native datalist is connected', (await ev("window.__phase3Combo.connected")) === true);
}
{ // date picker: ISO date strings, limits and unavailable-day custom validity
  await ev("window.__phase3Date = { iso: false, unavailable: false, available: false, bounds: false }; const date = document.querySelector('sand-date-picker'); date.field.value = '2026-11-24'; date.field.dispatchEvent(new Event('input', { bubbles: true })); window.__phase3Date.iso = date.value === '2026-11-24'; date.setAttribute('unavailable', '2026-11-24'); window.__phase3Date.unavailable = !date.checkValidity(); date.field.value = '2026-11-25'; date.field.dispatchEvent(new Event('input', { bubbles: true })); window.__phase3Date.available = date.checkValidity(); window.__phase3Date.bounds = date.field.min === '2026-01-01' && date.field.max === '2026-12-31';");
  check('date picker: native date is retained as an ISO calendar string', (await ev("window.__phase3Date.iso")) === true);
  check('date picker: unavailable date fails validity', (await ev("window.__phase3Date.unavailable")) === true);
  check('date picker: available date passes validity', (await ev("window.__phase3Date.available")) === true);
  check('date picker: min/max bounds reach the native date input', (await ev("window.__phase3Date.bounds")) === true);
}
{ // date range: ISO serialization, endpoint order, required fields and unavailable values
  await ev("window.__phase3Range = { serialized: false, ordered: false, reversedInvalid: false, unavailableInvalid: false, requiredInvalid: false }; const range = document.querySelector('sand-date-range'); range.start = '2026-11-21'; range.end = '2026-11-25'; window.__phase3Range.serialized = range.value === '2026-11-21/2026-11-25'; window.__phase3Range.ordered = range.checkValidity(); range.end = '2026-11-20'; window.__phase3Range.reversedInvalid = !range.checkValidity(); range.end = '2026-11-25'; range.setAttribute('unavailable', '2026-11-25'); window.__phase3Range.unavailableInvalid = !range.checkValidity(); range.removeAttribute('unavailable'); range.required = true; range.start = ''; range.end = ''; window.__phase3Range.requiredInvalid = !range.checkValidity();");
  check('date range: value serializes start/end ISO strings', (await ev("window.__phase3Range.serialized")) === true);
  check('date range: valid ordered endpoints pass validation', (await ev("window.__phase3Range.ordered")) === true);
  check('date range: end before start is invalid', (await ev("window.__phase3Range.reversedInvalid")) === true);
  check('date range: unavailable endpoint is invalid', (await ev("window.__phase3Range.unavailableInvalid")) === true);
  check('date range: required range needs both endpoints', (await ev("window.__phase3Range.requiredInvalid")) === true);
}
{ // time picker: stable HH:MM value, 12/24 readout and native time constraints
  await ev("window.__phase3Time = { value: false, twelve: false, twentyFour: false, constraints: false }; const time = document.querySelector('sand-time-picker'); time.field.value = '16:30'; time.field.dispatchEvent(new Event('input', { bubbles: true })); window.__phase3Time.value = time.value === '16:30'; time.format = '12'; window.__phase3Time.twelve = time.readout.textContent === '04:30 PM'; time.format = '24'; window.__phase3Time.twentyFour = time.readout.textContent === '16:30'; window.__phase3Time.constraints = time.field.min === '09:00' && time.field.max === '18:00' && time.field.step === '900';");
  check('time picker: value remains timezone-free HH:MM', (await ev("window.__phase3Time.value")) === true);
  check('time picker: 12-hour readout includes AM/PM', (await ev("window.__phase3Time.twelve")) === true);
  check('time picker: 24-hour readout is deterministic', (await ev("window.__phase3Time.twentyFour")) === true);
  check('time picker: min/max/step are applied', (await ev("window.__phase3Time.constraints")) === true);
}

{ // progress bar: determinate bounds and indeterminate accessibility
  await ev("window.__phase4Progress={value:false,clamped:false,indeterminate:false};const p=document.querySelector('sand-progress');p.value=64;window.__phase4Progress.value=p.getAttribute('aria-valuenow')==='64'&&p.getAttribute('role')==='progressbar';p.value=140;window.__phase4Progress.clamped=p.value===100&&p.getAttribute('aria-valuenow')==='100';p.setAttribute('indeterminate','');window.__phase4Progress.indeterminate=!p.hasAttribute('aria-valuenow')&&p.getAttribute('aria-valuetext')==='In progress';");
  check('progress: value updates progressbar ARIA', (await ev("window.__phase4Progress.value"))===true);
  check('progress: value clamps to max', (await ev("window.__phase4Progress.clamped"))===true);
  check('progress: indeterminate omits aria-valuenow', (await ev("window.__phase4Progress.indeterminate"))===true);
}
{ // progress ring: determinate marker and indeterminate state
  await ev("window.__phase4Ring={value:false,indeterminate:false};const ringElPhase4=document.querySelector('sand-progress-ring');ringElPhase4.value=35;window.__phase4Ring.value=ringElPhase4.getAttribute('aria-valuenow')==='35'&&ringElPhase4.getAttribute('role')==='progressbar';ringElPhase4.setAttribute('indeterminate','');window.__phase4Ring.indeterminate=!ringElPhase4.hasAttribute('aria-valuenow')&&ringElPhase4.getAttribute('aria-valuetext')==='In progress';");
  check('progress ring: exposes numeric progress', (await ev("window.__phase4Ring.value"))===true);
  check('progress ring: indeterminate mode omits numeric value', (await ev("window.__phase4Ring.indeterminate"))===true);
}
{ // steps: accessible native buttons, active step and change event
  await ev("window.__phase4Steps={changes:0};const stepsElPhase4=document.querySelector('sand-steps');stepsElPhase4.addEventListener('change',()=>window.__phase4Steps.changes++);stepsElPhase4.buttons[2].click();");
  check('steps: native button selects the requested step', (await ev("document.querySelector('sand-steps').value"))===2);
  check('steps: active step exposes aria-current', (await ev("document.querySelector('sand-steps').buttons[2].getAttribute('aria-current')"))==='step');
  check('steps: change event bubbles on selection', (await ev("window.__phase4Steps.changes"))===1);
  await ev("document.querySelector('sand-steps').disabled=true");
  check('steps: disabled state disables every step button', (await ev("document.querySelector('sand-steps').buttons.every(b=>b.disabled)"))===true);
}
{ // hourglass timer: start, pause, resume, reset, cancel and completion
  await ev("window.__phase4Timer={complete:0};const t=document.querySelector('sand-timer');t.addEventListener('complete',()=>window.__phase4Timer.complete++);t.start();const started=t.running;t.pause();const paused=!t.running;t.pause();const resumed=t.running;t.cancel();const cancelled=!t.running&&t.cancelled&&t.remaining===0;t.reset();const reset=t.remaining===t.duration&&!t.cancelled;t.remaining=.01;t.running=true;t.step(.02);window.__phase4Timer.states={started,paused,resumed,cancelled,reset,complete:window.__phase4Timer.complete,finished:!t.running&&t.remaining===0};");
  check('timer: start, pause, resume, cancel and reset work', (await ev("Object.values(window.__phase4Timer.states).slice(0,5).every(Boolean)"))===true);
  check('timer: reaching zero emits complete once', (await ev("window.__phase4Timer.states.finished&&window.__phase4Timer.states.complete===1"))===true);
}
{ // loading indicator: status semantics, active state and speed
  await ev("window.__phase4Loader={};const l=document.querySelector('sand-loader');window.__phase4Loader.initial=l.getAttribute('role')==='status'&&l.getAttribute('aria-busy')==='true';l.speed=2.5;l.active=false;window.__phase4Loader.stopped=l.getAttribute('aria-busy')==='false';window.__phase4Loader.speed=l.speed===2.5;l.active=true;window.__phase4Loader.restarted=l.getAttribute('aria-busy')==='true';");
  check('loader: announces active status', (await ev("window.__phase4Loader.initial"))===true);
  check('loader: active=false clears aria-busy', (await ev("window.__phase4Loader.stopped"))===true);
  check('loader: speed property is configurable', (await ev("window.__phase4Loader.speed"))===true);
  check('loader: active=true resumes busy state', (await ev("window.__phase4Loader.restarted"))===true);
}

{ // Phase 5 Tabs: selected panel, activation modes, keyboard and disabled items
  await ev("window.__p5Tabs={changes:0};const tabs5=document.querySelector('sand-tabs');tabs5.addEventListener('change',e=>{window.__p5Tabs.changes++;window.__p5Tabs.last=e.detail.value;});");
  check('tabs: exposes a labelled tablist and three tab buttons', await ev("document.querySelector('sand-tabs [role=tablist]')?.getAttribute('aria-label')==='Project sections'&&document.querySelectorAll('sand-tabs [role=tab]').length===3")===true);
  check('tabs: selected tab controls the visible panel', await ev("document.querySelector('sand-tabs [role=tab][aria-selected=true]')?.dataset.value==='overview'&&!document.querySelector('sand-tabs [role=tabpanel][hidden]')?.id.endsWith('overview')")===true);
  await ev("document.querySelector('sand-tabs').buttons[1].click()");
  check('tabs: selecting a tab updates value and change detail', await ev("document.querySelector('sand-tabs').value==='activity'&&window.__p5Tabs.changes===1&&window.__p5Tabs.last==='activity'")===true);
  await ev("(()=>{const tabs=document.querySelector('sand-tabs');tabs.setAttribute('activation','manual');tabs.buttons[2].focus();tabs.buttons[2].dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));})()");
  check('tabs: manual activation keeps arrow focus separate from selected state', await ev("document.querySelector('sand-tabs').value==='activity'")===true);
  check('tabs: arrow focus moves without changing manual selection', await ev("document.activeElement===document.querySelector('sand-tabs').buttons[0]&&document.querySelector('sand-tabs').value==='activity'")===true);
  await ev("document.activeElement.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));");
  check('tabs: Enter activates the manually focused tab', await ev("document.querySelector('sand-tabs').value==='overview'")===true);
  await ev("document.querySelector('sand-tabs').setAttribute('disabled-tabs','activity')");
  check('tabs: disabled tab cannot be focused by arrow navigation', await ev("document.querySelector('sand-tabs').buttons[1].disabled")===true);
}
{ // Phase 5 Accordion: disclosure state, multi-open mode and disabled entries
  await ev("window.__p5Accordion={changes:0};const a5=document.querySelector('sand-accordion');a5.addEventListener('change',()=>window.__p5Accordion.changes++);");
  check('accordion: native headers expose expanded state and labelled panels', await ev("document.querySelector('sand-accordion').buttons[0].getAttribute('aria-expanded')==='true'&&document.querySelector('sand-accordion').panels[0].getAttribute('aria-labelledby')===document.querySelector('sand-accordion').buttons[0].id")===true);
  await ev("document.querySelector('sand-accordion').toggle('returns',true)");
  check('accordion: single-open selection closes the previous compartment', await ev("document.querySelector('sand-accordion').openItems.join(',')==='returns'&&window.__p5Accordion.changes===1")===true);
  await ev("(()=>{const accordion=document.querySelector('sand-accordion');accordion.setAttribute('multiple','');accordion.toggle('care',true);})()");
  check('accordion: multiple mode keeps more than one compartment open', await ev("document.querySelector('sand-accordion').openItems.includes('returns')&&document.querySelector('sand-accordion').openItems.includes('care')")===true);
  await ev("document.querySelector('sand-accordion').setAttribute('disabled-items','shipping')");
  check('accordion: disabled item is not operable', await ev("document.querySelector('sand-accordion').buttons[0].disabled")===true);
}
{ // Phase 5 Pagination: clamping, current-page semantics and event contract
  await ev("window.__p5Pagination={changes:0};const p5=document.querySelector('sand-pagination');p5.addEventListener('change',e=>{window.__p5Pagination.changes++;window.__p5Pagination.detail=e.detail;});");
  check('pagination: exposes named navigation and current page semantics', await ev("document.querySelector('sand-pagination').getAttribute('role')==='navigation'&&document.querySelector('sand-pagination [aria-current=page]')?.textContent==='4'")===true);
  await ev("document.querySelector('sand-pagination').page=99");
  check('pagination: page value clamps to total and emits complete detail', await ev("document.querySelector('sand-pagination').page===24&&window.__p5Pagination.detail.page===24&&window.__p5Pagination.detail.previousPage===4")===true);
  await ev("document.querySelector('sand-pagination').total=3");
  check('pagination: reducing total clamps the current page', await ev("document.querySelector('sand-pagination').page===3&&document.querySelector('sand-pagination').total===3")===true);
  await ev("document.querySelector('sand-pagination').disabled=true");
  check('pagination: disabled state disables all navigation buttons', await ev("document.querySelector('sand-pagination').buttons.every(b=>b.disabled)")===true);
}
{ // Phase 5 Breadcrumbs: native links, current item and URL scheme safety
  await ev("(()=>{const crumbs=document.querySelector('sand-breadcrumbs');window.__p5Crumbs={initial:crumbs.links.length,current:crumbs.nav.querySelector('[aria-current=page]')?.textContent};})()");
  check('breadcrumbs: ancestors are links and current location is not a link', await ev("window.__p5Crumbs.initial===3&&window.__p5Crumbs.current==='Breadcrumbs'")===true);
  await ev("(()=>{const crumbs=document.querySelector('sand-breadcrumbs');crumbs.items=[{label:'Home',href:'/'},{label:'Bad scheme',href:'javascript:alert(1)'},{label:'Current'}];})()");
  check('breadcrumbs: unsafe schemes never become clickable anchors', await ev("document.querySelector('sand-breadcrumbs').links.length===1&&document.querySelector('sand-breadcrumbs nav [aria-current=page]')?.textContent==='Current'")===true);
  await ev("document.querySelector('sand-breadcrumbs').items=[{label:'Home',href:'/'},{label:'Library',href:'/library'},{label:'Components',href:'/components'},{label:'Current'}]");
  check('breadcrumbs: structured item property rebuilds the link trail', await ev("document.querySelector('sand-breadcrumbs').links.length===3")===true);
}
{ // Phase 5 Menu: opening, keyboard focus, dismissal and selected action
  await ev("(()=>{window.__p5Menu={selected:0};document.querySelector('sand-menu').addEventListener('select',e=>{window.__p5Menu.selected++;window.__p5Menu.value=e.detail.value;});})()");
  check('menu: trigger and menu expose menu-button semantics', await ev("document.querySelector('sand-menu .gm-menu-trigger')?.tagName==='BUTTON'&&document.querySelector('sand-menu .gm-menu-trigger')?.getAttribute('aria-haspopup')==='menu'&&!!document.querySelector('sand-menu [role=menu]')")===true);
  await ev("document.querySelector('sand-menu').open=true;");
  check('menu: open property reveals tray and updates expanded state', await ev("document.querySelector('sand-menu').open===true&&!document.querySelector('sand-menu .gm-menu-popup').hidden&&document.querySelector('sand-menu .gm-menu-trigger').getAttribute('aria-expanded')==='true'")===true);
  check('menu: disabled command remains disabled', await ev("document.querySelector('sand-menu').menuItems[2].disabled")===true);
  await ev("document.querySelector('sand-menu').menuItems[1].click()");
  check('menu: selection emits value and label, then closes', await ev("window.__p5Menu.selected===1&&window.__p5Menu.value==='duplicate'&&!document.querySelector('sand-menu').open")===true);
  await ev("(()=>{const menu=document.querySelector('sand-menu');menu.open=true;menu.menuItems[0].focus();menu.menuItems[0].dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));})()");
  check('menu: Escape dismisses and restores focus to trigger', await ev("!document.querySelector('sand-menu').open&&document.activeElement===document.querySelector('sand-menu .gm-menu-trigger')")===true);
  await ev("(()=>{document.querySelector('sand-menu').open=true;document.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));})()");
  check('menu: outside pointer press dismisses the option tray', await ev("!document.querySelector('sand-menu').open")===true);
}


{ // Phase 5 acceptance edges: dynamic updates, keyboard variants and lifecycle
  await ev("(()=>{const el=document.querySelector('sand-tabs');el.setAttribute('activation','automatic');el.setAttribute('orientation','vertical');el.value='settings';el.setAttribute('tabs','overview:Overview,activity:Activity');el.removeAttribute('disabled-tabs');})()");
  check('tabs: removing the selected tab selects the first remaining enabled tab', await ev("document.querySelector('sand-tabs').value==='overview'&&document.querySelectorAll('sand-tabs [role=tab]').length===2")===true);
  await ev("(()=>{const el=document.querySelector('sand-tabs');el.buttons[0].focus();el.buttons[0].dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true}));})()");
  check('tabs: vertical orientation uses ArrowDown and automatic activation', await ev("document.querySelector('sand-tabs').value==='activity'&&document.activeElement===document.querySelector('sand-tabs').buttons[1]")===true);
  await ev("(()=>{const el=document.querySelector('sand-tabs');el.setAttribute('tabs','overview:Overview,activity:Activity,settings:Settings');const parent=el.parentNode;parent.removeChild(el);parent.appendChild(el);})()");
  check('tabs: component reconnect preserves its selected value and controls', await ev("document.querySelector('sand-tabs').value==='activity'&&document.querySelector('sand-tabs').buttons.length===3")===true);

  await ev("(()=>{const el=document.querySelector('sand-accordion');el.removeAttribute('multiple');el.setAttribute('collapsible','');el.removeAttribute('disabled-items');el.setAttribute('items','shipping:Shipping,returns:Returns,care:Care');el.value='shipping';el.panels[0].innerHTML='<label>Tracking <input id=p5-persist value=GM-2048></label>';el.toggle('shipping');el.toggle('shipping');})()");
  check('accordion: collapsible mode allows the last open panel to close', await ev("(()=>{const el=document.querySelector('sand-accordion');el.toggle('shipping');return el.value===''})()")===true);
  await ev("document.querySelector('sand-accordion').toggle('shipping')");
  check('accordion: collapsing and reopening preserves panel DOM and input value', await ev("document.querySelector('sand-accordion').panels[0].querySelector('#p5-persist')?.value==='GM-2048'")===true);
  await ev("document.querySelector('sand-accordion').setAttribute('items','care:Care,faq:FAQ')");
  check('accordion: dynamic item changes rebuild the control and choose a valid initial item', await ev("document.querySelector('sand-accordion').buttons.length===2&&document.querySelector('sand-accordion').value==='care'")===true);
  await ev("(()=>{const el=document.querySelector('sand-accordion');const parent=el.parentNode;parent.removeChild(el);parent.appendChild(el);})()");
  check('accordion: component reconnect preserves its current state', await ev("document.querySelector('sand-accordion').buttons.length===2&&document.querySelector('sand-accordion').value==='care'")===true);

  await ev("(()=>{const el=document.querySelector('sand-pagination');el.removeAttribute('disabled');el.page=1;el.total=24;})()");
  check('pagination: first page disables first and previous navigation', await ev("(()=>{const el=document.querySelector('sand-pagination');return el.buttons[0].disabled&&el.buttons[1].disabled})()")===true);
  await ev("document.querySelector('sand-pagination').page=24");
  check('pagination: last page disables next and last navigation', await ev("(()=>{const el=document.querySelector('sand-pagination');return el.buttons.at(-1).disabled&&el.buttons.at(-2).disabled})()")===true);
  check('pagination: large page windows expose boundary buttons and ellipses', await ev("(()=>{const el=document.querySelector('sand-pagination');return el.buttons.some(b=>b.dataset.page==='1')&&el.buttons.some(b=>b.dataset.page==='24')&&!!el.querySelector('.gm-page-gap')})()")===true);
  await ev("(()=>{const el=document.querySelector('sand-pagination');el.buttons.find(b=>b.dataset.page==='24').focus();const parent=el.parentNode;parent.removeChild(el);parent.appendChild(el);})()");
  check('pagination: component reconnect preserves its current page', await ev("document.querySelector('sand-pagination').page===24")===true);

  await ev("(()=>{const el=document.querySelector('sand-breadcrumbs');el.setAttribute('separator','/');el.items=[{label:'Home',href:'/'},{label:'A very long location label that wraps safely on narrow screens',href:'/long'},{label:'Current location'}];})()");
  check('breadcrumbs: configured separators render between each ancestor and current item', await ev("Array.from(document.querySelectorAll('sand-breadcrumbs .gm-crumb-sep')).every(x=>x.textContent==='/')&&document.querySelectorAll('sand-breadcrumbs .gm-crumb-sep').length===2")===true);
  check('breadcrumbs: long labels remain inside the responsive document width', await ev("document.documentElement.scrollWidth<=390")===true);
  await ev("(()=>{const el=document.querySelector('sand-breadcrumbs');el.items=[{label:'Current only'}];})()");
  check('breadcrumbs: a single item is current and does not create an ancestor link', await ev("document.querySelector('sand-breadcrumbs').links.length===0&&document.querySelector('sand-breadcrumbs [aria-current=page]')?.textContent==='Current only'")===true);
  await ev("document.querySelector('sand-breadcrumbs').items=[]");
  check('breadcrumbs: an empty path retains its labelled navigation landmark', await ev("document.querySelector('sand-breadcrumbs nav')?.getAttribute('aria-label')==='You are here'&&!document.querySelector('sand-breadcrumbs [aria-current=page]')")===true);
  await ev("(()=>{const el=document.querySelector('sand-breadcrumbs');el.items=[{label:'Home',href:'/'},{label:'Current'}];el.links[0].focus();const parent=el.parentNode;parent.removeChild(el);parent.appendChild(el);el.links[0].focus();})()");
  const crumbFocus=await ev("(()=>{const el=document.querySelector('sand-breadcrumbs'),link=el.links[0];return JSON.stringify({focused:document.activeElement===link,active:document.activeElement?.outerHTML?.slice(0,160),href:link?.getAttribute('href'),tabIndex:link?.tabIndex,connected:link?.isConnected,linkCount:el.links.length})})()");
  check('breadcrumbs: ancestor links remain keyboard focusable after reconnect', await ev("document.activeElement===document.querySelector('sand-breadcrumbs').links[0]")===true,crumbFocus);

  await ev("(()=>{const el=document.querySelector('sand-menu');el.open=true;el.menuItems[0].focus();el.menuItems[0].dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true}));})()");
  check('menu: ArrowDown moves focus to the next enabled menu item', await ev("document.activeElement===document.querySelector('sand-menu').menuItems[1]")===true);
  await ev("document.activeElement.dispatchEvent(new KeyboardEvent('keydown',{key:'End',bubbles:true}))");
  check('menu: End moves focus to the last enabled menu item', await ev("document.activeElement===document.querySelector('sand-menu').menuItems.at(-1)")===true);
  await ev("document.activeElement.dispatchEvent(new KeyboardEvent('keydown',{key:'Home',bubbles:true}))");
  check('menu: Home returns focus to the first enabled menu item', await ev("document.activeElement===document.querySelector('sand-menu').menuItems[0]")===true);
  check('menu: open tray remains within the mobile viewport', await ev("(()=>{const r=document.querySelector('sand-menu .gm-menu-popup').getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight})()")===true);
  await ev("(()=>{const el=document.querySelector('sand-menu');const parent=el.parentNode;parent.removeChild(el);parent.appendChild(el);})()");
  check('menu: disconnect closes the overlay and releases transient state', await ev("!document.querySelector('sand-menu').open&&document.querySelector('sand-menu .gm-menu-popup').hidden")===true);
}


{ // Phase 6: files, image media, media timeline and mineral color
  await ev(`(()=>{const el=document.querySelector('sand-dropzone');el.setAttribute('accept','image/png,.pdf');el.setAttribute('multiple','');el.setAttribute('max-size','10');window.__p6Drop={accepted:0,rejected:0};el.addEventListener('files-change',e=>window.__p6Drop.accepted=e.detail.files.length);el.addEventListener('file-reject',e=>window.__p6Drop.rejected=e.detail.rejected.length);el.addFiles([new File(['x'],'cover.png',{type:'image/png'}),new File(['x'],'notes.jpg',{type:'image/jpeg'}),new File(['01234567890'],'large.png',{type:'image/png'})]);})()`);
  check('dropzone: accepts matching MIME types', await ev("document.querySelector('sand-dropzone').files.length===1&&document.querySelector('sand-dropzone').files[0].name==='cover.png'")===true);
  check('dropzone: rejects unsupported type and oversize file with reasons', await ev("window.__p6Drop.rejected===2")===true);
  check('dropzone: files-change and file-reject events reach the host', await ev("window.__p6Drop.accepted===1&&window.__p6Drop.rejected===2")===true);
  await ev("document.querySelector('sand-dropzone').clear()");
  check('dropzone: clear removes all selected files', await ev("document.querySelector('sand-dropzone').files.length===0")===true);
  await ev("(()=>{const el=document.querySelector('sand-dropzone');el.addFiles([new File(['x'],'again.png',{type:'image/png'})]);el.setAttribute('disabled','');})()");
  check('dropzone: disabled prevents picker and clears native input availability', await ev("document.querySelector('sand-dropzone').input.disabled&&document.querySelector('sand-dropzone').pick.disabled")===true);
  await ev("(()=>{const el=document.querySelector('sand-dropzone');el.removeAttribute('disabled');const p=el.parentNode;p.removeChild(el);p.appendChild(el);})()");
  check('dropzone: selection API remains available after reconnect', await ev("document.querySelector('sand-dropzone').files.length===1")===true);

  await ev(`(()=>{const el=document.querySelector('sand-upload-queue');window.__p6Queue={requests:0,cancels:0,retries:0};el.addEventListener('upload-request',()=>window.__p6Queue.requests++);el.addEventListener('upload-cancel',()=>window.__p6Queue.cancels++);el.addEventListener('retry-request',()=>window.__p6Queue.retries++);window.__p6QueueId=el.addFiles([new File(['archive'],'project.zip',{type:'application/zip'})])[0];el.update(window.__p6QueueId,{status:'uploading',progress:43});})()`);
  check('upload queue: addFiles creates an item and emits upload-request', await ev("document.querySelector('sand-upload-queue').items.length===1&&window.__p6Queue.requests===1")===true);
  check('upload queue: host-supplied progress updates the queue item', await ev("document.querySelector('sand-upload-queue').items[0].progress===43&&document.querySelector('sand-upload-queue').items[0].status==='uploading'")===true);
  await ev("document.querySelector('sand-upload-queue').list.querySelector('[data-action=cancel]').click()");
  check('upload queue: cancel button emits upload-cancel and changes status', await ev("window.__p6Queue.cancels===1&&document.querySelector('sand-upload-queue').items[0].status==='cancelled'")===true);
  await ev("document.querySelector('sand-upload-queue').list.querySelector('[data-action=retry]').click()");
  check('upload queue: retry emits retry-request and returns item to queued', await ev("window.__p6Queue.retries===1&&document.querySelector('sand-upload-queue').items[0].status==='queued'")===true);
  await ev("document.querySelector('sand-upload-queue').clear()");
  check('upload queue: clear removes queue items', await ev("document.querySelector('sand-upload-queue').items.length===0")===true);

  await ev(`(()=>{const el=document.querySelector('sand-carousel');el.items=[{src:'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',alt:'First plate',caption:'First'},{src:'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',alt:'Second plate',caption:'Second'},{src:'javascript:alert(1)',alt:'Unsafe'}];})()`);
  check('carousel: accepts safe image sources and filters unsafe schemes', await ev("document.querySelector('sand-carousel').items.length===2")===true);
  check('carousel: real image alt text and caption follow the selected item', await ev("document.querySelector('sand-carousel img').alt==='First plate'&&document.querySelector('sand-carousel .gm-car-caption').textContent==='First'")===true);
  await ev("document.querySelector('sand-carousel').go(1)");
  check('carousel: next selection updates index and emits change', await ev("document.querySelector('sand-carousel').index===1&&document.querySelector('sand-carousel img').alt==='Second plate'")===true);
  await ev("(()=>{const el=document.querySelector('sand-carousel');el.ui.querySelector('.gm-car-arrow[aria-label=\"Next image\"]').focus();el.ui.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));})()");
  check('carousel: keyboard arrow navigation wraps to the first image', await ev("document.querySelector('sand-carousel').index===0")===true);

  await ev(`(()=>{const el=document.querySelector('sand-lightbox');el.items=[{src:'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',alt:'One',caption:'First'},{src:'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',alt:'Two',caption:'Second'}];})()`);
  check('lightbox: renders thumbnails with accessible labels', await ev("document.querySelectorAll('sand-lightbox .gm-light-thumb').length===2&&document.querySelector('sand-lightbox .gm-light-thumb').getAttribute('aria-label')==='View One'")===true);
  await ev("(()=>{const el=document.querySelector('sand-lightbox'),opener=el.grid.querySelector('button');opener.focus();el.openAt(0,opener);})()");
  check('lightbox: opens a native modal dialog and focuses its close control', await ev("document.querySelector('sand-lightbox dialog').open&&document.activeElement===document.querySelector('sand-lightbox .gm-light-close')")===true);
  await ev("document.querySelector('sand-lightbox').move(1)");
  check('lightbox: previous/next navigation changes the displayed image', await ev("document.querySelector('sand-lightbox').index===1&&document.querySelector('sand-lightbox .gm-light-large').alt==='Two'")===true);
  await ev("document.querySelector('sand-lightbox').close()");
  await sleep(100);
  check('lightbox: close restores focus to the image opener', await ev("!document.querySelector('sand-lightbox dialog').open&&document.activeElement===document.querySelector('sand-lightbox .gm-light-thumb')")===true);

  await ev(`(()=>{const el=document.querySelector('sand-scrubber');const media=document.createElement('video');Object.defineProperties(media,{duration:{configurable:true,value:100},currentTime:{configurable:true,writable:true,value:12},paused:{configurable:true,writable:true,value:true},buffered:{configurable:true,value:{length:1,end:()=>60}}});media.play=async()=>{Object.defineProperty(media,'paused',{configurable:true,writable:true,value:false});media.dispatchEvent(new Event('play'));};media.pause=()=>{Object.defineProperty(media,'paused',{configurable:true,writable:true,value:true});media.dispatchEvent(new Event('pause'));};document.body.append(media);el.media=media;window.__p6Media=media;window.__p6Seek=0;el.addEventListener('seek',()=>window.__p6Seek++);})()`);
  check('scrubber: binds to HTML media duration and current time', await ev("document.querySelector('sand-scrubber input[type=range]').max==='100'&&document.querySelector('sand-scrubber input[type=range]').value==='12'")===true);
  check('scrubber: buffered media is represented as a separate ridge', await ev("document.querySelector('sand-scrubber .gm-scrub-buffer').style.width==='60%'")===true);
  await ev("(()=>{const el=document.querySelector('sand-scrubber');el.range.value='25';el.range.dispatchEvent(new Event('input',{bubbles:true}));})()");
  check('scrubber: seeking updates media currentTime and emits seek', await ev("window.__p6Media.currentTime===25&&window.__p6Seek===1")===true);
  await ev("document.querySelector('sand-scrubber').playButton.click()");
  check('scrubber: play button delegates to the media element', await ev("window.__p6Media.paused===false&&document.querySelector('sand-scrubber .gm-scrub-play').getAttribute('aria-label')==='Pause media'")===true);
  await ev("(()=>{const el=document.querySelector('sand-scrubber'),p=el.parentNode;p.removeChild(el);p.appendChild(el);window.__p6Media.dispatchEvent(new Event('timeupdate'));})()");
  check('scrubber: media event binding survives component reconnect', await ev("document.querySelector('sand-scrubber').range.value==='25'")===true);

  await ev("(()=>{const el=document.querySelector('sand-color-picker');window.__p6Color={input:0,change:0};el.addEventListener('input',()=>window.__p6Color.input++);el.addEventListener('change',()=>window.__p6Color.change++);el.value='#ff8800';})()");
  check('color picker: accepts and normalizes hexadecimal value', await ev("document.querySelector('sand-color-picker').value==='#ff8800'&&document.querySelector('sand-color-picker input[type=color]').value==='#ff8800'")===true);
  await ev("document.querySelector('sand-color-picker').setAttribute('format','rgb')");
  check('color picker: RGB format is reflected in its value and readout', await ev("document.querySelector('sand-color-picker').value==='rgb(255, 136, 0)'&&document.querySelector('sand-color-picker output').textContent==='rgb(255, 136, 0)'")===true);
  await ev("document.querySelector('sand-color-picker').palette.querySelector('[data-color=\"#b85c3c\"]').click()");
  check('color picker: mineral swatch changes color and emits input/change', await ev("document.querySelector('sand-color-picker').value==='rgb(184, 92, 60)'&&window.__p6Color.input===1&&window.__p6Color.change===1")===true);
  await ev("document.querySelector('sand-color-picker').setAttribute('disabled','')");
  check('color picker: disabled state reaches native and preset controls', await ev("document.querySelector('sand-color-picker').input.disabled&&Array.from(document.querySelector('sand-color-picker').palette.querySelectorAll('button')).every(b=>b.disabled)")===true);
}


{ // Phase 7: advanced ordering, transfer, pane sizing and nested hierarchy
  await ev("(()=>{const el=document.querySelector('sand-sortable');el.items=[{id:'a',label:'First'},{id:'b',label:'Second'},{id:'c',label:'Third'}];window.__p7={reorder:0,transfer:0,split:0,resize:0,select:0,expand:0};el.addEventListener('reorder',()=>window.__p7.reorder++);})()");
  check('sortable: renders each stable item as a list row', await ev("document.querySelector('sand-sortable').list.querySelectorAll('[role=listitem]').length===3")===true);
  await ev("document.querySelector('sand-sortable').move(2,0)");
  check('sortable: move updates stable ID order', await ev("document.querySelector('sand-sortable').value.join(',')==='c,a,b'")===true);
  check('sortable: reorder event exposes new order', await ev("window.__p7.reorder===1")===true);
  await ev("(()=>{const el=document.querySelector('sand-sortable');el.list.querySelector('[data-id=a] [data-action=handle]').dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true}));})()");
  check('sortable: keyboard ArrowDown reorders a row', await ev("document.querySelector('sand-sortable').value.join(',')==='c,b,a'")===true);
  await ev("document.querySelector('sand-sortable').setAttribute('disabled','')");
  check('sortable: disabled blocks API reorder and disables controls', await ev("(()=>{const el=document.querySelector('sand-sortable');return el.move(0,2)===false&&Array.from(el.list.querySelectorAll('button')).every(b=>b.disabled)})()")===true);
  await ev("document.querySelector('sand-sortable').removeAttribute('disabled')");

  await ev("(()=>{const el=document.querySelector('sand-transfer-list');el.items=[{id:'one',label:'One',side:'left'},{id:'two',label:'Two',side:'left'},{id:'three',label:'Three',side:'right'}];el.addEventListener('transfer',()=>window.__p7.transfer++);el.select(['one','two']);})()");
  check('transfer: multi-selection is represented in state', await ev("document.querySelector('sand-transfer-list').selected.length===2")===true);
  await ev("document.querySelector('sand-transfer-list').moveSelected('right')");
  check('transfer: selected items move into other tray', await ev("document.querySelector('sand-transfer-list').items.filter(x=>x.side==='right').length===3")===true);
  check('transfer: transfer event reaches the host', await ev("window.__p7.transfer===1")===true);
  await ev("document.querySelector('sand-transfer-list').moveAll('left')");
  check('transfer: moveAll returns enabled items', await ev("document.querySelector('sand-transfer-list').items.every(x=>x.side==='left')")===true);
  await ev("document.querySelector('sand-transfer-list').setAttribute('disabled','')");
  check('transfer: disabled state disables selection and actions', await ev("document.querySelector('sand-transfer-list').toRight.disabled&&document.querySelector('sand-transfer-list').leftList.querySelector('button').disabled")===true);
  await ev("document.querySelector('sand-transfer-list').removeAttribute('disabled')");

  await ev("(()=>{const el=document.querySelector('sand-split-pane');el.value=65;el.addEventListener('input',()=>window.__p7.split++);})()");
  check('split pane: value sets first pane percentage', await ev("Math.round(document.querySelector('sand-split-pane').value)===65")===true);
  check('split pane: separator exposes role, orientation and value', await ev("(()=>{const b=document.querySelector('sand-split-pane .gm-split-divider');return b.getAttribute('role')==='separator'&&b.getAttribute('aria-valuenow')==='65'&&b.getAttribute('aria-orientation')==='vertical'})()")===true);
  await ev("(()=>{const el=document.querySelector('sand-split-pane');el.divider.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));})()");
  check('split pane: keyboard separator adjusts size and emits input', await ev("document.querySelector('sand-split-pane').value===67&&window.__p7.split===1")===true);
  await ev("document.querySelector('sand-split-pane').setAttribute('axis','vertical')");
  check('split pane: vertical axis changes separator orientation', await ev("document.querySelector('sand-split-pane .gm-split-divider').getAttribute('aria-orientation')==='horizontal'")===true);
  await ev("document.querySelector('sand-split-pane').value=97");
  check('split pane: value respects maximum', await ev("document.querySelector('sand-split-pane').value===80")===true);

  await ev("(()=>{const el=document.querySelector('sand-resizable');el.panels=[{id:'a',label:'A',content:'Panel A',min:20,max:60},{id:'b',label:'B',content:'Panel B',min:20,max:60},{id:'c',label:'C',content:'Panel C',min:20,max:60}];el.addEventListener('change',()=>window.__p7.resize++);})()");
  check('resizable: renders panels and separators', await ev("document.querySelector('sand-resizable').ui.querySelectorAll('.gm-res-panel').length===3&&document.querySelector('sand-resizable').ui.querySelectorAll('[role=separator]').length===2")===true);
  await ev("document.querySelector('sand-resizable').resizeBoundary(0,8,true)");
  check('resizable: adjacent resize preserves 100 percent total', await ev("Math.abs(document.querySelector('sand-resizable').sizes.reduce((a,b)=>a+b,0)-100)<0.01")===true);
  check('resizable: boundary adjustment emits change', await ev("window.__p7.resize===1")===true);
  await ev("(()=>{const el=document.querySelector('sand-resizable');el.ui.querySelector('[role=separator]').dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));})()");
  check('resizable: keyboard arrows adjust a boundary', await ev("window.__p7.resize===2")===true);
  await ev("document.querySelector('sand-resizable').setAttribute('disabled','')");
  check('resizable: disabled state disables every separator', await ev("Array.from(document.querySelector('sand-resizable').ui.querySelectorAll('[role=separator]')).every(b=>b.disabled)")===true);
  await ev("document.querySelector('sand-resizable').removeAttribute('disabled')");

  await ev("(()=>{const el=document.querySelector('sand-tree');el.items=[{id:'root',label:'Root',children:[{id:'branch',label:'Branch',children:[{id:'leaf',label:'Leaf'}]},{id:'other',label:'Other'}]},{id:'loose',label:'Loose'}];el.expanded=['root','branch'];el.addEventListener('select',()=>window.__p7.select++);el.addEventListener('expand',()=>window.__p7.expand++);})()");
  check('tree: new hierarchy assigns one valid keyboard entry point', await ev("(()=>{const el=document.querySelector('sand-tree');return el.value==='root'&&el.nodeButtons.filter(b=>b.tabIndex===0).length===1})()")===true);
  check('tree: nested nodes expose treeitem levels', await ev("document.querySelector('sand-tree').nodeButtons.find(b=>b.dataset.nodeId==='leaf')?.getAttribute('aria-level')==='3'")===true);
  await ev("document.querySelector('sand-tree').select('leaf',true)");
  check('tree: selected node is reflected and announced', await ev("document.querySelector('sand-tree').value==='leaf'&&window.__p7.select===1")===true);
  await ev("document.querySelector('sand-tree').toggle('branch',true)");
  const treeAfterCollapse=await ev("JSON.stringify({visible:document.querySelector('sand-tree').visibleNodes().map(x=>x.item.id),expanded:document.querySelector('sand-tree').expanded,events:window.__p7.expand})");
  check('tree: collapse hides descendants and emits expand state', await ev("(()=>{const el=document.querySelector('sand-tree');return !el.visibleNodes().some(x=>x.item.id==='leaf')&&!el.expanded.includes('branch')&&window.__p7.expand===1})()")===true, treeAfterCollapse);
  await ev("document.querySelector('sand-tree').toggle('branch',true)");
  check('tree: branch expands again without losing data', await ev("document.querySelector('sand-tree').visibleNodes().some(x=>x.item.id==='leaf')===true")===true);
  await ev("(()=>{const el=document.querySelector('sand-tree'),b=el.nodeButtons.find(x=>x.dataset.nodeId==='root');b.focus();b.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true}));})()");
  check('tree: ArrowDown follows visible hierarchy order', await ev("document.activeElement?.dataset.nodeId==='branch'")===true);
  await ev("document.querySelector('sand-tree').setAttribute('disabled','')");
  check('tree: disabled state disables every tree item', await ev("Array.from(document.querySelector('sand-tree').nodeButtons).every(b=>b.disabled)")===true);
  await ev("document.querySelector('sand-tree').removeAttribute('disabled')");
}


{ // Phase 8: focus hints, live feedback and native modal surfaces
  await ev("(()=>{const t=document.querySelector('sand-tooltip'),b=document.getElementById('gm-tooltip-trigger');window.__p8={tipId:t._id,toastAction:0,toastDismiss:0,alertAction:0,alertDismiss:0,dialogOpen:0,dialogClose:[],dialogConfirm:0,drawerOpen:0,drawerClose:[],drawerConfirm:0};return {described:b.getAttribute('aria-describedby'),tip:t._id,role:t._bubble.getAttribute('role')}})()");
  check('tooltip: trigger is associated with a role=tooltip message', await ev("(()=>{const t=document.querySelector('sand-tooltip'),b=document.getElementById('gm-tooltip-trigger');return t._target===b&&t._bubble.getAttribute('role')==='tooltip'&&b.getAttribute('aria-describedby').split(/\\s+/).includes(t._id)})()")===true);
  await ev("(()=>{const t=document.querySelector('sand-tooltip'),b=document.getElementById('gm-tooltip-trigger');b.focus();})()");
  await new Promise(r=>setTimeout(r,320));
  check('tooltip: keyboard focus opens the hint without moving focus', await ev("(()=>{const t=document.querySelector('sand-tooltip');return t.open&&!t._bubble.hidden&&document.activeElement===document.getElementById('gm-tooltip-trigger')})()")===true);
  await ev("document.getElementById('gm-tooltip-trigger').dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}))");
  check('tooltip: Escape dismisses and leaves trigger focus unchanged', await ev("!document.querySelector('sand-tooltip').open&&document.activeElement===document.getElementById('gm-tooltip-trigger')")===true);
  await ev("(()=>{const t=document.querySelector('sand-tooltip');t.setAttribute('disabled','');t.scheduleShow();})()");
  check('tooltip: disabled state prevents programmatic display', await ev("document.querySelector('sand-tooltip').show()===false&&!document.querySelector('sand-tooltip').open")===true);
  await ev("(()=>{const t=document.querySelector('sand-tooltip'),b=document.getElementById('gm-tooltip-trigger');b.setAttribute('aria-describedby','existing-help');t.remove();return b.getAttribute('aria-describedby')==='existing-help'})()");
  check('tooltip: disconnect restores the trigger’s existing description IDs', await ev("document.getElementById('gm-tooltip-trigger').getAttribute('aria-describedby')==='existing-help'")===true);
  await ev("(()=>{const c=document.querySelector('[data-c=tooltip]');const t=document.createElement('sand-tooltip');t.id='el-tooltip-restored';t.setAttribute('for','gm-tooltip-trigger');t.setAttribute('text','Restored hint');c.append(t);})()");
  await ev("(()=>{const t=document.querySelector('sand-tooltip'),b=document.getElementById('gm-tooltip-trigger');b.style.cssText='position:fixed;top:0;left:140px;width:120px;height:32px';t.setAttribute('placement','top');t.show();})()");
  check('tooltip: preferred placement flips when the viewport edge has no room', await ev("document.querySelector('sand-tooltip')._bubble.dataset.placement==='bottom'")===true);
  await ev("(()=>{const t=document.querySelector('sand-tooltip');t.hide();document.getElementById('gm-tooltip-trigger').style.cssText='';})()");

  await ev("(()=>{const t=document.querySelector('sand-toast');t.addEventListener('action',()=>window.__p8.toastAction++);t.addEventListener('dismiss',e=>{window.__p8.toastDismiss++;window.__p8.toastReason=e.detail.reason;});t.show();})()");
  check('toast: info and success announce as polite status', await ev("(()=>{const t=document.querySelector('sand-toast');return t.ui.getAttribute('role')==='status'&&t.ui.getAttribute('aria-live')==='polite'&&t.open})()")===true);
  await ev("document.querySelector('sand-toast').setAttribute('tone','error')");
  check('toast: warning and error switch to assertive alert semantics', await ev("(()=>{const t=document.querySelector('sand-toast');return t.ui.getAttribute('role')==='alert'&&t.ui.getAttribute('aria-live')==='assertive'})()")===true);
  await ev("document.querySelector('sand-toast').actionButton.click()");
  check('toast: action event fires before action dismissal', await ev("window.__p8.toastAction===1&&window.__p8.toastDismiss===1&&window.__p8.toastReason==='action'&&!document.querySelector('sand-toast').open")===true);
  await ev("(()=>{const a=document.querySelector('sand-toast'),b=document.createElement('sand-toast');a.setAttribute('duration','5000');b.setAttribute('duration','5000');b.setAttribute('position','top-right');document.body.append(b);a.setAttribute('tone','success');a.show();b.show();window.__p8.extraToast=b;})()");
  check('toast: independent notifications stack at separate offsets', await ev("Math.abs(parseFloat(window.__p8.extraToast.style.top)-parseFloat(document.querySelector('sand-toast').style.top))>=90")===true);
  await ev("window.__p8.extraToast.setAttribute('position','bottom-left')");
  check('toast: an open notification can move to another corner', await ev("window.__p8.extraToast.style.left==='12px'&&window.__p8.extraToast.style.bottom==='18px'")===true);
  await ev("(()=>{const t=document.querySelector('sand-toast');t.ui.dispatchEvent(new Event('pointerenter'));})()");
  check('toast: auto-dismiss timer pauses on hover', await ev("(()=>{const t=document.querySelector('sand-toast');return t._timer===0&&t._remaining>0})()")===true);
  await ev("(()=>{document.querySelector('sand-toast').dismiss('test');window.__p8.extraToast.dismiss('test');window.__p8.extraToast.remove();})()");

  await ev("(()=>{const a=document.querySelector('sand-alert');a.addEventListener('action',()=>window.__p8.alertAction++);a.addEventListener('dismiss',()=>window.__p8.alertDismiss++);a.setAttribute('tone','info');})()");
  check('alert: info uses a polite status region', await ev("(()=>{const a=document.querySelector('sand-alert');return a.ui.getAttribute('role')==='status'&&a.ui.getAttribute('aria-live')==='polite'})()")===true);
  await ev("document.querySelector('sand-alert').setAttribute('tone','error')");
  check('alert: error uses an assertive alert region', await ev("(()=>{const a=document.querySelector('sand-alert');return a.ui.getAttribute('role')==='alert'&&a.ui.getAttribute('aria-live')==='assertive'})()")===true);
  await ev("document.querySelector('sand-alert').actionButton.click()");
  await ev("document.querySelector('sand-alert').closeButton.click()");
  check('alert: optional action and dismiss emit separate host events', await ev("window.__p8.alertAction===1&&window.__p8.alertDismiss===1&&document.querySelector('sand-alert').dismissed&&document.querySelector('sand-alert').ui.closest('sand-alert').style.display==='none'")===true);
  await ev("document.querySelector('sand-alert').show()");
  check('alert: show restores a dismissed persistent banner', await ev("!document.querySelector('sand-alert').dismissed&&document.querySelector('sand-alert').style.display!=='none'")===true);

  await ev("(()=>{const d=document.querySelector('sand-dialog');d.addEventListener('dialog-open',()=>window.__p8.dialogOpen++);d.addEventListener('dialog-close',e=>window.__p8.dialogClose.push(e.detail.returnValue));d.addEventListener('confirm',()=>window.__p8.dialogConfirm++);document.getElementById('open-dialog').focus();d.showModal();})()");
  check('dialog: enters the native modal top layer with preserved content', await ev("(()=>{const d=document.querySelector('sand-dialog');return d.dialog.open&&d.dialog.matches(':modal')&&d.body.textContent.includes('Check your title')&&window.__p8.dialogOpen===1})()")===true);
  check('dialog: modal initial focus remains within native dialog', await ev("document.querySelector('sand-dialog').dialog.contains(document.activeElement)")===true);
  await ev("document.querySelector('sand-dialog').confirmButton.click()");
  check('dialog: confirm emits action, closes and restores opener focus', await ev("(()=>{const d=document.querySelector('sand-dialog');return window.__p8.dialogConfirm===1&&window.__p8.dialogClose.at(-1)==='confirm'&&!d.dialog.open&&document.activeElement===document.getElementById('open-dialog')})()")===true);
  await ev("document.querySelector('sand-dialog').showModal()");
  await ev("document.querySelector('sand-dialog').dialog.dispatchEvent(new Event('cancel',{bubbles:true,cancelable:true}))");
  check('dialog: Escape cancel follows the default close policy', await ev("(()=>{const d=document.querySelector('sand-dialog');return !d.dialog.open&&window.__p8.dialogClose.at(-1)==='escape'})()")===true);
  await ev("(()=>{const d=document.querySelector('sand-dialog');d.setAttribute('close-on-backdrop','');d.showModal();d.dialog.dispatchEvent(new MouseEvent('click',{bubbles:true}));})()");
  check('dialog: optional backdrop click closes the native modal', await ev("!document.querySelector('sand-dialog').dialog.open&&window.__p8.dialogClose.at(-1)==='backdrop'")===true);

  await ev("(()=>{const d=document.querySelector('sand-drawer');d.addEventListener('drawer-open',()=>window.__p8.drawerOpen++);d.addEventListener('drawer-close',e=>window.__p8.drawerClose.push(e.detail.returnValue));d.addEventListener('confirm',()=>window.__p8.drawerConfirm++);document.getElementById('open-drawer').focus();d.showModal();})()");
  check('drawer: opens as a native modal sheet at the chosen edge', await ev("(()=>{const d=document.querySelector('sand-drawer');return d.dialog.open&&d.dialog.matches(':modal')&&d.panel.dataset.place==='right'&&window.__p8.drawerOpen===1})()")===true);
  await ev("(()=>{const d=document.querySelector('sand-drawer');d.setAttribute('placement','bottom');d.setAttribute('size','250px');})()");
  check('drawer: placement and size update panel geometry', await ev("(()=>{const d=document.querySelector('sand-drawer');return d.panel.dataset.place==='bottom'&&d.panel.style.getPropertyValue('--gm-drawer-size')==='250px'})()")===true);
  await ev("document.querySelector('sand-drawer').dialog.dispatchEvent(new Event('cancel',{bubbles:true,cancelable:true}))");
  check('drawer: Escape closes and reports return focus', await ev("(()=>{const d=document.querySelector('sand-drawer');return !d.dialog.open&&window.__p8.drawerClose.at(-1)==='escape'&&document.activeElement===document.getElementById('open-drawer')})()")===true);
  await ev("(()=>{const d=document.querySelector('sand-drawer');d.setAttribute('placement','right');d.setAttribute('action-label','Apply');d.showModal();d.actionButton.click();})()");
  check('drawer: primary action fires confirm then closes', await ev("(()=>{const d=document.querySelector('sand-drawer');return window.__p8.drawerConfirm===1&&window.__p8.drawerClose.at(-1)==='confirm'&&!d.dialog.open})()")===true);
  await ev("(()=>{const d=document.querySelector('sand-drawer');d.setAttribute('close-on-backdrop','');d.showModal();d.dialog.dispatchEvent(new MouseEvent('click',{bubbles:true}));})()");
  check('drawer: opt-in backdrop dismissal closes the sheet', await ev("!document.querySelector('sand-drawer').dialog.open&&window.__p8.drawerClose.at(-1)==='backdrop'")===true);
}

{ // Phase 9: command search, contextual actions, query composition, tabular data and Kanban moves
  await ev("(()=>{const e=document.querySelector('sand-command');e.commands=[{id:'alpha',label:'Alpha action',description:'First command'},{id:'beta',label:'Beta action',description:'Second command',keywords:'search match'},{id:'gamma',label:'Gamma action',description:'Third command'}];window.__p9={command:[],commandClose:[],menu:[],menuClose:[],filter:0,apply:0,tableSelect:0,tableSort:0,kanban:[]};e.addEventListener('command',x=>window.__p9.command.push(x.detail.id));e.addEventListener('command-close',x=>window.__p9.commandClose.push(x.detail.reason));})()");
  await ev("document.querySelector('sand-command').show()");
  check('command: opens a native modal and focuses the search field', await ev("(()=>{const e=document.querySelector('sand-command');return e.dialog.open&&e.dialog.matches(':modal')&&document.activeElement===e.search})()")===true);
  await ev("(()=>{const e=document.querySelector('sand-command');e.search.value='search';e.search.dispatchEvent(new Event('input',{bubbles:true}));})()");
  check('command: filters label, description and keyword matches', await ev("(()=>{const e=document.querySelector('sand-command');return e.filtered().length===1&&e.filtered()[0].id==='beta'&&e.results.querySelectorAll('[role=option]').length===1})()")===true);
  await ev("(()=>{const e=document.querySelector('sand-command');e.search.value='';e.search.dispatchEvent(new Event('input',{bubbles:true}));e.search.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true,cancelable:true}));})()");
  check('command: ArrowDown moves the active result and reflects value', await ev("(()=>{const e=document.querySelector('sand-command');return e._active===1&&e.value==='beta'})()")===true);
  await ev("document.querySelector('sand-command').search.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}))");
  check('command: Enter emits the selected command and closes the modal', await ev("(()=>{const e=document.querySelector('sand-command');return window.__p9.command.join(',')==='beta'&&!e.dialog.open&&window.__p9.commandClose.at(-1)==='select'})()")===true);
  await ev("document.querySelector('sand-command').show();document.querySelector('sand-command').search.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}))");
  check('command: Escape closes and restores the opener', await ev("(()=>{const e=document.querySelector('sand-command');return !e.dialog.open&&window.__p9.commandClose.at(-1)==='escape'})()")===true);
  await ev("document.querySelector('sand-command').setAttribute('disabled','')");
  check('command: disabled prevents opening and disables the trigger', await ev("(()=>{const e=document.querySelector('sand-command');return !e.show()&&e.trigger.disabled})()")===true);
  await ev("document.querySelector('sand-command').removeAttribute('disabled')");

  await ev("(()=>{const e=document.querySelector('sand-context-menu');e.items=[{id:'open',label:'Open'},{id:'rename',label:'Rename'},{id:'archive',label:'Archive',disabled:true}];e.addEventListener('select',x=>window.__p9.menu.push(x.detail.id));e.addEventListener('menu-close',x=>window.__p9.menuClose.push(x.detail.reason));})()");
  await ev("document.querySelector('sand-context-menu').showAt(35,45)");
  check('context menu: opens with a named menu and focuses the first enabled item', await ev("(()=>{const e=document.querySelector('sand-context-menu');return e.open&&!e.menu.hidden&&e.menu.getAttribute('role')==='menu'&&e.menu.querySelector('[role=menuitem]').matches(':focus')})()")===true);
  await ev("document.querySelector('sand-context-menu').menu.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true,cancelable:true}))");
  check('context menu: arrow navigation skips disabled actions', await ev("document.activeElement?.dataset.id==='rename'")===true);
  await ev("document.querySelector('sand-context-menu').menu.querySelector('[data-id=rename]').click()");
  check('context menu: selection emits the action ID and closes', await ev("(()=>{const e=document.querySelector('sand-context-menu');return window.__p9.menu.join(',')==='rename'&&!e.open&&window.__p9.menuClose.at(-1)==='select'})()")===true);
  await ev("document.querySelector('sand-context-menu').showAt(30,30);document.querySelector('sand-context-menu').menu.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}))");
  check('context menu: Escape closes without leaving global listeners', await ev("(()=>{const e=document.querySelector('sand-context-menu');return !e.open&&e._outside===null&&window.__p9.menuClose.at(-1)==='escape'})()")===true);
  await ev("document.querySelector('sand-context-menu').setAttribute('disabled','')");
  check('context menu: disabled blocks programmatic opening', await ev("document.querySelector('sand-context-menu').showAt(10,10)===false")===true);
  await ev("document.querySelector('sand-context-menu').removeAttribute('disabled')");
  await ev("(()=>{const e=document.querySelector('sand-context-menu'),target=e.targetButton;target.dispatchEvent(new PointerEvent('pointerdown',{pointerType:'touch',clientX:20,clientY:20,bubbles:true}));})()");
  await new Promise(r=>setTimeout(r,25));
  await ev("(()=>{const e=document.querySelector('sand-context-menu');e.targetButton.dispatchEvent(new PointerEvent('pointermove',{pointerType:'touch',clientX:45,clientY:20,bubbles:true}));e.targetButton.dispatchEvent(new PointerEvent('pointerup',{pointerType:'touch',clientX:45,clientY:20,bubbles:true}));})()");
  await new Promise(r=>setTimeout(r,590));
  check('context menu: touch movement cancels a pending long-press', await ev("!document.querySelector('sand-context-menu').open")===true);
  await ev("(()=>{const e=document.querySelector('sand-context-menu');e.targetButton.dispatchEvent(new PointerEvent('pointerdown',{pointerType:'touch',clientX:24,clientY:32,bubbles:true}));})()");
  await new Promise(r=>setTimeout(r,590));
  check('context menu: touch long-press opens the menu at the press point', await ev("document.querySelector('sand-context-menu').open")===true);
  await ev("(()=>{const e=document.querySelector('sand-context-menu');e.targetButton.dispatchEvent(new PointerEvent('pointerup',{pointerType:'touch',clientX:24,clientY:32,bubbles:true}));e.close('test');})()");


  await ev("(()=>{const e=document.querySelector('sand-filter-builder');e.fields=[{id:'status',label:'Status',type:'select',options:['Open','Done']},{id:'owner',label:'Owner',type:'text'}];e.filters=[{id:'f1',field:'status',operator:'is',value:'Open'}];e.logic='OR';e.addEventListener('change',()=>window.__p9.filter++);e.addEventListener('apply',()=>window.__p9.apply++);})()");
  check('filter builder: exposes editable field, operator and value conditions', await ev("(()=>{const e=document.querySelector('sand-filter-builder');return e.rows.querySelectorAll('.gm-filter-row').length===1&&e.toQuery().logic==='OR'&&e.toQuery().conditions[0].value==='Open'})()")===true);
  await ev("(()=>{const e=document.querySelector('sand-filter-builder'),v=e.rows.querySelector('[data-role=value]');v.value='Done';v.dispatchEvent(new Event('change',{bubbles:true}));})()");
  check('filter builder: editing a condition emits change with updated query', await ev("(()=>{const e=document.querySelector('sand-filter-builder');return e.filters[0].value==='Done'&&window.__p9.filter>0})()")===true);
  await ev("document.querySelector('sand-filter-builder').add('owner')");
  check('filter builder: add creates an additional condition row', await ev("document.querySelector('sand-filter-builder').filters.length===2")===true);
  await ev("document.querySelector('sand-filter-builder').apply()");
  check('filter builder: apply emits a query for the host', await ev("window.__p9.apply===1")===true);
  await ev("document.querySelector('sand-filter-builder').remove(0)");
  check('filter builder: remove updates the filter state', await ev("document.querySelector('sand-filter-builder').filters.length===1")===true);
  await ev("document.querySelector('sand-filter-builder').clear()");
  check('filter builder: clear emits reset and empties the query', await ev("(()=>{const e=document.querySelector('sand-filter-builder');return e.filters.length===0&&e.toQuery().conditions.length===0})()")===true);
  await ev("document.querySelector('sand-filter-builder').setAttribute('disabled','')");
  check('filter builder: disabled state blocks editing and apply', await ev("(()=>{const e=document.querySelector('sand-filter-builder');return e.add()===false&&Array.from(e.ui.querySelectorAll('button,select,input')).every(x=>x.disabled)})()")===true);
  await ev("document.querySelector('sand-filter-builder').removeAttribute('disabled')");

  await ev("(()=>{const e=document.querySelector('sand-table');e.columns=[{key:'name',label:'Name'},{key:'score',label:'Score'}];e.rows=[{id:'a',name:'Gamma',score:3},{id:'b',name:'Alpha',score:1},{id:'c',name:'Beta',score:2}];e.pageSize=2;e.addEventListener('select',()=>window.__p9.tableSelect++);e.addEventListener('sort',()=>window.__p9.tableSort++);})()");
  check('data table: renders semantic table headings and a bounded first page', await ev("(()=>{const e=document.querySelector('sand-table');return e.table.querySelectorAll('thead th').length===3&&e.body.querySelectorAll('tr[data-row-id]').length===2&&e.pageText.textContent==='Page 1 of 2'})()")===true);
  await ev("document.querySelector('sand-table').sort('name')");
  check('data table: sorts records and exposes aria-sort', await ev("(()=>{const e=document.querySelector('sand-table');return e.visibleRows()[0].id==='b'&&e.head.querySelectorAll('th')[1].getAttribute('aria-sort')==='ascending'&&window.__p9.tableSort===1})()")===true);
  await ev("document.querySelector('sand-table').sort('name')");
  check('data table: repeated sort toggles descending order', await ev("(()=>{const e=document.querySelector('sand-table');return e.visibleRows()[0].id==='a'&&e.sortDirection==='desc'})()")===true);
  await ev("(()=>{const e=document.querySelector('sand-table');e.filter='beta';})()");
  check('data table: filters visible columns and resets page', await ev("(()=>{const e=document.querySelector('sand-table');return e.visibleRows().length===1&&e.visibleRows()[0].id==='c'&&e.page===1})()")===true);
  await ev("(()=>{const e=document.querySelector('sand-table');e.filter='';e.sortBy='';e.sortDirection='asc';e.select('a',true);e.page=2;})()");
  check('data table: selection persists across pagination', await ev("(()=>{const e=document.querySelector('sand-table');return e.selected.includes('a')&&e.page===2&&e.body.querySelectorAll('tr[data-row-id]').length===1})()")===true);
  await ev("document.querySelector('sand-table').selectVisible(['b','c'],true)");
  check('data table: selectVisible adds rows to the selection', await ev("document.querySelector('sand-table').selected.length===3")===true);
  await ev("document.querySelector('sand-table').setAttribute('disabled','')");
  check('data table: disabled state disables search, selection and paging', await ev("(()=>{const e=document.querySelector('sand-table');return e.search.disabled&&e.prev.disabled&&e.next.disabled&&e.select('a',false)===false})()")===true);
  await ev("document.querySelector('sand-table').removeAttribute('disabled')");

  await ev("(()=>{const e=document.querySelector('sand-kanban');e.columns=[{id:'todo',label:'To do',cards:[{id:'a',title:'Task A'},{id:'b',title:'Task B'},{id:'c',title:'Task C'}]},{id:'doing',label:'Doing',cards:[]}];e.addEventListener('move',x=>window.__p9.kanban.push(x.detail));})()");
  check('Kanban: renders labelled columns and stable task cards', await ev("(()=>{const e=document.querySelector('sand-kanban');return e.columnsRoot.querySelectorAll('.gm-kanban-column').length===2&&e.columnsRoot.querySelectorAll('[data-card-id]').length===3})()")===true);

  await ev("(()=>{const e=document.querySelector('sand-kanban'),src=e.columnsRoot.querySelector('[data-card-id=a]'),dst=e.columnsRoot.querySelector('[data-card-id=c] [data-card-handle]');const start=new Event('dragstart',{bubbles:true,cancelable:true});Object.defineProperty(start,'dataTransfer',{value:{setData(){},effectAllowed:''}});src.dispatchEvent(start);const drop=new Event('drop',{bubbles:true,cancelable:true});Object.defineProperty(drop,'dataTransfer',{value:{getData(){return'a'},dropEffect:''}});dst.dispatchEvent(drop);})()");
  check('Kanban: same-column drag drop computes insertion after source removal', await ev("document.querySelector('sand-kanban').columns[0].cards.map(x=>x.id).join(',')==='b,a,c'")===true);
  await ev("document.querySelector('sand-kanban').moveCard('a','todo',2)");
  check('Kanban: same-column move preserves requested order', await ev("document.querySelector('sand-kanban').columns[0].cards.map(x=>x.id).join(',')==='b,c,a'")===true);
  await ev("document.querySelector('sand-kanban').moveCard('b','doing')");
  check('Kanban: cross-column movement emits source, target and updated state', await ev("(()=>{const e=document.querySelector('sand-kanban'),d=window.__p9.kanban.at(-1);return e.columns[0].cards.length===2&&e.columns[1].cards[0].id==='b'&&d.from==='todo'&&d.to==='doing'&&d.columns.length===2})()")===true);
  await ev("(()=>{const e=document.querySelector('sand-kanban'),b=e.columnsRoot.querySelector('[data-card-handle=c]');b.focus();b.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true,cancelable:true}));})()");
  check('Kanban: ArrowRight moves a card to the next workflow column', await ev("document.querySelector('sand-kanban').columns[1].cards.some(x=>x.id==='c')")===true);
  await ev("document.querySelector('sand-kanban').setAttribute('disabled','')");
  check('Kanban: disabled blocks API moves and disables card controls', await ev("(()=>{const e=document.querySelector('sand-kanban');return e.moveCard('a','doing')===false&&Array.from(e.ui.querySelectorAll('button')).every(b=>b.disabled)&&Array.from(e.ui.querySelectorAll('[data-card-id]')).every(x=>!x.draggable)})()")===true);
  await ev("document.querySelector('sand-kanban').removeAttribute('disabled')");
}

{ // forms: verify all twenty form-associated components in a small isolated form
  const formResults = await ev(`(() => {
    const f = document.createElement('form');
    f.style.cssText = 'position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden';
    f.innerHTML = '<sand-slider name="slider" value="30"></sand-slider><sand-toggle name="toggle" checked></sand-toggle><sand-checkbox name="checkbox" value="yes" checked></sand-checkbox><sand-radio-group name="radio" options="Small,Medium,Large" value="Medium"></sand-radio-group><sand-segmented name="segment" options="Day,Week,Month" value="Week"></sand-segmented><sand-range name="range" value="10,90"></sand-range><sand-rating name="rating" value="4"></sand-rating><sand-input name="input" value="hello"></sand-input><sand-textarea name="textarea" value="note"></sand-textarea><sand-password name="password" value="do-not-print-this"></sand-password><sand-search name="search" value="grain"></sand-search><sand-otp name="otp" value="123456" length="6"></sand-otp><sand-select name="select" value="express" options="standard:Standard,express:Express"></sand-select><sand-combobox name="combo" value="DEL" options="DEL:Delhi,BLR:Bengaluru"></sand-combobox><sand-date-picker name="date" value="2026-11-24"></sand-date-picker><sand-date-range name="dateRange" start="2026-11-21" end="2026-11-25"></sand-date-range><sand-time-picker name="time" value="16:30"></sand-time-picker><sand-steps name="steps" steps="A,B,C" value="1"></sand-steps><sand-timer name="timer" duration="45"></sand-timer><sand-color-picker name="color" value="#cc8844"></sand-color-picker>';
    document.body.append(f);
    const d = Object.fromEntries(new FormData(f));
    const results = { slider: d.slider === '30', toggle: d.toggle === 'on', checkbox: d.checkbox === 'yes', radio: d.radio === 'Medium', segment: d.segment === 'Week', range: d.range === '10,90', rating: d.rating === '4', input: d.input === 'hello', textarea: d.textarea === 'note', password: d.password === 'do-not-print-this', search: d.search === 'grain', otp: d.otp === '123456', select: d.select === 'express', combo: d.combo === 'DEL', date: d.date === '2026-11-24', dateRange: d.dateRange === '2026-11-21/2026-11-25', time: d.time === '16:30', steps: d.steps === '1', timer: d.timer === '45', color: d.color === '#cc8844' };
    f.remove();
    return results;
  })()`);
  check('forms: all nineteen form-associated components serialize correctly', Object.values(formResults).every(Boolean), JSON.stringify(formResults));
}
{ // scaling: the height follows the width
  const got = await ev(`(() => { const e = document.createElement('sand-toggle'); e.style.width = '150px'; document.body.append(e); const b = e.getBoundingClientRect(); e.remove(); return b.width + ' ' + Math.round(b.height); })()`);
  check('scaling: a toggle 150 wide is 66 high', got === '150 66', got);
}
const wide = await ev('document.documentElement.scrollWidth'); check('no sideways scroll at 390', wide <= 390, wide);
check('no script errors', !logs.length, logs.join(' | '));
ws.close(); chrome.kill(); await sleep(300); try { rmSync(PROFILE, { recursive: true, force: true }); } catch {}
process.exit(fails ? 1 : 0);
