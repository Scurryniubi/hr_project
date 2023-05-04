import request from '@/utils/request'

/**
 * 获取员工列表
 * @param {*} Query {page,size} page页码 size每页条数
 * @returns promise对象
 */
export const getEmployeeListAPI = (params) => {
  return request.get('/sys/user', { params })
}
