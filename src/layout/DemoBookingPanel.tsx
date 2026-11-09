import { useState } from 'react'
import { saveBooking } from '../app/booking.api'
import { Button } from '../features/patient/components/Button'
import type { Booking } from '../shared/types/booking'

interface DemoBookingPanelProps {
  patientId: string
  /** იგივე callback, რომელსაც ეთოს ფორმა დაიძახებს: onBooked(booking) */
  onBooked: (booking: Booking) => void
}

let demoCounter = 0

/** ეთოს BookingModal-ის ჩანაცვლება ამ დამოუკიდებელ პროექტში: ქმნის სატესტო ჯავშანს და იძახებს onBooked-ს. */
export function DemoBookingPanel({ patientId, onBooked }: DemoBookingPanelProps) {
  const [isSaving, setIsSaving] = useState(false)

  const handleClick = async () => {
    setIsSaving(true)
    try {
      demoCounter += 1
      const booking: Booking = {
        id: `MC-2026-${2000 + demoCounter}-${Date.now().toString(36)}`,
        patientId,
        doctorId: 'doc-002',
        slotId: `slot-demo-${demoCounter}`,
        date: '2026-12-10',
        time: '15:30',
        status: 'pending',
      }
      onBooked(await saveBooking(booking))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section aria-labelledby="demo-title" className="mt-10 rounded-xl border border-dashed border-line bg-white p-5">
      <h2 id="demo-title" className="text-lg font-bold text-ink">
        დემო: ეთოს ჯავშნის ჩანაცვლება
      </h2>
      <p className="mt-2 mb-4 text-[15px] text-muted">
        ქმნის სატესტო ჯავშანს არჩეული პაციენტისთვის — ისე, როგორც ეთოს ფორმა გამოიძახებს onBooked(booking)-ს.
        ჯავშანი ინახება localStorage-ში და refresh-ის შემდეგაც ბრუნდება.
      </p>
      <Button variant="primary" onClick={handleClick} disabled={isSaving}>
        {isSaving ? 'ინახება...' : 'სატესტო ჯავშნის დამატება'}
      </Button>
    </section>
  )
}
