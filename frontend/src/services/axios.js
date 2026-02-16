import axios from "axios";

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json"
  }
});

/* ---------- REQUEST INTERCEPTOR ---------- */
instance.interceptors.request.use(
  (config) => {
    // Attach auth token
    const token = localStorage.getItem("token");

    console.log("AXIOS INTERCEPTOR HIT");
    console.log("TOKEN:", token);
    console.log("URL:", config.url);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Attach company as query param (if exists)
    const company = localStorage.getItem("company");
    if (company) {
      config.params = {
        ...(config.params || {}),
        company
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ---------- RESPONSE INTERCEPTOR ---------- */
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("TOKEN EXPIRED — FORCING LOGOUT");

      localStorage.removeItem("token");
      localStorage.removeItem("company");

      // hard redirect to reset router + state
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default instance;
