import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "@/api/apiSlice";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";

// Ensure feature endpoints are injected before the store is created.
import "@/api/services/authApi";
import "@/api/services/portfolioApi";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    ui: uiReducer,
  },
  middleware: (getDefault) => getDefault().concat(apiSlice.middleware),
  devTools: import.meta.env.MODE !== "production",
});

// Enables refetchOnFocus / refetchOnReconnect behaviors.
setupListeners(store.dispatch);

export default store;
