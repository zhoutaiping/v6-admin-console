import {
  asyncRouterMap,
  constantRouterMap
} from '@/router'
import * as filterRouter from './filterRouter.js'
const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        let accessedRouters = []
        const UserInfo = this.getters.user
        if (Number(UserInfo.is_admin) === 1) {
          accessedRouters = filterRouter.filterUserRouter(
            asyncRouterMap, asyncRouterMap, this.getters.menu_type || 'crm', true
          )
        } else {
          const login_menu_role = this.getters.login_menu_role
          accessedRouters = filterRouter.filterUserRouter(
            asyncRouterMap, login_menu_role, this.getters.menu_type || 'crm', false
          )
        }
        commit('SET_ROUTERS', accessedRouters)
        resolve(accessedRouters)
      })
    }
  }
}
export default permission
