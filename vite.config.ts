import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import vueDevTools from 'vite-plugin-vue-devtools'
// ElementPlus 按需导入插件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  base: '/vue3-practice/', // 用于 gh-pages 分支作为存放dist文件来访问的配置
  plugins: [
    vue(),
    // vueDevTools(), // Vue开发工具
    AutoImport({
      // 自动导入vue、element‑plus的api，不用import ref、ElMessage
      imports: ['vue'],
      resolvers: [ElementPlusResolver()],
      dts: true, // 生成 auto‑imports.d.ts 类型声明
    }),

    Components({
      // 1、自动识别模板里面的 <el‑xxx> 组件
      resolvers: [ElementPlusResolver()],
      dts: true, // 生成 components.d.ts 类型声明
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 8080,
    open: true, // 自动打开浏览器
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
