(function(){
  var $=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};
  var root=document.documentElement;

  /* language: TH / EN, saved in localStorage */
  var lt=document.getElementById('lang-t');
  function setLang(l){
    $('[data-th]').forEach(function(e){if(e.dataset.en==null)e.dataset.en=e.innerHTML;e.innerHTML=l==='th'?e.dataset.th:e.dataset.en});
    root.lang=l;lt.textContent=l==='th'?'EN':'TH';var pi=document.getElementById('rsearch');if(pi){if(!pi.dataset.phEn)pi.dataset.phEn=pi.placeholder;pi.placeholder=l==='th'?pi.dataset.phTh:pi.dataset.phEn}
    try{localStorage.setItem('eai-lang',l)}catch(e){}
  }
  document.getElementById('lang').onclick=function(){setLang(root.lang==='th'?'en':'th')};
  try{if(localStorage.getItem('eai-lang')==='th')setLang('th')}catch(e){}

  /* nav: dropdowns and phone burger */
  $('.dd>button').forEach(function(b){b.onclick=function(e){
    var d=b.parentNode,o=d.classList.contains('open');
    $('.dd.open').forEach(function(x){x.classList.remove('open');x.firstElementChild.setAttribute('aria-expanded','false')});
    if(!o){d.classList.add('open');b.setAttribute('aria-expanded','true')}
    e.stopPropagation()}});
  /* full-page menu: a fixed overlay outside the nav (the nav's blur would otherwise trap a fixed child) */
  var mb=document.getElementById('menuBtn'),mf=document.getElementById('menufull');
  /* the page you are on gets a red icon in the menu */
  (function(){
    var base=function(h){return (h.split('#')[0].split('?')[0].split('/').pop()||'index.html').replace(/\.html$/,'').replace(/^home$/,'index')};
    var here=base(location.pathname);
    $('.menufull .grp a').forEach(function(a){if(base(a.getAttribute('href'))===here){a.classList.add('cur');a.setAttribute('aria-current','page')}});
  })();
  function mopen(o){mf.classList.toggle('open',o);document.body.classList.toggle('menuopen',o);mb.setAttribute('aria-expanded',o);var mi=mb.querySelector('.mi');mi.src=o?'assets/bi/plus-lg.svg':'assets/ph/list.svg';mi.style.transform=o?'rotate(45deg)':''}
  mb.onclick=function(e){e.stopPropagation();$('.dd.open').forEach(function(x){x.classList.remove('open')});mopen(!mf.classList.contains('open'))};
  mf.addEventListener('click',function(e){if(e.target.closest('a'))mopen(false)});
  addEventListener('keydown',function(e){if(e.key==='Escape')mopen(false)});
  document.addEventListener('click',function(e){if(!e.target.closest('.dd'))$('.dd.open').forEach(function(x){x.classList.remove('open')})});

  /* hairline figures: one mount per stage */
  if(window.HL&&window.FIGS){
    HL.inject(document);
    $('.stage[data-fig]').forEach(function(st){
      var f=FIGS[st.dataset.fig];if(!f)return;
      st.setAttribute('data-hairline',f.name);st.setAttribute('role','img');st.setAttribute('aria-label',f.means);
      var svg=HL.mk('svg',{viewBox:f.vb||'0 0 400 320','aria-hidden':'true'},st);
      st._h=f.mount({stage:st,svg:svg,read:st.parentNode.querySelector('.read')},f.range[1]);
    });
  }


  /* FAQ: open and close slide, and opening one closes the others */
  var faqs=$('.faq2 details'),FD=matchMedia('(prefers-reduced-motion:reduce)').matches?0:340,EZ='cubic-bezier(.65,0,.35,1)';
  faqs.forEach(function(d){if(d.open)d.classList.add('on')});
  function faqTo(d,open){
    if(d._a)d._a.cancel();
    var s=d.querySelector('summary'),border=d.offsetHeight-d.clientHeight,from=d.offsetHeight;
    if(open)d.open=true;
    d.classList.toggle('on',open);
    var closedH=s.offsetHeight+border,to=open?d.scrollHeight+border:closedH;
    d._a=d.animate([{height:from+'px'},{height:to+'px'}],{duration:FD,easing:EZ});
    d._a.onfinish=function(){d._a=null;if(!open)d.open=false};
    d._a.oncancel=function(){d._a=null};
  }
  faqs.forEach(function(d){d.querySelector('summary').addEventListener('click',function(e){
    e.preventDefault();
    var open=!d.classList.contains('on');
    if(open)faqs.forEach(function(o){if(o!==d&&o.parentNode===d.parentNode&&o.classList.contains('on'))faqTo(o,false)});
    faqTo(d,open);
  })});


  /* alumni roster: generation tabs and a search that works across all of them */
  var rts=$('.rt'),rps=$('.rp'),rs=document.getElementById('rsearch'),rc=document.getElementById('rcount');
  if(rts.length){
    rts.forEach(function(b){b.onclick=function(){rts.forEach(function(x){x.classList.toggle('on',x===b)});rps.forEach(function(p,k){p.classList.toggle('on',k===+b.dataset.i)});if(rs)rs.oninput()}});
    if(rs)rs.oninput=function(){
      var qv=rs.value.trim().toLowerCase(),total=0;
      $('.pc').forEach(function(r){var ok=!qv||(r.dataset.s||'').indexOf(qv)>-1;r.classList.toggle('hide',!ok);if(ok&&r.closest('.rp.on'))total++});
      if(rc)rc.textContent=qv?total:'';
    };
  }


  /* photo viewer for the gallery thumbnails */
  var thumbsA=$('.thumbs a');
  if(thumbsA.length){
    var lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');
    lb.innerHTML='<img alt=""><button class="p" type="button" aria-label="Previous">&lsaquo;</button><button class="n" type="button" aria-label="Next">&rsaquo;</button><button class="x" type="button" aria-label="Close">&times;</button><div class="cp"></div>';
    document.body.appendChild(lb);
    var grp=[],gi=0;
    var show=function(i){gi=(i+grp.length)%grp.length;lb.querySelector('img').src=grp[gi].href;lb.querySelector('.cp').textContent=(gi+1)+' / '+grp.length};
    var shut=function(){lb.classList.remove('on')};
    thumbsA.forEach(function(a){a.onclick=function(e){e.preventDefault();grp=[].slice.call(a.parentNode.querySelectorAll('a'));show(grp.indexOf(a));lb.classList.add('on')}});
    lb.querySelector('.x').onclick=shut;lb.querySelector('.p').onclick=function(){show(gi-1)};lb.querySelector('.n').onclick=function(){show(gi+1)};
    lb.onclick=function(e){if(e.target===lb)shut()};
    addEventListener('keydown',function(e){if(!lb.classList.contains('on'))return;if(e.key==='Escape')shut();else if(e.key==='ArrowLeft')show(gi-1);else if(e.key==='ArrowRight')show(gi+1)});
  }


  /* block chart (universities): hover or scroll picks a school and fires the same "hl-pick" the figures do */
  $('.waffle').forEach(function(w){
    var gs=$('.wg[data-i]',w);
    var pick=function(i){gs.forEach(function(g,k){g.classList.toggle('on',k===i)});w.dispatchEvent(new CustomEvent('hl-pick',{detail:i,bubbles:true}))};
    gs.forEach(function(g,k){g.addEventListener('pointerenter',function(){pick(k)});g.addEventListener('click',function(){pick(k)})});
    w._h={pick:pick,set:function(){}};
  });


  /* universities: hovering a school lights its squares and its entry together */
  $('.byuni').forEach(function(bu){
    $('[data-k]',bu).forEach(function(e){
      e.onmouseenter=function(){$('[data-k="'+e.dataset.k+'"]',bu).forEach(function(x){x.classList.add('hl')})};
      e.onmouseleave=function(){$('.hl',bu).forEach(function(x){x.classList.remove('hl')})};
    });
  });


  /* universities: numbers count up, bars and blocks arrive as they scroll into view, the caption follows the pointer */
  var RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
  function countUp(el){
    var to=parseFloat(el.dataset.count),suf=el.dataset.suffix||'',t0=null,D=1500;
    function f(t){if(t0===null)t0=t;var p=Math.min((t-t0)/D,1),e=1-Math.pow(1-p,3);el.textContent=Math.round(to*e)+suf;if(p<1)requestAnimationFrame(f)}
    requestAnimationFrame(f);
  }
  var cio=new IntersectionObserver(function(es){es.forEach(function(e){
    if(!e.isIntersecting)return;var t=e.target;cio.unobserve(t);
    if(t.hasAttribute('data-count')&&!RM)countUp(t);
    if(t.classList.contains('rv'))t.classList.add('in');
  })},{threshold:.2});
  $('[data-count],.rv').forEach(function(el){if(el.hasAttribute('data-count')&&!RM)el.textContent='0'+(el.dataset.suffix||'');cio.observe(el)});
  $('.ux-grid').forEach(function(gr){
    var cap=gr.parentNode.querySelector('.ux-cap'),v=cap.querySelector('.ux-v');
    $('.ux-g[data-i]',gr).forEach(function(g){
      var inf=g.querySelector('.ux-info'),on=function(){v.innerHTML=inf.innerHTML;cap.classList.add('hv')};
      g.addEventListener('pointerenter',on);g.addEventListener('click',on);
    });
    gr.addEventListener('pointerleave',function(){cap.classList.remove('hv')});
  });


  /* stepped sections with no figure: the semester tabs and the scroll steps both go through the same pick */
  $('.nofig').forEach(function(box){
    var tabs=$('.st',box.closest('.sec'));
    var strip=tabs.length?tabs[0].parentNode:null;
    var pick=function(i){
      tabs.forEach(function(t,k){t.classList.toggle('on',k===i)});
      if(strip&&strip.scrollWidth>strip.clientWidth+2){ // a sideways strip (phone): the picked tab moves up to second place, so the next one shows
        var t=tabs[Math.max(0,i-1)];strip.scrollTo({left:t.getBoundingClientRect().left-strip.getBoundingClientRect().left+strip.scrollLeft,behavior:'smooth'});
      }
      box.dispatchEvent(new CustomEvent('hl-pick',{detail:i,bubbles:true}));
    };
    tabs.forEach(function(t,k){t.onclick=function(){pick(k)}});
    box._h={pick:pick,set:function(){}};
  });


  /* about: overview / career path / graduation tabs */
  $('.atabs').forEach(function(bar){
    var panes=$('.ap',bar.parentNode);
    $('.at',bar).forEach(function(t,k){t.onclick=function(){$('.at',bar).forEach(function(x){x.classList.toggle('on',x===t)});panes.forEach(function(p,n){p.classList.toggle('on',n===k)})}});
  });

  /* pager: one section per gesture, then input is ignored while the transition plays */
  var track=document.getElementById('track'),secs=$('.sec',track),dots=document.getElementById('dots'),cur=0,locked=false,FLOW=document.body.classList.contains('flow');
  var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,LOCK=reduce?250:850;
  secs.forEach(function(s,i){
    var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Section '+(i+1));
    b.onclick=function(){go(i)};dots.appendChild(b);
  });
  function go(i){
    if(locked||i<0||i>=secs.length||i===cur)return;
    var from=cur;locked=true;cur=i;
    if(secs[i].dataset.steps){var ds=secs[i].dataset;step=from<i?+(ds.min||0):+ds.steps-1;var want=step;setTimeout(function(){folder().pick(want)},500)}
    track.style.transform='translate3d(0,'+(-i*100)+'%,0)';
    secs.forEach(function(s,k){s.classList.toggle('on',k===i)});
    [].forEach.call(dots.children,function(d,k){d.classList.toggle('on',k===i)});
    dots.classList.toggle('lt',secs[i].classList.contains('dark'));document.body.classList.toggle('navdark',secs[i].classList.contains('dark'));
    setTimeout(function(){locked=false},LOCK);
  }
  dots.children[0].classList.add('on');dots.classList.toggle('lt',secs[0].classList.contains('dark'));document.body.classList.toggle('navdark',secs[0].classList.contains('dark'));
  var byId=function(id){for(var i=0;i<secs.length;i++)if(secs[i].id===id)return i;return cur};
  $('[data-go]').forEach(function(b){b.onclick=function(){go(byId(b.dataset.go))}});
  var step=0;
  function folder(){return secs[cur].querySelector('.stage,.waffle,.nofig')._h}
  function nav(dir){
    if(locked)return;
    var d=secs[cur].dataset,n=+d.steps,mn=+(d.min||0);
    if(n&&((dir>0&&step<n-1)||(dir<0&&step>mn))){locked=true;folder().pick(step+dir);setTimeout(function(){locked=false},450);return}
    go(cur+dir);
  }
  var KEYGO=['works.html','alumni.html','universities.html'];
  document.addEventListener('hl-key',function(e){location.href=KEYGO[e.detail]});
  document.addEventListener('hl-reveal',function(e){step=e.detail;$('.kbadge').forEach(function(b){b.classList.toggle('on',+b.dataset.i<=e.detail)});$('.wcard').forEach(function(b){b.classList.toggle('on',+b.dataset.i<=e.detail)})});
  var panes=$('.pane');
  document.addEventListener('hl-pick',function(e){step=e.detail;var sn=document.getElementById('stepN');if(sn)sn.textContent=(step+1)+' / '+secs[cur].dataset.steps;panes.forEach(function(p,k){p.classList.toggle('on',k===e.detail)})});
  var inMenu=function(t){return FLOW||(t.closest&&t.closest('.nav,.menufull,.sbox,.thumbs'))};
  addEventListener('wheel',function(e){
    if(inMenu(e.target))return;
    e.preventDefault();
    var tw=secs[cur].dataset.scrolltable&&secs[cur].querySelector('.pane.on .tw');
    if(tw){var atEnd=tw.scrollTop+tw.clientHeight>=tw.scrollHeight-1,atTop=tw.scrollTop<=0;if((e.deltaY>0&&!atEnd)||(e.deltaY<0&&!atTop)){tw.scrollTop+=e.deltaY;return}}
    if(Math.abs(e.deltaY)>6)nav(e.deltaY>0?1:-1);
  },{passive:false});
  var y0=null;
  addEventListener('touchstart',function(e){y0=inMenu(e.target)?null:e.touches[0].clientY},{passive:true});
  addEventListener('touchmove',function(e){if(y0!=null)e.preventDefault()},{passive:false});
  addEventListener('touchend',function(e){
    if(y0==null)return;var d=y0-e.changedTouches[0].clientY;y0=null;
    if(Math.abs(d)>40)nav(d>0?1:-1);
  });
  addEventListener('keydown',function(e){
    var k=e.key,t=e.target.tagName;if(FLOW||t==='INPUT'||t==='TEXTAREA'||mf.classList.contains('open')||document.querySelector('.lb.on'))return;
    if(k==='ArrowDown'||k==='PageDown'||(k===' '&&t!=='BUTTON'&&t!=='A')){e.preventDefault();nav(1)}
    else if(k==='ArrowUp'||k==='PageUp'){e.preventDefault();nav(-1)}
    else if(k==='Home')go(0);else if(k==='End')go(secs.length-1);
  });

  /* a normal-scrolling page: sections fade in as they arrive, and the nav follows the photo banner */
  if(FLOW){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}})},{threshold:.2});
    secs.forEach(function(s){io.observe(s)});
    var banner=secs[0],bdark=banner.classList.contains('dark');
    var nd=function(){document.body.classList.toggle('navdark',bdark&&scrollY<banner.offsetHeight-90)};
    addEventListener('scroll',nd,{passive:true});nd();
  }
  /* start from the hash, e.g. index.html#s3 */
  var h=parseInt((location.hash.match(/s(\d)/)||[])[1],10);if(h>1&&h<=secs.length){cur=h-1;track.style.transition='none';document.body.classList.toggle('navdark',secs[h-1].classList.contains('dark'));track.style.transform='translate3d(0,'+(-cur*100)+'%,0)';secs.forEach(function(s,k){s.classList.toggle('on',k===cur)});[].forEach.call(dots.children,function(d,k){d.classList.toggle('on',k===cur)});requestAnimationFrame(function(){track.style.transition=''})}
})();
