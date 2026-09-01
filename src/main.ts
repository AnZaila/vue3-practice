import './assets/style/main.scss'
import 'element-plus/dist/index.css'
// 引入自定义覆盖样式（必须在 Element Plus 样式之后）
import './assets/style/element-plus.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'

import App from './App.vue'
import router from './router'

const savedTheme = localStorage.getItem('theme')

if (savedTheme === 'dark' || savedTheme === 'light') {
  document.documentElement.dataset.theme = savedTheme
}

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')
