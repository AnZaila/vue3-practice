import { createRouter, createWebHistory } from 'vue-router'
import systemRoutes from './system'
import organization from './organization'
import learning from './learning'

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
        component: () => import('@/views/dashboard/DashoardPage.vue'),
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
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
