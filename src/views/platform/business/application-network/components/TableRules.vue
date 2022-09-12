<style lang="scss">
.RuleToolTip {
  border-color: $--color-text-secondary !important;
  border-radius: 0px;
  color: $--color-text-regular;
}

.SelectType {
  .el-select-dropdown__item.is-disabled {
    a {
      color: #ccc !important;
    }
  }
}
</style>

<template>
  <DmTable
    :add-button-disabled="disabledAdd"
    add-button
    border
    @click-add-button="handleRowAdd"
  >
    <template slot="btnAdd">
      <el-tooltip
        :disabled="!containUpstreamStatus"
        content="源响应状态码仅可作为条件组合的最后一个匹配类型"
        placement="top"
      >
        <span>
          <yd-icon name="el-icon-plus" /> 新增
        </span>
      </el-tooltip>
    </template>
    <el-table :data="list">
      <el-table-column
        label="匹配类型"
        min-width="160"
      >
        <template slot-scope="scope">
          <ColumnForm
            :ref="`type-${scope.$index}`"
            :model="scope.row"
            :item-rules="rules.type"
            prop="rule_type"
          >
            <el-select
              v-model="scope.row.rule_type"
              :disabled="scope.$index !== list.length - 1"
              placeholder="请选择"
              popper-class="SelectType"
              @change="val => handleTypeChange(val, scope)"
            >
              <el-option
                v-for="item in wafTypeSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              >
                <el-tooltip
                  :content="tipsMap[item.value]"
                  :visible-arrow="false"
                  :disabled="!tipsMap[item.value]"
                  effect="light "
                  placement="right"
                  popper-class="RuleToolTip"
                >
                  <a
                    :disabled="item.disabled"
                    type="text"
                    style="color: #606266; text-align: left; display: block"
                  >{{ item.label }}</a>
                </el-tooltip>
              </el-option>
            </el-select>
          </ColumnForm>
        </template>
      </el-table-column>
      <el-table-column
        label="逻辑 | 匹配目标"
        min-width="620"
      >
        <template slot-scope="scope">
          <ColumnForm
            v-if="['upstream_status', 'req_header_entry', 'args', 'post_args'].includes(scope.row.rule_type)"
            :model="scope.row"
            :item-rules="rulesPreMap[scope.row.rule_type]"
            prop="data.key"
            style="width: 150px; display: inline-block; margin-right: 12px;"
          >
            <template v-if="scope.row.rule_type === 'upstream_status'">
              <yd-form-select
                v-model="scope.row.data.status"
                :selects="wafSelects.upstream_status_statuses"
                allow-create
                filterable
                collapse-tags
                multiple
              />
            </template>
            <template v-else-if="['req_header_entry'].includes(scope.row.rule_type) ">
              <yd-form-select
                v-model="scope.row.data.key"
                :selects="selectHeader"
                placeholder="请输入参数名"
                allow-create
                filterable
              />
            </template>
            <template v-else-if="['args', 'post_args'].includes(scope.row.rule_type) ">
              <el-input
                v-model="scope.row.data.key"
                placeholder="请输入参数名"
              />
            </template>
          </ColumnForm>
          <!-- 选择逻辑 -->
          <!-- <yd-form-select
            v-model="scope.row.logic"
            :selects="wafLogicMap[scope.row.rule_type]"
            :disabled="wafLogicMap[scope.row.rule_type] && wafLogicMap[scope.row.rule_type].length === 1"
            style="width: 140px; margin-right: 12px; display: inline-block; vertical-align: top;"
            @change="val => handleLogicChange(val, scope)"
          /> -->
          <el-select
            v-model="scope.row.logic"
            :disabled="wafLogicMap[scope.row.rule_type] && wafLogicMap[scope.row.rule_type].length === 1"
            placeholder="请选择"
            style="width: 140px; margin-right: 12px; display: inline-block; vertical-align: top;"
            popper-class="SelectType"
            @change="val => handleLogicChange(val, scope)"
          >
            <el-option
              v-for="item in wafLogicMap[scope.row.rule_type]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            >
              <el-tooltip
                :content="logicTipsMap[item.value]"
                :visible-arrow="false"
                :disabled="!logicTipsMap[item.value]"
                effect="light "
                placement="right"
                popper-class="RuleToolTip"
              >
                <a
                  :disabled="item.disabled"
                  type="text"
                  style="color: #606266; text-align: left; display: block"
                >{{ item.label }}</a>
              </el-tooltip>
            </el-option>
          </el-select>

          <!-- 匹配目标 -->
          <ColumnForm
            :ref="`data-${scope.$index}`"
            :model="scope.row"
            :item-rules="rulesMap[scope.row.rule_type]"
            prop="data"
            style="width: 380px; display: inline-block; vertical-align: top;"
          >
            <!-- URL -->
            <template v-if="scope.row.rule_type === 'url'">
              <InputMultiple
                v-model="scope.row.data"
                placeholder="不需要带域名，以 “/” 开始"
              />
            </template>
            <!-- Referer -->
            <template v-if="scope.row.rule_type === 'referer'">
              <InputRulesCommonData
                :logic="scope.row.logic"
                v-model="scope.row.data"
                :ref="`InputRulesCommonData-${scope.$index}`"
                multiple
                placeholder="不填写指 Referer 为空（多个之间以'|'隔开'）"
              />
            </template>
            <!-- UserAgent -->
            <template v-if="scope.row.rule_type === 'user_agent'">
              <template v-if="['exist_garbled_code', 'not_garbled_code'].includes(scope.row.logic)">
                <el-input
                  disabled
                  placeholder="无需填写"
                />
              </template>
              <InputRulesCommonData
                v-else
                :logic="scope.row.logic"
                v-model="scope.row.data"
                :ref="`InputRulesCommonData-${scope.$index}`"
                multiple
                placeholder="eg. Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6)..."
              />
            </template>
            <!-- 查询字符串 -->
            <template v-if="scope.row.rule_type === 'querystring'">
              <InputRulesCommonData
                :logic="scope.row.logic"
                v-model="scope.row.data"
                :ref="`InputRulesCommonData-${scope.$index}`"
                multiple
                placeholder="请填写查询字符串，如 page=1234"
              />
            </template>
            <!-- 请求参数 -->
            <template v-if="scope.row.rule_type === 'args' || scope.row.rule_type === 'post_args'">
              <InputRulesCommonData
                :logic="scope.row.logic"
                v-model="scope.row.data.value"
                :ref="`InputRulesCommonData-${scope.$index}`"
                placeholder="参数值"
              />
            </template>
            <!-- 请求头 -->
            <template v-if="scope.row.rule_type === 'req_header_entry'">
              <InputRulesCommonData
                :logic="scope.row.logic"
                v-model="scope.row.data.value"
                :ref="`InputRulesCommonData-${scope.$index}`"
                :placeholder="HEADER_TIPS[scope.row.data.key] || '参数值'"
              />
            </template>
            <!-- 请求方法 -->
            <template v-if="scope.row.rule_type === 'req_method'">
              <yd-form-select
                :selects="wafSelects.req_method_methods"
                v-model="scope.row.data"
                style="width: 100%"
                multiple
              />
            </template>
            <!-- 请求协议 -->
            <template v-if="scope.row.rule_type === 'req_protocol'">
              <yd-form-select
                :selects="wafSelects.req_protocol_req_protocols"
                v-model="scope.row.data"
                style="width: 100%"
                multiple
              />
            </template>
            <!-- 请求类型 -->
            <template v-if="scope.row.rule_type === 'url_type'">
              <yd-form-select
                :selects="wafSelects.url_type_url_type_map"
                v-model="scope.row.data"
                style="width: 100%"
              />
            </template>
            <!-- IP类型 -->
            <template v-if="scope.row.rule_type === 'ip_type'">
              <yd-form-select
                :selects="wafSelects.ip_type_types"
                v-model="scope.row.data"
                style="width: 100%"
                multiple
              />
            </template>
            <!-- 设备类型 -->
            <template v-if="scope.row.rule_type === 'device_type'">
              <yd-form-select
                :selects="wafSelects.device_type_types"
                v-model="scope.row.data"
                style="width: 100%"
                multiple
              />
            </template>
            <!-- 后缀 -->
            <template v-if="scope.row.rule_type === 'postfix'">
              <InputSuffix v-model="scope.row.data" />
            </template>
            <!-- 请求时间 -->
            <template v-if="scope.row.rule_type === 'req_time'">
              <InputWeekTime v-model="scope.row.data" />
            </template>
            <!-- IP请求频率 || 单IP单URL请求频率 || 源响应状态码 -->
            <template v-if="['ip_rate_limit', 'ip_url_rate_limit', 'upstream_status'].includes(scope.row.rule_type)">
              <InputRuleLimit
                :ref="`rule-${scope.$index}`"
                v-model="scope.row.data"
              />
            </template>
            <!-- APP -->
            <!-- IP -->
            <template v-if="scope.row.rule_type === 'ip'">
              <!-- IP LIST -->
              <template v-if="['in', 'not_in'].includes(scope.row.logic)">
                <yd-form-select
                  v-model="scope.row.data"
                  :selects="watSelectIpList"
                  aria-placeholder="选择的IP列表"
                  multiple
                  collapse-tags
                  style="width: 280px; margin-right: 12px"
                />
              </template>
              <template v-else-if="['in_recent', 'not_in_recent'].includes(scope.row.logic)">
                <el-input disabled />
              </template>
              <InputMultiple
                v-else
                v-model="scope.row.data"
                placeholder="请输入IP，支持IPv4、IPv6、CIDR（如1.1.1.1/24）格式，当添加的IP数量比较多时，建议您在“用户中心 -> IP 列表”中添加并在精准访问控制中引用"
                placeholder-item="请输入IP，支持IPv4、IPv6、CIDR（如1.1.1.1/24）格式"
              >
                <span slot="tips">（多个 IP 推荐使用 CIDR 格式 1.1.1.1/24)</span>
                <span
                  v-if="scope.row.data.length > 20"
                  slot="footer"
                >
                  <div style="font-size: 12px">
                    当前输入框有个{{ scope.row.data.length }}个IP，建议您通过“用户中心 -> IP列表”来管理这些IP并在精准访问控制中使用它
                  </div>
                </span>
              </InputMultiple>
            </template>
            <!-- 来路域名 -->
            <template v-if="scope.row.rule_type === 'referer_domain' || scope.row.rule_type === 'domain'">
              <InputMultiple
                v-model="scope.row.data"
                placeholder="www.demo.com"
              />
            </template>
            <!-- 访客区域 -->
            <template v-if="scope.row.rule_type === 'region'">
              <InputArea v-model="scope.row.data" />
            </template>
            <!-- 设备指纹 -->
            <template v-if="scope.row.rule_type === 'fingerprint'">
              <InputMultiple
                v-model="scope.row.data"
                placeholder="设备指纹"
              />
            </template>
            <!-- 终端系统 -->
            <template v-if="scope.row.rule_type === 'device_os'">
              <yd-form-select
                :selects="wafSelects.deviceOS"
                v-model="scope.row.data"
                style="width: 100%"
                multiple
              />
            </template>
            <!-- 终端风险类型 -->
            <template v-if="scope.row.rule_type === 'device_risk'">
              <yd-form-select
                :selects="wafSelects.deviceRisk"
                v-model="scope.row.data"
                style="width: 100%"
                multiple
              />
            </template>
            <!-- 单设备请求频率 -->
            <template v-if="scope.row.rule_type === 'device_rate_limit'">
              <InputRuleLimit v-model="scope.row.data" />
            </template>
            <!-- CPU架构 -->
            <template v-if="scope.row.rule_type === 'cpu_arch'">
              <yd-form-select
                :selects="wafSelects.cpuArch"
                v-model="scope.row.data"
                style="width: 100%"
                multiple
              />
            </template>
            <!-- 设备名 -->
            <template v-if="scope.row.rule_type === 'device'">
              <InputMultiple
                v-model="scope.row.data"
                placeholder="设备名"
              />
            </template>
            <!-- 应用名称 -->
            <template v-if="scope.row.rule_type === 'app_name'">
              <InputMultiple
                v-model="scope.row.data"
                placeholder="应用名称"
              />
            </template>
            <!-- 应用签名 -->
            <template v-if="scope.row.rule_type === 'app_sign_hash'">
              <InputMultiple
                v-model="scope.row.data"
                placeholder="应用签名"
              />
            </template>
            <!-- 服务端口 -->
            <template v-else-if="scope.row.rule_type === 'server_port'">
              <yd-form-select
                :selects="selectPort"
                v-model="scope.row.data"
                multiple
                collapse-tags
                style="width: 280px"
              />
            </template>
          </ColumnForm>
        </template>
      </el-table-column>
      <el-table-column
        align="right"
        label="操作"
        width="80px"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleRowDelete(scope.$index)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </DmTable>
