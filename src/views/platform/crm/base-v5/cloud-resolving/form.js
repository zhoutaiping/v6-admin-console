const search = {
  domain: '',
  email: '',
  mobile: '',
  created_at: '',
  expiry_time: '',
  level_id: '',
  domain_status: '',
  trust_status: '',
  is_record: '',
  zombiedomain: '',
  order: ''
}
const pagination = {
  page_sizes: [10, 20, 50, 100, 1000],
  page: 1,
  per_page: 10,
  total: 0
}

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
const tag_trust = {
  1: 'success',
  2: 'danger',
  3: 'warning',
  0: 'info'
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

const myBackToTopStyle = {
  right: '50px',
  bottom: '40px',
  width: '40px',
  height: '40px',
  'z-index': '999',
  'border-radius': '4px',
  'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
  background: '#e7eaf1' // 按钮的背景颜色 The background color of the button
}
const column = [
  { label: 'ID', prop: 'id', width: 100 },
  { label: '域名', prop: 'domain', width: 200 },
  { label: '手机号', prop: 'mobile' },
  { label: '邮箱', prop: 'email' },
  { label: '套餐', prop: 'level_desc', width: 100 },
  { label: '域名状态', prop: 'status_desc', width: 100 },
  { label: '托管状态', prop: 'trust_status_desc', width: 120 },
  { label: '是否备案', prop: 'is_record_desc', width: 100 },
  { label: '僵尸域名', prop: 'zombie_desc', width: 100 },
  { label: '是否来自迁移', prop: 'is_transfer_desc', width: 120 },
  { label: '添加时间-到期时间', prop: 'expiry_time', width: 250 }
]
export {
  column,
  search,
  myBackToTopStyle,
  pagination,
  tag_type,
  tag_record,
  tag_trust,
  trust_statuses,
  TRUST_STATUSES,
  IS_RECORD,
  DOMAIN_STATUSES
}
