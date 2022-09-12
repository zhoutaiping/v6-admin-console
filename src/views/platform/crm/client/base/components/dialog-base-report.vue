
<style lang="scss" scoped>
.dialog-base-report{
  .dialog-form{
    margin-top: 10px;
  }
  .dialog-form-input {
    width: 250px;
  }
  .coupon-list-item {
    margin: 6px 0 6px 2px;
    border-left: 1px solid #dcdfe6;
    border-radius: 0;
  }
}
</style>
<template>
  <DmDialog
    ref="dmdialog"
    :fetch-submit="handleSubmit"
    :title="pannelType === 'edit'?'基本信息变更':title"
    width="600px"
    aside
    class="dialog-base-report"
  >
    <DmScroll>
      <el-form ref="reportForm" :model="reportForm" :rules="REPORTFORM_RULE" label-position="left" label-width="140px" size="mini" class="dialog-form">
        <el-form-item v-if="pannelType === 'edit'" label="变更类型" prop="edit_type">
          <el-select v-model="reportForm.edit_type" clearable class="dialog-form-input">
            <el-option v-for="(item, index) in EDITTYPE" :key="index" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="pannelType === 'edit'" label="变更原因" prop="remark">
          <el-input v-model="reportForm.remark" type="textarea" placeholder="变更原因" class="dialog-form-input"/>
        </el-form-item>
        <h3>客户基本信息</h3><hr>
        <el-form-item label="YUNDUN注册账号" prop="customer_email">
          <el-select
            v-model="reportForm.customer_email"
            :remote-method="remoteMethod"
            :disabled="pannelType === 'edit'"
            :loading="user_type_loading"
            filterable=""
            remote
            clearable
            reserve-keyword
            placeholder="请输入云盾注册用户邮箱"
            class="dialog-form-input"
            @change="handleAccount">
            <el-option v-for="(item, key) in user_type_list" :key="key" :label="item.label" :value="item.label"/>
          </el-select>
        </el-form-item>
        <el-form-item label="客户名称" prop="customer_name">
          <el-input v-model="reportForm.customer_name" clearable placeholder="客户名称" class="dialog-form-input"/>
        </el-form-item>
        <!-- <el-form-item label="客户层级" prop="customer_type">
          <el-select v-model="reportForm.customer_type" placeholder="请选择服务等级" clearable class="dialog-form-input">
            <el-option v-for="(item, key) in Object.keys(CUSTOMER_TYPE)" :key="key" :label="CUSTOMER_TYPE[item]" :value="item"/>
          </el-select>
        </el-form-item> -->
        <el-form-item label="服务等级" prop="customer_level">
          <el-select v-model="reportForm.customer_level" placeholder="请选择服务等级" clearable class="dialog-form-input">
            <el-option v-for="(item,key) in MEMBER_LEVEL" :key="key" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <h3>客户所属</h3><hr>
        <el-form-item label="普通销售" class="dialog-form-item" prop="customer_sale">
          <el-select v-model="reportForm.customer_sale" multiple collapse-tags placeholder="请选择销售" clearable class="dialog-form-input">
            <el-option v-for="(item,key) in CRM_NORMAL_MARKET" :key="key" :disabled="Number(item.status) === 0" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="售后技术支持" prop="customer_sale_after">
          <el-select v-model="reportForm.customer_sale_after" multiple collapse-tags placeholder="请选择售后技术支持" clearable class="dialog-form-input">
            <el-option v-for="(item,key) in CRM_AFTER_SALES" :key="key" :disabled="Number(item.status) === 0" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="售前技术支持" prop="customer_sale_before">
          <el-select v-model="reportForm.customer_sale_before" multiple collapse-tags placeholder="请选择售前技术支持" clearable class="dialog-form-input">
            <el-option v-for="(item,key) in CPM_PRE_SALES" :key="key" :disabled="Number(item.status) === 0" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <h3>行业类型</h3><hr>
        <el-form-item label="行业类型" class="dialog-form-item" >
          <el-radio-group v-model="industry_G" @change="changeGroup">
            <el-radio-button v-for="(v, k) in industryGroup" :label="v.value" :key="k" border class="coupon-list-item">{{ v.label }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="industryChildren.length > 0" label="子行业类型" class="dialog-form-item">
          <el-radio-group v-model="industry_I" @change="changeItem">
            <el-radio-button v-for="(v, k) in industryChildren" :label="v.value" :key="k" border>{{ v.label }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </DmScroll>
  </DmDialog>
</template>
<script>
import * as FORM from './c-form.js'
import BaseResource from '@/api/client/baseApi'
import MealResource from '@/api/mealApi'
import { debounce } from 'throttle-debounce'
import * as Utils from '@/utils/index'
export default {
  props: {
    basic_conf: {
      type: Object, default: () => null
    },
    industry: {
      type: Array, default: () => []
    },
    role_list: {
      type: Array, default: () => []
    },
    user_list: {
      type: Array, default: () => []
    },
    salesGroup: {
      type: Array, default: () => []
    }
  },
  data() {
    return {
      loading: false,
      user_type_loading: false,
      user_type_list: [],
      MEMBER_NUMS: [],
      MEMBER_LEVEL: [],
      CUSTOMER_TYPE: {}, // 客户层级
      FINANCING_STAGE: [],
      open: false,
      title: '报备客户信息',
      reportForm: {},
      REPORTFORM_RULE: FORM.REPORTFORM_RULE,
      CRM_AFTER_SALES: [],
      CPM_PRE_SALES: [],
      CRM_NORMAL_MARKET: [],
      industry_G: '',
      industry_I: '',
      industryGroup: [],
      industryChildren: [],
      pannelType: 'add',
      // 业绩不计提成：1-是，2-否
      IS_NO_COMMISSION: [{ label: '是', value: '1' }, { label: '否', value: '2' }, { label: '未选择', value: '3' }],
      IS_STRATEGIC_COUSTOMER: [{ label: '是', value: '1' }, { label: '否', value: '2' }, { label: '未选择', value: '3' }],
      EDITTYPE: FORM.EDITTYPE, // 更改类型
      oldForm: {}
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    inintPanel() {
      this.init_basic_conf(this.basic_conf)
      this.init_salesGroup(this.salesGroup)
      this.init_industry(this.industry)
    },
    init_basic_conf(val) {
      this.MEMBER_LEVEL = val.member_level || []
      this.CUSTOMER_TYPE = val.member_type || {}
      this.setMembernums(val.member_nums)
      this.setFinancingStage(val.financing_stage)
    },
    init_salesGroup(val) {
      this.setSalesMapList(val)
    },
    init_industry(val) {
      this.industry_G = ''
      this.industry_I = ''
      this.industryGroup = []
      this.industryChildren = []
      this.industryGroup = FORM.setIndustryGroup(val)
    },
    handleOpen(data, type) {
      this.$refs.dmdialog.handleOpen()
      this.inintPanel()
      this.$nextTick(() => {
        this.loading = true
        this.pannelType = type
        this.reportForm = Object.assign(Utils.deepClone(FORM.REPORTFORM), {})
        this.$refs.reportForm && this.$refs.reportForm.clearValidate()
        const row_data = data || {}
        this.oldForm = {}
        if (type === 'edit') this.setFieldValue(row_data)
        setTimeout(() => { this.loading = false }, 1000)
      })
    },

    setFieldValue(data) {
      this.reportForm = {
        'member_id': data.member_id || '',
        'customer_email': data.customer_email || '',
        'customer_name': data.customer_name || '',
        'customer_level': data.customer_level || '',
        'customer_type': data.member_type || '',
        'customer_nums': Number(data.customer_nums) !== 0 && data.customer_nums !== '' ? data.customer_nums : '',
        'customer_stage': Number(data.customer_stage) !== 0 && data.customer_stage !== '' ? data.customer_stage : '',
        'customer_sale': this.setSalesList(data.user_list, 'CRM_NORMAL_MARKET') || [],
        'customer_sale_after': this.setSalesList(data.user_list, 'CRM_AFTER_SALES') || [],
        'customer_sale_before': this.setSalesList(data.user_list, 'CPM_PRE_SALES') || [],
        'customer_industry_type': this.setIndustry(data.industryType),
        'is_no_commission': data.is_no_commission || '3',
        'is_strategic_coustomer': data.is_strategic_coustomer || '3'
      }
      this.oldForm = JSON.parse(JSON.stringify(this.reportForm))
    },

    setSalesList(userList, type) {
      let list = []
      Object.keys(userList).forEach(U_Item => {
        const sales_group = this.salesGroup.find(item => {
          return parseInt(item.role_id) === parseInt(U_Item)
        })
        if (sales_group && sales_group.role_flag === type) list = userList[U_Item]
      })
      return list
    },

    setIndustryGroup(list) {
      const group = []
      const newList = []
      list.forEach(item => {
        const find_index = group.indexOf(item.id)
        if (find_index < 0 && parseInt(item.pid || 0, 10) === 0) {
          group.push(item.id)
          newList.push({
            label: item.industry_name,
            value: item.id,
            children: []
          })
        }
      })

      return newList
    },

    setIndustry(value) {
      let list = []
      const industry_id = value && value.length ? value[0] : ''
      const industryItem = this.industry.find(item => {
        return item.id === (industry_id || '')
      })
      list = industry_id ? [industry_id] : []
      if (industryItem && parseInt(industryItem.pid, 10) === 0) {
        this.industry_G = (industry_id || '')
      } else if (industryItem && parseInt(industryItem.pid, 10) !== 0) {
        this.industry_I = (industry_id || '')
        this.industry_G = industryItem.pid
        this.industry.forEach(item => {
          if ((item.pid || '0') === industryItem.pid) {
            this.industryChildren.push({
              label: item.industry_name,
              value: item.id,
              pid: item.pid || '0'
            })
          }
        })
      }
      return list
    },
    changeGroup(value) {
      this.industryChildren = []
      this.industry_I = ''
      this.reportForm.customer_industry_type = []
      this.industry.forEach(item => {
        if ((item.pid || '0') === value) {
          this.industryChildren.push({
            label: item.industry_name,
            value: item.id,
            pid: item.pid || '0'
          })
        }
      })
      if (this.industryChildren.length === 0) {
        const industry_id = [value]
        this.reportForm.customer_industry_type = industry_id
      }
    },
    changeItem(value) {
      const industry_id = [value]
      this.reportForm.customer_industry_type = industry_id
    },
    setMembernums(member_nums) {
      const MEMBER_NUMS = []
      Object.keys(member_nums).forEach(i => {
        MEMBER_NUMS.push({
          label: member_nums[i],
          value: i
        })
      })
      this.MEMBER_NUMS = MEMBER_NUMS
    },
    setFinancingOrg(financing_org) {
      const FINANCING_ORG = []
      Object.keys(financing_org).forEach(i => {
        FINANCING_ORG.push({
          label: financing_org[i],
          value: i
        })
      })
      this.FINANCING_ORG = FINANCING_ORG
    },
    setSalesMapList(Grouplist) {
      Grouplist.forEach(item => {
        const role_flag = item.role_flag
        if (role_flag === 'CRM_NORMAL_MARKET') {
          this.CRM_NORMAL_MARKET = item.children && item.children.length ? item.children : []
        } else if (role_flag === 'CPM_PRE_SALES') {
          this.CPM_PRE_SALES = item.children && item.children.length ? item.children : []
        } else if (role_flag === 'CRM_AFTER_SALES') {
          this.CRM_AFTER_SALES = item.children && item.children.length ? item.children : []
        }
      })
    },

    setFinancingStage(financing_stage) {
      const FINANCING_STAGE = []
      Object.keys(financing_stage).forEach(i => {
        FINANCING_STAGE.push({
          label: financing_stage[i],
          value: i
        })
      })
      this.FINANCING_STAGE = FINANCING_STAGE
    },

    remoteMethod(query) {
      if (query.trim() !== '') {
        this.user_type_loading = true
        debounce(1000, this.getUserTypeList(query.trim()))
      } else {
        this.user_type_loading = false
        this.user_type_list = []
      }
    },
    async getUserTypeList(username) {
      if (!username) {
        this.user_type_list = []
        this.user_type_loading = false
        return
      }
      const params = {
        'username': username, 'type': '1'
      }
      const list = []
      // 获取用户列表
      const res = await MealResource.getMemberList(params)
      if (res.list !== [] || !Object.keys(res.list).length) {
        Object.keys(res.list).forEach(item => {
          list.push({
            'label': item,
            'value': res.list[item]
          })
        })
      }
      const user_type_list = username ? list.filter(this.filterMeber(username, 'label')) : []
      this.user_type_list = user_type_list
      this.user_type_loading = false
    },

    async querySearch(username, cb) {
      const username_Str = username.trim()
      if (!username_Str) return
      const params = {
        'username': username_Str, 'type': '1'
      }
      const list = [] // 获取用户列表
      const res = await MealResource.getMemberList(params)
      if (res.list !== [] || !res.list) {
        Object.keys(res.list).forEach(item => {
          list.push({
            'email': item,
            'member_id': res.list[item]
          })
        })
      }
      const results = username_Str ? list.filter(this.filterMeber(username_Str, 'email')) : []
      // 调用 callback 返回建议列表的数据
      cb(results)
    },

    filterMeber(username, key) {
      return (restaurant) => {
        const findIndex = restaurant[key].indexOf(username.trim())
        if (findIndex > -1) {
          return restaurant
        }
      }
    },
    handleAccount(value) {
      if (!value.trim()) return
      const params = {
        customer_email: value.trim()
      }
      BaseResource.isRelation(params).then(res => {
        if (res.relation) {
          this.message.warning('客户已报备!')
          this.reportForm.customer_email = ''
        } else {
          this.reportForm.customer_email = value
        }
      }).catch(e => {
        this.reportForm.customer_email = ''
      })
    },
    handleClose(formName) {
      this.$refs[formName].resetFields()
      this.open = false
      this.$emit('handleload')
    },
    getFieldValue() {
      const data = this.reportForm
      const paramsData = {
        'member_id': data.member_id,
        'customer_email': data.customer_email,
        'customer_name': data.customer_name,
        'customer_level': data.customer_level,
        'customer_type': data.customer_type,
        'customer_nums': data.customer_nums,
        'customer_stage': data.customer_stage,
        'customer_sale': data.customer_sale,
        'customer_sale_after': data.customer_sale_after,
        'customer_sale_before': data.customer_sale_before,
        'customer_industry_type': data.customer_industry_type,
        'is_no_commission': data.is_no_commission,
        'is_strategic_coustomer': data.is_strategic_coustomer
      }
      return paramsData
    },
    getUpParams(params) {
      const paramsData = JSON.parse(JSON.stringify(params))
      paramsData['edit_type'] = this.reportForm.edit_type
      if (paramsData['edit_type'] === 'base') {
        paramsData['old_data'] = {
          'customer_email': this.oldForm.customer_email,
          'customer_name': this.oldForm.customer_name,
          'customer_level': this.oldForm.customer_level,
          'customer_type': this.oldForm.customer_type
        }
        paramsData['new_data'] = {
          'customer_email': paramsData.customer_email,
          'customer_name': paramsData.customer_name,
          'customer_level': paramsData.customer_level,
          'customer_type': paramsData.customer_type
        }
        //
      } else if (paramsData['edit_type'] === 'sale') {
        paramsData['old_data'] = {
          'customer_sale': this.oldForm.customer_sale,
          'customer_sale_after': this.oldForm.customer_sale_after,
          'customer_sale_before': this.oldForm.customer_sale_before
        }
        paramsData['new_data'] = {
          'customer_sale': paramsData.customer_sale,
          'customer_sale_after': paramsData.customer_sale_after,
          'customer_sale_before': paramsData.customer_sale_before
        }
        //
      } else if (paramsData['edit_type'] === 'industry') {
        paramsData['old_data'] = { 'customer_industry_type': this.oldForm.customer_industry_type }
        paramsData['new_data'] = { 'customer_industry_type': paramsData.customer_industry_type }
        //
      }
      return paramsData
    },
    handleSubmit(formName = 'reportForm') {
      const customer_industry_type = this.reportForm.customer_industry_type
      this.loading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (customer_industry_type.length === 0) {
            const msgText = this.industryChildren.length > 0 ? '请选择子行业' : '请选择行业'
            this.message.warning(msgText)
            this.$refs.dmdialog.afterValidate()
            return
          }
          let params = this.getFieldValue()
          let api = ''
          if (this.pannelType === 'edit') {
            api = '/fd/V4/customer.manage.updatebasicinfo'
            params = this.getUpParams(params)
          } else {
            api = '/fd/V4/customer.manage.savebasicinfo'
          }
          this.InvokeAllApi.post(api, params).then(res => {
            this.Message('ACTION_SUCCESS')
            this.$refs.dmdialog.handleClose()
          }).catch(e => { this.$refs.dmdialog.afterValidate() })
        } else {
          this.$refs.dmdialog.afterValidate()
        }
      })
    }
  }

}
</script>
