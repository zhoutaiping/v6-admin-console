function filterMeber(username, key) {
  return (restaurant) => {
    const findIndex = restaurant[key].indexOf(username.trim())
    if (findIndex > -1) {
      return restaurant
    }
  }
}
// 集合对象转集合
function ArrObjToArr(ArrObj) {
  const list = []
  if (Object.keys(ArrObj).length) {
    Object.keys(ArrObj).forEach(item => {
      list.push({
        'label': item,
        'value': ArrObj[item]
      })
    })
  }
  return list
}
const INVOICEFORM = {
  email: '', mid: '', id: '', invoice_type: '',
  certification_type: '',
  certification_type_desc: '',
  company: '', company_taxer_code: '', company_reg_address: '',
  company_reg_tel: '', company_bank: '', company_bank_code: '',
  biz_licence_img: '', biz_licence_img_file: '', invoice_title: '', invoice_user: '', invoice_mobile: '', invoice_address: '', default: '1'
}
const INVOICEFORM_RULE = {
  certification_type: [],
  certification_type_desc: [],
  email: [{ required: true, message: '请选择正确注册邮箱', trigger: ['change', 'blur'] }],
  company: [{ required: true, message: '输入开具类型', trigger: ['change', 'blur'] }],
  company_taxer_code: [{ required: true, message: '请输入税务登记证号', trigger: ['change', 'blur'] }],
  invoice_user: [], // [{ required: true, message: '请输入发票收件人', trigger: ['change', 'blur'] }],
  invoice_title: [{ required: true, message: '请输入发票抬头', trigger: ['change', 'blur'] }],
  invoice_type: [{ required: true, message: '请选择发票类型', trigger: ['change', 'blur'] }],
  invoice_mobile: [], // [{ required: true, message: '请选择发票收件人电话', trigger: ['change', 'blur'] }],
  invoice_address: [], // [{ required: true, message: '请选择发票收件人地址', trigger: ['change', 'blur'] }],
  default: [{ required: true, message: '请选择地址类型', trigger: ['change', 'blur'] }],
  company_bank: [{ required: true, message: '请输入开户银行', trigger: ['change', 'blur'] }],
  company_bank_code: [{ required: true, message: '请输入开户银行号', trigger: ['change', 'blur'] }],
  company_reg_address: [{ required: true, message: '请输入注册地址', trigger: ['change', 'blur'] }],
  company_reg_tel: [{ required: true, message: '请输入注册固定电话', trigger: ['change', 'blur'] }]
}

export {
  filterMeber, ArrObjToArr,
  INVOICEFORM, INVOICEFORM_RULE
}
