
// 日账单ID 套餐ID 用户邮箱 所属销售 所属平台 计费规则 日账单金额（应付金额）实付金额 支付状态 账期 确认状态  账单类型
const BILL_DAY_COLUMN = [
  { label: '日账单ID', prop: 'id', width: '100', fixed: 'left' },
  { label: '套餐ID', prop: 'plan_id', width: '100' },
  { label: '用户邮箱', prop: 'member_eamil', width: '250' },
  { label: '所属销售', prop: 'user_name', width: '' },
  { label: '所属平台', prop: 'platform', width: '' },
  { label: '计费方式', prop: 'calc_way', width: '' },
  { label: '日账单金额（应付金额）', prop: 'pay_price', width: '' },
  { label: '实付金额', prop: 'pay_off_price', width: '' },
  { label: '账期', prop: 'cdn_date', width: '' },
  { label: '财务确认状态', prop: 'financial_confirm_status', width: '' },
  { label: '账单状态', prop: 'status', width: '' },
  { label: '账单类型', prop: 'type', width: '' }
]

// 月账单ID 套餐ID 关联日账单 用户邮箱 所属销售 所属平台 月账单金额（应付金额） 实付金额 账期 账期开始时间 账期结束时间 确认状态
const BILL_MONTH_COLUMN = [
  { label: '月账单ID', prop: 'id', width: '100', fixed: 'left' },
  { label: '套餐ID', prop: 'plan_id', width: '100' },
  { label: '关联日账单', prop: 'bill_day_ids', width: '200' },
  { label: '用户邮箱', prop: 'member_eamil', width: '250' },
  { label: '所属销售', prop: 'user_name', width: '' },
  { label: '所属平台', prop: 'platform', width: '' },
  { label: '月账单金额（应付金额）', prop: 'pay_price', width: '' },
  { label: '实付金额', prop: 'pay_off_price', width: '' },
  { label: '账期', prop: 'period', width: '' },
  { label: '账期开始时间', prop: 'start_date', width: '' },
  { label: '账期结束时间', prop: 'end_date', width: '' },
  { label: '财务确认状态', prop: 'financial_confirm_status', width: '' }
  // { label: '账单状态', prop: 'status', width: '' }
]

const FINANCIAL_CONFIRM_STATUS_TAG = {
  1: 'warning', 2: 'success', 3: 'danger'
}
const FINANCIAL_CONFIRM_STATUS_TEXT = {
  1: '未确认', 2: '确认通过', 3: '确认不通过'
}
const DAY_STATUS_TAG = {
  1: '', 2: 'success', 3: 'danger'
}
const DAY_STATUS_TEXT = {
  1: '初始化', 2: '己支付', 3: '未支付'
}
const MONTH_STATUS_TAG = {
  1: '', 2: 'success', 3: 'danger'
}
const MONTH_STATUS_TEXT = {
  1: '初始化', 2: '己完成', 3: '其他'
}
const PLATFORM_TEXT = {
  1: '云盾', 2: '白山'
}
// 1-流量，2，2-带宽，3-按月
const DAY_CALC_WAY = {
  1: '流量', 2: '带宽', 3: '按月'
}
const DAY_TYPE = {
  1: '正常账单', 2: '调整账单'
}
const STATUS_DAY = [
  { label: '初始化', value: '1' }, { label: '己支付', value: '2' }, { label: '未支付', value: '3' }
]
const STATUS_MONTH = [
  { label: '初始化', value: '1' }, { label: '已完成', value: '2' }, { label: '其他', value: '3' }
]
export {
  BILL_DAY_COLUMN, FINANCIAL_CONFIRM_STATUS_TAG, DAY_TYPE,
  STATUS_DAY, STATUS_MONTH, BILL_MONTH_COLUMN, DAY_CALC_WAY, MONTH_STATUS_TAG,
  FINANCIAL_CONFIRM_STATUS_TEXT, PLATFORM_TEXT, DAY_STATUS_TAG, DAY_STATUS_TEXT, MONTH_STATUS_TEXT
}
