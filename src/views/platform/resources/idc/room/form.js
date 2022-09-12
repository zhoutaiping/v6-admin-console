/**
 * 定义常用变量方法
 */

const search = {
  id: '',
  name: '',
  region: [],
  big_state_code: '',
  country_code: '',
  region_code: '',
  province_code: '',
  city_code: ''
}

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
const COLUMN = [{
  label: 'id',
  prop: 'id',
  width: 100
},
{
  label: 'IDC供应商',
  prop: 'name'
},
{
  label: '地区',
  prop: 'city_code'
},
{
  label: 'ISP',
  prop: 'isp'
},
{
  label: '防火墙权限',
  prop: 'firewall_power'
},
{
  label: '备注',
  prop: 'remark'
}
]
const pagination = {
  page_sizes: [10, 20, 50, 100],
  page: 1,
  per_page: 10,
  total: 0
}
const FIREWALL = [{
  label: '福州电信',
  value: '1'
}, {
  label: '福州联通',
  value: '2'
}, {
  label: '杭州联通',
  value: '3'
}, {
  label: '湖州电信',
  value: '4'
},
{
  label: '嘉兴电信',
  value: '5'
},
{
  label: '金华电信-三路口',
  value: '6'
}, {
  label: '台州电信',
  value: '7'
}, {
  label: '常州移动',
  value: '8'
}, {
  label: '杭州BGP-梅花楼',
  value: '9'
}
]

const ISP = [{
  label: '电信',
  value: 'dx'
},
{
  label: '联通',
  value: 'lt'
},
{
  label: '移动',
  value: 'yd'
},
{
  label: 'BGP',
  value: 'bgp'
},
{
  label: 'CN2',
  value: 'cn2'
},
{
  label: '国际线路',
  value: 'gjlx'
},
{
  label: '其他',
  value: 'other'
}
]
const FIREWALL_POWER = [{
  label: '有权限',
  value: '1'
},
{
  label: '无权限',
  value: '0'
}
]
export {
  search,
  myBackToTopStyle,
  pagination,
  COLUMN,
  FIREWALL,
  FIREWALL_POWER,
  ISP
}
