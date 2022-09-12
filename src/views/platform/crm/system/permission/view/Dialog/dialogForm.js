import verify from '@/utils/verify'
const SAVE_FORM = {
  visible: false,
  loading: false,
  dialog_type: 'add',
  title: '新增',
  p_name: '', // 上级资源名称
  created_at: '',
  icon: '',
  id: '',
  method: '',
  name: '',
  pid: '',
  plat: 'adminV5Api',
  plat_host: '',
  remark: '',
  router: '',
  router_type: 1,
  router_type_fb: 1,
  sort: 255,
  status: 1,
  type: 'op',
  updated_at: ''
}
const SAVE_FORM_RULE = {
  name: [{ validator: isNotNull, trigger: 'blur' }],
  router: [{ validator: isNotNull, trigger: 'blur' }],
  icon: [{ validator: isNotNull, trigger: 'blur' }],
  plat_host: [{ validator: isNotNull, trigger: 'blur' }],
  plat: [{ validator: isNotNull, trigger: 'blur' }],
  type: [{ validator: isNotNull, trigger: 'blur' }],
  sort: [{ validator: isNumInt, trigger: 'blur' }]
}
const STATUS = [
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 }
]
const PLAT = [
  { label: 'adminV5Api', value: 'adminV5Api' },
  { label: 'apiV4', value: 'apiV4' }
]
const TYPE = [
  { label: '导航', value: 'nav' },
  { label: '菜单', value: 'menu' },
  { label: '功能', value: 'op' }
]
const ROUTER_TYPE = [
  { label: '静态', value: 1 },
  { label: '动态', value: 2 }
]
const ROUTER_TYPE_FB = [
  { label: '前端', value: 1 },
  { label: '后端', value: 2 }
]
const METHOD = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'DELETE', value: 'DELETE' },
  { label: '其他', value: '' }
]
function isNotNull(rule, value, callback) {
  const str = value.trim()
  if (!str) {
    callback(new Error('必填字段!'))
  } else {
    callback()
  }
}
// 整数类型
function isNumInt(rule, value, callback) {
  const plusnum = verify.plusnum.test(value)
  if (plusnum) {
    callback()
  } else {
    callback(new Error('请输入大于0整数'))
  }
}
export {
  SAVE_FORM, SAVE_FORM_RULE,
  STATUS, PLAT, TYPE, ROUTER_TYPE, ROUTER_TYPE_FB, METHOD
}
