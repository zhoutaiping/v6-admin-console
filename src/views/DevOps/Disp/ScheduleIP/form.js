/**
 * 定义常用变量方法
 */

const search = {
  id: '',
  gid: '',
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
  background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
}
const COLUMN = [
  { label: '节点ID', prop: 'id', width: 100 },
  { label: '节点IP', prop: 'ip', width: 150 },
  { label: '主IP', prop: 'ip_main', width: 150 },
  { label: '分组标识', prop: 'gid', width: 100 },
  { label: '标签', prop: 'tags' },
  { label: '线路', prop: 'lines' },
  { label: '宕机状态', prop: 'down', width: 100 },
  { label: '状态', prop: 'status', width: 140 }
  // { label: '备注', prop: 'remark' }
]
const pagination = {
  page_sizes: [10, 20, 50, 100],
  page: 1,
  per_page: 10,
  total: 0
}
export default {
  search, myBackToTopStyle, pagination, COLUMN
}
