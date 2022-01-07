import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    vue(),
    Components({
    }),
    AutoImport({
      imports:[
        'vue',
        'vue-router',
        {
          '@/js/api.js': [
            ['default','api']
          ],
          'element-plus': [
            'ElMessage'
          ],
          '@/store': [
            ['default', 'store']
          ]
        }
      ],
      dts: true
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    open: true,
    proxy: {
      '/api': {
        target: 'http://150.158.82.154/api/',
        // target: 'http://localhost:8000/api/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/uploads': {
        // target: 'http://150.158.82.154/',
        target: 'http://localhost:8000/',
        changeOrigin: true,
      }
    },
  },
})
