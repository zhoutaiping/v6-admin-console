const tag_type = {
  1: 'success',
  2: 'info',
  3: 'danger',
  4: 'warning'
}
const tag_record = {
  1: 'success',
  2: 'info',
  0: 'danger'
}
const trust_statuses = {
  0: '未检测到DNS',
  1: '已接入',
  2: '未接入',
  3: '已接入，未解析'
}
const TRUST_STATUSES = [
  { label: '全部托管状态', value: '' },
  { label: '未检测到DNS', value: '0' },
  { label: '已接入', value: '1' },
  { label: '未接入', value: '2' },
  { label: '已接入，未解析', value: '3' }
]
const IS_RECORD = [
  { label: '全部备案状态', value: '' },
  { label: '未备案', value: '0' },
  { label: '已备案', value: '1' },
  { label: '未检测', value: '2' }
]
const DOMAIN_STATUSES = [
  { label: '全部域名状态', value: '' },
  { label: '正常', value: '1' },
  { label: '锁定', value: '2' },
  { label: '禁用', value: '3' },
  { label: '过户中', value: '4' }
]
// useyundun 可选	String
// 批量修改为已接入 1->已接入，2->未接入，3-已接入，未解析 默认1.
const USEYUNDUN = [
  { label: '已接入', value: '1' },
  { label: '未接入', value: '2' },
  { label: '已接入，未解析 ', value: '3' }
]
export {
  tag_type, tag_record, trust_statuses, TRUST_STATUSES, IS_RECORD, DOMAIN_STATUSES, USEYUNDUN
}
