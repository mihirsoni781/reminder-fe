// store.ts
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/authApi';
import { reminderApi } from './api/reminderApi';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [reminderApi.reducerPath]: reminderApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, reminderApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
