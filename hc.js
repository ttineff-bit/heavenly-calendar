// Heavenly Calendar conversion: Korean lunar calendar via Intl "dangi" (ICU), evaluated at noon UTC of the civil date.
(function(g){
const fmt=new Intl.DateTimeFormat("en-u-ca-dangi",{timeZone:"UTC",year:"numeric",month:"numeric",day:"numeric"});
function toHeavenly(y,m,d){const p=fmt.formatToParts(new Date(Date.UTC(y,m-1,d,12)));let mo=p.find(x=>x.type=="month").value,da=+p.find(x=>x.type=="day").value,ry=+(p.find(x=>x.type=="relatedYear")||p.find(x=>x.type=="year")).value;const leap=/\D/.test(mo);mo=parseInt(mo);return{month:mo,day:da,leap,lunarYear:ry,cig:ry-2012};}
function toGregorian(lunarYear,month,day){// search the Gregorian year range for a non-leap lunar month/day
 for(let t=Date.UTC(lunarYear,0,15,12);t<Date.UTC(lunarYear+1,2,1);t+=864e5){const x=new Date(t),h=toHeavenly(x.getUTCFullYear(),x.getUTCMonth()+1,x.getUTCDate());if(h.lunarYear==lunarYear&&h.month==month&&h.day==day&&!h.leap)return x;}return null;}
g.HC={toHeavenly,toGregorian};
})(typeof window!="undefined"?window:globalThis);
