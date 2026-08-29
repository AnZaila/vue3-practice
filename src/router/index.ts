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
          title: '工作台',
        },
      },
      {
        path: 'system',
        component: () => import('@/views/RouteGroupView.vue'),
        redirect: '/system/user',
        meta: {
          title: '系统管理',
        },
        children: [
          {
            path: 'user',
            component: () => import('@/views/system/UserHome.vue'),
            meta: {
              title: '用户管理',
            },
          },
          {
            path: 'role',
            component: () => import('@/views/system/RoleHome.vue'),
            meta: {
              title: '角色权限',
            },
          },
        ],
      },
      {
        path: 'organization',
        component: () => import('@/views/RouteGroupView.vue'),
        redirect: '/organization/department',
        meta: {
          title: '组织管理',
        },
        children: [
          {
            path: 'department',
            component: () => import('@/views/system/department/DepartmentHome.vue'),
            meta: {
              title: '部门管理',
            },
          },
          {
            path: 'position',
            component: () => import('@/views/system/position/PositionHome.vue'),
            meta: {
              title: '岗位管理',
            },
          },
        ],
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
