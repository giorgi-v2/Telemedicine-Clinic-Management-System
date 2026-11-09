import { createAsyncThunk } from '@reduxjs/toolkit'
import type { Doctor } from '../../../shared/types/doctor'
import type { MedicalRecord, Prescription } from '../../../shared/types/medicalRecord'
import type { Patient } from '../../../shared/types/patient'
import { getDoctors, getMedicalRecords, getPatient, getPrescriptions } from '../api/medicalRecords.api'
import type { MedicalRecordsState } from './medicalRecordsSlice'

export interface MedicalData {
  patient: Patient
  records: MedicalRecord[]
  prescriptions: Prescription[]
  doctors: Doctor[]
}

/**
 * ექიმის სახელი მხოლოდ ბარათების გასაფორმებლად გვჭირდება, ამიტომ doctors.json-ის
 * ჩავარდნა მთელ ბარათს არ აფუჭებს (ჩანაწერებზე გამოჩნდება ნაგულისხმევი ტექსტი).
 * გაუქმებას კი ვატარებთ ზემოთ, რომ thunk სწორად გაუქმდეს.
 */
async function getDoctorsOrEmpty(signal: AbortSignal): Promise<Doctor[]> {
  try {
    return await getDoctors(signal)
  } catch (error) {
    if (signal.aborted) throw error
    return []
  }
}

export const fetchMedicalData = createAsyncThunk<
  MedicalData,
  string, // patientId
  { state: { medicalRecords: MedicalRecordsState } }
>(
  'medicalRecords/fetchMedicalData',
  async (patientId, { signal }) => {
    // დამოუკიდებელი მოთხოვნები ერთად; signal ყველა fetch-ს გადაეცემა.
    const [patient, records, prescriptions, doctors] = await Promise.all([
      getPatient(patientId, signal),
      getMedicalRecords(patientId, signal),
      getPrescriptions(patientId, signal),
      getDoctorsOrEmpty(signal),
    ])
    return { patient, records, prescriptions, doctors }
  },
  {
    // უკვე ჩატვირთული პაციენტის ხელახლა წამოღება სესიაში გაკეთებულ ცვლილებებს გადაწერდა.
    // "pending" მდგომარეობას არ ვბლოკავთ, რომ StrictMode-ის მეორე გაშვება ჩვეულებრივ იმუშაოს.
    condition: (patientId, { getState }) => {
      const { loadedPatientId, status } = getState().medicalRecords
      return !(loadedPatientId === patientId && status === 'succeeded')
    },
  },
)
