import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command, mode }) => {
  return {
    plugins: [react(), tailwindcss()],
    // إذا كنت ترفع لـ GitHub Pages (production) استخدم المسار الفرعي
    // إذا كنت على Vercel أو Local، استخدم المسار الرئيسي '/'
    base: process.env.NODE_ENV === 'production' && mode === 'github' 
          ? "/social_media_app/" 
          : "/",
  }
})