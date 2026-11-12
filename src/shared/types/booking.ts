
export type BookingStatus='confirmed'|'pending'|'cancelled';
export interface Booking{id:string;patientId:string;doctorId:string;slotId:string;date:string;time:string;status:BookingStatus}
