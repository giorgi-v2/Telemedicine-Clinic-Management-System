
import {useCallback} from 'react';
import {fetchBookings,selectBookingsByPatient,selectBookingsStatus} from '../../../app/bookingsSlice';
import type {BookingsStatus} from '../../../app/bookingsSlice';
import {useAppDispatch,useAppSelector} from '../../../app/hooks';
import type {Booking} from '../types/booking';

export interface UsePatientBookingsResult{bookings:Booking[];status:BookingsStatus;retry:()=>void}

export function usePatientBookings(patientId:string):UsePatientBookingsResult{
const dispatch=useAppDispatch();
const bookings=useAppSelector(s=>selectBookingsByPatient(s,patientId));
const status=useAppSelector(selectBookingsStatus);
const retry=useCallback(()=>{void dispatch(fetchBookings())},[dispatch]);
return{bookings,status,retry};
}
