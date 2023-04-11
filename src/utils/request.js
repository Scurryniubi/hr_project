import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    const token = store.getters.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const { message, success } = response.data
    // const e = new Error(message)
    // console.log(e)
    if (success) {
      // Message.success(message)
      return response.data
    } else {
      Message.error(message)
      return Promise.reject(new Error(message))
      // return new Error(message)
    }
  },
  error => {
    console.dir(error.response)
    if (error.response.status === 401) {
      Message('登录已过期，请重新登录')
      store.dispatch('user/logout')
      // router.replace('/login')
      console.log(router)
      router.push(`/login?redirect=${router.currentRoute.fullPath}`)
    }
    return Promise.reject(error)
  }
)

export default service
