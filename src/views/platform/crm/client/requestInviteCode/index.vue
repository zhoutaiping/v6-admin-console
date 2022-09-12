<template>
  <console-page-layout>
    <div slot="filter">
      <DmToolbar>
        <div slot="right">
          <DmSelect
            v-model="bindParams.status"
            :selects="STATUS"
            :default-value="''"
            clearable
            default-text="全部状态"
            placeholder="状态"
            class="input-box"
            style="margin-right:10px;"
            @change="$refs.DmData.initPage()"
          />
          <InputSearch
            v-model="bindParams.search_key"
            placeholder="请输入关键字"
            @submit="$refs.DmData.initPage()"
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
        <el-table
          :data="list"
          @select="handleRowSelect"
          @select-all="handleRowSelect"
        >
          <el-table-column
            label="ID"
            prop="id"
          />
          <el-table-column
            label="名称"
            prop="name"
          />
          <el-table-column
            label="联系方式"
            prop="phone"
          />
          <el-table-column
            label="地址"
            prop="address"
          />
          <el-table-column
            label="邀请码"
            prop="code"
          />
          <el-table-column
            label="类型"
            prop="type"
          />

          <el-table-column
            label="邀请码状态"
            prop="status"
            width="120"
          >
            <template slot-scope="{row}">
              {{ fomartValue(row, 'invite_code_status') }}
            </template>
          </el-table-column>
          <el-table-column
            label="审核状态"
            prop="status"
            width="120"
          >
            <template slot-scope="{row}">
              {{ fomartValue(row, 'status') }}
            </template>
          </el-table-column>
          <el-table-column
            label="审核人"
            prop="review_user_name"
            width="200"
          />
          <el-table-column
            label="创建时间"
            prop="created_at"
            width="200"
          />
          <el-table-column
            label="操作"
            align="right"
            min-width="150"
          >
            <template slot-scope="scope">
              <el-button
                :disabled="scope.row.status !=='init'"
                type="text"
                @click="showModal(scope.row)"
              >邀请码操作</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <a-modal
      :visible="visible"
      title="邀请码设置"
      ok-text= "确认"
      cancel-text= "取消"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <el-form ref="Form" :model="form" :rules="rules">
        <el-form-item label="邀请码状态" prop="operation">
          <DmSelect
            v-model="form.operation"
            :selects="SET_STATUS"
            clearable
            placeholder="状态"
          />
        </el-form-item>
      </el-form>
    </a-modal>
  </console-page-layout>
</template>

<script>
import consoleData from '@/mixins/consoleData'

export default {
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '/V4/canvas.requestInviteCode.query',
      bindParams: {
        search_key: '',
        status: ''
      },
      STATUS: [
        { label: '客户刚提交', value: 'init' },
        { label: '已通过', value: 'pass' },
        { label: '已拒绝', value: 'reject' }
        // { label: '用户已使用', value: 'user_used' }
      ],
      invite_code_status: [
        { label: '初始化', value: 'init' },
        { label: '用户已使用', value: 'used' },
        { label: '已废弃', value: 'abandoned' },
        { label: '未生成邀请码', value: '-' }
      ],
      SET_STATUS: [],
      rules: {
        operation: [{ required: true, message: ' ' }]
      },
      form: { request_invite_code_id: '',
        operation: '' },
      selectionId: [],
      visible: false,
      confirmLoading: false
    }
  },
  watch: {
    resData: {
      handler(val) {
        this.list = this.resData.data
        this.$refs.DmData.init({ total: this.resData.pagination.total })
      },
      deep: true
    }
  },
  methods: {
    fomartValue(data, prop) {
      let val = ''
      if (prop === 'status') {
        val = this.STATUS.find(i => i.value === data.status) && this.STATUS.find(i => i.value === data.status).label || '--'
      } else if (prop === 'invite_code_status') {
        val = this.invite_code_status.find(i => i.value === data.invite_code_status) && this.invite_code_status.find(i => i.value === data.invite_code_status).label || '--'
      }
      return val
    },
    showModal(data) {
      this.visible = true
      const status = [{ label: '通过', value: 'pass' },
        { label: '拒绝', value: 'reject' }]

      this.SET_STATUS = status.filter(i => i.value !== data.status)
      this.form = {
        request_invite_code_id: data.id,
        operation: ''
      }
    },
    handleOk(e) {
      this.$refs.Form.validate(valid => {
        if (valid) {
          this.Fetch.post('/V4/canvas.requestInviteCode.operate', this.form).then(res => {
            this.Message('ACTION_SUCCESS')
            this.fetchList()
            this.visible = false
          })
        }
      })
    },
    handleCancel(e) {
      this.visible = false
      this.form = {
        request_invite_code_id: '',
        operation: ''
      }
    },
    formatResponse(response) {
      return response
    },

    handleRowSelect(selection) {
      this.selectionId = selection.map(_ => _.id)
    }
  }
}
</script>
