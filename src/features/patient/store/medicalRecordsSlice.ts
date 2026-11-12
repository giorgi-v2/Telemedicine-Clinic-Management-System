
import {createSlice,nanoid} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type {Doctor} from '../../../shared/types/doctor';
import type {MedicalRecord,MedicalRecordChanges,NewRecordInput,Prescription,PrescriptionChanges} from '../../../shared/types/medicalRecord';
import type {Patient} from '../../../shared/types/patient';
import {todayIso} from '../utils/date';
import {fetchMedicalData} from './medicalRecordsThunks';

export type LoadStatus='idle'|'pending'|'succeeded'|'failed';
export interface MedicalRecordsState{
patient:Patient|null;
records:MedicalRecord[];
prescriptions:Prescription[];
doctors:Doctor[];
status:LoadStatus;
error:string|null;
loadedPatientId:string|null;
activeRequestId:string|null;
}

export const initialState:MedicalRecordsState={patient:null,records:[],prescriptions:[],doctors:[],status:'idle',error:null,loadedPatientId:null,activeRequestId:null};
export interface RecordUpdatePayload{id:string;changes:MedicalRecordChanges}
export interface PrescriptionUpdatePayload{id:string;changes:PrescriptionChanges}

const medicalRecordsSlice=createSlice({
name:'medicalRecords',
initialState,
reducers:{
recordAdded:{
reducer(state,action:PayloadAction<MedicalRecord>){
if(!state.records.some(r=>r.id===action.payload.id))state.records.push(action.payload);
},
prepare(input:NewRecordInput){
return{payload:{id:nanoid(),visitDate:todayIso(),...input} satisfies MedicalRecord};
}
},
recordUpdated(state,action:PayloadAction<RecordUpdatePayload>){
const r=state.records.find(x=>x.id===action.payload.id);
if(!r)return;
r.title=action.payload.changes.title;
r.notes=action.payload.changes.notes;
},
prescriptionUpdated(state,action:PayloadAction<PrescriptionUpdatePayload>){
const p=state.prescriptions.find(x=>x.id===action.payload.id);
if(!p)return;
p.medication=action.payload.changes.medication;
p.instructions=action.payload.changes.instructions;
}
},
extraReducers:builder=>{
builder
.addCase(fetchMedicalData.pending,(state,action)=>{
state.status='pending';
state.error=null;
state.activeRequestId=action.meta.requestId;
if(state.loadedPatientId!==action.meta.arg){
state.patient=null;
state.records=[];
state.prescriptions=[];
state.doctors=[];
state.loadedPatientId=action.meta.arg;
}
})
.addCase(fetchMedicalData.fulfilled,(state,action)=>{
if(state.activeRequestId!==action.meta.requestId)return;
state.patient=action.payload.patient;
state.records=action.payload.records;
state.prescriptions=action.payload.prescriptions;
state.doctors=action.payload.doctors;
state.status='succeeded';
state.activeRequestId=null;
})
.addCase(fetchMedicalData.rejected,(state,action)=>{
if(state.activeRequestId!==action.meta.requestId)return;
state.activeRequestId=null;
if(action.meta.aborted||action.error.name==='AbortError'){state.status='idle';return}
state.status='failed';
state.error=action.error.message??'მონაცემების ჩატვირთვა ვერ მოხერხდა';
});
}
});

export const {recordAdded,recordUpdated,prescriptionUpdated}=medicalRecordsSlice.actions;
export default medicalRecordsSlice.reducer;
