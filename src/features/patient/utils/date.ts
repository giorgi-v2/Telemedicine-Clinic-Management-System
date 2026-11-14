
const MONTHS=['იანვარი','თებერვალი','მარტი','აპრილი','მაისი','ივნისი','ივლისი','აგვისტო','სექტემბერი','ოქტომბერი','ნოემბერი','დეკემბერი'] as const;
const ISO_DATE=/^(\d{4})-(\d{2})-(\d{2})$/;
interface DateParts{year:number;month:number;day:number}

function parseIsoDate(v:string):DateParts|null{
const m=ISO_DATE.exec(v);
if(!m)return null;
const year=Number(m[1]),month=Number(m[2]),day=Number(m[3]);
if(month<1||month>12||day<1)return null;
if(day>new Date(Date.UTC(year,month,0)).getUTCDate())return null;
return{year,month,day};
}

export function isValidIsoDate(v:string):boolean{return parseIsoDate(v)!==null}
export function formatLongDate(v:string):string{
const p=parseIsoDate(v);
return p?`${p.day} ${MONTHS[p.month-1]}, ${p.year}`:v;
}
export function formatDayMonth(v:string):string{
const p=parseIsoDate(v);
return p?`${p.day} ${MONTHS[p.month-1]}`:v;
}
export function todayIso(now:Date=new Date()):string{
const month=String(now.getMonth()+1).padStart(2,'0'),day=String(now.getDate()).padStart(2,'0');
return `${now.getFullYear()}-${month}-${day}`;
}
