import Layout from '@/layout/index.vue'

export default {
  path: '/employees', // 员工
  component: Layout,
  children: [
    {
      path: '',
      name: 'Employees',
      component: () => import('@/views/employees'),
      meta: { title: '员工', icon: 'people' }
    }
  ]
}
