const ipForm = {
  add_ip_type: 'ip',
  add_tag: '',
  is_dispatch: 0,
  id: '',
  server_id: '',
  ip: '',
  ip_version: '',
  use_type: '',
  isp_lines: '',
  isp_line_type: '',
  net_speed_up: '',
  net_speed_down: '',
  net_fee_type: '',
  null_limit: '',
  null_time: '',
  risk_policy: [],
  ads_supplier: '',
  ads_cluster_clean_max: '',
  ads_clean_type: '',
  ip_remove_sensitive: 0,
  ip_share: 0,
  status: '',
  remark: '',
  region_code: []
}

function resetForm() {
  return {
    add_ip_type: 'ip',
    add_tag: '',
    is_dispatch: 0,
    id: '',
    server_id: '',
    ip: '',
    ip_version: '',
    use_type: '',
    isp_lines: '',
    isp_line_type: '',
    net_speed_up: '',
    net_speed_down: '',
    net_fee_type: '',
    null_limit: '',
    null_time: '',
    risk_policy: '',
    ads_supplier: '',
    ads_cluster_clean_max: '',
    ads_clean_type: '',
    ip_remove_sensitive: 0,
    ip_share: 0,
    status: '',
    remark: '',
    region_code: []
  }
}
// 线路类型：one/multi
const isp_line_type = [{
  label: '单线路',
  value: '1'
}, {
  label: '多线路 ',
  value: '2'
}]
// 用途：1cdn中心节点 2cdn业务节点 3cdn测试节点 4dns'
const use_type = [{
  label: '未配置 ',
  value: '0'
},
{
  label: 'cdn中心节点 ',
  value: '1'
}, {
  label: 'cdn业务节点 ',
  value: '2'
}, {
  label: 'cdn测试节点',
  value: '3'
}
  // {
  //   label: 'dns',
  //   value: '4'
  // }
]
// 1保底 2保底+弹性 3流量 4其他'
const net_fee_type = [{
  label: '保底',
  value: '1'
}, {
  label: '保底+弹性 ',
  value: '2'
}, {
  label: '流量',
  value: '4'
}, {
  label: '其他',
  value: '4'
}]
// '风险策略：1异网隔离 2udp风度 3海娃流量'
const risk_policy = [{
  label: '异网隔离',
  value: '1'
}, {
  label: 'udp封堵',
  value: '2'
}, {
  label: '海外流量',
  value: '3'
}, {
  label: 'SYN封大包',
  value: '4'
}]
// 'ads清洗方案：1常态清洗 2旁路清洗 3本地清洗 4异地清洗 5多清洗中心'
const ads_clean_type = [{
  label: '常态清洗',
  value: '1'
}, {
  label: '旁路清洗',
  value: '2'
}, {
  label: '本地清洗',
  value: '3'
}, {
  label: '异地清洗',
  value: '4'
}, {
  label: '多清洗中心',
  value: '5'
}]
// 敏感信息脱敏：1不脱敏 2脱敏'
const ip_remove_sensitive = [{
  label: '不脱敏 ',
  value: '1'
}, {
  label: '脱敏',
  value: '2'
}]
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

const rules = {
  use_type: [{ required: true, message: '请选择ip用途', trigger: ['change', 'blur'] }],
  isp_line_type: [{ required: true, message: '请选择线路类型', trigger: ['change', 'blur'] }],
  region_code: [{ required: true, message: '请选择地区', trigger: ['change', 'blur'] }],
  isp_lines: [{ required: true, message: '请选择线路', trigger: ['change', 'blur'] }],
  net_speed_up: [{ required: true, message: '请输入带宽大小', trigger: ['change', 'blur'] }],
  net_speed_down: [{ required: true, message: '请输入带宽大小', trigger: ['change', 'blur'] }],
  net_fee_type: [],
  null_limit: [],
  null_time: [],
  risk_policy: [],
  ads_supplier: [],
  ads_cluster_clean_max: [],
  ads_clean_type: [],
  remark: [],
  BGP_line: [{ type: 'array', required: true, message: '请选择线路', trigger: ['change', 'blur'] }]
}
export {
  ipForm,
  resetForm,
  rules,
  use_type,
  isp_lines,
  net_fee_type,
  risk_policy,
  ads_clean_type,
  ip_remove_sensitive,
  isp_line_type
}
