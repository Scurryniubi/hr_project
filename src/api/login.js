import request from '@/utils/request'

export const loginAPI = ({ mobile, password }) => {
  return request.post('/sys/login', {
    mobile, password
  }
  )
}
