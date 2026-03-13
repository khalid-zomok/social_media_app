import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // أضف السطر ده هنا (تأكد أن الاسم يطابق اسم الـ Repo على جيت هاب)
  base: "/social_media_app/", 
})