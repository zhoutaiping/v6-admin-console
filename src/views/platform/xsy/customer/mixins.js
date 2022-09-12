export default {
  data() {
    return {
      pannel_name: 'xsy_customer_list',
      initPage: false,
      API_INDEX: '/V4/xsy.customer.relation.list',
      sale_user_id: [],
      bindParams: {
        email: '',
        member_name: '',
        member_status: ''
      },
      selectRow: [],
      column: [
        { label: '用户ID', prop: 'member_id', width: 100 },
        { label: '客户报备名称', prop: 'member_name', width: 150 },
        { label: '注册邮箱', prop: 'email', width: 150 },
        { label: '服务阶段', prop: 'member_status' },
        { label: '服务阶段更新时间', prop: 'member_status_date' },
        { label: '正式服务月份', prop: 'formal_service_months' },
        { label: '中止服务月份', prop: 'end_service_months' },
        { label: '正式服务时段', prop: 'section_formal_service_months' },
        { label: '中止服务时段', prop: 'section_end_service_months' },
        { label: '最新MRR', prop: 'customer_mrr_est' },
        { label: '实际月消费', prop: 'customer_mrr_real' },
        { label: '销售易同步状态', prop: 'customer_rsync_status', width: 120 }
      ],

      options: {
        customer_rsync_status: {
          1: '未同步',
          2: '已同步',
          3: '已更新待同步'
        },
        section_formal_service_months: {
          1: '首月',
          2: '1到6个月内',
          3: '6到12个月',
          4: '12到36个月内',
          5: '36到60个月内',
          6: '60个月以上'
        },
        section_end_service_months: {
          1: '首月',
          2: '1到6个月内',
          3: '6到12个月',
          4: '12到36个月内',
          5: '36到60个月内',
          6: '60个月以上'
        },
        member_status: [
          { label: '商机', value: 1 },
          { label: '报备 ', value: 2 },
          { label: '试用 ', value: 3 },
          { label: '正式 ', value: 4 },
          { label: '原到期 ', value: 5 },
          { label: '流水客户 ', value: 6 },
          { label: '试用到期  ', value: 10 },
          { label: '正式到期 ', value: 11 }
        ]
      }
    }
  }
}
