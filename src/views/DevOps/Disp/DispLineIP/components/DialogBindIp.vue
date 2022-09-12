<style lang="postcss" scoped>
.line-bind {
  .line-bind-dialog {
    .line-dialog-form {
      padding: 5px;
      .line-dialog-item {
        margin-bottom: 0px;
      }
      .line-dialog-input {
        width: 200px;
      }
    }
    .border-bottom {
      border-bottom: 1px solid #66666650;
      padding-bottom: 15px;
    }
    .border-top {
      border-top: 1px solid #66666650;
      padding-top: 10px;
    }
    .ipTag {
      width: 93%;
      margin: 5px 0 5px;
      min-height: 45px;
      max-height: 300px;
      background: #ecf5ff;
      border: 1px solid #b3d8ff;
    }
  }
}
</style>

<template>
  <div class="line-bind">
    <FDialog
      :visible.sync="open"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      title="绑定备用IP"
      size="600"
      aside
      class="line-bind-dialog"
      @close="handleClose"
    >
      <DmScroll>
        <el-form
          ref="bindForm"
          :model="bindForm"
          :rules="rules"
          label-position="left"
          label-width="120px"
          size="mini"
          class="line-dialog-form"
        >
          <el-form-item
            v-if="bindForm.ip_list.length"
            label="已选择IP"
            class="line-dialog-item"
          />
          <el-form-item
            v-if="bindForm.ip_list.length"
            label-width="0"
            class="ipTag"
          >
            <el-tag
              v-for="(ip, index) in bindForm.ip_list"
              :key="index"
              type=""
              style="margin:2px;"
              closable
              @close="delIP(ip)"
            >{{ ip }}</el-tag>
          </el-form-item>
          <el-form-item
            label=""
            label-width="0px"
          >
            <el-input
              v-model="ip"
              placeholder="请输入IP"
              clearable
              class="line-dialog-input"
            />
            <el-button
              type="primary"
              @click="getIp"
            >搜索</el-button>
            <el-table
              v-loading="loading"
              :data="list"
              :key="tabKey"
              border
              style="width:95%"
            >
              <el-table-column
                label="ID"
                prop="id"
                width="55"
              />
              <el-table-column
                label="IP"
                prop="ip"
              />
              <el-table-column
                label="操作"
                width="150"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.ip && bindForm.ip_list.indexOf(scope.row.ip) >-1">
                    <el-tag
                      type="success"
                      style="margin:2px;"
                    >已选择</el-tag>
                    <el-button
                      type="primary"
                      @click="delIP(scope.row.ip)"
                    >清除</el-button>
                  </div>
                  <div v-else-if="scope.row.ip && bindForm.ip_list.indexOf(scope.row.ip) < 0">
                    <el-button
                      type="primary"
                      @click="addIP(scope.row.ip)"
                    >添加</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <Pagination
              :total="pagination.total"
              :page="pagination.page"
              :limit="pagination.per_page"
              layout="total, sizes"
              @pagination="handlePagination"
            />
          </el-form-item>
        </el-form>
      </DmScroll>
      <div slot="footer">
        <el-button
          type="info"
          size="mini"
          @click="handleClose"
        >取消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="handleSubmint"
        >确定</el-button>
      </div>
    </FDialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      open: false,
      loading: false,
      is_edit: false,
      pagination: {
        page_sizes: [10, 20, 50, 100],
        page: 1,
        per_page: 10,
        total: 0
      },
      tabKey: 0,
      list: [],
      ip: '',
      panelType: 'add',
      bindForm: {
        id: '',
        name: '',
        back_ips: [],
        ip_list: []
      },
      BACK_IPS: [],
      LINE: [{ label: '线路1', value: '1' }],
      rules: {
        ip_list: [],
        back_ips: [{ required: true, message: '请输入IP/IP段', trigger: ['change', 'blur'] }],
        remark: []
      }
    }
  },

  methods: {
    handleOpen(data, type) {
      this.$nextTick(() => {
        this.resetForm('bindForm')
        this.getIp()
        this.panelType = type
        this.getInfo({ id: data.id }, type)
        this.open = true
      })
    },
    getInfo(params, type) {
      this.InvokeDispApi.get('/line/info', params).then(res => {
        const data = JSON.parse(JSON.stringify(res)) || {}
        this.bindForm.id = data.info.id
        this.bindForm.name = data.info.name
        const back_ips = data.back_ips && JSON.parse(data.info.back_ips) || {}
        const BACK_IPS = []
        Object.keys(back_ips).forEach(i => {
          if (back_ips[i]) BACK_IPS.push(back_ips[i])
        })
        this.BACK_IPS = BACK_IPS
      })
    },
    async getIp(params = { page: 1, pagesize: 10 }) {
      this.loading = true
      try {
        if (this.ip) params.ip = this.ip.trim()
        const data = await this.InvokeDispApi.get('/ip/list', params)
        this.tabKey++
        this.list = data.list
        this.pagination.total = data.total
      } catch (error) {
        this.list = []
        this.pagination.total = 0
      }
      this.loading = false
    },
    handlePagination(params) {
      this.pagination.page = params.page
      this.pagination.per_page = params.pre_page
      this.getIp({ page: params.page, pagesize: params.pre_page })
    },
    addIP(ip) {
      if (this.bindForm.ip_list.indexOf(ip) < 0) this.bindForm.ip_list.push(ip)
    },
    delIP(ip) {
      if (this.bindForm.ip_list.indexOf(ip) > -1) this.bindForm.ip_list = this.bindForm.ip_list.filter(i => i !== ip)
    },
    resetForm(formName) {
      this.ip = ''
      if (this.$refs.bindForm !== undefined) this.$refs.bindForm.resetFields()
    },
    handleClose() {
      if (this.$refs.bindForm) this.open = false
    },
    handleSubmint() {
      const params = this.getParams()
      this.$refs.bindForm.validate((valid) => {
        if (valid) {
          if (!params) return
          this.InvokeDispApi.post('/line/backip/bind', params).then(res => {
            this.Message('ACTION_SUCCESS')
            this.$emit('handleLoad')
            this.open = false
          })
        }
      })
    },
    getParams() {
      if (!this.bindForm.ip_list.length) {
        this.message.warning('请选择要绑定的IP')
        return
      }
      const params = {
        line_id: (this.bindForm.id).toString(),
        back_ips: this.bindForm.ip_list
      }
      return params
    }
  }
}
</script>
