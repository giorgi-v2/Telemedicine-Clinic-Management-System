
import {useCallback,useEffect,useState} from 'react';
import {bookingAdded,fetchBookings} from './app/bookingsSlice';
import {DEMO_PATIENTS} from './app/demoPatients';
import {useAppDispatch} from './app/hooks';
import {PatientDashboard} from './features/patient/components/PatientDashboard';
import {AppHeader} from './layout/AppHeader';
import {DemoBookingPanel} from './layout/DemoBookingPanel';
import type {Booking} from './shared/types/booking';

export default function App(){
const dispatch=useAppDispatch();
const [patientId,setPatientId]=useState<string>(DEMO_PATIENTS[0].id);
useEffect(()=>{void dispatch(fetchBookings())},[dispatch]);
const handleBooked=useCallback((booking:Booking)=>{dispatch(bookingAdded(booking))},[dispatch]);
return <div className="min-h-dvh">
<AppHeader patientId={patientId} onPatientChange={setPatientId}/>
<main className="mx-auto w-full max-w-[1200px] px-4 pt-8 pb-16 sm:px-8 sm:pt-10 xl:px-0">
<PatientDashboard key={patientId} patientId={patientId}/>
<DemoBookingPanel patientId={patientId} onBooked={handleBooked}/>
</main>
</div>;
}
