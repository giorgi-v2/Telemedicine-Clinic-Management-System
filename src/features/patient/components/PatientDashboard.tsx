import { useCallback, useEffect, useMemo, useState } from 'react'
import type { MedicalRecord, Prescription } from '../../../shared/types/medicalRecord'
import { useMedicalRecords } from '../hooks/useMedicalRecords'
import { usePatientBookings } from '../hooks/usePatientBookings'
import { BookingList } from './BookingList'
import { Modal } from './Modal'
import { PatientSummary } from './PatientSummary'
import { PrescriptionForm } from './PrescriptionForm'
import { PrescriptionList } from './PrescriptionList'
import { RecordCard } from './RecordCard'
import { RecordForm } from './RecordForm'
import { StateMessage } from './StateMessage'

export interface PatientDashboardProps {
  patientId: string
  /** არასავალდებულო: "ჯავშნები არ არის" მდგომარეობის ღილაკი (App-ი მიჰყავს ექიმების გვერდზე). */
  onBrowseDoctors?: () => void
}

// დროებითი UI არჩევანი: ღია modal. მონაცემები (ჩანაწერები) Redux-შია და აქ არ კოპირდება.
type Editing = { type: 'record'; recordId: string } | { type: 'prescription' } | null

const NOTICE_VISIBLE_MS = 4000
const NO_PRESCRIPTIONS: Prescription[] = []

export function PatientDashboard({ patientId, onBrowseDoctors }: PatientDashboardProps) {
  const {
    patient,
    records,
    prescriptions,
    doctorLabels,
    isLoading,
    error,
    updateRecord,
    updatePrescription,
    retry,
  } = useMedicalRecords(patientId)
  const { bookings, status: bookingsStatus, retry: retryBookings } = usePatientBookings(patientId)

  const [editing, setEditing] = useState<Editing>(null)
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  // "ცვლილებები შენახულია ✓" რამდენიმე წამში ქრება; ტაიმერი გასუფთავდება.
  useEffect(() => {
    if (!saved) return
    const timer = setTimeout(() => setSaved(false), NOTICE_VISIBLE_MS)
    return () => clearTimeout(timer)
  }, [saved])

  // უახლესი ვიზიტი პირველია; sort აუცილებლად მასივის ასლზე (Redux state უცვლელია).
  const sortedRecords = useMemo(
    () => [...records].sort((a, b) => b.visitDate.localeCompare(a.visitDate) || b.id.localeCompare(a.id)),
    [records],
  )

  const prescriptionsByRecord = useMemo(() => {
    const groups = new Map<string, Prescription[]>()
    for (const prescription of prescriptions) {
      const group = groups.get(prescription.recordId)
      if (group) group.push(prescription)
      else groups.set(prescription.recordId, [prescription])
    }
    return groups
  }, [prescriptions])

  // გვერდით პანელში არჩეული ვიზიტი (ნაგულისხმევად უახლესი). სხვა პაციენტზე გადასვლისას
  // ძველი id ვერ მოიძებნება და ავტომატურად უახლესი ვიზიტი აირჩევა.
  const shownRecord = sortedRecords.find((record) => record.id === selectedRecordId) ?? sortedRecords[0] ?? null
  const shownPrescriptions = (shownRecord && prescriptionsByRecord.get(shownRecord.id)) ?? NO_PRESCRIPTIONS

  const editingRecord = editing?.type === 'record' ? records.find((record) => record.id === editing.recordId) : undefined

  const handleEditRecord = useCallback((record: MedicalRecord) => {
    setEditing({ type: 'record', recordId: record.id })
  }, [])
  const handleShowPrescriptions = useCallback((recordId: string) => setSelectedRecordId(recordId), [])
  const closeEditing = useCallback(() => setEditing(null), [])

  return (
    <div>
      <h1 className="text-[28px] leading-tight font-bold text-ink sm:text-4xl">პაციენტის ბარათი</h1>
      <p className="mt-3 mb-6 text-[15px] text-muted">შენი ისტორია, დანიშნულებები და მომავალი ვიზიტები.</p>

      {error ? (
        <StateMessage
          role="alert"
          tone="danger"
          title="მონაცემების ჩატვირთვის შეცდომა"
          description="პაციენტის მონაცემები ვერ ჩაიტვირთა."
          actionLabel="ხელახლა ცდა"
          onAction={retry}
        />
      ) : isLoading || !patient ? (
        <div aria-busy="true">
          <StateMessage
            title="პაციენტის მონაცემები იტვირთება"
            description="ბარათი, ისტორია და დანიშნულებები დროებით იტვირთება."
          />
        </div>
      ) : (
        <>
          <PatientSummary patient={patient} />

          <div role="status" aria-live="polite">
            {saved && (
              <p className="mt-4 inline-block rounded-md bg-success-soft px-3 py-1.5 text-xs font-medium text-success">
                ცვლილებები შენახულია ✓
              </p>
            )}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.72fr)_minmax(0,1fr)] lg:items-start">
            <section aria-labelledby="history-title" className="min-w-0">
              <h2 id="history-title" className="mb-4 text-2xl font-bold text-ink">
                სამედიცინო ისტორია
              </h2>
              {sortedRecords.length === 0 ? (
                <StateMessage
                  title="სამედიცინო ისტორია ცარიელია"
                  description="ვიზიტების ჩანაწერები აქ გამოჩნდება."
                />
              ) : (
                <ul className="flex list-none flex-col gap-4 p-0">
                  {sortedRecords.map((record) => (
                    <li key={record.id}>
                      <RecordCard
                        record={record}
                        prescriptions={prescriptionsByRecord.get(record.id) ?? NO_PRESCRIPTIONS}
                        doctorLabel={doctorLabels[record.doctorId]}
                        onEdit={handleEditRecord}
                        onShowPrescriptions={handleShowPrescriptions}
                        isPrescriptionsShown={shownRecord?.id === record.id}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <aside className="flex min-w-0 flex-col gap-4" aria-label="დანიშნულებები და ჯავშნები">
              <PrescriptionList
                record={shownRecord}
                prescriptions={shownPrescriptions}
                onEdit={() => setEditing({ type: 'prescription' })}
              />
              <BookingList
                bookings={bookings}
                status={bookingsStatus}
                doctorLabels={doctorLabels}
                onRetry={retryBookings}
                onBrowseDoctors={onBrowseDoctors}
              />
            </aside>
          </div>
        </>
      )}

      {editingRecord && (
        <Modal
          title="ჩანაწერის რედაქტირება"
          description="შეცვალე ინფორმაცია და შეინახე ცვლილება."
          onClose={closeEditing}
        >
          <RecordForm
            key={editingRecord.id}
            record={editingRecord}
            onCancel={closeEditing}
            onSubmit={(id, changes) => {
              updateRecord(id, changes)
              setSaved(true)
              closeEditing()
            }}
          />
        </Modal>
      )}

      {editing?.type === 'prescription' && shownPrescriptions.length > 0 && (
        <Modal
          title="დანიშნულების რედაქტირება"
          description="შეცვალე ინფორმაცია და შეინახე ცვლილება."
          onClose={closeEditing}
        >
          <PrescriptionForm
            prescriptions={shownPrescriptions}
            onCancel={closeEditing}
            onSubmit={(id, changes) => {
              updatePrescription(id, changes)
              setSaved(true)
              closeEditing()
            }}
          />
        </Modal>
      )}
    </div>
  )
}
