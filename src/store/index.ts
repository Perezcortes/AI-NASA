import { configureStore } from '@reduxjs/toolkit';
import readLaterReducer from './slices/readLaterSlice';

export const store = configureStore({
  reducer: {
    readLater: readLaterReducer,
    // otros slices aquí...
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
