import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Booking } from '../shared/types/booking'
import { getBookings } from './booking.api'

export type BookingsStatus = 'idle' | 'pending' | 'succeeded' | 'failed'

export interface BookingsState {
  items: Booking[]
  status: BookingsStatus
  error: string | null
}

const initialState: BookingsState = {
  items: [],
  status: 'idle',
  error: null,
}

/**
 * ეთოს getBookings()-ით (localStorage ადაპტერი) შენახული ჯავშნების ჩატვირთვა.
 * condition: StrictMode-ში ან განმეორებით dispatch-ზე მეორე მოთხოვნა აღარ იქმნება.
 */
export const fetchBookings = createAsyncThunk<Booking[], void, { state: { bookings: BookingsState } }>(
  'bookings/fetchBookings',
  () => getBookings(),
  {
    condition: (_arg, { getState }) => {
      const { status } = getState().bookings
      return status === 'idle' || status === 'failed'
    },
  },
)

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    bookingAdded(state, action: PayloadAction<Booking>) {
      if (!state.items.some((item) => item.id === action.payload.id)) {
        state.items.push(action.payload)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.status = 'pending'
        state.error = null
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        // id-ით გაერთიანება: დაგვიანებულმა hydration-მა ახლახან დამატებული ჯავშანი არ უნდა წაშალოს.
        const knownIds = new Set(state.items.map((item) => item.id))
        for (const booking of action.payload) {
          if (!knownIds.has(booking.id)) {
            state.items.push(booking)
            knownIds.add(booking.id)
          }
        }
        state.status = 'succeeded'
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'ჯავშნების ჩატვირთვა ვერ მოხერხდა'
      })
  },
})

export const { bookingAdded } = bookingsSlice.actions
export default bookingsSlice.reducer

type StateWithBookings = { bookings: BookingsState }

const selectBookingItems = (state: StateWithBookings) => state.bookings.items
const selectPatientIdArg = (_state: StateWithBookings, patientId: string) => patientId

/** მხოლოდ არჩეული პაციენტის ჯავშნები, უახლოესი თარიღით დაწყებული (memoized). */
export const selectBookingsByPatient = createSelector(
  [selectBookingItems, selectPatientIdArg],
  (items, patientId) =>
    items
      .filter((item) => item.patientId === patientId)
      .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)),
)

export const selectBookingsStatus = (state: StateWithBookings) => state.bookings.status
