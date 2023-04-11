import request from '@/utils/request'

export const getDepartmentsApi = () => {
  return request.get('/company/department')
}

/**
 * 获取员工简单列表
 * @returns promise对象
 */
export const getDepartmentsSimpleListApi = () => {
  return request.get('/sys/user/simple')
}

/**
 * 新增部门
 * @param {*} data 新增部门的数据
 * @returns promise对象
 */
export const addDepartmentsApi = (data) => {
  return request.post('/company/department', data)
}
