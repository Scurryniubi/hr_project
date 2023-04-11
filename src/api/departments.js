import request from '@/utils/request'

export const getDepartmentsApi = () => {
  return request.get('/company/department')
}
