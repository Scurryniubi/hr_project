import Layout from '@/layout/index.vue'

export default {
  path: '/attendances', // 考勤
  component: Layout,
  children: [
    {
      path: '',
      name: 'Attendances',
      component: () => import('@/views/attendances'),
      meta: { title: '考勤', icon: 'skill' }
    }
  ]
}
