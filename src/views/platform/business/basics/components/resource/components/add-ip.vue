<style lang="scss" scoped>
.input-box {
  width: 400px;
}
.input-box /deep/.el-input__inner {
  text-align: left;
}
</style>
<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="handleSubmit"
    title="新增IP"
    width="600px"
  >
    <div>
      <DmAlert>
        1、匹配节点：匹配资源包配置的标签和获取资源策略的节点资源；<br>
        2、全局节点：支持获取全局可用节点，专享类型资源包默认过滤掉已分配节点；
      </DmAlert>
      <el-form ref="Form" :model="form" :rules="rules" label-position="left" label-width="120px">
        <el-form-item label="类型" prop="node_type">
          <DmSelect
            v-model="form.type"
            :selects="options.type"
            class="input-box"
            placeholder=" "
            @change="e => {
              options.ip = []
              form.ip = ''
              if(e) {
                typeIp(e)
              }
            }"
          />
        </el-form-item>
        <el-form-item label="ip" prop="ip">
          <DmSelect
            v-model="form.ip"
            :selects="options.ip"
            :filterable="true"
            class="input-box"
            placeholder=" "
          />
        </el-form-item>
      </el-form>
    </div>
  </DmDialog>
</template>
<script>
export default {
  data() {
    return {
      open: false,
      form: {
        ippool_id: '',
        ip: '',
        type: ''
      },
      rules: {
        ippool_id: [],
        ip: [{ required: true, message: ' ' }],
        type: [{ required: true, message: ' ' }]
      },
      options: {
        type: [
          { label: '匹配节点', value: '1' },
          { label: '全局节点', value: '2' }
        ],
        ip: []
      }
    }
  },

  methods: {
    handleOpen(data, option) {
      this.$nextTick(() => {
        this.$refs.Dialog.handleOpen()
        this.$refs.Form && this.$refs.Form.resetFields()
        this.form.ippool_id = data
        this.options.ip = []
      })
    },

    async typeIp(type = '') {
      try {
        const data = await this.FetchDisp.get('/ip/pool/ip/select', { type: type, page: 1, ippool_id: this.form.ippool_id, pagesize: 9999 })
        this.options.ip = data.list.map(i => { return { label: i, value: i } })

        if (this.options.ip.length > 0) {
          this.form.ip = this.options.ip[0]
        }
      } catch (error) {
        return
      }
    },

    handleSubmit() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          this.FetchDisp.post('/ip/pool/ip/add', { ...this.form }).then(res => {
            this.Message('ACTION_SUCCESS')
            this.$refs.Dialog.afterValidate()
            this.$refs.Dialog.handleClose()
            this.$emit('init')
          }).catch(e => {
            this.$refs.Dialog.afterValidate()
          })
        } else {
          this.$refs.Dialog.afterValidate()
          return false
        }
      })
    }
  }
}
</script>
