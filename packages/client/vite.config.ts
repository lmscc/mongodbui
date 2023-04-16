import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import inspect from 'vite-plugin-inspect'
import removeConsole from 'vite-plugin-remove-console'
import visual from 'rollup-plugin-visualizer'
import { resolve } from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), inspect(), removeConsole(), visual({ open: true })],
  base: '/mongodbui/',
  server: {
    proxy: {
      '^/api/.*': {
        target: 'http://localhost:3016',
        // target: 'http://116.205.239.59:3016/mongodbui',
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
  },
  build: {
    minify: true, // 打包结果是否minify
    rollupOptions: {
      // vite打包是通过rollup来打包的
      output: {
        manualChunks: (id: string) => {
          // 可以在这里打印看一下id的值，这里做个简单处理将node_modules中的包打包为vendor文件
          if (id.includes('antd')) {
            return 'antd'
          }
          if (id.includes('react')) {
            return 'react'
          }
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    }
  }
})
