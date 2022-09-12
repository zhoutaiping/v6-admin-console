
import request from '@/utils/request'
// import requestAll from '@/utils/requestAll'

export default {
  getsMemberid: function getsMemberid(data) {
    return request({
      url: '/fd/V4/remit.gets_memberid',
      method: 'post',
      data
    })
  },
  save: function save(data) {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    return request({
      url: '/fd/V4/remit.save',
      method: 'post',
      data,
      config
    })
  },

  getMemberList: function getMemberList(data) {
    return request({
      url: '/fd/V4/member.list',
      method: 'post',
      data
    })
  }

}
