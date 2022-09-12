<template>
  <div>
    <el-dialog
      ref="dialog"
      :visible.sync="open"
      width="500px"
      title="编辑锁定"
    >
      <DmScroll>
        <el-form
          ref="Form"
          :model="form"
          :rules="rules"
          label-position="left"
          label-width="140px"
        >
          <el-form-item label="订单" prop="order_ids">
            {{ form.order_ids.join(',') }}
          </el-form-item>
        </el-form>

      </DmScroll>
      <span slot="footer" class="dialog-footer">
        <el-button
          :loading="openValidate"
          :disabled="openValidate"
          @click="e =>{
            form.lock = false
            fetchSubmit()
        }">解 锁</el-button>
        <el-button
          :loading="openValidate"
          :disabled="openValidate"
          type="primary"
          @click=" e=>{
            form.lock = true
            fetchSubmit()
          }
          ">锁 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      open: false,
      openValidate: false,
      form: {
        order_ids: [],
        lock: false
      },
      rules: {
        order_ids: [],
        lock: []
      },
      submitShow: true
    }
  },

  methods: {
    handleOpen(data = null, option = null) {
      this.$nextTick(() => {
        this.open = true
        if (this.$refs.Form) {
          this.$refs.Form.resetFields()
        }

        this.form.order_ids = data.map(i => { return Number(i.id) })
      })
    },

    fetchSubmit() {
      this.openValidate = true
      this.$refs.Form.validate((valid) => {
        if (valid) {
          let api = '/fd/V4/invoice.unlock.request'
          if (this.form.lock) {
            api = '/fd/V4/invoice.lock.request'
          }
          this.Fetch.post(api, { order_ids: this.form.order_ids }).then(res => {
            this.Message('ACTION_SUCCESS')
            this.$emit('init')
            this.open = false
            this.openValidate = false
          }).catch(e => {
            this.openValidate = false
          })
        } else {
          this.openValidate = false
        }
      })
    }
  }
}
</script>
