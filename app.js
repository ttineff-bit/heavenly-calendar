const MON=["January","February","March","April","May","June","July","August","September","October","November","December"];
const VERIFIED_FROM=2012,VERIFIED_TO=2030;
const $=s=>document.querySelector(s),main=$("#main");
const today=()=>{const n=new Date();return new Date(Date.UTC(n.getFullYear(),n.getMonth(),n.getDate(),12))};
const iso=d=>d.toISOString().slice(0,10);
const gtxt=d=>d.toLocaleDateString("en-IE",{weekday:"long",day:"numeric",month:"long",year:"numeric",timeZone:"UTC"});
const H=d=>HC.toHeavenly(d.getUTCFullYear(),d.getUTCMonth()+1,d.getUTCDate());
const htxt=h=>`${h.leap?"Leap ":""}${h.month}.${h.day}, Cheon Il Guk year ${h.cig}`;
const custom=()=>JSON.parse(localStorage.getItem("hc-custom")||"[]");
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function occurrences(from,days){const out=[],end=new Date(from.getTime()+days*864e5);
 for(let y=from.getUTCFullYear()-1;y<=end.getUTCFullYear();y++)for(const e of EVENTS){const g=HC.toGregorian(y,e.m,e.d);if(g&&g>=from&&g<=end)out.push({...e,date:g,lunar:true})}
 for(const c of custom()){let g=new Date(c.date+"T12:00:00Z");if(c.yearly){g=new Date(Date.UTC(from.getUTCFullYear(),g.getUTCMonth(),g.getUTCDate(),12));if(g<from)g.setUTCFullYear(g.getUTCFullYear()+1)}if(g>=from&&g<=end)out.push({name:c.name,desc:c.desc||"",date:g,status:"custom"})}
 return out.sort((a,b)=>a.date-b.date)}
const tag=e=>e.status=="tbc"?' <span class="tbc">(to be confirmed)</span>':e.status=="custom"?' <span class="mut">(my event)</span>':"";
const yrNote=d=>d.getUTCFullYear()>VERIFIED_TO||d.getUTCFullYear()<VERIFIED_FROM?'<p class="tbc">Dates for this year are computed but not checked against a published calendar: to be confirmed.</p>':"";
function evRow(e,t){const n=Math.round((e.date-t)/864e5);return `<div class="card"><b>${esc(e.name)}</b>${tag(e)}<br>${gtxt(e.date)}${e.lunar?` <span class="mut">(Heavenly ${e.m}.${e.d})</span>`:""}<br><b>${n==0?"Today":n==1?"Tomorrow":"In "+n+" days"}</b><br><span class="mut">${esc(e.desc)}</span>${e.src?` <a href="${e.src}" target="_blank" rel="noopener">source</a>`:""}</div>`}
function vToday(){const t=today(),h=H(t),up=occurrences(t,400).slice(0,5);main.innerHTML=`<div class="card"><div class="mut">Today in the Heavenly Calendar</div><div class="big">${htxt(h)}</div><div>${gtxt(t)}</div>${yrNote(t)}</div><h2>Upcoming</h2>`+up.map(e=>evRow(e,t)).join("")}
function vList(){const t=today();main.innerHTML="<h2>Next 90 days</h2>"+(occurrences(t,90).map(e=>evRow(e,t)).join("")||"<p>No events in the next 90 days.</p>")}
let mo=null;function vMonth(){const t=today();if(!mo)mo=new Date(Date.UTC(t.getUTCFullYear(),t.getUTCMonth(),1,12));const y=mo.getUTCFullYear(),m=mo.getUTCMonth(),n=new Date(Date.UTC(y,m+1,0)).getUTCDate(),first=(mo.getUTCDay()+6)%7;
 const ev=occurrences(mo,n);let h=`<div class="card"><button id="pm">Previous</button> <b>${MON[m]} ${y}</b> <button id="nm">Next</button>${yrNote(mo)}<table><tr>${"Mon Tue Wed Thu Fri Sat Sun".split(" ").map(x=>"<th>"+x+"</th>").join("")}</tr><tr>`;
 for(let i=0;i<first;i++)h+="<td></td>";for(let d=1;d<=n;d++){const dt=new Date(Date.UTC(y,m,d,12)),hh=H(dt),es=ev.filter(e=>iso(e.date)==iso(dt));h+=`<td class="${iso(dt)==iso(t)?"today":""}"><b>${d}</b><br><span class="mut">${hh.leap?"L":""}${hh.month}.${hh.day}</span>${es.map(e=>`<div class="ev">${esc(e.name)}</div>`).join("")}</td>`;if((first+d)%7==0)h+="</tr><tr>"}
 main.innerHTML=h+"</tr></table><p class='mut'>Small numbers are Heavenly Calendar month.day. L means a leap month.</p></div>";$("#pm").onclick=()=>{mo=new Date(Date.UTC(y,m-1,1,12));vMonth()};$("#nm").onclick=()=>{mo=new Date(Date.UTC(y,m+1,1,12));vMonth()}}
