
import {combineReducers,configureStore} from '@reduxjs/toolkit';
import medicalRecordsReducer from '../features/patient/store/medicalRecordsSlice';
import bookingsReducer from './bookingsSlice';

const rootReducer=combineReducers({medicalRecords:medicalRecordsReducer,bookings:bookingsReducer});
export type RootState=ReturnType<typeof rootReducer>;
export function setupStore(preloadedState?:Partial<RootState>){return configureStore({reducer:rootReducer,preloadedState})}
export const store=setupStore();
export type AppStore=ReturnType<typeof setupStore>;
export type AppDispatch=typeof store.dispatch;
