// Smoke test: node summary.test.js. Runs every diagram at default, min and max of each slider; fails on NaN/undefined/exceptions.
global.window=global;
['summary.js','w-math.js','w-phys.js'].forEach(f=>require('./'+f));
const W=window.SW.W;let runs=0,bad=0;
for(const [name,D] of Object.entries(W)){
  const base={};D.c.forEach(c=>base[c.k]=c.v);
  const cases=[{...base}];
  D.c.forEach(c=>{if(c.sel){c.sel.forEach(o=>cases.push({...base,[c.k]:String(o[0])}))}else{cases.push({...base,[c.k]:c.min},{...base,[c.k]:c.max})}});
  for(const v of cases){
    runs++;
    try{const r=D.d(v),all=(r.s||r.html)+r.o.map(o=>o[0]+o[1]).join('|');
      if(/NaN|undefined|Infinity/.test(all)){bad++;console.log('BAD',name,JSON.stringify(v),(all.match(/.{0,40}(NaN|undefined|Infinity).{0,20}/)||[''])[0])}
    }catch(e){bad++;console.log('THROW',name,JSON.stringify(v),e.message)}
  }
}
console.log(Object.keys(W).length+' diagrams, '+runs+' cases, '+bad+' problems');process.exit(bad?1:0);
