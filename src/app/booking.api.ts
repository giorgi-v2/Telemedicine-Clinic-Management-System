import type { Booking } from '../shared/types/booking';
const STORAGE_KEY='medicare.bookings',SEED_URL=`${import.meta.env.BASE_URL}data/bookings.json`;
function isBooking(v:unknown):v is Booking {
if(typeof v!=='object'||v===null)return false;
const x=v as Record<string,unknown>;
return typeof x.id==='string'&&typeof x.patientId==='string'&&typeof x.doctorId==='string'&&typeof x.slotId==='string'&&typeof x.date==='string'&&typeof x.time==='string'&&['confirmed','pending','cancelled'].includes(x.status as string);
}
function readSaved():Booking[]{
try{
const raw=localStorage.getItem(STORAGE_KEY);
if(!raw)return [];
const data:unknown=JSON.parse(raw);
return Array.isArray(data)?data.filter(isBooking):[];
}catch{return [];}
}
async function readSeed():Promise<Booking[]>{
const r=await fetch(SEED_URL);
if(!r.ok)throw new Error(`bookings.json: HTTP ${r.status}`);
const data:unknown=await r.json();
return Array.isArray(data)?data.filter(isBooking):[];
}
export async function getBookings():Promise<Booking[]>{
const [seed,saved]=await Promise.all([readSeed(),Promise.resolve(readSaved())]);
const map=new Map<string,Booking>();
for(const b of [...seed,...saved])map.set(b.id,b);
return [...map.values()];
}
export async function saveBooking(b:Booking):Promise<Booking>{
localStorage.setItem(STORAGE_KEY,JSON.stringify([...readSaved().filter(x=>x.id!==b.id),b]));
return b;
}
