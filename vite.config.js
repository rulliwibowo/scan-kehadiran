// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      "/api": {
        target: "https://eventapi.sbm-itb.ac.id",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
