import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' keeps dist/ portable — it runs from a file:// folder or any
// subpath on GitHub Pages without a rebuild.
export default defineConfig({
  plugins: [react()],
  base: './',
  server: { port: 5173, host: true },
});
