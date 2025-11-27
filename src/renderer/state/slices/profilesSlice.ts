// Profiles Redux slice

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { DuckDBProfile, DuckDBProfileInput, DuckDBProfileUpdate } from '@shared/types';
import type { RootState } from '../store';

type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'failed';

interface ProfilesState {
  list: DuckDBProfile[];
  activeProfileId: string | null;
  loading: boolean;
  error: string | null;
  connectionUsage: Record<string, number>;
  connectionStatus: Record<string, ConnectionStatus>;
  connectionErrors: Record<string, string | undefined>;
}

const initialState: ProfilesState = {
  list: [],
  activeProfileId: null,
  loading: false,
  error: null,
  connectionUsage: {},
  connectionStatus: {},
  connectionErrors: {},
};

// Async thunks
export const loadProfiles = createAsyncThunk('profiles/load', async () => {
  return await window.orbitalDb.profiles.list();
});

export const createProfile = createAsyncThunk(
  'profiles/create',
  async (input: DuckDBProfileInput) => {
    return await window.orbitalDb.profiles.create(input);
  }
);

export const updateProfile = createAsyncThunk(
  'profiles/update',
  async ({ id, update }: { id: string; update: DuckDBProfileUpdate }) => {
    return await window.orbitalDb.profiles.update(id, update);
  }
);

export const deleteProfile = createAsyncThunk('profiles/delete', async (id: string) => {
  await window.orbitalDb.profiles.delete(id);
  return id;
});

export const acquireConnection = createAsyncThunk<
  string,
  string,
  { state: RootState }
>('profiles/acquireConnection', async (profileId, { getState }) => {
  const state = getState();
  const usage = state.profiles.connectionUsage[profileId] ?? 0;
  if (usage === 0) {
    await window.orbitalDb.connection.open(profileId);
  }
  return profileId;
});

export const releaseConnection = createAsyncThunk<
  string,
  string,
  { state: RootState }
>('profiles/releaseConnection', async (profileId, { getState }) => {
  const state = getState();
  const usage = state.profiles.connectionUsage[profileId] ?? 0;
  if (usage <= 1) {
    await window.orbitalDb.connection.close(profileId);
  }
  return profileId;
});

const profilesSlice = createSlice({
  name: 'profiles',
  initialState,
  reducers: {
    setActiveProfile: (state, action: PayloadAction<string | null>) => {
      state.activeProfileId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(acquireConnection.pending, (state, action) => {
        const id = action.meta.arg;
        state.connectionStatus[id] = 'connecting';
        delete state.connectionErrors[id];
        state.activeProfileId = id;
      })
      // Load profiles
      .addCase(loadProfiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProfiles.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(loadProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load profiles';
      })
      // Create profile
      .addCase(createProfile.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      // Update profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        const index = state.list.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      // Delete profile
      .addCase(deleteProfile.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p.id !== action.payload);
        if (state.activeProfileId === action.payload) {
          state.activeProfileId = null;
        }
      })
      .addCase(acquireConnection.rejected, (state, action) => {
        const id = action.meta.arg;
        const message = action.error.message || 'Failed to connect to database';
        state.connectionStatus[id] = 'failed';
        state.connectionErrors[id] = message;
        state.error = message;
        state.loading = false;
      })
      .addCase(acquireConnection.fulfilled, (state, action) => {
        const id = action.payload;
        state.connectionUsage[id] = (state.connectionUsage[id] || 0) + 1;
        state.activeProfileId = id;
        state.connectionStatus[id] = 'connected';
        delete state.connectionErrors[id];
      })
      .addCase(releaseConnection.fulfilled, (state, action) => {
        const id = action.payload;
        const current = state.connectionUsage[id] || 0;
        if (current <= 1) {
          delete state.connectionUsage[id];
          delete state.connectionStatus[id];
          delete state.connectionErrors[id];
          if (state.activeProfileId === id) {
            state.activeProfileId = null;
          }
        } else {
          state.connectionUsage[id] = current - 1;
        }
      });
  },
});

export const { setActiveProfile } = profilesSlice.actions;
export default profilesSlice.reducer;
