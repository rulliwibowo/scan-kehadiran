// src/main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/theme.css";

import axios from "axios";

// Tambahkan default header dari token (jika ada)
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// 🔍 Pasang interceptor log request ke console
axios.interceptors.request.use((config) => {
  console.log("🔍 Axios Request:");
  console.log("📡 URL:", config.url);
  console.log(
    "🔍 Axios Request to:",
    config.url.startsWith("http")
      ? config.url
      : (config.baseURL || "") + config.url
  );

  console.log("📦 Method:", config.method);
  console.log("🧾 Headers:", config.headers);
  console.log("📤 Data:", config.data);
  return config;
});

console.log("[TRACE] main.js mulai");

const app = createApp(App);
app.use(router);
app.mount("#app");

console.log("[TRACE] App mounted ke #app");
