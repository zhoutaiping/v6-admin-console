export default {
  a: 0,
  getindustryGroup: function getindustryGroup(list) {
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
      } else {
        newList.forEach(n_list => {
          if (n_list.value === item.pid) {
            n_list.children.push({
              label: item.industry_name,
              value: item.id,
              pid: item.pid
            })
          }
        })
      }
    })
    // delet  children === 0
    newList.forEach(item => {
      if (item.children.length === 0) {
        delete item.children
      }
    })
    return newList
  },

  getSaleGroup: function getSaleGroup(roleList, userList) {
    const group = []
    roleList.forEach((item, index) => {
      group.push({
        label: item.role_name,
        value: item.user_id,
        role_id: item.id,
        role_flag: item.role_flag,
        status: item.status,
        children: []
      })
    })

    userList.forEach(item => {
      for (let index = 0; index < group.length; index++) {
        if (group[index].role_id === item.role_id) {
          group[index].children.push({
            label: item.name || item.user_id || '',
            value: item.user_id,
            status: item.name ? item.status : '0',
            role_id: item.role_id
          })
        }
      }
    })
    group.forEach(item => {
      if (!item.children.length) {
        delete item.children
      }
    })
    return group
  },

  search: {
    email: '',
    sale: '',
    member_status: '',
    member_level: '',
    member_name: '',
    nickname: '',
    certification_name: '',
    industry: '',
    is_no_commission: '',
    is_strategic_coustomer: '',
    reason_top: '',
    reason_second: '',
    reason_top_2: '',
    reason_second_2: '',
    loss_date: '',
    loss_date_start: '',
    loss_date_end: '',
    member_status_time_start: '',
    member_status_time_end: '',
    industry_one_level: '',
    industry_second_level: ''
  },
  COLUMN: [
    { label: 'ID', prop: 'member_id', width: 100, fixed: 'left' },
    { label: '客户报备名称', prop: 'customer_name', width: 180 },
    { label: '客户类别', prop: 'member_type', width: 180 },
    { label: '销售易客户', prop: 'is_xsy_customer', width: 180 },
    { label: '所属销售', prop: 'sales', width: 200 },
    { label: '注册邮箱', prop: 'customer_email', width: 200 },
    { label: '客户认证名称', prop: 'certification_name', width: 200 },
    { label: '客户第一阶段', prop: 'member_stage_one_level', width: 200 },
    { label: '客户第二阶段', prop: 'member_stage_second_level', width: 200 },
    { label: '客户等级', prop: 'customer_level' },
    { label: '所属行业', prop: 'industry', width: 200 },
    { label: '服务阶段', prop: 'member_status', width: 200 },
    { label: '服务阶段最新修改时间', prop: 'member_status_date', width: 200 },
    { label: '最新MRR', prop: 'customer_mrr_est' },
    { label: '实际月消费', prop: 'customer_mrr_real', width: 150 }
  ]
}
