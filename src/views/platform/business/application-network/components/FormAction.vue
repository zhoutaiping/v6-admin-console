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
        <yd-form-radio-button
          v-model="form.action"
          :radios="actionFilter(type)"
        />
      </el-form-item>
      <el-divider />
      <!-- 通用 -->
      <el-form-item v-if="form.action === 'anticc'">
        <yd-form-radio
          v-model="form.action_data.level"
          :radios="wafSelects.actionLebelType"
        />
      </el-form-item>
      <!-- 封禁 -->
      <el-form-item v-if="form.action === 'block'">
        <el-form-item
          v-if="form.action_data.time_unit === 'second'"
          style="display: inline-block;"
        >
          <el-input-number
            v-model="form.action_data.interval"
            :min="1"
            :max="3600"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item
          v-if="form.action_data.time_unit === 'minute'"
          style="display: inline-block;"
        >
          <el-input-number
            v-model="form.action_data.interval"
            :min="1"
            :max="60"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item
          v-if="form.action_data.time_unit === 'hour'"
          style="display: inline-block;"
        >
          <el-input-number
            v-model="form.action_data.interval"
            :min="1"
            :max="24"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item
          v-if="form.action_data.time_unit === 'day'"
          style="display: inline-block;"
        >
          <el-input-number
            v-model="form.action_data.interval"
            :min="1"
            :max="7"
            controls-position="right"
          />
        </el-form-item>
        <yd-form-select
          v-model="form.action_data.time_unit"
          :selects="wafSelects.timeType"
          style="margin-left: 12px; width: 80px"
        />
      </el-form-item>
      <!-- 加白 -->
      <el-form-item v-if="form.action === 'white'">
        <el-form-item label="有效期">
          <el-form-item style="display: inline-block;">
            <el-input-number
              v-model="form.action_data.interval"
              :min="1"
              :max="3600"
              controls-position="right"
            />
          </el-form-item>
          <yd-form-select
            :selects="[
              {
                label: '秒'
              }
            ]"
            style="margin-left: 12px; width: 80px"
          />
        </el-form-item>
        <template v-if="wafType !== 'ssl'">
          <el-form-item label="继续执行">
            <el-checkbox
              v-model="form.action_data.waf"
              :true-label="1"
              :false-label="0"
            >漏洞攻击防护</el-checkbox>
          </el-form-item>
        </template>
      </el-form-item>
      <!-- 放行 -->
      <el-form-item
        v-if="form.action === 'pass'"
        label="放行后继续执行"
      >
        <el-checkbox
          v-model="form.action_data.next_rules"
          :true-label="1"
          :false-label="0"
        >下一规则集</el-checkbox>
        <el-checkbox
          v-model="form.action_data.cc"
          :true-label="1"
          :false-label="0"
        >CC防护</el-checkbox>
        <el-checkbox
          v-model="form.action_data.waf"
          :true-label="1"
          :false-label="0"
        >漏洞攻击防护</el-checkbox>
      </el-form-item>
      <!-- 人机验证 -->
      <template v-else-if="form.action === 'verification'">
        <el-form-item label="验证类型">
          <yd-form-radio
            v-model="form.action_data.type"
            :radios="wafSelects.verificationType"
          />
        </el-form-item>
        <el-form-item label="继续执行">
          <el-checkbox
            v-model="form.action_data.next_rules"
            :true-label="1"
            :false-label="0"
          >下一规则集</el-checkbox>
          <el-checkbox
            v-model="form.action_data.cc"
            :true-label="1"
            :false-label="0"
          >CC防护</el-checkbox>
          <el-checkbox
            v-model="form.action_data.waf"
            :true-label="1"
            :false-label="0"
          >漏洞攻击防护</el-checkbox>
        </el-form-item>
      </template>
      <!-- 观察 -->
      <template v-else-if="form.action === 'watch'">
        <el-form-item label="继续执行">
          <el-checkbox
            v-model="form.action_data.next_rules"
            :true-label="1"
            :false-label="0"
          >下一规则集</el-checkbox>
        </el-form-item>
      </template>
      <!-- 蜜网牵引 -->
      <template v-else-if="form.action === 'web_pot'">
        <el-form-item
          label="蜜网服务器"
          prop="action_data.ip"
        >
          <el-input
            v-model="form.action_data.ip"
            style="width: 250px"
            placeholder="0.0.0.0"
          >
            <yd-form-select
              slot="prepend"
              v-model="form.action_data.protocol"
              :selects="wafSelects.protocol"
              style="width: 80px"
            />
          </el-input>
          ：
          <el-input
            v-model="form.action_data.port"
            placeholder="端口"
            style="width: 100px"
          />
        </el-form-item>
        <el-form-item label="继续执行">
          <el-checkbox
            v-model="form.action_data.next_rules"
            :true-label="1"
            :false-label="0"
          >下一规则集</el-checkbox>
          <el-checkbox
            v-model="form.action_data.cc"
            :true-label="1"
            :false-label="0"
          >CC防护</el-checkbox>
          <el-checkbox
            v-model="form.action_data.waf"
            :true-label="1"
            :false-label="0"
          >漏洞攻击保护</el-checkbox>
        </el-form-item>
      </template>
      <!-- 重定向 -->
      <template v-if="form.action === 'redirect'">
        <el-form-item
          :rules="formRules.action_data.redirect_url"
          prop="action_data.redirect_url"
          label="重定向URL"
        >
          <el-input
            v-model="form.action_data.redirect_url"
            style="width: 280px"
            placeholder="http(s)://www.demo.com"
          />
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
import wafMixins from '@/views/platform/business/mixins/waf'
import Rules from '@/utils/verify'
import SelectGroup from './components/SelectGroup'
import deepmerge from 'deepmerge'

