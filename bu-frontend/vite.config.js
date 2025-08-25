import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  css: {
    modules: {
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    }
  },
  optimizeDeps: {
    include: ['jwt-decode'],  // Aseguramos que jwt-decode sea optimizado
  },
  build:{
    outDir:"bienestar"
  }
});
