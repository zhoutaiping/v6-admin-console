<style lang="scss" scoped>
.search-form-input {
  width: 185px;
  margin: 0 2px 5px;
}
.search-form-item {
  margin-bottom: 5px;
}
.op-btn {
  margin: 0 2px;
}
.tabs {
  display: inline-block;
  height: 45px;
}
.right-box {
  float: right;
  line-height: 45px;
}
</style>

<template>
  <ConsolePageLayout>
    <div>
      <el-form >
        <el-input
          v-model="search.member_name"
          placeholder="报备名称"
          class="search-form-input"
          clearable
        />
        <el-input
          v-model="search.email"
          placeholder="客户邮箱"
          class="search-form-input"
          clearable
        />
        <el-input
          v-model="search.certification_name"
          placeholder="认证名称"
          class="search-form-input"
          clearable
        />
        <el-select
          v-model="search.sale"
          placeholder="请选择销售"
          class="search-form-input"
          clearable
          @change="$refs.DmData.initPage()"
        >
          <el-option
            v-for="(item, key) in CRM_NORMAL_MARKET"
            :key="key"
            :label="item.label"
            :value="item.value"
            :disabled="Number(item.status) === 0"
          />
        </el-select>
        <yd-form-select
          v-model="search.member_level"
          :selects="clientLabel.member_level"
          default-text="全部客户等级"
          class="search-form-input"
          clearable
          @change="$refs.DmData.initPage()"
        />
        <template v-if="is_all">
          <DmSelect
            v-model="search.industry_one_level"
            :selects="industry_map.one_level_industry_map"
            clearable
            placeholder="一级级行业"
            class="search-form-input"
            @change="$refs.DmData.initPage()"
          />
          <DmSelect
            v-model="search.industry_second_level"
            :selects="industry_map.second_level_industry_map"
            clearable
            placeholder="二级行业"
            class="search-form-input"
            @change="$refs.DmData.initPage()"
          />
          <el-select
            v-model="search.member_status"
            clearable
            placeholder="客户阶段"
            class="search-form-input"
            @change="$refs.DmData.initPage()"
          >
            <el-option
              v-for="item in Object.keys(basic_conf.member_status)"
              :key="item"
              :label="basic_conf.member_status[item]"
              :value="item"
            />
          </el-select>
          <el-date-picker
            v-model="search.member_status_time_start"
            type="date"
            placeholder="客户阶段更新修改开始日期"
            value-format="yyyy-MM-dd 00:00:00"
            class="search-form-input"
          />
          <el-date-picker
            v-model="search.member_status_time_end"
            type="date"
            placeholder="客户阶段更新修改结束日期"
            value-format="yyyy-MM-dd 23:59:59"
            class="search-form-input"
          />

        </template>
        <template v-if="is_all">
          <el-select
            v-model="search.reason_top"
            placeholder="主要流失原因"
            clearable
            class="search-form-input"
            @change="search.reason_second = ''"
          >
            <div v-if="Object.keys(basic_conf.lose_cause).length">
              <el-option
                v-for="(item, index) in Object.keys(basic_conf.lose_cause)"
                :key="index"
                :value="item"
                :label="basic_conf.lose_cause[item].desc"
              />
            </div>
          </el-select>
          <el-select
            v-model="search.reason_second"
            placeholder="流失原因"
            clearable
            class="search-form-input"
          >
            <div v-if="search.reason_top">
              <el-option
                v-for="(item, index) in basic_conf.lose_cause[search.reason_top].list"
                :key="index"
                :value="item.key"
                :label="item.value"
              />
            </div>
          </el-select>
          <el-select
            v-model="search.reason_top_2"
            placeholder="次要流失原因"
            clearable
            class="search-form-input"
            @change="search.reason_second_2 = ''"
          >
            <div v-if="Object.keys(basic_conf.lose_cause).length">
              <el-option
                v-for="(item, index) in Object.keys(basic_conf.lose_cause)"
                :key="index"
                :value="item"
                :label="basic_conf.lose_cause[item].desc"
              />
            </div>
          </el-select>
          <el-select
            v-model="search.reason_second_2"
            placeholder="流失原因"
            clearable
            class="search-form-input"
          >
            <div v-if="search.reason_top_2">
              <el-option
                v-for="(item, index) in basic_conf.lose_cause[search.reason_top_2].list"
                :key="index"
                :value="item.key"
                :label="item.value"
              />
            </div>
          </el-select>
          <el-date-picker
            v-model="search.loss_date_start"
            type="date"
            placeholder="流失开始日期"
            value-format="yyyy-MM-dd 00:00:00"
            class="search-form-input"
          />
          <el-date-picker
            v-model="search.loss_date_end"
            type="date"
            placeholder="流失结束日期"
            value-format="yyyy-MM-dd 23:59:59"
            class="search-form-input"
          />

        </template>

        <el-select
          v-model="search.is_strategic_coustomer"
          clearable
          placeholder="是否战略客户"
          class="search-form-input"
          @change="$refs.DmData.initPage()"
        >
          <el-option
            v-for="(item,key) in IS_STRATEGIC_COUSTOMER"
            :key="key"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="search.is_no_commission"
          clearable
          placeholder="业绩不计提成客户"
          class="search-form-input"
          @change="$refs.DmData.initPage()"
        >
          <el-option
            v-for="(item,key) in IS_NO_COMMISSION"
            :key="key"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <DmSelect
          v-model="search.afterSales"
          :selects="afterSales_list"
          clearable
          placeholder="售后技术支持"
          class="search-form-input"
          @change="$refs.DmData.initPage()"
        />
        <br>

        <p>
          <el-button type="primary" class="op-btn" @click="$refs.DmData.initPage()" >搜 索</el-button>
          <el-button :class="is_all?'el-icon-arrow-up op-btn':'el-icon-arrow-down op-btn'" type="primary" @click="e =>{is_all = !is_all}" >更多搜索</el-button>
          <a-popconfirm
            title="是否导出数据？"
            ok-text="是"
            cancel-text="否"
            @confirm="handleExcel"
          >
            <el-button type="primary" class="op-btn" >导 出</el-button>
          </a-popconfirm>
          <el-button type="primary" class="op-btn" @click="$refs.save.handleOpen(industry_map)" >报 备</el-button>
          <el-button class="op-btn" @click="setColumn" >自定义显示</el-button>
        </p>
      </el-form>
      <!-- <Form ref="form" :vm="$data" @init="$refs.DmData.initPage()"/> -->
    </div>
    <!-- <div>
      <Tab
        ref="tab"
        @init="e =>{
          $refs.form.form.is_no_commission = e
          $refs.DmData.initPage()
      }"/>
      <div class="right-box">
        <el-button type="primary" @click="$refs.save.handleOpen()" >报 备</el-button>
        <a-popconfirm
          title="是否导出数据？"
          ok-text="是"
          cancel-text="否"
          @confirm="handleExcel"
        >
          <el-button type="primary">导 出</el-button>
        </a-popconfirm>
        <el-button @click="setColumn" >自定义显示</el-button>
      </div>
    </div> -->
    <DmData ref="DmData" @init="fetchList(getParams())" >
      <DmTable :loading="loading">
        <el-table :data="list" :key="tabKey" >
          <el-table-column
            v-for="(tab_item, tab_index) in filtet_column"
            :key="tab_index"
            :label="tab_item.label"
            :min-width="tab_item.width"
            :fixed="tab_item.fixed"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div v-if="tab_item.porp === 'customer_name'">
                {{ scope.row.customer_name || '--' }}
                <el-tag
                  v-if="scope.row.customer_level"
                  size="mini"
                  style="margin-left: 10px"
                >{{ scope.row.customer_level }}</el-tag>
              </div>
              <div v-else-if="tab_item.prop === 'member_status'">
                {{ formartValue(scope.row, tab_item.prop) }}
                <div
                  v-if="Number(scope.row.member_status) === 5 || Number(scope.row.member_status) === 10 || Number(scope.row.member_status) === 11"
                  style="display: inline-block;"
                >
                  <el-divider direction="vertical" />
                  <a-popconfirm
                    title="确认用户流失?"
                    ok-text="确定"
                    cancel-text="否"
                    @confirm="updateStatus(scope.row)"
                  >
                    <el-button type="text">流失确认</el-button>
                  </a-popconfirm>
                </div>
                <div
                  v-if="Number(scope.row.member_status) === 6"
                  style="display: inline-block;"
                >
                  <el-divider direction="vertical" />
                  <a-popconfirm
                    title="确认用户退回报备阶段?"
                    ok-text="确定"
                    cancel-text="否"
                    @confirm="updateStatus(scope.row, 2)"
                  >
                    <el-button type="text">退回报备</el-button>
                  </a-popconfirm>
                </div>
              </div>
              <div v-else> {{ formartValue(scope.row, tab_item.prop) }} </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="310" fixed="right" >
            <template slot-scope="scope">
              <a class="color--primary" @click="handleRowClick(scope.row,'info')">详 情</a>
              <el-divider direction="vertical" />
              <a class="color--primary" @click="handleRowClick(scope.row,'edit')">基本信息变更</a>
              <el-divider direction="vertical" />
              <span v-show="Number(scope.row.certification_type) === 2">
                <a class="color--primary" @click="handleRowClick(scope.row,'certification')">变更认证</a>
                <el-divider direction="vertical" />
              </span>
              <a class="color--primary" @click="$refs.userProof.handleOpen(scope.row, linkTag)">用户认证</a>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogBaseEdit
      ref="dialogBaseEdit"
      :basic_conf="basic_conf"
      :industry="industry"
      :role_list="role_list"
      :user_list="user_list"
      :sales-group="salesGroup"
      @handleload="$refs.DmData.initPage()"
    />
    <diaolog-base-info
      ref="diaologBaseInfo"
      :basic_conf="basic_conf"
      :industry="industry"
      :role_list="role_list"
      :user_list="user_list"
      @handleload="$refs.DmData.initPage()"
    />
    <DialogEditAuth
      ref="dialogEditAuth"
      @handleload="$refs.DmData.initPage()"
    />
    <Outflow
      ref="outflow"
      @handleload="$refs.DmData.initPage()"
    />
    <Save
      ref="save"
      @init="$refs.DmData.initPage()"
    />
    <AutoColumn
      ref="autoColumn"
      @initColumn="initColumn"
    />
    <user-proof
      ref="userProof"
      @init="$refs.DmData.initPage()"
    />
  </ConsolePageLayout>
