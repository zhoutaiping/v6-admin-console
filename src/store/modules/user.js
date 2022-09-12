import { getToken, setToken, removeToken } from '@/utils/auth'
import LoginResource from '@/api/loginApi'
import Message from 'ant-design-vue/lib/message'
import defaultSetting from '@/core/defaultSetting'
import Fetch from '@/utils/fetch'
import Rsa from '@/utils/rsa'
import Cookies from 'js-cookie'
const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    info: {},
    name: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    },
    menu_type: 'crm',
    munuItems: defaultSetting.munuItems,
    login_menu_role: []
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, data) => {
      state.info = data
    },
    MENU_TYPE: (state, key) => {
      state.menu_type = key
    },
    LOGIN_MENU_ROLE: (state, login_menu_role) => {
      state.login_menu_role = login_menu_role
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ dispatch, commit }, userInfo) {
      const { login_type, yzm = '' } = userInfo
      const params = {
        login_type: login_type,
        yzm: yzm
      }
      if (login_type === 1) {
        params.username = userInfo.username.trim()
        params.password = Rsa.rsaPublicData(userInfo.password)
      } else {
        params.mobile = userInfo.mobile
        params.code = userInfo.code
      }

      return new Promise((resolve, reject) => {
        LoginResource.loginByUsername(params).then(response => {
          const data = response
          if (data.id && data.account) {
            commit('SET_TOKEN', data.account)
            commit('SET_INFO', data)
            commit('MENU_TYPE', 'crm')
            localStorage.setItem('MENU_TYPE', 'crm')
            localStorage.setItem('userInfo', JSON.stringify(data))
            setToken(data.account)
            resolve()
          } else {
            localStorage.removeItem('userInfo')
            Message.warning('用户名或密码不正确!')
            reject()
          }
        }).catch(error => {
          dispatch('delSession')
          removeToken()
          reject(error)
        })
      })
    },

    GetLoginUserInfo({ dispatch }, params = {}) {
      return new Promise(async (resolve, reject) => {
        try {
          const data = await Fetch.get('/V4/User/getLoginUserInfo', params)
          dispatch('setLoginData', data)
          resolve(data)
        } catch (error) {
          dispatch('delSession')
          removeToken()
          reject(error)
          return
        }
      })
    },

    setLoginData({ commit }, data) {
      commit('SET_TOKEN', data.account)
      commit('SET_INFO', data)
      commit('MENU_TYPE', 'crm')
      localStorage.setItem('MENU_TYPE', 'crm')
      localStorage.setItem('userInfo', JSON.stringify(data))
      setToken(data.account)
    },

    // 根据用户id 获取用户资源  （菜单列表+已赋权接口权限）
    LoginMenuRole({ commit, state }, id) {
      return new Promise((resolve, reject) => {
        Fetch.get('/V4/rbac.user.get.resource.list', { id }).then(res => {
          commit('LOGIN_MENU_ROLE', res.list)
          resolve()
        })
      })
    },

    GetUserRole({ commit, state }) {
      const userInfo = localStorage.getItem('userInfo')
      if (JSON.parse(userInfo) && JSON.parse(userInfo).id !== '') {
        const params = { id: JSON.parse(userInfo).id }
        return new Promise((resolve, reject) => {
          LoginResource.getUserRoleById(params).then(res => {
            resolve(res)
          }).catch(e => {
            reject()
          })
        })
      }
    },

    getRoleByuser({ commit, state }) {
      const userInfo = localStorage.getItem('userInfo')
      if (JSON.parse(userInfo) && JSON.parse(userInfo).id !== '') {
        const params = { id: JSON.parse(userInfo).id }
        return new Promise((resolve, reject) => {
          LoginResource.getResourceByuser(params).then(res => {
            resolve(res)
          }).catch(e => {
            reject()
          })
        })
      }
    },
    // 获取用户信息
    GetUserInfo({ dispatch, commit, state }) {
      return new Promise((resolve, reject) => {
        dispatch('GetUserRole').then(res => {
          dispatch('LoginMenuRole', res.id).then(() => {
            commit('MENU_TYPE', localStorage.getItem('MENU_TYPE')) // 默认模块
            commit('SET_INFO', res)
            commit('SET_NAME', res.account)
            commit('SET_INTRODUCTION', '')
            if (res.role_ids && res.role_ids.length > 0) { // 验证返回的roles是否是一个非空数组
              commit('SET_ROLES', res.role_ids)
              resolve(res)
            } else {
              Message.warning('用户暂无角色,请找管理员分配!')
              commit('SET_ROLES', ['0'])
              resolve(res)
            }
          })
        }).catch(e => {
          dispatch('delSession')
          removeToken()
          resolve()
        })
      })
    },

    // 登出
    LogOut({ commit, dispatch, state }) {
      return new Promise(async (resolve, reject) => {
        try {
          const data = await Fetch.post('/V4/User/logout', {})
          Message.success('操作成功!')
          Cookies.remove('iam_jwt_token')
          dispatch('delSession')
          removeToken()

          // else {
          //   window.location.reload()// In order to re-instantiate the vue-router object to avoid bugs
          // }
          resolve(data)
        } catch (error) {
          reject()
          return
        }
      })
    },

    // 前端 登出
    FedLogOut({ dispatch }) {
      return new Promise(async (resolve) => {
        await Fetch.post('/V4/User/logout', {})
        Message.success('操作成功!')
        dispatch('delSession')
        removeToken()
        resolve()
      })
    },

    featchBasicConf({ commit, state }) {
      return new Promise((resolve, reject) => {
        resolve(313213)
      })
    },

    changeMenuType({ dispatch, commit, state }, data = {}) {
      return new Promise((resolve, reject) => {
        const { menu_type = '' } = data
        localStorage.setItem('MENU_TYPE', menu_type)
        commit('MENU_TYPE', menu_type)
        dispatch('GenerateRoutes').then(res => {
          resolve(res)
        })
      })
    }

  }
}

export default user
