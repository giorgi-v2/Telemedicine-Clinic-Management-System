
import type {Doctor} from '../../../shared/types/doctor';
import type {MedicalRecord,Prescription} from '../../../shared/types/medicalRecord';
import type {Patient} from '../../../shared/types/patient';
import {isValidIsoDate} from '../utils/date';

const DATA_URL=`${import.meta.env.BASE_URL}data`;
type Guard<T>=(v:unknown)=>v is T;

function isObject(v:unknown):v is Record<string,unknown>{return typeof v==='object'&&v!==null&&!Array.isArray(v)}
function isNonEmptyString(v:unknown):v is string{return typeof v==='string'&&v.trim().length>0}

export const isPatient:Guard<Patient>=(v):v is Patient=>isObject(v)&&isNonEmptyString(v.id)&&isNonEmptyString(v.fullName)&&typeof v.birthDate==='string'&&isValidIsoDate(v.birthDate);
export const isMedicalRecord:Guard<MedicalRecord>=(v):v is MedicalRecord=>isObject(v)&&isNonEmptyString(v.id)&&isNonEmptyString(v.patientId)&&isNonEmptyString(v.doctorId)&&typeof v.visitDate==='string'&&isValidIsoDate(v.visitDate)&&typeof v.title==='string'&&typeof v.notes==='string';
export const isPrescription:Guard<Prescription>=(v):v is Prescription=>isObject(v)&&isNonEmptyString(v.id)&&isNonEmptyString(v.recordId)&&isNonEmptyString(v.patientId)&&typeof v.medication==='string'&&typeof v.instructions==='string';
export const isDoctor:Guard<Doctor>=(v):v is Doctor=>isObject(v)&&isNonEmptyString(v.id)&&isNonEmptyString(v.fullName)&&typeof v.specialty==='string';

async function fetchList<T>(file:string,signal:AbortSignal,isItem:Guard<T>):Promise<T[]>{
const r=await fetch(`${DATA_URL}/${file}`,{signal});
if(!r.ok)throw new Error(`${file}: HTTP ${r.status}`);
const data:unknown=await r.json();
if(!Array.isArray(data))throw new Error(`${file}: პასუხი უნდა იყოს მასივი`);
const i=data.findIndex(x=>!isItem(x));
if(i!==-1)throw new Error(`${file}: არასწორი ფორმატი (ელემენტი #${i})`);
return data as T[];
}

export async function getPatient(id:string,signal:AbortSignal):Promise<Patient>{
const p=(await fetchList('patients.json',signal,isPatient)).find(x=>x.id===id);
if(!p)throw new Error(`პაციენტი ${id} ვერ მოიძებნა`);
return p;
}

export async function getMedicalRecords(id:string,signal:AbortSignal):Promise<MedicalRecord[]>{
return(await fetchList('medicalRecords.json',signal,isMedicalRecord)).filter(x=>x.patientId===id);
}

export async function getPrescriptions(id:string,signal:AbortSignal):Promise<Prescription[]>{
return(await fetchList('prescriptions.json',signal,isPrescription)).filter(x=>x.patientId===id);
}

export function getDoctors(signal:AbortSignal):Promise<Doctor[]>{
return fetchList('doctors.json',signal,isDoctor);
}
