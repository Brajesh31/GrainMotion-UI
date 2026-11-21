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
  check('slider: ArrowLeft lowers it by one step', afterKey === v1 - 1, afterKey);
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
{ // forms: verify all twelve form-associated components in a small isolated form
  const formResults = await ev(`(() => {
    const f = document.createElement('form');
    f.style.cssText = 'position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden';
    f.innerHTML = '<sand-slider name="slider" value="30"></sand-slider><sand-toggle name="toggle" checked></sand-toggle><sand-checkbox name="checkbox" value="yes" checked></sand-checkbox><sand-radio-group name="radio" options="Small,Medium,Large" value="Medium"></sand-radio-group><sand-segmented name="segment" options="Day,Week,Month" value="Week"></sand-segmented><sand-range name="range" value="10,90"></sand-range><sand-rating name="rating" value="4"></sand-rating><sand-input name="input" value="hello"></sand-input><sand-textarea name="textarea" value="note"></sand-textarea><sand-password name="password" value="do-not-print-this"></sand-password><sand-search name="search" value="grain"></sand-search><sand-otp name="otp" value="123456" length="6"></sand-otp><sand-select name="select" value="express" options="standard:Standard,express:Express"></sand-select><sand-combobox name="combo" value="DEL" options="DEL:Delhi,BLR:Bengaluru"></sand-combobox><sand-date-picker name="date" value="2026-11-24"></sand-date-picker><sand-date-range name="dateRange" start="2026-11-21" end="2026-11-25"></sand-date-range><sand-time-picker name="time" value="16:30"></sand-time-picker>';
    document.body.append(f);
    const d = Object.fromEntries(new FormData(f));
    const results = { slider: d.slider === '30', toggle: d.toggle === 'on', checkbox: d.checkbox === 'yes', radio: d.radio === 'Medium', segment: d.segment === 'Week', range: d.range === '10,90', rating: d.rating === '4', input: d.input === 'hello', textarea: d.textarea === 'note', password: d.password === 'do-not-print-this', search: d.search === 'grain', otp: d.otp === '123456', select: d.select === 'express', combo: d.combo === 'DEL', date: d.date === '2026-11-24', dateRange: d.dateRange === '2026-11-21/2026-11-25', time: d.time === '16:30' };
    f.remove();
    return results;
  })()`);
  check('forms: all seventeen form-associated components serialize correctly', Object.values(formResults).every(Boolean), JSON.stringify(formResults));
}
{ // scaling: the height follows the width
  const got = await ev(`(() => { const e = document.createElement('sand-toggle'); e.style.width = '150px'; document.body.append(e); const b = e.getBoundingClientRect(); e.remove(); return b.width + ' ' + Math.round(b.height); })()`);
  check('scaling: a toggle 150 wide is 66 high', got === '150 66', got);
}
const wide = await ev('document.documentElement.scrollWidth'); check('no sideways scroll at 390', wide <= 390, wide);
check('no script errors', !logs.length, logs.join(' | '));
ws.close(); chrome.kill(); await sleep(300); try { rmSync(PROFILE, { recursive: true, force: true }); } catch {}
process.exit(fails ? 1 : 0);
