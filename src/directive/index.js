import power from './power'
import imgerr from './imgerr'

export default {
  install(Vue) {
    // 创建按钮级权限控制的自定义指令
    Vue.directive('power', power)
    Vue.directive('imgerr', imgerr)
  }
}
