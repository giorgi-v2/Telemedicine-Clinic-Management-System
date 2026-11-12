
import {useCallback,useEffect,useMemo} from 'react';
import {useAppDispatch,useAppSelector} from '../../../app/hooks';
import type {MedicalRecord,MedicalRecordChanges,NewRecordInput,Prescription,PrescriptionChanges} from '../../../shared/types/medicalRecord';
import type {Patient} from '../../../shared/types/patient';
import {prescriptionUpdated,recordAdded,recordUpdated} from '../store/medicalRecordsSlice';
import {fetchMedicalData} from '../store/medicalRecordsThunks';

const NO_RECORDS:MedicalRecord[]=[];
const NO_PRESCRIPTIONS:Prescription[]=[];

export interface UseMedicalRecordsResult{
patient:Patient|null;
records:MedicalRecord[];
prescriptions:Prescription[];
doctorLabels:Record<string,string>;
isLoading:boolean;
error:string|null;
addRecord:(input:Omit<NewRecordInput,'patientId'>)=>void;
updateRecord:(id:string,changes:MedicalRecordChanges)=>void;
updatePrescription:(id:string,changes:PrescriptionChanges)=>void;
retry:()=>void;
}

export function useMedicalRecords(patientId:string):UseMedicalRecordsResult{
const dispatch=useAppDispatch();
const slice=useAppSelector(s=>s.medicalRecords);

useEffect(()=>{const r=dispatch(fetchMedicalData(patientId));return()=>r.abort()},[dispatch,patientId]);

const isCurrent=slice.loadedPatientId===patientId;
const isLoading=!isCurrent||slice.status==='pending'||slice.status==='idle';
const error=isCurrent&&slice.status==='failed'?(slice.error??'შეცდომა'):null;
const doctors=isCurrent?slice.doctors:null;

const doctorLabels=useMemo(()=>{
const labels:Record<string,string>={};
for(const d of doctors??[])labels[d.id]=`${d.fullName} · ${d.specialty}`;
return labels;
},[doctors]);

const addRecord=useCallback((input:Omit<NewRecordInput,'patientId'>)=>{dispatch(recordAdded({...input,patientId}))},[dispatch,patientId]);
const updateRecord=useCallback((id:string,changes:MedicalRecordChanges)=>{dispatch(recordUpdated({id,changes}))},[dispatch]);
const updatePrescription=useCallback((id:string,changes:PrescriptionChanges)=>{dispatch(prescriptionUpdated({id,changes}))},[dispatch]);
const retry=useCallback(()=>{void dispatch(fetchMedicalData(patientId))},[dispatch,patientId]);

return {
patient:isCurrent&&slice.status==='succeeded'?slice.patient:null,
records:isCurrent?slice.records:NO_RECORDS,
prescriptions:isCurrent?slice.prescriptions:NO_PRESCRIPTIONS,
doctorLabels,isLoading,error,addRecord,updateRecord,updatePrescription,retry
};
}
