const rootForm = {
  id: '',
  name: '',
  region: [],
  isp: '',
  firewall_power: '',
  firewall: '',
  ukey: '',
  country_code: '',
  region_code: '',
  province_code: '',
  city_code: '',
  remark: ''
}
var validateNull = (rule, value, callback) => {
  if (value.trim() === '') {
    callback(new Error('输入不正确'))
  } else {
    callback()
  }
}
const rules = {
  name: [{ required: true, validator: validateNull, message: '请输入IDC供应商名称', trigger: ['change', 'blur'] }],
  region: [{ type: 'array', required: true, message: '请选择地区', trigger: ['change', 'blur'] }],
  isp: [{ required: true, message: '请选择isp', trigger: ['change', 'blur'] }],
  ukey: [],
  firewall_power: [{ required: true, message: '请选择防火墙权限', trigger: ['change', 'blur'] }],
  firewall: [{ type: 'number', required: true, message: '请选择防火墙地区', trigger: ['change', 'blur'] }],
  remark: []
}
const FIREWALL = [
  // { label: '请选择', value: '' },
  { label: '福州电信', value: '1' }, { label: '福州联通', value: '2' }, { label: '杭州联通', value: '3' },
  { label: '湖州电信', value: '4' }, { label: '嘉兴电信', value: '5' }, { label: '金华电信-三路口', value: '6' },
  { label: '台州电信', value: '7' }, { label: '常州移动', value: '8' }, { label: '杭州BGP-梅花楼', value: '9' }, { label: '其他', value: '10' }
]
const isp_lines = [{
  label: '电信 ',
  value: 'dx'
},
{
  label: '联通 ',
  value: 'lt'
},
{
  label: '移动 ',
  value: 'yd'
},
{
  label: 'BGP ',
  value: 'bgp'
},
{
  label: 'CN2 ',
  value: 'cn2'
},
{
  label: '国际线路 ',
  value: 'gjxl'
},
{
  label: '其他 ',
  value: 'other'
}
]
export {
  rootForm,
  rules,
  FIREWALL,
  isp_lines
}
