import Layout from '@/layout/index.vue'

export default {
  path: '/permission', // 权限
  component: Layout,
  children: [
    {
      path: '',
      name: 'Permissions',
      component: () => import('@/views/permission'),
      meta: { title: '权限管理', icon: 'lock' }
    }
  ]
}
