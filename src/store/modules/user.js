import { loginAPI, getInfo, getUserProfileAPI } from '@/api'
import { getToken, setToken, removeToken } from '@/utils/auth'
// import router from '@/router'
// import { resetRouter } from '@/router'
// import { loginAPI } from '@/api'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
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
  REMOVE_TOKEN: (state) => {
    state.token = ''
    removeToken()
  }
}

const actions = {
  // user login
  async login({ commit }, loginForm) {
    // const { username, password } = userInfo
    try {
      const res = await loginAPI(loginForm)
      console.log(res)
      commit('SET_TOKEN', res.data)
    } catch (error) {
      console.dir(error)
    }
  },

  // 获取id，name，avatar
  async getId({ commit }) {
    const { data: res } = await getUserProfileAPI()
    console.log(res)
    const { data: res2 } = await getInfo(res.userId)
    commit('SET_NAME', res2.username)
    commit('SET_AVATAR', res2.staffPhoto)
    console.log(res2)
  },

  // 登出 清除token
  async logout({ commit }) {
    commit('RESET_STATE')
    commit('REMOVE_TOKEN')
  }

  // async getAvatarAndName({ commit }) {

  // },

  // get user info
  // getInfo({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     getInfo(state.token)
  //       .then((response) => {
  //         const { data } = response

  //         if (!data) {
  //           return reject('Verification failed, please Login again.')
  //         }

  //         const { name, avatar } = data

  //         commit('SET_NAME', name)
  //         commit('SET_AVATAR', avatar)
  //         resolve(data)
  //       })
  //       .catch((error) => {
  //         reject(error)
  //       })
  //   })
  // },

  // user logout
  // logout({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     logout(state.token)
  //       .then(() => {
  //         removeToken() // must remove  token  first
  //         resetRouter()
  //         commit('RESET_STATE')
  //         resolve()
  //       })
  //       .catch((error) => {
  //         reject(error)
  //       })
  //   })
  // },

  // remove token

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

