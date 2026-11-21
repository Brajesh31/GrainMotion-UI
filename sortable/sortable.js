// GrainMotion-UI Phase 7: advanced list and layout controls.
(() => {


const { SandTray, Sound } = window.GrainMotionUI;
const make = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; };
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, Number(n) || 0));
const emit = (el, name, detail) => el.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true, detail }));
class SandSortable extends SandTray {
  static get observedAttributes() { return ['disabled', 'label']; }
  get aspect() { return .78; }
  get disabled() { return this.hasAttribute('disabled'); }
  get items() { return (this._items || []).map(x => ({ ...x })); }
  set items(value) {
    const seen = new Set();
    this._items = (Array.isArray(value) ? value : []).map((item, i) => {
      const id = String(item?.id ?? 'item-' + (i + 1));
      if (seen.has(id)) return null;
      seen.add(id);
      return { id, label: String(item?.label ?? id), disabled: !!item?.disabled };
    }).filter(Boolean);
    this.renderItems?.();
  }
  get value() { return this._items.map(x => x.id); }
  set value(order) {
    if (!Array.isArray(order)) return;
    const byId = new Map(this._items.map(x => [x.id, x]));
    const next = order.map(id => byId.get(String(id))).filter(Boolean);
    for (const item of this._items) if (!next.includes(item)) next.push(item);
    this._items = next;
    this.renderItems();
  }
  attributeChangedCallback() { this.syncDisabled?.(); }
  init() {
    this.style.touchAction = 'pan-y';
    this._items = this._items || [
      { id: 'brief', label: 'Prepare project brief' },
      { id: 'prototype', label: 'Build the first prototype' },
      { id: 'review', label: 'Review with the team' },
      { id: 'release', label: 'Prepare the release' },
    ];
    const style = make('style');
    style.textContent = '.gm-sort-ui{position:absolute;inset:9px;z-index:3;display:flex;flex-direction:column;gap:7px;padding:10px 11px;border:1px solid #795a39;border-radius:15px;background:linear-gradient(145deg,#f2e5d0ed,#ddc8a6ed);box-shadow:inset 0 1px #fff9,inset 0 -3px 8px #76532b22,0 5px 12px #3a281b33;color:#4b3927;font:500 11px/1.3 ui-sans-serif,system-ui,sans-serif}.gm-sort-head{display:flex;justify-content:space-between;align-items:center;font-weight:700;font-size:12px}.gm-sort-note{font-size:9px;color:#80684c;font-weight:500}.gm-sort-list{display:flex;flex:1;min-height:0;flex-direction:column;gap:5px;overflow:auto}.gm-sort-row{display:grid;grid-template-columns:27px minmax(0,1fr) 27px 27px;align-items:center;gap:6px;min-height:34px;padding:4px 6px;border:1px solid #b69b73;border-radius:9px;background:linear-gradient(145deg,#fff9ef,#dbc7a5);box-shadow:inset 0 1px #fff,0 2px 4px #49351f22;transition:transform .16s,box-shadow .16s}.gm-sort-row.dragging{opacity:.55;transform:scale(.98)}.gm-sort-row.over{outline:2px solid #99754d;outline-offset:1px}.gm-sort-handle,.gm-sort-move{width:25px;height:25px;border:1px solid #b29a78;border-radius:7px;background:linear-gradient(145deg,#d9c4a1,#b99a6e);color:#4e3924;font:700 12px ui-sans-serif,system-ui,sans-serif;cursor:grab}.gm-sort-move{background:#f0e3ce;cursor:pointer}.gm-sort-label{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:650}.gm-sort-row button:disabled{opacity:.35;cursor:not-allowed}.gm-sort-row button:focus-visible{outline:2px solid #43301e;outline-offset:2px}.gm-sort-empty{display:grid;place-items:center;flex:1;color:#80694c;font-size:11px}.gm-sort-ui[aria-disabled=true]{opacity:.58}@media(max-width:430px){.gm-sort-ui{padding:8px}.gm-sort-row{grid-template-columns:25px minmax(0,1fr) 25px 25px;gap:4px}}';
    this.append(style);
    this.ui = make('section', 'gm-sort-ui');
    this.ui.setAttribute('aria-label', this.getAttribute('label') || 'Sortable list');
    const head = make('div', 'gm-sort-head', this.getAttribute('label') || 'Arrange the list');
    head.append(make('span', 'gm-sort-note', 'Drag, or use the arrows'));
    this.list = make('div', 'gm-sort-list'); this.list.setAttribute('role', 'list');
    this.ui.append(head, this.list); this.append(this.ui);
    this.list.addEventListener('click', e => {
      const button = e.target.closest('button[data-action]');
      if (!button || this.disabled || button.disabled) return;
      const row = button.closest('[data-id]'), from = this._items.findIndex(x => x.id === row?.dataset.id);
      if (from < 0) return;
      const to = button.dataset.action === 'up' ? from - 1 : button.dataset.action === 'down' ? from + 1 : from;
      if (to !== from) { this.move(from, to); this.focusItem(this._items[to].id); }
    });
    this.list.addEventListener('keydown', e => {
      const row = e.target.closest('[data-id]');
      if (!row || this.disabled || e.target.dataset.action !== 'handle') return;
      const from = this._items.findIndex(x => x.id === row.dataset.id);
      let to = null;
      if (e.key === 'ArrowUp') to = from - 1;
      if (e.key === 'ArrowDown') to = from + 1;
      if (e.key === 'Home') to = 0;
      if (e.key === 'End') to = this._items.length - 1;
      if (to !== null) { e.preventDefault(); this.move(from, to); this.focusItem(this._items[to].id); }
    });
    this.list.addEventListener('dragstart', e => {
      const row = e.target.closest('.gm-sort-row');
      if (!row || this.disabled || this._items.find(x => x.id === row.dataset.id)?.disabled) { e.preventDefault(); return; }
      this._dragId = row.dataset.id;
      e.dataTransfer?.setData('text/plain', this._dragId);
      if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
      row.classList.add('dragging');
    });
    this.list.addEventListener('dragover', e => {
      const row = e.target.closest('.gm-sort-row');
      if (row && !this.disabled) { e.preventDefault(); row.classList.add('over'); if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'; }
    });
    this.list.addEventListener('dragleave', e => e.target.closest('.gm-sort-row')?.classList.remove('over'));
    this.list.addEventListener('drop', e => {
      e.preventDefault();
      const row = e.target.closest('.gm-sort-row');
      const id = this._dragId || e.dataTransfer?.getData('text/plain');
      const from = this._items.findIndex(x => x.id === id);
      const to = this._items.findIndex(x => x.id === row?.dataset.id);
      if (from >= 0 && to >= 0 && from !== to) this.move(from, to);
      this._dragId = null;
      this.list.querySelectorAll('.dragging,.over').forEach(n => n.classList.remove('dragging','over'));
    });
    this.list.addEventListener('dragend', () => { this._dragId = null; this.list.querySelectorAll('.dragging,.over').forEach(n => n.classList.remove('dragging','over')); });
    this.renderItems();
  }
  focusItem(id) { this.list.querySelector('[data-id="' + CSS.escape(String(id)) + '"] [data-action="handle"]')?.focus(); }
  syncDisabled() {
    if (!this.ui) return;
    this.ui.setAttribute('aria-disabled', String(this.disabled));
    this.list.querySelectorAll('button').forEach(b => b.disabled = this.disabled || !!this._items.find(x => x.id === b.closest('[data-id]')?.dataset.id)?.disabled);
    this.list.querySelectorAll('.gm-sort-row').forEach(row => row.draggable = !this.disabled && !this._items.find(x => x.id === row.dataset.id)?.disabled);
  }
  renderItems() {
    if (!this.list) return;
    this.list.replaceChildren();
    if (!this._items.length) { this.list.append(make('div','gm-sort-empty','No items to arrange')); this.syncDisabled(); return; }
    this._items.forEach((item, i) => {
      const row = make('article','gm-sort-row'); row.dataset.id = item.id; row.setAttribute('role','listitem'); row.draggable = !this.disabled && !item.disabled;
      const handle = make('button','gm-sort-handle','⋮⋮'); handle.type='button'; handle.dataset.action='handle'; handle.disabled=this.disabled||item.disabled; handle.setAttribute('aria-label','Move '+item.label); handle.title='Drag or use arrow keys';
      const label = make('span','gm-sort-label',item.label);
      const up = make('button','gm-sort-move','↑'); up.type='button'; up.dataset.action='up'; up.disabled=this.disabled||item.disabled||i===0; up.setAttribute('aria-label','Move '+item.label+' up');
      const down = make('button','gm-sort-move','↓'); down.type='button'; down.dataset.action='down'; down.disabled=this.disabled||item.disabled||i===this._items.length-1; down.setAttribute('aria-label','Move '+item.label+' down');
      row.append(handle,label,up,down); this.list.append(row);
    });
    this.syncDisabled();
  }
  move(from, to) {
    const a = Number(from), b = Number(to);
    if (this.disabled || !Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b < 0 || a >= this._items.length || b >= this._items.length || a === b) return false;
    if (this._items[a].disabled || this._items[b].disabled) return false;
    const next = this._items.slice(), [item] = next.splice(a,1); next.splice(b,0,item); this._items=next;
    this.renderItems(); this.stone = [this.W*.5,this.H*(.25+.5*(b/Math.max(1,this._items.length-1))),this.H*.07,this.H*.08];
    const detail={from:a,to:b,item:{...item},items:this.items,order:this.value};
    Sound.play('stone',.25); emit(this,'reorder',detail); emit(this,'change',detail); return true;
  }
  layout() {
    if (!this.W) return; const r=this.inner;
    for(let y=r.y0;y<r.y1;y++)for(let x=r.x0;x<r.x1;x++){const i=y*this.W+x;if(this.inside[i])this.h[i]=this.lines(x,y,4,14)*.045+this.groove((y-this.H*.5)/(this.H*.23))*.035;}
    this.relax(r.x0,r.x1,3); this.dirty=true; this.step();
  }
  step() { const n=Math.max(1,this._items?.length||4); const y=this.inner.y0+(this.inner.y1-this.inner.y0)*((this._activeIndex||0)+.5)/n; this.stone=[this.W*.1,y,this.H*.065,this.H*.085]; }
}
if (!customElements.get('sand-sortable')) customElements.define('sand-sortable',SandSortable);
})();
