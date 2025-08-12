import axios from "axios";

const instance = axios.create({
  // In development (when running `npm run dev`), use a relative path ('/').
  // This allows Vite's proxy to handle the request correctly,
  // whether you access the app from localhost or a network IP.
  baseURL: import.meta.env.DEV ? "/" : import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk menambahkan token ke setiap request secara otomatis
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
