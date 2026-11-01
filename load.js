// Node loader: evaluates the browser scripts in this context.
const fs=require("fs"),vm=require("vm"),p=require("path");
for(const f of ["hc.js","events.js","quotes.js","core.js"])vm.runInThisContext(fs.readFileSync(p.join(__dirname,f),"utf8"),{filename:f});
module.exports=globalThis;
