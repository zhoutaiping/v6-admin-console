import request from '@/utils/request'

export default {
  loginByUsername: function loginByUsername(data) {
    return request({
      url: '/V4/User/login',
      method: 'POST',
      data
    })
  },

  getUserRoleById: function getUserRole(params) {
    return request({
      url: '/V4/rbac.user.get',
      method: 'get',
      params: params
    })
  },

  // V4/rbac.role.resource.getList
  getResourceList: function getResourceList(params) {
    return request({
      url: '/V4/rbac.role.resource.getList',
      method: 'get',
      params: params
    })
  },

  // 根据用户获取资源
  async getResourceByuser(params) {
    const res = await request({
      url: '/V4/rbac.user.get.resource.list',
      method: 'get',
      params: params
    })
    return res
  },
  // 限管理 - 查看权限-用户-角色
  getRoleRelation: function getRoleRelation(params) {
    return request({
      url: '/V4/rbac.user.role.relation',
      method: 'GET',
      params: params
    })
  }
}
