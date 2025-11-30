// Redux store configuration

import { configureStore } from '@reduxjs/toolkit';
import profilesReducer from './slices/profilesSlice';
import schemaReducer from './slices/schemaSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    profiles: profilesReducer,
    schema: schemaReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Increase threshold for SerializableStateInvariantMiddleware
      // to avoid warnings when working with large profile/schema data
      serializableCheck: {
        warnAfter: 128, // default is 32ms
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
