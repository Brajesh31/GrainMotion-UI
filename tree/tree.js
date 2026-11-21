// GrainMotion-UI Phase 7: advanced list and layout controls.
(() => {


const { SandTray, Sound } = window.GrainMotionUI;
const make = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; };
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, Number(n) || 0));
const emit = (el, name, detail) => el.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true, detail }));
class SandTree extends SandTray {
  static get observedAttributes() { return ['disabled','label']; }
  get aspect() { return .92; }
  get disabled() { return this.hasAttribute('disabled'); }
  attributeChangedCallback() { this.syncDisabled?.(); }
  syncDisabled() { if(!this.root)return; this.root.setAttribute('aria-disabled',String(this.disabled)); this.nodeButtons?.forEach(b=>b.disabled=this.disabled||!!this.findNode(b.dataset.nodeId)?.disabled); this.root.querySelectorAll('.gm-tree-expander').forEach(b=>b.disabled=this.disabled||!this.findNode(b.nextElementSibling?.dataset.nodeId)?.children.length); }
  get items() { return (this._items||[]).map(copyNode); }
  set items(value) {
    const seen=new Set();
    const normalize=(rows,prefix='node')=>(Array.isArray(rows)?rows:[]).map((x,i)=>{
      const raw=String(x?.id??prefix+'-'+(i+1)),id=raw||prefix+'-'+(i+1);
      if(seen.has(id))return null;seen.add(id);
      return {id,label:String(x?.label??id),disabled:!!x?.disabled,children:normalize(x?.children,prefix+'-'+(i+1))};
    }).filter(Boolean);
    this._items=normalize(value);if(this._expanded)this.renderTree?.();
  }
  get value() { return this._value||''; }
  set value(v) { this.select(String(v),true); }
  get expanded() { return [...(this._expanded||[])]; }
  set expanded(v) { this._expanded=new Set(Array.isArray(v)?v.map(String):[]);this.renderTree?.(); }
  init() {
    this.style.touchAction='pan-y';
    if(!this._items)this.items=[
      {id:'workspace',label:'Workspace',children:[
        {id:'src',label:'src',children:[{id:'components',label:'components'},{id:'styles',label:'styles'}]},
        {id:'public',label:'public'},
        {id:'readme',label:'README.md'},
      ]},
      {id:'tests',label:'tests',children:[{id:'unit',label:'unit tests'},{id:'browser',label:'browser tests'}]},
    ];
    this._expanded=new Set(['workspace','src']);this._value='components';
    const style=make('style');
    style.textContent='.gm-tree-ui{position:absolute;inset:9px;z-index:3;display:flex;flex-direction:column;gap:6px;padding:10px 11px;border:1px solid #765638;border-radius:15px;background:linear-gradient(145deg,#f0e4d1,#d9c4a2);box-shadow:inset 0 1px #fff9,0 5px 12px #3a291b33;color:#4a3825;font:500 11px/1.35 ui-sans-serif,system-ui,sans-serif}.gm-tree-heading{font-weight:750;font-size:12px;padding:0 2px 4px;border-bottom:1px solid #baa07a}.gm-tree-root{flex:1;min-height:0;overflow:auto;padding:2px}.gm-tree-row{display:flex;align-items:center;gap:4px;min-height:28px}.gm-tree-expander{width:21px;height:22px;padding:0;border:0;border-radius:6px;background:transparent;color:#765537;font-size:13px;cursor:pointer}.gm-tree-expander:disabled{opacity:.3;cursor:default}.gm-tree-node{flex:1;min-width:0;min-height:25px;padding:4px 7px;border:1px solid transparent;border-radius:7px;background:transparent;color:#57432d;text-align:left;font:600 10px ui-sans-serif,system-ui,sans-serif;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.gm-tree-node[aria-selected=true]{border-color:#a88a62;background:linear-gradient(145deg,#b29a75,#8a704c);color:#fff2dc;box-shadow:inset 0 1px #fff7,0 2px 4px #44301f44}.gm-tree-node:disabled{opacity:.45;cursor:not-allowed}.gm-tree-node:focus-visible,.gm-tree-expander:focus-visible{outline:2px solid #46311e;outline-offset:1px}.gm-tree-group{margin-left:14px;padding-left:8px;border-left:1px solid #b29a75}.gm-tree-group[hidden]{display:none}.gm-tree-empty{display:grid;place-items:center;flex:1;color:#80694b;font-size:11px}';
    this.append(style);this.ui=make('section','gm-tree-ui');this.ui.setAttribute('aria-label',this.getAttribute('label')||'Tree view');this.ui.append(make('div','gm-tree-heading',this.getAttribute('label')||'Project files'));
    this.root=make('div','gm-tree-root');this.root.setAttribute('role','tree');this.root.setAttribute('aria-label',this.getAttribute('label')||'Project files');this.ui.append(this.root);this.append(this.ui);
    this.renderTree();
  }
  visibleNodes() {
    const out=[];const visit=(rows,parent=null,depth=1)=>{
      for(const item of rows){out.push({item,parent,depth});if(item.children.length&&this._expanded.has(item.id))visit(item.children,item.id,depth+1);}
    };visit(this._items);return out;
  }
  renderTree(focusId) {
    if(!this.root)return;
    const previouslyFocused=focusId||this.root.querySelector(':focus')?.dataset.nodeId;
    this.root.replaceChildren();this.nodeButtons=[];
    const build=(rows,parent,depth)=>{
      for(const item of rows){
        const row=make('div','gm-tree-row');row.style.paddingLeft=Math.max(0,(depth-1)*13)+'px';
        const has=!!item.children.length;
        const exp=make('button','gm-tree-expander',has?(this._expanded.has(item.id)?'▾':'▸'):'·');exp.type='button';exp.disabled=this.disabled||!has;exp.tabIndex=-1;exp.setAttribute('aria-label',(this._expanded.has(item.id)?'Collapse ':'Expand ')+item.label);exp.addEventListener('click',()=>this.toggle(item.id,true));row.append(exp);
        const b=make('button','gm-tree-node',item.label);b.type='button';b.dataset.nodeId=item.id;b.disabled=this.disabled||item.disabled;b.setAttribute('role','treeitem');b.setAttribute('aria-level',String(depth));b.setAttribute('aria-selected',String(this.value===item.id));if(has)b.setAttribute('aria-expanded',String(this._expanded.has(item.id)));b.tabIndex=this.value===item.id||(!this.value&&this.nodeButtons.length===0)?0:-1;
        b.addEventListener('click',()=>this.select(item.id,true));b.addEventListener('keydown',e=>this.onNodeKey(e,item.id));this.nodeButtons.push(b);row.append(b);parent.append(row);
        if(has){const group=make('div','gm-tree-group');group.setAttribute('role','group');group.hidden=!this._expanded.has(item.id);build(item.children,group,depth+1);parent.append(group);}
      }
    };
    if(!this._items.length)this.root.append(make('div','gm-tree-empty','No nodes'));
    else build(this._items,this.root,1);
    if(previouslyFocused)this.focusNode(previouslyFocused);
  }
  focusNode(id) { this.nodeButtons?.find(b=>b.dataset.nodeId===String(id))?.focus(); }
  toggle(id,notify) {
    const item=this.findNode(id);if(!item||!item.children.length||this.disabled||item.disabled)return false;
    if(this._expanded.has(item.id))this._expanded.delete(item.id);else this._expanded.add(item.id);
    this.renderTree(item.id);const detail={id:item.id,expanded:this._expanded.has(item.id),items:this.expanded};
    Sound.play('stone',.18);if(notify)emit(this,'expand',detail);return true;
  }
  findNode(id,rows=this._items) { for(const item of rows){if(item.id===String(id))return item;const found=this.findNode(id,item.children);if(found)return found;}return null; }
  select(id,notify) {
    const item=this.findNode(id);if(!item||item.disabled||this.disabled)return false;const old=this._value;this._value=item.id;this.renderTree(item.id);
    if(notify&&old!==this._value){Sound.play('tap',.18);const detail={value:this._value,previousValue:old,item:{id:item.id,label:item.label}};emit(this,'select',detail);emit(this,'change',detail);}
    return true;
  }
  onNodeKey(e,id) {
    const nodes=this.visibleNodes(),i=nodes.findIndex(x=>x.item.id===id),entry=nodes[i];if(!entry)return;
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){
      e.preventDefault();const dir=e.key==='ArrowDown'?1:-1;
      for(let n=i+dir;n>=0&&n<nodes.length;n+=dir)if(!nodes[n].item.disabled){this.focusNode(nodes[n].item.id);break;}
    } else if(e.key==='Home'){e.preventDefault();const n=nodes.find(x=>!x.item.disabled);if(n)this.focusNode(n.item.id);}
    else if(e.key==='End'){e.preventDefault();const n=nodes.filter(x=>!x.item.disabled).at(-1);if(n)this.focusNode(n.item.id);}
    else if(e.key==='ArrowRight'){
      if(entry.item.children.length&&!this._expanded.has(id)){e.preventDefault();this.toggle(id,true);this.focusNode(id);}
      else if(entry.item.children.length&&this._expanded.has(id)){e.preventDefault();const child=entry.item.children.find(x=>!x.disabled);if(child)this.focusNode(child.id);}
    } else if(e.key==='ArrowLeft'){
      if(entry.item.children.length&&this._expanded.has(id)){e.preventDefault();this.toggle(id,true);this.focusNode(id);}
      else if(entry.parent){e.preventDefault();this.focusNode(entry.parent);}
    } else if(e.key==='Enter'||e.key===' '){e.preventDefault();this.select(id,true);}
  }
  layout() {
    if(!this.W)return;const r=this.inner;
    for(let y=r.y0;y<r.y1;y++)for(let x=r.x0;x<r.x1;x++){const i=y*this.W+x;if(this.inside[i])this.h[i]=this.lines(x,y,4,43)*.045+this.groove((y-this.H*.5)/(this.H*.25))*.025;}
    this.relax(r.x0,r.x1,3);this.dirty=true;this.step();
  }
  step() {
    const nodes=this.visibleNodes(),index=Math.max(0,nodes.findIndex(x=>x.item.id===this.value)),n=Math.max(1,nodes.length),y=this.inner.y0+(index+.5)*(this.inner.y1-this.inner.y0)/n;
    this.stone=[this.W*.12,y,this.H*.045,this.H*.055];
  }
}
const copyNode = item => ({id:item.id,label:item.label,disabled:item.disabled,children:(item.children||[]).map(copyNode)});
if (!customElements.get('sand-tree')) customElements.define('sand-tree',SandTree);
})();
