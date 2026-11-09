import type { Doctor } from '../../../shared/types/doctor'
import type { MedicalRecord, Prescription } from '../../../shared/types/medicalRecord'
import type { Patient } from '../../../shared/types/patient'
import { isValidIsoDate } from '../utils/date'

// ლოკალური JSON ფაილები public/data-ში. fetch რეალურ HTTP მოთხოვნას ქმნის;
// GitHub Raw JSON / MockAPI-ზე გადასასვლელად საკმარისია ამ ფაილის შეცვლა.
const DATA_URL = `${import.meta.env.BASE_URL}data`

type Guard<T> = (value: unknown) => value is T

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

export const isPatient: Guard<Patient> = (value): value is Patient =>
  isObject(value) &&
  isNonEmptyString(value.id) &&
  isNonEmptyString(value.fullName) &&
  typeof value.birthDate === 'string' &&
  isValidIsoDate(value.birthDate)

export const isMedicalRecord: Guard<MedicalRecord> = (value): value is MedicalRecord =>
  isObject(value) &&
  isNonEmptyString(value.id) &&
  isNonEmptyString(value.patientId) &&
  isNonEmptyString(value.doctorId) &&
  typeof value.visitDate === 'string' &&
  isValidIsoDate(value.visitDate) &&
  typeof value.title === 'string' &&
  typeof value.notes === 'string'

export const isPrescription: Guard<Prescription> = (value): value is Prescription =>
  isObject(value) &&
  isNonEmptyString(value.id) &&
  isNonEmptyString(value.recordId) &&
  isNonEmptyString(value.patientId) &&
  typeof value.medication === 'string' &&
  typeof value.instructions === 'string'

export const isDoctor: Guard<Doctor> = (value): value is Doctor =>
  isObject(value) &&
  isNonEmptyString(value.id) &&
  isNonEmptyString(value.fullName) &&
  typeof value.specialty === 'string'

/**
 * type assertion ვალიდაცია არ არის: პასუხი უნდა იყოს მასივი და
 * თითოეულ ელემენტს უნდა ჰქონდეს საჭირო ველები სწორი ტიპით.
 */
async function fetchList<T>(file: string, signal: AbortSignal, isItem: Guard<T>): Promise<T[]> {
  const response = await fetch(`${DATA_URL}/${file}`, { signal })
  if (!response.ok) {
    throw new Error(`${file}: HTTP ${response.status}`)
  }
  const data: unknown = await response.json()
  if (!Array.isArray(data)) {
    throw new Error(`${file}: პასუხი უნდა იყოს მასივი`)
  }
  const invalidIndex = data.findIndex((item) => !isItem(item))
  if (invalidIndex !== -1) {
    throw new Error(`${file}: არასწორი ფორმატი (ელემენტი #${invalidIndex})`)
  }
  return data as T[]
}

export async function getPatient(patientId: string, signal: AbortSignal): Promise<Patient> {
  const patients = await fetchList('patients.json', signal, isPatient)
  const patient = patients.find((item) => item.id === patientId)
  if (!patient) {
    throw new Error(`პაციენტი ${patientId} ვერ მოიძებნა`)
  }
  return patient
}

export async function getMedicalRecords(patientId: string, signal: AbortSignal): Promise<MedicalRecord[]> {
  const records = await fetchList('medicalRecords.json', signal, isMedicalRecord)
  return records.filter((record) => record.patientId === patientId)
}

export async function getPrescriptions(patientId: string, signal: AbortSignal): Promise<Prescription[]> {
  const prescriptions = await fetchList('prescriptions.json', signal, isPrescription)
  return prescriptions.filter((item) => item.patientId === patientId)
}

/** ექიმების სია (ელენეს doctors.json) — მხოლოდ ექიმის სახელისა და სპეციალობის საჩვენებლად. */
export function getDoctors(signal: AbortSignal): Promise<Doctor[]> {
  return fetchList('doctors.json', signal, isDoctor)
}
