// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  
  optimizeDeps: {
    exclude: ['bson']
  },
  build: {
    target: 'es2022', // Update the target to support top-level await
  },
  
});