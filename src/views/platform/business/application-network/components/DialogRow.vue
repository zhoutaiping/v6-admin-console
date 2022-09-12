<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    width="1050px"
    aside
    title-label="规则"
    append-to-body
    @submit="handleSubmit"
  >
    <DmAlert>
      <ol>
        <li class="num-item">
          <p>同一条规则中多个匹配条件为 “与” 逻辑，即必须多个条件同时满足才算匹配中规则。</p>
        </li>
        <li class="num-item">
          <p>匹配目标具有多个时，用 “|” 隔开。</p>
        </li>
        <li class="num-item">
          <p>同一条规则最多 5个 匹配条件组合</p>
        </li>
        <li class="num-item">
          <p>涉及字符串匹配时，字符串不区分大小写</p>
        </li>
      </ol>
    </DmAlert>
    <el-form label-position="top">
      <el-form-item label="匹配条件">
        <TableRules
          ref="TableRules"
          :type="type"
          @updateActionType="handleUpdateActionType"
        />
      </el-form-item>
    </el-form>
    <FormAction
      ref="FormAction"
      :waf-type="type"
      :type="formActionType"
    />
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import wafMixin from '@/views/platform/business/mixins/waf'
import TableRules from './TableRules'
import FormAction from './FormAction'

export default createDialog({
  components: { TableRules, FormAction },

  mixins: [wafMixin],

  props: {
    type: {
      type: String,
      default: 'plus'
    },
    group_id: {
      type: String,
      default: ''
    },
    onlySubmit: Boolean // 只提交，用于批量配置模板
  },

  data() {
    return {
      id: '',
      mode: 'Create',
      formActionType: '',
      formDefault: {
        remark: '',
        action: 'watch'
      }
    }
  },

  methods: {
    handleUpdateActionType(value) {
      this.formActionType = value
    },

    initOptions(form, options) {
      this.mode = form.id ? 'Edit' : 'Create'
      if (this.mode === 'Edit') {
        this.id = form.id
        this.$refs.TableRules.setList(this.formatLoadRules(form.rules))
        this.$refs.FormAction.setForm(form)
      } else {
        this.id = ''
        this.$refs.TableRules.setList([])
        this.$refs.FormAction.setForm(form)
        this.$refs.TableRules.handleRowAdd()
      }
    },

    async fetchSubmit() {
      const rules = await this.$refs.TableRules.getList()
      if (rules.length === 0) {
        this.$message.warning('至少添加一条规则')
        throw new Error()
      }
      const formAction = await this.$refs.FormAction.getForm()
      const form = {
        ...formAction,
        remark: this.form.remark,
        group_id: this.group_id,
        rules: this.formatSendRules(rules),
        type: this.type
      }

      if (this.onlySubmit) {
        form.id = this.id
        this.$emit('submit', form)
      } else {
        try {
          if (this.mode === 'Create') {
            delete form.id
            await this.Fetch.post('/fd/V4/firewall.policy.tpl.save', form)
          } else {
            form.id = this.id
            await this.Fetch.post(`/fd/V4/firewall.policy.tpl.save`, form)
          }
        } catch (e) {
          throw new Error()
        }
        this.Message('ACTION_SUCCESS')
      }
    },

    async handleSubmit(form) {
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