</template>

<script>
import consoleTable from '@/mixins/consoleTable'
import RULE from '@/utils/verify'
import ColumnForm from '@/components/Column/ColumnForm'
import InputArea from '@/components/Input/InputArea'
import InputSuffix from '@/components/Input/InputSuffix'
import InputRuleLimit from '@/components/Input/InputRuleLimit'
import InputWeekTime from '@/components/Input/InputWeekTime'
import InputMultiple from '@/components/Input/InputMultiple'
import wafMixins from '@/views/platform/business/mixins/waf'
import TipsTooltip from '@/components/Tips/TipsTooltip'
import InputRulesCommonData from './InputRulesCommonData'

function ipVaildate(rule, value, callback) {
  // if (typeof value === 'string') {
  //   value = [value]
  // } else {
  //   if (!value[0]) callback(new Error('请填写 IP'))
  // }

  // value.forEach(item => {
  //   if (!RULE.cidrREG.test(item) && !RULE.ipRangeReg.test(item)) {
  //     callback(new Error('IP 地址不正确'))
  //   }
  // })
  callback()
}

function refererVaildate(rule, value, callback) {
  if (typeof value === 'string') {
    value = [value]
  } else {
    if (!value[0]) callback(new Error('请填写'))
  }

  value.forEach(item => {
    if (!RULE.cidrREG.test(item) && !RULE.domainWithPan.test(item)) {
      callback(new Error('格式不正确'))
    }
  })
  callback()
}