</template>

<script>
import clientMixins from '@/mixins/client'
import indexMixins from './mixins'
import FORM from './form'
import DiaologBaseInfo from './components/dialog-base-info'
import DialogEditAuth from './components/DialogEditAuth'
import DialogBaseEdit from './components/DialogBaseEdit'
import UserProof from './components/user-proof'
import Outflow from './components/outflow'
import Save from './components/save'
import initColumn from '@/mixins/initColumn'
import consoleData from '@/mixins/consoleData'
import Tab from './tab'
import Form from './form.vue'
export default {
  components: { DiaologBaseInfo, DialogEditAuth, UserProof, DialogBaseEdit, Outflow, Save, Tab, Form },
  mixins: [clientMixins, indexMixins, initColumn, consoleData],
  data() {
    return {
      pannel_name: 'client_base',
      API_INDEX: '/fd/V4/customer.manage.getcustomerlist',
      API_METHOD: 'post',
      is_all: false,
      tabKey: 0,
      search: FORM.search,
      INDUSTRY: [], // 行业
      LEVEL: [], // 客户重要性
      IS_NO_COMMISSION: [{ label: '是', value: '1' }, { label: '否', value: '2' }, { label: '未选择', value: '3' }],
      IS_STRATEGIC_COUSTOMER: [{ label: '是', value: '1' }, { label: '否', value: '2' }, { label: '未选择', value: '3' }],
      IS_NO_COMMISSION_TEXT: { 1: '是', 2: '否', 3: '未选择', '': '--' }, // 业绩不计提成：1-是，2-否
      IS_STRATEGIC_COUSTOMER_TEXT: { 1: '是', 2: '否', 3: '未选择', '': '--' }

    }
  },
  methods: {
    formartValue(row, prop) {
      const row_text = row[prop]
      if (prop === 'member_type') {
        return this.basic_conf['member_type'] && this.basic_conf['member_type'][Number(row[prop])] || ''
      } else if (prop === 'sales') {
        return this.getSalesText(row.user_list)
      } else if (prop === 'member_status') {
        return this.basic_conf['member_status'] && this.basic_conf['member_status'][row.member_status] || ''
      } else if (prop === 'is_no_commission') {
        return this.IS_NO_COMMISSION_TEXT[row.is_no_commission] || ''
      } else if (prop === 'is_strategic_coustomer') {
        return this.IS_STRATEGIC_COUSTOMER_TEXT[row.is_strategic_coustomer] || ''
      } else if (prop === 'section_formal_service_months') {
        return this.section_formal_service_months[row_text]
      }
      return row_text
    },

    handleRowClick(data, type) {
      if (type === 'info') {
        this.$refs.diaologBaseInfo.handleOpen(data)
        return
      } else if (type === 'edit') {
        this.$refs.dialogBaseEdit.handleOpen(data, type, this.industry_map)
        return
      } else if (type === 'certification') {
        this.$refs.dialogEditAuth.handleOpen(JSON.parse(JSON.stringify(data)), this.basic_conf)
        return
      }
    }
  }
}
</script>
