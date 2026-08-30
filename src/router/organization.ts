export default {
  path: 'organization',
  component: () => import('@/views/RouteGroupView.vue'),
  redirect: '/organization/department',
  meta: {
    title: '组织管理',
  },
  children: [
    {
      path: 'department',
      component: () => import('@/views/organization/DepartmentHome.vue'),
      meta: {
        title: '部门管理',
      },
    },
    {
      path: 'position',
      component: () => import('@/views/organization/PositionHome.vue'),
      meta: {
        title: '岗位管理',
      },
    },
  ],
}
