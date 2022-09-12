<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    title="用户配置"
    width="700px"
    @submit="handleSubmit"
  >
    <el-form
      v-loading="loading"
      ref="form"
      :model="form"
      label-position="left"
      label-width="200px"
    >
      <DmCardPanel :title="'限制账户多地登录'">
        <el-form-item
          v-if="form.login_only_allow_single_client"
          label="限制多地登陆"
        >
          <el-switch
            v-model="form.login_only_allow_single_client.status"
            active-value="1"
            inactive-value="0"
            @change="fetchChangeLoginLimitset"
          />
        </el-form-item>
      </DmCardPanel>
      <template v-if="form.limit_speed_clean_cache">
        <DmCardPanel :title="'清理缓存限速'">
          <el-form-item label="清理缓存限速">
            <el-switch
              v-model="form.limit_speed_clean_cache.status"
              active-value="on"
              inactive-value="off"
            />
          </el-form-item>
          <el-form-item label="单日清理URL总数">
            <el-input-number
              v-model="form.limit_speed_clean_cache.url_max"
              :step="50"
              :min="2000"
              :max="1000000"
              class="input-box"
            />
          </el-form-item>
          <el-form-item label="单日清理站点总数">
            <el-input-number
              v-model="form.limit_speed_clean_cache.site_max"
              :step="50"
              :min="500"
              :max="1000000"
              class="input-box"
            />
          </el-form-item>
          <el-form-item label="单日清理目录总数">
            <el-input-number
              v-model="form.limit_speed_clean_cache.dir_max"
              :step="50"
              :min="500"
              :max="1000000"
              class="input-box"
            />
          </el-form-item>
        </DmCardPanel>
      </template>
      <template v-if="form.limit_cache_preheat">
        <DmCardPanel :title="'缓存预热'">
          <el-form-item label="缓存预热">
            <el-switch
              v-model="form.limit_cache_preheat.status"
              active-value="on"
              inactive-value="off"
            />
          </el-form-item>
          <el-form-item label="单日缓存预热url总数">
            <el-input-number
              v-model="form.limit_cache_preheat.url_max"
              :step="50"
              :min="2000"
              :max="1000000"
              class="input-box"
            />
          </el-form-item>
        </DmCardPanel>
      </template>
      <template v-if="form.domain_config_switch">
        <DmCardPanel :title="'WEB安全加速'">
          <el-form-item label="体验版支持WAF拦截模式">
            <el-switch
              v-model="form.domain_config_switch.free_user_use_waf_block"
              active-value="on"
              inactive-value="off"
            />
          </el-form-item>
          <template v-if="form.domain">
            <el-form-item>
              <span slot="label">可添加域名数量
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="域名数量限制为能够添加至Web安全加速的域名数量，而非域名包限制"
                  placement="top"
                >
                  <i class="color--primary el-icon-warning" />
                </el-tooltip>
              </span>
              <el-input-number
                v-model="form.domain.domain_num"
                :step="1"
                :min="0"
                class="input-box"
              />
            </el-form-item>
          </template>
          <template v-if="form.mirr">
            <el-form-item label="网站快照爬取限制">
              <el-input-number
                v-model="form.mirr.scan_depth"
                :precision="0"
                :min="5"
                :max="10"
                class="input-box"
              />
              &ensp;层或&ensp;
              <el-input-number
                v-model="form.mirr.max_count"
                :precision="0"
                :min="2000"
                :max="10000"
                class="input-box"
              />
              &ensp;个页面
            </el-form-item>
          </template>
          <template v-if="form.back_source_lan_ip">
            <el-form-item label="回源支持局域网IP">
              <el-switch
                v-model="form.back_source_lan_ip.status"
                active-value="on"
                inactive-value="off"
              />
            </el-form-item>
            <el-form-item label="">
              <el-input
                v-model="form.back_source_lan_ip.ips"
                type="textarea"
                placeholder="请输入需要支持的局域网P信息,多个用“;” 分割"
              />
            </el-form-item>
          </template>
        </DmCardPanel>
      </template>
      <template v-if="form.replace_mirror_notice">
        <DmCardPanel :title="'网站快照抓取失败告警'">
          <el-form-item label="开启">
            <el-switch
              v-model="form.replace_mirror_notice.status"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
          <el-form-item label="响应5XX/4XX/3XX状态码超过">
            <el-input-number
              v-model="form.replace_mirror_notice.abnormal_rate"
              :step="1"
              :min="0"
              :max="100"
              :controls="false"
              :precision="0"
            /> %
          </el-form-item>
        </DmCardPanel>
      </template>
      <template v-if="form.subacl">
        <DmCardPanel :title="'权限控制'">
          <el-form-item label="权限管理">
            <el-switch
              v-model="form.subacl.status"
              active-value="on"
              inactive-value="off"
            />
          </el-form-item>
        </DmCardPanel>
      </template>
      <template v-if="form.oplog">
        <DmCardPanel :title="'运营操作日志'">
          <el-form-item label="展示运营操作日志">
            <el-switch
              v-model="form.oplog.user_see_admin_oplog"
              active-value="on"
              inactive-value="off"
            />
          </el-form-item>
        </DmCardPanel>
      </template>
      <template v-if="form.soc_log_download">
        <DmCardPanel :title="'SOC运营'">
          <el-form-item label="SOC日志下载">
            <el-switch
              v-model="form.soc_log_download.status"
              active-value="on"
              inactive-value="off"
            />
          </el-form-item>
        </DmCardPanel>
      </template>
      <template v-if="form.gateway">
        <DmCardPanel :title="'Gateway'">
          <el-form-item label="Gateway">
            <el-switch
              v-model="form.gateway.status"
              active-value="on"
              inactive-value="off"
            />
          </el-form-item>
        </DmCardPanel>
      </template>
      <template v-if="form.zero_trust">
        <DmCardPanel :title="'零信任'">
          <FormZeroTrust ref="FormZeroTrust" />
        </DmCardPanel>
      </template>
      <template v-if="form.nonstandard_port">
        <DmCardPanel :title="'允许用户开启非标端口'">
          <el-form-item label="非标端口">
            <el-switch
              v-model="form.nonstandard_port.status"
              active-value="on"
              inactive-value="off"
            />
          </el-form-item>
        </DmCardPanel>
      </template>
      <template v-if="form.oem_domain_check">
        <DmCardPanel :title="'OEM域名审核'">
          <el-form-item label="OEM域名">
            <el-switch
              v-model="form.oem_domain_check.status"
              active-value="on"
              inactive-value="off"
            />
          </el-form-item>
          <el-form-item label="标签">
            <el-input
              v-model="form.oem_domain_check.label"
              type="textarea"
              placeholder="请输入标签,标签必须在系统中已创建,多个用“，” 分割"
            />
            <span class="color--primary">标签必须在系统中已创建,多个用“，” 分割</span>
          </el-form-item>
        </DmCardPanel>
      </template>

    </el-form>
  </DmDialog>
