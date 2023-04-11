import Layout from '@/layout/index.vue'

export default {

  path: '/approvals', // 审批
  component: Layout,
  children: [
    {
      path: '',
      name: 'Approvals',
      component: () => import('@/views/approvals'),
      meta: { title: '审批', icon: 'tree-table' }
    }
  ]

}
