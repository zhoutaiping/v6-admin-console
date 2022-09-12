<style lang="scss" scoped>
.input-box {
  width: 300px;
}
</style>
<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="handleSubmit"
    title="手动添加解析线路"
    width="600px"
  >
    <div>
      <DmAlert>
        IP/CNAME为服务节点列表中IP或CNAME
      </DmAlert>
      <el-form ref="Form" :model="form" :rules="rules" label-position="left" label-width="120px">
        <el-form-item label="IP/CNAME" prop="ip">
          <DmSelect
            v-model="form.ip"
            :selects="options.policy_ip"
            :filterable="true"
            placeholder=" "
            class="input-box"
          />
        </el-form-item>
        <el-form-item label="解析线路" prop="line_id">
          <ElTreeSelect
            ref="treeSelect"
            v-model="form.line_id"
            :select-params="options.selectParams"
            :tree-params="options.treeParams"
            :styles="{'width':'300px'}"
            @searchFun="searchFun"
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
      form: {
        ip: '',
        remark: '',
        line_id: ''
      },
      rules: {
        ip: [{ required: true, message: ' ' }],
        line_id: [{ required: true, message: ' ' }],
        remark: []
      },

      options: {
        line: [],
        policy_ip: [],
        ip: [],
        remark: [],
        selectParams: {
          multiple: false,
          clearable: true,
          placeholder: '请选择线路'
        },
        treeParams: {
          clickParent: true,
          filterable: true,
          'check-strictly': true,
          'default-expand-all': true,
          'expand-on-click-node': false,
          data: [],
          props: {
            children: 'Children',
            label: 'label',
            value: 'value'
          }
        }
      }
    }
  },
  computed: {
    ...mapState({
      line: state => state.disp.line,
      policy_ip: state => state.disp.policy_ip
    })
  },
  watch: {
    line: {
      deep: true,
      handler(val) {
        if (this.line && this.line.length) {
          this.options.treeParams.data = this.line
        }
      }
    },
    policy_ip: {
      deep: true,
      handler(val) {
        this.options.policy_ip = this.policy_ip.map(i => { return { label: i, value: i } })
      }
    }
  },
  created() {
    this.options.policy_ip = this.policy_ip.map(i => { return { label: i, value: i } })
  },
  methods: {
    handleOpen(data, option) {
      this.$store.dispatch('featchPolicyIp', { disp_group_id: this.$route.params.id, page: 1, pagesize: 9999 })
      this.$nextTick(() => {
        this.$refs.Dialog.handleOpen()
        this.options.treeParams.data = this.line

        if (this.$refs.Form) {
          this.$refs.Form.resetFields()
        }
      })
    },

    searchFun(val) {
      if (this.$refs.treeSelect) {
        this.$refs.treeSelect.filterFun(val)
      }
    },

    handleSubmit() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          const params = {
            btype: 'generateDNSLine',
            bid: this.$route.params.id,
            ...this.form
          }
          this.FetchDisp.post('/disp/record/save', params).then(res => {
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
