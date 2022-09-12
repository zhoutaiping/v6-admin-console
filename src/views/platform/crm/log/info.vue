<style lang="scss" scoped>
.item-box {
  margin-bottom: 10px;
}
</style>

<template>
  <div>
    <DmDialog
      ref="dmdialog"
      :footer="false"
      title="日志详情"
      width="600px"
      aside
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="mini"
        label-width="90px"
        label-position="left"
      >
        <el-form-item
          label="操作时间"
          class="item-box"
        >{{ fomartTime }}</el-form-item>
        <el-form-item
          label="操作者信息"
          class="item-box"
        >{{ form.op_username }}</el-form-item>
        <el-form-item
          label="操作者IP"
          class="item-box"
        >{{ form.ip }}<span v-show="form.client_port">：</span>{{ form.client_port }}</el-form-item>
        <el-form-item
          label="被操作账号"
          class="item-box"
        >{{ form.username }}</el-form-item>
        <el-form-item
          label="模块"
          class="item-box"
        >{{ form.biz_type }}</el-form-item>
        <el-form-item
          label="操作类型"
          class="item-box"
        >{{ form.op_type }}</el-form-item>
        <el-form-item
          label="状态"
          class="item-box"
        >成功</el-form-item>
        <el-form-item
          label="被操作对象"
          class="item-box"
        >
          <el-input
            v-model="form.data_key"
            type="textarea"
            placeholder=""
          />
        </el-form-item>
        <el-form-item
          label="请求参数"
          class="item-box"
        >
          <el-input
            v-model="form.params"
            type="textarea"
            placeholder=""
          />
        </el-form-item>
        <el-form-item
          label="	操作的数据"
          class="item-box"
        >
          <el-input
            v-model="form.op_data"
            type="textarea"
            placeholder=""
          />
        </el-form-item>
        <el-form-item
          label="详情"
          class="item-box"
        >{{ form.content }}</el-form-item>
      </el-form>
    </DmDialog>
  </div>
</template>
<script>
import moment from 'moment'
import { deepClone } from '@/utils'
export default {
  data() {
    return {
      form: {},
      rules: {}
    }
  },
  computed: {
    fomartTime() {
      return moment(this.form.update_at).format('YYYY-MM-DD HH:mm:ss') || ''
    }
  },
  methods: {
    handleOpen(data) {
      this.$nextTick(() => {
        this.$refs.dmdialog.handleOpen()
        if (this.$refs.form) this.$refs.form.resetFields()
        const rowData = deepClone(data)
        if (rowData && rowData.id) {
          this.getInfo({ id: rowData.id })
        } else {
          rowData.data_key = JSON.stringify(rowData.data_key)
          rowData.params = JSON.stringify(rowData.params)
          rowData.op_data = JSON.stringify(rowData.op_data)
          this.form = Object.assign({}, rowData)
        }
      })
    },

    getInfo(params) {
      this.InvokeOpLogApi.get('/oplog/info', params).then(res => {
        res.data_key = JSON.stringify(res.data_key)
        res.params = JSON.stringify(res.params)
        res.op_data = JSON.stringify(res.op_data)
        this.form = Object.assign({}, res)
      }).catch(e => { this.form = {} })
    }
  }
}
</script>
