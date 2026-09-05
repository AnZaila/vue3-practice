export default {
  path: 'learning',
  component: () => import('@/views/RouteGroupView.vue'),
  redirect: '/learning/Vue3Learning',
  meta: {
    title: '我的练习',
  },
  children: [
    {
      path: 'Vue3Learning',
      component: () => import('@/views/learning/Vue3Learning.vue'),
      meta: {
        title: 'Vue3Learning',
      },
    },
  ],
}
