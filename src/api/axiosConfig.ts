// <========================= file to implement the axios interceptors ================>

// importing the required modules
import axios from "axios";

const baseUrl =
  import.meta.env.VITE_ENV === "development"
    ? import.meta.env.VITE_BASE_URL_DEVMODE
    : import.meta.env.VITE_BASE_URL_PRODUCTION;

const api = axios.create({
  baseURL: baseUrl,
});

// request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post(`${baseUrl}/refresh-token`, {
          refreshToken,
        });
        const { token } = response.data;

        localStorage.setItem("token", token);

        originalRequest.headers["Authorization"] = `Bearer ${token}`;
        return api(originalRequest);
      } catch (error) {
        console.error("Error refreshing token:", error);

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
