<style lang="scss" scoped>
.input-box {
  width: 200px;
  margin: 0 2px 5px;
}
.setting-btn {
  margin-bottom: 5px;
}
</style>

<template>
  <console-page-layout>
    <div slot="filter">
      <DmToolbar>
        <InputSearch
          v-model="bindParams.domain"
          placeholder="域名"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
        <InputSearch
          v-model="bindParams.email"
          placeholder="邮箱"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
        <InputSearch
          v-model="bindParams.mobile"
          placeholder="手机"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
        <br>
        <el-select v-model="bindParams.domain_status" placeholder="域名状态" clearable class="input-box" @change="$refs.DmData.initPage()">
          <ElOption v-for="(item,key) in DOMAIN_STATUSES" :key="key" :label="item.label" :value="item.value"/>
        </el-select>
        <el-select v-model="bindParams.is_record" placeholder="备案状态" clearable class="input-box" @change="$refs.DmData.initPage()">
          <ElOption v-for="(item,key) in IS_RECORD" :key="key" :label="item.label" :value="item.value"/>
        </el-select>
        <el-select v-model="bindParams.trust_status" placeholder="托管状态" clearable class="input-box" @change="$refs.DmData.initPage()">
          <ElOption v-for="(item,key) in TRUST_STATUSES" :key="key" :label="item.label" :value="item.value"/>
        </el-select>
        <el-button :loading="loading" type="primary" icon="el-icon-search" style="margin-left:0px" @click="$refs.DmData.initPage()">搜 索</el-button>
      </DmToolbar>
    </div>
    <el-button :disabled="select.length === 0" type="primary" icon="el-icon-setting" class="setting-btn" @click="handleEditRowStatus">批量修改状态</el-button>
    <el-button type="primary" icon="el-icon-setting" class="setting-btn" @click="handleEditRowStatus('atuo')">手动匹配</el-button>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable v-loading="loading">
        <el-table v-loading="loading" :data="list" @selection-change="selectChange">
          <el-table-column label="" type="selection" width="55"/>
          <el-table-column
            v-for="(item, index) in column"
            :key="index"
            :label="item.label"
            :width="item.width && item.width || ''"
            :show-overflow-tooltip="item.show_overflow_tooltip || true"
          >
            <template slot-scope="scope">
              <div v-if="item.prop === 'mobile'">{{ getMemberMobile(scope.row) }}</div>
              <div v-else-if="item.prop === 'email'">{{ getMemberEmail(scope.row) }}</div>
              <div v-else-if="item.prop === 'status_desc'"><el-tag :type="tag_type[Number(scope.row.status)]">{{ scope.row.status_desc }}</el-tag></div>
              <div v-else-if="item.prop === 'trust_status_desc'">
                <el-tag :type="tag_trust[Number(scope.row.trust_status)]">{{ scope.row.trust_status_desc }}</el-tag>
              </div>
              <div v-else-if="item.prop === 'is_record_desc'">
                <el-tag :type="tag_record[Number(scope.row.is_record)]">{{ scope.row.is_record_desc }}</el-tag>
              </div>
              <div v-else-if="item.prop === 'zombie_desc'">
                <el-tag :type="Number(scope.row.zombiedomain)!==0 ? 'success':'danger'">{{ scope.row.zombie_desc }}</el-tag>
              </div>
              <div v-else-if="item.prop === 'is_transfer_desc'">
                <el-tag :type="Number(scope.row.is_transfer)!==0 ? 'success':'warning'">{{ scope.row.is_transfer_desc }}</el-tag>
              </div>
              <div v-else-if="item.prop === 'expiry_time'">
                <span>{{ scope.row.created_at +'--'+ scope.row.expiry_time }}</span>
              </div>
              <div v-else>{{ formartValue(scope.row, item.prop) }}</div>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogEditStatus ref="dialogEditStatus" @loadGrid="$refs.DmData.initPage()"/>
    <DialogAutoEdit ref="dialogAutoEdit" @loadGrid="$refs.DmData.initPage()"/>
    <el-tooltip placement="top" content="回到顶部">
      <back-to-top :custom-style="myBackToTopStyle" :visibility-height="300" :back-position="50" transition-name="fade"/>
    </el-tooltip>
  </console-page-layout>
</template>
<script>
import * as FORM from './form'
import DialogEditStatus from './components/DialogEditStatus'
import DialogAutoEdit from './components/DialogAutoEdit'
import consoleData from '@/mixins/consoleData'
export default {
  components: { DialogEditStatus, DialogAutoEdit },
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '/V4/CloudDns.Domain.DnsDomain.getList',
      select: [],
      params: {},
      column: FORM.column,
      bindParams: FORM.search,
      pagination: FORM.pagination,
      tag_type: FORM.tag_type,
      tag_record: FORM.tag_record,
      tag_trust: FORM.tag_trust,
      trust_statuses: FORM.trust_statuses,
      TRUST_STATUSES: FORM.TRUST_STATUSES,
      IS_RECORD: FORM.IS_RECORD,
      myBackToTopStyle: FORM.myBackToTopStyle,
      DOMAIN_STATUSES: FORM.DOMAIN_STATUSES
    }
  },
  methods: {
    formartValue(row, prop) {
      return row[prop] || ''
    },
    getMemberEmail(row) {
      return row.member_info ? row.member_info.email || '--' : '--'
    },
    getMemberMobile(row) {
      return row.member_info ? row.member_info.mobile || '--' : '--'
    },
    selectChange(val) {
      this.select = val
    },
    handleEditRowStatus(type) {
      if (type === 'atuo') {
        this.$refs.dialogAutoEdit.handleOpen(this.select)
        return
      }
      if (!this.select.length) {
        this.message.warning('请选择数据!')
        return
      }
      this.$refs.dialogEditStatus.handleOpen(this.select)
    }
  }
}
</script>
