// ⚠ დროებითი ჩანაცვლება: ეს ფაილი ეთოს (სტუდენტი 2) booking.api.ts-ია.
// ჩემი bookingsSlice მხოლოდ getBookings(): Promise<Booking[]> ხელშეკრულებას იყენებს.
// მერჯისას ეთოს ფაილით ჩაანაცვლეთ (გზა/ექსპორტის სახელები შეათანხმეთ).
import type { Booking } from '../shared/types/booking'

const STORAGE_KEY = 'medicare.bookings'
const SEED_URL = `${import.meta.env.BASE_URL}data/bookings.json`

function isBooking(value: unknown): value is Booking {
  if (typeof value !== 'object' || value === null) return false
  const item = value as Record<string, unknown>
  return (
    typeof item.id === 'string' &&
    typeof item.patientId === 'string' &&
    typeof item.doctorId === 'string' &&
    typeof item.slotId === 'string' &&
    typeof item.date === 'string' &&
    typeof item.time === 'string' &&
    (item.status === 'confirmed' || item.status === 'pending' || item.status === 'cancelled')
  )
}

function readSaved(): Booking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(isBooking) : []
  } catch {
    return []
  }
}

async function readSeed(): Promise<Booking[]> {
  const response = await fetch(SEED_URL)
  if (!response.ok) throw new Error(`bookings.json: HTTP ${response.status}`)
  const data: unknown = await response.json()
  return Array.isArray(data) ? data.filter(isBooking) : []
}

/** საწყისი სატესტო ჯავშნები + localStorage-ში შენახულები, id-ით გაერთიანებული. */
export async function getBookings(): Promise<Booking[]> {
  const [seed, saved] = await Promise.all([readSeed(), Promise.resolve(readSaved())])
  const byId = new Map<string, Booking>()
  for (const booking of [...seed, ...saved]) byId.set(booking.id, booking)
  return [...byId.values()]
}

/** ჯავშნის შენახვა demo localStorage-ში (ეთოს ფორმა იგივეს აკეთებს). */
export async function saveBooking(booking: Booking): Promise<Booking> {
  const saved = readSaved().filter((item) => item.id !== booking.id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...saved, booking]))
  return booking
}
