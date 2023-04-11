import Layout from '@/layout/index.vue'

export default {
  path: '/permission', // 权限
  component: Layout,
  children: [
    {
      path: '',
      name: 'Permission',
      component: () => import('@/views/permission'),
      meta: { title: '权限', icon: 'lock' }
    }
  ]
}
