/* Physics diagrams for the Summaries pages. Needs summary.js first. g = 10 m/s² throughout, as in class. */
(function(){
var S_=window.SW,W=S_.W,K=S_.K,R=S_.R,M=S_.M,PI=S_.PI,rad=S_.rad,n=S_.n,C=S_.C,S=S_.S,tx=S_.tx,ln=S_.ln,ci=S_.ci,rc=S_.rc,pa=S_.pa,ar=S_.ar,nice=S_.nice,G=S_.G,grid=S_.grid,cl=S_.cl,curve=S_.curve,pt=S_.pt,rng=S_.rng,g0=10,r1=S_.r1;
function dash(s){return s.replace('/>',' stroke-dasharray="5 4"/>')}

/* ---------- 01 Kinematics ---------- */
W.suvat={t:'SUVAT: v–t and x–t graphs',h:300,play:{k:'t',sp:1.2},c:[C('u','u: initial velocity (m/s)',-20,30,1,5),C('a','a: acceleration (m/s²)',-10,10,.5,3),C('t','t: time (s)',0,10,.1,4)],d:function(v){var u=+v.u,a=+v.a,t=+v.t,V=function(x){return u+a*x},X=function(x){return u*x+.5*a*x*x},vs=[],xs=[],i,r1_,r2_,g1,g2,s='',vt=V(t),st=X(t),pts;
 for(i=0;i<=20;i++){vs.push(V(i/2));xs.push(X(i/2))}r1_=rng(vs);r2_=rng(xs);
 g1=G(270,260,0,10,r1_[0],r1_[1],34);g2=G(270,260,0,10,r2_[0],r2_[1],34);
 s+=grid(g1,2,nice((r1_[1]-r1_[0])/4),1)+tx(34,14,'v (m/s) against t (s)','mu');
 pts=g1.X(0)+','+g1.Y(0)+' '+g1.X(0)+','+g1.Y(V(0))+' '+g1.X(t)+','+g1.Y(vt)+' '+g1.X(t)+','+g1.Y(0);
 s+='<polygon points="'+pts+'" class="sh"/>'+cl(g1,S_.curve(g1,V,0,10,'ln',40))+pt(g1,t,vt,5,R)+ln(g1.X(t),g1.Y(0),g1.X(t),g1.Y(vt),'rd');
 s+='<g transform="translate(290,0)">'+grid(g2,2,nice((r2_[1]-r2_[0])/4),1)+tx(34,14,'x (m) against t (s)','mu')+cl(g2,S_.curve(g2,X,0,10,'ln',120))+pt(g2,t,st,5,R)+'</g>';
 var tz=a!==0?-u/a:NaN;
 return{s:s,o:[['v = u + at',n(vt)+' m/s',1],['s = ut + ½at²',n(st)+' m',1],['Check: s = ½(u+v)t',n(.5*(u+vt)*t)+' m'],['Check: v² = u² + 2as',n(vt*vt)+' = '+n(u*u+2*a*st)],['Slope of v–t = a',n(a)+' m/s²'],['Time when v = 0',isFinite(tz)&&tz>0?n(tz)+' s':'never in range']],n:'Shaded area under the v–t line is the displacement s. The slope of the v–t line is a. The x–t curve is a parabola whose slope at any time is v.'}}};

W.freefall={t:'Free fall and vertical throw',h:320,play:{k:'t',sp:1},c:[C('u','u: throw upward (m/s)',0,40,1,20),C('h','h₀: start height (m)',0,80,1,0),C('t','t: time (s)',0,10,.1,1)],d:function(v){var u=+v.u,h0=+v.h,t0=+v.t,T=(u+Math.sqrt(u*u+2*g0*h0))/g0,t=Math.min(t0,T),y=h0+u*t-5*t*t,vv=u-g0*t,H=h0+u*u/(2*g0),top=Math.max(H,5)*1.12,s='',Y=function(m){return 290-m/top*260},i,g=G(300,290,0,10,0,top,34);
 s+=ln(40,290,40+60,290,'ax')+ln(70,30,70,290,'gr')+tx(70,18,'height (m)','mu','middle');
 for(i=0;i*5<=top;i++)s+=ln(66,Y(i*5),74,Y(i*5),'ax')+(i%2===0?tx(60,Y(i*5)+4,i*5,'mu','end'):'');
 for(i=0;i*.5<=t;i++){var yy=h0+u*i*.5-5*i*.5*i*.5;if(yy>=0)s+=ci(70,Y(yy),2.5,M)}
 s+=ci(70,Y(y),9,R)+ar(70,Y(y),70,Y(y)-Math.max(-60,Math.min(60,vv*2)),K,2)+tx(86,Y(y)+4,'v = '+n(vv),'rt');
 s+='<g transform="translate(260,0)">'+grid(g,2,nice(top/4),1)+tx(34,14,'height y (m) against t (s)','mu')+cl(g,curve(g,function(x){return x>T?NaN:h0+u*x-5*x*x},0,10,'ln',200))+pt(g,t,Math.max(y,0),5,R)+'</g>';
 return{s:s,o:[['Height y = h₀ + ut − 5t²',n(Math.max(y,0))+' m',1],['Velocity v = u − 10t',n(vv)+' m/s',1],['Time to the top u/g',n(u/g0)+' s'],['Maximum height',n(H)+' m'],['Total flight time',n(T)+' s'],['Impact speed',n(Math.abs(u-g0*T))+' m/s']],n:'Upward is positive, so a = −10 m/s². At the top v = 0. Dots mark each half second. With u = 0 and h₀ > 0 this is a plain drop.'}}};

/* ---------- 02 Newton ---------- */
W.fma={t:'F = ma and the free body diagram',h:260,c:[C('F','F: applied force (N)',0,100,1,40),C('m','m: mass (kg)',1,20,1,5),C('mu','μ: friction coefficient',0,.8,.05,.3)],d:function(v){var F=+v.F,m=+v.m,mu=+v.mu,Wt=m*g0,N=Wt,fmax=mu*N,mov=F>fmax,f=mov?fmax:F,net=mov?F-fmax:0,a=net/m,k=.5,cx=280,cy=135,s='',w=70+m*3,hh=44+m;
 s+=ln(60,cy+hh/2,500,cy+hh/2,'ax')+rc(cx-w/2,cy-hh/2,w,hh,'fl',6)+tx(cx,cy+4,m+' kg',null,'middle');
 s+=ar(cx,cy,cx,cy-N*k,K,2.4)+tx(cx+8,cy-N*k+4,'N = '+n(N),null)+ar(cx,cy,cx,cy+Wt*k,K,2.4)+tx(cx+8,cy+Wt*k,'W = mg = '+n(Wt),null);
 s+=ar(cx+w/2,cy,cx+w/2+F*k*1.4,cy,R,2.4)+tx(cx+w/2+F*k*1.4,cy-10,'F = '+n(F),'rt','end');
 if(f>0)s+=ar(cx-w/2,cy,cx-w/2-f*k*1.4,cy,K,2.4)+tx(cx-w/2-f*k*1.4,cy-10,(mov?'f (kinetic) = ':'f (static) = ')+n(f),null);
 return{s:s,o:[['Weight W = mg',n(Wt)+' N'],['Normal N',n(N)+' N'],['Friction',n(f)+' N ('+(mov?'kinetic μN':'static, matches F')+')'],['Net force ΣF',n(net)+' N',1],['Acceleration a = ΣF / m',n(a)+' m/s²',1],['State',mov?'accelerating':'at rest (in equilibrium)']],n:'Static friction rises to match F until it reaches the maximum μN. Beyond that the block accelerates with a = (F − μN) / m. Vertical forces cancel, so N = mg.'}}};

W.atwood={t:'Atwood machine',h:300,play:{k:'t',sp:.7},c:[C('m1','m₁ (kg)',1,10,1,3),C('m2','m₂ (kg)',1,10,1,5),C('t','t: time (s)',0,2,.05,0)],d:function(v){var m1=+v.m1,m2=+v.m2,t=+v.t,a=(m2-m1)*g0/(m1+m2),T=2*m1*m2*g0/(m1+m2),sm=.5*Math.abs(a)*t*t,smax=1.4,sd=Math.min(sm,smax),dir=m2>=m1?1:-1,s='',b1=26+m1*3,b2=26+m2*3,y1=130-dir*sd*60,y2=130+dir*sd*60;
 s+=ln(200,40,360,40,'ax')+'<circle cx="280" cy="62" r="22" class="fl" stroke="'+K+'" stroke-width="1.6"/>'+ci(280,62,3)+ln(258,62,258,y1-b1/2,'ln')+ln(302,62,302,y2-b2/2,'ln')+ln(150,270,410,270,'ax')
 +rc(258-b1/2,y1-b1/2,b1,b1,'fl',5)+tx(258,y1+4,'m₁',null,'middle')+rc(302-b2/2,y2-b2/2,b2,b2,'fl',5)+tx(302,y2+4,'m₂',null,'middle')
 +ar(258+b1/2+8,y1,258+b1/2+8,y1-T*1.6,R,2)+tx(258-b1/2-8,y1-30,'T = '+n(T,1),'rt','end')+ar(302-b2/2-8,y2,302-b2/2-8,y2-T*1.6,R,2)+ar(258,y1+b1/2,258,y1+b1/2+m1*g0*.5,K,2)+ar(302,y2+b2/2,302,y2+b2/2+m2*g0*.5,K,2);
 return{s:s,o:[['a = (m₂ − m₁)g / (m₁ + m₂)',n(Math.abs(a))+' m/s² '+(a===0?'(balanced)':a>0?'(m₂ down)':'(m₁ down)'),1],['T = 2m₁m₂g / (m₁ + m₂)',n(T)+' N',1],['Weights',n(m1*g0)+' N and '+n(m2*g0)+' N'],['Speed at t',n(Math.abs(a)*t)+' m/s'],['Distance',n(sm)+' m'+(sm>=smax?' (stopped at the floor in this picture)':'')]],n:'Same rope tension T on both masses. Heavier side: m₂g − T = m₂a. Lighter side: T − m₁g = m₁a. Add them to eliminate T. Grey arrows = tension, black = weight.'}}};

/* ---------- 03 Incline ---------- */
W.incline={t:'Block on an incline',h:330,c:[C('th','θ: slope angle (°)',0,80,1,30),C('m','m: mass (kg)',1,20,1,10),C('mu','μ: friction coefficient',0,1,.05,.25)],d:function(v){var th=+v.th,m=+v.m,mu=+v.mu,t=rad(th),Wt=m*g0,Wp=Wt*Math.sin(t),Wn=Wt*Math.cos(t),fmax=mu*Wn,mov=Wp>fmax+1e-9,f=mov?fmax:Wp,a=mov?Wp/m-fmax/m:0,thc=Math.atan(mu)*180/PI,s='',
 L=Math.min(400,260/Math.max(Math.sin(t),.01)),Ax=40,Ay=L*Math.sin(t)+80,u=[Math.cos(t),-Math.sin(t)],no=[-Math.sin(t),-Math.cos(t)],Bx=Ax+L*u[0],By=Ay+L*u[1],bs=46,sd=.55*L,cx=Ax+sd*u[0]+no[0]*bs/2,cy=Ay+sd*u[1]+no[1]*bs/2,k=.5;
 s+='<polygon points="'+Ax+','+Ay+' '+Bx+','+By+' '+Bx+','+Ay+'" class="fl"/>'+ln(Ax,Ay,Bx,By,'ln')+ln(Ax,Ay,Bx,Ay,'ax')
 +'<g transform="translate('+(Ax+sd*u[0])+','+(Ay+sd*u[1])+') rotate('+(-th)+')"><rect x="-30" y="-'+bs+'" width="60" height="'+bs+'" class="fl2" stroke="'+K+'" stroke-width="1.6"/></g>'
 +tx(Ax+34,Ay-6,'θ = '+th+'°','rt')
 +ar(cx,cy,cx,cy+Wt*k,K,2.4)+tx(cx+8,cy+Wt*k+12,'mg',null)
 +ar(cx,cy,cx-u[0]*Wp*k,cy-u[1]*Wp*k,M,1.8,1)+tx(cx-u[0]*Wp*k-8,cy-u[1]*Wp*k+4,'mg sinθ',null,'end')
 +ar(cx,cy,cx-no[0]*Wn*k,cy-no[1]*Wn*k,M,1.8,1)+tx(cx-no[0]*Wn*k+8,cy-no[1]*Wn*k+4,'mg cosθ',null)
 +ar(cx,cy,cx+no[0]*Wn*k,cy+no[1]*Wn*k,K,2.4)+tx(cx+no[0]*Wn*k-6,cy+no[1]*Wn*k-4,'N',null,'end')
 +(f>0?ar(cx,cy,cx+u[0]*f*k,cy+u[1]*f*k,R,2.4)+tx(cx+u[0]*f*k+6,cy+u[1]*f*k-6,'f','rt'):'');
 return{s:s,h:Math.round(Ay+105),o:[['Along slope  mg sinθ',n(Wp)+' N'],['Normal  N = mg cosθ',n(Wn)+' N'],['Friction',n(f)+' N ('+(mov?'kinetic μN':'static')+')'],['Acceleration down slope',mov?n(a)+' m/s²':'0 (stays put)',1],['a = g(sinθ − μ cosθ)',mov?n(10*(Math.sin(t)-mu*Math.cos(t)))+' m/s²':'only valid when sliding'],['Critical angle arctan μ',n(thc,1)+'°  ('+(th>thc?'slope is steeper, it slides':'slope is shallower, it holds')+')']],n:'Black solid = real forces: weight, normal, friction. Grey dashed = the two components of weight. The block slides only when tan θ > μ, i.e. θ is above the critical angle.'}}};

/* ---------- 04 Projectile and circular ---------- */
W.projectile={t:'Projectile motion',h:320,play:{k:'t',sp:1.2},c:[C('v0','v₀: launch speed (m/s)',5,50,1,25),C('th','θ: launch angle (°)',5,85,1,45),C('h0','h₀: launch height (m)',0,30,1,0),S('c','Compare with 90° − θ',[['0','off'],['1','on']],'0'),C('t','t: time (s)',0,11,.05,0)],d:function(v){var v0=+v.v0,th=+v.th,h0=+v.h0,cmp=v.c==='1',t0=+v.t,
 P=function(d){var r=rad(d),vx=v0*Math.cos(r),vy=v0*Math.sin(r),T=(vy+Math.sqrt(vy*vy+2*g0*h0))/g0;return{vx:vx,vy:vy,T:T,H:h0+vy*vy/(2*g0),R:vx*T}},A=P(th),B=P(90-th),Xm=Math.max(A.R,cmp?B.R:0)*1.08+1,Ym=Math.max(A.H,cmp?B.H:0)*1.15+1,p=34,w=560,h=320,sc=Math.min((w-2*p)/Xm,(h-2*p)/Ym),X=function(x){return p+x*sc},Y=function(y){return h-p-y*sc},s='',step=nice(Xm/6),i;
 s+=ln(p,Y(0),w-p,Y(0),'ax');for(i=0;i*step<=Xm;i++)s+=ln(X(i*step),Y(0),X(i*step),Y(0)+5,'ax')+tx(X(i*step),Y(0)+17,i*step,'mu','middle');
 var path=function(Q,d,cls){var r=rad(d),q='',j;for(j=0;j<=60;j++){var tt=Q.T*j/60;q+=(j?'L':'M')+X(Q.vx*tt).toFixed(1)+' '+Y(h0+Q.vy*tt-5*tt*tt).toFixed(1)}return'<path d="'+q+'" class="'+cls+'"'+(cls==='gr'?' stroke="'+M+'" stroke-width="2" stroke-dasharray="5 4"':'')+'/>'};
 if(cmp)s+=path(B,90-th,'gr');s+=path(A,th,'ln');
 var t=Math.min(t0,A.T),bx=A.vx*t,by=h0+A.vy*t-5*t*t;
 s+=ci(X(0),Y(h0),4,K)+ci(X(A.vx*A.vy/g0),Y(A.H),4,R)+tx(X(A.vx*A.vy/g0),Y(A.H)-9,'H = '+n(A.H,1)+' m','rt','middle')+ci(X(A.R),Y(0),4,K)+tx(X(A.R),Y(0)-9,'R = '+n(A.R,1)+' m',null,'middle')
  +ci(X(bx),Y(by),8,R)+ar(X(bx),Y(by),X(bx)+A.vx*2.2,Y(by),K,1.6)+ar(X(bx),Y(by),X(bx),Y(by)-(A.vy-g0*t)*2.2,K,1.6);
 var vend=Math.hypot(A.vx,A.vy-g0*A.T);
 return{s:s,o:[['Time of flight T',n(A.T)+' s',1],['Max height H',n(A.H)+' m',1],['Range R',n(A.R)+' m',1],['vₓ = v₀cosθ (constant)',n(A.vx)+' m/s'],['v_y at launch = v₀sinθ',n(A.vy)+' m/s'],['Landing speed',n(vend)+' m/s'],cmp?['Range at '+(90-th)+'°',n(B.R)+' m'+(h0===0?' (same as '+th+'°)':'')]:['Best angle (h₀ = 0)','45°']],n:'The two directions are independent: x moves at constant speed, y is free fall. With h₀ = 0, R = v₀² sin2θ / g, so θ and 90° − θ land at the same place and 45° goes farthest. Arrows at the ball show vₓ and v_y.'}}};

W.circ={t:'Uniform circular motion',h:320,play:{k:'ph',sp:90},c:[C('r','r: radius (m)',.5,5,.1,2),C('T','T: period (s)',.5,8,.1,2),C('m','m: mass (kg)',.5,10,.5,1),C('ph','position angle (°)',0,360,1,30)],d:function(v){var r=+v.r,T=+v.T,m=+v.m,ph=rad(+v.ph),w=2*PI/T,sp=w*r,ac=w*w*r,Fc=m*ac,px=48,cx=280,cy=160,x=cx+r*px*Math.cos(ph),y=cy-r*px*Math.sin(ph),vl=Math.min(80,sp*7),al=Math.min(80,ac*2),s='';
 s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+r1(r*px)+'" class="fl" stroke="'+K+'" stroke-width="1.5"/>'+ci(cx,cy,3,M)+dash(ln(cx,cy,x,y,'gr',M,1.2))+tx(cx+4,cy+14,'centre','mu');
 var tvx=-Math.sin(ph),tvy=-Math.cos(ph);
 s+=ar(x,y,x+tvx*vl,y+tvy*vl,K,2.4)+tx(x+tvx*vl+6,y+tvy*vl,'v',null)+ar(x,y,x+(cx-x)/Math.max(r*px,1)*al,y+(cy-y)/Math.max(r*px,1)*al,R,2.4)+tx(x+(cx-x)/Math.max(r*px,1)*al+6,y+(cy-y)/Math.max(r*px,1)*al-6,'F꜀, a꜀','rt')+ci(x,y,9,R);
 return{s:s,o:[['Frequency f = 1/T',n(1/T,3)+' Hz'],['ω = 2π/T',n(w,3)+' rad/s'],['v = ωr',n(sp,3)+' m/s'],['a꜀ = v²/r = ω²r',n(ac,3)+' m/s²',1],['F꜀ = m a꜀',n(Fc,3)+' N',1]],n:'Speed is constant but the direction keeps changing, so there is an acceleration, always pointing at the centre. v (black) is tangent to the circle; centripetal force (grey) points inward. Arrow lengths are capped for display.'}}};

/* ---------- 05 Work and energy ---------- */
W.work={t:'Work done by a force',h:260,c:[C('F','F: force (N)',1,100,1,40),C('th','θ: angle to the motion (°)',0,180,5,30),C('s','s: displacement (m)',1,20,1,5)],d:function(v){var F=+v.F,th=+v.th,s_=+v.s,t=rad(th),Wk=F*s_*Math.cos(t),x0=70,y0=170,sl=s_*21,fl=F*1.3,s='',fx=Math.cos(t)*fl,fy=Math.sin(t)*fl,cls=Math.abs(Wk)<1e-6?'zero (no work)':Wk>0?'positive':'negative';
 s+=ln(40,y0+22,520,y0+22,'ax')+rc(x0-26,y0-22,52,44,'fl',6)+dash(ln(x0,y0+22+14,x0+sl,y0+22+14,'ax'))+ar(x0,y0+36,x0+sl,y0+36,K,2)+tx(x0+sl/2,y0+54,'s = '+s_+' m','mu','middle')+ar(x0,y0,x0+fx,y0-fy,R,2.6)+tx(x0+fx+6,y0-fy-4,'F = '+F+' N','rt')
 +dash(ln(x0,y0,x0+fx,y0,'gr',M,1.4))+dash(ln(x0+fx,y0,x0+fx,y0-fy,'gr',M,1.4))+'<path d="M'+(x0+34)+' '+y0+' A34 34 0 0 0 '+(x0+34*Math.cos(t)).toFixed(1)+' '+(y0-34*Math.sin(t)).toFixed(1)+'" class="ln" stroke-width="1.2"/>'+tx(x0+40,y0-8,'θ = '+th+'°',null);
 return{s:s,o:[['W = F s cosθ',n(Wk)+' J',1],['Component along motion F cosθ',n(F*Math.cos(t))+' N'],['Component across motion F sinθ',n(F*Math.sin(t))+' N (does no work)'],['Sign of work',cls]],n:'Only the part of the force along the displacement does work. θ = 0° gives the maximum, θ = 90° gives zero, θ = 180° gives negative work (like friction).'}}};

var TR=function(x){return 5+4*Math.cos(.65*x)};
W.energy={t:'Energy on a track: KE + PE + heat',h:400,play:{k:'x',sp:1.1},c:[C('m','m: mass (kg)',1,10,1,2),C('v0','v₀ at the start (m/s)',0,8,.5,0),C('f','f: friction along the track (N)',0,30,1,0),C('x','position along the track (m)',0,10,.1,0)],d:function(v){var m=+v.m,v0=+v.v0,f=+v.f,x=+v.x,E0=.5*m*v0*v0+m*g0*TR(0),h=TR(x),PE=m*g0*h,i,len=0,s='',X=function(q){return 40+q*48},Y=function(q){return 230-q*18};
 for(i=0;i<200;i++){var xa=x*i/200,xb=x*(i+1)/200;len+=Math.hypot(xb-xa,TR(xb)-TR(xa))}
 var heat=f*len,KE=E0-PE-heat,can=KE>=-1e-9,ke=Math.max(KE,0),sp=Math.sqrt(2*ke/m),pth='';
 for(i=0;i<=100;i++)pth+=(i?'L':'M')+X(i/10).toFixed(1)+' '+Y(TR(i/10)).toFixed(1);
 s+=ln(30,Y(0),530,Y(0),'ax')+'<path d="'+pth+'" class="ln" stroke-width="3"/>'+ci(X(x),Y(h)-9,9,can?R:M)+tx(X(x),Y(h)-24,'h = '+n(h,1)+' m',null,'middle');
 var sc=300/Math.max(E0,1),bars=[['PE = mgh',PE,K],['KE = ½mv²',ke,R],['heat = f·d',heat,M],['total E₀',E0,K]];
 bars.forEach(function(b,j){var y=270+j*30;s+=tx(40,y+12,b[0],'mu')+rc(160,y,Math.max(0,Math.min(b[1],E0*1.02)*sc),18,'',3).replace('<rect','<rect fill="'+b[2]+'"')+tx(165+Math.min(b[1],E0*1.02)*sc,y+13,n(b[1],1)+' J',null)});
 return{s:s,o:[['Speed v',can?n(sp)+' m/s':'cannot reach here',1],['PE = mgh',n(PE,1)+' J'],['KE',can?n(ke,1)+' J':'—',1],['Heat lost f·d',n(heat,1)+' J  (d = '+n(len,1)+' m)'],['Total at the start E₀',n(E0,1)+' J']],n:can?'With f = 0 the total ½mv² + mgh never changes, so PE falls exactly as KE rises. With friction, f·d leaves as heat and the ball arrives with less energy. Try f = 15 and move to the far hill.':'Not enough energy: friction has already used it all before this point.'}}};

W.power={t:'Power and efficiency',h:210,c:[C('m','m: load (kg)',10,500,10,200),C('h','h: lift height (m)',1,30,1,10),C('t','t: time (s)',1,30,1,5),C('e','η: efficiency (%)',20,100,5,100)],d:function(v){var m=+v.m,h=+v.h,t=+v.t,e=+v.e/100,Wk=m*g0*h,Po=Wk/t,Pi=Po/e,sc=420/Math.max(Pi,1),s='';
 s+=tx(30,52,'P_in (electrical)',null)+rc(30,60,Pi*sc,26,'',4).replace('<rect','<rect fill="'+K+'"')+tx(36+Pi*sc,78,n(Pi/1000,2)+' kW',null)+tx(30,118,'P_out (useful)',null)+rc(30,126,Po*sc,26,'',4).replace('<rect','<rect fill="'+R+'"')+tx(36+Po*sc,144,n(Po/1000,2)+' kW',null);
 return{s:s,o:[['Work W = mgh',n(Wk)+' J'],['P = W/t',n(Po)+' W',1],['P = F·v with v = h/t',n(m*g0*(h/t))+' W'],['Input power P_in = P_out / η',n(Pi)+' W'],['Wasted power',n(Pi-Po)+' W']],n:'Power is the rate of doing work, in watts (J/s). A real machine has η < 100%, so it must draw more power than it delivers.'}}};

/* ---------- 06 Equilibrium and moments ---------- */
W.lami={t:"Lami's theorem: three forces in equilibrium",h:310,c:[C('F1','F₁ (N)',10,200,5,50),C('a1','α₁ (°)',60,170,5,120),C('a2','α₂ (°)',60,170,5,150)],d:function(v){var F1=+v.F1,a1=+v.a1,a2=+v.a2,a3=360-a1-a2,s='';
 if(a3<=0||a3>=180)return{s:tx(280,150,'α₃ = '+a3+'° must be between 0° and 180°','rt','middle','font-size:15px'),o:[['α₃ = 360° − α₁ − α₂',a3+'°',1]],n:'Each of the three angles must be less than 180° for the forces to balance.'};
 var k=F1/Math.sin(rad(a1)),F2=k*Math.sin(rad(a2)),F3=k*Math.sin(rad(a3)),mx=Math.max(F1,F2,F3),sc=105/mx,d1=90,d2=90+a3,d3=90+a3+a1,
 D=function(d){return[Math.cos(rad(d)),-Math.sin(rad(d))]},cx=215,cy=165,P=[[F1,d1,'F₁'],[F2,d2,'F₂'],[F3,d3,'F₃']],sx=0,sy=0;
 P.forEach(function(p){var u=D(p[1]);s+=ar(cx,cy,cx+u[0]*p[0]*sc,cy+u[1]*p[0]*sc,R,2.6)+tx(cx+u[0]*(p[0]*sc+10),cy+u[1]*(p[0]*sc+10)+(u[0]>.3||u[0]<-.3?4:u[1]*8+4),p[2]+' = '+n(p[0],1),'rt',u[0]>.3?'start':u[0]<-.3?'end':'middle');sx+=Math.cos(rad(p[1]))*p[0];sy+=Math.sin(rad(p[1]))*p[0]});
 s+=ci(cx,cy,4,K)+tx(280,300,'α₁ lies between F₂ and F₃ · α₂ between F₃ and F₁ · α₃ between F₁ and F₂','mu','middle');
 var x=390,y=250,scT=150/mx;s+=tx(430,28,'force triangle (head to tail)','mu','middle');
 P.forEach(function(p,i){var u=D(p[1]),x2=x+u[0]*p[0]*scT*(mx>0?1:1),y2=y+u[1]*p[0]*scT;s+=ar(x,y,x2,y2,i?K:R,2.2);x=x2;y=y2});
 return{s:s,o:[['α₃ = 360° − α₁ − α₂',a3+'°'],['F₁/sinα₁ (common ratio)',n(k,2)+' N'],['F₂ = k sinα₂',n(F2,2)+' N',1],['F₃ = k sinα₃',n(F3,2)+' N',1],['ΣFx , ΣFy',n(sx,3)+' , '+n(sy,3)]],n:"Lami's theorem needs exactly three concurrent coplanar forces in equilibrium. They close into a triangle, which is why the sine rule appears. Defaults match the worked example: F₂ = 28.9 N, F₃ = 57.7 N."}}};

W.moments={t:'Principle of moments (see-saw)',h:290,c:[C('F1','F₁ (N)',5,100,5,40),C('d1','d₁ from pivot (m)',.2,3,.1,.9),C('F2','F₂ (N)',5,100,5,60),C('d2','d₂ from pivot (m)',.2,3,.1,.6)],d:function(v){var F1=+v.F1,d1=+v.d1,F2=+v.F2,d2=+v.d2,M1=F1*d1,M2=F2*d2,net=M1-M2,tilt=Math.max(-16,Math.min(16,net/Math.max(M1,M2,1)*16)),px=70,cx=280,cy=200,s='',need=F1*d1/F2;
 s+='<polygon points="'+cx+','+cy+' '+(cx-24)+','+(cy+50)+' '+(cx+24)+','+(cy+50)+'" class="fl"/>'+ln(150,cy+50,410,cy+50,'ax')+'<g transform="rotate('+(-tilt).toFixed(2)+' '+cx+' '+cy+')">'+rc(cx-3*px,cy-8,6*px,8,'',2).replace('<rect','<rect fill="'+K+'"')
 +ci(cx,cy,4,'#fff',1)+ar(cx-d1*px,cy-70,cx-d1*px,cy-8,R,2.6)+tx(cx-d1*px,cy-78,'F₁ = '+F1,'rt','middle')+ar(cx+d2*px,cy-70,cx+d2*px,cy-8,K,2.6)+tx(cx+d2*px,cy-78,'F₂ = '+F2,null,'middle')
 +dash(ln(cx-d1*px,cy+6,cx,cy+6,'gr',M,1.2))+dash(ln(cx,cy+6,cx+d2*px,cy+6,'gr',M,1.2))+tx(cx-d1*px/2,cy+22,'d₁','mu','middle')+tx(cx+d2*px/2,cy+22,'d₂','mu','middle')+'</g>';
 return{s:s,o:[['Left moment F₁d₁',n(M1)+' N·m',1],['Right moment F₂d₂',n(M2)+' N·m',1],['Difference',n(Math.abs(net),2)+' N·m',0],['Result',Math.abs(net)<1e-6?'balanced':net>0?'left side goes down':'right side goes down'],['d₂ needed to balance',need<=3?n(need,3)+' m':n(need,2)+' m (off the plank)']],n:'Weights are placed on a beam that is 6 m long and pivoted at the middle. Balance means the two turning effects are equal: F₁d₁ = F₂d₂, taken about the same pivot. (In class one side is called clockwise and the other anticlockwise.)'}}};

W.sign={t:'Hanging sign: cable tension and wall reaction',h:320,c:[C('W','W: sign weight (N)',50,500,10,200),C('L','L: bar length (m)',.5,4,.1,1.5),C('ph','φ: cable angle to bar (°)',15,75,1,40),C('s','weight position (fraction of L)',.1,1,.05,.5)],d:function(v){var Wt=+v.W,L=+v.L,ph=+v.ph,fr=+v.s,p=rad(ph),T=Wt*fr/Math.sin(p),Rx=T*Math.cos(p),Ry=Wt-T*Math.sin(p),Rm=Math.hypot(Rx,Ry),pxm=Math.min(110,170/(L*Math.tan(p)),360/L),x0=70,y0=225,bx=x0+L*pxm,wy=y0,wx=x0+fr*L*pxm,top=y0-L*pxm*Math.tan(p),mx=Math.max(Wt,T,Rm),k=75/mx,s='';
 s+=rc(x0-14,30,14,230,'fl',2)+rc(x0,y0-4,L*pxm,8,'',2).replace('<rect','<rect fill="'+K+'"')+ln(bx,y0,x0,top,'ln',M,2)+ci(x0,top,4,M)+ci(x0,y0,5,'#fff',1)
 +ar(wx,y0+5,wx,y0+5+Wt*k,K,2.6)+tx(wx+8,y0+5+Wt*k,'W = '+n(Wt),null)+ar(bx,y0,bx-Math.cos(p)*T*k,y0-Math.sin(p)*T*k,R,2.6)+tx(bx-Math.cos(p)*T*k+8,y0-Math.sin(p)*T*k-4,'T = '+n(T,1),'rt')
 +ar(x0,y0,x0+Rx*k,y0,K,2.2)+tx(x0+Rx*k+4,y0-6,'Rx',null)+ar(x0,y0,x0,y0-Ry*k,K,2.2)+tx(x0+6,y0-Ry*k-4,'Ry',null)+'<path d="M'+(bx-34)+' '+y0+' A34 34 0 0 0 '+(bx-34*Math.cos(p)).toFixed(1)+' '+(y0-34*Math.sin(p)).toFixed(1)+'" class="ln" stroke-width="1.2"/>'+tx(bx-62,y0-6,'φ',null);
 return{s:s,o:[['Cable tension T',n(T,1)+' N',1],['Wall Rx = T cosφ',n(Rx,1)+' N'],['Wall Ry = W − T sinφ',n(Ry,1)+' N'],['Wall reaction R',n(Rm,1)+' N'],['Check ΣFx',n(Rx-T*Math.cos(p),6)]],n:'Take moments about the wall pin so R drops out: T sinφ · L = W · (fraction · L), so T = W·fraction / sinφ. Then balance forces for Rx and Ry. Defaults reproduce the worked example: T = 155.6 N.'}}};

/* ---------- 07 Momentum and impulse ---------- */
W.impulse={t:'Impulse: same Δp, different contact time',h:270,c:[C('dp','Δp = change in momentum (kg·m/s)',1,50,1,10),C('dt','Δt: contact time (ms)',1,500,1,20),C('m','m: mass (kg)',.1,5,.1,.5)],d:function(v){var dp=+v.dp,dt=+v.dt,m=+v.m,F=dp/(dt/1000),hp=Math.min(210,200*dp/dt*1),w=dt*.9,s='',off=200*dp/dt>210;
 s+=ln(60,250,520,250,'ax')+ln(60,250,60,30,'ax')+tx(66,26,'F (N)','mu')+tx(516,244,'t (ms)','mu','end')+rc(60,250-hp,w,hp,'sh').replace('<rect','<rect stroke="'+R+'" stroke-width="2"')+tx(60+w+8,250-hp/2,'area = J = Δp','rt')+tx(60+w+8,250-hp+10,'F̄ = '+n(F,0)+' N',null)+tx(60+w/2,266,Math.round(dt)+' ms','mu','middle')+(off?tx(300,60,'(height cut off: force is very large)','mu','middle'):'');
 return{s:s,o:[['Impulse J = F̄Δt = Δp',n(dp)+' N·s',1],['Average force F̄ = Δp/Δt',n(F,1)+' N',1],['Speed change Δv = J/m',n(dp/m,2)+' m/s'],['Force if Δt is doubled',n(F/2,1)+' N']],n:'The area of the rectangle is the impulse and stays fixed. Stretching the contact time shrinks the force. This is why an airbag or a follow-through works.'}}};

W.collide={t:'Collisions in one dimension',h:340,c:[C('m1','m₁ (kg)',1,10,1,6),C('u1','u₁ (m/s)',-10,10,1,4),C('m2','m₂ (kg)',1,10,1,2),C('u2','u₂ (m/s)',-10,10,1,0),C('e','e: bounciness (0 sticks, 1 elastic)',0,1,.05,1)],d:function(v){var m1=+v.m1,u1=+v.u1,m2=+v.m2,u2=+v.u2,e=+v.e,Mt=m1+m2,hit=u1>u2,v1=hit?(m1*u1+m2*u2+m2*e*(u2-u1))/Mt:u1,v2=hit?(m1*u1+m2*u2+m1*e*(u1-u2))/Mt:u2,pb=m1*u1+m2*u2,pa_=m1*v1+m2*v2,kb=.5*m1*u1*u1+.5*m2*u2*u2,ka=.5*m1*v1*v1+.5*m2*v2*v2,s='',
 lane=function(y,a,b,va,vb,lbl){var w1=24+m1*6,w2=24+m2*6,h1=w1*.7,h2=w2*.7,c1=y+22-h1/2,c2=y+22-h2/2;return tx(20,y-30,lbl,'mu')+ln(30,y+22,540,y+22,'ax')+rc(150-w1/2,y+22-h1,w1,h1,'fl',4).replace('class="fl"','class="fl" stroke="'+R+'" stroke-width="1.6"')+tx(150,c1+4,'m₁',null,'middle')+rc(390-w2/2,y+22-h2,w2,h2,'fl',4)+tx(390,c2+4,'m₂',null,'middle')+ar(150,y-34,150+va*10,y-34,R,2.4)+tx(150+va*10+(va>=0?8:-8),y-30,n(va,2)+' m/s','rt',va>=0?'start':'end')+ar(390,y-34,390+vb*10,y-34,K,2.4)+tx(390+vb*10+(vb>=0?8:-8),y-30,n(vb,2)+' m/s',null,vb>=0?'start':'end')},mk=Math.max(pb,pa_,1,kb,ka);
 s+=lane(70,0,0,u1,u2,'BEFORE')+lane(170,0,0,v1,v2,'AFTER');
 var sc=200/Math.max(kb,Math.abs(pb),1);
 [['p',Math.abs(pb),Math.abs(pa_)],['KE',kb,ka]].forEach(function(r,j){var y=225+j*52,q=200/Math.max(r[1],r[2],1);s+=tx(40,y+13,r[0]==='p'?'|p|':'KE','mu')+rc(80,y,r[1]*q,16,'').replace('<rect','<rect fill="'+M+'"')+tx(84+r[1]*q,y+12,'before '+n(r[1],1),null)+rc(80,y+20,r[2]*q,16,'').replace('<rect','<rect fill="'+(r[0]==='p'?K:R)+'"')+tx(84+r[2]*q,y+32,'after '+n(r[2],1),null)});
 return{s:s,o:[['v₁ after',n(v1,3)+' m/s',1],['v₂ after',n(v2,3)+' m/s',1],['Momentum before → after',n(pb,2)+' → '+n(pa_,2)+' kg·m/s'],['KE before → after',n(kb,2)+' → '+n(ka,2)+' J'],['KE lost',n(kb-ka,2)+' J',e<1?1:0],['Type',!hit?'no collision (1 is not catching 2)':e===1?'elastic':e===0?'perfectly inelastic (stick)':'inelastic']],n:'Momentum m₁u₁ + m₂u₂ is the same before and after every isolated collision. Kinetic energy is kept only when e = 1. Try m₁ = m₂ (velocities swap), m₁ ≫ m₂ and m₁ ≪ m₂, and e = 0 to stick together. Object 1 must be faster than object 2 to hit it.'}}};
})();
