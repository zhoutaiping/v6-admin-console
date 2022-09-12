<template>
  <div class="centerCard">
    <div class="banner_control">
      <Form
        ref="Form"
        :vm="$data"
        :loading="loading"
        @init="$refs.dmData.initPage()"
      />
    </div>
    <el-card
      :body-style="{ padding: '5px' }"
      shadow="never"
    >
      <div class="table-toolbar">
        <div class="table-toolbar__left">
          <Tabs
            ref="tabs"
            @init="(e) =>{
              plan_status = e
              $refs.dmData.initPage()
            }"
          />
        </div>
        <div class="table-toolbar__right">
          <router-link :to="'/advisory/create-meal'">
            <el-button
              type="primary"
              icon="el-icon-setting"
              plain
            >开通服务</el-button>
          </router-link>
          <el-button
            type="primary"
            plain
            icon="el-icon-download"
            @click="handleExport"
          >导 出</el-button>
          <el-button
            type="primary"
            plain
            icon="el-icon-setting"
            style="margin-left:0px;"
            @click="setColumn"
          >自定义显示</el-button>
        </div>
      </div>
      <DmData
        ref="dmData"
        :auto-ini="false"
        @init="fetchData"
      >
        <DmTable :loading="loading">
          <el-table
            :data="list"
            :key="tabKey"
            @selection-change="e =>{selectRow = e}"
          >
            <el-table-column
              type="selection"
              width="55"
              fixed="left"
            />
            <el-table-column
              v-for="(c_item, c_index) in filtet_column"
              :key="c_index"
              :label="c_item.label"
              :min-width="c_item.width"
              :fixed="c_item.fixed"
            >
              <template slot-scope="scope">
                <div v-if="c_item.prop === 'email'">
                  <a-popover title="客户关系">
                    <template slot="content">
                      <div v-if="scope.row.roleList.length > 0">
                        <p
                          v-for="(content,_index) in scope.row.roleList"
                          :key="_index"
                        >{{ content.title }}: {{ content.value }}</p>
                      </div>
                      <span v-else>暂无</span>
                    </template>
                    <span>{{ scope.row.email }}</span>
                  </a-popover>
                </div>
                <div v-else-if="c_item.prop === 'plan_diy_name'">
                  <div
                    style="cursor:pointer;display: inline-block;"
                    @dblclick="editPlanDiyName(scope.row)"
                  >
                    <span v-show="scope.row.plan_diy_name!==''">实例别名【{{ scope.row.plan_diy_name }}】</span><br>
                    <span v-show="scope.row.instance_id !==''"> 实例ID【{{ scope.row.instance_id }}】 </span>
                  </div>
                  <a-popover title="备注">
                    <template slot="content">
                      {{ '备注：' + scope.row.remark }}
                    </template>
                    <el-button
                      type="text"
                      style="float:right;padding:5px 0;"
                      @click="editPlanDiyName(scope.row)"
                    > <i class="el-icon-document el-icon--right" />
                    </el-button>
                  </a-popover>
                </div>
                <div v-else-if="c_item.prop === 'phase'">
                  <span :class="Number(scope.row.phase) === 1 ?'color--success':'color--warning'">{{ formartValue(scope.row, c_item.prop) }}</span>
                </div>
                <div v-else-if="c_item.prop === 'plan_status'">
                  <span :class="Number(scope.row.plan_status) === 1 ?'color--success':'color--warning'">{{ formartValue(scope.row, c_item.prop) }}</span>
                </div>
                <div v-else-if="c_item.prop === 'stage'">
                  <el-button
                    type="text"
                    @click="$refs.dialogStage.handleOpen(scope.row)"
                  >详情</el-button>
                </div>
                <div v-else-if="c_item.prop === 'performance_start_time'">
                  <span>{{ scope.row.performance_start_time }}</span><br>
                  <span>{{ scope.row.performance_end_time }}</span>
                </div>
                <div v-else-if="c_item.prop === 'created_at'">
                  <span>{{ scope.row.created_at }}</span><br>
                  <span>{{ scope.row.expire_time }}</span>
                </div>
                <div v-else-if="c_item.prop === 'ads'">
                  <template v-if="scope.row.product_flag === 'ADS'">
                    <div>IP段数量：<span class="color--primary"> {{ fomartAdsValue(scope.row, 'canUse') }}</span></div>
                    <div>剩余规则数量：<span class="color--primary">{{ fomartAdsValue(scope.row, 'unUsed') }}</span></div>
                  </template>
                </div>
                <div v-else>{{ formartValue(scope.row, c_item.prop) }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="200"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  icon="el-icon-search"
                  size="mini"
                  class="op-btn"
                  @click="handleMealInfo(scope.row)"
                >详情</el-button>
                <el-dropdown
                  v-if="scope.row.meal_operate.length > 0 "
                  trigger="click"
                  size="mini"
                >
                  <el-button
                    type="primary"
                    size="mini"
                  >
                    操作
                    <i class="el-icon-arrow-down el-icon--right" />
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="(item, index) in scope.row.meal_operate"
                      :key="index"
                    >
                      <div @click="handEditClick(scope.row, item)">{{ operateMap[item] }}</div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <!--  options -->
                <!-- <el-dropdown v-if="scope.row.meal_operate.length > 0 " trigger="click" size="mini">
                  <el-button type="primary" size="mini" >
                    options
                    <i class="el-icon-arrow-down el-icon--right"/>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(item, index) in scope.row.meal_operate" :key="index">
                      <router-link :to="{path: `/advisory/edit-meal/${scope.row.id}`, query: {type: item}}">
                        <el-button type="text">{{ operateMap[item] }}</el-button>
                      </router-link>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown> -->
              </template>
            </el-table-column>
          </el-table>
        </DmTable>
      </DmData>
    </el-card>
    <dialog-meal-info
      ref="dialogMealInfo"
      @on-success="$refs.dmData.initPage()"
    />
    <dialog-meal-renew
      ref="dialogMealRenew"
      @on-success="$refs.dmData.initPage()"
    />
    <dialog-meal-up
      ref="dialogMealUp"
      @on-success="$refs.dmData.initPage()"
    />
    <dialog-meal-expand
      ref="dialogMealExpand"
      @on-success="$refs.dmData.initPage()"
    />
    <dialog-meal-raise
      ref="dialogMealRaise"
      @on-success="$refs.dmData.initPage()"
    />
    <dialog-meal-cancel
      ref="dialogMealCancel"
      @on-success="$refs.dmData.initPage()"
    />
    <MealConfig
      ref="mealConfig"
      @fetchData="$refs.dmData.initPage()"
    />
    <DialogEditDiyName
      ref="dialogEditDiyName"
      @fetchData="$refs.dmData.initPage()"
    />
    <DialogBindDomain
      ref="dialogBindDomain"
      @fetchData="$refs.dmData.initPage()"
    />
    <DialogFormal
      ref="dialogFormal"
      @fetchData="$refs.dmData.initPage()"
    />
    <DialogRetry
      ref="dialogRetry"
      @fetchData="$refs.dmData.initPage()"
    />
    <DialogStage
      ref="dialogStage"
      @fetchData="$refs.dmData.initPage()"
    />
    <AutoColumn
      ref="autoColumn"
      @initColumn="initColumn"
    />
    <DialogEditTime
      ref="dialogEditTime"
      @fetchData="$refs.dmData.initPage()"
    />
    <ads-edit
      ref="adsEdit"
      @success="$refs.dmData.initPage()"
    />
    <EnablePay
      ref="enablePay"
      @success="$refs.dmData.initPage()"
    />
    <DisablePay
      ref="disablePay"
      @success="$refs.dmData.initPage()"
    />
    <Shrink
      ref="shrink"
      @success="$refs.dmData.initPage()"
    />
    <DialogMealPayment
      ref="dialogMealPayment"
      @success="$refs.dmData.initPage()"
    />
  </div>
</template>
<script>
import consoleData from '@/mixins/consoleData'
import MealResource from '@/api/mealApi'
import * as FORM from './mealFrom'
import * as Utils from '@/utils/index'
import indexMixins from './mixins'
import initColumn from '@/mixins/initColumn'
export default {
  mixins: [indexMixins, initColumn, consoleData],
  data() {
    return {
      pannel_name: 'advisory_meal',
      tabKey: 0,
      export: false, // 导出状态
      plan_status: '',
      PLATFORM: FORM.PLATFORM,
      PLATFORM_TEXT: FORM.PLATFORM_TEXT,
      plan_status_list: FORM.plan_status_list,
      test_user_list: FORM.test_user_list,
      STATUS_TEXT: { 1: '未到期', 2: '已到期', 0: '已停用' },
      REASON_TOP: [],
      REASON_SECOND: [],
      REASON_SECOND_All: [],
      ads_ip: {}
    }
  },

  methods: {
    async fetchData(params = this.$refs.dmData.getParams()) {
      this.loading = true
      if (this.$refs.Form) {
        params = Object.assign(params, this.$refs.Form.params())
      }
      await MealResource.getOrderList(params)
        .then(async(res) => {
          const list = JSON.parse(JSON.stringify(res.list))
          const ADSList = res.list.filter((i) => i.product_flag === 'ADS')
          this.ads_ip = {}
          if (ADSList.length) {
            this.ads_ip = await this.Fetch.get(
              '/fd/V4/ads.plan.ip.block.quota',
              {
                plan_ids: ADSList.map((i) => {
                  return i.id
                })
              }
            )
          }
          this.list = this.setRowList(list, res.roleList) || []
          this.REASON_TOP = res.unsubscribe_reason.reason_top || []
          this.REASON_SECOND_All = res.unsubscribe_reason.reason_second || []
          this.$refs.dmData.init({ total: parseInt(res.total || 0, 10) })
        })
        .catch((e) => {
          this.list = []
          this.$refs.dmData.init({ total: 0 })
        })
      setTimeout(() => {
        this.loading = false
      }, 500)
    },
    setRowList(list, roleList) {
      const newList = this.getRowOperate(list)
      newList.forEach((row) => {
        const userList = row.userList
        const newUserList = []
        for (var role in userList) {
          newUserList.push({
            title: roleList[role].role_name,
            value: FORM.getArrItem(userList[role])
          })
        }
        row.roleList = newUserList
        row.sale_text = newUserList
          .map((i) => {
            return i.value
          })
          .join(',')
      })
      return newList
    },

    formartValue(row, prop) {
      let row_text = ''
      switch (prop) {
        case 'meal_flag':
          row_text = this.mealText(row.meal_flag)
          break
        case 'plan_status':
          row_text = Number(row.plan_status) === 1 ? '未到期' : '已到期'
          break
        case 'phase':
          row_text = Number(row.phase) === 1 ? '正式' : '试用'
          break
        case 'platform':
          row_text = this.PLATFORM_TEXT[Number(row.platform)]
          break
        default:
          row_text = row[prop]
          break
      }
      return row_text
    },

    editPlanDiyName(row) {
      const rowData = JSON.parse(JSON.stringify(row))
      const data = {
        id: rowData.id,
        plan_diy_name: rowData.plan_diy_name,
        remark: rowData.remark
      }
      this.$refs.dialogEditDiyName.handleOpen(data)
    },

    getRowOperate(list) {
      // 获取行的操作按钮
      const newList = []
      for (let i = 0; i < list.length; i++) {
        const line = list[i]
        const plan_setting = line['plan_setting']
        const meal_latest = (plan_setting && plan_setting.meal_latest) || null
        const plan_status = parseInt(line['plan_status'], 10)
        const product_flag = line.product_flag
        line['email'] = (line['member'] && line['member']['email']) || '--'
        line['meal_operate'] = []
        // 获取套餐操作配置 --扩容，增值，升降级 操作
        let meal_operate = []
        if (meal_latest !== null) {
          const meal_detail =
            plan_setting['meal_latest']['meal_detail'] || null
          const backstage_show =
            (meal_detail && meal_detail.backstage_show) || null
          if (backstage_show && backstage_show.meal_operate !== null) {
            meal_operate = backstage_show.meal_operate || []
          }
        }
        // 未到期设置套餐配置的扩容，增值，升降级 操作
        if (meal_operate.length && plan_status === 1) {
          if (product_flag === 'WEBAQJS') {
            if (line.meal_flag === 'YD-WEBAQJS-TY') {
              // Web安全加速体验版套餐默认试用类型
              // line['meal_operate'] = ['enablepay']
            } else {
              line['meal_operate'] = meal_operate
              if (meal_operate.indexOf('kuorong') > -1) {
                // 存在扩容
                line['meal_operate'].push('shrink')
              }
            }
          } else {
            line['meal_operate'] = meal_operate
          }
        }

        if (line.meal_flag === 'BSSCDN-Free') {
          if (line.open_bandwidth_pay === 0 || plan_status === 0) {
            line['meal_operate'].push('payment')
            line['meal_operate'] = line['meal_operate'].filter(i => i !== 'kuorong')
          }
        }

        const filter_flag = ['LS', 'DX', 'YD-JS999G-CDN', 'JS999GCDN'] // 无法续费产品  // a:plan_status 1.未到期--续费  b:unsubscribe_flag === 0 ---续费
        // 套餐续费
        if (
          filter_flag.indexOf(product_flag) < 0 &&
          filter_flag.indexOf(line.meal_flag) < 0
        ) {
          if (Number(line.phase) === 1) {
            if (product_flag === 'HW') {
              // 红网 到期不续费 2020/3/18  张攀
              if (plan_status === 1) line['meal_operate'].push('renew')
            } else if (product_flag === 'WEBAQJS') {
              // 安全加速
              if (line.meal_flag !== 'YD-WEBAQJS-TY' && plan_status === 1) {
                // 【非体验版】
                line['meal_operate'].push('renew')
              }
            } else {
              line['meal_operate'].push('renew')
            }
          }
        }
        // 试用转正 延期
        if (Number(line.phase) !== 1) {
          // 试用
          if (product_flag === 'HW') {
            if (plan_status === 1) {
              line['meal_operate'].push('retry') // 试用延期
              line['meal_operate'].push('formal') // 试用转正
            }
          } else if (product_flag === 'WEBAQJS') {
            // Web安全加速体验版套餐默认试用类型，且不支持转正、延期、退订操作，仅支持“启用付费”操作
            if (line.meal_flag !== 'YD-WEBAQJS-TY') {
              line['meal_operate'].push('retry')
              line['meal_operate'].push('formal')
            }
          } else {
            line['meal_operate'].push('retry')
            line['meal_operate'].push('formal')
          }
        }
        // 未到期->退订
        if (plan_status === 1) {
          if (product_flag === 'WEBAQJS') {
            if (line.meal_flag !== 'YD-WEBAQJS-TY') {
              // line['meal_operate'].push('disablePay')
              line['meal_operate'].push('cancel')
            }
          } else if (line.meal_flag === 'BSSCDN-Free') {
            //
          } else {
            line['meal_operate'].push('cancel')
          }
        }

        // 绑定域名 [未到期] [云解析]
        if (
          product_flag === 'JX' &&
          plan_status === 1 &&
          Number(line.phase) !== 0
        ) {
          line['meal_operate'].push('bindDomain')
        }

        // 套餐配置修改
        if (['YD-JS999G-CDN', 'JS999GCDN'].indexOf(line.meal_flag) > -1) {
          line['meal_operate'].push('setconfig')
        }

        // ADS套餐编辑
        if (product_flag === 'ADS') {
          if (plan_status === 1) {
            line['meal_operate'].push('ads')
          }
        }

        // 业绩时间编辑
        if (edittime(product_flag, line.meal_flag, plan_status)) {
          line['meal_operate'].push('edittime')
        }

        newList.push(line)
      }

      // 业绩时间编辑
      function edittime(product_flag = '', meal_flag = '', plan_status = 0) {
        let val = true
        if (product_flag === 'HW' && Number(plan_status) !== 1) {
          val = false
        }

        if (meal_flag === 'YD-WEBAQJS-TY') {
          val = false
        }
        return val
      }
      return newList
    },

    // 套餐详情 -- begin
    handleMealInfo(data) {
      const row_data = Utils.deepClone(data)
      let loss_desc = ''
      if (row_data.reason_top !== '') { loss_desc = this.REASON_TOP[row_data.reason_top] }
      if (row_data.reason_second !== '') {
        const reason_second = this.REASON_SECOND_All.filter(
          (i) => Number(i.value) === Number(row_data.reason_second)
        )
        if (reason_second.length) {
          loss_desc = loss_desc
            ? loss_desc + '->' + reason_second[0].second
            : reason_second[0].second
        }
      }
      if (this.$refs.dialogMealInfo) { this.$refs.dialogMealInfo.handleOpen(row_data, loss_desc) }
    },

    handleExport() {
      this.export = true
      const exportParams = {
        id:
          this.selectRow.map((i) => {
            return i.id
          }) || [],
        plan: this.$refs.Form.params()
      }
      this.$confirm('导出套餐列表excel，是否确认操作？', '导出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.InvokeAllApi.post('/V4/customer.plan.export', exportParams)
            .then((res) => {
              if (res.url) {
                const a = document.createElement('a')
                a.setAttribute('href', res.url)
                document.body.appendChild(a)
                a.click()
                a.style.display = 'none'
                this.Message('ACTION_SUCCESS')
              }
              setTimeout(() => {
                this.export = false
              }, 500)
            })
            .catch(() => {
              setTimeout(() => {
                this.export = false
              }, 500)
            })
        })
        .catch((e) => {
          return true
        })
    }
  }
}
</script>
<style lang='scss' scoped>
@import url("./index.scss");
</style>
