import { asyncRouterMap, constantRouterMap } from '@/config/router.config'
import Privilege from '@/utils/privilege.js'

/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除
 *
 * @param permission
 * @param route
 * @returns {boolean}
 */
function hasPermission (route, privilege) {
  if (route.meta && route.meta.priv) {
    let flag = false
    for (let i = 0, len = route.meta.priv.length; i < len; i++) {
      flag = privilege.hasPriv(route.meta.priv[i])
      if (flag) {
        return true
      }
    }
    return false
  }
  return true
}

function filterAsyncRouter (routerMap, privilege) {
  const accessedRouters = routerMap.filter(route => {
    if (hasPermission(route, privilege)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, privilege)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

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
    GenerateRoutes ({ commit }, priv) {
      return new Promise(resolve => {
        const privilege = new Privilege(priv || {})
        const accessedRouters = filterAsyncRouter(asyncRouterMap, privilege)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
