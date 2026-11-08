(function(){
/* Summaries: live diagrams, figure references and contents highlight. Plain JS, no libraries.
   Each widget = {t:title, c:controls, d:function(values)->{s:svg, o:[[label,value,hot]], n:note}, play:{k,sp}}.
   Pages place <figure class="fg wd" id="fig-N" data-w="name"> and this file builds the controls inside. */
var W={},K='var(--ink)',R='var(--w5)',M='var(--w5)',uid=0,PI=Math.PI,rad=function(d){return d*PI/180};
function r1(x){return isFinite(x)?Math.round(x*10)/10:0}
function n(x,d){x=+x;if(!isFinite(x))return '—';var s=x.toFixed(d==null?2:d);if(s.indexOf('.')>=0)s=s.replace(/0+$/,'').replace(/\.$/,'');if(s==='-0')s='0';return s.replace('-','−')}
function C(k,l,min,max,step,v){return{k:k,l:l,min:min,max:max,step:step,v:v}}
function S(k,l,opts,v){return{k:k,l:l,sel:opts,v:v==null?opts[0][0]:v}}
function tx(x,y,s,c,a,st){return'<text x="'+r1(x)+'" y="'+r1(y)+'"'+(c?' class="'+c+'"':'')+(a?' text-anchor="'+a+'"':'')+(st?' style="'+st+'"':'')+'>'+s+'</text>'}
function ln(x1,y1,x2,y2,c,col,sw){return'<line x1="'+r1(x1)+'" y1="'+r1(y1)+'" x2="'+r1(x2)+'" y2="'+r1(y2)+'"'+(c?' class="'+c+'"':'')+(col?' stroke="'+col+'"':'')+(sw?' stroke-width="'+sw+'"':'')+'/>'}
function ci(x,y,r,col,st){return'<circle cx="'+r1(x)+'" cy="'+r1(y)+'" r="'+r+'" fill="'+(col||K)+'"'+(st?' stroke="'+K+'" stroke-width="1.6"':'')+'/>'}
function rc(x,y,w,h,c,rx){return'<rect x="'+r1(x)+'" y="'+r1(y)+'" width="'+r1(w)+'" height="'+r1(h)+'" rx="'+(rx||0)+'"'+(c?' class="'+c+'"':'')+'/>'}
function pa(d,c,col){return'<path d="'+d+'" class="'+(c||'ln')+'"'+(col?' stroke="'+col+'"':'')+'/>'}
function ar(x1,y1,x2,y2,col,sw,dash){var dx=x2-x1,dy=y2-y1,l=Math.hypot(dx,dy);if(!(l>3))return'';var a=Math.atan2(dy,dx),h=8,w=.45;
 return'<line x1="'+r1(x1)+'" y1="'+r1(y1)+'" x2="'+r1(x2-5*Math.cos(a))+'" y2="'+r1(y2-5*Math.sin(a))+'" stroke="'+col+'" stroke-width="'+(sw||2)+'"'+(dash?' stroke-dasharray="4 4"':'')+'/><polygon points="'+r1(x2)+','+r1(y2)+' '+r1(x2-h*Math.cos(a-w))+','+r1(y2-h*Math.sin(a-w))+' '+r1(x2-h*Math.cos(a+w))+','+r1(y2-h*Math.sin(a+w))+'" fill="'+col+'"/>'}
function nice(x){if(!(x>0))return 1;var p=Math.pow(10,Math.floor(Math.log10(x))),f=x/p;return(f<=1?1:f<=2?2:f<=5?5:10)*p}
function G(w,h,x0,x1,y0,y1,p){p=p==null?30:p;var q={w:w,h:h,x0:x0,x1:x1,y0:y0,y1:y1,p:p,id:++uid,sx:(w-2*p)/(x1-x0),sy:(h-2*p)/(y1-y0)};q.X=function(x){return p+(x-x0)*q.sx};q.Y=function(y){return h-p-(y-y0)*q.sy};return q}
function grid(g,dx,dy,k){var s='<clipPath id="c'+g.id+'"><rect x="'+g.p+'" y="'+g.p+'" width="'+(g.w-2*g.p)+'" height="'+(g.h-2*g.p)+'"/></clipPath>',i,v;k=k==null?1:k;
 for(i=Math.ceil(g.x0/dx-1e-9);i<=Math.floor(g.x1/dx+1e-9);i++){v=i*dx;s+=ln(g.X(v),g.Y(g.y0),g.X(v),g.Y(g.y1),'gr');if(k&&i%k===0&&Math.abs(v)>1e-9&&Math.abs(v-g.x0)>1e-9)s+=tx(g.X(v),g.h-g.p+13,n(v),'mu','middle')}
 for(i=Math.ceil(g.y0/dy-1e-9);i<=Math.floor(g.y1/dy+1e-9);i++){v=i*dy;s+=ln(g.X(g.x0),g.Y(v),g.X(g.x1),g.Y(v),'gr');if(k&&i%k===0&&Math.abs(v)>1e-9&&Math.abs(v-g.y0)>1e-9)s+=tx(g.p-4,g.Y(v)+4,n(v),'mu','end')}
 if(g.y0<0&&g.y1>0)s+=ln(g.X(g.x0),g.Y(0),g.X(g.x1),g.Y(0),'ax');if(g.x0<0&&g.x1>0)s+=ln(g.X(0),g.Y(g.y0),g.X(0),g.Y(g.y1),'ax');return s}
function cl(g,s){return'<g clip-path="url(#c'+g.id+')">'+s+'</g>'}
function curve(g,f,a,b,cls,N,col){N=N||240;var d='',pen=0,py=null,H=g.y1-g.y0,i,x,y;
 for(i=0;i<=N;i++){x=a+(b-a)*i/N;y=f(x);if(!isFinite(y)||Math.abs(y-(g.y0+g.y1)/2)>3*H){pen=0;py=null;continue}if(py!==null&&Math.abs(y-py)>1.5*H)pen=0;d+=(pen?'L':'M')+r1(g.X(x))+' '+r1(g.Y(y));pen=1;py=y}
 return pa(d,cls,col)}
function pcurve(g,f,a,b,cls,N,col){N=N||300;var d='',pen=0,i,t,p,W_=g.x1-g.x0,H=g.y1-g.y0;
 for(i=0;i<=N;i++){t=a+(b-a)*i/N;p=f(t);if(!isFinite(p[0])||!isFinite(p[1])||Math.abs(p[0]-(g.x0+g.x1)/2)>3*W_||Math.abs(p[1]-(g.y0+g.y1)/2)>3*H){pen=0;continue}d+=(pen?'L':'M')+r1(g.X(p[0]))+' '+r1(g.Y(p[1]));pen=1}
 return pa(d,cls,col)}
function pt(g,x,y,r,col,st){return ci(g.X(x),g.Y(y),r||4,col,st)}
function lab(g,x,y,s,c,dx,dy){return tx(g.X(x)+(dx||6),g.Y(y)+(dy||-6),s,c||'')}
function rng(a){var lo=Math.min.apply(null,a.concat(0)),hi=Math.max.apply(null,a.concat(0));if(hi-lo<1){hi+=.5;lo-=.5}var p=(hi-lo)*.1;return[lo-(lo<0?p:0),hi+(hi>0?p:0)]}
function shift(v,s){return v===0?s:'('+s+(v>0?' − '+n(v):' + '+n(-v))+')'}
function surd(m){var a=1,b=m,i;for(i=Math.floor(Math.sqrt(m));i>1;i--)if(m%(i*i)===0){a=i;b=m/(i*i);break}return[a,b]}
function sq(v){var r=Math.round(v);if(Math.abs(r-v)<1e-9&&r>=0){var s=surd(r);return r>=0&&Math.sqrt(r)%1===0?n(Math.sqrt(r)):(s[0]>1?s[0]:'')+'√'+s[1]}var rr=Math.round(v*1e6)/1e6;return n(Math.sqrt(rr),3)}
function wrapS(w,h,b){return'<svg viewBox="0 0 '+w+' '+h+'" role="img" aria-label="diagram">'+b+'</svg>'}


var root=typeof window!=='undefined'?window:globalThis;
root.SW={W:W,K:K,R:R,M:M,PI:PI,rad:rad,r1:r1,n:n,C:C,S:S,tx:tx,ln:ln,ci:ci,rc:rc,pa:pa,ar:ar,nice:nice,G:G,grid:grid,cl:cl,curve:curve,pcurve:pcurve,pt:pt,lab:lab,rng:rng,shift:shift,surd:surd,sq:sq,wrapS:wrapS};

/* ---------- page behaviour (browser only) ---------- */
function el_(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e}
/* plain dropdown: replaces the browser's own select list, which cannot be styled */
function dropdown(c,v,change){
 var box=el_('div','dd2'),btn=el_('button','dd2b'),ul=el_('ul','dd2l'),items=[],cur=String(c.v);
 btn.type='button';btn.setAttribute('aria-haspopup','listbox');btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-label',c.l);
 ul.setAttribute('role','listbox');ul.hidden=true;
 c.sel.forEach(function(o){var li=el_('li',null,o[1]);li.setAttribute('role','option');li.tabIndex=-1;li.dataset.v=o[0];items.push(li);ul.appendChild(li);li.addEventListener('click',function(){pick(li)})});
 function mark(){items.forEach(function(li){var on=li.dataset.v===cur;li.setAttribute('aria-selected',on);if(on)btn.textContent=li.textContent})}
 function show(o){ul.hidden=!o;btn.setAttribute('aria-expanded',o);if(o){var s=items.filter(function(li){return li.dataset.v===cur})[0]||items[0];s.focus();s.scrollIntoView({block:'nearest'})}}
 function pick(li){cur=li.dataset.v;v[c.k]=cur;mark();show(false);change();btn.focus()}
 btn.addEventListener('click',function(e){e.stopPropagation();closeAll(box);show(ul.hidden)});
 ul.addEventListener('keydown',function(e){var i=items.indexOf(document.activeElement);
  if(e.key==='ArrowDown'){items[Math.min(i+1,items.length-1)].focus();e.preventDefault()}
  else if(e.key==='ArrowUp'){items[Math.max(i-1,0)].focus();e.preventDefault()}
  else if(e.key==='Enter'||e.key===' '){if(i>=0)pick(items[i]);e.preventDefault()}
  else if(e.key==='Escape'||e.key==='Tab'){show(false);btn.focus()}});
 box.appendChild(btn);box.appendChild(ul);mark();return box}
function closeAll(except){document.querySelectorAll('.dd2').forEach(function(b){if(b!==except){b.querySelector('.dd2l').hidden=true;b.querySelector('.dd2b').setAttribute('aria-expanded','false')}})}
function build(fig){
 var D=W[fig.dataset.w];if(!D)return;
 var v={},cap=fig.querySelector('figcaption'),head=el_('div','wh','<b>'+D.t+'</b><span></span>'),wc=el_('div','wc'),wv=el_('div','wv'),wo=el_('div','wo'),wn=el_('div','wn'),ins={},slots={},sels=[],raf=0,btn=null;
 D.c.forEach(function(c){
  var sel=!!c.sel,lb=el_(sel?'div':'label',sel?'wl':null),out=el_('output'),inp;v[c.k]=c.v;
  lb.appendChild(document.createTextNode(c.l));lb.appendChild(out);
  if(sel)inp=dropdown(c,v,function(){draw()});
  else{inp=el_('input');inp.type='range';inp.min=c.min;inp.max=c.max;inp.step=c.step;inp.value=c.v;out.textContent=c.fmt?c.fmt(c.v):n(c.v);inp.setAttribute('aria-label',c.l);
   inp.addEventListener('input',function(){v[c.k]=inp.value;out.textContent=c.fmt?c.fmt(inp.value):n(inp.value);draw()})}
  ins[c.k]={inp:inp,out:out,c:c};if(c.slot){slots[c.k]=inp;return}if(c.head){var sb=el_('div','wsel');sb.appendChild(inp);sb.appendChild(el_('span',null,c.desc||c.l));sels.push(sb);return}lb.appendChild(inp);wc.appendChild(lb)});
 function draw(){
  var r=D.d(v);
  wv.innerHTML=r.html||wrapS(560,r.h||D.h||320,r.s);
  Object.keys(slots).forEach(function(k){var ph=wv.querySelector('[data-slot="'+k+'"]');if(ph)ph.appendChild(slots[k])});
  wo.innerHTML=r.o.map(function(o){return'<div'+(o[2]?' class="hi"':'')+'><b>'+o[1]+'</b>'+o[0]+'</div>'}).join('');
  sels.forEach(function(sb){wo.insertBefore(sb,wo.firstChild)});
  wn.textContent=r.n||'';
 }
 if(D.play){
  btn=el_('button','pl','▶ Play');btn.type='button';head.appendChild(btn);
  btn.addEventListener('click',function(){
   if(raf){cancelAnimationFrame(raf);raf=0;btn.textContent='▶ Play';return}
   btn.textContent='❚❚ Pause';var last=0,I=ins[D.play.k],c=I.c;
   (function tick(ts){var dt=last?(ts-last)/1000:0;last=ts;var x=+v[c.k]+D.play.sp*dt;if(x>c.max)x=c.min;v[c.k]=x;I.inp.value=x;I.out.textContent=n(x);draw();raf=requestAnimationFrame(tick)})(0)});
 }
 fig.insertBefore(head,cap);fig.insertBefore(wn,cap);fig.insertBefore(wo,cap);fig.insertBefore(wc,cap);fig.insertBefore(wv,cap);
 if(!wc.children.length)wc.remove();
 head.querySelector('span').textContent=D.hint!==undefined?D.hint:(D.play?'drag a slider or press play':'drag the sliders');
 draw();
}
function refs(){
 document.querySelectorAll('a.rf').forEach(function(a){
  var fg=document.getElementById((a.getAttribute('href')||'').slice(1));if(!fg)return;
  a.addEventListener('click',function(){fg.classList.remove('flash');void fg.offsetWidth;fg.classList.add('flash')});
 });
}
if(typeof document!=='undefined')document.addEventListener('DOMContentLoaded',function(){document.addEventListener('click',function(){closeAll()});document.querySelectorAll('figure[data-w]').forEach(build);refs()});
})();
