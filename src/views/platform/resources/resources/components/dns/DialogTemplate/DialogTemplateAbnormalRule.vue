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
      1.相关IP替换调度：仅针对不符合要求的IP进行替换调度
      <br>
      2.处置动作优先级：按照客户等级优先处置及恢复，当恢复设有延时处置时按延时处置
      <br>
      3.IP替换调度优先级：同机房同IP段》同机房同ISP》同省份同ISP》同大区同ISP》相同ISP》其他，并生成对应线路
      <br>
      4.回源：仅针对使用了异常IP线路进行回源；
      <br>
      5.DDoS攻击大小：只要分配的节点有一个达到便匹配；
      <br>
      6.同时选择攻击大小和攻击频率时攻击频率指满足攻击大小的次数；
      <br>
      7.同时触发多条规则，按照最后一条触发规则设置的恢复条件进行恢复，<span style="color:#2991fa">回源和其他处置方式不能同时存在</span>；
    </DmAlert>
    <el-form label-position="top">
      <el-form-item label="匹配条件">
        <TableRules
          ref="TableRules"
          :rule-options="AbnormalRules"
          :filter-rule="['ip_usable', 'host_alive', 'net_level','ddos_attack_size','ddos_attack_freq']"
        />
      </el-form-item>
      <FormAction ref="FormAction" />
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

  created() {

  },
  computed: {
    ...mapState({
      Region: state => state.disp.region,
      AbnormalRules: state => state.disp.abnormalRules
    })
  },
  methods: {
    initOptions(form, options) {
      this.mode = form.id ? 'Edit' : 'Create'
      this.id = form.id ? form.id : ''
      if (this.mode === 'Edit') {
        this.$refs.TableRules.setList(formatLoadRules(form.rules))
        if (form.do && form.do.contin_dispatch) {
          form.do.contin_dispatch.data.confirm = form.do.contin_dispatch.data.confirm === '1' ? 'yes' : 'no'
        }
        this.$refs.FormAction.setForm(form)
      } else {
        this.$refs.FormAction.restForm()
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
        this.message.warning('至少添加一条规则')
        throw new Error()
      }
      if (rules.find(i => i.rule_type === '')) {
        this.message.warning('规则不能为空')
        throw new Error()
      }
      const FormActionData = await this.$refs.FormAction.getForm()
      const form = {
        template_id: this.$route.params.id,
        rules: this.formatSendRules(rules),
        ...FormActionData
      }
      try {
        if (this.mode === 'Create') {
          delete form.id
          await this.InvokeAllApi.post('/fd/V4/dispatch.abnormal.template.rule.save', form)
        } else {
          form.id = this.id
          const data = JSON.parse(JSON.stringify(form))
          if (Object.keys(data.do).length && data.do.rules && Object.keys(form.do.rules).length === 0) {
            delete data.do.rules
          }
          await this.InvokeAllApi.post(`/fd/V4/dispatch.abnormal.template.rule.save`, data)
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
