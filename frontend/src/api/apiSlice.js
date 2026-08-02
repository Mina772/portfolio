import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "@/constants";
import { setCredentials, logOut } from "@/store/slices/authSlice";

/** Base fetch query that injects the bearer token and sends cookies. */
const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: "include", // send httpOnly refresh cookie
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

// Guard so simultaneous 401s only trigger one refresh round-trip.
let refreshPromise = null;

/**
 * Wrap the base query with silent access-token refresh on 401.
 * On refresh failure the user is logged out.
 */
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    if (!refreshPromise) {
      refreshPromise = rawBaseQuery(
        { url: "/auth/refresh", method: "POST" },
        api,
        extraOptions
      ).finally(() => {
        refreshPromise = null;
      });
    }
    const refresh = await refreshPromise;

    if (refresh?.data?.data?.accessToken) {
      api.dispatch(setCredentials(refresh.data.data));
      result = await rawBaseQuery(args, api, extraOptions); // retry original
    } else {
      api.dispatch(logOut());
    }
  }
  return result;
};

/**
 * Root RTK Query API. Feature endpoints are injected in api/services/*.js
 * to keep concerns separated while sharing a single cache & middleware.
 */
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "Project",
    "About",
    "Skill",
    "Experience",
    "Education",
    "Certificate",
    "Service",
    "Testimonial",
    "Blog",
    "Message",
    "Dashboard",
  ],
  endpoints: () => ({}),
});

export default apiSlice;
