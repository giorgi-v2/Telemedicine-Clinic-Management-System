
import type { Doctor } from '../../../shared/types/doctor';

import { useBookingForm } from '../hooks/useBookingForm';
import BookingForm from './BookingForm';

import styles from './BookingModal.module.scss';

interface BookingModalProps {
  doctor: Doctor;
  onClose: () => void;
}

export default function BookingModal({
  doctor,
  onClose,
}: BookingModalProps) {
  const {
    formik,
    slots,
    loading,
    error,
    changeDate,
    retry,
  } = useBookingForm(doctor.doctorId);

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

        <BookingForm
          formik={formik}
          slots={slots}
          loading={loading}
          error={error}
          onDateChange={changeDate}
          onRetry={retry}
        />
      </section>
    </main>
  );
}
