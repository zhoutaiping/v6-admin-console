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
const search = { user_nickname: '' }
const COLUMN = [
  { label: 'ID', prop: 'id', width: '100', fixed: '' },
  { label: '操作内容', prop: 'action_name', width: '' },
  { label: '操作人', prop: 'user_nickname', width: '' },
  { label: '创建时间', prop: 'created_at', width: '' },
  { label: '更新时间', prop: 'updated_at', width: '' }
]
export {
  myBackToTopStyle, search, COLUMN
}
