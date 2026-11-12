
import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Booking } from '../shared/types/booking';
import { getBookings } from './booking.api';

export type BookingsStatus='idle'|'pending'|'succeeded'|'failed';
export interface BookingsState{items:Booking[];status:BookingsStatus;error:string|null}

const initialState:BookingsState={items:[],status:'idle',error:null};

export const fetchBookings=createAsyncThunk<Booking[],void,{state:{bookings:BookingsState}}>(
'bookings/fetchBookings',
()=>getBookings(),
{condition:(_,{getState})=>['idle','failed'].includes(getState().bookings.status)}
);

const bookingsSlice=createSlice({
name:'bookings',
initialState,
reducers:{
bookingAdded(state,action:PayloadAction<Booking>){
if(!state.items.some(x=>x.id===action.payload.id))state.items.push(action.payload);
}
},
extraReducers:builder=>{
builder
.addCase(fetchBookings.pending,state=>{state.status='pending';state.error=null})
.addCase(fetchBookings.fulfilled,(state,action)=>{
const ids=new Set(state.items.map(x=>x.id));
for(const b of action.payload)if(!ids.has(b.id)){state.items.push(b);ids.add(b.id)}
state.status='succeeded';
})
.addCase(fetchBookings.rejected,(state,action)=>{
state.status='failed';
state.error=action.error.message??'ჯავშნების ჩატვირთვა ვერ მოხერხდა';
});
}
});

export const {bookingAdded}=bookingsSlice.actions;
export default bookingsSlice.reducer;

type StateWithBookings={bookings:BookingsState};
const selectBookingItems=(s:StateWithBookings)=>s.bookings.items;
const selectPatientIdArg=(_:StateWithBookings,id:string)=>id;

export const selectBookingsByPatient=createSelector(
[selectBookingItems,selectPatientIdArg],
(items,id)=>items.filter(x=>x.patientId===id).sort((a,b)=>`${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
);

export const selectBookingsStatus=(s:StateWithBookings)=>s.bookings.status;
