import request from '@/utils/request'

// 获取用户基本资料
export function getUserProfileAPI() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

// 获取员工基本信息(主要是姓名和头像)
export function getInfo(id) {
  return request.get(`/sys/user/${id}`)
}
