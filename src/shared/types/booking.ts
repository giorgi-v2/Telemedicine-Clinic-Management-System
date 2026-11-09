// დროებითი ტიპი: Booking ეთოს მოდულს ეკუთვნის. მერჯისას ეთოს ტიპით ჩაანაცვლეთ.
// bookingsSlice და PatientDashboard იყენებენ id, patientId, doctorId, date, time, status ველებს.
export type BookingStatus = 'confirmed' | 'pending' | 'cancelled'

export interface Booking {
  id: string // მაგ. "MC-2026-1042"
  patientId: string
  doctorId: string
  slotId: string
  date: string // YYYY-MM-DD
  time: string // HH:mm
  status: BookingStatus
}
