<style lang="scss" scoped>
.dialog-base-info {
  .dialog-form-item {
    margin-bottom: 5px;
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
    :title="title"
    :footer="false"
    width="600px"
    aside
  >
    <DmScroll>
      <el-tabs
        v-model="typePanel"
        @tab-click="tabClick"
      >
        <el-tab-pane
          v-for="pane in tabPanel"
          :key="pane.name"
          :label="pane.label"
          :name="pane.name"
        />
      </el-tabs>
      <el-form
        v-show="typePanel === 'user'"
        ref="infoForm"
        :model="infoForm"
        :rules="INFOFORM_RULE"
        label-position="left"
        label-width="140px"
        size="mini"
        class="dialog-form"
      >
        <h3>客户基本信息</h3>
        <hr>
        <el-form-item
          label="YUNDUN注册账号"
          class="dialog-form-item"
        >
          {{ infoForm.customer_email || '--' }}
        </el-form-item>
        <el-form-item
          label="客户报备名称"
          class="dialog-form-item"
        >
          {{ infoForm.customer_name }}
        </el-form-item>
        <el-form-item
          label="服务等级"
          class="dialog-form-item"
        >
          {{ infoForm.customer_level }}
        </el-form-item>
        <el-form-item
          label="是否付费客户"
          class="dialog-form-item"
        >
          {{ infoForm.is_give_money === '1' ? '是': '否' }}
        </el-form-item>
        <h3>客户所属</h3>
        <hr>
        <div v-if="salesTextList.length >0">
          <el-form-item
            v-for="(item, key) in salesTextList"
            :key="key"
            :label="item.label"
            class="dialog-form-item"
          >
            <span class="dialog-form-input">{{ item.value || '未关联' }}</span>
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item
            label="销售"
            class="dialog-form-item"
          >
            未关联
          </el-form-item>
        </div>
        <h3>行业类型</h3>
        <hr>
        <el-form-item
          label=""
          label-width="0px"
          class="dialog-form-item"
        >
          {{ infoForm.industry }}
        </el-form-item>
      </el-form>
      <Editinfolist
        v-show="typePanel === 'service'"
        ref="editinfolist"
      />
      <Editinfolist2
        v-show="typePanel === 'service-2'"
        ref="editinfolist2"
      />
    </DmScroll>
  </DmDialog>
</template>
<script>
import * as FORM from './c-form.js'
import Editinfolist from './editinfolist'
import Editinfolist2 from './editinfolist-2'

export default {
  components: { Editinfolist, Editinfolist2 },
  props: {
    basic_conf: {
      type: Object, default: () => { }
    },
    industry: {
      type: Array, default: () => []
    },
    role_list: {
      type: Array, default: () => []
    },
    user_list: {
      type: Array, default: () => []
    }
  },
  data() {
    return {
      loading: false,
      title: '客户信息详情',
      typePanel: '',
      tabPanel: [{ label: '客户详情', name: 'user' }, { label: '管理记录', name: 'service' }],
      infoForm: {},
      INFOFORM_RULE: FORM.INFOFORM_RULE,
      salesType: ['CRM_AFTER_SALES', 'CPM_PRE_SALES', 'CRM_NORMAL_MARKET'],
      industry_G: '',
      industry_I: '',
      industryGroup: [],
      industryChildren: [],
      salesTextList: [],
      IS_NO_COMMISSION_TEXT: { 1: '是', 2: '否', 3: '未选择', '': '--' }, // 业绩不计提成：1-是，2-否
      IS_STRATEGIC_COUSTOMER_TEXT: { 1: '是', 2: '否', 3: '未选择', '': '--' }

    }
  },
  mounted() {

  },
  methods: {
    init_industry(val) {
      this.industry_G = ''
      this.industry_I = ''
      this.industryGroup = []
      this.industryChildren = []
      this.industryGroup = FORM.setIndustryGroup(val)
    },
    handleOpen(data) {
      // this.init_industry(this.industry)
      this.$nextTick(() => {
        this.$refs.dmdialog.handleOpen()
        this.loading = true
        this.infoForm = Object.assign({}, {})
        this.typePanel = 'user'
        this.setFieldValue(data)
        setTimeout(() => { this.loading = false }, 1000)
      })
    },
    tabClick() {
      if (this.typePanel === 'service' && this.$refs.editinfolist) this.$refs.editinfolist.handleLoad(this.infoForm.member_id)
      // if (this.typePanel === 'service-2' && this.$refs.editinfolist2) this.$refs.editinfolist2.handleLoad(this.infoForm.member_status)
    },
    setFieldValue(data) {
      this.infoForm = data
      this.getSalesText(data.user_list)
    },
    getCustomerNums(value) {
      if (!value) return
      const member_nums = this.basic_conf.member_nums
      return member_nums && member_nums[value] || '--'
    },

    getCustomerStage(value) {
      const financing_stage = this.basic_conf.financing_stage
      return financing_stage && financing_stage[value] || '--'
    },
    getFieldValue() {
      const paramsData = {}
      return paramsData
    },

    getSalesText(user_list) {
      const salesTextList = []
      Object.keys(user_list).forEach(role_id => {
        const role = this.role_list.find(R_item => {
          return parseInt(R_item.id) === parseInt(role_id)
        })
        let UserList = ''
        user_list[role_id].forEach((item, index) => {
          const user = this.user_list.find(U_item => {
            return parseInt(U_item.user_id) === parseInt(item)
          })
          if (user) {
            if (index === 0) {
              UserList = user.name
            } else {
              UserList = user.name + ',' + UserList
            }
          }
        })

        salesTextList.push({
          label: role.role_name,
          value: UserList
        })
      })
      this.salesTextList = salesTextList
    }
  }

}
</script>
