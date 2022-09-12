// import { isNumber } from 'util'

const SAVE_FORM = {
  'email': '',
  'balance': '',
  'id': '',
  'mid': '',
  'amount': 0,
  'change_type': '',
  'pay_type': '8',
  'bill_code': '',
  'screenshot': null,
  'remit_type': '8',
  'remark': '',
  'fileName': ''
}

const SAVE_FORM_RULE = {
  bill_code: [
    { validator: isNotNull, trigger: 'blur' }
  ],
  remit_type: [
    { validator: isNotNull, trigger: 'blur' }
  ],
  amount: [
    { validator: is_p_number, trigger: 'change' }
  ]
}

function isNotNull(rule, value, callback) {
  const str = value.trim()
  if (!str) {
    callback(new Error('必填字段!'))
  } else {
    callback()
  }
}

function is_p_number(rule, value, callback) {
  if (!value || Number(value) <= 0) {
    callback(new Error('必填字段!'))
  } else {
    callback()
  }
}
export {
  SAVE_FORM, SAVE_FORM_RULE
}
