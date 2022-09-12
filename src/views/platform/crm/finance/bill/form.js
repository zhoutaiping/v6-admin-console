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

const CONFIRM = [
  { label: '全部财务确认状态', value: '' },
  { label: '未确认', value: '0' },
  { label: '已确认', value: '1' }
]

const LIST_SEARCH = {
  bill_id: '',
  order_id: '',
  confirm: '',
  email: '',
  product_flag: '',
  meal_flag: '',
  time: ''
}
export {
  myBackToTopStyle, CONFIRM, LIST_SEARCH
}
