/**
 * 把扁平结构的数据, 转成树形控件
 * @param {*} list
 * @param {*} rootValue
 * @returns
 */
export function transTree(list, rootValue) {
  // list: 整个数组, rootValue本次要查找的目标id -> 此函数为了找到rootValue目标id的下属们
  const treeData = [] // 装下属对象的
  list.forEach((item) => {
    if (item.pid === rootValue) {
      // 当前对象pid符合, 继续递归调用查找它的下属
      const children = transTree(list, item.id) // 返回item对象下属数组
      if (children.length) {
        item.children = children // 为item添加children属性保存下属数组
      }
      treeData.push(item) // 把当前对象保存到数组里, 继续遍历
    }
  })
  return treeData // 遍历结束, rootValue的id对应下属们收集成功, 返回给上一次递归调用children, 加到父级对象的children属性下
}
