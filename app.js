"use strict";

const el = id => document.getElementById(id);

function list(id, values) {
  el(id).replaceChildren(...values.map(value => {
    const line = document.createElement("li");
    line.textContent = value;
    return line;
  }));
}

function number(id) {
  const input = el(id);
  if (!input.validity.valid || !Number.isFinite(input.valueAsNumber)) {
    throw new Error("Check " + input.labels[0].textContent.trim().toLowerCase() + " and its allowed range.");
  }
  return input.valueAsNumber;
}

function refresh(draw) {
  try {
    draw();
    el("message").textContent = "";
    el("result").hidden = false;
  } catch (error) {
    el("message").textContent = error.message;
    el("result").hidden = true;
  }
}

function draw() {
  const ids=["count","binw","depth","raised","width","inside","head","gap","gate","offset","front"];
  const p=Object.fromEntries(ids.map(id=>[id,number(id)]));
  const model=binLayout(p), picker=el("which");
  if (picker.length!==p.count) {
    const keep=picker.selectedIndex;
    picker.replaceChildren(...model.paths.map((_,i)=>new Option("Bin "+(i+1),i)));
    picker.selectedIndex=Math.max(0,Math.min(keep,p.count-1));
  }
  const selected=picker.selectedIndex, path=model.paths[selected], clear=model.paths.filter(r=>r.clear).length;
  el("summary").textContent=clear+" of "+p.count+" bins have a straight pull-out path";
  list("details",[
    "Inside footprint · "+(model.rowFits?"fits":"too small")+" for "+model.run+" × "+p.depth+" mm of bins and gaps.",
    "Raised lids · "+(model.lids?(p.head-p.raised)+" mm spare headroom":(p.raised-p.head)+" mm more headroom needed")+".",
    "Gate swing · "+(!model.gateFits?"gate extends past the opening":model.swing?"90° outward swing fits":(p.gate-p.front)+" mm more front clearance needed")+".",
    "Bin "+(selected+1)+" · "+(path.aligned?"aligned with the gate":"gate opening does not cover its full width")+". Straight removal needs "+p.depth+" mm clear in front after opening the gate."
  ]);
  const v=el("view"), ctx=v.getContext("2d"); ctx.clearRect(0,0,v.width,v.height);
  const minX=Math.min(0,model.paths[0].x), maxX=Math.max(p.width,p.offset+p.gate,model.paths.at(-1).x+p.binw);
  const minY=Math.min(0,(p.inside-p.depth)/2), maxY=p.inside+Math.max(p.front,p.gate,p.depth);
  const scale=Math.min((v.width-24)/(maxX-minX),(v.height-24)/(maxY-minY));
  const x=q=>(v.width-(maxX-minX)*scale)/2+(q-minX)*scale, y=q=>12+(q-minY)*scale;
  function rect(left,top,w,h,fill) {ctx.fillStyle=fill;ctx.fillRect(x(left),y(top),w*scale,h*scale);}
  rect(0,0,p.width,p.inside,"#dce9ec"); rect(0,p.inside,p.width,p.front,"#e7e2d3");
  const top=(p.inside-p.depth)/2;
  model.paths.forEach((b,i)=>rect(b.x,top,p.binw,p.depth,i===selected?"#176284":"#859da7"));
  ctx.strokeStyle="#193754"; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(x(p.offset),y(p.inside)); ctx.lineTo(x(0),y(p.inside));ctx.lineTo(x(0),y(0));ctx.lineTo(x(p.width),y(0));
  ctx.lineTo(x(p.width),y(p.inside));ctx.lineTo(x(p.offset+p.gate),y(p.inside));ctx.stroke();
  ctx.setLineDash([6,5]);ctx.beginPath();ctx.arc(x(p.offset),y(p.inside),p.gate*scale,0,Math.PI/2);ctx.stroke();
  ctx.setLineDash([]);ctx.beginPath();ctx.moveTo(x(p.offset),y(p.inside));ctx.lineTo(x(p.offset),y(p.inside+p.gate));ctx.stroke();
  ctx.strokeStyle=path.clear?"#17674c":"#ac3930";ctx.lineWidth=4;
  const mid=x(path.x+p.binw/2), end=y(p.inside+p.depth);
  ctx.beginPath();ctx.moveTo(mid,y(top+p.depth*.65));ctx.lineTo(mid,end);ctx.lineTo(mid-6,end-8);ctx.moveTo(mid,end);ctx.lineTo(mid+6,end-8);ctx.stroke();
}
el("controls").oninput=()=>refresh(draw);
refresh(draw);
