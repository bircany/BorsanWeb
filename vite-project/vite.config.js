import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
  },
  resolve: {
    alias: {
      'slick-carousel': 'node_modules/slick-carousel' 
    }
  },
  optimizeDeps: {
    include: ['three', 'three-gpu-pathtracer'],
    exclude: ['../../../three.js'] 
  },
  server: {
    port: 3000,
    proxy: {
      '/threejs-editor': {
        target: 'http://localhost:3000/src/threejs-editor',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/threejs-editor/, '')
      }
  },
}});
