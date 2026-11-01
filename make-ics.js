// Writes heavenly-calendar.ics: holy days 2026 to 2030 with alarms one day before and on the day (09:00).
// Usage: node make-ics.js
const G=require("./load.js"),fs=require("fs");
const fold=l=>{const b=Buffer.from(l,"utf8");if(b.length<=75)return l;let out=[],cur="",n=0,lim=75;for(const ch of l){const c=Buffer.byteLength(ch);if(n+c>lim){out.push(cur);cur=" ";n=1;lim=75}cur+=ch;n+=c}out.push(cur);return out.join("\r\n")};
const tx=s=>String(s).replace(/[\u2013\u2014]/g,",").replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\r?\n/g,"\\n");
const d8=d=>d.toISOString().slice(0,10).replace(/-/g,"");
const L=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//UM Ireland//Heavenly Calendar//EN","CALSCALE:GREGORIAN","METHOD:PUBLISH","X-WR-CALNAME:Heavenly Calendar holy days","X-WR-TIMEZONE:Europe/Dublin","REFRESH-INTERVAL;VALUE=DURATION:P7D","X-PUBLISHED-TTL:P7D"];
const stamp="20261101T000000Z";let n=0;
for(let y=2026;y<=2030;y++)for(const e of G.EVENTS){const g=G.HC.toGregorian(y,e.m,e.d);if(!g)continue;const nx=new Date(g.getTime()+864e5);n++;
 const tbc=e.status=="tbc"?" (to be confirmed)":"";
 L.push("BEGIN:VEVENT",`UID:hc-${y}-${e.m}-${e.d}@ttineff-bit.github.io`,`DTSTAMP:${stamp}`,`DTSTART;VALUE=DATE:${d8(g)}`,`DTEND;VALUE=DATE:${d8(nx)}`,
 "SUMMARY:"+tx(e.name+tbc),"DESCRIPTION:"+tx(`Heavenly Calendar ${e.m}.${e.d}. ${e.desc}${tbc?" Date or title to be confirmed.":""}${e.src?" Source: "+e.src:""}`),"TRANSP:TRANSPARENT",
 "BEGIN:VALARM","ACTION:DISPLAY","TRIGGER:-P1D","DESCRIPTION:"+tx("Tomorrow: "+e.name),"END:VALARM",
 "BEGIN:VALARM","ACTION:DISPLAY","TRIGGER:PT9H","DESCRIPTION:"+tx("Today: "+e.name),"END:VALARM","END:VEVENT")}
L.push("END:VCALENDAR");fs.writeFileSync(__dirname+"/heavenly-calendar.ics",L.map(fold).join("\r\n")+"\r\n");console.log("events:",n);
