// 导入组件
import PageTools from '@/components/PageTools'
import UploadExcel from './UploadExcel/index.vue'
import UploadImg from './UploadImg'
import ImageHolder from './ImageHolder'

// 注册组件
export default {
  install(Vue) {
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('UploadImg', UploadImg)
    Vue.component('ImageHolder', ImageHolder)
  }
}

