
import { useState } from 'react';
import BookingModal from './features/booking/components/BookingModal';
import type { Doctor } from './shared/types/doctor';

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

  return (
    <div className="min-h-screen bg-[#f3f8fc] text-[#19354a]">
      <header className="border-b border-[#e3edf4] bg-white">
        <div className="mx-auto flex min-h-20 max-w-6xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#087fbd] text-2xl font-bold text-white">
              +
            </span>
            <strong className="text-lg">MediCare</strong>
          </div>

          <span className="text-sm font-semibold text-[#087fbd]">
            ჩემი ვიზიტები
          </span>
        </div>
      </header>

      {isBookingOpen ? (
        <BookingModal
          doctor={demoDoctor}
          onClose={() => setIsBookingOpen(false)}
        />
      ) : (
        <main className="mx-auto max-w-xl px-5 py-20 text-center">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold">ჩემი ვიზიტები</h1>
            <p className="mt-3 text-[#607d90]">
              ჯავშნის ფანჯარა დახურულია.
            </p>

            <button
              type="button"
              onClick={() => setIsBookingOpen(true)}
              className="mt-6 rounded-lg bg-sky-600 px-6 py-3 font-semibold text-white hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              ვიზიტის დაჯავშნა
            </button>
          </div>
        </main>
      )}
    </div>
  );
}
