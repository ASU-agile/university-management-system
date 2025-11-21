    // vite.config.js
    import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';

    export default defineConfig({
      plugins: [react()],
      // Optional: Configure build output directory if different from 'dist'
      build: {
        outDir: 'build', // Example: if your CRA build output was 'build'
      },
    });