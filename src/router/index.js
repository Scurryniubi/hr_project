import Vue from 'vue'
import Router from 'vue-router'

import Approvals from './modules/approvals'
import Attendances from './modules/attendances'
import Departments from './modules/departments'
import Employees from './modules/employees'
import Permission from './modules/permission'
import Salarys from './modules/salarys'
import Setting from './modules/setting'
import Social from './modules/social'

Vue.use(Router)

import Layout from '@/layout'

// 动态路由规则
export const asyncRouteArr = [
  Departments,
  Setting,
  Employees,
  Permission,
  Approvals,
  Attendances,
  Salarys,
  Social
]

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  },

  {
    path: '/excel',
    component: Layout,
    hidden: true, // 不显示到左侧菜单
    children: [{
      path: '',
      component: () => import('@/views/excel')
    }]
  }

  // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    scrollBehavior: () => ({ y: 0 }),
    // routes: constantRoutes
    // routes: [...constantRoutes, ...asyncRoutes]
    routes: [...constantRoutes]
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
// 重置路由
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // 重新设置路由的可匹配路径
}

export default router
