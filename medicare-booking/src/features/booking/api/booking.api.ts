
import type { AppointmentSlot } from '../../../shared/types/booking';
import { toDateKey } from '../utils/bookingDates';

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
    throw new Error('დროის სლოტების ჩატვირთვა ვერ მოხერხდა.');
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

  if (
    !schedule ||
    !schedule.weekdays.includes(selectedDate.getDay())
  ) {
    return [];
  }

  const now = new Date();
  const todayKey = toDateKey(now);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return schedule.slots.map((slot) => {
    const [hours, minutes] = slot.time.split(':').map(Number);
    const slotMinutes = hours * 60 + minutes;

    const isPastTime =
      date < todayKey ||
      (date === todayKey && slotMinutes <= currentMinutes);

    return {
      id: `${doctorId}-${date}-${slot.time}`,
      doctorId,
      date,
      time: slot.time,
      isAvailable: slot.isAvailable && !isPastTime,
    };
  });
}
