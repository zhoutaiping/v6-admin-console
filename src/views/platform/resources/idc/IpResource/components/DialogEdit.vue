<style lang="postcss" scoped>
.ip-resource-edit {
  .ip-resource-edit-dialog {
    .ip-resource-dialog-form {
      margin: 5px;
      .ip-resource-dialog-item {
        margin-bottom: 5px;
      }
      .ip-resource-dialog-input {
        width: 300px;
      }
      .ip-resource-dialog-input2 {
        width: 205px;
      }
      .border-top {
        border-top: 1px solid #66666650;
        padding-top: 10px;
      }
      .border-bottom {
        border-bottom: 1px solid #66666650;
        padding-bottom: 15px;
      }
      .ipTag {
        width: 93%;
        margin: 10px 0;
        min-height: 100px;
        max-height: 300px;
        background: #ecf5ff;
        border: 1px solid #b3d8ff;
      }
    }
  }
}
</style>
<template>
  <div class="ip-resource-edit">
    <FDialog
      :title="title_text[panelType]"
      :visible.sync="open"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      size="600"
      aside
      class="ip-resource-edit-dialog"
      @close="handleClose"
    >
      <DmScroll>
        <el-form
          ref="ipForm"
          :model="ipForm"
          :rules="rules"
          label-position="left"
          label-width="100px"
          size="mini"
          class="ip-resource-dialog-form"
        >
          <el-form-item
            label=""
            label-width="0px;"
            class="border-top border-bottom"
          >
            <el-card
              :body-style="{ padding: '5px' }"
              class="box-card"
              shadow="never"
            >
              <div
                slot="header"
                class="clearfix"
              >
                <span>已选 {{ P_TAG.length }} 个</span>
                <div
                  v-if="panelType!=='edit'"
                  style="display: inline-block;float:right"
                >
                  <el-button
                    v-show="!is_edit"
                    type="primary"
                    plain
                    style="float:right;"
                    @click="is_edit=true"
                  >修改</el-button>
                  <el-button
                    v-show="is_edit"
                    type="primary"
                    style="float:right;margin-left:5px;"
                    @click="handleAddTag(ipForm.add_tag)"
                  >确定</el-button>
                  <el-button
                    v-show="is_edit"
                    type="primary"
                    plain
                    style="float:right;"
                    @click="is_edit=false"
                  >取消</el-button>
                  <el-input
                    v-show="is_edit"
                    v-model="ipForm.add_tag"
                    placeholder="请输入IP/IP段"
                    style="float:right;width:160px;"
                  />
                  <el-select
                    v-show="is_edit"
                    v-model="ipForm.add_ip_type"
                    placeholder=""
                    style="float:right;width:130px"
                  >
                    <el-option
                      v-for="(item, index) in TYPE"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
              </div>
              <div
                v-for="(tag, index) in P_TAG"
                :key="index"
                style="display: inline-block;"
              >
                <a-badge
                  :dot="tag.bag"
                  :status="tag.bag ? 'success' : 'default'"
                >
                  <el-tag
                    :closable="is_edit && panelType!=='edit'"
                    style="margin: 2px;"
                    @close="handleCloseTag(tag)"
                  >{{ tag.ip }}</el-tag>
                </a-badge>
              </div>
            </el-card>
          </el-form-item>
          <el-form-item
            label="用途"
            prop="use_type"
          >
            <el-select
              v-model="ipForm.use_type"
              placeholder="请选择ip用途"
              class="ip-resource-dialog-input"
              change=""
            >
              <el-option
                v-for="(item, index) in USE_TYPE"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <template v-if="Number(ipForm.use_type) !==0">
            <el-form-item
              v-if="Number(ipForm.use_type) !==1"
              label=""
              label-width="0px"
            >
              <!-- <el-checkbox v-model="ipForm.is_dispatch" :disabled="is_disp_status" :true-label="1" :false-label="2" >参与调度（勾选后同时会将IP推送至 “调度IP” 中）</el-checkbox> -->
              <el-checkbox
                v-model="ipForm.ip_remove_sensitive"
                :true-label="1"
                :false-label="2"
              >YUNDUN脱敏 （{{ Number(ipForm.ip_remove_sensitive) === 1 ? '脱敏' :'不脱敏' }} ）</el-checkbox>
              <el-checkbox
                v-model="ipForm.ip_share"
                :true-label="1"
                :false-label="0"
              >IP 独享</el-checkbox>
            </el-form-item>

            <el-form-item
              label="ISP配置"
              class="ip-resource-dialog-item border-top"
            />
            <el-form-item
              label="线路类型"
              prop="isp_line_type"
            >
              <el-radio-group
                v-model="ipForm.isp_line_type"
                @change="changUseType"
              >
                <el-radio-button
                  v-for="(item, index) in ISP_LINE_TYPE"
                  :key="index"
                  :label="item.value"
                >{{ item.label }}</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="ipForm.isp_line_type"
              label="线路"
              prop="isp_lines"
            >
              <el-select
                v-if="Number(ipForm.isp_line_type) === 1"
                v-model="ipForm.isp_lines"
                placeholder="请选择线路"
                class="ip-resource-dialog-input"
              >
                <el-option
                  v-for="(item, index) in ISP_LINES"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-checkbox-group
                v-if="Number(ipForm.isp_line_type) === 2"
                v-model="ipForm.isp_lines"
              >
                <el-checkbox
                  v-for="(item, index) in ISP_LINES"
                  :key="index"
                  :label="item.value"
                >{{ item.label }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item
              label="地区"
              prop="region_code"
            >
              <el-cascader
                :options="BIG"
                v-model="ipForm.region_code"
                clearable
                filterable
                placeholder="请选择地区"
                class="ip-resource-dialog-input"
              />
            </el-form-item>
            <el-form-item
              label="带宽配置"
              class="ip-resource-dialog-item border-top"
            />
            <el-form-item
              label="带宽上行"
              prop="net_speed_up"
            >
              <el-input-number
                v-model="ipForm.net_speed_up"
                controls-position="right"
                placeholder=""
                class="ip-resource-dialog-input input-number"
              /> Mbps
            </el-form-item>
            <el-form-item
              label="带宽下行"
              prop="net_speed_down"
            >
              <el-input-number
                v-model="ipForm.net_speed_down"
                controls-position="right"
                placeholder=""
                class="ip-resource-dialog-input input-number"
              /> Mbps
            </el-form-item>
            <el-form-item
              label="计费方式"
              prop="net_fee_type"
            >
              <el-radio-group v-model="ipForm.net_fee_type">
                <el-radio
                  v-for="(item, index) in NET_FEE_TYPE"
                  :key="index"
                  :label="item.value"
                >{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="ADS配置"
              class="ip-resource-dialog-item border-top"
            />
            <el-form-item
              label="黑洞阈值"
              prop="null_limit"
            >
              <el-input-number
                v-model="ipForm.null_limit"
                controls-position="right"
                placeholder=""
                class="ip-resource-dialog-input input-number"
              /> Gbps
            </el-form-item>
            <el-form-item
              label="黑洞时间"
              prop="null_time"
            >
              <el-input-number
                v-model="ipForm.null_time"
                controls-position="right"
                placeholder=""
                class="ip-resource-dialog-input input-number"
              /> S
            </el-form-item>
            <el-form-item
              label="运营商策略"
              prop="risk_policy"
            >
              <el-checkbox-group v-model="ipForm.risk_policy">
                <el-checkbox v-for="(item, index) in RISK_POLICY" :label="item.value" :key="index">{{ item.label }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item
              label="清洗设备品牌"
              prop="ads_supplier"
            >
              <el-input
                v-model="ipForm.ads_supplier"
                placeholder=""
                class="ip-resource-dialog-input input-number"
              />
            </el-form-item>
            <el-form-item
              label="最大清洗能力"
              prop="ads_cluster_clean_max"
            >
              <el-input-number
                v-model="ipForm.ads_cluster_clean_max"
                controls-position="right"
                placeholder=""
                class="ip-resource-dialog-input input-number"
              /> Gbps
            </el-form-item>
            <el-form-item
              label="清洗方案"
              prop="ads_clean_type"
              class="border-bottom"
            >
              <el-radio-group v-model="ipForm.ads_clean_type">
                <el-radio
                  v-for="(item, index) in ADS_CLEAN_TYPE"
                  :key="index"
                  :label="item.value"
                  style="margin:5px;"
                >{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </template>
          <el-form-item
            label="备注"
            prop="remark"
          >
            <el-input
              v-model="ipForm.remark"
              type="textarea"
              placeholder="请输入备注"
              class="ip-resource-dialog-input input-number"
            />
          </el-form-item>
        </el-form>
      </DmScroll>
      <div slot="footer">
        <el-button
          type="info"
          @click="handleClose"
        >取消</el-button>
        <el-button
          type="primary"
          @click="handleSubmint"
        >确定</el-button>
      </div>
    </FDialog>
  </div>
</template>

<script>
import * as Form from './form'
import { isArray } from '@/utils/array'
export default {
  data() {
    const defalutTag = []
    return {
      open: false,
      loading: false,
      is_edit: false,
      is_disp_status: false,
      title_text: { 'add': '新增', 'edit': '配置', 'edit-batch': '批量配置', 'info': '详情' },
      P_TAG: defalutTag,
      ipTags: defalutTag,
      TYPE: [{ label: '节点IP', value: 'ip' }, { label: 'IP段', value: 'ipBlock' }, { label: '按主IP批量添加', value: 'masterIp' }],
      panelType: 'add',
      ipForm: Form.ipForm,
      USE_TYPE: Form.use_type,
      ISP_LINE_TYPE: Form.isp_line_type,
      NET_FEE_TYPE: Form.net_fee_type,
      RISK_POLICY: Form.risk_policy,
      ADS_CLEAN_TYPE: Form.ads_clean_type,
      ISP_LINES: Form.isp_lines,
      REGION: [{ label: '北京', value: '1' }],
      rules: Form.rules,
      BIG: []
    }
  },

  methods: {
    handleOpen(data, type, BIG, use_type) {
      this.$nextTick(() => {
        this.open = true
        setTimeout(() => { this.$refs.ipForm.resetFields() }, 0)
        this.ipForm = Object.assign({}, Form.ipForm)
        this.panelType = type
        this.BIG = BIG
        this.ipTags = []
        this.P_TAG = []
        this.ipForm.add_tag = ''
        if (type === 'edit-batch') {
          this.ipForm.use_type = use_type
          data.forEach(i => {
            this.ipTags.push(i)
            this.P_TAG.push(i)
          })
        } else if (type === 'edit') {
          this.ipTags.push(data)
          this.P_TAG.push(data)
          this.loadForm(data)
        }
      })
    },
    loadForm(data) {
      this.InvokeAssetApi.get('/serverIp/info', { id: data.id }).then(res => {
        this.ipForm.use_type = (res.use_type).toString()
        this.ipForm.isp_line_type = res.isp_line_type
        this.changUseType(res.isp_line_type)
        this.ipForm.isp_lines = res.isp_line_type === 1 ? res.isp_lines : res.isp_lines.split(',')
        this.ipForm.region_code = res.region_code.split(',')
        this.ipForm.net_speed_up = res.net_speed_up
        this.ipForm.net_speed_down = res.net_speed_down.toString()
        this.ipForm.net_fee_type = res.net_fee_type.toString()
        this.ipForm.null_limit = res.null_limit
        this.ipForm.null_time = res.null_time
        this.ipForm.risk_policy = Array.isArray(res.risk_policy) ? res.risk_policy : res.risk_policy.split(',') || []
        this.ipForm.ads_supplier = res.ads_supplier
        this.ipForm.ads_cluster_clean_max = res.ads_cluster_clean_max
        this.ipForm.ads_clean_type = res.ads_clean_type.toString()
        this.ipForm.ip_remove_sensitive = Number(res.ip_remove_sensitive) || 0
        this.ipForm.ip_share = Number(res.ip_share) || 0
        this.ipForm.is_dispatch = res.use_type !== 0 && res.use_type !== 1 ? res.is_disp : (res.is_disp === 1 ? 1 : 2)
        this.ipForm.remark = res.remark
        this.is_disp_status = res.use_type !== 0 && res.use_type !== 1 && res.is_disp === 1
      })
    },
    changUseType(val) {
      this.ipForm.isp_lines = Number(val) === 1 ? '' : []
    },
    handleAddTag(tag) {
      this.InvokeAssetApi.get('/serverIp/serverIps', { type: this.ipForm.add_ip_type, ip: this.ipForm.add_tag }).then(res => {
        const ips = JSON.parse(JSON.stringify(res.ips))
        const Arr = []
        for (var i in ips) {
          if (ips[i]) Arr.push({ id: ips[i], ip: i })
        }
        Arr.forEach(item => {
          const a_ = JSON.parse(JSON.stringify(item))
          a_.bag = true
          const findIndex = this.P_TAG.findIndex(f => f.ip === a_.ip && f.id === a_.id)
          if (findIndex < 0) this.P_TAG.push(a_)
        })
        this.ipForm.add_tag = ''
      })
    },

    handleCloseTag(tag) {
      this.P_TAG.splice(this.P_TAG.indexOf(tag), 1)
    },

    resetForm(formName) {
      if (formName && this.$refs[formName]) this.$refs[formName].resetFields()
    },

    handleClose() {
      this.open = false
    },

    handleSubmint() {
      const ip = []
      if (this.P_TAG.length === 0) {
        this.message.warning('请添加IP')
        return
      } else {
        this.P_TAG.forEach(i => {
          ip.push(i.ip)
        })
      }

      this.$refs.ipForm.validate((valid) => {
        if (valid) {
          this.InvokeAssetApi.post('/serverIp/update', this.getParams()).then(res => {
            this.Message('ACTION_SUCCESS')
            if (this.ipForm.is_dispatch === 1) this.handleDispath({ ip: ip, type: 'add' })
            if (this.ipForm.is_dispatch !== 1) {
              this.$emit('handleLoad')
              this.open = false
            }
          })
        }
      })
    },
    handleDispath(params) {
      this.InvokeAssetApi.post('/serverIp/add_to_dispatch', params).then(res => {
        this.message.success('调度成功!')
        this.$emit('handleLoad')
        this.open = false
      })
    },
    getParams() {
      const ids = []
      this.P_TAG.forEach(i => {
        ids.push(Number(i.id))
      })
      const params = {
        'ids': ids,
        'use_type': Number(this.ipForm.use_type),
        'remark': this.ipForm.remark
      }
      if (Number(this.ipForm.use_type) !== 0) {
        params.isp_line_type = Number(this.ipForm.isp_line_type)
        params.isp_lines = isArray(this.ipForm.isp_lines) ? this.ipForm.isp_lines.join(',') : this.ipForm.isp_lines
        params.region_code = this.ipForm.region_code.join(',')
        params.net_speed_up = this.ipForm.net_speed_up
        params.net_speed_down = this.ipForm.net_speed_down
        params.net_fee_type = Number(this.ipForm.net_fee_type)
        params.null_limit = this.ipForm.null_limit
        params.null_time = this.ipForm.null_time
        params.risk_policy = this.ipForm.risk_policy.join(',')
        params.ads_supplier = this.ipForm.ads_supplier
        params.ads_cluster_clean_max = Number(this.ipForm.ads_cluster_clean_max)
        params.ads_clean_type = Number(this.ipForm.ads_clean_type)
      }
      if (Number(this.ipForm.use_type) === 2 || Number(this.ipForm.use_type) === 3) {
        params.is_disp = Number(this.ipForm.is_dispatch)
        params.ip_remove_sensitive = Number(this.ipForm.ip_remove_sensitive)
        params.ip_share = Number(this.ipForm.ip_share)
      }
      return params
    }
  }
}
</script>
