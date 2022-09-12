const CONTRACTFORM_RULE = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ],
  user_name: [
    { required: true, message: '用户名不能为空', trigger: 'blur' }
  ],
  create_at: [{ type: 'string', required: true, message: '请选择日期', trigger: 'change' }],
  expire_date: [{ type: 'string', required: true, message: '请选择日期', trigger: 'change' }]
}

export {
  CONTRACTFORM_RULE
}
