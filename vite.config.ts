import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://<user>.github.io/flight-seat-selector/ — asset URLs
  // need the repo name as a base path. Local dev/preview are unaffected.
  base: process.env.GITHUB_PAGES ? '/flight-seat-selector/' : '/',
  plugins: [react()],
})
