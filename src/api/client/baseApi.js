import request from '@/utils/request'

export default {
  // 基本信息-判断客户是否已经关联销售/售前/售后
  isRelation: function isRelation(data) {
    return request({
      url: '/fd/V4/customer.manage.isrelation',
      method: 'post',
      data
    })
  },
  // 基本信息-报备客户基本信息
  saveBasicInfo: function saveBasicInfo(data) {
    return request({
      url: '/fd/V4/customer.manage.savebasicinfo',
      method: 'post',
      data
    })
  },

  // 基本信息-获取客户基本信息配置
  getBasicConf: function getBasicConf(params) {
    return request({
      url: '/fd/V4/customer.manage.getbasicconf',
      method: 'get',
      params: params
    })
  },

  // 基本信息-获取已经报备过的用户列表
  getCustomerList: function getCustomerList(data) {
    return request({
      url: '/fd/V4/customer.manage.getcustomerlist',
      method: 'post',
      data
    })
  },

  getAccountMemberList(data) {
    return request({
      url: '/fd/V4/Account.Member.list',
      method: 'get',
      data
    })
  },

  // 基本信息-更新客户报备信息 fd/V4/customer.manage.updatebasicinf
  updateBasiCinf: function updateBasiCinf(data) {
    return request({
      url: '/fd/V4/customer.manage.updatebasicinfo',
      method: 'post',
      data
    })
  },

  // 基本信息-获取销售人员信息和角色信息
  getRelationUserInfo: function getRelationUserInfo(params) {
    return request({
      url: '/fd/V4/customer.manage.getrelationuserinfo',
      method: 'get',
      params: params
    })
  }
}
