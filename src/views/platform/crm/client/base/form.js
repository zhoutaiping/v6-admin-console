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
    { label: '??????????????????', prop: 'customer_name', width: 180 },
    { label: '????????????', prop: 'member_type', width: 180 },
    { label: '???????????????', prop: 'is_xsy_customer', width: 180 },
    { label: '????????????', prop: 'sales', width: 200 },
    { label: '????????????', prop: 'customer_email', width: 200 },
    { label: '??????????????????', prop: 'certification_name', width: 200 },
    { label: '??????????????????', prop: 'member_stage_one_level', width: 200 },
    { label: '??????????????????', prop: 'member_stage_second_level', width: 200 },
    { label: '????????????', prop: 'customer_level' },
    { label: '????????????', prop: 'industry', width: 200 },
    { label: '????????????', prop: 'member_status', width: 200 },
    { label: '??????????????????????????????', prop: 'member_status_date', width: 200 },
    { label: '??????MRR', prop: 'customer_mrr_est' },
    { label: '???????????????', prop: 'customer_mrr_real', width: 150 }
  ]
}
