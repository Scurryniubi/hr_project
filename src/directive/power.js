/**
 * 按钮级权限控制
 */
import store from '@/store'

export default {
  // inserted(el, binding) 自定义指令固定名字配置项inserted，指令所在标签，第一次被插入到真实DOM网页上时，此函数将自动执行
  // 参数1(el)：指令所在的标签(原生)
  // 参数2(binding): 指令关联的信息对象(包含给指令传入的值)
  inserted(el, binding) {
    // 从 vuex 中取出 points
    const points = store.state.user.userInfo.roles.points // 按钮权限点英文字符串数组

    // 如果 points 中有 binding.value 则显示
    // 不存在则隐藏
    if (!points.includes(binding.value)) {
      el.parentNode.removeChild(el)
    }
  }
}
