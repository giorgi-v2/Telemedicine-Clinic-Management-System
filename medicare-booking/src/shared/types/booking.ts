
export interface AppointmentSlot {
  id: string;
  doctorId: string;
  date: string;
  time: string;
  isAvailable: boolean;
}


export interface BookingFormValues {
  date: string;
  slotId: string;
  comment: string;
}



export interface Booking {
  id: string;
  doctorId: string;
  patientId: string;
  slotId: string;
  date: string;
  time: string;
  comment: string;
  status: 'confirmed' | 'cancelled';
}

export interface CreateBookingInput {
  doctorId: string;
  patientId: string;
  slotId: string;
  date: string;
  comment: string;
}
