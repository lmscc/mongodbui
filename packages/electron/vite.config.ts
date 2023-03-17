import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import electron from "vite-plugin-electron";
// import electronRenderer from "vite-plugin-electron/renderer";
// import polyfillExports from "vite-plugin-electron/polyfill-exports";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  electron({
    entry: "dist/index.js",
    vite: {
      build: {
        rollupOptions: {
          // Here are some C/C++ plugins that can't be built properly.
          external: [
            'body-parser',
          ],
        },
      },
    },
    // main: {
    //   entry: "electron-main/index.ts", // 主进程文件
    // },
    // preload: {
    //   input: path.join(__dirname, "./electron-preload/index.ts"), // 预加载文件
    // },
  }),
  // electronRenderer(),
  // polyfillExports()
  ],
})
