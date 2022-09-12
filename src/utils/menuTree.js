/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(routes, list) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route } // 获取单个Tree
    const newList = hasPermission(list, tmp)
    tmp.children = tmp.children.concat(newList)
    if (tmp.children.length > 0) {
      tmp.children = hasPermissionChildren(tmp.children, list)
    }
    res.push(tmp)
  })
  return sortDataArray(res)
}

function hasPermissionChildren(children, list) {
  const res = []
  children.forEach(route => {
    const tmp = { ...route } // 获取单个Tree
    const newList = hasPermission(list, tmp)
    tmp.children = tmp.children.concat(newList)
    if (tmp.children.length > 0) {
      route.children = hasPermissionChildren(tmp.children, list)
    }
    res.push(tmp)
  })
  return sortDataArray(res)
}

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(list, route) {
  const children = []
  if (route.id && route.id !== '') {
    list.forEach(e => {
      if ([route.id].includes(e.pid)) {
        e.children = []
        children.push(e)
      }
    })
  }

  return sortDataArray(children)
}

function sortDataArray(dataArray) {
  return dataArray.sort(function(a, b) {
    return Date.parse(a.created_at.replace(/-/g, '/')) - Date.parse(b.created_at.replace(/-/g, '/'))
  })
}
export default {
  filterAsyncRouter
}
