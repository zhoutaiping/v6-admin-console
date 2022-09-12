<template>
  <DmDialogDrawer
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    width="800px"
    title-label="规则"
    @submit="handleSubmit"
  >
    <DmAlert>
      1. 新增前请检测是否已有可用模版<br>
      2. 节点数量：节点数量非IP个数，当前按照机房来分布，原则上套餐等级越高应分配的节点数量越多
    </DmAlert>
    <el-form label-position="top">
      <el-form-item label="匹配条件">
        <TableRules
          ref="TableRules"
          :rule-options="NormalRules"
          :region-options="Region"
          :filter-rule="['ip_usable', 'host_use', 'net_level']"
        />
      </el-form-item>
    </el-form>
  </DmDialogDrawer>
</template>

<script>
import createDialog from '@/utils/createDialog'
import TableRules from './components/TableRules'
import FormAction from './components/FormAction'
import { mapState } from 'vuex'
function formatLoadRules(data) {
  const list = []
  Object.keys(data).forEach(rule_type => {
    list.push({
      rule_type,
      ...data[rule_type]
    })
  })
  return list
}

export default createDialog({
  components: { TableRules, FormAction },
  data() {
    return {
      id: '',
      mode: 'Create'
    }
  },
  computed: {
    ...mapState({
      Region: state => state.disp.region,
      NormalRules: state => state.disp.normalRules
    })
  },
  created() {
    this.$store.dispatch('fetchSettings', { type: 'normal' })
  },
  methods: {
    initOptions(form, options) {
      this.mode = form.id ? 'Edit' : 'Create'
      this.id = form.id ? form.id : ''
      if (this.mode === 'Edit') {
        const rules = formatLoadRules(form.rules)
        this.$refs.TableRules.setList(rules)
      } else {
        this.$refs.TableRules.setList([])
        this.$refs.TableRules.handleRowAdd()
      }
    },

    formatSendRules(list) {
      const form = {}
      list.forEach(item => {
        form[item.rule_type] = {
          logic: item.logic,
          data: item.data
        }
      })
      return form
    },

    async fetchSubmit() {
      const rules = await this.$refs.TableRules.getList()
      if (!rules.length) {
        this.$message.warning('至少添加一条规则')
        throw new Error()
      }

      const form = {
        template_id: this.$route.params.id,
        rules: this.formatSendRules(rules)
      }

      try {
        if (this.mode === 'Create') {
          delete form.id
          await this.InvokeAllApi.post('/fd/V4/dispatch.template.rule.save', form)
        } else {
          form.id = this.id
          await this.InvokeAllApi.post(`/fd/V4/dispatch.template.rule.save`, form)
        }
      } catch (e) {
        throw new Error()
      }
      this.Message('ACTION_SUCCESS')
    },

    async handleSubmit(form) {
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
