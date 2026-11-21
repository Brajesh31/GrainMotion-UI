// GrainMotion-UI Phase 7: advanced list and layout controls.
(() => {


const { SandTray, Sound } = window.GrainMotionUI;
const make = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; };
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, Number(n) || 0));
const emit = (el, name, detail) => el.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true, detail }));
class SandTransferList extends SandTray {
  static get observedAttributes() { return ['disabled','label']; }
  get aspect() { return .94; }
  get disabled() { return this.hasAttribute('disabled'); }
  get items() { return (this._items||[]).map(x=>({...x})); }
  set items(v) {
    const seen=new Set();
    this._items=(Array.isArray(v)?v:[]).map((x,i)=>{
      const id=String(x?.id??'item-'+(i+1)); if(seen.has(id))return null; seen.add(id);
      return {id,label:String(x?.label??id),side:x?.side==='right'?'right':'left',disabled:!!x?.disabled};
    }).filter(Boolean); this._selected=new Set(); this.renderLists?.();
  }
  get selected() { return [...(this._selected||[])]; }
  set selected(v) { this.select(v); }
  attributeChangedCallback() { this.renderLists?.(); }
  init() {
    this.style.touchAction='pan-y';
    this._items=this._items||[
      {id:'research',label:'Research notes',side:'left'},
      {id:'wireframes',label:'Wireframes',side:'left'},
      {id:'tokens',label:'Design tokens',side:'left'},
      {id:'copy',label:'Product copy',side:'right'},
    ];
    this._selected=new Set();
    const style=make('style');
    style.textContent='.gm-transfer-ui{position:absolute;inset:9px;z-index:3;display:grid;grid-template-columns:minmax(0,1fr) 54px minmax(0,1fr);gap:8px;padding:10px;border:1px solid #745536;border-radius:15px;background:linear-gradient(145deg,#f0e3ce,#d9c4a1);box-shadow:inset 0 1px #fff9,0 5px 12px #3b291c33;color:#4b3826;font:500 10px/1.3 ui-sans-serif,system-ui,sans-serif}.gm-transfer-side{min-width:0;display:flex;flex-direction:column;gap:6px}.gm-transfer-head{display:flex;justify-content:space-between;align-items:center;gap:3px;font-size:11px;font-weight:750}.gm-transfer-count{color:#866b49;font-size:9px;font-weight:500}.gm-transfer-list{display:flex;flex:1;min-height:0;flex-direction:column;gap:5px;overflow:auto;padding:2px}.gm-transfer-item{width:100%;min-height:31px;padding:6px 7px;border:1px solid #b49a73;border-radius:8px;background:linear-gradient(145deg,#fff9ef,#d8c3a0);box-shadow:inset 0 1px #fff,0 2px 4px #4c382222;color:#56422d;text-align:left;font:600 10px ui-sans-serif,system-ui,sans-serif;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.gm-transfer-item[aria-pressed=true]{border-color:#63472b;background:linear-gradient(145deg,#98744e,#67472c);color:#fff0dc;box-shadow:inset 0 1px #fff6,0 3px 5px #43301e55}.gm-transfer-item:disabled{opacity:.4;cursor:not-allowed}.gm-transfer-actions{display:flex;flex-direction:column;align-items:stretch;justify-content:center;gap:6px}.gm-transfer-action{height:29px;border:1px solid #684a2d;border-radius:8px;background:linear-gradient(180deg,#94704a,#634328);box-shadow:inset 0 1px #fff7,0 2px 4px #39271955;color:#fff0dc;font:700 12px ui-sans-serif,system-ui,sans-serif;cursor:pointer}.gm-transfer-action:disabled{opacity:.35;cursor:not-allowed}.gm-transfer-ui button:focus-visible{outline:2px solid #382719;outline-offset:2px}.gm-transfer-foot{grid-column:1/4;text-align:center;color:#80684b;font-size:9px}@media(max-width:430px){.gm-transfer-ui{grid-template-columns:minmax(0,1fr) 42px minmax(0,1fr);gap:4px;padding:7px}.gm-transfer-action{height:26px}.gm-transfer-item{padding:5px 4px;font-size:9px}}';
    this.append(style);
    this.ui=make('section','gm-transfer-ui'); this.ui.setAttribute('aria-label',this.getAttribute('label')||'Transfer items');
    this.left=make('section','gm-transfer-side'); this.right=make('section','gm-transfer-side');
    this.leftHead=make('div','gm-transfer-head','Available'); this.leftCount=make('span','gm-transfer-count'); this.leftHead.append(this.leftCount);
    this.rightHead=make('div','gm-transfer-head','Selected'); this.rightCount=make('span','gm-transfer-count'); this.rightHead.append(this.rightCount);
    this.leftList=make('div','gm-transfer-list'); this.leftList.setAttribute('role','group'); this.leftList.setAttribute('aria-label','Available items');
    this.rightList=make('div','gm-transfer-list'); this.rightList.setAttribute('role','group'); this.rightList.setAttribute('aria-label','Selected items');
    this.left.append(this.leftHead,this.leftList); this.right.append(this.rightHead,this.rightList);
    this.actions=make('div','gm-transfer-actions');
    const action=(txt,name,label)=>{const b=make('button','gm-transfer-action',txt);b.type='button';b.dataset.action=name;b.setAttribute('aria-label',label);return b;};
    this.toRight=action('››','right','Move selected to selected'); this.oneRight=action('›','right-one','Move first selected right');
    this.toLeft=action('‹','left-one','Move first selected left'); this.allLeft=action('‹‹','left','Move all to available');
    this.actions.append(this.toRight,this.oneRight,this.toLeft,this.allLeft);
    this.foot=make('div','gm-transfer-foot','Select one or more stones, then move them between trays.');
    this.ui.append(this.left,this.actions,this.right,this.foot); this.append(this.ui);
    this.ui.addEventListener('click',e=>{
      const item=e.target.closest('button[data-id]');
      if(item&&!this.disabled){this.toggleSelected(item.dataset.id);return;}
      const b=e.target.closest('button[data-action]'); if(!b||b.disabled||this.disabled)return;
      const dir=b.dataset.action.startsWith('right')?'right':'left';
      if(b.dataset.action==='right'||b.dataset.action==='left')this.moveAll(dir);
      else if(b.dataset.action==='right-one'||b.dataset.action==='left-one'){const ids=[...this._selected];if(ids.length)this.move([ids[0]],dir);}
    });
    this.renderLists();
  }
  select(ids) {
    const valid=new Set(this._items.filter(x=>!x.disabled).map(x=>x.id));
    this._selected=new Set((Array.isArray(ids)?ids:[ids]).filter(x=>valid.has(String(x))).map(String));
    this.renderLists();
  }
  toggleSelected(id) {
    const item=this._items.find(x=>x.id===String(id)); if(!item||item.disabled||this.disabled)return;
    if(this._selected.has(item.id))this._selected.delete(item.id);else this._selected.add(item.id);
    this.renderLists(); Sound.play('tap',.18);
  }
  moveSelected(target) { return this.move(this.selected,target); }
  moveAll(target) { return this.move(this._items.filter(x=>x.side!==(target==='right'?'right':'left')&&!x.disabled).map(x=>x.id),target); }
  move(ids,target) {
    if(this.disabled)return false; const side=target==='right'?'right':'left';
    const moving=this._items.filter(x=>(Array.isArray(ids)?ids:[ids]).map(String).includes(x.id)&&x.side!==side&&!x.disabled);
    if(!moving.length)return false;
    moving.forEach(x=>x.side=side); moving.forEach(x=>this._selected.delete(x.id)); this.renderLists();
    const detail={ids:moving.map(x=>x.id),items:this.items,target:side};
    Sound.play('stone',.25); emit(this,'transfer',detail); emit(this,'change',detail); return true;
  }
  renderLists() {
    if(!this.leftList)return;
    this.leftList.replaceChildren();this.rightList.replaceChildren();
    for(const item of this._items){
      const b=make('button','gm-transfer-item',item.label);b.type='button';b.dataset.id=item.id;b.disabled=this.disabled||item.disabled;
      b.setAttribute('aria-pressed',String(this._selected.has(item.id)));
      (item.side==='right'?this.rightList:this.leftList).append(b);
    }
    const l=this._items.filter(x=>x.side==='left'),r=this._items.filter(x=>x.side==='right');
    this.leftCount.textContent=l.length;this.rightCount.textContent=r.length;
    this.toRight.disabled=this.disabled||!l.some(x=>this._selected.has(x.id));
    this.toLeft.disabled=this.disabled||!r.some(x=>this._selected.has(x.id));
    this.oneRight.disabled=this.toRight.disabled;this.allLeft.disabled=this.disabled||!r.length;
    this.ui.setAttribute('aria-disabled',String(this.disabled));
  }
  layout() {
    if(!this.W)return;const r=this.inner;
    for(let y=r.y0;y<r.y1;y++)for(let x=r.x0;x<r.x1;x++){const i=y*this.W+x;if(this.inside[i])this.h[i]=this.lines(x,y,3,22)*.04;}
    this.relax(r.x0,r.x1,3);this.dirty=true;this.step();
  }
  step() {
    const n=Math.max(1,this._items?.length||4),right=this._items?.filter(x=>x.side==='right').length||0;
    this.stone=[this.W*(.2+.6*right/n),this.H*.5,this.H*.07,this.H*.09];
    this.stones=[[this.W*.25,this.H*.5,this.H*.045,this.H*.06,.8,.7,.5],[this.W*.75,this.H*.5,this.H*.045,this.H*.06,.8,.7,.5]];
  }
}
if (!customElements.get('sand-transfer-list')) customElements.define('sand-transfer-list',SandTransferList);
})();
