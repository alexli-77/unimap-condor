import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://disc-unimap.uibk.ac.at",
        changeOrigin: true,
        secure: true
      },
      "/openalex": {
        target: "https://api.openalex.org",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/openalex/, "")
      },
      "/ror": {
        target: "https://api.ror.org",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/ror/, "")
      }
    }
  }
});
