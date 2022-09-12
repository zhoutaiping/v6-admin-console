import request from '@/utils/request'
export default {
  // 审核 V4/invoice.audit
  flowAdd: function flowAdd(data) {
    return request({
      url: '/V4/financial.flow.add',
      method: 'post',
      data
    })
  },

  flowSave: function flowSave(data) {
    return request({
      url: '/V4/financial.flow.save',
      method: 'post',
      data
    })
  }
}
