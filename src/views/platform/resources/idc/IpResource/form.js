import { GetCNGW, getCountryCity } from '@/utils/region'

const search = {
  id: '',
  server_ip: '',
  ip: '',
  region: ''
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
  label: '节点ID',
  prop: 'id',
  width: 100
},
{
  label: '节点IP',
  prop: 'ip',
  width: 200
},
{
  label: '主IP',
  prop: 'server_id',
  width: 200
},
{
  label: 'IP类型',
  prop: 'ip_type',
  width: 100
},
{
  label: '用途',
  prop: 'use_type',
  width: 120
},
{
  label: '属性',
  prop: 'params',
  width: 400
},
{
  label: 'YUNDUN脱敏',
  prop: 'ip_remove_sensitive',
  width: 150
},
{
  label: '备注',
  prop: 'remark',
  width: 150
}
]
const USE_TYPE_TEXT = {
  1: 'cdn中心节点 ',
  2: 'cdn业务节点 ',
  3: 'cdn测试节点 ',
  4: 'dns '
}
const ADS_CLEAN_TYPE_TEXT = {
  1: '常态清洗',
  2: '旁路清洗',
  3: '本地清洗',
  4: '异地清洗',
  5: '多清洗中心'
}
const ADS_CLEAN_TYPE = [{
  label: '常态清洗',
  value: 1
},
{
  label: '旁路清洗',
  value: 2
},
{
  label: '本地清洗',
  value: 3
},
{
  label: '异地清洗',
  value: 4
},
{
  label: '多清洗中心',
  value: 5
}
]
const NET_FEE_TYPE_TEXT = {
  1: '保底',
  2: '保底+弹性',
  3: '流量',
  4: '其他'
}
const NET_FEE_TYPE = [{
  label: '保底',
  value: 1
},
{
  value: 2,
  label: '保底+弹性'
},
{
  value: 3,
  label: '流量'
},
{
  value: 4,
  label: '其他'
}
]
const pagination = {
  page_sizes: [10, 20, 50, 100],
  page: 1,
  per_page: 10,
  total: 0
}
const tabPanel = [{
  label: '全部节点',
  value: '-1'
},
{
  label: '未配置',
  value: '0'
},
{
  label: 'CDN中心节点',
  value: '1'
},
{
  label: 'CDN业务节点',
  value: '2'
},
{
  label: 'CDN测试节点',
  value: '3'
}
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
const risk_policy = [{
  label: '异网隔离',
  value: '1'
},
{
  label: 'udp风度',
  value: '2'
},
{
  label: '海娃流量',
  value: '3'
}
]

function getBig(list) {
  const big_state = [] // 大洲编码
  const BIG = [] // 中国外的大洲-国家
  const country_code = [] // 国家编码
  const country = [] // 国家
  const filter_country = ['CN', 'TW', 'HK', 'MO']
  list.forEach(i => {
    if (big_state.indexOf(i.big_state_code) < 0) {
      big_state.push(i.big_state_code)
      BIG.push({
        label: i.big_state_name,
        value: i.big_state_code
      })
    }
    if (
      filter_country.indexOf(i.country_code) < 0 &&
            country_code.indexOf(i.country_code) < 0
    ) {
      country_code.push(i.country_code)
      country.push({
        big_state_code: i.big_state_code,
        big_state_name: i.big_state_name,
        label: i.country_name,
        value: i.country_code,
        id: i.id
      })
    }
  })
  country.forEach(c => {
    const children = list.filter(i => i.country_code === c.value && i.city_code)
    if (children.length) c.children = children
  })
  BIG.forEach(big => {
    const children = country.filter(i => i.big_state_code === big.value)
    if (children.length) big.children = children
  })
  const countryAll = [{
    label: '中国国内',
    value: 'CN',
    children: getCountryCity('CN', list)
  },
  {
    label: '中国海外',
    value: 'GAT',
    children: GetCNGW(['TW', 'HK', 'MO'], list)
  },
  {
    label: '国外',
    value: 'GW',
    children: BIG
  }
  ]
  return countryAll
}

export default {
  getBig,
  risk_policy,
  isp_lines,
  tabPanel,
  search,
  myBackToTopStyle,
  pagination,
  COLUMN,
  ADS_CLEAN_TYPE,
  ADS_CLEAN_TYPE_TEXT,
  NET_FEE_TYPE_TEXT,
  NET_FEE_TYPE,
  USE_TYPE_TEXT
}
