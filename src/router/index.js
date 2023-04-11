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
export const asyncRoutes = [
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
        meta: { title: 'Dashboard', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/info',
    component: Layout,
    children: [{
      path: '',
      component: () => import('@/views/info/index'),
      meta: { title: 'Info', icon: 'dashboard' }}
    ]

  },

  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    scrollBehavior: () => ({ y: 0 }),
    // routes: constantRoutes
    routes: [...constantRoutes, ...asyncRoutes]
  })

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
