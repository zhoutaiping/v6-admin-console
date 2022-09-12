<template>
  <div>
    <el-card class="is-horizonta">
      <div
        slot="header"
        class="clearfix"
      >
        <span>基本信息</span>
      </div>
      <div>
        <el-form
          ref="FormInfo"
          :model="form_info"
          :rules="rules"
          label-width="140px"
          label-position="left"
        >
          <el-form-item
            label="添加时间"
            class="item-box"
          >
            {{ domain_basic.info && domain_basic.info.domain }} 由 {{ domain_basic.info && domain_basic.info.member_info.email }} 账户于 {{ domain_basic.info && domain_basic.info.created_at }} （IP: ）添加
          </el-form-item>
          <el-form-item
            class="item-box"
            label-width="0"
          >
            <el-form-item
              label="接入状态"
              class="item-box-inline"
            >
              {{ domain_basic.info && domain_basic.info.use_yundun_desc || '' }}
            </el-form-item>
            <el-form-item
              label="接入模式"
              class="item-box-inline"
            >
              {{ domain_basic.info && domain_basic.info.protected_mode_desc || '' }}
            </el-form-item>
          </el-form-item>
          <el-form-item
            class="item-box"
            label-width="0"
          >
            <el-form-item
              label="付费服务开始时间"
              class="item-box-inline"
            >
              {{ domain_basic.info && domain_basic.info.hwws_created_at || '' }}
            </el-form-item>
            <el-form-item
              label="付费服务结束时间"
              class="item-box-inline"
            >
              {{ domain_basic.info && domain_basic.info.hwws_expire_time || '' }}
            </el-form-item>
          </el-form-item>
          <el-form-item
            class="item-box"
            label-width="0"
          >
            <el-form-item
              label="域名主CNAME"
              class="item-box-inline"
            >
              {{ domain_basic.info && domain_basic.info.cname || '' }}
            </el-form-item>
            <el-form-item
              label="备用CNAME "
              class="item-box-inline"
            >
              暂无
            </el-form-item>
          </el-form-item>
          <el-form-item
            class="item-box"
            label="备案信息"
          >
            <!-- <DmSelect
              v-model="form_info.is_record"
              :selects="options.record"
              class="input-box"
              placeholder=" "
            /> -->
            <el-input
              v-model="form_info.record_code"
              class="input-box"
              placeholder="备案号"
            />
            <el-button
              type="primary"
              @click="handleSubmit('form_info', 2)"
            >获取域名备案信息</el-button>
          </el-form-item>
          <el-form-item>
            <el-checkbox
              v-model="form_info.record_lock"
              true-label="1"
              false-label="0"
            >锁定备案状态 （锁定后备案自动检测将跳过此域名，不影响手动保存）</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="handleSubmit('form_info', 1)"
            >保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="is-horizonta">
      <div
        slot="header"
        class="clearfix"
      >
        <span>配置信息</span>
      </div>
      <div>
        <el-form
          ref="form_setting"
          :model="form_setting"
          label-width="140px"
          label-position="left"
        >
          <el-form-item
            label-width="0"
            class="item-box"
          >
            <el-form-item
              label="审核状态"
              class="item-box-inline"
            >
              <DmSelect
                v-model="form_setting.check_status"
                :selects="options.check_status"
                class="input-box"
                placeholder=" "
                @change="()=> {
                  form_setting.back_source_reason = ''
                }"
              />
            </el-form-item>
            <el-form-item
              v-show="form_setting.check_status === '5' || form_setting.check_status === '7'"
              label="原因"
              class="item-box-inline"
            >
              <DmSelect
                v-model="form_setting.back_source_reason"
                :selects="options.back_source_reasons"
                class="input-box"
                placeholder=" "
              />
            </el-form-item>
          </el-form-item>
          <el-form-item
            label="V3调度"
            class="item-box"
          >
            <DmSelect
              v-model="form_setting.disp_v3"
              :selects="options.disp_v3"
              class="input-box"
              placeholder="V3调度"
            />
          </el-form-item>
          <el-form-item
            label="调度包"
            class="item-box"
          >
            <DmSelect
              v-model="domain_group.group_name"
              :selects="options.disp"
              class="input-box"
              placeholder="回源"
              @change="bindDisp"
            />
          </el-form-item>
          <el-form-item
            label="备注"
            class="item-box"
          >
            <el-input
              v-model="form_setting.remark"
              :rows="4"
              type="textarea"
              placeholder=""
              style="width:600px;"
            />
          </el-form-item>
          <el-form-item>

            <el-button
              type="primary"
              @click="handleSubmit('form_setting')"
            >保 存</el-button>
          </el-form-item>
        </el-form>
      </div>
      <GroupBind
        ref="groupbind"
        @init="e=>{
          domainGroup()
        }"
      />
    </el-card>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import GroupBind from './group-bind'
