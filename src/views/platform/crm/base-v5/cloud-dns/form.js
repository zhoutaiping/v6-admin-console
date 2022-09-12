
const search = {
  name: '', desc: '',
  status: '', parent_id: ''
}
const pagination = {
  page_sizes: [10, 20, 50, 100, 1000],
  page: 1,
  per_page: 10,
  total: 0
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

const STATUS = [
  { label: '启用', value: '1' }, { label: '禁用', value: '0' }
]
export {
  search, myBackToTopStyle, pagination, STATUS
}
