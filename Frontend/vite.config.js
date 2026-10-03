import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Bind to all interfaces so the dev server is reachable from phones on the same Wi-Fi
    host: "0.0.0.0",
    port: 5173,
  },
});
