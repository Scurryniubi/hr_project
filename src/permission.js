import router from './router'
// import { getToken } from '@/utils/auth'
// import { getters } from '@/store/getters'
import store from '@/store'
import getPageTitle from './utils/get-page-title'
import { Message } from 'element-ui'
import { asyncRouteArr } from './router'
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
      // 如果存在 token，访问的是其他页面，直接放行
      if (!store.getters.userId) {
        const menus = await store.dispatch('user/getId')

        // 根据用户实际的权限 menus 从asyncRouteArr里, 过滤出用户能访问的页面的路由对象
        const filterRoutes = asyncRouteArr.filter((route) => {
          const routeName = route.children[0].name.toLowerCase()
          return menus.includes(routeName)
        })

        // 在路由添加完成后再添加404的页面
        filterRoutes.push({ path: '*', redirect: '/404', hidden: true })

        router.addRoutes(filterRoutes)

        // 将动态路由传递给 mutation 方法，进行合并
        store.commit('permission/setRoutes', filterRoutes)
        // router.addRoutes({ path: '*', redirect: '/404', hidden: true })

        // 解决刷新出现的白屏bug
        next({
          path: to.path, // 保证路由添加完了再进入页面 (可以理解为重进一次)
          replace: true // 重进一次, 不保留重复历史
        })
      }

      // console.log(111)
      // store.dispatch('user/getId')
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
