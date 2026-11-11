/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Tailwind v4 მუშაობს ჩვეულებრივ CSS ფაილზე (src/index.css),
// SCSS Modules კი Vite-ის ჩაშენებული sass მხარდაჭერით კომპილირდება.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
