<style lang="postcss" scoped>
  .mealconfig-edit{
    .mealconfig-edit-form {
      margin: 5px;
      .mealconfig-edit-form-item {

      }
      .mealconfig-edit-form-input {
        width:250px;
      }
      .mealconfig-edit-form-input2 {
        width:190px;
      }
    }
    .mb-0 {
      margin-bottom:0px !important;
    }
  }
</style>

<template>
  <div class="mealconfig-edit">
    <FDialog :visible.sync="mealconfig.open" :close-on-click-modal="true" title="套餐配置修改" size="500" aside @close="handleClose">
      <DmScroll>
        <el-form v-loading="mealconfig.loading" ref="mealconfig" :model="mealconfig" :rules="rules" label-position="left" label-width="120px" size="mini" class="mealconfig-edit-form">
          <h4>套餐模板</h4><hr>
          <el-form-item label="" label-width="0px" class="mealconfig-edit-form-item" prop="ukey">
            <el-radio-group v-model="mealconfig.ukey" @change="changeModel">
              <el-radio v-for="item in templateList" :key="item.ukey" :label="item.ukey">{{ item.tp_name }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <h4>套餐模板</h4><hr>
          <el-form-item label="计费规则" class="mealconfig-edit-form-item" prop="calc_way">
            <el-radio-group v-model="mealconfig.calc_way">
              <el-radio v-for="(item, key) in CALC_WAY_LIST" :key="key" :label="item.value" :disabled="item.value !== mealconfig.calc_way">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="计费周期" class="mealconfig-edit-form-item" prop="calc_way_timeunit">
            <el-radio-group v-model="mealconfig.calc_way_timeunit">
              <el-radio label="day">按日计算</el-radio>
            </el-radio-group>
          </el-form-item>
          <h4>{{ Number(mealconfig.calc_way) === 1 ?'赠送流量':'赠送带宽峰值' }}</h4><hr>
          <template v-if="Number(mealconfig.calc_way) === 1">
            <el-form-item label="国内流量" class="mealconfig-edit-form-item" prop="free_china">
              <el-input v-model="mealconfig.free_china" placeholder="" class="mealconfig-edit-form-input"/> G
            </el-form-item>
            <el-form-item label="海外流量" class="mealconfig-edit-form-item" prop="free_foreign">
              <el-input v-model="mealconfig.free_foreign" placeholder="" class="mealconfig-edit-form-input"/> G
            </el-form-item>
          </template>
          <template v-if="Number(mealconfig.calc_way) === 2">
            <el-form-item label="国内带宽峰值" class="mealconfig-edit-form-item" prop="free_china_max">
              <el-input v-model="mealconfig.free_china_max" placeholder="" class="mealconfig-edit-form-input"/> Mbps
            </el-form-item>
            <el-form-item label="海外带宽峰值" class="mealconfig-edit-form-item" prop="free_foreign_max">
              <el-input v-model="mealconfig.free_foreign_max" placeholder="" class="mealconfig-edit-form-input"/> Mbps
            </el-form-item>
          </template>
          <h4>价格</h4><hr>
          <template v-if="Number(mealconfig.calc_way) === 1">
            <el-form-item label="国内流量" class="mealconfig-edit-form-item" prop="fee_china">
              <el-input v-model="mealconfig.fee_china" placeholder="" class="mealconfig-edit-form-input"/> 元/GB/天
            </el-form-item>
            <el-form-item label="海外流量" class="mealconfig-edit-form-item" prop="fee_foreign">
              <el-input v-model="mealconfig.fee_foreign" placeholder="" class="mealconfig-edit-form-input"/> 元/GB/天
            </el-form-item>
          </template>
          <template v-if="Number(mealconfig.calc_way) === 2">
            <el-form-item label="国内带宽峰值" class="mealconfig-edit-form-item" prop="fee_china_max">
              <el-input v-model="mealconfig.fee_china_max" placeholder="" class="mealconfig-edit-form-input"/> 元/Mbps/天
            </el-form-item>
            <el-form-item label="海外带宽峰值" class="mealconfig-edit-form-item" prop="fee_foreign_max">
              <el-input v-model="mealconfig.fee_foreign_max" placeholder="" class="mealconfig-edit-form-input"/> 元/Mbps/天
            </el-form-item>
          </template>
          <h4>增值服务</h4><hr>
          <el-form-item label="赠送的http请求加速次数" label-width="180px" class="mealconfig-edit-form-item" prop="free_cdn_https">
            <el-input v-model="mealconfig.free_cdn_https" placeholder="" class="mealconfig-edit-form-input2"/> 万次
          </el-form-item>
          <el-form-item label="http请求加速价格" label-width="180px" class="mealconfig-edit-form-item" prop="fee_cdn_https">
            <el-input v-model="mealconfig.fee_cdn_https" placeholder="" class="mealconfig-edit-form-input2"/> 元/万次
          </el-form-item>
          <el-form-item label="订单备注" class="mealconfig-edit-form-item">
            <el-input
              v-model="mealconfig.remark"
              :autosize="{ minRows: 4, maxRows: 4}"
              type="textarea"
              placeholder="请输入备注"
              class="mealconfig-edit-form-input"/>
          </el-form-item>
        </el-form>
      </DmScroll>
      <div slot="footer">
        <el-button type="info" @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSubmit('mealconfig')">确 定</el-button>
      </div>
    </FDialog>
  </div>
</template>

<script>
import * as FORM from './dialogForm'
export default {
  data() {
    return {
      mealconfig: FORM.formModel,
      rules: FORM.rules,
      default_template: {},
      parentRow: {},
      templateList: [],
      CALC_WAY_LIST: [{ label: '按流量计算', value: '1' }, { label: '按带宽峰值计算', value: '2' }],
      CDNTEMPLATE_API: {
        get: '/fd/V4/order.cdn.cdntemplate',
        edit: '/fd/V4/order.cdn.updatetemplate'
      }
    }
  },

  methods: {
    handleOpen(data, type) {
      this.$nextTick(() => {
        this.resetFome('mealconfig')
        this.mealconfig.open = true
        this.mealconfig.loading = true
        this.parentRow = data
        this.getCdntemplate({
          plan_id: data.id
        })
        setTimeout(() => {
          this.mealconfig.loading = false
        }, 1000)
      })
    },

    getCdntemplate(params) {
      const api = this.CDNTEMPLATE_API.get || ''
      if (!api) {
        return
      }
      this.templateList = []
      this.default_template = {}
      this.InvokeAllApi.post(api, params).then(res => {
        this.default_template = !!res.template && res.template || {}
        this.templateList = res.templateList || []
        this.setValueFields(this.default_template)
      })
    },

    setValueFields(data) {
      const fields = [
        'tp_name', 'ukey', 'calc_way', 'calc_way_timeunit', 'free_china', 'free_foreign', 'fee_china', 'fee_foreign',
        'free_cdn_https', 'fee_cdn_https', 'free_china_max', 'free_foreign_max', 'fee_china_max', 'fee_foreign_max', 'remark'
      ]
      fields.forEach(item => {
        this.mealconfig[item] = data[item] || ''
      })
    },

    resetFome(form) {
      this.$refs[form] && this.$refs[form].resetFields()
    },

    handleClose() {
      this.mealconfig.open = false
      this.$emit('fetchData')
    },

    changeModel(val) {
      const template = this.templateList.find(item => {
        return item.ukey === val
      })
      if (!template) {
        return
      }
      this.changeBillRule(template && template.calc_way || '')
      this.setValueFields(template)
    },

    changeBillRule(val) {
      const will_resetFields_1 = ['free_china', 'free_foreign', 'fee_china', 'fee_foreign']
      const will_resetFields_2 = ['free_china_max', 'free_foreign_max', 'fee_china_max', 'fee_foreign_max']

      Number(val) === 1 && this.$refs.mealconfig.clearValidate(will_resetFields_1)
      Number(val) === 2 && this.$refs.mealconfig.clearValidate(will_resetFields_2)
    },

    handleSubmit(form) {
      const api = this.CDNTEMPLATE_API.edit || ''
      const params = this.getValueFields()
      if (!api) {
        return
      }
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.InvokeAllApi.post(api, params).then(res => {
            this.Message('ACTION_SUCCESS')
            this.handleClose()
          })
        }
      })
    },

    getValueFields() {
      const params = {
        'plan_id': this.parentRow.id,
        'accounting_rules': this.mealconfig.calc_way || '',
        'member_id': this.parentRow.member_id,
        'template': {
          'tp_name': this.mealconfig.tp_name || '', // 模板名称
          'ukey': this.mealconfig.ukey || '', // 模板标识
          'calc_way': this.mealconfig.calc_way || '', // 计费规则
          'calc_way_timeunit': this.mealconfig.calc_way_timeunit || 'day', // 计费周期
          'free_china': this.mealconfig.free_china || '0', // 国内定制(免费)流量
          'free_foreign': this.mealconfig.free_foreign || '0', // 国外定制(免费)流量
          'fee_china': this.mealconfig.fee_china || '0', // 国内流量价格
          'fee_foreign': this.mealconfig.fee_foreign || '0', // 国外流量价格
          'free_cdn_https': this.mealconfig.free_cdn_https || '0', // 赠送的https请求加速次数, 单位: 万次
          'fee_cdn_https': this.mealconfig.fee_cdn_https || '', // 增值服务价格, 单位: 元/万次
          'free_china_max': this.mealconfig.free_china_max || '', // 国内带宽峰值定制(免费)
          'free_foreign_max': this.mealconfig.free_foreign_max || '', // 国外带宽峰值定制(免费)
          'fee_china_max': this.mealconfig.fee_china_max || '', // 国内带宽峰值价格
          'fee_foreign_max': this.mealconfig.fee_foreign_max || '' // 国外带宽峰值价格
        },
        'remark': this.mealconfig.remark || ''
      }

      return params
    }
  }
}
</script>
