// GrainMotion-UI Phase 7: advanced list and layout controls.
(() => {


const { SandTray, Sound } = window.GrainMotionUI;
const make = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; };
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, Number(n) || 0));
const emit = (el, name, detail) => el.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true, detail }));
class SandSplitPane extends SandTray {
  static get observedAttributes() { return ['axis','value','min-size','max-size','disabled','label']; }
  get aspect() { return .62; }
  get axis() { return this.getAttribute('axis')==='vertical'?'vertical':'horizontal'; }
  get disabled() { return this.hasAttribute('disabled'); }
  get value() { return this._value ?? clamp(this.getAttribute('value')||58,10,90); }
  set value(v) { this.setValue(v,true); }
  get minSize() { return clamp(this.getAttribute('min-size')||20,5,45); }
  get maxSize() { return clamp(this.getAttribute('max-size')||80,55,95); }
  attributeChangedCallback(name,oldValue,newValue) {
    if(oldValue===newValue||!this.ui)return;
    if(name==='value')this.setValue(newValue,false);
    else this.applyLayout();
  }
  init() {
    this.style.touchAction='pan-y';
    const original=Array.from(this.childNodes).filter(n=>n!==this.c&&n!==this.o);
    const style=make('style');
    style.textContent='.gm-split-ui{position:absolute;inset:9px;z-index:3;display:flex;gap:0;overflow:hidden;border:1px solid #6d4c2f;border-radius:14px;background:linear-gradient(145deg,#8c6845,#553821);box-shadow:inset 0 1px #fff6,0 5px 12px #37251855;color:#4c3926;font:500 11px/1.4 ui-sans-serif,system-ui,sans-serif}.gm-split-pane{min-width:0;min-height:0;overflow:auto;padding:12px;background:linear-gradient(145deg,#f5ead8,#e1cfb0);box-shadow:inset 0 1px #fff9,inset 0 -3px 8px #72542f1a}.gm-split-pane.end{background:repeating-linear-gradient(175deg,#876d4b08 0 1px,transparent 1px 12px),linear-gradient(145deg,#eee0c7,#d7c09b)}.gm-split-divider{position:relative;z-index:2;flex:0 0 15px;border:0;border-left:1px solid #4b321d;border-right:1px solid #b89568;background:repeating-linear-gradient(180deg,#e0c79e 0 3px,#ad8c5f 3px 6px);box-shadow:inset 1px 0 #fff7,0 0 6px #39241455;cursor:col-resize;touch-action:none}.gm-split-divider:before{content:\\\"\\\";position:absolute;left:50%;top:50%;width:5px;height:36px;transform:translate(-50%,-50%);border-radius:5px;background:radial-gradient(circle,#5b432c 1px,transparent 1.5px) center/5px 6px}.gm-split-ui.vertical{flex-direction:column}.gm-split-ui.vertical .gm-split-divider{flex:0 0 15px;border:0;border-top:1px solid #4b321d;border-bottom:1px solid #b89568;cursor:row-resize}.gm-split-ui.vertical .gm-split-divider:before{width:36px;height:5px;background:radial-gradient(circle,#5b432c 1px,transparent 1.5px) center/6px 5px}.gm-split-divider:focus-visible{outline:2px solid #302217;outline-offset:-3px}.gm-split-ui[aria-disabled=true] .gm-split-divider{opacity:.45;cursor:not-allowed}.gm-split-pane h3{margin:0 0 6px;font-size:12px}.gm-split-pane p{margin:0;color:#756044;font-size:10px}';
    this.append(style);
    this.ui=make('div','gm-split-ui');this.ui.setAttribute('aria-label',this.getAttribute('label')||'Resizable split pane');
    this.startPane=make('section','gm-split-pane start');this.startPane.setAttribute('aria-label','First pane');
    this.endPane=make('section','gm-split-pane end');this.endPane.setAttribute('aria-label','Second pane');
    const start=original.filter(n=>n.nodeType===1&&n.getAttribute('slot')==='start');
    const end=original.filter(n=>n.nodeType===1&&n.getAttribute('slot')==='end');
    const plain=original.filter(n=>!(n.nodeType===1&&['start','end'].includes(n.getAttribute('slot'))));
    this.startPane.append(...(start.length?start:[make('div','', 'Primary workspace')]));
    this.endPane.append(...(end.length?end:[make('div','', 'Details and properties')]));
    plain.forEach(n=>{if(n.nodeType===3&&!n.textContent.trim())return;this.endPane.append(n);});
    this.divider=make('button','gm-split-divider');this.divider.type='button';this.divider.setAttribute('role','separator');this.divider.setAttribute('aria-label',this.getAttribute('label')||'Resize panes');this.divider.setAttribute('aria-orientation',this.axis==='horizontal'?'vertical':'horizontal');this.divider.tabIndex=0;
    this.ui.append(this.startPane,this.divider,this.endPane);this.append(this.ui);
    this.dragStart=null;
    this.divider.addEventListener('pointerdown',e=>{if(this.disabled)return;e.preventDefault();this.dragStart={id:e.pointerId};this.divider.setPointerCapture?.(e.pointerId);});
    this.divider.addEventListener('pointermove',e=>{if(!this.dragStart||this.disabled)return;const r=this.ui.getBoundingClientRect();const next=this.axis==='horizontal'?(e.clientX-r.left)/r.width*100:(e.clientY-r.top)/r.height*100;this.setValue(next,true);});
    const finish=()=>{if(this.dragStart){this.dragStart=null;emit(this,'change',{value:this.value,axis:this.axis});}};
    this.divider.addEventListener('pointerup',finish);this.divider.addEventListener('pointercancel',finish);
    this.divider.addEventListener('keydown',e=>{
      if(this.disabled)return;let next=this.value,step=Number(this.getAttribute('step'))||2;
      const dec=this.axis==='horizontal'?'ArrowLeft':'ArrowUp',inc=this.axis==='horizontal'?'ArrowRight':'ArrowDown';
      if(e.key===dec)next-=step;else if(e.key===inc)next+=step;else if(e.key==='Home')next=this.minSize;else if(e.key==='End')next=this.maxSize;else return;
      e.preventDefault();this.setValue(next,true);emit(this,'change',{value:this.value,axis:this.axis});
    });
    this.setValue(this.getAttribute('value')||58,false);
  }
  setValue(value,notify) {
    const next=clamp(value,this.minSize,this.maxSize),old=this._value;
    this._value=next;this.applyLayout();
    if(notify&&old!==next){Sound.play('stone',.16);emit(this,'input',{value:next,axis:this.axis});}
  }
  applyLayout() {
    if(!this.ui)return;
    const horizontal=this.axis==='horizontal';this.ui.classList.toggle('vertical',!horizontal);
    this.divider.setAttribute('aria-orientation',horizontal?'vertical':'horizontal');
    this.divider.disabled=this.disabled;this.divider.setAttribute('aria-valuemin',String(this.minSize));this.divider.setAttribute('aria-valuemax',String(this.maxSize));this.divider.setAttribute('aria-valuenow',String(Math.round(this.value)));
    this.startPane.style.flex='0 0 calc('+this.value+'% - 7.5px)';
    this.endPane.style.flex='1 1 0';
    this.startPane.style.width=horizontal?'':'100%';this.endPane.style.width=horizontal?'':'100%';
  }
  layout() {
    if(!this.W)return;const r=this.inner;
    for(let y=r.y0;y<r.y1;y++)for(let x=r.x0;x<r.x1;x++){const i=y*this.W+x;if(this.inside[i])this.h[i]=this.lines(x,y,4,26)*.05;}
    this.relax(r.x0,r.x1,3);this.dirty=true;this.step();
  }
  step() {
    const p=this.value/100,coord=this.axis==='horizontal'?this.inner.x0+p*(this.inner.x1-this.inner.x0):this.inner.y0+p*(this.inner.y1-this.inner.y0);
    this.stone=this.axis==='horizontal'?[coord,this.H*.5,this.H*.075,this.H*.09]:[this.W*.5,coord,this.H*.075,this.H*.09];
    this.stoneShape=[1,this.H*.075];
  }
}
if (!customElements.get('sand-split-pane')) customElements.define('sand-split-pane',SandSplitPane);
})();
