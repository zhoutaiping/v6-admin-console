import request from '@/utils/request'

export default {
  // 发票列表 V4/invoice.list
  getInvoiceDone: function getInvoiceDone(params) {
    return request({
      url: '/fd/V4/invoice.list.done',
      method: 'get',
      params: params
    })
  },
  getInvoiceList: function getInvoiceList(params) {
    return request({
      url: '/fd/V4/invoice.list',
      method: 'get',
      params: params
    })
  },
  getInvoiceDoing: function getInvoiceDoing(params) {
    return request({
      url: '/fd/V4/invoice.list.doing',
      method: 'get',
      params: params
    })
  },

  // V4/invoice.revoke
  invoiceRevoke: function invoiceRevoke(data) {
    return request({
      url: '/fd/V4/invoice.revoke',
      method: 'post',
      data
    })
  },

  // 申请退票V4/invoice.refund.request
  invoiceRefund: function invoiceRefund(data) {
    return request({
      url: '/fd/V4/invoice.refund.request',
      method: 'post',
      data
    })
  },
  // 审核 V4/invoice.audit
  invoiceAudit: function invoiceAudit(data) {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    return request({
      url: '/fd/V4/invoice.audit',
      method: 'post',
      data, config
    })
  },
  // 确认退票 V4/invoice.refund.confirm
  invoiceRefundConfirm: function invoiceRefundConfirm(data) {
    return request({
      url: '/fd/V4/invoice.refund.confirm',
      method: 'post',
      data
    })
  },
  getUnrequestList: function getUnrequestList(params) {
    return request({
      url: '/fd/V4/invoice.unrequest',
      method: 'get',
      params: params
    })
  },
  // 发票 - 用户发票信息列表
  getInvoicMemberList: function getInvoicMemberList(params) {
    return request({
      url: '/fd/V4/invoice.member.list',
      method: 'get',
      params: params
    })
  },

  // 发票 - 保存用户发票信息
  invoiceMemberSave: function invoiceMemberSave(data) {
    return request({
      url: '/fd/V4/invoice.member.save',
      method: 'post',
      data
    })
  },

  // V4/invoice.request.save
  invoiceRequestSave: function invoiceRequestSave(data) {
    return request({
      url: '/fd/V4/invoice.request.save',
      method: 'post',
      data
    })
  },
  // 申请发票信息 V4/invoice.request
  getInvoiceRequestInfo: function getInvoiceRequestInfo(params) {
    return request({
      url: '/fd/V4/invoice.request',
      method: 'get',
      params: params
    })
  }
}
