<template>
  <div>
    <el-card class="is-horizonta">
      <div
        slot="header"
        class="clearfix"
      >
        <span>HTTPS防护</span>
      </div>
      <div>
        <el-form
          ref="ssl_acl_form"
          :model="ssl_acl_form"
          :rules="rules"
        >
          <el-form-item prop="center_node_status">
            <DmSelect
              v-model="ssl_acl_form.mode"
              :selects="options.https_status"
              class="input-box"
              placeholder=" "
            />
          </el-form-item>
          <el-button
            type="primary"
            @click="handleSubmit('ssl_acl_form')"
          >保 存</el-button>
        </el-form>
      </div>
    </el-card>
    <el-card class="is-horizonta">
      <div
        slot="header"
        class="clearfix"
      >
        <span>AI引擎系统全局拦截分值配置</span>
      </div>
      <div>
        <DmAlert>
          此功能配合Web应用防火墙中AI引擎使用，默认AI引擎采用的是系统全局拦截分值，如需调整某一类型拦截分值，可以输入对应类型进行域名级调整，未输入的类型继续执行全局拦截分值；
          <br>
          1、控制台开关全局优先级最高，关闭后所有AI引擎策略均不生效；
          <br>
          2、一行一个，英文输入法“:”分割的kv对；
          <br>
          3、key表示AI引擎检测的类型如：xss、sql、webshell等，均为小些字母，输入大写将自动转为小写；
          <br>
          4、value表示攻击拦截分值，分值为0-1之间的浮点数，至少可精确到小数点后4位，输入“0”表示关闭该类型AI引擎检测；
          <br>
          举例：sql:0 表示关闭针对sql注入的AI引擎检测
          <br>
          ⚠️无改配置项即默认为关闭状态。
          <br>
          打开后，则过白时会继续执行waf检测，在检测到存在攻击时仅记录到日志中并触发告警，不做阻断动作。
        </DmAlert>
        <el-form
          ref="form_ai"
          :model="form_ai"
          :rules="rules"
        >
          <el-form-item prop="ai">
            <el-input
              v-model="form_ai.ai_boundary"
              :rows="4"
              type="textarea"
              placeholder="一行一个，英文输入法“:”分割的kv对"
            />
          </el-form-item>
          <el-button
            type="primary"
            @click="handleSubmit('form_ai')"
          >保 存</el-button>
        </el-form>
      </div>
    </el-card>
    <el-card class="is-horizonta">
      <div
        slot="header"
        class="clearfix"
      >
        <span>过白后继续执行WAF检测</span>
      </div>
      <div>
        <DmAlert>
          说明<br>
          无该配置时则默认为关闭状态。打开后，则过白时会继续执行WAF检测，在检测到存在攻击记录时仅记录到日志中并触发告警，不做阻断动作。
        </DmAlert>
        <el-form
          ref="white_check_status"
          :model="white_check_status"
          :rules="rules"
          label-width="120px"
          label-position="left"
        >
          <el-form-item
            label-width="0"
            prop="max_parses"
          >
            <el-checkbox
              v-model="white_check_status.white_check"
              :true-label="1"
              :false-label="0"
            >
              启用
            </el-checkbox>
          </el-form-item>
          <el-button
            type="primary"
            @click="handleSubmit('white_check_status')"
          >保 存</el-button>
        </el-form>
      </div>
    </el-card>
    <el-card class="is-horizonta">
      <div
        slot="header"
        class="clearfix"
      >
        <span>WAF最大参数解析次数配置</span>
      </div>
      <div>
        <DmAlert>
          当前WAF在检测时，出于性能等方面考量，在解析参数时，内部预置了最大参数解析次数，超出时则不做后续解析与检测，只会在日志中进行响应的标注。<br>
          目前对于请求中行中参数部分、body参数部分的最大解析次数默认限定为105次。针对单个域名可以进行按需配置
        </DmAlert>
        <el-form
          ref="cloud_waf_form"
          :model="cloud_waf_form"
          :rules="rules"
          label-width="120px"
          label-position="left"
        >
          <el-form-item
            label="最大解析次数"
            prop="max_parses"
          >
            <el-input-number
              v-model="cloud_waf_form.max_times"
              :precision="0"
              :min="0"
              :controls="false"
              class="input-box"
            />
          </el-form-item>
          <el-form-item
            label="超出后处置动作"
            prop="action"
          >
            <DmSelect
              v-model="cloud_waf_form.action"
              :selects="options.waf_action"
              class="input-box"
              placeholder=" "
            />
          </el-form-item>
          <el-button
            type="primary"
            @click="handleSubmit('cloud_waf_form')"
          >保 存</el-button>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import mixins from './mixins'
export default {
  mixins: [mixins],
  data() {
    return {
      ssl_acl_form: {},
      form_ai: {
        ai_boundary: ''
      },
      cloud_waf_form: {},
      white_check_status: {},
      rules: { // { required: true, message: ' ' }
        status: [],
        ai: [],
        max_parses: [],
        action: [],
        white_check: []
      },
      options: {
        https_status: [
          { label: 'OFF', value: 'off' },
          { label: '默认', value: 'default' },
          { label: '自定义', value: 'custom' }
        ],
        waf_action: [
          { label: '观察并记录', value: 'watch' },
          { label: '阻断', value: 'block' }
        ]
      },
      group: 'cloud_waf,ssl_acl'
    }
  },

  methods: {
    initOption(data) {
      const web_domain = data || this.web_domain
      if (web_domain && web_domain.ssl_acl) {
        this.ssl_acl_form = this.initForm({ ...this.default_form.ssl_acl }, { ...web_domain.ssl_acl })
      }
      if (web_domain && web_domain.cloud_waf) {
        this.white_check_status = this.initForm({ ...this.default_form.white_check_status }, { ...web_domain.cloud_waf })
      }
      if (web_domain && web_domain.cloud_waf) {
        this.cloud_waf_form = this.initForm({ ...this.default_form.cloud_waf }, { ...web_domain.cloud_waf })
        this.form_ai = {
          ai_boundary: web_domain.cloud_waf.ai_boundary
        }
      }
    },

    handleSubmit(form = '') {
      switch (form) {
        case 'ssl_acl_form':
          this.Submit({ ssl_acl: { ...this[form] }})
          break
        case 'cloud_waf_form':
          this.Submit({ cloud_waf: { ...this[form] }})
          break
        case 'form_ai':
          this.Submit({ cloud_waf: { ai_boundary: this.form_ai.ai_boundary }})
          break
        case 'white_check_status':
          this.Submit({ cloud_waf: { ...this[form] }})
          break
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.el-input__inner {
  text-align: left;
}
.item-box {
  display: inline-block;
  width: 400px;
  margin-bottom: 5px;
}
.box-card {
  margin: 0 0 10px;
}
.input-box {
  width: 200px;
}
.is-horizonta {
  display: flex;
  margin-bottom: 16px;
  /deep/.el-card__header {
    flex: 0 0 180px;
    padding-right: 24px;
  }
  /deep/.el-card__body {
    flex: 1;
    overflow: hidden;
    clear: both;
    height: 100%;
  }
}
</style>
