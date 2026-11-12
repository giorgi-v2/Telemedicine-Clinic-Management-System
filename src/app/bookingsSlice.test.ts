
import { describe, expect, it } from 'vitest';
import type { Booking } from '../shared/types/booking';
import reducer, { bookingAdded, fetchBookings, selectBookingsByPatient } from './bookingsSlice';
import { setupStore } from './store';

const make=(id:string,patientId:string,date='2026-11-06',time='10:00'):Booking=>({id,patientId,doctorId:'doc-001',slotId:`slot-${id}`,date,time,status:'confirmed'});
const empty={items:[],status:'idle' as const,error:null};

describe('bookingsSlice',()=>{
it('bookingAdded does not duplicate by id',()=>{
let s=reducer(empty,bookingAdded(make('b1','PAT-001')));
s=reducer(s,bookingAdded(make('b1','PAT-001')));
expect(s.items).toHaveLength(1);
});

it('late hydration merges by id and never removes a just-added booking',()=>{
let s=reducer(empty,fetchBookings.pending('r',undefined));
s=reducer(s,bookingAdded(make('new','PAT-001')));
s=reducer(s,fetchBookings.fulfilled([make('old','PAT-001'),make('new','PAT-001')],'r',undefined));
expect(s.items.map(b=>b.id).sort()).toEqual(['new','old']);
expect(s.status).toBe('succeeded');
});

it('records failure',()=>{
const s=reducer(empty,fetchBookings.rejected(new Error('x'),'r',undefined));
expect(s.status).toBe('failed');
});

it('selector returns only the patient bookings, soonest first',()=>{
const store=setupStore({bookings:{...empty,items:[make('c','PAT-001','2026-12-01'),make('a','PAT-002'),make('b','PAT-001','2026-11-06')]}});
const result=selectBookingsByPatient(store.getState(),'PAT-001');
expect(result.map(b=>b.id)).toEqual(['b','c']);
expect(selectBookingsByPatient(store.getState(),'PAT-001')).toBe(result);
});
});
