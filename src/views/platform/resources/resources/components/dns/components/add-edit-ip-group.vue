<style lang="scss" scoped>
.item-box {
  margin-bottom:5px;
}
.input-box {
  width:300px;
}
</style>
<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="handleSubmit"
    :mode="mode"
    title-label="分组"
    width="600px"
  >
    <div>
      <el-form ref="Form" :model="form" :rules="rules" label-width="120px" label-position="left">
        <el-form-item label="名称" prop="name" class="item-box">
          <el-input v-model="form.name" class="input-box"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark" class="item-box">
          <el-input v-model="form.remark" class="input-box"/>
        </el-form-item>
        <template v-if="mode === 'Edit'">
          <el-form-item label="已绑定IP" class="item-box">
            <el-tag v-for="(ip) in rowData.ips" :key="ip" closable style="margin:2px;" @close="handleClose(ip)">
              {{ ip }}
            </el-tag>
            <span v-if="!rowData.ips || rowData.ips.length === 0">暂无</span>
          </el-form-item>
        </template>
      </el-form>
    </div>
  </DmDialog>
</template>

<script>
import { deepClone } from '../../../../../../../utils'
export default {
  data() {
    return {
      default_form: {
        id: '',
        name: '',
        remark: ''
      },
      form: {},
      mode: 'Create',
      rules: {
        id: [],
        name: [{ required: true, message: ' ' }],
        remark: []
      },
      rowData: {}
    }
  },
  methods: {
    handleOpen(data, option = '') {
      if (option) {
        this.mode = option
      }
      this.form = Object.assign({}, this.default_form)
      this.$nextTick(() => {
        this.$refs.Dialog.handleOpen()

        if (this.$refs.Form) {
          this.$refs.Form.resetFields()
        }
        if (option === 'Edit') {
          this.rowData = Object.assign({}, data)
          this.info({ id: data.id })
        }
      })
    },

    async info(params = {}) {
      try {
        const data = await this.FetchDisp.get('/ip/group/info', params)
        this.form = Object.assign(this.default_form, data)
      } catch (e) {
        return e
      }
    },

    async handleClose(ip) {
      try {
        await this.FetchDisp.post('/ip/group/unbind', { ips: [ip] })
        this.Message('ACTION_SUCCESS')
        this.rowData.ips = deepClone(this.rowData.ips).filter(i => i !== ip)
        await this.info({ id: this.form.id })
      } catch (e) {
        return
      }
    },

    handleSubmit(form = '') {
      this.$refs.Form.validate(async(valid) => {
        if (valid) {
          try {
            await this.FetchDisp.post('/ip/group/save', { ...this.form })
            this.Message('ACTION_SUCCESS')
            this.$emit('init')
            this.$refs.Dialog.handleClose()
          } catch (error) {
            this.$refs.Dialog.afterValidate()
            return
          }
        } else {
          this.$refs.Dialog.afterValidate()
          return false
        }
      })
    }
  }
}
</script>
