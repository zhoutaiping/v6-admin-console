<style lang="scss" scoped>
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
/deep/.el-input__inner {
  text-align: left;
}
.item-box {
  display: inline-block;
  margin-bottom: 5px;
  width: 16vw;
  min-width: 400px;
}
.item {
  margin-bottom: 0px;
}
</style>
<template>
  <el-card class="is-horizonta">
    <div
      slot="header"
      class="clearfix"
    >
      <span>获取资源策略</span>
    </div>
    <div>
      <el-form
        :model="form"
        :rules="rules"
        label-width="120px"
        label-position="left"
      >
        <el-form-item label-width="0" class="item">
          <el-form-item label="资源获取模版" class="item-box">
            <DmSelect
              v-model="form.template_id"
              :selects="options.template"
              class="input-box"
              placeholder=""
              @change="updataTemplate('ippool')"
            />
            <el-button type="text" @click="routeLink()">
              查看模板
            </el-button>
          </el-form-item>
          <el-form-item label="获取资源锁定" class="item-box">
            <DmSelect
              v-model="form.disp_lock"
              :selects="options.disp_lock"
              class="input-box"
              placeholder=""
            />
          </el-form-item>
        </el-form-item>
        <el-form-item label-width="0" class="item">

          <el-form-item label="脱敏YUNDUN" class="item-box">
            <DmSelect
              v-model="form.disp_ip_del_yd"
              :selects="options.ip_del_yd"
              class="input-box"
              placeholder=""
            />
          </el-form-item>
          <el-form-item label="运营商策略" class="item-box">
            <DmSelect
              v-model="form.disp_isp_policy"
              :selects="options.risk_policy"
              class="input-box"
              placeholder=""
            />
          </el-form-item>
        </el-form-item>
        <el-form-item label-width="0" class="item">
          <el-form-item label="服务类型" prop="service_type" class="item-box">
            <DmSelect
              v-model="form.service_type"
              :selects="options.service_type"
              class="input-box"
              placeholder=" "
            />
          </el-form-item>
          <el-form-item label="节点类型" prop="node_type" class="item-box">
            <DmSelect
              v-model="form.node_type"
              :selects="options.node_type"
              class="input-box"
              placeholder=" "
            />
          </el-form-item>
        </el-form-item>
        <el-form-item label-width="0" class="item">
          <el-form-item label="手动IP锁定" class="item-box">
            <DmSelect
              v-model="form.disp_use_hand_line"
              :selects="options.ip_hand_check"
              class="input-box"
              placeholder=""
            />
          </el-form-item>
          <el-form-item label="启用定时调度" class="item-box">
            <el-checkbox
              :true-label="1"
              :false-label="0"
              v-model="form.disp_auto"
              @change="e =>{
                form.disp_auto_interval = 0
                form.disp_auto_unit = 'min'
                if(e === 1) {
                  form.disp_auto_interval = 10
                  form.disp_auto_unit = 'min'
                }
              }"
            />
            <template v-if="form.disp_auto === 1">
              <el-input-number
                v-model="form.disp_auto_interval"
                :precision="0"
                :min="0"
                :controls="false"
                placeholder=""
                style="width: 77px;"
              />
              <el-select
                v-model="form.disp_auto_unit"
                placeholder="请选择"
                style="width:100px;"
              >
                <el-option
                  label="分钟"
                  value="min"
                />
                <el-option
                  label="小时"
                  value="h"
                />
                <el-option
                  label="天"
                  value="day"
                />
              </el-select>
              <span class="color--primary">调度频率</span>
            </template>
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updata()">保 存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>
<script>
import { mapState } from 'vuex'
import router, { resetRouter } from '@/router'
export default {
  data() {
    return {
      formDefault: {
        ippool_id: '',
        template_id: '',
        disp_lock: 0,
        disp_ip_del_yd: 1,
        disp_isp_policy: '',
        disp_auto: 0,
        disp_auto_interval: 0,
        disp_auto_unit: 'min',
        disp_use_hand_line: '',
        service_type: '',
        node_type: ''
      },
      form: {

      },
      rules: {

      },
      options: {
        template: [],
        disp_lock: [
          { label: '是', value: 1 },
          { label: '否', value: 0 }
        ],
        ip_hand_check: [
          { label: '是', value: 1 },
          { label: '否', value: 0 }
        ],
        ip_del_yd: [
          { label: '默认（不区分）', value: 0 },
          { label: '是', value: 1 },
          { label: '否', value: 2 }
        ],
        risk_policy: [
          { label: '无', value: 0 },
          { label: '封海外', value: 1 },
          { label: '封UDP', value: 2 },
          { label: '封SYN大包', value: 3 },
          { label: '异网隔离', value: 4 }
        ],
        service_type: [
          { label: '免费服务', value: 'fee' },
          { label: '付费服务', value: 'nofee' }
        ],
        node_type: []
      }
    }
  },
  computed: {
    ...mapState({
      ip_pool: state => state.disp.ip_pool,
      template: state => state.disp.template,
      node_type: state => state.disp.node_type
    })
  },
  watch: {
    ip_pool: {
      deep: true,
      handler(val) {
        this.init('form')
      }
    },
    node_type: {
      deep: true,
      handler(val) {
        this.options.node_type = this.node_type
      }
    },
    template: {
      deep: true,
      handler(val) {
        this.init('template')
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init(type = '') {
      if (type === 'form') {
        this.form = Object.assign(this.formDefault, this.ip_pool)
        this.options.node_type = this.node_type
      } else if (type === 'template') {
        if (this.template && this.template.bind && this.template.bind.normal) {
          this.form.template_id = this.template.bind.normal
        }
        this.options.template = this.template.normal
      }
    },

    routeLink() {
      this.$store.dispatch('delAllViews')
      this.$store.dispatch('changeMenuType', { menu_type: 'resources' }).then(res => {
        resetRouter()
        router.addRoutes(res)
        this.$router.push({ path: '/platform/resources/resources/dns', query: {
          active: 'normal'
        }})
      })
    },

    async updataTemplate(type) {
      const params = {
        data_type: type,
        template_id: this.form.template_id,
        id: this.form.ippool_id
      }

      try {
        await this.Fetch.post('/fd/V4/dispatch.template.bind.save', params)
        this.Message('ACTION_SUCCESS')
        this.$store.dispatch('fetchTemplateBind', {
          id: this.$route.params.id,
          data_type: 'ippool'
        })
      } catch (error) {
        return
      }
    },
    async updata() {
      const { ippool_id = '', disp_lock = 0, disp_ip_del_yd = '', disp_isp_policy = '', disp_auto = 0, disp_auto_interval = 0, disp_auto_unit = '', disp_use_hand_line = '' } = this.form
      const params = {
        ippool_id, disp_lock, disp_ip_del_yd,
        disp_isp_policy,
        disp_auto,
        disp_auto_interval,
        disp_auto_unit,
        disp_use_hand_line
      }
      try {
        await this.FetchDisp.post('/ip/pool/save', params).then(res => {
          this.Message('ACTION_SUCCESS')
          this.$store.dispatch('fetchIpPool', { ippool_id: this.$route.params.id, page: 1, pagesize: 1 })
        })
      } catch (error) {
        return
      }
    }
  }
}
</script>
