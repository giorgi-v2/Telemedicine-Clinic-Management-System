import { useCallback, useEffect, useState } from "react";

import PageLayout, { type Page } from "./shared/ui/PageLayout";

import DoctorDirectory from "./features/doctors/components/DoctorDirectory";

import BookingModal from "./features/booking/components/BookingModal";
import { ChatWidget } from "./features/chat/ChatWidget";

import { getBookings } from "./features/booking/api/booking.api";
import { getDoctors } from "./features/doctors/api/doctors.api";

import type { Doctor } from "./shared/types/doctor";
import type { Booking } from "./shared/types/booking";
import { useAppDispatch } from "./app/hooks";
import { bookingAdded, fetchBookings } from "./app/bookingsSlice";
import { PatientDashboard } from "./features/patient/components/PatientDashboard";

const patientId = "patient-demo-001";

function loadPatientBookings(): Booking[] {
  return getBookings().filter(
    (booking) =>
      booking.patientId === patientId && booking.status === "confirmed",
  );
}

export default function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    void dispatch(fetchBookings());
  }, [dispatch]);
  const [page, setPage] = useState<Page>("doctors");
  const [chatDoctor, setChatDoctor] = useState<Doctor | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const [bookings, setBookings] = useState<Booking[]>(loadPatientBookings);

  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    getDoctors(controller.signal)
      .then(setDoctors)
      .catch(() => {});

    return () => controller.abort();
  }, []);

  const handleBook = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleChat = (doctor: Doctor) => {
    setChatDoctor(doctor);
    setIsChatOpen(true);
  };

  const handleBooked = useCallback(
    (booking: Booking) => {
      dispatch(bookingAdded(booking));
      setBookings((previous) => {
        if (previous.some((item) => item.id === booking.id)) {
          return previous;
        }

        return [booking, ...previous];
      });
    },
    [dispatch],
  );

  const handleNavigate = (nextPage: Page) => {
    setSelectedDoctor(null);
    setPage(nextPage);
    setBookings(loadPatientBookings());
  };

  const handleClose = () => {
    setSelectedDoctor(null);
    setPage("appointments");
    setBookings(loadPatientBookings());
  };

  const getDoctorName = (doctorId: string) =>
    doctors.find((doctor) => doctor.id === doctorId)?.fullName ??
    `ექიმი (${doctorId})`;

  return (
    <PageLayout
      activePage={page}
      onNavigate={handleNavigate}
    >
      {page === "doctors" && (
        <DoctorDirectory onBook={handleBook} onChat={handleChat} />
      )}

      {page === "appointments" && (
        <section className="mx-auto max-w-3xl rounded-2xl border border-line bg-white p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-ink">ჩემი ვიზიტები</h1>

          {bookings.length === 0 ? (
            <p className="mt-5 text-muted">
              ჯერ არცერთი ვიზიტი არ გაქვს დაჯავშნილი.
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {bookings.map((booking) => (
                <article
                  key={booking.id}
                  className="rounded-xl border border-line p-5"
                >
                  <h2 className="font-semibold text-ink">
                    {getDoctorName(booking.doctorId)}
                  </h2>

                  <p className="mt-2 text-sm text-muted">
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
            onClick={() => handleNavigate("doctors")}
            className="mt-7 rounded-lg bg-primary px-6 py-3 font-semibold text-white"
          >
            ახალი ვიზიტის დაჯავშნა
          </button>
        </section>
      )}

      {page === "patient" && (
        <PatientDashboard
          patientId={patientId}
          onBrowseDoctors={() => handleNavigate("doctors")}
        />
      )}

      {selectedDoctor && (
        <BookingModal
          key={selectedDoctor.id}
          doctor={selectedDoctor}
          patientId={patientId}
          onBooked={handleBooked}
          onClose={handleClose}
        />
      )}

      <ChatWidget
        key={JSON.stringify([patientId, chatDoctor?.id])}
        doctor={chatDoctor}
        isOpen={isChatOpen}
        onOpenChange={setIsChatOpen}
      />
    </PageLayout>
  );
}
