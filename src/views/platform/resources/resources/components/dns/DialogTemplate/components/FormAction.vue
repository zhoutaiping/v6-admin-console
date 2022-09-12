<template>
  <div>
    <el-form
      ref="Form"
      :model="form"
      :rules="formRules"
      label-position="top"
    >
      <el-form-item>
        <template slot="label">
          处置方式
        </template>
        <yd-form-radio
          v-model="form.do_type"
          :radios="Actions"
          @change="handleChangeType"
        />
      </el-form-item>
      <el-divider />
      <template v-if="formOptions.rules && formOptions.rules.length">
        <el-form-item v-if="formOptions.normal_list && formOptions.normal_list.data">
          <span style="width: 100px; display: inline-block; margin-right: 10px">模板</span>
          <DmSelect
            :selects="formOptions.normal_list.data"
            v-model="form.do.normal_list.data"
          />
        </el-form-item>
        <div style="font-size: 14px;font-weight:700; color: #606266; margin:0 0 15px;">
          恢复阈值：（条件之间为“与”逻辑）
        </div>
        <TableRules
          ref="TableRules"
          :rule-options="formOptions.rules"
          :filter-rule="['ip_usable', 'host_alive', 'net_level','ddos_attack_size','ddos_attack_freq']"
        />
      </template>
      <template v-if="form.do_type">
        <template v-if="form.do.contin_dispatch">
          <el-form-item>
            <el-checkbox
              v-model="form.do.contin_dispatch.data.confirm"
              true-label="yes"
              false-label="no"
            >连续调度限制</el-checkbox>
          </el-form-item>
          <template>
            <el-form-item>
              <span style="width: 100px; display: inline-block; margin-right: 10px">阈值</span>
              <InputTimeLimit
                v-model="form.do.theshold"
                :format-update="function (type, value) {return { option: type, data: {theshold: value}}}"
                :format-value="function (val) {return { type: val.option, value: val.data.theshold}}"
              />
              <span style="margin: 0 10px">内连续调度</span>
              <el-input-number
                v-model="form.do.again_limit.data.again_limit"
                :min="1"
                :max="3600"
                controls-position="right"
              />
              <span style="margin-left: 10px">次</span>
            </el-form-item>
            <el-form-item>
              <span style="width: 100px; display: inline-block; margin-right: 10px">限制策略</span>
              <DmSelect
                v-model="form.do.limit_strategy.option"
                :selects="formOptions.limit_strategy.option"
              />
            </el-form-item>
            <el-form-item>
              <span style="width: 100px; display: inline-block; margin-right: 10px">暂停</span>
              <InputTimeLimit
                v-model="form.do.limit_strategy.stop"
                :format-update="function (type, value) {return { option: type, data: {stop: value}}}"
                :format-value="function (val) {return { type: val.option, value: val.data.stop}}"
              />
            </el-form-item>

          </template>
        </template>
        <el-form-item
          v-if="['dispatch','stop','replace_ip', 'source', 'dispatch_newtpl'].includes(form.do_type)"
          label="恢复后处置方式"
        >

          <DmSelect
            v-model="form.do.recovery.option"
            :selects="formOptions.recovery.option"
            @change="changForm(form.do.recovery, form.do.recovery.option)"
          />
          <template v-if="formOptions.recovery[form.do.recovery.option]">
            <span style="font-size: 14px;font-weight: 700;color: #606266;margin: 0 5px">延迟</span>
            <template v-if="form.do.recovery.option && formOptions.recovery[form.do.recovery.option]&& formOptions.recovery[form.do.recovery.option].data && Object.keys(formOptions.recovery[form.do.recovery.option].data).length">
              <el-input-number
                v-model="form.do.recovery[form.do.recovery.option].data[Object.keys(form.do.recovery[form.do.recovery.option].data)[0]]"
                :min="0"
                style="width: 150px; margin: 0 5px"/>
            </template>
            <template v-if="formOptions.recovery[form.do.recovery.option].option && formOptions.recovery[form.do.recovery.option].option.length">
              <DmSelect
                v-model="form.do.recovery[form.do.recovery.option].option"
                :selects="formOptions.recovery[form.do.recovery.option].option"
                style="width: 100px;"/>
            </template>
          </template>
        </el-form-item>
      </template>
      <el-form-item label="备注">
        <el-input
          v-model="form.remark"
          style="width: 500px"
          type="textarea"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import wafMixins from '@/views/DevOps/Disp/mixins/waf'
// import Rules from '@/utils/verify'
import TableRules from './TableRules'
import InputTimeLimit from './InputTimeLimit'
import { mapState } from 'vuex'

export default {
  components: { TableRules, InputTimeLimit },

  // mixins: [wafMixins],

  data() {
    return {
      form: {
        do_type: '',
        do: {},
        remark: ''
      },
      formRules: {},
      formDefault: {
        do_type: '',
        do: {}
      },
      formOptions: {},
      formDo: {}
    }
  },
  computed: {
    ...mapState({
      Actions: state => state.disp.actions
    })
  },
  methods: {
    handleChangeType(val) {
      const item = this.Actions.find(_ => _.value === val)
      this.formOptions = item.formOptions || {}
      this.form.do = item.formDefault
    },

    changForm(from, formOptions_key) {
      if (this.formOptions.recovery[formOptions_key] && Object.keys(this.formOptions.recovery[formOptions_key].data).length) {
        this.form.do.recovery[formOptions_key] = {
          data: {},
          option: this.formOptions.recovery[formOptions_key].option[0].value
        }
        const key = Object.keys(this.formOptions.recovery[formOptions_key].data)[0]
        this.form.do.recovery[formOptions_key].data[key] = ''
      }
    },

    formatLoadRules(rules) {
      const list = []
      Object.keys(rules).forEach(rule_type => {
        const item = rules[rule_type]
        list.push({
          rule_type,
          ...item
        })
      })
      return list
    },

    restForm() {
      this.form.do_type = ''
      // this.form.remark = ''
      this.form.do = {}
    },

    setForm(form = {}) {
      const { do_type, do: doForm, remark } = form

      this.form.do_type = do_type
      this.form.remark = remark
      this.handleChangeType(do_type)
      this.$nextTick(() => {
        if (doForm.rules) {
          const rules = this.formatLoadRules(doForm.rules)
          this.$refs.TableRules.setList(rules)
        }
        this.form.do = doForm
      })
    },

    async getForm() {
      const form = this.form
      const data = {
        do_type: form.do_type,
        do: {
          ...form.do
        },
        remark: form.remark
      }

      if (this.$refs.TableRules) {
        const list = await this.$refs.TableRules.getList()
        const rules = {}
        list.forEach(item => {
          const { rule_type } = item
          rules[rule_type] = {
            logic: item.logic,
            data: item.data
          }
        })
        data.do.rules = rules
      }
      const req = JSON.parse(JSON.stringify(data))
      if (req.do && req.do.contin_dispatch) {
        req.do.contin_dispatch.data.confirm = this.fomartConfirmValue(req.do.contin_dispatch.data.confirm)
      }
      return req
    },

    fomartConfirmValue(type) {
      let val = ''
      switch (type) {
        case 'yes' :
          val = '1'
          break
        case 'no':
          val = '0'
          break
      }

      return val
    }
  }
}
</script>
