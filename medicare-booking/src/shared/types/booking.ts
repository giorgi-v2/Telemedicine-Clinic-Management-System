
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
