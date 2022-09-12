
import request from '@/utils/request'
import requestAll from '@/utils/requestAll'

export default {
  getOrderList: function getOrderList(data) {
    return request({
      url: '/fd/V4/order.list',
      method: 'post',
      data
    })
  },
  getOrderDetail: function getOrderDetail(data) {
    return requestAll({
      url: '/fd/V4/order.detail',
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

  paybackSave: function paybackSave(data) {
    return request({
      url: '/fd/V4/order.payback.save',
      method: 'post',
      data
    })
  },
  // V4/order.edit_price
  EditPrice: function EditPrice(data) {
    return request({
      url: '/fd/V4/order.edit_price',
      method: 'post',
      data
    })
  },

  SaveEdit: function SaveEdit(data) {
    return request({
      url: '/fd/V4/order.save_edit',
      method: 'post',
      data
    })
  },

  // member.role.getList
  getMemberList: function getMemberList(data) {
    return request({
      url: '/V4/member.role.getList',
      method: 'post',
      data
    })
  },
  // order.payback.list
  getPaybackList: function getPaybackList(data) {
    return request({
      url: '/fd/V4/order.payback.list_order',
      method: 'post',
      data
    })
  },

  // order.log_order
  getOrderLog: function getOrderLog(data) {
    return request({
      url: '/fd/V4/order.log_order',
      method: 'post',
      data
    })
  }

}
