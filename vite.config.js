import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // In local dev, proxy /api calls to Netlify CLI
      "/api": "http://localhost:8888",
    },
  },
});
