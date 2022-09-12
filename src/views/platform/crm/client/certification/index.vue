<style lang="scss" scoped>
@import "./index.scss";
</style>
<template>
  <console-page-layout >
    <div slot="filter">
      <DmToolbar>
        <div slot="right">
          <InputSearch
            v-model="bindParams.email"
            placeholder="请输入邮箱"
            class="search-input"
            @submit="$refs.DmData.initPage()"
          />
          <DmSelect
            v-model="bindParams.certification_type"
            :selects="STATUS"
            clearable
            placeholder="审核类型"
            class="search-input"
            @change="$refs.DmData.initPage()"
          />
        </div>
      </DmToolbar>
    </div>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable
        :loading="loading"
        min-height
      >
        <el-table :data="list">
          <el-table-column v-for="(item, index) in Column" :key="index" :label="item.label" :width="item.width" show-overflow-tooltip >
            <template slot-scope="scope">
              {{ formartValue(scope.row, item.prop) }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="200"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button v-show="Number(scope.row.check_status) ===4" slot="reference" type="text" @click="handleRow(scope.row, 'review')">审核申请</el-button>
              <el-divider v-if="Number(scope.row.check_status) ===4" direction="vertical"/>
              <el-button
                type="text"
                size="mini"
                class="option-button"
                @click="handleRow(scope.row, 'info')"
              >详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>

    <el-tooltip
      placement="top"
      content="回到顶部"
    >
      <back-to-top
        :custom-style="myBackToTopStyle"
        :visibility-height="300"
        :back-position="50"
        transition-name="fade"
      />
    </el-tooltip>
    <DialogInfo
      ref="dialogInfo"
    />
    <DialogReview
      ref="dialogReview"
      @handleLoad="$refs.DmData.initPage()"
    />
  </console-page-layout>
</template>

<script>
import * as Form from './form'
import DialogInfo from './components/DialogInfo'
import DialogReview from './components/DialogReview'
import consoleData from '@/mixins/consoleData'
import { deepClone } from '@/utils'
export default {
  components: { DialogInfo, DialogReview },
  mixins: [consoleData],
  data() {
    return {
      loading: false,
      visible: false,
      list: [],
      LIST_API: '/V4/Account.certification.editlist',
      API_INDEX: '/V4/Account.certification.editlist',
      bindParams: {
        email: '',
        certification_type: ''
      },
      Column: Form.column,
      myBackToTopStyle: Form.myBackToTopStyle,
      TYPE: [
        { label: '个人认证', value: '1' },
        { label: '企业认证', value: '2' },
        { label: '政府和事业认证', value: '3' },
        { label: '个人升事业认证', value: '4' },
        { label: '变更认证', value: '5' },
        { label: '事业认证', value: '6' }
      ],
      STATUS: [
        { label: '审核通过', value: '1' },
        { label: '审核中', value: '2' },
        { label: '审核不通过', value: '3' },
        { label: '待审核', value: '4' }
      ]
    }
  },
  methods: {
    formartValue(row, prop) {
      return row[prop] || ''
    },
    handleRow(row, type) {
      if (type === 'info' && this.$refs.dialogInfo) this.$refs.dialogInfo.handleOpen(deepClone(row))
      if (type === 'review' && this.$refs.dialogReview) this.$refs.dialogReview.handleOpen(deepClone(row))
    }
  }
}
</script>
