<template>
  <DmDialog
    ref="dmdialog"
    :title="DialogDetail.title"
    :footer="false"
    width="750px"
    aside
  >
    <DmScroll>
      <el-tabs
        v-loading="DialogDetail.loading"
        v-model="DialogDetail.actionTab"
        class="tab-box"
        type="card"
        size="mini"
        @tab-click="handleClickTabs"
      >
        <el-tab-pane
          label="订单详情"
          name="detailInfo"
          class="detailInfo"
        >
          <CardLayout
            :expand="true"
            title="概览信息"
          >
            <div slot="layout">
              <el-form
                :inline="true"
                size="mini"
                label-position="left"
                label-width="100px"
              >
                <el-form-item
                  label="订单ID"
                  class="infoForm-item"
                ><span class="infoForm-input">{{ DialogDetail.rowData.id }}</span></el-form-item>
                <el-form-item
                  label="订单状态"
                  class="infoForm-item"
                ><span class="infoForm-input">{{ DialogDetail.rowData.status ? DialogDetail.listMap.map_order_status[DialogDetail.rowData.status] : '--' }}</span></el-form-item>
                <el-form-item
                  label="订单类型"
                  class="infoForm-item"
                ><span class="infoForm-input">{{ DialogDetail.rowData.buy_type ? DialogDetail.listMap.map_buy_type[DialogDetail.rowData.buy_type] : '' }}</span></el-form-item>
                <el-form-item
                  label="订单目的"
                  class="infoForm-item"
                ><span class="infoForm-input">{{ order_type_text }}</span></el-form-item>
                <el-form-item
                  label="所属销售"
                  class="infoForm-item"
                ><span class="infoForm-input">{{ DialogDetail.sales }}</span></el-form-item>
                <el-form-item
                  label="所属技术支持"
                  class="infoForm-item"
                ><span class="infoForm-input">{{ DialogDetail.supports }}</span></el-form-item>
                <el-form-item
                  label="用户邮箱"
                  class="infoForm-item"
                ><span class="infoForm-input">{{ DialogDetail.rowData.email }}</span></el-form-item>
                <el-form-item
                  label="内部测试"
                  class="infoForm-item"
                ><span class="infoForm-input">{{ DialogDetail.rowData.test_user ==='1'? '是' :'不是' }}</span></el-form-item>
                <el-form-item
                  label="创建时间"
                  class="infoForm-item"
                ><span class="infoForm-input">{{ DialogDetail.rowData.created_at || '--' }}</span></el-form-item>
                <el-form-item
                  label="支付时间"
                  class="infoForm-item"
                ><span class="infoForm-input">{{ DialogDetail.rowData.pay_time || '--' }}</span></el-form-item>
                <el-form-item
                  label="确认状态"
                  class="infoForm-item"
                ><span class="infoForm-input">{{ Number(DialogDetail.rowData.confirm) === 1 ? '已确认':'未确认' || '--' }}</span></el-form-item>
                <el-form-item
                  label="拆分状态"
                  class="infoForm-item"
                ><span class="infoForm-input">{{ Number(DialogDetail.rowData.has_receive) ===1 ? '已拆分':'未拆封' || '--' }}</span></el-form-item>
                <el-form-item
                  label="备注信息"
                  class="infoForm-item"
                ><span class="infoForm-input">{{ DialogDetail.rowData.remark || '--' }}</span></el-form-item>
              </el-form>
            </div>
          </CardLayout>
          <CardLayout
            v-if="Number(template.calc_way) > 0"
            :expand="true"
            title="套餐赠送配置"
          >
            <div slot="layout">
              <el-form
                :inline="true"
                size="mini"
                label-position="left"
                label-width="100px"
              >
                <el-form-item
                  label="计费规则"
                  class="infoForm-item"
                ><span class="infoForm-input">{{ template.tp_name || '--' }}</span></el-form-item>
                <el-form-item
                  label="计费周期"
                  class="infoForm-item"
                >
                  <span class="infoForm-input">{{ template.calc_way_timeunit ==='day'? '按日计费':'其他' || '--' }}</span>
                </el-form-item>
                <template v-if="Number(template.calc_way) === 1">
                  <el-form-item
                    label="国内流量"
                    class="infoForm-item"
                  ><span class="infoForm-input">{{ template.free_china || '--' }} G</span></el-form-item>
                  <el-form-item
                    label="海外流量"
                    class="infoForm-item"
                  ><span class="infoForm-input">{{ template.free_foreign || '--' }} G</span></el-form-item>
                  <el-form-item
                    label="国内流量价格"
                    class="infoForm-item"
                  ><span class="infoForm-input">{{ template.fee_china || '--' }} 元/GB/天</span></el-form-item>
                  <el-form-item
                    label="海外流量价格"
                    class="infoForm-item"
                  ><span class="infoForm-input">{{ template.fee_foreign || '--' }} 元/GB/天</span></el-form-item>
                </template>
                <template v-if="Number(template.calc_way) === 2">
                  <el-form-item
                    label="国内带宽峰值"
                    class="infoForm-item"
                  ><span class="infoForm-input">{{ template.free_china_max || '--' }} Mbps</span></el-form-item>
                  <el-form-item
                    label="海外带宽峰值"
                    class="infoForm-item"
                  ><span class="infoForm-input">{{ template.free_foreign_max || '--' }} Mbps</span></el-form-item>
                  <el-form-item
                    label="国内带宽峰值价格"
                    label-width="140px"
                    class="infoForm-item"
                  ><span class="infoForm-input2">{{ template.fee_china_max || '--' }} 元/Mbps/天</span></el-form-item>
                  <el-form-item
                    label="海外带宽峰值价格"
                    label-width="140px"
                    class="infoForm-item"
                  ><span class="infoForm-input2">{{ template.fee_foreign_max || '--' }} 元/Mbps/天</span></el-form-item>
                </template>
                <el-form-item
                  label="Http请求加速次数"
                  label-width="140px"
                  class="infoForm-item"
                ><span class="infoForm-input2">{{ template.free_cdn_https || '--' }} 万次</span></el-form-item>
                <el-form-item
                  label="Http请求加速价格"
                  label-width="140px"
                  class="infoForm-item"
                ><span class="infoForm-input2">{{ template.fee_cdn_https || '--' }} 元/万次</span></el-form-item>
              </el-form>
            </div>
          </CardLayout>
          <CardLayout
            v-if="DialogDetail.rowData.buy_type === '0'"
            :title="DialogDetail.listMap.map_buy_type[DialogDetail.rowData.buy_type] + '详情'"
            :expand="true"
          >
            <div slot="layout">
              <el-form
                :inline="true"
                size="mini"
                label-position="left"
                label-width="90px"
              >
                <el-form-item
                  label="产品名称"
                  class="infoForm-item"
                ><span class="infoForm-input">{{ meal.product_name }}</span></el-form-item>
                <el-form-item
                  label="套餐名称"
                  class="infoForm-item"
                ><span class="infoForm-input">{{ meal.meal_name || '--' }}</span></el-form-item>
              </el-form>
            </div>
          </CardLayout>
          <CardLayout
            v-if="DialogDetail.rowData.buy_type === '2'"
            :expand="true"
            title="续费详情"
          >
            <div slot="layout">
              <el-form
                :inline="true"
                size="mini"
                label-position="left"
                label-width="90px"
              >
                <el-form-item
                  label="订单目的"
                  class="infoForm-item"
                ><span class="infoForm-input">{{ order_type_text || '--' }}</span></el-form-item>
                <el-form-item
                  label="续费时长"
                  class="infoForm-item"
                ><span class="infoForm-input">{{ Number(buy_times.buy_time || 0) + TIME_UNIT[buy_times.time_unit] }}</span></el-form-item>
              </el-form>
            </div>
          </CardLayout>
          <CardLayout
            v-if="DialogDetail.rowData.buy_type === '1'|| DialogDetail.rowData.buy_type === '3'"
            :title="DialogDetail.listMap.map_buy_type[DialogDetail.rowData.buy_type] + '详情'"
            :expand="true"
          >
            <div slot="layout">
              <el-form
                :inline="true"
                size="mini"
                label-position="left"
                label-width="90px"
              >
                <el-form-item
                  label="订单目的"
                  class="infoForm-item"
                >
                  <span class="infoForm-input">{{ order_type_text || '--' }}</span>
                </el-form-item>
                <el-form-item
                  :label="DialogDetail.listMap.map_buy_type[DialogDetail.rowData.buy_type] +'时长'"
                  class="infoForm-item"
                >
                  <span class="infoForm-input">{{ Number(buy_times.buy_time || 0) + TIME_UNIT[buy_times.time_unit] }}</span>
                </el-form-item>
                <el-form-item
                  :label="DialogDetail.listMap.map_buy_type[DialogDetail.rowData.buy_type]+'前套餐'"
                  class="infoForm-item"
                >
                  <span class="infoForm-input">{{ meal_old.meal_name }}</span>
                </el-form-item>
                <el-form-item
                  :label="DialogDetail.listMap.map_buy_type[DialogDetail.rowData.buy_type]+'后套餐'"
                  class="infoForm-item"
                >
                  <span class="infoForm-input">{{ meal.meal_name }}</span>
                </el-form-item>
              </el-form>
            </div>
          </CardLayout>
          <CardInfo
            v-if="kuorongList.length > 0 && (DialogDetail.rowData.buy_type === '4' ||DialogDetail.rowData.buy_type === '0' )"
            :data="kuorongList"
            title="扩容详情"
          />
          <CardInfo
            v-if="zengziList.length > 0 && (DialogDetail.rowData.buy_type === '5')"
            :data="zengziList"
            title="增值详情"
          />
        </el-tab-pane>
        <el-tab-pane
          label="回款记录"
          name="payback"
        >
          <template>
            <DmTable>
              <el-table :data="DialogDetail.paybackList">
                <el-table-column
                  prop="id"
                  label="回款ID"
                  width="100"
                />
                <el-table-column
                  prop="flow_code"
                  label="转账单号"
                  width="180"
                />
                <el-table-column
                  prop="flow_money"
                  label="转账金额"
                  width="120"
                />
                <el-table-column
                  prop="flow_source_text"
                  label="支付方式"
                  width="100"
                />
                <el-table-column
                  prop="flow_time"
                  label="转账时间"
                  width="200"
                />
                <el-table-column
                  prop="remark"
                  label="备注"
                  width="200"
                >
                  <template slot-scope="scope">
                    <el-popover
                      trigger="hover"
                      placement="top"
                    >
                      <p>备注: {{ scope.row.remark }}</p>
                      <div
                        slot="reference"
                        class="name-wrapper"
                        style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                      >
                        {{ scope.row.remark }}
                      </div>
                    </el-popover>
                  </template>
                </el-table-column>
              </el-table>
            </DmTable>
          </template>
        </el-tab-pane>
        <el-tab-pane
          label="编辑日志"
          name="editlLog"
        >
          <template>
            <DmTable>
              <el-table
                :data="DialogDetail.editLog"
                style="width: 100%"
              >
                <el-table-column
                  type="index"
                  width="55"
                />
                <el-table-column
                  label="操作项"
                  width="100"
                >
                  <template slot-scope="scope">
                    {{ DialogDetail.log_action_map[scope.row.action] }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="user_name"
                  label="操作人"
                  width="120"
                >
                  <template slot-scope="scope">
                    <el-popover
                      trigger="hover"
                      placement="top"
                    >
                      <p>操作人: {{ scope.row.user_name }}</p>
                      <div
                        slot="reference"
                        class="name-wrapper"
                        style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                      >
                        {{ scope.row.user_name }}
                      </div>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="update_at"
                  label="操作时间"
                  width="180"
                />
                <el-table-column
                  prop="summary"
                  label="详情"
                >
                  <template slot-scope="scope">
                    <el-popover
                      trigger="hover"
                      placement="top"
                    >
                      <p>详情: {{ scope.row.summary }}</p>
                      <div
                        slot="reference"
                        class="name-wrapper"
                        style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                      >
                        {{ scope.row.summary }}
                      </div>
                    </el-popover>
                  </template>
                </el-table-column>
              </el-table>
            </DmTable>
          </template>
        </el-tab-pane>
      </el-tabs>
    </DmScroll>
  </DmDialog>
</template>

<script>
import FinanceResource from '@/api/finance/financeApi'
import Form from '@/utils/form'
import * as FORM from './dialogForm'
export default {
  data() {
    return {
      DialogDetail: new Form(FORM.FORM_DETAIL, FORM.FORM_DETAIL_RULE),
      zengziList: [], // 增值配置
      kuorongList: [], // 扩容配置
      meal_old: {},
      meal: {},
      buy_times: {},
      template: {},
      TEMPLATEINFO: [],
      SALElIST: [], //   销售列表
      SUPPORTS: [], // 售后列表
      action: {
        create: '创建', pay: '支付'
      },
      ORDER_TYPE: {
        'normal': '正式开通',
        'user_test': '测试开通',
        'user_refund': '试用开通'
      },
      order_type_text: '',
      order_type_index: {
        0: 'normal', 1: 'user_refund', 2: 'user_test'
      },
      PAYTYPE: {
        0: '默认', 1: '现金', 2: '银行转账 ', 3: '余额', 4: '微信', 5: '支付宝', 6: '欠款支付'
      },
      TIME_UNIT: {
        'd': '天', 'm': '月', 'y': '年'
      }
    }
  },
  methods: {
    handleOpen(data) {
      this.$refs.dmdialog.handleOpen()
      this.$nextTick(() => {
        this.DialogDetail.reset()
        this.DialogDetail.loading = true
        this.getMemberList(data.member_id)
        const params = { order_id: data.id }
        setTimeout(() => { this.getDetail(params) }, 500)
      })
    },
    async getDetail(params) {
      await FinanceResource.getOrderDetail(params).then(response => {
        const data = response
        this.DialogDetail.rowData = data.data
        this.DialogDetail.sales = FORM.arrNumToStr(data['data']['sale_user_ids'])
        this.DialogDetail.supports = FORM.arrNumToStr(data['data']['support_user_ids'])
        this.DialogDetail.listMap.map_buy_type = data.map_buy_type
        this.DialogDetail.listMap.map_meal = data.map_meal
        this.DialogDetail.listMap.map_order_status = data.map_order_status
        this.DialogDetail.listMap.map_order_type = data.map_order_type
        this.DialogDetail.listMap.map_product = data.map_product
        this.DialogDetail.listMap.members = data.members
        this.DialogDetail.rowData.email = data.members[data.data.member_id]['email']
        this.DialogDetail.rowData.test_user = data.members[data.data.member_id]['test_user']
        const detail = data.data.detail || {}
        const meal = Object.keys(detail).length && detail.meal || {}
        const meal_old = Object.keys(detail).length && detail.meal_old || {}
        this.DialogDetail.meal_info = this.getDetailMealInfo(meal)
        this.meal_old = meal_old
        this.meal = meal
        this.buy_times = Object.keys(detail).length && detail.buy_times || {}
        this.zengziList = this.setZengziList(Object.keys(detail).length && detail.zengzhi || null, Object.keys(detail).length && detail.buy_zengzhi || null)
        this.kuorongList = this.setKuorongList(Object.keys(detail).length && detail.kuorong || null, Object.keys(detail).length && detail.buy_kuorong || null)

        const order_type_index = this.order_type_index
        const order_type_str_1 = this.ORDER_TYPE[data.data.order_type] || ''
        const order_type_str_2 = order_type_index[data.data.order_type] ? this.ORDER_TYPE[order_type_index[data.data.order_type]] : ''
        this.order_type_text = order_type_str_1 || order_type_str_2
        this.getSalesAndSupport(this.DialogDetail.sales, this.DialogDetail.supports)
        this.template = data.data.detail && data.data.detail.template && data.data.detail.template.template || {}
      })
      setTimeout(() => { this.DialogDetail.loading = false }, 100)
    },

    async getSalesAndSupport(sales, supports) {
      let sales_text = '--'
      let supports_text = '--'
      const saleList = this.SALElIST //   销售列表
      const supportList = this.SUPPORTS // 售后列表
      sales.forEach((element, index) => {
        for (let i = 0; i < saleList.length; i++) {
          if (Number(saleList[i].id) === Number(element)) {
            if (index === 0) {
              sales_text = saleList[i].name
            } else {
              sales_text = saleList[i].name + ',' + sales_text
            }
          }
        }
      })
      supports.forEach((element, index) => {
        for (let i = 0; i < supportList.length; i++) {
          if (supportList[i] && Number(supportList[i].id) === Number(element)) {
            if (index === 0) {
              supports_text = supportList[i].name
            } else {
              supports_text = supportList[i].name + ',' + supports_text
            }
          }
        }
      })

      const reg = /,$/gi
      sales_text = sales_text.replace(reg, '')
      supports_text = supports_text.replace(reg, '')
      this.DialogDetail.sales = sales_text
      this.DialogDetail.supports = supports_text
    },

    async getMemberList(member_id) {
      const params = { member_id: member_id, status: 2 }
      let salesList = []
      let skill_sales

      this.SALElIST = [] //   销售列表
      this.SUPPORTS = [] // 售后列表
      const map = ['CRM_ADMIN', 'CPM_PRE_SALES', 'CRM_AFTER_SALES']
      await FinanceResource.getMemberList(params).then(response => {
        Object.keys(response['memberList']).forEach(item => {
          if (map.indexOf(item) < 0) salesList = response.memberList[item] // 销售列表
        })
        const pre_sales = response['memberList']['CPM_PRE_SALES'] || [] // 售前支持
        const after_sales = response['memberList']['CRM_AFTER_SALES'] || [] // 售后支持
        // 合并后技术支持
        skill_sales = FORM.arrMerge(pre_sales, after_sales)
        this.DialogDetail.sale_user_ids = salesList
        this.DialogDetail.support_user_ids = skill_sales

        this.SALElIST = salesList //   销售列表
        this.SUPPORTS = skill_sales // 售后列表
      })
    },

    setZengziList(keylist, valueRecord) {
      const list = []
      Object.keys(keylist).forEach(record => {
        if (valueRecord[record]) {
          list.push({
            title: keylist[record]['title'],
            value: valueRecord[record] ? valueRecord[record]['price_level'] : '--',
            unit: keylist[record]['unit'] || ''
          })
        }
      })
      return list
    },

    setKuorongList(keylist, valueRecord) {
      const list = []
      Object.keys(keylist).forEach(record => {
        if (valueRecord[record]) {
          list.push({
            title: keylist[record]['title'],
            value: valueRecord[record] ? valueRecord[record]['buy_num'] : '--',
            unit: keylist[record]['unit'] || ''
          })
        }
      })
      return list
    },

    getDetailMealInfo(meal) {
      const mealList = []
      const filters = ['meal_price', 'kuorong', 'zengzhi', 'backstage_show', 'default_fields', 'frequency']
      Object.keys(meal).forEach(item => {
        const filters_index = filters.indexOf(item)
        if (filters_index < 0) {
          const ITEMTYPE = FORM.ObjType(meal[item])
          if (ITEMTYPE === 'Object' || meal[item]['title']) {
            mealList.push({
              title: meal[item]['title'],
              value: (meal[item].value === true || meal[item].value === false || meal[item].value) ? meal[item]['value'] : '',
              unit: (meal[item].value === true || meal[item].value === false) ? '' : (meal[item].unit === 'num') ? '(条/次/个)' : meal[item].unit || ''
            })
          }
          if (ITEMTYPE === 'Array') {
            meal[item].forEach(e => {
              const type = FORM.ObjType(e)
              if (type === 'Object' || e.title) {
                const obj = {
                  title: e.title,
                  value: (e.value === true || e.value === false || e.value) ? e.value : '',
                  unit: (e.value === true || e.value === false) ? '' : (e.unit === 'num') ? '(条/次/个)' : e.unit || ''
                }
                mealList.push(obj)
              }
            })
          }
        }
      })
      return mealList
    },
    handleClickTabs(tab, event) {
      if (this.DialogDetail.actionTab === 'payback') {
        this.getPaybackList()
      } else if (this.DialogDetail.actionTab === 'editlLog') {
        this.getEditList()
      }
    },
    // 回款记录
    getPaybackList(data) {
      const params = {
        'order_code': this.DialogDetail.rowData.order_code,
        'page': 1,
        'per_page': 100
      }
      const api = '/fd/V4/order.payback.list_order'
      this.DialogDetail.loading = true
      this.InvokeAllApi.post(api, params).then(res => {
        this.DialogDetail.loading = false
        const list = JSON.parse(JSON.stringify(res.list))
        const flow_source_map = JSON.parse(JSON.stringify(res.flow_source_map))
        list.forEach(item => {
          item.flow_source_text = flow_source_map[Number(item.flow_source)] || '--'
        })
        this.DialogDetail.paybackList = list
      }).catch(e => {
        this.DialogDetail.loading = false
        this.DialogDetail.paybackList = []
      })
    },
    getEditList() {
      const params = {
        'order_code': this.DialogDetail.rowData.order_code, 'page': 1, 'per_page': 100
      }
      const api = '/fd/V4/order.log_order'
      this.DialogDetail.loading = true
      this.InvokeAllApi.post(api, params).then(res => {
        const list = JSON.parse(JSON.stringify(res.list))
        this.DialogDetail.editLog = list
        this.DialogDetail.log_action_map = res.log_action_map
      }).catch(e => {
        this.DialogDetail.editLog = []
      })
      setTimeout(() => { this.DialogDetail.loading = false }, 1000)
    },

    formatPayPrice(data) {
      if (Number(data.buy_type) === 6) {
        return `${-data.pay_price}`
      } else if (Number(data.buy_type) === 3) {
        return Number(data.pay_price) * (-1) || 0
      } else {
        if (Number(data.status) === 5) {
          return `${-data.pay_price}`
        } else {
          return `${data.pay_price}`
        }
      }
    }

  }
}
</script>
<style lang="scss" scoped>
.infoForm-item {
  margin-bottom: 5px;
}
.infoForm-input {
  width: 170px;
  word-wrap: break-word;
  display: inline-block;
}
.infoForm-input2 {
  width: 130px;
  word-wrap: break-word;
  display: inline-block;
}
.detailInfo .center_div {
  width: 100%;
  float: left;
  .center_div_title {
    width: 150px;
    margin-left: 5px;
    display: inline-block;
  }
  .center_div_value {
    width: 180px;
    height: 35px;
    display: inline-block;
  }
}
</style>

