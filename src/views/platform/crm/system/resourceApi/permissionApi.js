import request from '@/utils/request'

export default {
  getResourceList: function getResourceList(params) {
    return request({
      url: '/V4/rbac.resource.getList',
      method: 'get',
      params: params
    })
  },

  getResourceById: function getResourceById(params) {
    return request({
      url: '/V4/rbac.resource.get',
      method: 'get',
      params: params
    })
  },

  ResourceDel: function getResourceDel(data) {
    return request({
      url: '/V4/rbac.resource.del',
      method: 'DELETE',
      data
    })
  },

  ResourceUpdate: function getResourceUpdate(data) {
    return request({
      url: '/V4/rbac.resource.update',
      method: 'PUT',
      data
    })
  },

  ResourceAdd: function getResourceAdd(data) {
    return request({
      url: '/V4/rbac.resource.add',
      method: 'POST',
      data
    })
  }
}
