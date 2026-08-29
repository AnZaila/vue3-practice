import { createRouter, createWebHistory } from 'vue-router'

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
          title: '首页',
        },
      },
      {
        path: 'system/user',
        component: () => import('@/views/system/UserHome.vue'),
        meta: {
          title: '用户管理',
        },
      },
      {
        path: 'system/role',
        component: () => import('@/views/system/RoleHome.vue'),
        meta: {
          title: '角色权限',
        },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
