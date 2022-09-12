import request from '@/utils/request'

export default {
  getReceivableList: function getReceivableList(params) {
    return request({
      url: '/V4/receivable.sys.list',
      method: 'get',
      params: params
    })
  },

  receivableExport: function receivableExport(data) {
    return request({
      url: '/V4/receivable.sys.export',
      method: 'post',
      data
    })
  }
}
