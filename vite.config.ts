import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    sourcemap: true,  // Enables source maps in production builds
  },
  server: {
    sourcemap: true,  // Enables source maps in development
  },
});

