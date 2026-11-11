
import { useCallback, useState } from 'react';

import BookingModal from './features/booking/components/BookingModal';

import { getBookings } from './features/booking/api/booking.api';

import type { Booking } from './shared/types/booking';
import type { Doctor } from './shared/types/doctor';

const patientId = 'patient-demo-001';

const demoDoctor: Doctor = {
  doctorId: 'doctor-nino-beridze',
  name: 'ნინო ბერიძე',
  specialty: 'კარდიოლოგი',
  experienceYears: 12,
  consultationPrice: 80,
  initials: 'ნბ',
};

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(true);

  const [bookings, setBookings] = useState<Booking[]>(() =>
    getBookings().filter(
      (booking) =>
        booking.patientId === patientId &&
        booking.status === 'confirmed'
    )
  );

  const handleBooked = useCallback((booking: Booking) => {
    setBookings((previous) => {
      if (previous.some((item) => item.id === booking.id)) {
        return previous;
      }

      return [booking, ...previous];
    });
  }, []);

  const openBooking = () => {
    setIsBookingOpen(true);
  };

  const closeBooking = () => {
    setIsBookingOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f3f8fc] text-[#19354a]">
      <header className="border-b border-[#e3edf4] bg-white">
        <div className="mx-auto flex min-h-20 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <button
            type="button"
            onClick={openBooking}
            className="flex items-center gap-3"
            aria-label="MediCare — ჯავშნის გვერდი"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#087fbd] text-2xl font-bold text-white">
              +
            </span>

            <strong className="text-lg">MediCare</strong>
          </button>

          <button
            type="button"
            onClick={closeBooking}
            className="text-sm font-semibold text-[#087fbd] hover:underline"
          >
            ჩემი ვიზიტები
          </button>
        </div>
      </header>

      {isBookingOpen ? (
        <BookingModal
          key={demoDoctor.doctorId}
          doctor={demoDoctor}
          patientId={patientId}
          onBooked={handleBooked}
          onClose={closeBooking}
        />
      ) : (
        <main className="mx-auto max-w-3xl px-5 py-12">
          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <h1 className="text-2xl font-bold">
              ჩემი ვიზიტები
            </h1>

            {bookings.length === 0 ? (
              <p className="mt-5 text-slate-500">
                ჯერ არცერთი ვიზიტი არ გაქვს დაჯავშნილი.
              </p>
            ) : (
              <div className="mt-6 space-y-4">
                {bookings.map((booking) => (
                  <article
                    key={booking.id}
                    className="rounded-xl border border-slate-200 p-5"
                  >
                    <h2 className="font-bold">
                      {demoDoctor.name}
                    </h2>

                    <p className="mt-2 text-sm text-slate-600">
                      {booking.date} • {booking.time}
                    </p>

                    <p className="mt-2 text-sm text-green-700">
                      დადასტურებული
                    </p>
                  </article>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={openBooking}
              className="mt-6 rounded-xl bg-sky-600 px-6 py-3 font-semibold text-white hover:bg-sky-700"
            >
              ახალი ვიზიტის დაჯავშნა
            </button>
          </div>
        </main>
      )}
    </div>
  );
}