</template>
<script>
import createDialog from '@/utils/createDialog'
import FormZeroTrust from './components/FormZeroTrust'

export default createDialog({
  components: { FormZeroTrust },
  props: {
    btype: {
      type: String,
      default: 'Domain'
    }
  },

  data() {
    return {
      loading: true,

      API: {
        'SET': '/V4/member.setting.loginlimitset'
      },
      uid: '',
      formDefault: {
        login_only_allow_single_client: {
          status: '1'
        },
        limit_speed_clean_cache: {
          status: 'on',
          url_max: 2100,
          dir_max: 500,
          site_max: 500
        },
        limit_cache_preheat: {
          status: 'on',
          url_max: 2000
        },
        domain_config_switch: {
          free_user_use_waf_block: 'off'
        },
        oplog: {
          user_see_admin_oplog: 'off'
        },
        domain: {
          domain_num: 0
        },
        subacl: {
          status: 'off'
        },
        soc_log_download: {
          status: 'off'
        },
        gateway: {
          status: 'off'
        },
        zero_trust: {
          status: 'off',
          // prefix: '',
          suffix: ''
        },

        nonstandard_port: {
          status: 'off'
        },
        mirr: {
          scan_depth: 5,
          max_count: 2000
        },
        oem_domain_check: {
          status: 'off',
          label: ''
        },
        back_source_lan_ip: {
          status: 'off',
          ips: ''
        },
        replace_mirror_notice: {
          status: 1,
          abnormal_rate: 0
        }
      },
      suffix: [],
      is_suffix: false
    }
  },

  methods: {
    initOptions(form) {
      this.uid = form.id
      this.is_suffix = false
      this.fetchSettings()
      this.$refs.FormZeroTrust.fetchData(form)
    },

    fetchSettings() {
      this.getSetting()
      this.getCacheSetting()
      this.getSSOSuffixList()
    },

    async getSetting() {
      try {
        const data = await this.InvokeAllApi.get('/V4/member.setting.get', { member_id: this.uid })
        if (data.login_only_allow_single_client && data.login_only_allow_single_client.status) {
          this.form.login_only_allow_single_client.status = data.login_only_allow_single_client.status
        }
      } catch (e) {
        return
      }
    },
    //
    async getSSOSuffixList() {
      try {
        const data = await this.Fetch.get('/fd/V4/zero.trust.suffix.manage.member.list', { member_id: this.uid })
        this.suffix = data
      } catch (error) {
        this.suffix = []
      }
    },
    async getCacheSetting() {
      try {
        const data = await this.InvokeAllApi.get('/fd/V4/member.set.info', { uid: this.uid })
        const keys = [
          'limit_speed_clean_cache', 'limit_cache_preheat', 'domain_config_switch', 'subacl', 'oplog',
          'soc_log_download', 'gateway', 'zero_trust', 'nonstandard_port', 'domain', 'mirr', 'oem_domain_check',
          'back_source_lan_ip', 'replace_mirror_notice'
        ]
        keys.forEach(key => {
          if (data && data[key]) {
            const keyValue = data[key]
            if (['replace_mirror_notice'].includes(key)) {
              Object.keys(keyValue).forEach(k => {
                keyValue[k] = Number(keyValue[k])
              })
            }
            this.$set(this.form, key, keyValue)
          }
        })
        this.is_suffix = !!data['zero_trust'] && !!data['zero_trust'].suffix
      } catch (e) {
        return
      } finally {
        this.loading = false
      }
    },

    async fetchSubmit() {
      try {
        await this.InvokeAllApi.post('/fd/V4/member.set.save', {
          uid: this.uid,
          status: this.form.limit_speed_clean_cache.status,
          limit_speed_clean_cache: this.form.limit_speed_clean_cache,
          limit_cache_preheat: this.form.limit_cache_preheat,
          domain_config_switch: this.form.domain_config_switch,
          subacl: this.form.subacl,
          oplog: this.form.oplog,
          soc_log_download: this.form.soc_log_download,
          gateway: this.form.gateway,
          nonstandard_port: this.form.nonstandard_port,
          zero_trust: await this.$refs.FormZeroTrust.getForm(),
          domain: this.form.domain,
          mirr: this.form.mirr,
          oem_domain_check: this.form.oem_domain_check,
          back_source_lan_ip: this.form.back_source_lan_ip,
          replace_mirror_notice: this.form.replace_mirror_notice
        })
      } catch (e) {
        throw new Error()
      }
    },

    async handleSubmit(form) {
      this.Message('ACTION_SUCCESS')
      this.$emit('init')
      this.handleClose()
    },

    async fetchChangeLoginLimitset() {
      try {
        await this.InvokeAllApi.post('/V4/member.setting.loginlimitset', {
          member_id: this.uid,
          status: this.form.login_only_allow_single_client.status,
          login_only_allow_single_client: this.form.login_only_allow_single_client
        })
      } catch (e) {
        this.fetchSettings()
        return
      }
      this.message.success('操作成功')
    }
  }
})
</script>

<style lang="scss" scoped>
/deep/ .el-form-item__label {
  padding-left: 10px;
}
/deep/.el-form-item {
  margin-bottom: 5px;
}
.input-box {
  width: 300px;
}
</style>
