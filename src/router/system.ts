export default {
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
      path: 'permission',
      component: () => import('@/views/RouteGroupView.vue'),
      redirect: '/system/permission/role',
      meta: {
        title: '权限管理',
      },
      children: [
        {
          path: 'role',
          component: () => import('@/views/system/RoleHome.vue'),
          meta: {
            title: '角色权限',
          },
        },
      ],
    },
  ],
}
