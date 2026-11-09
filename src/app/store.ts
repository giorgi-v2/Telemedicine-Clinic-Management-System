import { combineReducers, configureStore } from '@reduxjs/toolkit'
import medicalRecordsReducer from '../features/patient/store/medicalRecordsSlice'
import bookingsReducer from './bookingsSlice'

const rootReducer = combineReducers({
  medicalRecords: medicalRecordsReducer,
  bookings: bookingsReducer,
})

export type RootState = ReturnType<typeof rootReducer>

/** ფაბრიკა ტესტებისთვის (preloadedState). აპლიკაცია იყენებს ქვემოთ მოდულის დონეზე შექმნილ store-ს. */
export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({ reducer: rootReducer, preloadedState })
}

// store იქმნება მოდულის დონეზე, არა App-ის ყოველი render-ისას.
export const store = setupStore()

export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = typeof store.dispatch
