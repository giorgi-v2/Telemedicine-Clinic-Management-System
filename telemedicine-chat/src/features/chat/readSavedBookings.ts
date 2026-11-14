import type { ChatBooking } from "./chatReplies";

const bookingKeys = ["medicare.bookings", "clinic_demo_bookings_v1"];

function isSavedBooking(value: unknown): value is ChatBooking & { id: string } {
  if (typeof value !== "object" || value === null) return false;
  const booking = value as Record<string, unknown>;
  return (
    typeof booking.id === "string" &&
    typeof booking.patientId === "string" &&
    typeof booking.date === "string" &&
    typeof booking.time === "string" &&
    typeof booking.status === "string"
  );
}

// The standalone preview reads bookings stored on its own origin.
// In the clinic app, pass the existing booking state directly to ChatWidget.
export function readSavedBookings(): ChatBooking[] {
  const bookings = new Map<string, ChatBooking>();

  for (const key of bookingKeys) {
    try {
      const data: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
      if (!Array.isArray(data)) continue;

      for (const booking of data) {
        if (isSavedBooking(booking)) bookings.set(booking.id, booking);
      }
    } catch {
      // A disabled store or damaged entry can be treated as empty.
    }
  }

  return [...bookings.values()];
}
