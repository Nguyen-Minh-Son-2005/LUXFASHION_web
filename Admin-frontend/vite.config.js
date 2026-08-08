import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173, // cổng chạy React (frontend)
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // cổng backend Spring Boot
        changeOrigin: true, // giả lập cùng domain để tránh CORS
        secure: false, // tắt kiểm tra SSL nếu chưa có HTTPS
      },
    },
  },
})
