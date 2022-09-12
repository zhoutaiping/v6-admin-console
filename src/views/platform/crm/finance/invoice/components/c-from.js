
const APPLYFORM_RULE = {
  invoice_type: [{ required: true, message: '请选择发票类型', trigger: ['change', 'blur'] }]
}
const POSTFORM_RULE = {
  refund_remark: [{ required: true, message: '输入备注', trigger: ['change', 'blur'] }]
}
const REFUNDFORM_RULE = {
  refund_reason: [{ required: true, message: '请输入退票原因', trigger: ['change', 'blur'] }],
  refund_remark: [{ required: true, message: '输入备注', trigger: ['change', 'blur'] }],
  refund_express_company: [{ required: true, message: '请输入退票物流', trigger: ['change', 'blur'] }],
  refund_express_code: [{ required: true, message: '请输入物流单号', trigger: ['change', 'blur'] }]
}
const REVIEW_RULE = {
  audit: [{ required: true, message: '请选择审核结果', trigger: ['change', 'blur'] }],
  invoice_taxcode: [{ required: true, message: '请填写发票税号', trigger: ['change', 'blur'] }],
  invoice_img: [{ required: true, message: '请上传发票扫描件', trigger: ['change', 'blur'] }],
  refund_remark: [{ required: true, message: '请输入备注', trigger: ['change', 'blur'] }]
}
const REFUNDFORM_CONFIRM_RULE = {
  refund_img: [],
  refund_remark: [{ required: true, message: '输入备注', trigger: ['change', 'blur'] }]
}
export {
  APPLYFORM_RULE, POSTFORM_RULE, REFUNDFORM_RULE, REVIEW_RULE, REFUNDFORM_CONFIRM_RULE
}

