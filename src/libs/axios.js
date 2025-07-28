import axios from "axios";

const isLocal = location.hostname === "localhost";

const axiosInstance = axios.create({
  baseURL: isLocal
    ? "/api" // development: gunakan proxy
    : "https://eventapi.sbm-itb.ac.id/api", // production
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
