
import type { Booking } from '../../../shared/types/booking';
import type { Doctor } from '../../../shared/types/doctor';

import { useBookingForm } from '../hooks/useBookingForm';

import BookingForm from './BookingForm';
import BookingSuccess from './BookingSuccess';

import styles from './bookingModal.module.scss';

interface BookingModalProps {
  doctor: Doctor;
  patientId: string;
  onClose: () => void;
  onBooked: (booking: Booking) => void;
}

export default function BookingModal({
  doctor,
  patientId,
  onClose,
  onBooked,
}: BookingModalProps) {
  const {
    formik,
    slots,
    loading,
    error,
    changeDate,
    retry,
    successBooking,
    resetBooking,
  } = useBookingForm({
    doctorId: doctor.id,
    patientId,
    onBooked,
  });

  if (successBooking) {
    return (
      <BookingSuccess
        booking={successBooking}
        doctor={doctor}
        onNewBooking={resetBooking}
        onClose={onClose}
      />
    );
  }

  return (

<main className="mx-auto w-full max-w-252.5 px-4 pb-16 pt-10 sm:px-6 sm:pt-12">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#19354a]">
          ვიზიტის დაჯავშნა
        </h1>

        <p className="mt-3 text-[#607d90]">
          აირჩიე მოსახერხებელი თარიღი და თავისუფალი დრო.
        </p>
      </div>

      <section
        className={`${styles.bookingCard} p-5 sm:p-7`}
      >
        <div className="flex flex-wrap items-start gap-4 md:flex-nowrap md:items-center">
          <div className={styles.avatar} aria-hidden="true">
              {doctor.fullName
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map((part) => part.charAt(0))
                .join('')}
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h2 className="text-lg font-bold">
              {doctor.fullName}
            </h2>

            <p className="text-sm text-[#607d90]">
              {doctor.specialty}
            </p>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            disabled={formik.isSubmitting}
            aria-label="ჯავშნის დახურვა"
          >
            x
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
