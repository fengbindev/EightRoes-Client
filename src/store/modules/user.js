import Vue from 'vue'
import { login, getUserPriv, logout } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    token: '',
    adminUserName: '',
    userName: '',
    welcome: '',
    avatar: '',
    priv: '',
    info: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERNAME: (state, { userName, welcome }) => {
      state.userName = userName
      state.welcome = welcome
    },
    SET_ADMIN_USERNAME: (state, adminUserName) => {
      state.adminUserName = adminUserName
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_PRIV: (state, priv) => {
      state.priv = priv
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const result = response.data
          Vue.ls.set(ACCESS_TOKEN, result.access_token, result.expires_in)
          commit('SET_TOKEN', result.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getUserPriv().then(response => {
          const result = response.data
          if (result.keys) {
            commit('SET_PRIV', result.keys)
          }
          commit('SET_ADMIN_USERNAME', result.adminUserName)
          commit('SET_USERNAME', { userName: result.userName, welcome: welcome() })
          commit('SET_AVATAR', '/avatar2.jpg')
          commit('SET_INFO', { userName: result.userName, realName: result.realName })
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
          commit('SET_TOKEN', '')
          commit('SET_PRIV', [])
          Vue.ls.remove(ACCESS_TOKEN)
        })
      })
    }

  }
}

export default user
