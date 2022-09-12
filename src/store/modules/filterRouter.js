function filterUserRouter(asyncRouterMap, userRouter, menu_key, is_admin) {
  const res = []
  if (is_admin) {
    asyncRouterMap.forEach(route => {
      const tmp = { ...route }
      if (tmp.children) tmp.children = filterUserRouter(tmp.children, userRouter, menu_key, is_admin)
      if (!tmp.hidden) tmp.hidden = tmp.meta && tmp.meta.menus ? !tmp.meta.menus.includes(menu_key) : false
      res.push(tmp)
    })
  } else {
    asyncRouterMap.forEach(route => {
      const tmp = { ...route }
      if (hasUserPermission(userRouter, tmp)) {
        if (tmp.children) tmp.children = filterUserRouter(tmp.children, userRouter, menu_key, is_admin)
        if (!tmp.hidden) tmp.hidden = tmp.meta && tmp.meta.menus ? !tmp.meta.menus.includes(menu_key) : false
        res.push(tmp)
      }
    })
  }
  return res
}
function hasUserPermission(roles, route) {
  if (route.path && route.path !== '') {
    return roles.some(role => [route.path].includes(role.router))
  } else {
    return false
  }
}
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}
function filterAsyncRouter(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) tmp.children = filterAsyncRouter(tmp.children, roles)
      res.push(tmp)
    }
  })
  return res
}
const adminList = ['zhoutaiping', 'huangkeke', 'zhaojinlei', 'lixuan', 'lijing', 'hujinyong', 'zhuchuanjiang', 'gaolu', 'kongfanbo']

export {
  filterUserRouter, hasUserPermission, filterAsyncRouter, hasPermission, adminList
}
