import request from '@/utils/request'

/**
 * 获取员工列表
 * @param {*} Query {page,size} page页码 size每页条数
 * @returns promise对象
 */
export const getEmployeeListAPI = (params) => {
  return request.get('/sys/user', { params })
}

/**
 * @description: 添加员工
 * @param {*} data 表单数据
 * @return {*}
 */
export const addEmployeeAPI = (data) => {
  return request.post('/sys/user', data)
}

/**
 * @description: 删除员工
 * @param {*} id 员工id
 * @return {*}
 */
export function delEmployeeAPI(id) {
  return request({
    method: 'delete',
    url: `/sys/user/${id}`
  })
}

/**
 * @description: 导入excel
 * @param {*} data
 * @return {*}
 */
export function importEmployeeAPI(data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}

/**
 * @description: 保存员工信息
 * @param {*} data
 * @return {*}
 */
export function saveUserDetailByIdAPI(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * @description: 获取用户详细信息
 * @param {*} id 用户id
 * @return {*}
 */
export function getUserDetailByIdAPI(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

/**
 * @description: 为员工分配角色
 * @param {*} data { id:当前用户id, roleIds:选中的角色id组成的数组 }
 * @return {*}
 */
export function assignRolesAPI(data) {
  return request({
    url: '/sys/user/assignRoles',
    data,
    method: 'put'
  })
}
