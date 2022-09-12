const column = [
  { label: 'ID', prop: 'id' },
  { label: '邮箱', prop: 'email' },
  { label: '认证名称', prop: 'new_company_name' },
  { label: '认证类型', prop: 'edit_type_desc' },
  { label: '申请时间', prop: 'created_at' },
  { label: '审核状态', prop: 'check_status_desc' }
]
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
export {
  column, myBackToTopStyle
}
