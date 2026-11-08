/* Math diagrams for the Summaries pages. Needs summary.js first. */
(function(){
var S_=window.SW,W=S_.W,K=S_.K,R=S_.R,M=S_.M,PI=S_.PI,rad=S_.rad,r1=S_.r1,n=S_.n,C=S_.C,S=S_.S,tx=S_.tx,ln=S_.ln,ci=S_.ci,rc=S_.rc,pa=S_.pa,ar=S_.ar,nice=S_.nice,G=S_.G,grid=S_.grid,cl=S_.cl,curve=S_.curve,pcurve=S_.pcurve,pt=S_.pt,lab=S_.lab,rng=S_.rng,shift=S_.shift,surd=S_.surd,sq=S_.sq,wrapS=S_.wrapS;
/* ---------- MATH: Sets & logic ---------- */
W.powerset={t:'Power set builder',c:[C('n','n(A): elements in A',0,6,1,3)],d:function(v){var m=+v.n,N=1<<m,L='abcdef'.slice(0,m).split(''),s='',i,j,e,cw=66,ch=30,cols=8,rows=Math.ceil(N/cols);
 s+=tx(10,22,'A = {'+(L.join(', ')||' ')+'}',null,null,'font-size:14px')+tx(550,22,'𝒫(A) has '+N+' subsets','mu','end');
 for(i=0;i<N;i++){e=[];for(j=0;j<m;j++)if(i>>j&1)e.push(L[j]);s+=rc(10+(i%cols)*cw,36+Math.floor(i/cols)*ch,60,24,i===0||i===N-1?'fl2':'fl',5)+tx(40+(i%cols)*cw,52+Math.floor(i/cols)*ch,e.length?'{'+e.join(',')+'}':'∅',null,'middle')}
 return{s:s,h:36+rows*ch+8,o:[['All subsets 2ⁿ',N,1],['Proper subsets 2ⁿ − 1',N-1],['Non-empty proper 2ⁿ − 2',Math.max(N-2,0)]],n:'Bold outlined cells are ∅ and A itself. ∅ is a subset of every set; A is a subset of itself but not a proper subset.'}}};

W.venn2={t:'Two-set Venn diagram',h:300,c:[C('u','n(U)',5,60,1,30),C('a','n(A)',0,40,1,18),C('b','n(B)',0,40,1,14),C('ab','n(A ∩ B)',0,40,1,6)],d:function(v){var a=+v.a,b=+v.b,ab=Math.min(+v.ab,a,b),un=a+b-ab,u=Math.max(+v.u,un),s='';
 s+=rc(20,20,520,260,'fl',8)+tx(34,40,'U = '+u,'mu')+'<circle cx="220" cy="150" r="90" class="fl2" stroke="'+K+'" stroke-width="1.6"/><circle cx="340" cy="150" r="90" class="fl2" stroke="'+K+'" stroke-width="1.6"/>'
 +tx(150,62,'A',null,'middle','font-size:15px')+tx(410,62,'B',null,'middle','font-size:15px')+tx(165,156,a-ab,null,'middle','font-size:16px')+tx(280,156,ab,null,'middle','font-size:16px')+tx(395,156,b-ab,null,'middle','font-size:16px')+tx(60,262,'neither: '+(u-un),'mu');
 return{s:s,o:[['n(A ∪ B)',un,1],['Only A',a-ab],['Only B',b-ab],['Outside both',u-un],['n(A′)',u-a],['n(A × B)',a*b]],n:'n(A ∪ B) = n(A) + n(B) − n(A ∩ B), because the overlap is counted once. n(A′) = n(U) − n(A). n(A ∩ B) cannot exceed either set, and U grows if the union does.'}}};

W.venn3={t:'Three-set inclusion–exclusion',h:320,c:[C('u','n(U)',10,100,1,60),C('a','n(A)',0,50,1,35),C('b','n(B)',0,50,1,28),C('c','n(C)',0,50,1,20),C('ab','n(A∩B)',0,30,1,15),C('bc','n(B∩C)',0,30,1,10),C('ac','n(A∩C)',0,30,1,8),C('abc','n(A∩B∩C)',0,20,1,5)],d:function(v){var a=+v.a,b=+v.b,c=+v.c,ab=+v.ab,bc=+v.bc,ac=+v.ac,t=Math.min(+v.abc,ab,bc,ac),un=a+b+c-ab-bc-ac+t,u=Math.max(+v.u,un),
 R=[a-ab-ac+t,b-ab-bc+t,c-ac-bc+t,ab-t,bc-t,ac-t,t],bad=R.some(function(z){return z<0}),P=[[170,105],[370,105],[270,255],[270,90],[318,190],[222,190],[270,150]],s='';
 s+=rc(20,12,520,296,'fl',8)+tx(34,30,'U = '+u,'mu')+'<circle cx="210" cy="125" r="82" class="fl2" stroke="'+K+'" stroke-width="1.6"/><circle cx="330" cy="125" r="82" class="fl2" stroke="'+K+'" stroke-width="1.6"/><circle cx="270" cy="205" r="82" class="fl2" stroke="'+K+'" stroke-width="1.6"/>'
 +tx(120,52,'A',null,'middle','font-size:15px')+tx(420,52,'B',null,'middle','font-size:15px')+tx(270,300,'C',null,'middle','font-size:15px');
 R.forEach(function(z,i){s+=tx(P[i][0],P[i][1],z,z<0?'rt':null,'middle','font-size:15px')});s+=tx(34,296,'none: '+(u-un),'mu');
 return{s:s,o:[['n(A∪B∪C)',un,1],['Outside all three',u-un],['Only A / B / C',R[0]+' / '+R[1]+' / '+R[2]],['Pairs only (AB, BC, AC)',R[3]+' / '+R[4]+' / '+R[5]]],n:bad?'Some region is negative, so these numbers cannot come from a real group. Raise a set or lower an overlap.':'n(A∪B∪C) = n(A)+n(B)+n(C) − n(A∩B) − n(B∩C) − n(A∩C) + n(A∩B∩C). Defaults are the class example: 60 students, 35 football, 28 basketball, 20 swimming.'}}};

var TX=[['¬p',function(p){return!p}],['p ∧ q',function(p,q){return p&&q}],['p ∨ q',function(p,q){return p||q}],['p → q',function(p,q){return!p||q}],['p ↔ q',function(p,q){return p===q}],['¬p → q',function(p,q){return p||q}],['p ∨ ¬p',function(){return true}],['p ∧ ¬p',function(){return false}],['[p ∧ (p → q)] → q  (Modus Ponens)',function(p,q){return!(p&&(!p||q))||q}],['(p → q) ↔ (¬q → ¬p)  (contrapositive)',function(p,q){return(!p||q)===(q||!p)}],['¬(p ∧ q) ↔ (¬p ∨ ¬q)  (De Morgan)',function(p,q){return(!(p&&q))===(!p||!q)}],['(p → q) ↔ (q → p)  (converse)',function(p,q){return(!p||q)===(!q||p)}]];
W.truth={t:'Truth table builder',hint:'',c:[(function(){var c=S('e','Expression',TX.map(function(x,i){return[i,x[0]]}),3);c.slot=1;return c})()],d:function(v){
 var e=TX[+v.e],rows=[[1,1],[1,0],[0,1],[0,0]],tr=0,h='<div class="hn">choose the expression in the table header</div><div class="tbx"><table><thead><tr><th>p</th><th>q</th><th data-slot="e"></th></tr></thead><tbody>';
 rows.forEach(function(r){var val=e[1](!!r[0],!!r[1]);tr+=val?1:0;h+='<tr><td'+(r[0]?'':' class="f"')+'>'+(r[0]?'T':'F')+'</td><td'+(r[1]?'':' class="f"')+'>'+(r[1]?'T':'F')+'</td><td'+(val?'':' class="f"')+'>'+(val?'T':'F')+'</td></tr>'});
 h+='</tbody></table></div>';
 return{html:h,o:[['Rows true',tr+' of 4'],['Type',tr===4?'Tautology':tr===0?'Contradiction':'Contingency',1]],n:'Each row is one combination of T and F for p and q; the last column is the chosen expression. All T is a tautology, all F is a contradiction, a mix is a contingency. Try p → q: it is false only when p = T and q = F.'}}};

/* ---------- MATH: real numbers ---------- */
W.numline={t:'Interval notation on the number line',h:170,c:[C('a','a',-9,9,1,-3),C('b','b',-9,9,1,5),S('l','Left end',[['o','open ( a'],['c','closed [ a'],['i','−∞']],'c'),S('r','Right end',[['o','open b )'],['c','closed b ]'],['i','+∞']],'o')],d:function(v){var a=+v.a,b=+v.b,l=v.l,r=v.r,s='',X=function(x){return 30+(x+10)*25},i,lo,hi,txt,ineq,kind;
 if(l!=='i'&&r!=='i'&&a>b){var t=a;a=b;b=t}
 s+=ln(20,100,540,100,'ax');for(i=-10;i<=10;i++)s+=ln(X(i),95,X(i),105,'ax')+(i%2===0?tx(X(i),122,n(i),'mu','middle'):'');
 lo=l==='i'?-10.4:a;hi=r==='i'?10.4:b;
 if(hi>=lo)s+=ln(X(lo),100,X(hi),100,'ln',K,6);
 if(l==='i')s+=ar(X(-9.6),100,X(-10.4),100,K,3);if(r==='i')s+=ar(X(9.6),100,X(10.4),100,K,3);
 if(l!=='i')s+='<circle cx="'+X(a)+'" cy="100" r="6" fill="'+(l==='c'?K:'#fff')+'" stroke="'+K+'" stroke-width="2"/>'+tx(X(a),80,a,null,'middle');
 if(r!=='i')s+='<circle cx="'+X(b)+'" cy="100" r="6" fill="'+(r==='c'?K:'#fff')+'" stroke="'+K+'" stroke-width="2"/>'+tx(X(b),80,b,null,'middle');
 txt=(l==='c'?'[':'(')+(l==='i'?'−∞':n(a))+', '+(r==='i'?'∞':n(b))+(r==='c'?']':')');
 ineq=l==='i'&&r==='i'?'x ∈ ℝ':l==='i'?'x '+(r==='c'?'≤ ':'< ')+n(b):r==='i'?'x '+(l==='c'?'≥ ':'> ')+n(a):n(a)+(l==='c'?' ≤ ':' < ')+'x'+(r==='c'?' ≤ ':' < ')+n(b);
 kind=l==='i'&&r==='i'?'Whole real line':l==='i'||r==='i'?'Unbounded':l==='c'&&r==='c'?'Closed':l==='o'&&r==='o'?'Open':'Half-open';
 if(l!=='i'&&r!=='i'&&a===b){txt=l==='c'&&r==='c'?'{'+n(a)+'}':'∅';ineq=l==='c'&&r==='c'?'x = '+n(a):'no x';kind='Degenerate'}
 return{s:s,o:[['Interval notation',txt,1],['Inequality',ineq],['Type',kind]],n:'Round bracket = endpoint excluded (open circle). Square bracket = endpoint included (filled circle). ∞ always takes a round bracket.'}}};

W.abs={t:'Absolute value equations and inequalities',h:320,c:[C('a','a',1,4,.5,2),C('b','b',-6,6,1,-3),C('k','k',-2,10,1,7),S('o','Relation |ax + b| … k',[['=','='],['<','<'],['>','>']],'=')],d:function(v){var a=+v.a,b=+v.b,k=+v.k,o=v.o,g=G(560,320,-10,10,-2,14,32),x1=(k-b)/a,x2=(-k-b)/a,lo=Math.min(x1,x2),hi=Math.max(x1,x2),s=grid(g,2,2),res,seg='';
 s+=cl(g,curve(g,function(x){return Math.abs(a*x+b)},-10,10,'ln')+ln(g.X(-10),g.Y(k),g.X(10),g.Y(k),'rd',null,2));
 if(o==='='){res=k<0?'no solution (∅)':k===0?'x = '+n(-b/a):'x = '+n(lo)+' or x = '+n(hi);if(k>=0){[lo,hi].forEach(function(x){s+=ln(g.X(x),g.Y(k),g.X(x),g.Y(0),'rd')+pt(g,x,0,5,R)})}}
 else if(o==='<'){res=k<=0?'no solution (∅)':'('+n(lo)+', '+n(hi)+')   i.e.  '+n(lo)+' < x < '+n(hi);if(k>0)seg=ln(g.X(lo),g.Y(0),g.X(hi),g.Y(0),'rd',R,7)}
 else{res=k<0?'all real numbers  (−∞, ∞)':k===0?'x ≠ '+n(-b/a):'(−∞, '+n(lo)+') ∪ ('+n(hi)+', ∞)';if(k<0)seg=ln(g.X(-10),g.Y(0),g.X(10),g.Y(0),'rd',R,7);else seg=ln(g.X(-10),g.Y(0),g.X(lo),g.Y(0),'rd',R,7)+ln(g.X(hi),g.Y(0),g.X(10),g.Y(0),'rd',R,7)}
 s+=cl(g,seg)+tx(g.X(8.6),g.Y(k)-6,'y = '+n(k),'rt','middle')+tx(g.X(-9.6),g.Y(13),'y = |'+n(a)+'x'+(b<0?' − '+n(-b):' + '+n(b))+'|',null);
 return{s:s,o:[['Solution set',res,1],['Boundary points',k>=0?n(lo)+' , '+n(hi):'none']],n:'Solve |expression| = k by splitting into expression = k and expression = −k. If k < 0 the equation has no solution; the graph never reaches the grey line.'}}};

W.surd={t:'Surds: simplify √n',h:150,c:[C('n','n',2,200,1,72)],d:function(v){var m=+v.n,p=surd(m),perfect=Math.sqrt(m)%1===0,r=perfect?n(Math.sqrt(m)):(p[0]>1?p[0]:'')+'√'+p[1];
 return{s:tx(280,58,'√'+m+' = '+r,null,'middle','font-size:30px')+tx(280,98,m+' = '+(p[0]*p[0])+' × '+p[1]+'   (largest square factor × remainder)','mu','middle')+tx(280,124,'≈ '+n(Math.sqrt(m),4),'mu','middle'),o:[['Simplified form',r,1],['Is it a surd?',perfect?'No, rational (perfect square)':p[0]>1?'Yes, reduced to '+r:'Yes, already simplest'],['Decimal',n(Math.sqrt(m),6)]],n:'Product rule: √(ab) = √a·√b. Pull out the biggest perfect square factor.'}}};

W.ratz={t:'Rationalising the denominator',h:200,c:[C('a','numerator a',1,9,1,3),C('p','p',1,9,1,2),C('q','q (under the root)',2,30,1,5),S('s','Denominator',[['-','p − √q'],['+','p + √q']],'-')],d:function(v){var a=+v.a,p=+v.p,q=+v.q,sg=v.s==='-'?-1:1,D=p*p-q,den='('+p+(sg<0?' − ':' + ')+'√'+q+')',cj='('+p+(sg<0?' + ':' − ')+'√'+q+')',s='',res,dec,chk=a/(p+sg*Math.sqrt(q));
 s+=tx(20,36,a+' / '+den.replace('(','').replace(')',''),null,null,'font-size:20px')+tx(20,70,'× '+cj+' / '+cj,null,null,'font-size:16px');
 if(D===0){res='undefined (p² = q makes the denominator 0)';dec='—';s+=tx(20,110,'p² − q = 0, so the denominator is zero.','rt')}
 else{var cs=-sg*a;res='('+a*p+(cs<0?' − '+(-cs):' + '+cs)+'√'+q+') / '+n(D);dec=n((a*p+cs*Math.sqrt(q))/D,5);s+=tx(20,110,'= '+a+cj+' / ('+p+'² − '+q+')  =  '+a+cj+' / '+n(D),null,null,'font-size:16px')+tx(20,150,'= '+res,null,null,'font-size:18px')}
 return{s:s,o:[['Result',res,1],['Check: result',dec],['Check: original',n(chk,5)]],n:'Multiply top and bottom by the conjugate. (p + √q)(p − √q) = p² − q has no root left in it.'}}};

var NS=[['−7','−7',['ℤ','ℚ','ℝ'],'Z'],['0','0',['ℕ','ℤ','ℚ','ℝ'],'N'],['5','5',['ℕ','ℤ','ℚ','ℝ'],'N'],['−1.5','−1.5 = −3/2',['ℚ','ℝ'],'Q'],['2/3','2/3',['ℚ','ℝ'],'Q'],['0.333…','0.333… = 1/3 (repeating)',['ℚ','ℝ'],'Q'],['22/7','22/7',['ℚ','ℝ'],'Q'],['√9','√9 = 3',['ℕ','ℤ','ℚ','ℝ'],'N'],['√2','√2',['𝕀','ℝ'],'I'],['π','π',['𝕀','ℝ'],'I'],['e','e',['𝕀','ℝ'],'I'],['√−1','√(−1)',[],'X']];
W.classify={t:'Which number sets does it belong to?',h:430,hint:'',c:[{k:'x',l:'Number',min:0,max:NS.length-1,step:1,v:1,fmt:function(i){return NS[+i][1]}}],d:function(v){
 var z=NS[+v.x],mem=z[2],has=function(k){return mem.indexOf(k)>=0},s='',cx=215,
 R_=[['ℝ',190,210],['ℚ',150,250],['ℤ',108,292],['ℕ',64,336]],
 P={N:[cx,378],Z:[cx+86,332],Q:[cx+128,302],I:[cx+100,102]},
 lb=function(y,t,k){return tx(cx,y,t,has(k)?null:'mu','middle','font-size:13px'+(has(k)?';font-weight:700':''))};
 R_.forEach(function(q){s+='<circle cx="'+cx+'" cy="'+q[2]+'" r="'+q[1]+'" fill="none" stroke="'+(has(q[0])?K:M)+'" stroke-width="'+(has(q[0])?2.4:1)+'"/>'});
 s+=lb(54,'Real numbers','ℝ')+tx(cx,74,'plus irrational numbers',has('𝕀')?null:'mu','middle','font-size:11px'+(has('𝕀')?';font-weight:700':''))+lb(130,'Rational numbers','ℚ')+lb(214,'Integers','ℤ')+lb(302,'Natural','ℕ');
 if(z[3]!=='X'){var p=P[z[3]];s+=ci(p[0],p[1],7,K,1)}
 s+=tx(450,196,'selected number','mu',null,'font-size:11px')+tx(450,226,z[0],null,null,'font-size:26px;font-weight:700')+(z[3]==='X'?tx(450,250,'outside ℝ: not a real number','mu',null,'font-size:11px'):'');
 return{s:s,o:[['Belongs to',mem.length?mem.map(function(k){return{'ℕ':'natural','ℤ':'integer','ℚ':'rational','𝕀':'irrational','ℝ':'real'}[k]}).join(', '):'none: not a real number',1],['Why',z[3]==='X'?'a negative number has no real square root':z[3]==='I'?'infinite, non-repeating decimal':z[3]==='Q'?'can be written p/q':'whole number']],n:'ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ. 𝕀 is the rest of ℝ: ℚ ∪ 𝕀 = ℝ and ℚ ∩ 𝕀 = ∅. A repeating decimal is always rational. Move the slider to try each number; the sets it belongs to are drawn with a heavier outline.'}}};

/* ---------- MATH: analytic geometry ---------- */
W.quad={t:'Cartesian plane and quadrants',h:320,c:[C('x','x',-9,9,1,3),C('y','y',-6,6,1,5)],d:function(v){var x=+v.x,y=+v.y,g=G(560,320,-12,12,-7,7,26),q=x===0||y===0?(x===0&&y===0?'origin':'on an axis'):x>0&&y>0?'Quadrant I (+, +)':x<0&&y>0?'Quadrant II (−, +)':x<0&&y<0?'Quadrant III (−, −)':'Quadrant IV (+, −)',s=grid(g,2,2);
 s+=tx(g.X(10),g.Y(6),'I','mu','middle','font-size:14px')+tx(g.X(-10),g.Y(6),'II','mu','middle','font-size:14px')+tx(g.X(-10),g.Y(-6),'III','mu','middle','font-size:14px')+tx(g.X(10),g.Y(-6),'IV','mu','middle','font-size:14px')+ln(g.X(x),g.Y(0),g.X(x),g.Y(y),'rd')+ln(g.X(0),g.Y(y),g.X(x),g.Y(y),'rd')+pt(g,x,y,6,R)+lab(g,x,y,'('+x+', '+y+')','rt',8,-8);
 return{s:s,o:[['Point','('+x+', '+y+')'],['Location',q,1]],n:'Points on an axis belong to no quadrant. The signs of x and y decide the quadrant, counted anticlockwise from the upper right.'}}};

function lineEq(m,b){return'y = '+(m===0?n(b):(m===1?'':m===-1?'−':n(m))+'x'+(b===0?'':b>0?' + '+n(b):' − '+n(-b)))}
W.plane2={t:'Distance, midpoint and slope',h:340,c:[C('x1','x₁',-8,8,1,1),C('y1','y₁',-6,6,1,2),C('x2','x₂',-8,8,1,4),C('y2','y₂',-6,6,1,6)],d:function(v){var x1=+v.x1,y1=+v.y1,x2=+v.x2,y2=+v.y2,g=G(560,340,-15,15,-8.4,8.4,30),dx=x2-x1,dy=y2-y1,d2=dx*dx+dy*dy,mx=(x1+x2)/2,my=(y1+y2)/2,sg=x2>=x1?1:-1,m=dx===0?null:dy/dx,s=grid(g,2,2,2),eq;
 if(m===null)eq=d2===0?'same point':'x = '+n(x1);else eq=lineEq(m,y1-m*x1);
 if(d2>0){if(m===null)s+=cl(g,ln(g.X(x1),g.Y(g.y0),g.X(x1),g.Y(g.y1),'gr',M,1.5));else s+=cl(g,curve(g,function(x){return m*(x-x1)+y1},-15,15,'gr',4,M))}
 s+=ln(g.X(x1),g.Y(y1),g.X(x2),g.Y(y1),'rd',null,1.6).replace('/>',' stroke-dasharray="4 4"/>')+ln(g.X(x2),g.Y(y1),g.X(x2),g.Y(y2),'rd',null,1.6).replace('/>',' stroke-dasharray="4 4"/>')+ln(g.X(x1),g.Y(y1),g.X(x2),g.Y(y2),'ln')
  +pt(g,x1,y1,5,K)+pt(g,x2,y2,5,K)+pt(g,mx,my,5,R)+tx(g.X(x1)-8*sg,g.Y(y1)+4,'A('+x1+', '+y1+')',null,sg>0?'end':'start')+tx(g.X(x2)+8*sg,g.Y(y2)+(dy>=0?-6:14),'B('+x2+', '+y2+')',null,sg>0?'start':'end')+tx(g.X(mx)-12*sg,g.Y(my)+(dy>=0?-10:16),'M','rt','middle');
 if(d2>0&&dx!==0)s+=tx(g.X((x1+x2)/2),g.Y(y1)+(dy>0?18:-8),'Δx = '+dx,'mu','middle');if(d2>0&&dy!==0)s+=tx(g.X(x2)+8*sg,g.Y((y1+y2)/2)+4,'Δy = '+dy,'mu',sg>0?'start':'end');
 return{s:s,o:[['Distance AB = √(Δx²+Δy²)',sq(d2)+(Math.sqrt(d2)%1===0?'':'  ≈ '+n(Math.sqrt(d2),3)),1],['Midpoint M','('+n(mx)+', '+n(my)+')'],['Slope m = Δy/Δx',m===null?'undefined (vertical)':n(m)],['Line AB',eq]],n:'Distance is Pythagoras on the dashed right triangle. The midpoint averages the coordinates. Slope is rise over run.'}}};

W.lines={t:'Parallel and perpendicular lines',h:340,c:[C('m1','m₁ (grey)',-4,4,.25,1),C('b1','b₁',-6,6,.5,1),C('m2','m₂ (black)',-4,4,.25,-1),C('b2','b₂',-6,6,.5,-2)],d:function(v){var m1=+v.m1,b1=+v.b1,m2=+v.m2,b2=+v.b2,g=G(560,340,-15,15,-8.4,8.4,30),e=1e-9,rel,xi,s=grid(g,2,2,2);
 if(Math.abs(m1-m2)<e)rel=Math.abs(b1-b2)<e?'Same line (coincident)':'Parallel (m₁ = m₂, b₁ ≠ b₂)';else if(Math.abs(m1*m2+1)<1e-9)rel='Perpendicular (m₁ × m₂ = −1)';else rel='Intersecting, not at a right angle';
 s+=cl(g,curve(g,function(x){return m1*x+b1},-15,15,'rd',4)+curve(g,function(x){return m2*x+b2},-15,15,'ln',4));
 if(Math.abs(m1-m2)>=e){xi=(b2-b1)/(m1-m2);s+=pt(g,xi,m1*xi+b1,5,K,1)}
 return{s:s,o:[['Relationship',rel,1],['m₁ × m₂',n(m1*m2)],['Intersection',Math.abs(m1-m2)<e?'none / infinite':'('+n(xi)+', '+n(m1*xi+b1)+')'],['Grey / Black',lineEq(m1,b1)+'  /  '+lineEq(m2,b2)]],n:'Try m₁ = 2, m₂ = −0.5 for a right angle. A horizontal line (m = 0) is perpendicular to a vertical line even though the product rule cannot be applied.'}}};

W.ptline={t:'Distance from a point to a line',h:340,c:[C('A','A',-5,5,1,3),C('B','B',-5,5,1,4),C('C','C',-20,20,1,-10),C('x0','x₀',-8,8,1,3),C('y0','y₀',-6,6,1,4)],d:function(v){var A=+v.A,B=+v.B,Cc=+v.C,x0=+v.x0,y0=+v.y0,g=G(560,340,-15,15,-8.4,8.4,30),s=grid(g,2,2,2),D=A*A+B*B,num,d,t,fx,fy;
 if(D===0)return{s:s+tx(280,170,'A and B cannot both be 0','rt','middle','font-size:16px'),o:[['Line','not a line']],n:''};
 num=A*x0+B*y0+Cc;d=Math.abs(num)/Math.sqrt(D);t=num/D;fx=x0-A*t;fy=y0-B*t;var vx=g.X(fx)-g.X(x0),vy=g.Y(fy)-g.Y(y0),vl=Math.hypot(vx,vy),vux=vl<1?.7:vx/vl,vuy=vl<1?-.7:vy/vl;
 s+=cl(g,B===0?ln(g.X(-Cc/A),g.Y(g.y0),g.X(-Cc/A),g.Y(g.y1),'ln'):curve(g,function(x){return(-A*x-Cc)/B},-15,15,'ln',4))+ln(g.X(x0),g.Y(y0),g.X(fx),g.Y(fy),'rd',null,2.4)+pt(g,x0,y0,5,R)+pt(g,fx,fy,4,K)+tx(g.X(x0)-vux*18,g.Y(y0)-vuy*18+4,'P('+x0+', '+y0+')','rt','middle')+tx(g.X(fx)+vux*20,g.Y(fy)+vuy*20+4,'foot',null,'middle');
 return{s:s,o:[['Line',n(A)+'x '+(B<0?'− ':'+ ')+n(Math.abs(B))+'y '+(Cc<0?'− ':'+ ')+n(Math.abs(Cc))+' = 0'],['d = |Ax₀+By₀+C| / √(A²+B²)',n(d,3)+(num===0?'  (P is on the line)':''),1],['Numerator |…|',n(Math.abs(num))],['√(A²+B²)',sq(D)],['Foot of perpendicular','('+n(fx)+', '+n(fy)+')']],n:'The shortest distance is the perpendicular segment (grey). Defaults give the worked example: P(3,4) and 3x + 4y − 10 = 0, so d = 3.'}}};

/* ---------- MATH: conic sections ---------- */
W.ecc={t:'Eccentricity decides the conic',h:320,c:[C('e','eccentricity e',0,2.5,.05,.6),C('l','semi-latus rectum ℓ',1,6,.5,4)],d:function(v){var e=+v.e,l=+v.l,g=G(560,320,-13,13,-6.75,6.75,30),s=grid(g,2,2,2),type=e<.005?'Circle':Math.abs(e-1)<.005?'Parabola':e<1?'Ellipse':'Hyperbola',dir;
 if(e>0.005){dir=l/e;s+=cl(g,ln(g.X(dir),g.Y(g.y0),g.X(dir),g.Y(g.y1),'gr',M,1.5).replace('/>',' stroke-dasharray="5 4"/>'))}
 s+=cl(g,pcurve(g,function(t){var d=1+e*Math.cos(t);if(Math.abs(d)<.02)return[NaN,NaN];var r=l/d;return[r*Math.cos(t),r*Math.sin(t)]},-PI,PI,'rd',700))+pt(g,0,0,5,K)+lab(g,0,0,'focus',null,8,16);
 return{s:s,o:[['Conic',type,1],['e = c / a',n(e)],['Directrix',e>.005?'x = '+n(l/e):'none (circle)']],n:'Polar form r = ℓ / (1 + e cos θ) with the focus at the origin. e = 0 circle, 0 < e < 1 ellipse, e = 1 parabola, e > 1 hyperbola (both branches). Dashed line = directrix.'}}};

W.circle={t:'Circle: standard and general form',h:340,c:[C('h','centre h',-6,6,1,2),C('k','centre k',-5,5,1,-1),C('r','radius r',1,7,.5,4)],d:function(v){var h=+v.h,k=+v.k,r=+v.r,g=G(560,340,-15,15,-8.4,8.4,30),s=grid(g,2,2,2),D=-2*h,E=-2*k,F=h*h+k*k-r*r;
 s+=cl(g,pcurve(g,function(t){return[h+r*Math.cos(t),k+r*Math.sin(t)]},0,2*PI,'ln',120)+ln(g.X(h),g.Y(k),g.X(h+r),g.Y(k),'rd',null,2))+pt(g,h,k,5,R)+lab(g,h,k,'('+h+', '+k+')',null,8,-8)+lab(g,h+r/2,k,'r = '+n(r),'rt',-14,-8);
 return{s:s,o:[['Standard form',shift(h,'x')+'² + '+shift(k,'y')+'² = '+n(r*r),1],['General form','x² + y² '+(D<0?'− ':'+ ')+n(Math.abs(D))+'x '+(E<0?'− ':'+ ')+n(Math.abs(E))+'y '+(F<0?'− ':'+ ')+n(Math.abs(F))+' = 0'],['Circumference 2πr',n(2*PI*r,2)],['Area πr²',n(PI*r*r,2)]],n:'General form comes from expanding the standard form: D = −2h, E = −2k, F = h² + k² − r². Reverse it by completing the square.'}}};

W.parabola={t:'Parabola: focus, directrix, latus rectum',h:340,c:[S('o','Axis',[['h','horizontal  (y − k)² = 4c(x − h)'],['v','vertical  (x − h)² = 4c(y − k)']],'h'),C('c','c (vertex → focus)',-5,5,.25,2),C('h','vertex h',-5,5,1,0),C('k','vertex k',-5,5,1,0)],d:function(v){var c=+v.c===0?.25:+v.c,h=+v.h,k=+v.k,H=v.o==='h',g=G(560,340,-15,15,-8.4,8.4,30),s=grid(g,2,2,2),T=function(a,b){return H?[a,b]:[b,a]},f,dr,lr1,lr2;
 f=H?[h+c,k]:[h,k+c];
 s+=cl(g,pcurve(g,function(t){return H?[h+t*t/(4*c),k+t]:[h+t,k+t*t/(4*c)]},-12,12,'ln',300));
 s+=cl(g,H?ln(g.X(h-c),g.Y(g.y0),g.X(h-c),g.Y(g.y1),'gr',R,1.6).replace('/>',' stroke-dasharray="5 4"/>'):ln(g.X(g.x0),g.Y(k-c),g.X(g.x1),g.Y(k-c),'gr',R,1.6).replace('/>',' stroke-dasharray="5 4"/>'));
 lr1=H?[f[0],k-2*Math.abs(c)]:[h-2*Math.abs(c),f[1]];lr2=H?[f[0],k+2*Math.abs(c)]:[h+2*Math.abs(c),f[1]];
 s+=ln(g.X(lr1[0]),g.Y(lr1[1]),g.X(lr2[0]),g.Y(lr2[1]),'rd',null,2)+pt(g,h,k,5,K)+pt(g,f[0],f[1],5,R)+lab(g,h,k,'V',null,8,16)+lab(g,f[0],f[1],'F','rt',8,-8);
 return{s:s,o:[['Equation',H?shift(k,'y')+'² = '+n(4*c)+(h===0?'x':shift(h,'x').replace('x','(x')+')').replace('((','(').replace('))',')'):shift(h,'x')+'² = '+n(4*c)+(k===0?'y':'(y'+(k>0?' − '+n(k):' + '+n(-k))+')'),1],['Vertex / focus','('+h+', '+k+') / ('+n(f[0])+', '+n(f[1])+')'],['Directrix',H?'x = '+n(h-c):'y = '+n(k-c)],['Latus rectum 4|c|',n(4*Math.abs(c))],['Opens',H?(c>0?'right':'left'):(c>0?'up':'down')]],n:'Every point is the same distance from the focus (grey dot) as from the directrix (dashed). The grey chord through the focus is the latus rectum, length 4|c|.'}}};

W.ellipse={t:'Ellipse: foci and constant sum of distances',h:340,c:[C('a','a (along x)',1,9,.5,5),C('b','b (along y)',1,9,.5,3),C('h','centre h',-5,5,1,0),C('k','centre k',-4,4,1,0),C('t','point angle (°)',0,360,5,50)],d:function(v){var a=+v.a,b=+v.b,h=+v.h,k=+v.k,t=rad(+v.t),g=G(560,340,-15,15,-8.4,8.4,30),s=grid(g,2,2,2),M_=Math.max(a,b),m=Math.min(a,b),c=Math.sqrt(M_*M_-m*m),hz=a>=b,f1=hz?[h-c,k]:[h,k-c],f2=hz?[h+c,k]:[h,k+c],P=[h+a*Math.cos(t),k+b*Math.sin(t)],d1=Math.hypot(P[0]-f1[0],P[1]-f1[1]),d2=Math.hypot(P[0]-f2[0],P[1]-f2[1]);
 s+=cl(g,pcurve(g,function(u){return[h+a*Math.cos(u),k+b*Math.sin(u)]},0,2*PI,'ln',160)+ln(g.X(f1[0]),g.Y(f1[1]),g.X(P[0]),g.Y(P[1]),'rd',null,1.6)+ln(g.X(f2[0]),g.Y(f2[1]),g.X(P[0]),g.Y(P[1]),'rd',null,1.6))+pt(g,f1[0],f1[1],5,R)+pt(g,f2[0],f2[1],5,R)+pt(g,P[0],P[1],5,K)+pt(g,h,k,3,M);
 return{s:s,o:[['Equation',shift(h,'x')+'²/'+n(a*a)+' + '+shift(k,'y')+'²/'+n(b*b)+' = 1',1],['Major axis',(hz?'horizontal':a===b?'none (circle)':'vertical')+', 2a = '+n(2*M_)],['c = √(a² − b²), e = c/a',n(c,3)+' , '+n(c/M_,3)],['Foci','('+n(f1[0])+', '+n(f1[1])+') and ('+n(f2[0])+', '+n(f2[1])+')'],['d₁ + d₂',n(d1,3)+' + '+n(d2,3)+' = '+n(d1+d2,3)]],n:'Drag the point angle: d₁ + d₂ stays equal to the major-axis length. Make a = b to get a circle (c = 0, e = 0).'}}};

W.hyperbola={t:'Hyperbola: foci, asymptotes, constant difference',h:340,c:[C('a','a',1,6,.5,3),C('b','b',1,6,.5,4),S('o','Orientation',[['h','horizontal  x²/a² − y²/b² = 1'],['v','vertical  y²/a² − x²/b² = 1']],'h'),C('t','point parameter',-2,2,.1,.8),S('br','Branch',[['1','right / top'],['-1','left / bottom']],'1')],d:function(v){var a=+v.a,b=+v.b,H=v.o==='h',sg=+v.br,t=+v.t,c=Math.sqrt(a*a+b*b),g=G(560,340,-15,15,-8.4,8.4,30),s=grid(g,2,2,2),T=function(p,q){return H?[p,q]:[q,p]},P,F1,F2,d1,d2,as=H?b/a:a/b;
 P=T(sg*a*Math.cosh(t),b*Math.sinh(t));F1=T(c,0);F2=T(-c,0);d1=Math.hypot(P[0]-F1[0],P[1]-F1[1]);d2=Math.hypot(P[0]-F2[0],P[1]-F2[1]);
 s+=cl(g,curve(g,function(x){return as*x},-15,15,'gr',4,M)+curve(g,function(x){return-as*x},-15,15,'gr',4,M)+[1,-1].map(function(q){return pcurve(g,function(u){return T(q*a*Math.cosh(u),b*Math.sinh(u))},-3,3,'ln',120)}).join('')+ln(g.X(F1[0]),g.Y(F1[1]),g.X(P[0]),g.Y(P[1]),'rd',null,1.6)+ln(g.X(F2[0]),g.Y(F2[1]),g.X(P[0]),g.Y(P[1]),'rd',null,1.6))+pt(g,F1[0],F1[1],5,R)+pt(g,F2[0],F2[1],5,R)+pt(g,P[0],P[1],5,K)+pt(g,T(a,0)[0],T(a,0)[1],3,M)+pt(g,T(-a,0)[0],T(-a,0)[1],3,M);
 return{s:s,o:[['Equation',H?'x²/'+n(a*a)+' − y²/'+n(b*b)+' = 1':'y²/'+n(a*a)+' − x²/'+n(b*b)+' = 1',1],['c = √(a² + b²), e = c/a',n(c,3)+' , '+n(c/a,3)],['Vertices / foci',H?'(±'+n(a)+', 0) / (±'+n(c,2)+', 0)':'(0, ±'+n(a)+') / (0, ±'+n(c,2)+')'],['Asymptotes',H?'y = ±'+n(b/a,3)+'x':'y = ±'+n(a/b,3)+'x'],['|d₁ − d₂|',n(Math.abs(d1-d2),3)+'  (= 2a = '+n(2*a)+')']],n:'Note the plus in c² = a² + b² (an ellipse has a minus). The distance difference to the two foci stays 2a for every point on the curve.'}}};

/* ---------- MATH: relations and functions ---------- */
function tm(c,s,first){if(c===0)return'';var a=Math.abs(c),b=a===1&&s?'':n(a);return(c<0?(first?'−':' − '):(first?'':' + '))+b+s}
function xb(b){return b===0?'x':'x'+(b>0?' − '+n(b):' + '+n(-b))}
function fnText(i,a,b,c){var k=a===1?'':a===-1?'−':n(a),t;
 if(i===0)t=tm(a,'x',1)+tm(b,'');else if(i===1)t=tm(a,'x²',1)+tm(b,'x')+tm(c,'');
 else{t=a===0?'':i===2?k+'('+xb(b)+')³':i===3?k+'|'+xb(b)+'|':i===4?k+'√('+xb(b)+')':k+(a===1||a===-1?'':'')+'/('+xb(b)+')';if(i===5&&a!==0)t=(a<0?'−':'')+n(Math.abs(a))+' / ('+xb(b)+')';t+=a===0?tm(c,'',1):tm(c,'')}
 return t||'0'}
var FF=[['ax + b',function(a,b,c,x){return a*x+b}],['ax² + bx + c',function(a,b,c,x){return a*x*x+b*x+c}],['a(x − b)³ + c',function(a,b,c,x){return a*Math.pow(x-b,3)+c}],['a|x − b| + c',function(a,b,c,x){return a*Math.abs(x-b)+c}],['a√(x − b) + c',function(a,b,c,x){return x<b?NaN:a*Math.sqrt(x-b)+c}],['a / (x − b) + c',function(a,b,c,x){return a/(x-b)+c}]];
W.fn={t:'Function explorer with vertical and horizontal line tests',h:340,c:[S('f','Family',FF.map(function(z,i){return[i,z[0]]}),1),C('a','a',-4,4,.5,1),C('b','b',-5,5,.5,-2),C('c','c',-5,5,.5,1),C('x0','vertical line x =',-9,9,.5,2),C('y0','horizontal line y =',-6,6,.5,2)],d:function(v){var i=+v.f,a=+v.a,b=+v.b,c=+v.c,x0=+v.x0,y0=+v.y0,g=G(560,340,-10,10,-7,7,30),f=function(x){return FF[i][1](a,b,c,x)},s=grid(g,2,1,2),hits=[],N=800,j,x,y,px,py,dom,ran,one;
 for(j=0;j<=N;j++){x=-10+20*j/N;y=f(x)-y0;if(j>0&&isFinite(y)&&isFinite(py)&&Math.abs(y)<50&&Math.abs(py)<50&&py*y<=0&&!(y===0&&py===0)){hits.push(px+(x-px)*(py===y?0:py/(py-y)))}px=x;py=y}
 hits=hits.filter(function(h,q){return q===0||Math.abs(h-hits[q-1])>.05});
 var fy=f(x0);
 s+=cl(g,curve(g,f,-10,10,'ln',500)+ln(g.X(x0),g.Y(g.y0),g.X(x0),g.Y(g.y1),'rd').replace('/>',' stroke-dasharray="5 4"/>')+ln(g.X(g.x0),g.Y(y0),g.X(g.x1),g.Y(y0),'rd').replace('/>',' stroke-dasharray="5 4"/>')+(isFinite(fy)?pt(g,x0,fy,5,R):'')+hits.map(function(h){return pt(g,h,y0,4,K)}).join(''));
 var yv=c-b*b/(4*a);
 if(a===0&&i!==0){dom='degenerate (a = 0): constant';ran='y = '+n(i===1?c:c)}
 else if(i===0){dom='ℝ';ran=a===0?'{'+n(b)+'}':'ℝ'}
 else if(i===1){dom='ℝ';ran=a>0?'[ '+n(yv)+', ∞ )':'( −∞, '+n(yv)+' ]'}
 else if(i===2){dom='ℝ';ran='ℝ'}
 else if(i===3){dom='ℝ';ran=a>0?'[ '+n(c)+', ∞ )':'( −∞, '+n(c)+' ]'}
 else if(i===4){dom='[ '+n(b)+', ∞ )';ran=a>0?'[ '+n(c)+', ∞ )':'( −∞, '+n(c)+' ]'}
 else{dom='ℝ \\ {'+n(b)+'}';ran='ℝ \\ {'+n(c)+'}'}
 one=a===0?(i===0?'No (constant)':'No'):i===0||i===2||i===4||i===5?'Yes':i===1&&false?'':'No (a horizontal line can cross twice)';
 return{s:s,o:[['f(x) =',fnText(i,a,b,c),1],['Domain',dom],['Range',ran],['Vertical line meets graph',(isFinite(fy)?1:0)+' time(s)'+(isFinite(fy)?'':' (x outside domain)')],['Horizontal line meets graph',hits.length+' time(s)'],['One-to-one?',one]],n:'Vertical line test: a graph is a function if every vertical line meets it at most once. Horizontal line test: it is one-to-one if every horizontal line meets it at most once. Move the grey lines to check.'}}};

var CF=[['x + 3',function(x){return x+3}],['2x − 1',function(x){return 2*x-1}],['x²',function(x){return x*x}],['√x',function(x){return x<0?NaN:Math.sqrt(x)}],['1 / x',function(x){return x===0?NaN:1/x}],['|x|',Math.abs],['3x',function(x){return 3*x}]];
W.compose={t:'Composition machine: f ∘ g is not g ∘ f',h:230,c:[S('f','f(x) =',CF.map(function(z,i){return[i,z[0]]}),1),S('g','g(x) =',CF.map(function(z,i){return[i,z[0]]}),2),C('x','input x',-6,6,.5,3)],d:function(v){var f=CF[+v.f],g=CF[+v.g],x=+v.x,gx=g[1](x),fgx=f[1](gx),fx=f[1](x),gfx=g[1](fx),s='',V=function(z){return isFinite(z)?n(z,3):'undefined'},lane=function(y,A,B,x0,m,out,na,nb){var t=tx(30,y+4,'x = '+n(x0),null,null);return t+ar(100,y,150,y,K)+rc(150,y-22,110,44,'fl',8)+tx(205,y-2,na+'(x)',null,'middle')+tx(205,y+14,A,'mu','middle')+ar(260,y,310,y,K)+tx(285,y-8,V(m),'mu','middle')+rc(310,y-22,110,44,'fl',8)+tx(365,y-2,nb+'(·)',null,'middle')+tx(365,y+14,B,'mu','middle')+ar(420,y,470,y,R)+tx(478,y+5,V(out),'rt')};
 s+=lane(60,g[0],f[0],x,gx,fgx,'g','f')+lane(160,f[0],g[0],x,fx,gfx,'f','g')+tx(30,24,'(f ∘ g)(x) = f(g(x))  — g first',null)+tx(30,124,'(g ∘ f)(x) = g(f(x))  — f first',null);
 return{s:s,o:[['(f ∘ g)('+n(x)+')',V(fgx),1],['(g ∘ f)('+n(x)+')',V(gfx),1],['Same?',isFinite(fgx)&&isFinite(gfx)?(Math.abs(fgx-gfx)<1e-9?'Yes, this time':'No: order matters'):'at least one is undefined']],n:'Domain of f ∘ g = {x in the domain of g with g(x) in the domain of f}. Try g = x², f = √x and a negative x.'}}};

var IV=[['lin','f(x) = ax + b'],['cub','f(x) = x³ + b'],['sq','f(x) = x²  (x ≥ 0)'],['exp','f(x) = 2ˣ']];
W.inverse={t:'Inverse function: reflect in y = x',h:340,c:[S('k','Function',IV,'lin'),C('a','a (linear only)',-3,3,.5,2),C('b','b',-4,4,1,1),C('p','point x =',-3,3,.25,1.5)],d:function(v){var k=v.k,a=+v.a===0?1:+v.a,b=+v.b,p=+v.p,g=G(560,340,-9,9,-5.4,5.4,30),s=grid(g,1,1,2),f,fi,fs,is,dom;
 if(k==='lin'){f=function(x){return a*x+b};fi=function(y){return(y-b)/a};fs='f(x) = '+n(a)+'x'+(b<0?' − '+n(-b):' + '+n(b));is='f⁻¹(x) = (x '+(b<0?'+ '+n(-b):'− '+n(b))+') / '+n(a)}
 else if(k==='cub'){f=function(x){return x*x*x+b};fi=function(y){return Math.cbrt(y-b)};fs='f(x) = x³ '+(b<0?'− '+n(-b):'+ '+n(b));is='f⁻¹(x) = ∛(x '+(b<0?'+ '+n(-b):'− '+n(b))+')'}
 else if(k==='sq'){p=Math.abs(p);f=function(x){return x<0?NaN:x*x};fi=function(y){return y<0?NaN:Math.sqrt(y)};fs='f(x) = x², x ≥ 0';is='f⁻¹(x) = √x'}
 else{f=function(x){return Math.pow(2,x)};fi=function(y){return y<=0?NaN:Math.log(y)/Math.LN2};fs='f(x) = 2ˣ';is='f⁻¹(x) = log₂ x'}
 var fp=f(p);
 s+=cl(g,curve(g,function(x){return x},-9,9,'gr',2,M).replace('class="gr"','class="gr" stroke-dasharray="5 4"')+curve(g,f,-9,9,'ln',400)+curve(g,fi,-9,9,'rd',400));
 if(isFinite(fp)){s+=cl(g,ln(g.X(p),g.Y(fp),g.X(fp),g.Y(p),'gr',M,1).replace('/>',' stroke-dasharray="3 3"/>')+pt(g,p,fp,5,K)+pt(g,fp,p,5,R))+lab(g,p,fp,'('+n(p)+', '+n(fp,2)+')',null,8,-8)+lab(g,fp,p,'('+n(fp,2)+', '+n(p)+')','rt',8,-8)}
 return{s:s,o:[['f',fs],['Inverse',is,1],['f(p)',n(fp,3)],['f⁻¹(f(p))',isFinite(fp)?n(fi(fp),3)+'  (= p)':'—'],['Domain swap','dom f⁻¹ = range f']],n:'Black = f, grey = f⁻¹, dashed = y = x. The point (p, f(p)) reflects to (f(p), p). The inverse exists only if f is one-to-one and onto, so x² must be restricted to x ≥ 0. f⁻¹ does not mean 1/f.'}}};

var TY={inj:{A:['1','2','3'],B:['a','b','c','d'],m:[[0,0],[1,1],[2,2]],r:['Yes','Yes','No (d is unused)','No']},ont:{A:['1','2','3','4'],B:['a','b','c'],m:[[0,0],[1,0],[2,1],[3,2]],r:['Yes','No (1 and 2 both hit a)','Yes','No']},bij:{A:['1','2','3'],B:['a','b','c'],m:[[0,1],[1,2],[2,0]],r:['Yes','Yes','Yes','Yes, inverse exists']},not:{A:['1','2','3'],B:['a','b','c'],m:[[0,0],[0,1],[1,2]],r:['No: 1 has two outputs and 3 has none','n/a','n/a','n/a']}};
W.types={t:'Arrow diagrams: one-to-one, onto, bijective',h:260,hint:'',c:[(function(){var c=S('k','Mapping f : A → B',[['inj','one-to-one, not onto'],['ont','onto, not one-to-one'],['bij','bijective'],['not','not a function']],'inj');c.head=1;c.desc='Select a mapping';return c})()],d:function(v){var T=TY[v.k],s='',ya=function(i,n_){return 40+(i+.5)*(200/n_)};
 s+='<ellipse cx="170" cy="140" rx="60" ry="108" class="fl" stroke="'+K+'" stroke-width="1.5"/><ellipse cx="390" cy="140" rx="60" ry="108" class="fl" stroke="'+K+'" stroke-width="1.5"/>'+tx(170,22,'A (domain)',null,'middle')+tx(390,22,'B (co-domain)',null,'middle');
 T.A.forEach(function(z,i){s+=ci(170,ya(i,T.A.length),4)+tx(150,ya(i,T.A.length)+4,z,null,'end')});T.B.forEach(function(z,i){s+=ci(390,ya(i,T.B.length),4)+tx(410,ya(i,T.B.length)+4,z)});
 T.m.forEach(function(p){s+=ar(176,ya(p[0],T.A.length),384,ya(p[1],T.B.length),R,1.6)});
 return{s:s,o:[['Function?',T.r[0],1],['One-to-one?',T.r[1]],['Onto?',T.r[2]],['Bijective?',T.r[3]]],n:'One-to-one: no two arrows land on the same point. Onto: every point of B is hit. Bijective = both, which is exactly when an inverse function exists.'}}};

/* ---------- extra: solving equations (real numbers) and how many solutions (functions) ---------- */
function lin(a,b){var t=a===0?'':(a===1?'':a===-1?'−':n(a))+'x';if(b===0)return t||'0';return t?t+(b>0?' + '+n(b):' − '+n(-b)):n(b)}
function uniq(a){a=a.slice().sort(function(p,q){return p-q});return a.filter(function(x,i){return i===0||Math.abs(x-a[i-1])>1e-9})}
function poly2(B,Cc){return'x²'+(B===0?'':(B>0?' + ':' − ')+(Math.abs(B)===1?'':n(Math.abs(B)))+'x')+(Cc===0?'':(Cc>0?' + ':' − ')+n(Math.abs(Cc)))+' = 0'}

W.abseq={t:'|ax + b| = cx + d: split, solve, then check',h:320,c:[C('a','a',-4,4,1,2),C('b','b',-6,6,1,-3),C('c','c',-3,3,1,1),C('d','d',-6,6,1,2)],d:function(v){
 var a=+v.a,b=+v.b,c=+v.c,d=+v.d,g=G(560,320,-10,10,-8,12,30),s=grid(g,2,2,2),rows=[],sol=[],inf=false,cs=[[a-c,d-b],[a+c,-d-b]];
 cs.forEach(function(k){var p=k[0],q=k[1],x,ok;
  if(p===0){if(q===0){inf=true;rows.push('true for every x with cx + d ≥ 0')}else rows.push('impossible: no x');return}
  x=q/p;ok=c*x+d>=-1e-9;rows.push('x = '+n(x,3)+(ok?'  ✓ valid':'  ✗ extraneous: cx + d < 0'));if(ok)sol.push(x)});
 sol=uniq(sol);
 s+=cl(g,curve(g,function(x){return Math.abs(a*x+b)},-10,10,'ln')+curve(g,function(x){return c*x+d},-10,10,'rd'));
 sol.forEach(function(x){s+=pt(g,x,Math.abs(a*x+b),5,K)});
 return{s:s,o:[['Equation','|'+lin(a,b)+'| = '+lin(c,d),1],['Case 1: inside = right side',rows[0]],['Case 2: inside = −(right side)',rows[1]],['Solutions',inf?'infinitely many':sol.length?sol.map(function(x){return n(x,3)}).join(' , '):'none',1]],n:'Split into two cases, solve each, then check that the right side cx + d is not negative: an absolute value can never equal a negative number. Black curve = |ax + b|, grey line = cx + d, dots = valid solutions.'}}};

W.abs2={t:'Absolute value inside absolute value',h:300,c:[C('a','a (centre)',-6,6,1,1),C('b','b',0,8,1,3),C('c','c',0,8,1,2)],d:function(v){
 var a=+v.a,b=+v.b,c=+v.c,g=G(560,300,-12,12,-2,10,30),s=grid(g,2,2,2),xs=[],r1_=b+c,r2_=b-c,t1,t2;
 xs.push(a-r1_,a+r1_);t1='x = '+n(a-r1_)+' or x = '+n(a+r1_);
 if(r2_>0){xs.push(a-r2_,a+r2_);t2='x = '+n(a-r2_)+' or x = '+n(a+r2_)}else if(r2_===0){xs.push(a);t2='x = '+n(a)}else t2='none: |x − a| cannot be negative';
 xs=uniq(xs);
 s+=cl(g,curve(g,function(x){return Math.abs(Math.abs(x-a)-b)},-12,12,'ln')+ln(g.X(-12),g.Y(c),g.X(12),g.Y(c),'rd'));
 xs.forEach(function(x){s+=pt(g,x,c,5,K)});
 return{s:s,o:[['Equation','| |x '+(a>0?'− '+n(a):a<0?'+ '+n(-a):'')+'| − '+n(b)+' | = '+n(c),1],['Outer layer','|x − a| − b = ±c'],['|x − a| = b + c = '+n(r1_),t1],['|x − a| = b − c = '+n(r2_),t2],['Solutions ('+xs.length+')',xs.map(function(x){return n(x)}).join(' , '),1]],n:'Peel one layer at a time, outer first: the outer bars give two equations, and each inner |x − a| = (number) gives two more, so up to four solutions. A negative number inside is impossible.'}}};

W.rad={t:'Radical equation: square, solve, then check',h:320,c:[C('p','p',-4,6,1,1),C('q','q',-6,10,1,2),C('r','r',-6,6,1,0)],d:function(v){
 var p=+v.p,q=+v.q,r=+v.r,g=G(560,320,-8,8,-4,10,30),s=grid(g,2,2,2),B=2*r-p,Cc=r*r-q,D=B*B-4*Cc,cands=[],txt=[],good=[];
 if(D>=0){var sd=Math.sqrt(D);cands=D===0?[-B/2]:[(-B-sd)/2,(-B+sd)/2]}
 cands.forEach(function(x){var ok=x+r>=-1e-9&&p*x+q>=-1e-9;txt.push(n(x,3)+(ok?' ✓':' ✗'));if(ok)good.push(x)});
 s+=cl(g,curve(g,function(x){var t=p*x+q;return t<0?NaN:Math.sqrt(t)},-8,8,'ln',300)+curve(g,function(x){return x+r},-8,8,'rd'));
 cands.forEach(function(x){var ok=x+r>=-1e-9&&p*x+q>=-1e-9;s+=pt(g,x,x+r,5,ok?K:'#fff',!ok)});
 return{s:s,o:[['Equation','√('+lin(p,q)+') = '+lin(1,r),1],['After squaring both sides',poly2(B,Cc)],['Candidates',txt.length?txt.join('  ·  '):'none'],['Solutions',good.length?good.map(function(x){return n(x,3)}).join(' , '):'none',1]],n:'Squaring can create fake roots, so every candidate must be checked in the original equation. ✓ = valid, ✗ = extraneous. Solid dot = real solution, hollow dot = extraneous. Defaults: √(x + 2) = x gives x = 2 and x = −1, but only x = 2 works.'}}};

W.linsol={t:'Linear equation: one, none or infinitely many solutions',h:320,c:[C('a','a',-5,5,1,2),C('b','b',-6,6,1,1),C('c','c',-5,5,1,-1),C('d','d',-6,6,1,4)],d:function(v){
 var a=+v.a,b=+v.b,c=+v.c,d=+v.d,g=G(560,320,-10,10,-8,8,30),s=grid(g,2,2,2),k=a-c,m=d-b,x,kind,res,pic;
 if(k!==0){x=m/k;kind='one solution';res='x = '+n(x,3);pic='the lines cross once (different slopes)'}else if(m===0){kind='infinitely many solutions';res='every x';pic='the same line (same slope, same intercept)'}else{kind='no solution';res='none';pic='parallel lines (same slope, different intercepts)'}
 s+=cl(g,curve(g,function(t){return a*t+b},-10,10,'ln',4)+curve(g,function(t){return c*t+d},-10,10,'rd',4));
 if(k!==0)s+=pt(g,x,a*x+b,5,K);
 return{s:s,o:[['Equation',lin(a,b)+' = '+lin(c,d),1],['Collect x terms','('+n(a)+' − ('+n(c)+'))x = '+n(d)+' − ('+n(b)+')'],['How many solutions',kind,1],['Solution',res],['Graph picture',pic]],n:'Each side is a line, y = ax + b and y = cx + d. Solutions are where they meet. This is the parallel and perpendicular idea from Analytic Geometry: equal slopes mean the lines never meet unless they are the same line.'}}};

W.quadroots={t:'Quadratic: the discriminant decides the number of solutions',h:320,c:[C('a','a',-3,3,.5,1),C('b','b',-8,8,1,-2),C('c','c',-8,8,1,-3)],d:function(v){
 var a=+v.a,b=+v.b,c=+v.c,g=G(560,320,-12,12,-8,8,30),s=grid(g,2,2,2),D=b*b-4*a*c,roots=[],xv,yv,x0;
 if(a===0){s+=cl(g,curve(g,function(x){return b*x+c},-12,12,'ln',4));x0=b===0?NaN:-c/b;if(b!==0)s+=pt(g,x0,0,5,K);
  return{s:s,o:[['Equation','a = 0, so it is linear: '+lin(b,c)+' = 0',1],['Solutions',b!==0?'one: x = '+n(x0,3):c===0?'infinitely many':'none']],n:'With a = 0 there is no x² term, so it is not a quadratic. Set a to a non-zero value.'}}
 if(D>=0){var sd=Math.sqrt(D);roots=D===0?[-b/(2*a)]:[(-b-sd)/(2*a),(-b+sd)/(2*a)]}
 xv=-b/(2*a);yv=c-b*b/(4*a);
 s+=cl(g,curve(g,function(x){return a*x*x+b*x+c},-12,12,'ln',400));
 roots.forEach(function(x){s+=pt(g,x,0,5,K)});s+=pt(g,xv,yv,4,R);
 return{s:s,o:[['Equation',(a===1?'':a===-1?'−':n(a))+'x²'+(b===0?'':(b>0?' + ':' − ')+(Math.abs(b)===1?'':n(Math.abs(b)))+'x')+(c===0?'':(c>0?' + ':' − ')+n(Math.abs(c)))+' = 0',1],['Discriminant D = b² − 4ac',n(D)],['Real solutions',D>0?'two (D > 0)':D===0?'one, repeated (D = 0)':'none (D < 0)',1],['Roots',roots.length?roots.map(function(x){return n(x,3)}).join(' , '):'—'],['Vertex','('+n(xv,2)+', '+n(yv,2)+')'],['Sum and product of roots','−b/a = '+n(-b/a,2)+' , c/a = '+n(c/a,2)]],n:'D > 0: the parabola crosses the x-axis twice. D = 0: it just touches the axis at its vertex. D < 0: it never reaches the axis. A line meeting a parabola works the same way: set them equal and look at D.'}}};

W.expsol={t:'Exponential equation: a · bˣ = k',h:320,c:[C('a','a',1,5,1,2),C('b','factor b',.5,3,.05,2),C('k','k',-4,40,1,16)],d:function(v){
 var a=+v.a,b=+v.b,k=+v.k,g=G(560,320,-5,6,-6,36,30),s=grid(g,1,6,1),x,kind,res;
 if(b===1){kind=a===k?'infinitely many (the graph is the line y = a)':'none';res=a===k?'every x':'none'}
 else if(k/a>0){x=Math.log(k/a)/Math.log(b);kind='exactly one';res='x = log_b(k/a) = '+n(x,3)}
 else{kind='none: a·bˣ is always positive';res='none'}
 s+=cl(g,curve(g,function(t){return a*Math.pow(b,t)},-5,6,'ln',300)+ln(g.X(-5),g.Y(k),g.X(6),g.Y(k),'rd'));
 if(x!==undefined&&isFinite(x))s+=pt(g,x,k,5,K);
 return{s:s,o:[['Equation',n(a)+' · '+n(b)+'ˣ = '+n(k),1],['How many solutions',kind,1],['Solution',res],['Initial amount a (x = 0)',n(a)],['Change per step',(b>=1?'+':'−')+n(Math.abs(b-1)*100,1)+'%'+(b>1?'  (growth)':b<1?'  (decay)':'  (none)')]],n:'An exponential graph is always above the x-axis and strictly rising or falling, so a horizontal line meets it once or never. It can never have two solutions. Here a is the starting amount and b = 1 + r, so b = 1.05 means +5% per step and b = 0.8 means −20% per step (SAT form: y = a(1 + r)ᵗ). The x-axis is an asymptote that is never reached.'}}};

})();
