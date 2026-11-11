
import type {
  AppointmentSlot,
  Booking,
  CreateBookingInput,
} from '../../../shared/types/booking';

import { toDateKey } from '../utils/bookingDates';

const STORAGE_KEY = 'clinic_demo_bookings_v1';

interface SlotTemplate {
  time: string;
  isAvailable: boolean;
}

interface DoctorSchedule {
  doctorId: string;
  weekdays: number[];
  slots: SlotTemplate[];
}

interface SlotsResponse {
  schedules: DoctorSchedule[];
}

export class SlotUnavailableError extends Error {
  constructor() {
    super('არჩეული საათი უკვე დაკავებულია ან მიუწვდომელია.');
    this.name = 'SlotUnavailableError';
  }
}

// შენახული ჯავშნების წაკითხვა
export function getBookings(): Booking[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return [];

    const parsed: unknown = JSON.parse(saved);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is Booking => {
      if (typeof item !== 'object' || item === null) {
        return false;
      }

      return (
        typeof item.id === 'string' &&
        typeof item.doctorId === 'string' &&
        typeof item.patientId === 'string' &&
        typeof item.slotId === 'string' &&
        typeof item.date === 'string' &&
        typeof item.time === 'string' &&
        typeof item.comment === 'string' &&
        (item.status === 'confirmed' ||
          item.status === 'cancelled')
      );
    });
  } catch {
    return [];
  }
}

// შემოწმება: არსებობს თუ არა დაკავებული დრო
function isSlotBooked(
  bookings: Booking[],
  doctorId: string,
  date: string,
  time: string
): boolean {
  return bookings.some(
    (booking) =>
      booking.doctorId === doctorId &&
      booking.date === date &&
      booking.time === time &&
      booking.status === 'confirmed'
  );
}

// ექიმის თავისუფალი დროების წამოღება
export async function getSlots(
  doctorId: string,
  date: string,
  signal?: AbortSignal
): Promise<AppointmentSlot[]> {
  const response = await fetch(
    `${import.meta.env.BASE_URL}data/slots.json`,
    { signal }
  );

  if (!response.ok) {
    throw new Error(
      'დროის სლოტების ჩატვირთვა ვერ მოხერხდა.'
    );
  }

  const data = (await response.json()) as SlotsResponse;

  if (!Array.isArray(data.schedules)) {
    throw new Error('განრიგის მონაცემები არასწორია.');
  }

  const selectedDate = new Date(`${date}T00:00:00`);

  if (
    Number.isNaN(selectedDate.getTime()) ||
    toDateKey(selectedDate) !== date
  ) {
    throw new Error('არასწორი თარიღია.');
  }

  const schedule = data.schedules.find(
    (item) => item.doctorId === doctorId
  );

  if (!schedule) return [];

  if (
    !Array.isArray(schedule.weekdays) ||
    !Array.isArray(schedule.slots)
  ) {
    throw new Error('ექიმის განრიგი არასწორია.');
  }

  if (!schedule.weekdays.includes(selectedDate.getDay())) {
    return [];
  }

  const bookings = getBookings();
  const now = new Date();
  const todayKey = toDateKey(now);

  const currentMinutes =
    now.getHours() * 60 + now.getMinutes();

  return schedule.slots.map((slot) => {
    const [hours, minutes] = slot.time
      .split(':')
      .map(Number);

    const slotMinutes = hours * 60 + minutes;

    const isPastTime =
      date < todayKey ||
      (date === todayKey &&
        slotMinutes <= currentMinutes);

    const alreadyBooked = isSlotBooked(
      bookings,
      doctorId,
      date,
      slot.time
    );

    return {
      id: `${doctorId}-${date}-${slot.time}`,
      doctorId,
      date,
      time: slot.time,
      isAvailable:
        slot.isAvailable &&
        !isPastTime &&
        !alreadyBooked,
    };
  });
}

// ახალი ჯავშნის შექმნა და შენახვა
export async function createBooking(
  input: CreateBookingInput
): Promise<Booking> {
  if (!input.doctorId || !input.patientId) {
    throw new Error('ჯავშნის მონაცემები არასრულია.');
  }

  // გაგზავნის მომენტში ხელახლა ვამოწმებთ საათს.
  const slots = await getSlots(
    input.doctorId,
    input.date
  );

  const selectedSlot = slots.find(
    (slot) =>
      slot.id === input.slotId &&
      slot.doctorId === input.doctorId &&
      slot.date === input.date &&
      slot.isAvailable
  );

  if (!selectedSlot) {
    throw new SlotUnavailableError();
  }

  const currentBookings = getBookings();

  // მეორე შემოწმება შენახვამდე.
  if (
    isSlotBooked(
      currentBookings,
      input.doctorId,
      input.date,
      selectedSlot.time
    )
  ) {
    throw new SlotUnavailableError();
  }

  const booking: Booking = {
    id: `MC-${crypto.randomUUID()}`,
    doctorId: input.doctorId,
    patientId: input.patientId,
    slotId: selectedSlot.id,
    date: selectedSlot.date,
    time: selectedSlot.time,
    comment: input.comment.trim(),
    status: 'confirmed',
  };

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([...currentBookings, booking])
    );
  } catch {
    throw new Error(
      'ჯავშნის შენახვა ვერ მოხერხდა. სცადე ხელახლა.'
    );
  }

  return booking;
}
