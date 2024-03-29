import Layout from '@/layout/index.vue'

export default {
  path: '/social', // 社保
  component: Layout,
  children: [
    {
      path: '',
      name: 'Social_securitys',
      component: () => import('@/views/social'),
      meta: { title: '社保', icon: 'table' }
    }
  ]
}