export default {
  components: { SelectGroup },

  mixins: [wafMixins],

  props: {
    type: String,
    wafType: String
  },

  data() {
    return {
      form: {},
      formRules: {
        action_data: {
          ip: [
            {
              required: true,
              type: 'string',
              pattern: Rules.ipReg,
              message: 'IP不正确'
            }
          ],
          redirect_url: {
            required: true,
            type: 'string',
            pattern: Rules.defaultUrl,
            message: '格式有误'
          }
        }
      },
      formDefault: {
        action: 'anticc',
        action_data: {
          level: 'default',
          time_unit: 'second',
          intval: '',
          interval: '',
          type: 'cookie',
          ip: '',
          port: '',
          protocol: 'http',
          waf: 0,
          cc: 0,
          next_rules: 0,
          redirect_url: '',
          group_ids: []
        }
      }
    }
  },

  created() {
    this.setForm()
  },

  methods: {
    actionFilter(type) {
      if (this.wafType === 'ssl') {
        const filter = ['block', 'white', 'deny']
        return this.wafSelects.actionType.filter(_ => filter.includes(_.value))
      } else {
        if (type === 'bot') {
          return this.wafSelects.actionBotType
        } else if (type === 'contain_upstream_status') {
          const filter = ['block', 'watch']
          if (!filter.includes(this.form.action)) this.form.action = filter[0]
          return this.wafSelects.actionType.filter(_ => filter.includes(_.value))
        } else {
          return this.wafSelects.actionType
        }
      }
    },

    setForm(form = {}) {
      this.$nextTick(() => {
        this.$refs.Form.clearValidate()
      })
      this.form = deepmerge(this.formDefault, form)
    },

    getForm() {
      const form = this.form
      const { action } = form

      let action_data = {}
      if (action === 'anticc') {
        action_data = {
          level: form.action_data.level
        }
      } else if (action === 'block') {
        action_data = {
          time_unit: form.action_data.time_unit,
          interval: form.action_data.interval
        }
      } else if (action === 'pass') {
        action_data = {
          next_rules: form.action_data.next_rules,
          cc: form.action_data.cc,
          waf: form.action_data.waf
        }
      } else if (action === 'verification') {
        action_data = {
          next_rules: form.action_data.next_rules,
          cc: form.action_data.cc,
          waf: form.action_data.waf,
          type: form.action_data.type
        }
      } else if (action === 'watch') {
        action_data = {
          next_rules: form.action_data.next_rules
        }
      } else if (action === 'web_pot') {
        action_data = {
          ip: form.action_data.ip,
          protocol: form.action_data.protocol,
          port: form.action_data.port,
          next_rules: form.action_data.next_rules,
          cc: form.action_data.cc,
          waf: form.action_data.waf
        }
      } else if (action === 'redirect') {
        action_data = {
          redirect_url: form.action_data.redirect_url
        }
      } else if (action === 'white') {
        action_data = {
          interval: form.action_data.interval,
          waf: form.action_data.waf,
          group_ids: form.action_data.group_ids
        }
      }

      this.$refs.Form.validate(valid => {
        if (!valid) throw new Error()
      })
      return { action, action_data }
    }
  }
}
</script>
