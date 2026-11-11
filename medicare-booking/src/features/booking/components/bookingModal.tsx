
import { useEffect, useState } from 'react';
import type { Doctor } from '../../../shared/types/doctor';
import type { AppointmentSlot } from '../../../shared/types/booking';
import { getSlots } from '../api/booking.api';
import { getTomorrowKey, toDateKey } from '../utils/bookingDates';
import Calendar from './Calendar';
import TimeSlotPicker from './TimeSlotPicker';
import styles from './BookingModal.module.scss';


interface BookingModalProps {
  doctor: Doctor;
  onClose: () => void;
}

export default function BookingModal({
  doctor,
  onClose,
}: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState(getTomorrowKey);
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [slots, setSlots] = useState<AppointmentSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    setSelectedSlotId('');
    setSlots([]);
    setLoading(true);
    setError('');

    getSlots(doctor.doctorId, selectedDate, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) {
          setSlots(result);
        }
      })
      .catch((err: unknown) => {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : 'დაფიქსირდა შეცდომა.'
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [doctor.doctorId, selectedDate, retryKey]);

  const changeDate = (date: string) => {
    setSelectedDate(date);
    setSelectedSlotId('');
    setSlots([]);
  };

  const selectedSlot = slots.find(
    (slot) => slot.id === selectedSlotId && slot.isAvailable
  );

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#19354a]">
          ვიზიტის დაჯავშნა
        </h1>

        <p className="mt-3 text-[#607d90]">
          აირჩიე მოსახერხებელი თარიღი და თავისუფალი დრო.
        </p>
      </div>

      <section
        className={`${styles.bookingCard} rounded-3xl border border-sky-100 bg-white p-5 sm:p-8`}
      >
        <div className="flex flex-wrap items-start gap-4 md:flex-nowrap md:items-center">
          <div className={styles.avatar} aria-hidden="true">
            {doctor.initials}
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h2 className="text-lg font-bold">
              {doctor.name}
            </h2>
            <p className="text-sm text-[#607d90]">
              {doctor.specialty}
            </p>
          </div>

          <div className="w-full md:w-auto">
            <p className="text-sm text-[#607d90]">
              {doctor.experienceYears} წლიანი გამოცდილება
            </p>
            <p className="mt-2 font-bold text-[#087fbd]">
              კონსულტაცია · {doctor.consultationPrice} ₾
            </p>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="ჯავშნის დახურვა"
          >
            ×
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <section>
            <h3 className="mb-4 text-lg font-bold">
              1. აირჩიე თარიღი
            </h3>

            <label
              htmlFor="visit-date"
              className="mb-2 block text-sm font-semibold"
            >
              ვიზიტის თარიღი
            </label>

            <input
              id="visit-date"
              type="date"
              value={selectedDate}
              min={toDateKey(new Date())}
              onChange={(event) => {
                const date = event.target.value;
                if (date && date >= toDateKey(new Date())) {
                  changeDate(date);
                }
              }}
              className="w-full rounded-lg border border-[#dce7ef] bg-white px-4 py-3 text-[#19354a] outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />

            <Calendar
              value={selectedDate}
              onChange={changeDate}
            />
          </section>

          <section>
            <h3 className="mb-4 text-lg font-bold">
              2. აირჩიე დრო
            </h3>

            <p className="mb-5 text-sm text-[#607d90]">
              თავისუფალი და დაკავებული საათები
            </p>

            <TimeSlotPicker
              slots={slots}
              selectedSlotId={selectedSlotId}
              loading={loading}
              error={error}
              onSelect={(slot) => setSelectedSlotId(slot.id)}
              onRetry={() => setRetryKey((key) => key + 1)}
            />

            {selectedSlot && (
              <div
                className="mt-6 rounded-xl border border-sky-200 bg-sky-50 p-4"
                role="status"
              >
                <p className="text-sm text-[#607d90]">
                  არჩეული ვიზიტის დრო
                </p>
                <strong className="mt-1 block text-lg text-[#087fbd]">
                  {selectedSlot.time}
                </strong>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
