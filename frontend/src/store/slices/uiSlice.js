import { createSlice } from "@reduxjs/toolkit";
import { STORAGE_KEYS } from "@/constants";

/** Resolve the initial theme from storage or the OS preference. */
function initialTheme() {
  const saved = localStorage.getItem(STORAGE_KEYS.theme);
  if (saved) return saved;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    theme: initialTheme(),
    sidebarOpen: false,
    mobileMenuOpen: false,
  },
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem(STORAGE_KEYS.theme, state.theme);
    },
    setTheme(state, { payload }) {
      state.theme = payload;
      localStorage.setItem(STORAGE_KEYS.theme, payload);
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebar(state, { payload }) {
      state.sidebarOpen = payload;
    },
    toggleMobileMenu(state) {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setMobileMenu(state, { payload }) {
      state.mobileMenuOpen = payload;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  toggleSidebar,
  setSidebar,
  toggleMobileMenu,
  setMobileMenu,
} = uiSlice.actions;
export const selectTheme = (s) => s.ui.theme;
export default uiSlice.reducer;
