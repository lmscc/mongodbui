import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import inspect from 'vite-plugin-inspect'
import { resolve } from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), inspect()],
  base: '/mongodbui/',
  server: {
    proxy: {
      '^/api/.*': {
        target: 'http://localhost:3016',
        // target: 'http://116.205.239.59:3016',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  css: {
    modules: {
      // 一般我们可以通过 generateScopedName 属性来对生成的类名进行自定义
      // 其中，name 表示当前文件名，local 表示类名
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    }
  }
})
