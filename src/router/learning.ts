export default {
  path: 'learning',
  component: () => import('@/views/RouteGroupView.vue'),
  redirect: '/learning/vue3-learning',
  meta: {
    title: '我的练习',
  },
  children: [
    {
      path: 'vue3-learning',
      component: () => import('@/views/learning/Vue3Learning.vue'),
      meta: {
        title: 'Vue3Learning',
      },
    },
  ],
}
