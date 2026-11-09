import type { MedicalRecordChanges, PrescriptionChanges } from '../../../shared/types/medicalRecord'

export const TITLE_MAX_LENGTH = 120
export const TEXT_MAX_LENGTH = 1000

export type FieldErrors<T> = Partial<Record<keyof T, string>>

export function validateRecordDraft(draft: MedicalRecordChanges): FieldErrors<MedicalRecordChanges> {
  const errors: FieldErrors<MedicalRecordChanges> = {}
  const title = draft.title.trim()
  const notes = draft.notes.trim()

  if (title.length === 0) errors.title = 'ეს ველი სავალდებულოა.'
  else if (title.length > TITLE_MAX_LENGTH) errors.title = `სათაური არ უნდა აღემატებოდეს ${TITLE_MAX_LENGTH} სიმბოლოს.`

  if (notes.length === 0) errors.notes = 'აღწერა არ უნდა იყოს ცარიელი.'
  else if (notes.length > TEXT_MAX_LENGTH) errors.notes = `აღწერა არ უნდა აღემატებოდეს ${TEXT_MAX_LENGTH} სიმბოლოს.`

  return errors
}

export function validatePrescriptionDraft(draft: PrescriptionChanges): FieldErrors<PrescriptionChanges> {
  const errors: FieldErrors<PrescriptionChanges> = {}
  const medication = draft.medication.trim()
  const instructions = draft.instructions.trim()

  if (medication.length === 0) errors.medication = 'ეს ველი სავალდებულოა.'
  else if (medication.length > TITLE_MAX_LENGTH) errors.medication = `დასახელება არ უნდა აღემატებოდეს ${TITLE_MAX_LENGTH} სიმბოლოს.`

  if (instructions.length === 0) errors.instructions = 'ინსტრუქცია არ უნდა იყოს ცარიელი.'
  else if (instructions.length > TEXT_MAX_LENGTH) errors.instructions = `ინსტრუქცია არ უნდა აღემატებოდეს ${TEXT_MAX_LENGTH} სიმბოლოს.`

  return errors
}

export function hasErrors<T extends object>(errors: T): boolean {
  return Object.keys(errors).length > 0
}
