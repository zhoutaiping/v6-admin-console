const rules = {
  op_pass: [{ required: true, message: '请输入操作密码', trigger: ['change', 'blur'] }],
  period: [{ required: true, message: '请选择账期', trigger: ['change', 'blur'] }],
  period_start: [{ required: true, message: '请选择账期内时间', trigger: ['change', 'blur'] }],
  period_end: [{ required: true, message: '请选择账期内时间', trigger: ['change', 'blur'] }],
  sync_status: [{ required: true, message: '请选择金蝶同步状态', trigger: ['change', 'blur'] }],
  financial_confirm_status: [{ required: true, message: '请选择财务确认状态', trigger: ['change', 'blur'] }],
  financial_confirm_time: [{ required: true, message: '请选择财务确认时间', trigger: ['change', 'blur'] }],
  calc_start_time: [{ required: true, message: '请选择计费开始时间', trigger: ['change', 'blur'] }],
  calc_end_time: [{ required: true, message: '请选择计费结束时间', trigger: ['change', 'blur'] }],
  period_service_time: [{ required: true, message: '请输入服务时长', trigger: ['change', 'blur'] }],
  period_service_num: [{ required: true, message: '请输入服务用量', trigger: ['change', 'blur'] }],
  calc_num: [{ required: true, message: '请输入计费数量', trigger: ['change', 'blur'] }],
  calc_unit_price: [{ required: true, message: '请输入计费价格', trigger: ['change', 'blur'] }],
  pay_back_fee: [{ required: true, message: '请输入回款金额', trigger: ['change', 'blur'] }],
  cust_name: [{ required: true, message: '请输入客户名称', trigger: ['change', 'blur'] }],
  sale_id: [{ required: true, message: '请选择销售', trigger: ['change', 'blur'] }],
  total_fee: [{ required: true, message: '请输入应收金额', trigger: ['change', 'blur'] }],
  remark: [{ required: true, message: '请选择回款时间', trigger: ['change', 'blur'] }]
}

export {
  rules
}
