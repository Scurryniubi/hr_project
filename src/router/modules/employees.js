import Layout from '@/layout/index.vue'

export default {
  path: '/employees', // 员工
  component: Layout,
  children: [
    {
      path: '',
      name: 'Employees',
      component: () => import('@/views/employees'),
      meta: { title: '员工信息', icon: 'people' }
    },
    {
      path: 'detail',
      name: 'employeesDetail',
      component: () => import('@/views/employees/detail'), // 路由懒加载
      hidden: true // 隐藏，防止二级菜单出现
    }
  ]
}
