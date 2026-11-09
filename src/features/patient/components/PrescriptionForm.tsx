import { useId, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { Prescription, PrescriptionChanges } from '../../../shared/types/medicalRecord'
import { useSaveFeedback } from '../hooks/useSaveFeedback'
import { hasErrors, validatePrescriptionDraft } from '../utils/validation'
import { Button } from './Button'
import { fieldClasses } from './fieldStyles'
import { FormField } from './FormField'

export interface PrescriptionFormProps {
  /** არჩეული ვიზიტის დანიშნულებები (მინიმუმ ერთი). */
  prescriptions: Prescription[]
  onSubmit: (id: string, changes: PrescriptionChanges) => void
  onCancel: () => void
}

type Touched = Record<keyof PrescriptionChanges, boolean>
const UNTOUCHED: Touched = { medication: false, instructions: false }

function toDraft(prescription: Prescription): PrescriptionChanges {
  return { medication: prescription.medication, instructions: prescription.instructions }
}

export function PrescriptionForm({ prescriptions, onSubmit, onCancel }: PrescriptionFormProps) {
  const [selectedId, setSelectedId] = useState(prescriptions[0]?.id ?? '')
  const current = prescriptions.find((item) => item.id === selectedId) ?? prescriptions[0]

  const [values, setValues] = useState<PrescriptionChanges>(() => (current ? toDraft(current) : { medication: '', instructions: '' }))
  const [touched, setTouched] = useState<Touched>(UNTOUCHED)
  const [submitted, setSubmitted] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const selectId = useId()

  const { isSaving, startSaving } = useSaveFeedback(() => {
    if (!current) return
    onSubmit(current.id, { medication: values.medication.trim(), instructions: values.instructions.trim() })
  })

  const errors = validatePrescriptionDraft(values)
  const show = (field: keyof PrescriptionChanges) => (touched[field] || submitted ? errors[field] : undefined)
  const touch = (field: keyof PrescriptionChanges) => () => setTouched((prev) => ({ ...prev, [field]: true }))

  // სხვა დანიშნულების არჩევისას დროებითი ასლი ახალი დანიშნულებით იწყება.
  const handleSelect = (id: string) => {
    const next = prescriptions.find((item) => item.id === id)
    if (!next) return
    setSelectedId(id)
    setValues(toDraft(next))
    setTouched(UNTOUCHED)
    setSubmitted(false)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSaving || !current) return
    setSubmitted(true)
    if (hasErrors(errors)) {
      const firstInvalid = errors.medication ? 'medication' : 'instructions'
      const field = formRef.current?.elements.namedItem(firstInvalid)
      if (field instanceof HTMLElement) field.focus()
      return
    }
    startSaving()
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate>
      {prescriptions.length > 1 && (
        <div className="mb-4">
          <label htmlFor={selectId} className="mb-2 block text-[13px] font-semibold text-ink">
            დანიშნულება
          </label>
          <select
            id={selectId}
            value={current?.id ?? ''}
            disabled={isSaving}
            onChange={(event) => handleSelect(event.target.value)}
            className={fieldClasses(false)}
          >
            {prescriptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.medication}
              </option>
            ))}
          </select>
        </div>
      )}
      <FormField
        label="მედიკამენტი"
        name="medication"
        value={values.medication}
        onChange={(medication) => setValues((prev) => ({ ...prev, medication }))}
        onBlur={touch('medication')}
        error={show('medication')}
        disabled={isSaving}
      />
      <FormField
        label="მიღების ინსტრუქცია"
        name="instructions"
        multiline
        value={values.instructions}
        onChange={(instructions) => setValues((prev) => ({ ...prev, instructions }))}
        onBlur={touch('instructions')}
        error={show('instructions')}
        disabled={isSaving}
      />
      <div className="mt-6 flex flex-col gap-3">
        <Button type="submit" variant="primary" disabled={isSaving} className="w-full">
          {isSaving ? 'ინახება...' : 'ცვლილებების შენახვა'}
        </Button>
        <Button onClick={onCancel} disabled={isSaving} className="w-full">
          გაუქმება
        </Button>
      </div>
    </form>
  )
}
