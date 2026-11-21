// GrainMotion-UI Phase 7: advanced list and layout controls.
(() => {


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
