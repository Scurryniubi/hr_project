import request from '@/utils/request'

/**
 * 角色管理-获取所有角色列表
 * @param {*} Query 查询参数，应当填充page(页码) 和 pagesize(每页条数)
 * @returns promise对象
 */
export const getRolesAPI = (params) => {
  return request.get('/sys/role', { params })
}

/**
 * 根据id查询企业
 * @param {*} companyId 企业ID
 * @returns promise对象
 */
export const getCompanyInfoAPI = (companyId) => {
  return request.get(`/company/${companyId}`)
}

/**
 * @description: 新增角色
 * @param {*} data {name,description}
 * @return {*}
 */
export const addRoleAPI = (data) => {
  return request.post('/sys/role', data)
}

/**
 * 根据ID获取角色详情
 * @param {*} id
 * @returns promise对象
 */
export const getRoleIdAPI = (id) => {
  return request.get(`/sys/role/${id}`)
}

/**
 * 根据ID更新角色
 * @param {*} id
 * @returns promise对象
 */
export const updataRoleAPI = (data) => {
  return request.put(`/sys/role/${data.id}`, data)
}

/**
 * 根据ID删除角色
 * @param {*} id
 * @returns promise对象
 */
export const deleteRoleAPI = (id) => {
  return request.delete(`/sys/role/${id}`)
}

/**
 * 给角色分配权限
 * @param {*} data {id:角色id, permIds:[] 所有选中的节点的id组成的数组}
 * @returns
 */
export function assignPermAPI(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
