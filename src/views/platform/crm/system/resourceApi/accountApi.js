import request from '@/utils/request'

export default {
  getUserList: function getUserList(params) {
    return request({
      url: '/V4/rbac.user.getList',
      method: 'get',
      params: params
    })
  },

  userAdd: function userAdd(data) {
    return request({
      url: '/V4/rbac.user.add',
      method: 'post',
      data
    })
  },

  userUpdate: function userUpdate(data) {
    return request({
      url: '/V4/rbac.user.update',
      method: 'PUT',
      data
    })
  },

  getUserById: function getUserById(params) {
    return request({
      url: '/V4/rbac.user.get',
      method: 'get',
      params: params
    })
  }
}
