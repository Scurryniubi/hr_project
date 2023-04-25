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

/**
 * 根据ID查询部门详情
 * @param {*} departId 部门id
 * @returns promise对象
 */
export const getDepartmentsDetailApi = (departId) => {
  return request.get(`/company/department/${departId}`)
}

/**
 * 编辑数据
 * @param {*} data 数据
 * @returns promise对象
 */
export const updataDepartmentsApi = (data) => {
  return request.put(`/company/department/${data.id}`, data)
}

export const deleteDepartmentApi = (departId) => {
  return request.delete(`/company/department/${departId}`)
}

