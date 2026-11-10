
import { useState } from 'react';
import type { Doctor } from '../../../shared/types/doctor';
import { getTomorrowKey, toDateKey } from '../utils/bookingDates';
import Calendar from './Calendar';
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
                  setSelectedDate(date);
                }
              }}
              className="w-full rounded-lg border border-[#dce7ef] bg-white px-4 py-3 text-[#19354a] outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />

            <Calendar
              value={selectedDate}
              onChange={setSelectedDate}
            />
          </section>

          <section>
            <h3 className="mb-4 text-lg font-bold">
              2. აირჩიე დრო
            </h3>

            <div className={styles.placeholder}>
              <p className="font-semibold">
                თავისუფალი საათები
              </p>
              <p className="mt-2 text-sm text-[#607d90]">
                მომდევნო ეტაპზე აქ დაემატება
                დროის სლოტების არჩევა.
              </p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
