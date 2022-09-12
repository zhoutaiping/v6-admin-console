
const rules = {
  ip: [{ required: true, message: '请输入IP', trigger: ['change', 'blur'] }],
  idc_house_id: [{ type: 'number', required: true, message: '请选择机房', trigger: ['change', 'blur'] }],
  server_type: [{ required: true, message: '请选择服务器类型', trigger: ['change', 'blur'] }],
  cpu: [{ required: true, message: '请输入CPU', trigger: ['change', 'blur'] }],
  memory: [{ required: true, message: '请输入内存大小', trigger: ['change', 'blur'] }],
  os: [{ required: true, message: '请选择操作系统', trigger: ['change', 'blur'] }],
  idc_cabinet_code: [],
  route: [],
  remark: []
}
const OS = [{ label: 'Linux', value: 'linux' }, { label: 'Windows', value: 'windows' }, { label: '其他', value: '3' }]
const TYPE = [{ label: '物理机', value: '1' }, { label: '云主机', value: '2' }, { label: '虚拟机', value: '3' }, { label: '其他', value: '4' }]
const IDC_HOUSE = [
  { label: '福州电信', value: '1' }, { label: '福州联通', value: '2' }, { label: '杭州联通', value: '3' }, { label: '湖州电信', value: '4' }, { label: '嘉兴电信', value: '5' },
  { label: '金华电信-三路口', value: '6' }, { label: '台州电信', value: '7' }, { label: '常州移动', value: '8' }, { label: '杭州BGP-梅花楼', value: '9' }
]
const DISK_TYPE = [{ label: 'SATA', value: 'SATA' }, { label: 'SSD', value: 'SSD' }]
const serverForm_ip_Item = {
  ip_item: ''
}
const rules2 = {
  ip_item: []
}
const serverForm = {
  id: '',
  is_use: 0,
  clear_cache: 1,
  use_type: 1,
  server_type: '',
  ip: '',
  idc_house_id: '',
  idc_cabinet_code: '',
  route: '',
  os: '', // '操作系统：linux/windows/other'
  cpu: '',
  memory: '', // 内存
  disk: '', // '硬盘，JSON'
  DISK: [
    { size: 0, size_unit: 'GB', type: 'SATA' }
  ],
  status: '', // '状态：-1删除'
  remark: ''
}
function isIp(value) {
  var Address4 = require('ip-address').Address4
  var Address6 = require('ip-address').Address6
  return (new Address4(value)).isValid() && (new Address6(value)).isValid()
}
export {
  serverForm_ip_Item, serverForm, rules, IDC_HOUSE, OS, TYPE, DISK_TYPE, rules2, isIp
}