function vCustom(){const c=custom();main.innerHTML=`<div class="card"><h2>Add my event</h2><p class="mut">Saved only in this browser on this device. Use it for Ireland events.</p><input id="cn" placeholder="Event name"><input id="cd" type="date"><textarea id="cx" placeholder="Short description (optional)"></textarea><label><input id="cy" type="checkbox" style="width:auto"> Repeats every year on this Gregorian date</label><br><button id="ca">Add event</button></div>`+c.map((e,i)=>`<div class="card"><b>${esc(e.name)}</b> ${e.date}${e.yearly?" (yearly)":""}<br><span class="mut">${esc(e.desc||"")}</span><br><button data-del="${i}">Delete</button></div>`).join("");
 $("#ca").onclick=()=>{if(!$("#cn").value||!$("#cd").value)return alert("Please enter a name and a date.");c.push({name:$("#cn").value,date:$("#cd").value,desc:$("#cx").value,yearly:$("#cy").checked});localStorage.setItem("hc-custom",JSON.stringify(c));vCustom()};
 main.querySelectorAll("[data-del]").forEach(b=>b.onclick=()=>{c.splice(+b.dataset.del,1);localStorage.setItem("hc-custom",JSON.stringify(c));vCustom()})}
function vWidget(){const t=today(),h=H(t),e=occurrences(t,400)[0],n=e?Math.round((e.date-t)/864e5):0;main.innerHTML=`<div class="card widget"><div class="mut">Heavenly Calendar</div><div class="big">${h.leap?"Leap ":""}${h.month}.${h.day}</div><div>Cheon Il Guk year ${h.cig}</div><div class="mut">${gtxt(t)}</div><hr>${e?`<div>Next: <b>${esc(e.name)}</b></div><div class="big">${n==0?"Today":n+" days"}</div><div class="mut">${gtxt(e.date)}</div>`:""}</div>
<div class="card"><h3>Add to your home screen</h3><p><b>iPhone (Safari):</b> open this page with ?widget=1 at the end of the address, tap Share, then Add to Home Screen.</p><p><b>Android (Chrome):</b> tap the menu, then Install app or Add to Home screen. Long press the app icon for the Today card shortcut.</p><p><b>Desktop (Chrome or Edge):</b> click the install icon in the address bar.</p><p class="mut">Note: this is a web app. A true native home screen widget on iPhone or Android needs a native app from the App Store or Google Play, which this is not. The shortcut opens this compact card.</p></div>`}
function vSources(){main.innerHTML=`<div class="card"><h2>Sources and notes</h2>
<p><b>How dates are computed.</b> Every holy day is fixed to a date of the Heavenly Calendar, which follows the Korean lunar calendar (months of 29 or 30 days, with a leap month in some years). The app uses the browser's built in Korean lunar calendar (Intl.DateTimeFormat with the "dangi" calendar, from the ICU library). Cheon Il Guk years begin on 1.1 of the Heavenly Calendar, and year 1 is the lunar year that began in February 2013 (Foundation Day was 1.13, 22 February 2013), so year number = lunar year minus 2012.</p>
<p><b>Verification.</b> All 11 holy days of 2026 matched the published FFWPU Europe and Middle East 2026 calendar, and Foundation Day 2013, True Father's Seonghwa 2012 and the new year dates of 2025 and 2027 matched known dates. Dates outside 2012 to 2030 are shown with a "to be confirmed" note. Older browsers without the Korean calendar may show wrong dates.</p>
<p><b>Items marked to be confirmed:</b> True Parents' Day (3.1) and the exact title of the 6.13 holy day.</p>
<ul><li><a href="${SRC_EU}" target="_blank">Unificationist Calendar for 2026 with Holy Days and Ahn Shi Il, FFWPU Europe and Middle East Headquarters, 12 December 2025</a></li>
<li><a href="https://www.tparents.org/Library/Unification/Talks/Doo-26/Doo-260213.pdf" target="_blank">14th Year of Cheon Il Guk, FFWPU International, 13 February 2026</a></li>
<li><a href="${SRC_TPL}" target="_blank">Heavenly Calendar, True Parents Legacy</a></li></ul>
<p class="mut">Made for the Unification Movement in Ireland. Your own events are stored only on your device.</p></div>`}
const V={today:vToday,month:vMonth,list:vList,custom:vCustom,widget:vWidget,sources:vSources};
function show(v){(V[v]||vToday)()}
document.querySelectorAll("#nav button").forEach(b=>b.onclick=()=>show(b.dataset.v));
const th=localStorage.getItem("hc-theme");if(th)document.body.className=th;
$("#theme").onclick=()=>{const n=document.body.className=="dark"?"light":"dark";document.body.className=n;localStorage.setItem("hc-theme",n)};
if(new URLSearchParams(location.search).get("widget")){$("#nav").style.display="none";vWidget()}else vToday();
if("serviceWorker"in navigator)navigator.serviceWorker.register("sw.js");
