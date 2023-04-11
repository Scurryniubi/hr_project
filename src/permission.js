import router from './router'
// import { getToken } from '@/utils/auth'
// import { getters } from '@/store/getters'
import store from '@/store'
import getPageTitle from './utils/get-page-title'
import { Message } from 'element-ui'

import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist
const whiteList = ['/login', '/404']

router.beforeEach(async(to, from, next) => {
  const token = store.getters.token
  NProgress.start() // 开启进度条

  // 判断是否携带token
  if (token) {
    // 携带token的情况
    if (to.path === '/login') {
      // 由于已登录，若前往登录页，则拦截至首页
      next('/')
      Message.warning('您已经登录，请勿重复登录')
      NProgress.done() // 关闭进度条
    } else {
      next()
      console.log(111)
      store.dispatch('user/getId')
    }
  } else {
    // 没有携带token的情况
    // 判断是否在白名单中
    if (whiteList.includes(to.path)) {
      next() // 直接放行
    } else {
      next('/login') // 拦截到登录页
      // Message.warning('您还未登录，请先登录')
      console.log('拦截到登录页')
      NProgress.done() // 关闭进度条
    }
  }
  next()
})

router.afterEach((to) => {
  document.title = getPageTitle(to.meta.title)
  NProgress.done() // 关闭进度条
})
