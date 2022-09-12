import request from '@/utils/request'
export default {
  memberList(data) {
    return request({
      url: 'fd/V4/order.member.list',
      method: 'post',
      data
    })
  }
}
