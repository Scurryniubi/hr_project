import { loginAPI, getInfo, getUserProfileAPI } from '@/api'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

// import router from '@/router'
// import { resetRouter } from '@/router'
// import { loginAPI } from '@/api'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    companyId: null,
    userInfo: {},
    newObj: {}
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
    setToken(token)
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_COMPANYID: (state, companyId) => {
    state.companyId = companyId
  },
  REMOVE_TOKEN: (state) => {
    state.token = ''
    removeToken()
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_USER: (state, newObj) => {
    state.newObj = newObj
  }
}

const actions = {
  // user login
  async login({ commit }, loginForm) {
    // const { username, password } = userInfo
    try {
      const res = await loginAPI(loginForm)
      // console.log(res)
      commit('SET_TOKEN', res.data)
    } catch (error) {
      console.dir(error)
    }
  },

  // 获取id，name，avatar
  async getId({ commit }) {
    const { data: res } = await getUserProfileAPI()
    // console.log(res.userId)
    const { data: res2 } = await getInfo(res.userId)
    commit('SET_NAME', res2.username)
    commit('SET_AVATAR', res2.staffPhoto)
    commit('SET_COMPANYID', res2.companyId)
    commit('SET_USERINFO', res)
    const newObj = { ...res, ...res2 }
    // console.log(newObj.roles.menus)
    commit('SET_USER', newObj) // 保存到vuex的userInfo对象上 -> 一会儿用调试工具查看
    return newObj.roles.menus
    // console.log(res2)
  },

  // 登出 清除token
  async logout({ commit }) {
    commit('RESET_STATE')
    commit('REMOVE_TOKEN')
    // 重置路由
    resetRouter()
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

