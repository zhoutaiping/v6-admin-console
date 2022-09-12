const column_yd = [
  { label: 'ID', prop: 'id', width: 100, fixed: 'left' },
  { label: '用户邮箱', prop: 'email' },
  { label: '总余额', prop: 'total_blance' },
  { label: '微信充值余额', prop: 'online_balance_wx' },
  { label: '支付宝充值余额', prop: 'online_balance_alipay' },
  { label: '网银充值余额', prop: 'online_balance_bank_baofu' },
  { label: '支付宝转账余额', prop: 'offline_balance_alipay' },
  { label: '银行转账余额', prop: 'offline_balance_bank' }
]

const column_bs = [
  { label: 'ID', prop: 'id', width: 100, fixed: 'left' },
  { label: '用户邮箱', prop: 'email' },
  { label: '总余额', prop: 'total_blance' },
  { label: '微信充值余额', prop: 'baishan_online_balance_wx' },
  { label: '网银充值余额', prop: 'online_balance_bank_baofu' }

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
const search = {
  keyword: ''
}
export {
  column_yd, column_bs, myBackToTopStyle, search
}
