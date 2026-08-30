export default {
  path: 'learning',
  component: () => import('@/views/RouteGroupView.vue'),
  redirect: '/Vue3Learning',
  meta: {
    title: '我的练习',
  },
  children: [
    {
      path: 'Vue3Learning',
      component: () => import('@/views/learning/Vue3Learning.vue'),
    },
  ],
}
