<style lang="scss" scoped>
.app-center-finance-bill-main {
  padding: 10px;
  .input-box {
    width: 210px;
    margin-bottom: 5px;
  }
  .m-5 {
    margin: 5px;
  }
  .sales_div {
    display: flex;
    margin-bottom: 5px;
  }
  .search-sales {
    width: 607px;
  }
  .title-color-primary {
    color: #409eff;
  }
}
.op-btn {
  margin: 0 2px;
}
.tag_text {
  margin: 1px 1px 1px 10px;
  font-size: 14px;
  font-weight: 500;
}
</style>
<template>
  <div class="app-center-finance-bill-main">
    <DmToolbar>
      <InputSearch
        v-model="bindParams.member_email"
        placeholder="用户邮箱"
        class="input-box"
        @submit="$refs.DmData.initPage()"
      />
      <DmSelect
        v-model="bindParams.flow_source"
        :selects="FLOW_SOURCE"
        placeholder="打款路径"
        class="input-box"
        @change="$refs.DmData.initPage()"
      />
      <DmSelect
        v-model="bindParams.flow_status"
        :selects="FLOW_STATUS"
        placeholder="状态"
        class="input-box"
        @change="$refs.DmData.initPage()"
      />
      <el-select
        v-model="sales_id"
        filterable
        multiple
        collapse-tags
        placeholder="所属销售"
        clearable
        class="input-box"
        @change="$refs.DmData.initPage()"
      >
        <el-option-group
          v-for="(group, g_index) in SALES"
          :key="g_index"
          :label="group.role_name"
        >
          <el-option
            v-for="item in group.children"
            :disabled="!item.label || item.status !=='1'"
            :key="item.user_id"
            :label="item.label"
            :value="item.user_id"
          />
        </el-option-group>
      </el-select>
      <el-date-picker
        v-model="flow_time"
        :default-time="['00:00:00', '23:59:59']"
        type="daterange"
        range-separator=" "
        class="input-box"
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开具日期"
        end-placeholder=""
        @change="changeTime"
      />
      <el-button
        :loading="loading"
        type="primary"
        icon="el-icon-search"
        class="op-btn"
        @click="$refs.DmData.initPage()"
      >搜 索</el-button>
      <el-button
        type="primary"
        icon="el-icon-edit"
        class="op-btn"
        @click="handleRowClick('save')"
      >录入收款</el-button>
    </DmToolbar>
    <DmData ref="DmData" @init="fetchList(initParams())">
      <el-card :body-style="{ padding: '5px' }" shadow="never">
        <el-tabs
          v-model="bindParams.relationMember"
          class="m-5 tab-box"
          type="card"
          @tab-click="$refs.DmData.initPage()"
        >
          <ElTabPane label="已关联邮箱" name="1" />
          <ElTabPane label="未关联邮箱" name="2" />
        </el-tabs>
        <DmAlert style="margin-bottom: 10px;">
          <i class="el-icon-info primar-color" />
          <span class="tip-text">合计收款数量: </span> <span class="primar-color tip-text">{{ responseData.total }} </span>
          <span class="tip-text">合计收款金额: </span> <span class="primar-color tip-text">{{ responseData.total_flow_money }}</span>
        </DmAlert>
        <DmTable v-loading="loading" class="m-5">
          <el-table :data="list">
            <el-table-column
              v-for="(item,key) in column"
              :key="key"
              :label="item.label"
              :fixed="item.fixed"
              :width="item.width"
            >
              <template slot-scope="scope">
                <div v-if="item.prop === 'flow_status'">
                  <el-tag :type="Number(scope.row.flow_status) === 1 ?'success':'warning'">{{ FLOW_STATUS_TEXT[Number(scope.row.flow_status)] || '--' }}</el-tag>
                </div>
                <div v-else-if="item.prop === 'screen_pic'">
                  <el-popover v-if="scope.row.screen_pic" placement="left-start">
                    <img
                      :src="scope.row.screen_pic"
                      class="image"
                      style="height:480px;"
                      alt=""
                    >
                    <img
                      slot="reference"
                      :src="scope.row.screen_pic"
                      class="image"
                      style="width:80px; height:30px;"
                      alt=""
                    >
                  </el-popover>
                </div>
                <div v-else-if="item.prop === 'act_pay_status'">
                  <el-tag :type="tag_type[Number(scope.row.act_pay_status)]">{{ formartValue(scope.row, item.prop) }}</el-tag>
                </div>
                <div v-else>
                  {{ formartValue(scope.row, item.prop) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="250" fixed="right">
              <template slot-scope="scope">
                <a
                  v-if="isLinkShow('check',scope.row)"
                  href="#"
                  class="title-color-primary"
                  @click="handleRowClick('check', scope.row)"
                >审 核 <el-divider direction="vertical" /></a>

                <a
                  v-if="isLinkShow('edit',scope.row)"
                  href="#"
                  class="title-color-primary"
                  @click="handleRowClick('edit',scope.row)"
                >编 辑 <el-divider direction="vertical" /></a>
                <a
                  v-if="isLinkShow('cancel',scope.row)"
                  href="#"
                  class="title-color-primary"
                  @click="handleRowClick('invalid',scope.row)"
                >作 废 <el-divider direction="vertical" /></a>
                <a
                  v-if="isLinkShow('link',scope.row)"
                  href="#"
                  class="title-color-primary"
                  @click="handleRowClick('link',scope.row)"
                >关联用户 <el-divider direction="vertical" /></a>
                <a
                  v-if="isLinkShow('unlink',scope.row)"
                  href="#"
                  class="title-color-primary"
                  @click="handleRowClick('unlink',scope.row)"
                >取消关联</a>
              </template>
            </el-table-column>
          </el-table>
        </DmTable>
      </el-card>
    </DmData>

    <ListEdit ref="listEdit" @loadGrid="$refs.DmData.initPage()" />
    <UserLink ref="userLink" @loadGrid="$refs.DmData.initPage()" />
    <DialogCheck ref="check" @loadGrid="$refs.DmData.initPage()" />
    <el-tooltip placement="top" content="回到顶部" >
      <back-to-top
        :custom-style="myBackToTopStyle"
        :visibility-height="300"
        :back-position="50"
        transition-name="fade"
      />
    </el-tooltip>

  </div>
</template>
<script>
import consoleData from '@/mixins/consoleData'
import * as FORM from './form'
import UserLink from './components/dialogUserLink'
import ListEdit from './components/DialogEdit'
import DialogCheck from './components/check'
export default {
  components: { UserLink, ListEdit, DialogCheck },
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '/V4/financial.flow.receive.list',
      bindParams: {
        member_email: '',
        flow_source: '',
        flow_status: '',
        flow_time_start: '',
        flow_time_end: '',
        relationMember: '1'
      },
      sales_id: [],
      flow_time: '',
      SALES: [],
      column: FORM.COLUMN,
      FLOW_STATUS: FORM.FLOW_STATUS,
      FLOW_STATUS_TEXT: FORM.FLOW_STATUS_TEXT,
      FLOW_SOURCE_TEXT: FORM.FLOW_SOURCE_TEXT,
      myBackToTopStyle: FORM.myBackToTopStyle,
      FLOW_SOURCE: FORM.FLOW_SOURCE,
      ACT_PAY_STATUS: { // 1- 无 2- 审核中 3- 审核不通过 4- 审核通过',
        1: '未提交审核', 2: '审核中', 3: '审核不通过', 4: '审核通过'
      },
      tag_type: {
        1: 'info', 2: 'warning', 3: 'danger', 4: 'success'
      }
    }
  },
  async created() {
    this.getSaleList()
  },
  methods: {
    initParams() {
      const params = {}
      params.sales_id = this.sales_id && this.sales_id.length ? this.sales_id.join(',') : ''
      return params
    },

    changeTime(val) {
      this.bindParams.flow_time_start = val ? val[0] || '' : ''
      this.bindParams.flow_time_end = val ? val[1] || '' : ''
      this.$refs.DmData.initPage()
    },

    formartValue(row, prop) {
      let row_text = row[prop]
      switch (prop) {
        case 'flow_source':
          row_text = this.FLOW_SOURCE_TEXT[row[prop]]
          break
        case 'status':
          row_text = this.DAY_STATUS_TEXT[(+row[prop])]
          break
        case 'act_pay_status':
          row_text = this.ACT_PAY_STATUS[Number(row[prop])]
          break
      }
      return row_text || '--'
    },

    async getSaleList() {
      this.SALES = []
      const api = '/fd/V4/customer.manage.getbasicconf'
      await this.InvokeAllApi.get(api, {}).then(res => {
        const role = JSON.parse(JSON.stringify(res.role_list))
        const user = JSON.parse(JSON.stringify(res.user_list))
        const SALES = this.group(role, user)
        this.SALES = SALES
      })
    },

    group(role, user) {
      const newRole = role.filter(i => i.role_flag !== 'CRM_ADMIN') || []
      const newUser = user || []
      if (!newRole.length) {
        return []
      }
      newRole.forEach(r => {
        r.label = r.role_name || r.id || '--'
        r.value = r.id
        r.children = []
        newUser.forEach(u => {
          if (u.role_id === r.id) {
            u.label = u.name || u.user_id || '--'
            u.value = u.user_id || ''
            u.disabled = !u.name
            r.children.push(u)
          }
        })
      })
      return newRole
    },

    isLinkShow(type, data) {
      let show = false
      const is_line = (Number(data.flow_source) !== 4 || Number(data.flow_source) !== 5 || Number(data.flow_source) !== 7)
      const is_member = !!(data.member_id && data.member_id !== '0')
      const is_success = Number(data.flow_status) === 1
      const is_transfer = !!(Number(data.flow_source) === 1 || Number(data.flow_source) === 2)
      const is_check = Number(data.act_pay_status) === 2
      switch (type) {
        case 'edit':
          show = is_transfer && !is_member && is_line && is_success
          break
        case 'cancel':
          show = is_transfer && !is_member && is_line && is_success
          break
        case 'link':
          show = is_transfer && !is_member && is_line && is_success
          break
        case 'unlink':
          show = is_transfer && !!is_member && is_line
          break
        case 'check':
          show = is_check
          break
      }
      return show
    },

    handleRowClick(type, data) {
      const { listEdit, userLink, check } = this.$refs
      switch (type) {
        case 'save': // 录入
          listEdit.handleOpen(type, data || null)
          break
        case 'edit': // 编辑
          listEdit.handleOpen(type, data || null)
          break
        case 'invalid':
          this.handleInvalid(data)
          break
        case 'link': // 关联
          userLink.handleOpen(type, data || null)
          break
        case 'unlink': // 取消关联
          userLink.handleOpen(type, data || null)
          break
        case 'check': // 取消关联
          check.handleOpen(type, data || null)
          break
        default:
          break
      }
    },
    checkActPay(row, type) {
      const data = {
        flow_id: row.id, type: type
      }
      this.InvokeAllApi.post('/V4/financial.flow.relation.member.check.flow', data).then(res => {
        this.Message('ACTION_SUCCESS')
        this.$refs.DmData.initPage()
      }).catch(e => { return true })
    },
    handleInvalid(data) {
      this.$confirm('是否确认作废此条收款记录？', '作废收款', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.InvokeAllApi.post('/V4/financial.flow.cancel', { id: data.id }).then(res => {
          this.Message('ACTION_SUCCESS')
          this.$refs.DmData.initPage()
        })
      }).catch(e => { return true })
    }
  }
}
</script>
