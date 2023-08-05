import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import inspect from 'vite-plugin-inspect'
import removeConsole from 'vite-plugin-remove-console'
import babel from '@rollup/plugin-babel'
import { resolve } from 'path'
// import visual from 'rollup-plugin-visualizer'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    inspect(),
    removeConsole(),
    babel({
      // presets: [
      //   [
      //     '@babel/preset-env',
      //     {
      //       debug: true,
      //       targets: {
      //         browsers: 'Chrome 20'
      //       },
      //       corejs: 3,
      //       useBuiltIns: 'entry' // "usage" or "entry" or "false"
      //       // "useBuiltIns": "usage" //"entry" or "entry" or "false"
      //     }
      //   ]
      // ],
      plugins: [
        [
          '@babel/transform-runtime',
          {
            corejs: 3
          }
        ]
      ]
    })
    // {
    //   name: 'add-base',
    //   enforce: 'post',
    //   transformIndexHtml(html, ctx) {
    //     console.log(html, ctx)
    //     // console.log(ctx)
    //     if (process.env.NODE_ENV === 'production') {
    //       setTimeout(() => {
    //         const p = resolve(__dirname, './dist/index.html')
    //         let file = fs.readFileSync(p).toString()
    //         file = file.replace(/\/STATIC_URL/g, '{{STATIC_URL}}')
    //         console.log(file)
    //         fs.writeFileSync(p, file)
    //       }, 100)
    //       // console.log(html)
    //       return html
    //     }
    //   }
    // }
  ],
  // base: process.env.NODE_ENV === 'production' ? '/STATIC_URL' : '',
  base: '',
  server: {
    proxy: {
      '^/api/.*': {
        // target: 'http://localhost:3016',
        target: 'https://lmscc.top/mongodbui',
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
    // assetsDir: '/{{STATIC_URL}}/assets',
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
