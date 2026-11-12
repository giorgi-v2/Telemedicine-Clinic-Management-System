
export interface MedicalRecord{id:string;patientId:string;doctorId:string;visitDate:string;title:string;notes:string}
export interface Prescription{id:string;recordId:string;patientId:string;medication:string;instructions:string}
export type MedicalRecordChanges=Pick<MedicalRecord,'title'|'notes'>;
export type PrescriptionChanges=Pick<Prescription,'medication'|'instructions'>;
export type NewRecordInput=Pick<MedicalRecord,'patientId'|'doctorId'|'title'|'notes'>;
