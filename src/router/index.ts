import { createRouter, createWebHistory } from 'vue-router'
import systemRoutes from './system'
import organization from './organization'
import learning from './learning'
import { finishPageProgress, startPageProgress } from '@/utils/pageProgress'

const routes = [
  {
    path: '/login',
    component: () => import('@/views/login/LoginPage.vue'),
    meta: {
      title: '登录',
    },
  },
  {
    path: '/',
    component: () => import('@/layout/DashBoardPage.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/DashBoardPage.vue'),
        meta: {
          title: '工作台',
        },
      },
      // 系统管理
      systemRoutes,
      // 组织管理
      organization,
      // 学习
      learning,
    ],
  },
  // 404 页面兜底
  {
    /*
    在 Vue Router 3（Vue2）中，我们常用 path: '*' 来做兜底。但在 Vue Router 4 中，通配符 * 已被移除，因为当使用 history 模式时，浏览器原生会将 * 视为非法字符。
    */
    path: '/:pathMatch(.*)*', // 核心正则匹配语法
    name: 'NotFound',
    component: () => import('@/views/404/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(() => {
  startPageProgress()
})

router.afterEach(() => {
  finishPageProgress()
})

router.onError(() => {
  finishPageProgress()
})

export default router
