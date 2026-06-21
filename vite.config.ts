import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// `base` must match the GitHub Pages repository name so asset URLs resolve
// correctly at https://<user>.github.io/live-clock-pro/. It is only applied to
// production builds so the dev server keeps serving from the root.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/live-clock-pro/' : '/',
  plugins: [react(), tailwindcss()],
}))
