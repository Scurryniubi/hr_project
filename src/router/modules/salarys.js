import Layout from '@/layout/index.vue'

export default {
  path: '/salarys', // 薪资
  component: Layout,
  children: [
    {
      path: '',
      name: 'Salarys',
      component: () => import('@/views/salarys'),
      meta: { title: '薪资', icon: 'money' }
    }
  ]
}
