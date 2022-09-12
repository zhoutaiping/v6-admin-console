import request from '@/utils/request'
import requestAll from '@/utils/requestAll'
export default {

  ServiceUpload: function ServiceUpload(data) {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    return requestAll({
      url: '/V4/uploadfile',
      method: 'post',
      data,
      config
    })
  },

  getServiceLog: function getServiceLog(params) {
    return request({
      url: '/V4/service.apply.check.log',
      method: 'get',
      params: params
    })
  },

  ServiceCheck: function ServiceCheck(data) {
    return request({
      url: '/V4/service.apply.check',
      method: 'PUT',
      data
    })
  },

  getServiceInfo: function getServiceInfo(params) {
    return request({
      url: '/V4/service.apply.info',
      method: 'get',
      params: params
    })
  },

  getMeberBasicInfo: function getMeberBasicInfo(params) {
    return request({
      url: '/V4/service.apply.member.basicInfo.get',
      method: 'get',
      params: params
    })
  },

  serviceAdd: function serviceAdd(data) {
    return request({
      url: '/V4/service.apply.add',
      method: 'post',
      data
    })
  },

  getIndustry: function getIndustry(params) {
    return request({
      url: '/V4/service.apply.member.info.industry.get',
      method: 'get',
      params: params
    })
  },

  // V4/service.apply.list  服务开通单列表
  getServiceApplyList: function getServiceApplyList(params) {
    return request({
      url: '/V4/service.apply.list',
      method: 'get',
      params: params
    })
  },

  // 终止订单价格
  getEndPrice: function getEndPrice(data) {
    return request({
      url: '/fd/V4/order.end_price',
      method: 'post',
      data
    })
  },

  // 终止订单
  getEndOrder: function getEndOrder(data) {
    return request({
      url: '/fd/V4/order.end_pay',
      method: 'post',
      data
    })
  },

  // 获取要绑定的域名
  getDomainList: function getDomainList(data) {
    return request({
      url: '/V4/CloudDns.Domain.DnsDomain.getList',
      method: 'post',
      data
    })
  },

  getOrderList: function getOrderList(data) {
    return request({
      url: '/V4/customer.plan.list',
      method: 'post',
      data
    })
  },

  // Account.Member.like
  getMemberList: function getMemberList(data) {
    return request({
      url: '/V4/Account.Member.like',
      method: 'post',
      data
    })
  },

  editDiyPlanName: function editDiyPlanName(data) {
    return request({
      url: '/V4/customer.plan.update',
      method: 'post',
      data
    })
  },

  savebinddomain: function savebinddomain(data) {
    return request({
      url: '/fd/V4/order.bind_domain',
      method: 'post',
      data
    })
  },

  getProductList: function getProductList(params) {
    return request({
      url: '/V4/product.list',
      method: 'get',
      params: params
    })
  },

  getProductMeal: function getProductMeal(data) {
    return request({
      url: '/V4/product.meal.list',
      method: 'post',
      data
    })
  },

  customerInfo: function customerInfo(params) {
    return request({
      url: '/V4/customer.plan.info',
      method: 'get',
      params: params
    })
  },

  createPrice: function createPrice(data) {
    return request({
      url: '/fd/V4/order.create_price',
      method: 'post',
      data
    })
  },

  AccountInfo: function AccountInfo(data) {
    return request({
      url: '/V4/Account.Member.info',
      method: 'post',
      data
    })
  },

  createorder: function createorder(data) {
    return request({
      url: '/fd/V4/order.create_pay',
      method: 'post',
      data
    })
  },

  orderUp: function orderUp(data) {
    return request({
      url: '/fd/V4/order.up_pay',
      method: 'post',
      data
    })
  },

  orderupprice: function orderupprice(data) {
    return request({
      url: '/fd/V4/order.up_price',
      method: 'post',
      data
    })
  },

  orderZengzhi: function orderZengzhi(data) {
    return request({
      url: '/fd/V4/order.zengzhi',
      method: 'post',
      data
    })
  },

  orderKuorong: function orderKuorong(data) {
    return request({
      url: '/fd/V4/order.kuorong',
      method: 'post',
      data
    })
  },

  orderCancel: function orderCancel(data) {
    return request({
      url: '/fd/V4/order.cancel',
      method: 'post',
      data
    })
  },

  getPlanOrder: function getPlanOrder(data) {
    return request({
      url: '/fd/V4/order.plan.list',
      method: 'post',
      data
    })
  },

  getRenewPrice: function getRenewPrice(data) {
    return request({
      url: '/fd/V4/order.renew_price',
      method: 'post',
      data
    })
  },

  SaveRenewPay: function SaveRenewPay(data) {
    return request({
      url: '/fd/V4/order.renew_pay',
      method: 'post',
      data
    })
  },

  SaveKuorongPay: function SaveKuorongPay(data) {
    return request({
      url: '/fd/V4/order.kuorong_pay',
      method: 'post',
      data
    })
  },

  getKuorongPrice: function getKuorongPrice(data) {
    return request({
      url: '/fd/V4/order.kuorong_price',
      method: 'post',
      data
    })
  },

  SaveDownPay: function SaveDownPay(data) {
    return request({
      url: '/fd/V4/order.down_pay',
      method: 'post',
      data
    })
  },

  getDownPrice: function getDownPrice(data) {
    return request({
      url: '/fd/V4/order.down_price',
      method: 'post',
      data
    })
  },

  // order.zengzhi_price

  getZengzhiPrice: function getZengzhiPrice(data) {
    return request({
      url: '/fd/V4/order.zengzhi_price',
      method: 'post',
      data
    })
  },

  SaveZengzhi: function SaveZengzhi(data) {
    return request({
      url: '/fd/V4/order.zengzhi_pay',
      method: 'post',
      data
    })
  },

  // order.coupon.unuse 优惠券

  getCouponUnuse: function getCouponUnuse(data) {
    return request({
      url: '/fd/V4/order.coupon.unuse',
      method: 'post',
      data
    })
  }

}
