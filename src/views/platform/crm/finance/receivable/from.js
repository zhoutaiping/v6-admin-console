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

const TYPE_TEXT = { 1: '正常账单', 2: '红冲账单' }
const TYPE = [
  { label: '全部账单类型', value: '' },
  { label: '正常账单', value: '1' },
  { label: '红冲账单', value: '2' }
]
const SYNC_STATUS_TEXT = { 1: '未同步', 2: '已同步' }
const SYNC_STATUS = [
  { label: '全部同步金蝶状态', value: '' },
  { label: '未同步', value: '1' },
  { label: '已同步', value: '2' }
]
const FINANCIAL_CONFIRM_STATUS = [
  { label: '全部财务确认状态', value: '' },
  { label: '未确认', value: '1' },
  { label: '确认通过', value: '2' },
  { label: '确认不通过', value: '3' }
]
const TEST_USER = [
  { label: '全部用户', value: '-1' },
  { label: '测试用户', value: '1' },
  { label: '非测试用户', value: '0' }
]
const FINANCIAL_CONFIRM_STATUS_TEXT = { 1: '未确认', 2: '确认通过', 3: '确认不通过' } // 财务确认状态：1-未确认，2-确认通过，3-确认不通过.

const COLUMN = [
  { label: '应收单ID', prop: 'id', width: '100', fixed: 'left' },
  { label: '应收单标识', prop: 'receivable_code', width: '250' },
  { label: '订单ID', prop: 'order_id', width: '200' },
  { label: '订单标识', prop: 'order_code', width: '250' },
  { label: '套餐实例ID', prop: 'plan_id', width: '120' },
  { label: '套餐', prop: 'meal_flag', width: '200' },
  { label: '用户邮箱', prop: 'email', width: '180' },
  { label: '校正邮箱', prop: 'correct_member_email', width: '180' },
  { label: '客户名称', prop: 'cust_name', width: '180' },
  { label: '应收账期', prop: 'period', width: '' },
  { label: '账期开始时间', prop: 'period_start', width: '200' },
  { label: '账期结束时间', prop: 'period_end', width: '200' },
  { label: '账单类型', prop: 'type', width: '100' },
  { label: '回款时间', prop: 'remark', width: '180' },
  { label: '应收金额', prop: 'total_fee', width: '' },
  { label: '本次服务时长', prop: 'period_service_time', width: '150' },
  { label: '本次服务量', prop: 'period_service_num', width: '100' },
  { label: '支付类型', prop: 'pay_type', width: '100' },
  { label: '计费开始时间', prop: 'calc_start_time', width: '180' },
  { label: '计费结束时间', prop: 'calc_end_time', width: '180' },
  { label: '所属销售', prop: 'sale_name', width: '' },
  { label: '已回款金额', prop: 'pay_back_fee', width: '180' },
  { label: '账单创建时间', prop: 'created_at', width: '180' },
  { label: '账单更新时间', prop: 'updated_at', width: '180' },
  { label: '计费数量', prop: 'calc_num', width: '' },
  { label: '计费单价', prop: 'calc_unit_price', width: '' },
  { label: '同步金蝶状态', prop: 'sync_status', width: '180' },
  { label: '确认状态', prop: 'financial_confirm_status', width: '150' }
]

const search = {
  id: '',
  financial_confirm_status: '',
  contract_code: '',
  email: '',
  correct_member_email: '',
  order_id: '',
  plan_id: '',
  period: [],
  type: '',
  product_flag: '',
  meal_flag: '',
  feel_type: '',
  pay_type: '',
  sync_status: '',
  test_user: '-1'
}

export {
  myBackToTopStyle,
  search,
  COLUMN,
  TYPE_TEXT,
  TYPE,
  SYNC_STATUS_TEXT,
  SYNC_STATUS,
  FINANCIAL_CONFIRM_STATUS,
  TEST_USER,
  FINANCIAL_CONFIRM_STATUS_TEXT
}
