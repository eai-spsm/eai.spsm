/* Home: the "What you will learn" section pins in place and switches subject as you scroll.
   Desktop only (>= 861px, motion allowed); on phones the cards simply stack. */
(function(){
  var run=document.querySelector('.hl-run');if(!run)return;
  var clamp=function(x){return Math.min(1,Math.max(0,x))},ease=function(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
  var st=run.querySelector('.hl-st'),tabs=[].slice.call(run.querySelectorAll('.hl-t')),cards=[].slice.call(run.querySelectorAll('.hl-c')),pps=[].slice.call(run.querySelectorAll('.hl-pp')),stg=run.querySelector('.hl-stage'),TINT=['#f6f7f8'],n=tabs.length,cur=0,raf=0;
  var mq=window.matchMedia('(min-width:861px)');
  function pinned(){return mq.matches}
  function topPx(){return parseFloat(getComputedStyle(st).top)||0}
  function range(){return Math.max(1,run.offsetHeight-st.offsetHeight)}
  var bs=[].slice.call(document.querySelectorAll('.hl-b'));
  function set(i){if(i===cur)return;cur=i;bs.forEach(function(b,k){b.classList.toggle('on',k===i)});tabs.forEach(function(t,k){t.classList.toggle('on',k===i)});cards.forEach(function(c,k){c.classList.toggle('on',k===i)});pps.forEach(function(c,k){c.classList.toggle('on',k===i)});if(stg){stg.style.setProperty('--tint',TINT[i%TINT.length]);stg.classList.remove('dk')}}
  /* intro: while the countdown stays pinned, the polaroids fly out, the text blurs away and the next heading rises in.
     Scroll sets targets; a small eased loop chases them so everything glides instead of jumping. */
  var cdr=document.querySelector('.hl-cdrun'),cd=cdr&&cdr.querySelector('.cd'),pols=cd?[].slice.call(cd.querySelectorAll('.pol')):[],wrap=cd&&cd.querySelector('.wrap'),learn=document.querySelector('.hl-learn'),
      HOLD=.45,smooth=function(t){return t*t*(3-2*t)},iv={a:0,b:0,l:1},it={a:0,b:0,l:1},iraf=0;
  function introTarget(){
    if(!cd)return;
    var on=!matchMedia('(prefers-reduced-motion:reduce)').matches,p=on?clamp((-cdr.getBoundingClientRect().top/Math.max(1,cdr.offsetHeight-cd.offsetHeight)-HOLD)/(1-HOLD)):0;
    it.a=ease(clamp(p/.6));it.b=smooth(clamp((p-.25)/.65));it.l=on?smooth(clamp((p-.45)/.45)):1;
    if(!iraf)iraf=requestAnimationFrame(introRender)}
  function introRender(){
    iraf=0;var moving=false,w=cd.offsetWidth,h=cd.offsetHeight;
    ['a','b','l'].forEach(function(k){var d=it[k]-iv[k];if(Math.abs(d)>.0015){iv[k]+=d*.14;moving=true}else iv[k]=it[k]});
    pols.forEach(function(el){
      var dx=(el.offsetLeft+el.offsetWidth/2-w/2)/(w/2),dy=(el.offsetTop+el.offsetHeight/2-h/2)/(h/2);
      el.style.translate=iv.a>.001?(dx*iv.a*w*.75).toFixed(1)+'px '+(dy*iv.a*h*.75).toFixed(1)+'px':'';
      el.style.opacity=iv.a>.001?(1-iv.a*.9).toFixed(3):''});
    var b=iv.b>.001?iv.b:0;
    wrap.style.filter=b?'blur('+(b*12).toFixed(1)+'px)':'';wrap.style.opacity=b?(1-b).toFixed(3):'';
    wrap.style.transform=b?'translateY('+(-b*36).toFixed(1)+'px) scale('+(1+b*.03).toFixed(3)+')':'';wrap.style.transition=b?'none':'';
    if(learn)learn.style.setProperty('--li',iv.l.toFixed(3));
    if(moving)iraf=requestAnimationFrame(introRender)}
  /* original hero: its content drifts up and fades while the countdown sheet slides over it; the sheet's top corners flatten as it lands */
  var hr=document.querySelector('.hl-hrun'),hw=hr&&hr.querySelector('.statement>.wrap');
  function heroMove(){
    if(!hr||!hw)return;
    var on=pinned()&&!matchMedia('(prefers-reduced-motion:reduce)').matches,s=on?Math.min(innerHeight,Math.max(0,-hr.getBoundingClientRect().top)):0;
    hw.style.transform=s?'translateY('+(-s*.45).toFixed(1)+'px)':'';hw.style.opacity=s?Math.max(0,1-s/(innerHeight*.75)).toFixed(3):'';hw.style.transition=s?'none':'';
    if(cd)cd.style.borderRadius=on?(34*clamp(cd.getBoundingClientRect().top/160)).toFixed(1)+'px '+(34*clamp(cd.getBoundingClientRect().top/160)).toFixed(1)+'px 0 0':''}
  function shrinkTab(){
    if(!learn)return;
    var r=learn.getBoundingClientRect(),q=pinned()?smooth(clamp((innerHeight-r.bottom)/(innerHeight*.75))):0;
    learn.style.setProperty('--cx',(q*5).toFixed(2)+'vw');learn.style.setProperty('--cr',(q*48).toFixed(1)+'px')}
  function frame(){raf=0;heroMove();introTarget();shrinkTab();if(!pinned())return;
    var p=Math.min(1,Math.max(0,(topPx()-run.getBoundingClientRect().top)/range()));
    set(Math.min(n-1,Math.floor(clamp((p-.14)/.86)*n)))}
  function ask(){if(!raf)raf=requestAnimationFrame(frame)}
  tabs.forEach(function(t,i){t.addEventListener('click',function(e){
    if(!pinned())return;e.preventDefault();
    var y=window.scrollY+run.getBoundingClientRect().top-topPx()+(i+.5)/n*range();
    window.scrollTo({top:y,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'})})});
  window.addEventListener('scroll',ask,{passive:true});window.addEventListener('resize',ask);mq.addEventListener('change',ask);ask();
  /* locked white section: one scroll distance, split into steps: panel 1, one step per career role, panel 3 */
  var lk=document.querySelector('.hl-lk-run');
  if(lk){
    var lst=lk.querySelector('.hl-lk-st'),lt=[].slice.call(lk.querySelectorAll('.hl-lk-t')),lp=[].slice.call(lk.querySelectorAll('.hl-lk-p')),
        iam=lk.querySelector('.iam'),roles=iam?iam.querySelectorAll('.pick').length:0,steps=roles+2,lpan=-1,lrole=-1,lraf=0;
    var lrange=function(){return Math.max(1,lk.offsetHeight-lst.offsetHeight)},ltop=function(){return parseFloat(getComputedStyle(lst).top)||0};
    function lgo(y){window.scrollTo({top:y,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'})}
    function lstep(k){return window.scrollY+lk.getBoundingClientRect().top-ltop()+(k+.5)/steps*lrange()}
    function lframe(){lraf=0;if(!pinned())return;
      var k=Math.min(steps-1,Math.floor(clamp((ltop()-lk.getBoundingClientRect().top)/lrange())*steps)),pan=k===0?0:k<=roles?1:2,role=Math.min(roles-1,Math.max(0,k-1));
      if(pan!==lpan){lpan=pan;lt.forEach(function(t,i){t.classList.toggle('on',i===pan)});lp.forEach(function(q,i){q.classList.toggle('on',i===pan)})}
      if(iam&&role!==lrole){lrole=role;iam.querySelectorAll('[data-i]').forEach(function(e){e.classList.toggle('on',+e.dataset.i===role)})}}
    function lask(){if(!lraf)lraf=requestAnimationFrame(lframe)}
    lt.forEach(function(t,i){t.addEventListener('click',function(){if(pinned())lgo(lstep(i===0?0:i===1?1:roles+1))})});
    if(iam)iam.querySelectorAll('.pick').forEach(function(b){b.addEventListener('click',function(){if(pinned())lgo(lstep(1+ +b.dataset.i))})});
    window.addEventListener('scroll',lask,{passive:true});window.addEventListener('resize',lask);lask();
  }
  /* career section: one role per scroll step; falls back to a timer when not pinned */
  var ar=document.querySelector('.hl-ar-run');
  if(ar){
    var ast=ar.querySelector('.hl-ar-st'),aiam=ar.querySelector('.iam'),apicks=[].slice.call(aiam.querySelectorAll('.pick')),an=apicks.length,acur=-1,araf=0,atm=0;
    function ago(i){if(i===acur)return;acur=i;aiam.querySelectorAll('[data-i]').forEach(function(e){e.classList.toggle('on',+e.dataset.i===i)})}
    function aframe(){araf=0;if(!pinned()){if(!atm&&!matchMedia('(prefers-reduced-motion:reduce)').matches)atm=setInterval(function(){ago((acur+1)%an)},1800);return}
      if(atm){clearInterval(atm);atm=0}
      ago(Math.min(an-1,Math.floor(clamp(-ar.getBoundingClientRect().top/Math.max(1,ar.offsetHeight-ast.offsetHeight))*an)))}
    function aask(){if(!araf)araf=requestAnimationFrame(aframe)}
    apicks.forEach(function(b,i){b.addEventListener('click',function(){if(pinned())window.scrollTo({top:window.scrollY+ar.getBoundingClientRect().top+(i+.5)/an*Math.max(1,ar.offsetHeight-ast.offsetHeight),behavior:'smooth'})})});
    window.addEventListener('scroll',aask,{passive:true});window.addEventListener('resize',aask);ago(0);aask();
  }
  /* competitions: pinned, names appear one by one as you scroll */
  var wn=document.querySelector('.hl-wn');
  if(wn){
    var cws=[].slice.call(wn.querySelectorAll('.cw')),wbtn=wn.querySelector('.btn'),wc=-2,wraf=0;
    function wframe(){wraf=0;
      var on=pinned()&&!matchMedia('(prefers-reduced-motion:reduce)').matches;
      wn.classList.toggle('hl-anim',on);
      if(!on)return;
      var R=Math.max(1,wn.offsetHeight-2*innerHeight),p=clamp(-(wn.getBoundingClientRect().top+innerHeight)/R),k=Math.floor(p*(cws.length+1));
      if(k===wc)return;wc=k;
      cws.forEach(function(e,i){e.classList.toggle('in',i<k)});
      if(wbtn)wbtn.classList.toggle('in',k>=cws.length)}
    function wask(){if(!wraf)wraf=requestAnimationFrame(wframe)}
    window.addEventListener('scroll',wask,{passive:true});window.addEventListener('resize',function(){wc=-2;wask()});wask();
  }
  /* one fixed photo layer behind competitions + footer: shows the work photo, then blurs across to the footer photo */
  var bg=document.querySelector('.hl-bg'),bwn=document.querySelector('.hl-wn'),bft=document.querySelector('footer.hf'),braf=0;
  if(bg&&bwn&&bft){
    var b1=bg.querySelector('.b1'),b2=bg.querySelector('.b2'),sm=function(t){return t*t*(3-2*t)};
    function bframe(){braf=0;
      var vh=innerHeight,show=bwn.getBoundingClientRect().top<vh*.98&&bft.getBoundingClientRect().bottom>0;
      bg.style.visibility=show?'visible':'hidden';if(!show)return;
      var t=sm(clamp(1-(bft.getBoundingClientRect().top-vh*.15)/(vh*.85)));
      b1.style.opacity=(1-t).toFixed(3);b1.style.filter=t?'blur('+(t*18).toFixed(1)+'px)':'';
      b2.style.opacity=t.toFixed(3);b2.style.filter=t<1?'blur('+((1-t)*18).toFixed(1)+'px)':''}
    function bask(){if(!braf)braf=requestAnimationFrame(bframe)}
    window.addEventListener('scroll',bask,{passive:true});window.addEventListener('resize',bask);bask();
  }
})();
