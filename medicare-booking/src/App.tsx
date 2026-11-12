
import { useCallback, useState } from 'react';

import BookingModal from './features/booking/components/BookingModal';
import { getBookings } from './features/booking/api/booking.api';

import type { Booking } from './shared/types/booking';
import type { Doctor } from './shared/types/doctor';

type Page = 'booking' | 'doctors' | 'appointments' | 'patient';

const patientId = 'patient-demo-001';
const patientName = 'გიორგი ბ.';

const demoDoctor: Doctor = {
  doctorId: 'doctor-nino-beridze',
  name: 'ნინო ბერიძე',
  specialty: 'კარდიოლოგი',
  experienceYears: 12,
  consultationPrice: 80,
  initials: 'ნბ',
};

export default function App() {
  const [page, setPage] = useState<Page>('booking');

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

  const openBooking = () => setPage('booking');
  const showAppointments = () => setPage('appointments');

  const navClass = (active: boolean) =>
    `border-b-2 px-2 py-4 text-sm font-semibold transition-colors ${
      active
        ? 'border-[#087fbd] text-[#087fbd]'
        : 'border-transparent text-[#607d90] hover:text-[#087fbd]'
    }`;

  return (
    <div className="min-h-screen bg-[#f3f8fc] text-[#19354a]">
      <header className="border-b border-[#e3edf4] bg-white">
        <div className="mx-auto flex min-h-19.5 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          {/* ლოგო */}
          <button
            type="button"
            onClick={openBooking}
            className="flex shrink-0 items-center gap-3"
            aria-label="MediCare — მთავარი გვერდი"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#087fbd] text-2xl font-bold text-white">
              +
            </span>

            <strong className="text-lg font-bold tracking-tight">
              MediCare
            </strong>
          </button>

          {/* Desktop ნავიგაცია */}
          <nav
            className="hidden items-center gap-5 md:flex"
            aria-label="მთავარი ნავიგაცია"
          >
            <button
              type="button"
              onClick={() => setPage('doctors')}
              className={navClass(page === 'doctors')}
            >
              ექიმები
            </button>

            <button
              type="button"
              onClick={showAppointments}
              className={navClass(
                page === 'appointments' || page === 'booking'
              )}
            >
              ჩემი ვიზიტები
            </button>

            <button
              type="button"
              onClick={() => setPage('patient')}
              className={navClass(page === 'patient')}
            >
              პაციენტის ბარათი
            </button>
          </nav>

          {/* მომხმარებელი */}
          <button
            type="button"
            onClick={() => setPage('patient')}
            className="flex shrink-0 items-center gap-3 rounded-lg px-2 py-2 hover:bg-sky-50"
            aria-label="პაციენტის პროფილის გახსნა"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f6ff] text-sm font-bold text-[#087fbd]">
              გბ
            </span>

            <span className="hidden text-sm font-semibold text-[#19354a] sm:inline">
              {patientName}
            </span>
          </button>
        </div>

        {/* მობილურის ნავიგაცია */}
        <nav
          className="flex justify-center gap-3 border-t border-[#edf3f7] px-2 md:hidden"
          aria-label="მობილურის ნავიგაცია"
        >
          <button
            type="button"
            onClick={() => setPage('doctors')}
            className={navClass(page === 'doctors')}
          >
            ექიმები
          </button>

          <button
            type="button"
            onClick={showAppointments}
            className={navClass(
              page === 'appointments' || page === 'booking'
            )}
          >
            ჩემი ვიზიტები
          </button>

          <button
            type="button"
            onClick={() => setPage('patient')}
            className={navClass(page === 'patient')}
          >
            პაციენტის ბარათი
          </button>
        </nav>
      </header>

      {/* დაჯავშნის გვერდი */}
      {page === 'booking' && (
        <BookingModal
          key={demoDoctor.doctorId}
          doctor={demoDoctor}
          patientId={patientId}
          onBooked={handleBooked}
          onClose={showAppointments}
        />
      )}

      {/* ექიმების სადემონსტრაციო გვერდი */}
      {page === 'doctors' && (
        <main className="mx-auto max-w-5xl px-5 py-12">
          <h1 className="text-3xl font-bold">ექიმები</h1>

          <p className="mt-3 text-[#607d90]">
            აირჩიე ექიმი და დაჯავშნე ვიზიტი.
          </p>

          <article className="mt-8 flex flex-wrap items-center gap-5 rounded-2xl border border-[#dce7ef] bg-white p-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f6ff] font-bold text-[#087fbd]">
              {demoDoctor.initials}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold">
                {demoDoctor.name}
              </h2>

              <p className="mt-1 text-sm text-[#607d90]">
                {demoDoctor.specialty}
              </p>

              <p className="mt-2 text-sm font-semibold text-[#087fbd]">
                კონსულტაცია · {demoDoctor.consultationPrice} ₾
              </p>
            </div>

            <button
              type="button"
              onClick={openBooking}
              className="rounded-lg bg-[#087fbd] px-5 py-3 font-semibold text-white hover:bg-[#066a9e]"
            >
              ვიზიტის დაჯავშნა
            </button>
          </article>
        </main>
      )}

      {/* ჩემი ვიზიტები */}
      {page === 'appointments' && (
        <main className="mx-auto max-w-3xl px-5 py-12">
          <section className="rounded-2xl border border-[#dce7ef] bg-white p-6 sm:p-8">
            <h1 className="text-2xl font-bold">
              ჩემი ვიზიტები
            </h1>

            {bookings.length === 0 ? (
              <p className="mt-5 text-[#607d90]">
                ჯერ არცერთი ვიზიტი არ გაქვს დაჯავშნილი.
              </p>
            ) : (
              <div className="mt-6 space-y-4">
                {bookings.map((booking) => (
                  <article
                    key={booking.id}
                    className="rounded-xl border border-[#dce7ef] p-5"
                  >
                    <h2 className="font-bold">
                      {demoDoctor.name}
                    </h2>

                    <p className="mt-2 text-sm text-[#607d90]">
                      {booking.date} · {booking.time}
                    </p>

                    <p className="mt-2 text-sm font-semibold text-green-700">
                      დადასტურებული
                    </p>
                  </article>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={openBooking}
              className="mt-7 rounded-lg bg-[#087fbd] px-6 py-3 font-semibold text-white hover:bg-[#066a9e]"
            >
              ახალი ვიზიტის დაჯავშნა
            </button>
          </section>
        </main>
      )}

      {/* პაციენტის ძირითადი დემო-პროფილი */}
      {page === 'patient' && (
        <main className="mx-auto max-w-3xl px-5 py-12">
          <section className="rounded-2xl border border-[#dce7ef] bg-white p-6 sm:p-8">
            <h1 className="text-2xl font-bold">
              პაციენტის ბარათი
            </h1>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f6ff] font-bold text-[#087fbd]">
                გბ
              </div>

              <div>
                <h2 className="font-bold">{patientName}</h2>
                <p className="text-sm text-[#607d90]">
                  დემო პაციენტი
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-[#f3f8fc] p-5">
              <p className="text-sm text-[#607d90]">
                დადასტურებული ვიზიტები
              </p>

              <strong className="mt-2 block text-2xl text-[#087fbd]">
                {bookings.length}
              </strong>
            </div>

            <p className="mt-5 text-sm text-[#607d90]">
              სამედიცინო ისტორიის სრული მოდული
              გუნდურ ინტეგრაციაში დაემატება.
            </p>

            <button
              type="button"
              onClick={showAppointments}
              className="mt-6 rounded-lg bg-[#087fbd] px-6 py-3 font-semibold text-white hover:bg-[#066a9e]"
            >
              ჩემი ვიზიტების ნახვა
            </button>
          </section>
        </main>
      )}
    </div>
  );
}