export default {
  components: { GroupBind },
  data() {
    return {
      form_info: {
        is_record: '',
        record_code: '',
        record_lock: ''
      },
      form_setting: {
        check_status: '',
        back_source_reason: '',
        disp_v3: '',
        remark: ''
      },
      rules: {

      },
      options: {
        record: [{ label: '无备案', value: '0' }, { label: '有备案', value: '1' }, { label: '未检测', value: '2' }],
        check_status: [],
        disp_v3: [{ label: '是', value: '1' }, { label: '否', value: '0' }],
        protect_status: [{ label: '回源', value: '0' }, { label: '非回源', value: '1' }],
        back_source_reasons: [],
        disp: []
      },
      domain_group: {}
    }
  },
  computed: {
    ...mapState({
      domain_basic: state => state.disp.domain_basic
    })
  },
  watch: {
    domain_basic: {
      handler(val) {
        if (this.domain_basic && this.domain_basic.check_status_map) {
          const check_status = this.domain_basic.check_status_map
          this.options.check_status = Object.keys(check_status).map(i => {
            return { label: check_status[i], value: i.toString(), disabled: i.toString() === '2' || i.toString() === '3' }
          })
        }

        if (this.domain_basic && this.domain_basic.back_source_reasons) {
          const back_source_reasons = this.domain_basic.back_source_reasons
          this.options.back_source_reasons = Object.keys(back_source_reasons).map(i => {
            return { label: back_source_reasons[i], value: back_source_reasons[i] }
          })
        }

        if (this.domain_basic && this.domain_basic.info) {
          Object.keys(this.form_setting).forEach(e => {
            this.$set(this.form_setting, e, this.domain_basic.info[e] || '')
          })
          Object.keys(this.form_info).forEach(e => {
            this.$set(this.form_info, e, this.domain_basic.info[e] || '')
          })
        }
      },
      deep: true
    }
  },
  methods: {
    init() {
      this.$store.dispatch('getDomainBasic', { domain_id: this.$route.params.id })
      this.domainGroup()
      setTimeout(() => {
        this.getDisp({
          domain_id: this.$route.params.id,
          member_id: this.$route.query.member_id,
          is_record: this.domain_basic && this.domain_basic.info && this.domain_basic.info.is_record || this.$route.query.is_record || '1'
        })
      }, 500)
    },

    async domainGroup() {
      this.domain_group = {}
      try {
        const data = await this.Fetch.get('/fd/V4/disp.domain.group.info', { domain_id: this.$route.params.id })
        this.domain_group = data
      } catch (error) {
        return error
      }
    },

    async getDisp(params) {
      this.options.disp = []
      try {
        const data = await this.FetchDisp.get('/disp/group/domain/select', params)
        const list = data.list
        this.options.disp = list.map(i => { return { label: i.name, value: i.group_bn, id: i.group_id } })
      } catch (e) {
        return e
      } finally {
        this.options.disp.unshift({
          label: '回源',
          value: '0',
          id: '0'
        })
      }
    },

    bindDisp(val) {
      if (!val) {
        return
      }
      const data = {
        domain_id: this.$route.params.id,
        is_record: this.domain_basic.info.is_record,
        disp_group_id: this.options.disp.find(i => i.value === val) ? this.options.disp.find(i => i.value === val).id : '',
        type: val === '0' ? 'source' : 'package'	// String	 package-包 source-回源.
      }
      this.Fetch.post('/fd/V4/disp.group.bind.domain', data).then((res) => {
        this.Message('ACTION_SUCCESS')
        this.init()
      })
        .catch(() => {
          return
        })
    },

    handleSubmit(form = '', option = '') {
      if (form === 'form_info' && option === 1) {
        this.domainEdit({
          domain_id: this.domain_basic.info.id,
          domain: this.domain_basic.info.domain,
          is_record: this.form_info.is_record,
          record_code: this.form_info.record_code,
          record_lock: this.form_info.record_lock,
          check_status: this.form_setting.check_status,
          back_source_reason: this.form_setting.back_source_reason,
          remark: this.form_setting.remark
        })
      }

      if (form === 'form_info' && option === 2) {
        this.refreshRecord({
          domain_id: this.domain_basic.info.id,
          domain: this.domain_basic.info.domain
        })
      }

      if (form === 'form_setting') {
        this.domainEdit({
          domain_id: this.domain_basic.info.id,
          domain: this.domain_basic.info.domain,
          is_record: this.form_info.is_record,
          record_code: this.form_info.record_code,
          record_lock: this.form_info.record_lock,
          check_status: this.form_setting.check_status,
          disp_v3: this.form_setting.disp_v3,
          back_source_reason: this.form_setting.back_source_reason,
          remark: this.form_setting.remark
        })
      }
    },

    async refreshRecord(params = {}) {
      try {
        await this.Fetch.post('/V4/WebCdnProtection.Domain.refreshRecord', params)
        this.Message('ACTION_SUCCESS')
        await this.init()
      } catch (error) {
        return error
      }
    },

    async domainEdit(params = {}) {
      try {
        await this.Fetch.post('/V4/WebCdnProtection.Domain.edit', params)
        this.Message('ACTION_SUCCESS')
        await this.init()
      } catch (error) {
        return error
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.item-box {
  margin-bottom: 5px;
}
.item-box-inline {
  display: inline-block;
  width: 500px;
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
