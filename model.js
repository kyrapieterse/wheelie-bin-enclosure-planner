"use strict";
function binLayout(p) {
  const run=p.count*p.binw+(p.count-1)*p.gap;
  const start=(p.width-run)/2;
  const gateFits=p.offset+p.gate<=p.width;
  const rowFits=run<=p.width && p.depth<=p.inside;
  const lids=p.raised<=p.head;
  const swing=gateFits && p.front>=p.gate;
  const paths=Array.from({length:p.count},(_,i)=>{
    const x=start+i*(p.binw+p.gap);
    const aligned=gateFits && x>=p.offset && x+p.binw<=p.offset+p.gate;
    return {x,aligned,clear:rowFits && swing && aligned && p.front>=p.depth};
  });
  return {run,rowFits,lids,swing,gateFits,paths};
}
if(typeof module!=="undefined" && module.exports) module.exports={binLayout};
