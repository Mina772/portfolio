import { createSlice } from "@reduxjs/toolkit";
import { STORAGE_KEYS } from "@/constants";

const tokenFromStorage = localStorage.getItem(STORAGE_KEYS.token) || null;

const initialState = {
  user: null,
  accessToken: tokenFromStorage,
  isAuthenticated: Boolean(tokenFromStorage),
  // We only *know* we're authenticated after a successful /me bootstrap.
  bootstrapped: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, { payload }) {
      const { user, accessToken } = payload;
      if (user) state.user = user;
      if (accessToken) {
        state.accessToken = accessToken;
        localStorage.setItem(STORAGE_KEYS.token, accessToken);
      }
      state.isAuthenticated = Boolean(state.accessToken);
    },
    setUser(state, { payload }) {
      state.user = payload;
      state.isAuthenticated = Boolean(state.accessToken);
    },
    logOut(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem(STORAGE_KEYS.token);
    },
    setBootstrapped(state, { payload }) {
      state.bootstrapped = payload;
    },
  },
});

export const { setCredentials, setUser, logOut, setBootstrapped } = authSlice.actions;
export const selectCurrentUser = (s) => s.auth.user;
export const selectIsAuthenticated = (s) => s.auth.isAuthenticated;
export const selectToken = (s) => s.auth.accessToken;
export default authSlice.reducer;
