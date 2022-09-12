const myBackToTopStyle = {
  right: '50px',
  bottom: '40px',
  width: '40px',
  height: '40px',
  'z-index': '999',
  'border-radius': '4px',
  'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
  background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
}
const COLUMN = [
  { label: '服务器ID', prop: 'id', width: 80 },
  { label: '服务器主IP', prop: 'ip', width: 150 },
  { label: '子IP', prop: 'serverIPs', width: 400, show_overflow_tooltip: false },
  { label: '所属机房(机房ID)', prop: 'idc_house_id', width: 350 },
  { label: '服务器类型', prop: 'server_type', width: 120 },
  { label: '备注', prop: 'remark' }
]

// 1物理机 2云主机 3虚拟机 4其他
const SERVER_TYPE_TEXT = { 1: '物理机', 2: '云主机', 3: '虚拟机', 4: '其他' }
const SERVER_TYPE = [{ label: '全部服务器', value: '' }, { label: '物理机', value: 1 }, { label: '云主机', value: 2 }, { label: '虚拟机', value: 3 }, { label: '其他', value: 4 }]

export default {
  myBackToTopStyle, COLUMN, SERVER_TYPE, SERVER_TYPE_TEXT
}
