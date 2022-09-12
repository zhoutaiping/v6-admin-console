<style lang="postcss" scoped>
.app-center-room-index {
  padding: 12px;
  .search-form-input {
    width: 200px;
    margin:0 2px 5px;
  }
  .optionBtn {
    margin:0 2px;
  }
}
</style>

<template>
  <div class="app-center-room-index">
    <div style="margin-bottom: 12px;">
      <InputSearch
        v-model="bindParams.id"
        placeholder="角色名称"
        class="search-form-input"
        @submit="$refs.DmData.initPage()"
      />
      <InputSearch
        v-model="bindParams.name"
        placeholder="请输入IDC供应商"
        class="search-form-input"
        @submit="$refs.DmData.initPage()"
      />
      <el-cascader
        :options="BIG"
        v-model="bindParams.region"
        clearable
        filterable
        change-on-select
        placeholder="请选择地区"
        class="search-form-input"
        @change="changeRegion"/><br>
      <el-select v-model="bindParams.isp" clearable placeholder="请选择ISP" class="search-form-input" @change="$refs.DmData.initPage()">
        <el-option v-for="(item, index) in ISP" :key="index" :label="item.label" :value="item.value"/>
      </el-select>
      <el-select
        v-model="bindParams.firewall_power"
        clearable
        placeholder="防火墙权限"
        class="search-form-input"
        @change="$refs.DmData.initPage()">
        <el-option v-for="(item, index) in FIREWALL_POWER" :key="index" :label="item.label" :value="item.value"/>
      </el-select>
      <el-select
        v-model="bindParams.firewall"
        clearable
        placeholder="请选择防火墙"
        class="search-form-input"
        @change="$refs.DmData.initPage()">
        <el-option v-for="(item, index) in FIREWALL" :key="index" :label="item.label" :value="item.value"/>
      </el-select>
      <el-button type="primary" icon="el-icon-search" class="optionBtn" @click="$refs.DmData.initPage()">搜 索</el-button>
      <el-button type="primary" icon="el-icon-plus" class="optionBtn" @click="handleRowClick(null,'add')">新 增 </el-button>
    </div>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable v-loading="loading">
        <el-table :data="list">
          <el-table-column
            v-for="(item,key) in defalutColumns"
            :key="key"
            :label="item.label"
            :fixed="item.fixed"
            :width="item.width"
            :show-overflow-tooltip="item.show_overflow_tooltip || true">
            <template slot-scope="scope">
              {{ formartValue(scope.row, item.prop) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="left" fixed="right" width="250">
            <template slot-scope="scope">
              <a class="color--primary" style="margin:0 5px;" @click="handleRowClick(scope.row,'info')">详 情</a>
              <a class="color--primary" style="margin:0 5px;" @click="handleRowClick(scope.row,'edit')">编 辑</a>
              <a-popconfirm title="是否确定删除?" ok-text="确定" cancel-text="取消" @confirm="handleDel(scope.row,'del')">
                <a class="color--primary" style="margin:0 5px;" >删 除</a>
              </a-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogEdit ref="dialogEdit" @handleLoad="$refs.DmData.initPage()" />
    <el-tooltip placement="top" content="回到顶部">
      <back-to-top
        :custom-style="myBackToTopStyle"
        :visibility-height="300"
        :back-position="50"
        transition-name="fade" />
    </el-tooltip>
  </div>
</template>

<script>
import * as Form from './form'
import DialogEdit from './components/DialogEdit'
import consoleData from '@/mixins/consoleData'
export default {
  components: { DialogEdit },
  mixins: [consoleData],
  data() {
    return {
      bindParams: Form.search,
      fetch: this.InvokeAssetApi,
      API_INDEX: '/idc_house/list',
      myBackToTopStyle: Form.myBackToTopStyle,
      REGION: [{ label: '全部', value: '' }],
      FIREWALL: Form.FIREWALL,
      FIREWALL_POWER: Form.FIREWALL_POWER,
      ISP: Form.ISP,
      defalutColumns: Form.COLUMN,
      BIG: [],
      CITY: []
    }
  },
  created() {
    this.getRegion()
  },
  methods: {
    changeRegion(value) {
      this.bindParams.country_code = ''
      this.bindParams.region_code = ''
      this.bindParams.province_code = ''
      this.bindParams.city_code = ''
      if (value[0] === 'CN') {
        this.bindParams.country_code = value[0] || ''
        this.bindParams.region_code = value[1] || ''
        this.bindParams.province_code = value[2] || ''
        this.bindParams.city_code = value[3] || ''
      } else if (value[0] === 'GAT') {
        this.bindParams.region_code = value[0] || ''
        this.bindParams.country_code = value[1] || ''
      } else {
        this.bindParams.big_state_code = value[0] || ''
        this.bindParams.country_code = value[1] || ''
      }
      this.$refs.DmData.initPage()
    },
    formartValue(row, prop) {
      const isp_text = { dx: '电信', lt: '联通', yd: '移动', bgp: 'BGP', cn2: 'CN2', gjxl: '国际线路', other: '其他' }
      let row_text = row[prop]
      switch (prop) {
        case 'firewall_power':
          if ((+row[prop]) === 0) {
            row_text = '无权限'
          } else {
            const text = this.FIREWALL.filter(i => i.value === row.firewall.toString())[0] && this.FIREWALL.filter(i => i.value === row.firewall.toString())[0].label || '--'
            row_text = '有权限--' + text
          }
          break
        case 'isp':
          row_text = isp_text[row[prop]]
          break
        case 'city_code':
          row_text = this.getCityName(row)
          break
        default:
          row_text = row_text || '--'
          break
      }
      return row_text
    },

    getCityName(data) {
      const { country_code, city_code, region_code, province_code } = data
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

    handleRowClick(row, type) {
      const data = JSON.parse(JSON.stringify(row)) || {}
      switch (type) {
        case 'add':
          this.$refs.dialogEdit.handleOpen(data, 'add', this.BIG, this.CITY)
          break
        case 'info':
          this.$refs.dialogEdit.handleOpen(data, 'info', this.BIG, this.CITY)
          break
        case 'edit':
          this.$refs.dialogEdit.handleOpen(data, 'edit', this.BIG, this.CITY)
          break
      }
    },

    handleDel(row) {
      const data = JSON.parse(JSON.stringify(row)) || {}
      this.InvokeAssetApi.post('/idc_house/del', { id: data.id }).then(res => {
        this.Message('ACTION_SUCCESS')
        this.$refs.DmData.initPage()
      })
    },

    getRegion() {
      const region = require('@/utils/region')
      this.InvokeAssetApi.get('/region/get', { page: 1 }).then(res => {
        const list = JSON.parse(JSON.stringify(res.list))
        this.CITY = list
        this.BIG = region.getBig(list)
      })
    }
  }
}
</script>