function validateArr(rule, value, callback) {
  if (value.length === 0) {
    callback(new Error(' '))
  } else {
    callback()
  }
}

function validateRegion(rule, value, callback) {
  if (!value || typeof value !== 'object' || value.country.length === 0) {
    callback(new Error(' '))
  } else {
    callback()
  }
}

function validatorNumber(val, min, max) {
  val = parseInt(val)
  if (isNaN(val)) return false
  if (min <= val && val <= max) {
    return true
  } else {
    return false
  }
}

function validateLimit(rule, value, callback) {
  if (!value || (typeof value !== 'object')) {
    callback(new Error(' '))
  } else {
    const { interval, reqs } = value
    if (!validatorNumber(interval, 1, 20) || !validatorNumber(reqs, 1, 1000)) {
      callback(new Error(' '))
    }
    callback()
  }
}

export default {
  components: { ColumnForm, InputArea, InputRuleLimit, InputSuffix, InputWeekTime, InputMultiple, InputRulesCommonData, TipsTooltip },

  mixins: [consoleTable, wafMixins],

  props: {
    type: {
      type: String,
      default: 'plus'
    }
  },

  data() {
    return {
      selectPort: [],
      logicTipsMap: {
        in_recent: '近7日IP白名单是基于大数据行为分析技术统计出的正常访客IP集合，请谨慎评估使用'
      },
      tipsMap: {
        url: '请求的URL，不带域名，如请求 https://www.yundun.com/index.html?a=1&b=2，这里的 URL 为 /index.html?a=1&b=2',
        ip: '访问云安全节点的客户端IP，即 $remote_addr',
        referer: '当前访问是从哪个页面链接过来的，如 https://www.baidu.com/search?a=1',
        domain: '请求域名',
        referer_domain: 'Referer 中的域名，Referer 为 https://www.baidu.com/search?a=1，来路域名为 www.baidu.com',
        region: '访问云安全节点的请求方所在区域，支持大洲、大区、国家、省份设置',
        user_agent: '访问云安全节点的用户代理字符串',
        args: 'URL 中某个参数，比如 URL 为 http://www.yundun.com/?a=1&b=2, 可配置 a=1',
        post_args: '请求的 content-type 为 x-www-form-urlencoded 时，请求 Body 里的参数键值对 URL 查询字符串：请求 URL "?" 之后的部分，如 a=1&b=2',
        req_header_entry: 'HTTP 请求头部字段，可指定某一个字段（如 X-Forwarded-For、Cookie 等）设置策略',
        req_time: '访问云安全节点的请求发起时间',
        req_method: '访问云安全节点的请求方法，如 HEAD、GET、POST、PUT 等',
        req_protocol: '访问云安全节点的请求协议，如 http、https、websocket 等',
        device_type: '访问云安全节点的终端应用类型，如 QQ浏览器、微信浏览器、PC浏览器等',
        ip_type: '访问云安全节点的客户端IP的属性，如搜索引擎、合作伙伴、IDC、僵尸网络等',
        postfix: '请求 URL 的文件名后缀，如 jpg、png、css、php 等',
        server_port: '请求的云安全节点的服务器端口，如 80，443',
        ip_rate_limit: '客户端发出请求的频率',
        ip_url_rate_limit: '客户端发出单个 URL 的请求频率',
        upstream_status: '源服务器响应的请求状态码，如 403，404，405 等，还可填写自定义的状态码',
        querystring: '请求URL“？”之后的部分，如a=1&b=2',
        url_type: '请求资源类型，可选择静态或者动态'
      },
      rowKey: ['type', 'preData', 'data', 'InputRulesCommonData'],
      rules: {
        type: [{ required: true, trigger: 'blur', message: ' ' }]
      },
      rulesPreMap: {
        upstream_status: [{ validator: validateArr, trigger: 'blur' }],
        req_header_entry: [{ required: true, trigger: 'blur', message: ' ' }],
        args: [{ required: true, trigger: 'blur', message: ' ' }]
      },
      rulesMap: {
        url: [{ validator: validateArr, trigger: 'blur' }],
        domain: [],
        ip: [{ validator: ipVaildate, trigger: 'blur' }],
        referer_domain: [{ validator: refererVaildate, trigger: 'blur' }],
        region: [{ validator: validateRegion, trigger: 'blur' }],
        fingerprint: [{ validator: validateArr, trigger: 'blur' }],
        device_os: [{ validator: validateArr, trigger: 'blur' }],
        device_risk: [{ validator: validateArr, trigger: 'blur' }],
        device_rate_limit: [{ validator: validateLimit, trigger: 'blur' }],
        cpu_arch: [{ validator: validateArr, trigger: 'blur' }],
        device: [{ validator: validateArr, trigger: 'blur' }],
        app_name: [{ validator: validateArr, trigger: 'blur' }],
        app_sign_hash: [{ validator: validateArr, trigger: 'blur' }],
        postfix: [{ validator: validateArr, trigger: 'blur' }],
        ip_type: [{ validator: validateArr, trigger: 'blur' }],
        device_type: [{ validator: validateArr, trigger: 'blur' }],
        req_method: [{ validator: validateArr, trigger: 'blur' }],
        req_protocol: [{ validator: validateArr, trigger: 'blur' }],
        url_type: [{ required: true, trigger: 'blur', message: ' ' }]
      },
      row: {
        rule_type: '',
        logic: '',
        data: ''
      },
      HEADER_TIPS: {
        'X-Forwarded-For': '1.1.1.1,2.2.2.2',
        'Cookie': 'cfid:abcded'
      }
    }
  },

  computed: {
    disabledAdd() {
      const list = this.list
      return (list.length && list.length === 5) || this.containUpstreamStatus
    },

    containUpstreamStatus() {
      const list = this.list
      if (list.length) {
        const lastItem = list[list.length - 1]
        if (lastItem.rule_type === 'upstream_status') return true
        return false
      }
      return false
    },

    wafTypeSelect() {
      const REION_IP = ['region', 'ip']
      const wafDomainRules = this.type === 'ssl' ? this.wafSSLRules : this.wafDomainRules
      const selected = this.list.map(_ => _.rule_type)
      if (selected.some(val => REION_IP.includes(val))) selected.push(...REION_IP)
      wafDomainRules.forEach(_ => {
        _.disabled = selected.includes(_.value)
      })
      return wafDomainRules
    },

    selectHeader() {
      return Object.keys(this.HEADER_TIPS).map(_ => {
        return {
          label: _,
          value: _
        }
      })
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    init() {
      this.list = []
    },

    initValidate(domain) {
      const validateDomain = (rule, value, callback) => {
        if (typeof value === 'string') {
          value = [value]
        } else {
          if (!value[0]) callback(new Error('请填写'))
        }

        value.forEach(item => {
          if (!RULE.cidrREG.test(item) && !RULE.domainWithPan.test(item) || !item.includes(domain)) {
            callback(new Error('格式不正确'))
          }
        })
        callback()
      }
      this.rulesMap.domain = [{ validator: validateDomain, trigger: 'blur' }]
    },

    handleLogicChange(logic, scope) {
      const { row } = scope
      if (row.rule_type === 'ip') {
        scope.row.data = ''
      }
    },

    handleTypeChange(type, scope) {
      const { row, $index } = scope
      row.logic = this.wafLogicMap[type][0].value

      if (type === 'upstream_status') {
        row.data = {
          status: [],
          interval: 1,
          reqs: 1
        }
      } else if (type === 'args' || type === 'post_args' || type === 'req_header_entry') {
        row.data = {
          key: '',
          value: ''
        }
      } else {
        row.data = ''
      }
      this.$nextTick(() => {
        this.handleRowClearValidate($index)
      })
      this.updateActionType()
    },

    updateActionType() {
      const typeList = this.list.map(_ => _.rule_type)
      let actionType = ''
      if (typeList.includes('upstream_status')) { actionType = 'contain_upstream_status' }
      this.$emit('updateActionType', actionType)
    },

    async setList(list) {
      this.list = list
      this.updateActionType()
    },

    async getList() {
      try {
        await this.handleCheckList()
      } catch (e) {
        throw new Error()
      }
      return this.list
    }
  }
}
</script>
