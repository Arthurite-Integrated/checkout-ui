import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import Terminal from 'vite-plugin-terminal';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), Terminal({
          output: ['terminal', 'console'], // Output to both terminal and browser console
        }),],
})
