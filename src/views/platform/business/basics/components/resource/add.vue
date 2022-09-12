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
    title="新增资源"
    width="600px"
  >
    <div>
      <DmAlert>
        新增资源组
      </DmAlert>
      <el-form ref="Form" :model="form" :rules="rules" label-position="left" label-width="120px">
        <el-form-item label="资源名称" prop="name">
          <el-input v-model="form.name" class="input-box" />
        </el-form-item>
        <el-form-item label="用户ID" prop="member_id">
          <el-input v-model="form.member_id" class="input-box" />
        </el-form-item>
        <el-form-item label="服务类型" prop="service_type">
          <DmSelect
            v-model="form.service_type"
            :selects="options.service_type"
            class="input-box"
            placeholder=" "
          />
        </el-form-item>
        <el-form-item label="节点类型" prop="node_type">
          <DmSelect
            v-model="form.node_type"
            :selects="options.node_type"
            class="input-box"
            placeholder=" "
          />
        </el-form-item>
        <el-form-item label="节点数量" prop="node_limit">
          <el-input-number :precision="0" :controls="false" v-model="form.node_limit" class="input-box" />
        </el-form-item>
        <el-form-item label="开通时间" prop="start_time">
          <el-date-picker
            v-model="date"
            :default-time="['00:00:00', '23:59:59']"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="到期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            class="input-box"
            @change="e =>{
              form.start_time = ''
              form.expire_time = ''
              if(e) {
                form.start_time = e && e[0] || ''
                form.expire_time = e && e[1] || ''
              }
            }"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" :rows="4" type="textarea" class="input-box" />
        </el-form-item>
      </el-form>
    </div>
  </DmDialog>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      open: false,
      date: '',
      form: {
        name: '',
        member_id: '88588',
        service_type: '',
        node_type: '',
        node_limit: 30,
        start_time: '',
        expire_time: '',
        remark: ''
      },
      rules: {
        name: [{ required: true, message: ' ' }],
        member_id: [{ required: true, message: ' ' }],
        service_type: [{ required: true, message: ' ' }],
        node_type: [{ required: true, message: ' ' }],
        node_limit: [{ required: true, message: ' ' }],
        start_time: [{ required: true, message: ' ' }],
        expire_time: [{ required: true, message: ' ' }],
        remark: [{ required: true, message: ' ' }]
      },
      options: {
        service_type: [
          { label: '免费服务', value: 'fee' },
          { label: '付费服务', value: 'nofee' }
        ],
        node_type: []
      }
    }
  },
  computed: {
    ...mapState({
      node_type: state => state.disp.node_type
    })
  },
  watch: {
    node_type: {
      handler(val) {
        this.options.node_type = this.node_type
      }
    }
  },
  mounted() {
    this.options.node_type = this.node_type
  },

  methods: {
    handleOpen(data, option) {
      this.$nextTick(() => {
        this.$refs.Dialog.handleOpen()
        this.date = ''
        this.$refs.Form && this.$refs.Form.resetFields()
      })
    },

    handleSubmit() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          this.Fetch.post('/fd/V4/disp.ippool.add', { ...this.form }).then(res => {
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
