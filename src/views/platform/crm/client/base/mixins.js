import BaseResource from '@/api/client/baseApi'
import FORM from './form'
import { mapActions, mapState } from 'vuex'
import defaultSetting from '@/core/defaultSetting'
export default {
  data() {
    return {
      linkInd: {},
      linkTag: {},
      CRM_NORMAL_MARKET: [],
      basic_conf: {
        member_type: {},
        member_status: {}
      },
      industry: [],
      role_list: [],
      user_list: [],
      industryGroup: [],
      salesGroup: [],
      column: FORM.COLUMN,
      section_formal_service_months: {
        1: '首月',
        2: '1到6个月内',
        3: '6到12个月',
        4: '12到36个月内',
        5: '36到60个月内',
        6: '60个月以上'
      },
      industry_map: {
        one_level_industry_map: [],
        second_level_industry_map: []
      }
    }
  },
  async created() {
    await Promise.all([
      this.getBasicConf(),
      this.clientFetchExplorer(),
      this.bandtype(),
      this.getbasicconf()
    ])
  },
  computed: {
    ...mapState({
      conf: state => state.finance.conf
    }),

    afterSales_list() {
      const maplist = this.conf.afterSales_list || []
      return maplist.map(i => { return { label: i.name, value: i.user_id } })
    }
  },
  watch: {
    resData: {
      handler(val) {
        if (this.resData.industry_map && this.resData.industry_map.one_level_industry_map) {
          const list = this.resData.industry_map.one_level_industry_map
          this.industry_map.one_level_industry_map = Object.keys(list).map(i => { return { label: list[i], value: i } })
        }

        if (this.resData.industry_map && this.resData.industry_map.second_level_industry_map) {
          const list = this.resData.industry_map.second_level_industry_map
          this.industry_map.second_level_industry_map = Object.keys(list).map(i => { return { label: list[i], value: i } })
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions({
      getbasicconf: 'getbasicconf'
    }),
    init() {},
    async handleExcel() {
      const params = {
        ...this.getParams(),
        action: 'download',
        page: 1,
        per_page: 99999
      }
      await this.InvokeAllApi.post(
        '/fd/V4/customer.manage.getcustomerlist',
        params
      ).then(res => {
        if (res.key) window.open(res.key)
      })
    },

    async bandtype(params = { type_ukey: '' }) {
      // 获取风险标签
      await this.InvokeTagApi.get('/tag/tree', params).then(res => {
        this.linkTag = this.getTagsByTypeKey(defaultSetting.setTagTree(res), 'user')
      })
    },

    getTagsByTypeKey(list, key) {
      return list.filter(_ => _.apply_scope === key)
    },

    async getBasicConf() {
      await BaseResource.getBasicConf({}).then(res => {
        this.basic_conf = res.basic_conf
        this.industry = res.industry
        this.role_list = res.role_list
        this.user_list = res.user_list
        this.industryGroup = FORM.getindustryGroup(res.industry)
        this.salesGroup = FORM.getSaleGroup(res.role_list, res.user_list)
        this.getNormalSale(this.salesGroup)
      })
    },

    async updateStatus(row, type = 1) {
      if (this.$refs.outflow && type === 1) {
        this.$refs.outflow.handleOpen(
          JSON.parse(JSON.stringify(row)),
          this.basic_conf
        )
      }
      if (type === 2) {
        const params = {
          member_id: row.member_id,
          member_status: 2
        }
        await this.InvokeAllApi.post(
          '/fd/V4/customer.manage.updatememberstatus',
          params
        ).then(res => {
          this.Message('ACTION_SUCCESS')
          this.$refs.dmData.initPage()
        })
      }
    },

    getParams(data = {}) {
      data = {
        ...data
      }
      if (this.search.afterSales) data.afterSales = this.search.afterSales // 邮箱
      if (this.search.email) data.email = this.search.email // 邮箱
      if (this.search.member_name) data.member_name = this.search.member_name // 邮箱
      if (this.search.certification_name) {
        data.certification_name = this.search.certification_name
      } // 邮箱
      if (this.search.sale) data.sale = this.search.sale // 销售 user_id
      if (this.search.member_status && this.is_all) {
        data.member_status = this.search.member_status
      } // 邮箱
      if (this.search.member_status_time_start && this.is_all) {
        data.member_status_time_start = this.search.member_status_time_start
      } // 邮箱
      if (this.search.member_status_time_end && this.is_all) {
        data.member_status_time_end = this.search.member_status_time_end
      } // 邮箱
      if (this.search.member_level) {
        data.member_level = this.search.member_level
      } // 客户重要性
      if (this.search.industry_one_level && this.is_all) {
        data.industry_one_level = this.search.industry_one_level
      } // 行业类型
      if (this.search.industry_second_level && this.is_all) {
        data.industry_second_level = this.search.industry_second_level
      } // 行业类型
      if (this.search.is_no_commission) {
        data.is_no_commission = this.search.is_no_commission
      } // 行业类型
      if (this.search.is_strategic_coustomer) {
        data.is_strategic_coustomer = this.search.is_strategic_coustomer
      } // 行业类型
      if (this.search.reason_second !== '' && this.is_all) {
        data.reason_second = this.search.reason_second
      } // 行业类型
      if (this.search.reason_top !== '' && this.is_all) {
        data.reason_top = this.search.reason_top
      } // 行业类型
      if (this.search.reason_second_2 !== '' && this.is_all) {
        data.reason_second_2 = this.search.reason_second_2
      } // 行业类型
      if (this.search.reason_top_2 !== '' && this.is_all) {
        data.reason_top_2 = this.search.reason_top_2
      } // 行业类型
      if (this.search.loss_date_start && this.is_all) {
        data.loss_date_start = this.search.loss_date_start
      } // 行业类型
      if (this.search.loss_date_end && this.is_all) {
        data.loss_date_end = this.search.loss_date_end
      } // 行业类型
      return data
    },

    getNormalSale(list) {
      let CRM_NORMAL_MARKET = []
      list.forEach(item => {
        if (item.role_flag === 'CRM_NORMAL_MARKET') {
          CRM_NORMAL_MARKET = item.children && Array.isArray(item.children) ? item.children : []
        }
      })
      this.CRM_NORMAL_MARKET = CRM_NORMAL_MARKET
    },

    getSalesText(value) {
      let salesMsg = '暂未关联'
      for (var _item in value) {
        const sales = this.role_list.find(elment => {
          return parseInt(_item) === parseInt(elment.id)
        })
        if (sales && sales.role_flag === 'CRM_NORMAL_MARKET') {
          value[_item].forEach((element, index) => {
            let user = {}
            this.user_list.forEach(record => {
              if (record.user_id === element) user = record
            })
            if (user) {
              if (index === 0) {
                salesMsg = user.name
              } else {
                salesMsg = user.name + ' | ' + salesMsg
              }
            }
          })
        }
      }
      return salesMsg
    }
  }
}
