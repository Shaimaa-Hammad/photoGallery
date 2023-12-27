// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    loggedUserId: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    clearToken: (state) => {
      state.token = null;
    },
    setLoggedUserId: (state, action) => {
        state.loggedUserId = action.payload;
      },
      clearLoggedUserId: (state) => {
        state.loggedUserId = null;
      }
  },
});

export const { setToken, clearToken, setLoggedUserId, clearLoggedUserId } = authSlice.actions;
export const selectToken = (state) => state.auth.token;
export const selectLoggedUserId = (state) => state.auth.loggedUserId;

export default authSlice.reducer;
