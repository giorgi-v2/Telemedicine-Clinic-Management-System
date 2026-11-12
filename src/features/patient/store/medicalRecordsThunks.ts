
import {createAsyncThunk} from '@reduxjs/toolkit';
import type {Doctor} from '../../../shared/types/doctor';
import type {MedicalRecord,Prescription} from '../../../shared/types/medicalRecord';
import type {Patient} from '../../../shared/types/patient';
import {getDoctors,getMedicalRecords,getPatient,getPrescriptions} from '../api/medicalRecords.api';
import type {MedicalRecordsState} from './medicalRecordsSlice';

export interface MedicalData{patient:Patient;records:MedicalRecord[];prescriptions:Prescription[];doctors:Doctor[]}

async function getDoctorsOrEmpty(signal:AbortSignal):Promise<Doctor[]>{
try{return await getDoctors(signal)}
catch(e){if(signal.aborted)throw e;return []}
}

export const fetchMedicalData=createAsyncThunk<MedicalData,string,{state:{medicalRecords:MedicalRecordsState}}>(
'medicalRecords/fetchMedicalData',
async(patientId,{signal})=>{
const [patient,records,prescriptions,doctors]=await Promise.all([
getPatient(patientId,signal),
getMedicalRecords(patientId,signal),
getPrescriptions(patientId,signal),
getDoctorsOrEmpty(signal)
]);
return{patient,records,prescriptions,doctors};
},
{condition:(patientId,{getState})=>{
const {loadedPatientId,status}=getState().medicalRecords;
return !(loadedPatientId===patientId&&status==='succeeded');
}}
);
