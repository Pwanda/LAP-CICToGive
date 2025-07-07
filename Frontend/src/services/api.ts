import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

// Create shared axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for automatic logout on token expiration
// DISABLED - using new API utility instead
// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (
//       error.response &&
//       (error.response.status === 401 || error.response.status === 403)
//     ) {
//       // Token is expired or invalid
//       console.log("Token expired - logging out automatically");

//       // Show user-friendly message
//       alert(
//         "Ihre Sitzung ist abgelaufen. Sie werden zur Anmeldung weitergeleitet.",
//       );

//       // Clear user data
//       localStorage.removeItem("user");
//       localStorage.removeItem("isLoggedIn");
//       localStorage.removeItem("authToken");

//       // Clear React Query cache if available
//       if (typeof window !== "undefined") {
//         const queryClient = (
//           window as {
//             __REACT_QUERY_CLIENT__?: {
//               clear?: () => void;
//               removeQueries?: () => void;
//             };
//           }
//         ).__REACT_QUERY_CLIENT__;
//         if (queryClient && typeof queryClient.clear === "function") {
//           queryClient.clear();
//         }
//         if (queryClient && typeof queryClient.removeQueries === "function") {
//           queryClient.removeQueries();
//         }
//       }

//       // Redirect to login page
//       window.location.href = "/";
//     }

//     return Promise.reject(error);
//   },
// );
