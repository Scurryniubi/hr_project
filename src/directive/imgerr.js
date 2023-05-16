
export default {
  // inserted(el, binding) 自定义指令固定名字配置项inserted，指令所在标签，第一次被插入到真实DOM网页上时，此函数将自动执行
  // 参数1(el)：指令所在的标签(原生)
  // 参数2(binding): 指令关联的信息对象(包含给指令传入的值)
  inserted(el, binding) {
    el.onerror = function() {
      el.src = binding.value
    }
  }
}
