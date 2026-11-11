
import type { Booking } from '../../../shared/types/booking';
import type { Doctor } from '../../../shared/types/doctor';

interface BookingSuccessProps {
  booking: Booking;
  doctor: Doctor;
  onNewBooking: () => void;
  onClose: () => void;
}

export default function BookingSuccess({
  booking,
  doctor,
  onNewBooking,
  onClose,
}: BookingSuccessProps) {
  const formattedDate = new Intl.DateTimeFormat('ka-GE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${booking.date}T00:00:00`));

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <section
        className="rounded-3xl border border-sky-100 bg-white p-6 text-center shadow-sm sm:p-10"
        aria-live="polite"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-600">
          ✓
        </div>

        <h1 className="mt-6 text-2xl font-bold text-[#19354a] sm:text-3xl">
          ვიზიტი წარმატებით დაიჯავშნა!
        </h1>

        <p className="mt-3 text-slate-500">
          შენი ჯავშანი დადასტურებულია.
        </p>

        <div className="mt-8 rounded-2xl bg-[#f3f8fc] p-6 text-left">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sky-100 font-bold text-sky-700">
              {doctor.initials}
            </div>

            <div>
              <h2 className="font-bold text-[#19354a]">
                {doctor.name}
              </h2>

              <p className="text-sm text-slate-500">
                {doctor.specialty}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3 border-t border-slate-200 pt-5">
            <div className="flex justify-between gap-3 text-sm">
              <span className="text-slate-500">თარიღი</span>
              <strong className="text-right">{formattedDate}</strong>
            </div>

            <div className="flex justify-between gap-3 text-sm">
              <span className="text-slate-500">დრო</span>
              <strong>{booking.time}</strong>
            </div>

            <div className="flex justify-between gap-3 text-sm">
              <span className="text-slate-500">სტატუსი</span>
              <strong className="text-green-700">
                დადასტურებული
              </strong>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">
            ჯავშნის ნომერი
          </p>

          <p className="mt-2 break-all font-mono text-sm font-bold text-sky-700">
            {booking.id}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="rounded-xl bg-sky-600 px-6 py-4 font-semibold text-white hover:bg-sky-700"
          >
            ჯავშნის ამობეჭდვა
          </button>

          <button
            type="button"
            onClick={onNewBooking}
            className="rounded-xl border border-sky-600 px-6 py-4 font-semibold text-sky-700 hover:bg-sky-50"
          >
            ახალი ვიზიტის დაჯავშნა
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-6 py-3 font-medium text-slate-600 hover:bg-slate-100"
          >
            დასრულება
          </button>
        </div>
      </section>
    </main>
  );
}
