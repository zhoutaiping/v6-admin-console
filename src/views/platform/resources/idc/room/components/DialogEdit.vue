<style lang="postcss" scoped>
.root-edit {
  .root-edit-dialog {
    .root-dialog-form {
      margin: 5px;
      .root-dialog-item {
      }
      .root-dialog-input {
        width: 300px;
      }
    }
  }
}
</style>
<style lang="scss">
.el-radio-button__inner {
  margin: 2px 0;
  border: 1px solid #dcdfe6;
}
</style>

<template>
  <div class="root-edit">
    <FDialog
      :title="title_text[panelType]"
      :visible.sync="open"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      size="500"
      aside
      class="root-edit-dialog"
    >
      <DmScroll>
        <el-form
          v-loading="loading"
          ref="rootForm"
          :model="rootForm"
          :rules="rules"
          label-position="left"
          label-width="120px"
          size="mini"
          class="root-dialog-form"
        >
          <el-form-item
            label="IDC供应商"
            prop="name"
          >
            <el-input
              ref="idc_name"
              v-model="rootForm.name"
              :readonly="panelType === 'info'"
              placeholder="请输入IDC供应商名称"
              class="root-dialog-input"
              @change="changeIsp"
            />
          </el-form-item>
          <el-form-item
            label="地区"
            prop="region"
          >
            <el-cascader
              ref="region_name"
              :options="BIG"
              v-model="rootForm.region"
              :disabled="panelType === 'info'"
              separator="-"
              clearable
              placeholder="请选择地区"
              class="root-dialog-input"
              @change="changeRegion"
            />
          </el-form-item>
          <el-form-item
            label="ISP"
            prop="isp"
          >
            <el-radio-group
              ref="isp_name"
              v-model="rootForm.isp"
              @change="changeIsp"
            >
              <el-radio-button
                v-for="(item, index) in ISP_LINES"
                :key="index"
                :disabled="panelType === 'info'"
                :label="item.value"
              >{{ item.label }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="防火墙权限"
            prop="firewall_power"
          >
            <el-radio-group
              v-model="rootForm.firewall_power"
              :disabled="panelType === 'info'"
            >
              <el-radio-button :label="1">有权限</el-radio-button>
              <el-radio-button :label="0">无权限</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="Number(rootForm.firewall_power) === 1"
            :prop="Number(rootForm.firewall_power) === 1 ?'firewall':''"
            label=""
          >
            <el-select
              v-model="rootForm.firewall"
              placeholder="请选择防火墙地区"
              class="root-dialog-input"
            >
              <el-option
                v-for="(item, index) in FIREWALL"
                :key="index"
                :label="item.label"
                :value="Number(item.value)"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="唯一标识"
            prop="ukey"
          >
            <el-input
              v-model="rootForm.ukey"
              :readonly="true"
              placeholder="请输入唯一标识"
              class="root-dialog-input"
            />
          </el-form-item>
          <el-form-item
            label="备注"
            prop="remark"
          >
            <el-input
              v-model="rootForm.remark"
              :readonly="panelType === 'info'"
              type="textarea"
              placeholder="请输入备注"
              class="root-dialog-input"
            />
          </el-form-item>
        </el-form>
      </DmScroll>
      <div slot="footer">
        <el-button
          type="info"
          @click="handleClose"
        >{{ panelType === 'info'?'关闭':'取消' }}</el-button>
        <el-button
          v-if="panelType !== 'info'"
          type="primary"
          @click="handleSubmint"
        >确定</el-button>
      </div>
    </FDialog>
  </div>
</template>

<script>
import * as Form from './form'
export default {
  data() {
    return {
      open: false,
      loading: false,
      title_text: {
        'add': '新增',
        'edit': '编辑',
        'info': '详情'
      },
      panelType: 'add',
      rootForm: Form.rootForm,
      REGION: [
        { label: '北京', value: '1' }
      ],
      ISP_LINES: Form.isp_lines,
      FIREWALL: Form.FIREWALL, // 防火墙地区
      rules: Form.rules,
      BIG: [],
      CITY: []
    }
  },
  mounted() {
  },
  methods: {
    handleOpen(data, type, BIG, CITY) {
      this.$nextTick(() => {
        this.loading = true
        this.open = true
        setTimeout(() => { this.resetForm('rootForm') }, 500)
        setTimeout(() => {
          this.panelType = type
          this.BIG = BIG
          this.CITY = CITY
          if (type !== 'add') this.getInfo({ id: data.id })
          this.loading = false
        }, 1000)
      })
    },

    getInfo(params) {
      this.InvokeAssetApi.get('/idc_house/info', params).then(res => {
        this.rootForm.id = res.id
        this.rootForm.name = res.name
        this.rootForm.isp = res.isp
        this.rootForm.firewall_power = res.firewall_power
        this.rootForm.firewall = (+res.firewall) === 0 ? '' : res.firewall
        this.rootForm.remark = res.remark
        this.setRegion(res)
      })
    },

    setRegion(data) {
      const region = []
      const { country_code, city_code, region_code, province_code } = data
      const city_length = this.CITY.length
      let check_city = {}
      for (let i = 0; i < city_length; i++) {
        if (this.CITY[i].country_code === country_code && country_code === 'CN') {
          if (this.CITY[i].province_code === province_code && city_code && city_code === this.CITY[i].city_code) {
            check_city = this.CITY[i]
            break
          }
          if (this.CITY[i].province_code === province_code && !city_code && !this.CITY[i].city_code) {
            check_city = this.CITY[i]
            break
          }
        } else if (['TW', 'HK', 'MO'].indexOf(country_code) > -1 && this.CITY[i].country_code === country_code) {
          check_city = this.CITY[i]
          break
        } else if (this.CITY[i].country_code === country_code && !region_code && !province_code && !city_code) {
          check_city = this.CITY[i]
          break
        }
      }
      if (country_code === 'CN' && !city_code && city_code === check_city.city_code) {
        region.push(check_city.country_code)
        region.push(check_city.region_code)
        region.push(check_city.province_code)
        this.rootForm.country_code = check_city.country_code
        this.rootForm.region_code = check_city.region_code
        this.rootForm.province_code = check_city.province_code
        this.rootForm.city_code = check_city.city_code
      }
      if (country_code === 'CN' && city_code && city_code === check_city.city_code) {
        region.push(check_city.country_code)
        region.push(check_city.region_code)
        region.push(check_city.province_code)
        region.push(check_city.city_code)
        this.rootForm.country_code = check_city.country_code
        this.rootForm.region_code = check_city.region_code
        this.rootForm.province_code = check_city.province_code
        this.rootForm.city_code = check_city.city_code
      }
      if (['TW', 'HK', 'MO'].indexOf(country_code) > -1 && check_city) {
        region.push(check_city.region_code)
        region.push(check_city.country_code)
        this.rootForm.region_code = check_city.region_code
        this.rootForm.country_code = check_city.country_code
      }
      if (country_code === check_city.country_code && !region_code && !province_code && !city_code) {
        region.push(check_city.big_state_code)
        region.push(check_city.country_code)
        this.rootForm.big_state_code = check_city.big_state_code
        this.rootForm.country_code = check_city.country_code
      }
      this.rootForm.region = region
      this.setUkey()
    },
    setUkey(region_text) {
      const idc_name = this.rootForm.name
      const isp_name = this.ISP_LINES.filter(i => i.value === this.rootForm.isp)[0] && this.ISP_LINES.filter(i => i.value === this.rootForm.isp)[0].label || ''
      const region_name = region_text || this.getRegionText(this.rootForm) || this.$refs.region_name.$el.innerText
      let ukey_text = ''
      if (idc_name) ukey_text = idc_name
      if (region_name) ukey_text = ukey_text ? ukey_text + '-' + region_name : region_name
      if (isp_name) ukey_text = ukey_text ? ukey_text + '-' + isp_name : isp_name
      this.rootForm.ukey = ukey_text
    },
    changeIsp() {
      this.rootForm.name = this.rootForm.name.trim()
      this.setUkey()
    },
    changeRegion(value, i) {
      this.rootForm.big_state_code = ''
      this.rootForm.country_code = ''
      this.rootForm.region_code = ''
      this.rootForm.province_code = ''
      this.rootForm.city_code = ''
      if (this.rootForm.region[0] === 'CN') {
        this.rootForm.country_code = this.rootForm.region[0] || ''
        this.rootForm.region_code = this.rootForm.region[1] || ''
        this.rootForm.province_code = this.rootForm.region[2] || ''
        this.rootForm.city_code = this.rootForm.region[3] || ''
      } else if (this.rootForm.region[0] === 'GAT') {
        this.rootForm.region_code = this.rootForm.region[0] || ''
        this.rootForm.country_code = this.rootForm.region[1] || ''
      } else {
        this.rootForm.big_state_code = this.rootForm.region[0] || ''
        this.rootForm.country_code = this.rootForm.region[1] || ''
      }

      this.setUkey(this.getRegionText(this.rootForm))
    },
    getRegionText() {
      const { country_code, city_code, region_code, province_code } = this.rootForm
      let region_text = ''
      const city_length = this.CITY.length
      let check_city = {}
      for (let i = 0; i < city_length; i++) {
        if (this.CITY[i].country_code === country_code && country_code === 'CN') {
          if (this.CITY[i].province_code === province_code && city_code && city_code === this.CITY[i].city_code) {
            check_city = this.CITY[i]
            break
          }
          if (this.CITY[i].province_code === province_code && !city_code && !this.CITY[i].city_code) {
            check_city = this.CITY[i]
            break
          }
        } else if (['TW', 'HK', 'MO'].indexOf(country_code) > -1 && this.CITY[i].country_code === country_code) {
          check_city = this.CITY[i]
          break
        } else if (this.CITY[i].country_code === country_code && !region_code && !province_code && !city_code) {
          check_city = this.CITY[i]
          break
        }
      }
      if (country_code === 'CN' && !city_code) region_text = check_city.country_name + '-' + check_city.region_name + '-' + check_city.province_name
      if (country_code === 'CN' && city_code) region_text = check_city.country_name + '-' + check_city.region_name + '-' + check_city.province_name + '-' + check_city.city_name
      if (['TW', 'HK', 'MO'].indexOf(country_code) > -1 && check_city) region_text = '中国海外' + '-' + check_city.country_name
      if (!region_code && !province_code && !city_code) region_text = check_city.big_state_name + '-' + check_city.country_name
      return region_text
    },
    resetForm(formName) {
      this.$nextTick(() => {
        if (this.$refs[formName]) this.$refs[formName].resetFields()
      })
    },
    handleClose() {
      this.open = false
    },

    handleSubmint() {
      this.$refs.rootForm.validate((valid) => {
        if (valid) {
          if (this.panelType === 'add') this.handleAdd()
          if (this.panelType === 'edit') this.handleUpdate()
        }
      })
    },
    getParams() {
      const params = {
        name: this.rootForm.name,
        isp: this.rootForm.isp,
        firewall_power: this.rootForm.firewall_power,
        remark: this.rootForm.remark
      }
      if (this.rootForm.id) params.id = this.rootForm.id
      if (this.rootForm.ukey) params.ukey = this.rootForm.ukey
      params.big_state_code = this.rootForm.big_state_code || ''
      params.country_code = this.rootForm.country_code || ''
      params.region_code = this.rootForm.region_code || ''
      params.province_code = this.rootForm.province_code || ''
      params.city_code = this.rootForm.city_code || ''
      if ((this.rootForm.firewall_power) === 1) params.firewall = Number(this.rootForm.firewall)
      return params
    },
    handleAdd() {
      const data = this.getParams()
      this.InvokeAssetApi.post('/idc_house/add', data).then(res => {
        this.Message('ACTION_SUCCESS')
        this.$emit('handleLoad')
        this.open = false
      })
    },

    handleUpdate() {
      const data = this.getParams()
      this.InvokeAssetApi.post('/idc_house/update', data).then(res => {
        this.Message('ACTION_SUCCESS')
        this.$emit('handleLoad')
        this.open = false
      })
    }
  }
}
</script>
