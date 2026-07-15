import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    // maplibre-gl is intentionally isolated into its own vendor chunk (~1 MB raw,
    // ~285 kB gzip). It is the map engine and loads regardless, so raise the limit
    // above it to keep the size warning meaningful for application code.
    chunkSizeWarningLimit: 1100,
    rollupOptions: {
      output: {
        manualChunks: {
          maplibre: ["maplibre-gl"],
          supabase: ["@supabase/supabase-js"]
        }
      }
    }
  },
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
