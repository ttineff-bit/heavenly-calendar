#!/usr/bin/env node
// Usage: node lookahead.js [YYYY-MM-DD] [week|month] [text|html|both]
// Default: today, week, both. Month mode starts on the given date and runs to the end of that month.
const G=require("./load.js");const a=process.argv.slice(2);
const n=new Date(),s=a[0]&&/^\d{4}-\d\d-\d\d$/.test(a[0])?a[0]:`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`;
const mode=a.includes("month")?"month":"week",fmt=a.includes("text")?"text":a.includes("html")?"html":"both";
const r=G.CORE.lookahead(new Date(s+"T12:00:00Z"),mode);
if(fmt!="html")console.log(r.text);if(fmt=="both")console.log("----- HTML -----");if(fmt!="text")console.log(r.html);
