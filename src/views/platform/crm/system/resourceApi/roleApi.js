import request from '@/utils/request'

export default {
  getRoleList: function getRoleList(params) {
    return request({
      url: '/V4/rbac.role.getList',
      method: 'get',
      params: params
    })
  },

  roleAdd: function roleAdd(data) {
    return request({
      url: '/V4/rbac.role.add',
      method: 'post',
      data
    })
  },

  roleUpdate: function roleUpdate(data) {
    return request({
      url: '/V4/rbac.role.update',
      method: 'PUT',
      data
    })
  },

  roleDel: function roleDel(data) {
    return request({
      url: '/V4/rbac.role.del',
      method: 'DELETE',
      data
    })
  },

  getRoleById: function getRoleById(params) {
    return request({
      url: '/V4/rbac.role.get',
      method: 'get',
      params: params
    })
  },
  // 权限管理 - 获取角色资源关联列表

  getResourceList: function getResourceList(params) {
    return request({
      url: '/V4/rbac.role.resource.getList',
      method: 'get',
      params: params
    })
  },
  // 限管理 - 保存角色资源
  getResourceUpdate: function getResourceUpdate(data) {
    return request({
      url: '/V4/rbac.role.resource.update',
      method: 'PUT',
      data
    })
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
