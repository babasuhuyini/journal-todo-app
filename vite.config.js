import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Relative asset paths so the build works from any sub-folder, e.g. username.github.io/journal-todo-app/.
  base: './',
  server: {
    // Saved entries live in the browser under this exact address, so never drift to another port.
    port: 5173,
    strictPort: true,
  },
})
