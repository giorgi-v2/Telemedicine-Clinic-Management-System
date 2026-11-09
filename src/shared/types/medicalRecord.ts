export interface MedicalRecord {
  id: string
  patientId: string
  doctorId: string
  visitDate: string // YYYY-MM-DD
  title: string
  notes: string
}

export interface Prescription {
  id: string
  recordId: string
  patientId: string
  medication: string
  instructions: string
}

/** რედაქტირებადი ველები — slice-ის payload სწორედ ამით შემოიფარგლება. */
export type MedicalRecordChanges = Pick<MedicalRecord, 'title' | 'notes'>
export type PrescriptionChanges = Pick<Prescription, 'medication' | 'instructions'>

/** ახალი სატესტო ჩანაწერის შესატანი მონაცემები (id და visitDate prepare-ში იქმნება). */
export type NewRecordInput = Pick<MedicalRecord, 'patientId' | 'doctorId' | 'title' | 'notes'>
