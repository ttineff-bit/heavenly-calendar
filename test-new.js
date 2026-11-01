const G=require("./load.js"),fs=require("fs"),A=require("assert");
// quotes
const Q=G.QUOTES;A(Q.length>=100);for(const q of Q){for(const k of["text","speaker","source","date","place","link"])A(q[k],k);A(q.verified===true);A(!/[\u2013\u2014]/.test(JSON.stringify(q)));A(/^https:\/\/www\.tparents\.org\//.test(q.link))}
const d=s=>new Date(s+"T12:00:00Z");A.equal(G.CORE.quoteFor(d("2026-01-01")),Q[0]);A.equal(G.CORE.quoteFor(d("2027-01-01")),Q[0]);A.equal(G.CORE.quoteFor(d("2026-12-31")),Q[364%Q.length]);
// ics
const t=fs.readFileSync("heavenly-calendar.ics","utf8");A(t.endsWith("\r\n"));const ls=t.split("\r\n").slice(0,-1);
for(const l of ls)A(Buffer.byteLength(l)<=75,l);A(!/[^\r]\n/.test(t));
const un=ls.reduce((a,l)=>(l[0]==" "?a[a.length-1]+=l.slice(1):a.push(l),a),[]);
A.equal(un[0],"BEGIN:VCALENDAR");A.equal(un.at(-1),"END:VCALENDAR");const st=[];for(const l of un){if(l.startsWith("BEGIN:"))st.push(l.slice(6));if(l.startsWith("END:"))A.equal(st.pop(),l.slice(4))}A.equal(st.length,0);
const ev=t.split("BEGIN:VEVENT").length-1;A.equal(ev,60);A.equal(t.split("BEGIN:VALARM").length-1,120);
const uids=un.filter(l=>l.startsWith("UID:"));A.equal(new Set(uids).size,ev);
A(un.includes("DTSTART;VALUE=DATE:20261109"));// True Children's Day 2026 (10.1)
// lookahead
const w=G.CORE.lookahead(d("2026-11-01"),"week");A(w.text.includes("True Children's Day"));A(!/[\u2013\u2014]/.test(w.text+w.html));
for(let i=1;i<=366;i++){const q=G.CORE.quoteFor(new Date(Date.UTC(2028,0,i,12)));A(q,"day "+i);for(const k of["text","speaker","source","date","place","occasion","link"])A(q[k],k+" day "+i)}
console.log("366 days OK;","all new tests passed:",Q.length,"quotes,",ev,"events");
