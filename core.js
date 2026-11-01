// Shared logic (browser and Node): occurrences, quote of the day, look-ahead text.
(function(g){
const MONS=["January","February","March","April","May","June","July","August","September","October","November","December"];
const iso=d=>d.toISOString().slice(0,10);
const gtxt=d=>d.toLocaleDateString("en-IE",{weekday:"long",day:"numeric",month:"long",year:"numeric",timeZone:"UTC"});
const H=d=>g.HC.toHeavenly(d.getUTCFullYear(),d.getUTCMonth()+1,d.getUTCDate());
const htxt=h=>`${h.leap?"Leap ":""}${h.month}.${h.day}, Cheon Il Guk year ${h.cig}`;
function lunarOcc(from,days){const out=[],end=new Date(from.getTime()+days*864e5);
 for(let y=from.getUTCFullYear()-1;y<=end.getUTCFullYear();y++)for(const e of g.EVENTS){const d=g.HC.toGregorian(y,e.m,e.d);if(d&&d>=from&&d<=end)out.push({...e,date:d,lunar:true})}
 return out.sort((a,b)=>a.date-b.date)}
function dayOfYear(d){return Math.round((Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate())-Date.UTC(d.getUTCFullYear(),0,1))/864e5)+1}
// Deterministic: quote index = (day of year - 1) mod number of quotes. Same date gives the same quote every year.
function quoteFor(d){const Q=g.QUOTES;return Q[(dayOfYear(d)-1)%Q.length]}
function qsrc(q){return `${q.speaker}, "${q.source}", ${q.date}${q.place&&q.place!="not stated"?", "+q.place:""}`}
const noDash=s=>String(s).replace(/\s*[\u2013\u2014]\s*/g,", ");
function lookahead(start,mode){const days=mode=="month"?new Date(Date.UTC(start.getUTCFullYear(),start.getUTCMonth()+1,0)).getUTCDate()-start.getUTCDate()+1:7;
 const list=[];for(let i=0;i<days;i++){const d=new Date(start.getTime()+i*864e5);list.push({date:d,h:H(d)})}
 const evWin=mode=="month"?days+30:30,ev=lunarOcc(start,evWin-1),q=quoteFor(start);
 const title=mode=="month"?`Heavenly Calendar look-ahead for ${MONS[start.getUTCMonth()]} ${start.getUTCFullYear()}`:`Heavenly Calendar look-ahead for the week of ${gtxt(start)}`;
 const evLine=e=>`${gtxt(e.date)}: ${e.name} (Heavenly ${e.m}.${e.d})${e.status=="tbc"?" (date or title to be confirmed)":""}, in ${Math.round((e.date-start)/864e5)} days`;
 let t=title+"\n\n"+(mode=="month"?"Holy days and events this month and the following 30 days:\n":"Upcoming holy days in the next 30 days:\n")+(ev.length?ev.map(e=>"- "+evLine(e)).join("\n"):"- None")+"\n\n";
 t+=(mode=="month"?"Heavenly dates this month (every 7th day shown):\n":"Heavenly Calendar dates for the next 7 days:\n")+list.filter((x,i)=>mode!="month"||i%7==0||ev.some(e=>iso(e.date)==iso(x.date))).map(x=>`- ${gtxt(x.date)}: ${htxt(x.h)}`).join("\n")+"\n\n";
 t+=`${mode=="month"?"Quote for the month":"Quote of the week"}:\n"${q.text}"\n${qsrc(q)}\nSource: ${q.link}\n\nApp: https://ttineff-bit.github.io/heavenly-calendar/\n`;
 const e=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
 let h=`<h2>${e(title)}</h2><h3>${mode=="month"?"Holy days this month and the following 30 days":"Upcoming holy days (next 30 days)"}</h3><ul>${ev.map(x=>"<li>"+e(evLine(x))+"</li>").join("")||"<li>None</li>"}</ul><h3>Heavenly Calendar dates</h3><ul>${list.filter((x,i)=>mode!="month"||i%7==0||ev.some(z=>iso(z.date)==iso(x.date))).map(x=>`<li>${e(gtxt(x.date))}: ${e(htxt(x.h))}</li>`).join("")}</ul><h3>${mode=="month"?"Quote for the month":"Quote of the week"}</h3><blockquote>${e(q.text)}</blockquote><p>${e(qsrc(q))}. <a href="${e(q.link)}">Source</a></p><p><a href="https://ttineff-bit.github.io/heavenly-calendar/">Open the Heavenly Calendar app</a></p>`;
 return{text:noDash(t),html:noDash(h)}}
g.CORE={iso,gtxt,H,htxt,lunarOcc,quoteFor,qsrc,dayOfYear,lookahead};
})(typeof window!="undefined"?window:globalThis);
