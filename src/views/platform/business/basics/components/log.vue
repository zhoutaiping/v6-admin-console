<style lang="scss" scoped>
.divider-box {
  margin: 5px 0 0;
}
.log-box {
  border: 1px solid rgb(128, 128, 128);
}
</style>
<template>
  <DmDialog
    ref="Dialog"
    :footer="false"
    append-to-body
    title="日志"
    width="800px"
    aside
  >
    <DmData
      ref="dmData"
      :auto-init="false"
      @init="init"
    >
      <DmTable :loading="loading">
        <el-table :data="list">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <DmAlert>
                <span> 调度结果： </span>
                <p
                  v-for="(record ,i) in scope.row.data.disp_records"
                  :key="i"
                  style="margin-bottom: 0;"
                >
                  {{ i + 1 }}:
                  <span v-show="record.domain">域名【{{ record.domain }}】</span>
                  <span v-show="record.ip">IP【{{ record.ip }}】</span>
                  <span v-show="record.line">线路【{{ record.line }}】</span>
                  <span v-show="record.tags">标签【{{ record.tags ? record.tags.join(',') : '' }}】</span>
                </p>
              </DmAlert>
              <DmAlert>
                <span> 错误日志 </span>
                <p
                  v-for="(item ,i) in scope.row.data.errors"
                  :key="i"
                  style="margin-bottom: 0;"
                >
                  {{ i + 1 }}：{{ item }}
                </p>
              </DmAlert>
            </template>
          </el-table-column>
          <el-table-column label="id" prop="id" width="55" />
          <el-table-column label="调度类型" width="120">
            <template slot-scope="scope">
              {{ fomartValue(scope.row,'btype') }}
            </template>
          </el-table-column>
          <el-table-column label="概览">
            <template slot-scope="scope">
              {{ fomartValue(scope.row,'error') }}
            </template>
          </el-table-column>
          <el-table-column label="调度时间" prop="create_at" width="160">
            <template slot-scope="scope">
              {{ fomartValue(scope.row, 'create_at') }}
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
  </DmDialog>
</template>

<script>
import moment from 'moment'
export default {
  props: {
    btype: {
      type: String,
      default: 'Domain'
    }
  },
  data() {
    return {
      loading: false,
      API: '/disp/log',
      list: [],
      btypeText: {
        'meal': '套餐调度',
        'domian': '域名调度'
      },
      params: {}
    }
  },
  methods: {
    handleOpen(data, option) {
      this.$nextTick(() => {
        this.$refs.Dialog.handleOpen()
        this.list = []
        this.params = Object.assign({}, data)
        setTimeout(() => {
          if (this.$refs.dmData) this.$refs.dmData.initPage()
        }, 10)
      })
    },

    async init(params = this.$refs.dmData.getParams()) {
      params = {
        ...params,
        ...this.params
      }
      this.loading = true
      const data = await this.InvokeDispApi.get('/disp/log', params)
      this.list = data.list || []
      this.$refs.dmData.init({ total: parseInt(data.total || 0, 10) })
      setTimeout(() => { this.loading = false }, 500)
    },

    fomartValue(data, type) {
      let val = ''
      switch (type) {
        case 'btype' :
          val = this.btypeText[data.btype] || ''
          break
        case 'create_at' :
          val = moment(data.create_at).format('YYYY-MM-DD HH:mm:ss')
          break
        default :
          val = data[type]
          break
      }
      return val
    }
  }
}
</script>
