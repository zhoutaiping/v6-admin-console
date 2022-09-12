const REPORTFORM_RULE = {
  edit_type: [{ required: true, message: '请选择修改类型' }],
  customer_email: [
    { required: true, message: '请输入YUNDUN注册账号', trigger: 'change' }
  ],
  customer_name: [
    { required: true, message: '请输入客户名称', trigger: 'change' }
  ],
  member_status: [],
  member_status_date: [],
  customer_type: [], // [ { required: true, message: '请选择客户层级', trigger: 'change' } ],
  customer_level: [], // [{ required: true, message: '请选择服务等级' }],
  customer_nums: [],
  customer_stage: [],
  is_no_commission: [],
  customer_sale: [{ required: true, message: '请选择销售', trigger: 'change' }],
  customer_sale_after: [],
  customer_sale_before: [],
  remark: [{ required: true, message: '请输入变更原因' }],
  customer_industry_type: [
    {
      type: 'array',
      required: true,
      message: '请选择行业类别',
      trigger: 'change'
    }
  ]
}
const REPORTFORM = {
  edit_type: '',
  remark: '',
  customer_email: '',
  member_status: '',
  member_status_date: '',
  customer_name: '',
  customer_level: '',
  customer_nums: '',
  customer_stage: '',
  customer_sale: [],
  customer_sale_after: [],
  customer_sale_before: [],
  customer_industry_type: []
}
const INFOFORM_RULE = {
}
const EDITTYPE = [
  { label: '变更基本信息', value: 'base' },
  { label: '变更服务等级', value: 'customer_level' },
  { label: '变更所属销售', value: 'customer_sale' },
  { label: '变更行业类型', value: 'customer_industry_type' },
  { label: '变更服务阶段', value: 'member_type' }
]
export {
  REPORTFORM,
  REPORTFORM_RULE,
  INFOFORM_RULE,
  EDITTYPE,
  setIndustryGroup,
  getUpParams
}

function getUpParams(edit_type, oldForm, paramsData, user_list, industry) {
  switch (edit_type) {
    case 'base':
      paramsData['old_data'] = {
        '客户名称': oldForm.customer_name,
        '售后技术支持': sale_text(user_list, oldForm.customer_sale_after),
        '售前技术支持': sale_text(user_list, oldForm.customer_sale_before)
      }
      paramsData['new_data'] = {
        '客户名称': paramsData.customer_name,
        '售后技术支持': sale_text(user_list, paramsData.customer_sale_after),
        '售前技术支持': sale_text(user_list, paramsData.customer_sale_before)
      }
      break
    case 'customer_type':
      paramsData['old_data'] = { '客户层级': oldForm.customer_type }
      paramsData['new_data'] = { '客户层级': paramsData.customer_type }
      break
    case 'customer_level':
      paramsData['old_data'] = { '服务等级': oldForm.customer_level }
      paramsData['new_data'] = { '服务等级': paramsData.customer_level }
      break
    case 'customer_sale':
      paramsData['old_data'] = { '销售': sale_text(user_list, oldForm.customer_sale) }
      paramsData['new_data'] = { '销售': sale_text(user_list, paramsData.customer_sale) }
      break
    case 'customer_industry_type':
      paramsData['old_data'] = {
        '一级行业类型': industry_text(industry.one_level_industry_map, oldForm.industry_one_level),
        '二级行业类型': industry_text(industry.second_level_industry_map, oldForm.industry_second_level)
      }
      paramsData['new_data'] = {
        '一级行业类型': industry_text(industry.one_level_industry_map, paramsData.industry_one_level),
        '二级行业类型': industry_text(industry.second_level_industry_map, paramsData.industry_second_level)
      }
      break
    case 'member_status':
      paramsData['old_data'] = { '服务阶段': oldForm.member_status, '服务阶段更新时间': oldForm.member_status_date }
      paramsData['new_data'] = { '服务阶段': paramsData.member_status, '服务阶段更新时间': paramsData.member_status_date }
      break
    default:
      break
  }
  return paramsData
}

function sale_text(list, value) {
  let text = ''
  value.forEach((i, index) => {
    const item = list.filter(k => Number(k.user_id) === Number(i))
    if (item.length)text = text ? text + ',' + item[0].name : item[0].name
  })
  return text
}
function industry_text(list, value) {
  const text = list.find(i => i.value === value) ? list.find(i => i.value === value).label : ''
  return text
}

function setIndustryGroup(list) {
  const group = []
  const newList = []

  list.forEach(item => {
    const find_index = group.indexOf(item.id)
    if (find_index < 0 && parseInt(item.pid, 10) === 0) {
      group.push(item.id)
      newList.push({
        label: item.industry_name,
        value: item.id,
        children: []
      })
    }
  })
  return newList
}
