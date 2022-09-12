<style lang="scss" scoped>
.input-box {
  width: 300px;
}
</style>
<template>
  <DmDialog
    ref="dmdialog"
    :fetch-submit="handleSubmit"
    title="报备"
    width="600px"
    aside
    class="dialog-base-report"
  >
    <DmScroll>
      <DmAlert>
        用户邮箱为YUNDUN注册帐号邮箱
      </DmAlert>
      <el-form ref="Form" :model="form" :rules="rules" label-width="100px" label-position="left">
        <el-form-item label="用户邮箱" prop="customer_email">
          <el-autocomplete
            v-model="form.customer_email"
            :fetch-suggestions="query"
            :debounce="500"
            placeholder=""
            clearable
            class="input-box"
            @select="check"
            @change="change"
          />
        </el-form-item>

        <el-form-item label="销售" prop="customer_sale">
          <DmSelect
            v-model="form.customer_sale"
            :selects="option.customer_sale"
            multiple
            placeholder=""
            class="input-box"
          />
        </el-form-item>
        <el-form-item label="服务等级" prop="customer_level">
          <DmSelect
            v-model="form.customer_level"
            :selects="option.customer_level"
            clearable
            placeholder=""
            class="input-box"
          />
        </el-form-item>
        <el-form-item label="客户名称" prop="customer_name">
          <el-input v-model="form.customer_name" class="input-box"/>
        </el-form-item>
        <el-form-item label="所属行业" prop="industry_one_level">
          <DmSelect
            v-model="form.industry_one_level"
            :selects="industry_map.one_level_industry_map"
            clearable
            placeholder="一级级行业"
          />
          <DmSelect
            v-model="form.industry_second_level"
            :selects="industry_map.second_level_industry_map"
            clearable
            placeholder="二级行业"
          />
        </el-form-item>

        <el-form-item label="售前支持" prop="customer_sale_before">
          <DmSelect
            v-model="form.customer_sale_before"
            :selects="option.customer_sale_before"
            multiple
            placeholder=""
            class="input-box"
          />
        </el-form-item>
        <el-form-item label="售后支持" prop="customer_sale_after">
          <DmSelect
            v-model="form.customer_sale_after"
            :selects="option.customer_sale_after"
            multiple
            placeholder=""
            class="input-box"
          />
        </el-form-item>
      </el-form>
    </DmScroll>
  </DmDialog>
</template>
<script>
import { mapState } from 'vuex'
function formartList(data = {}) {
  let list = []
  if (Object.keys(data).length) {
    list = Object.keys(data).map(i => { return { label: data[i], value: i } })
  }
  return list
}
function formartindustry(list = []) {
  let industry = []
  industry = list.filter(i => Number(i.pid) === 0)
  industry.forEach(i => {
    const children = list.filter(c => i.id === c.pid)
    if (children.length) {
      i.children = children
    }
  })
  return industry
}
export default {
  data() {
    return {
      form: {
        customer_email: '',
        customer_name: '',
        customer_type: '',
        customer_level: '',
        customer_sale: [],
        customer_sale_after: [],
        customer_sale_before: [],
        // customer_industry_type: [],
        industry_one_level: '',
        industry_second_level: ''
      },
      rules: {
        customer_email: [{ required: true, message: ' ' }],
        customer_name: [],
        customer_level: [{ required: true, message: ' ' }],
        customer_type: [],
        customer_sale: [{ required: true, message: ' ' }],
        customer_sale_after: [],
        customer_sale_before: [],
        industry_one_level: [],
        industry_second_level: []
      },
      option: {
        customer_type: [],
        customer_level: [],
        customer_sale: [],
        customer_sale_after: [],
        customer_sale_before: [],
        customer_industry_type: []
      },
      industry_map: {}
    }
  },
  computed: {
    ...mapState({
      conf: state => state.finance.conf
    })
  },

  watch: {
    conf: {
      handler(val) {
        if (val && val.basic_conf && val.basic_conf.member_level) {
          this.option.customer_level = val.basic_conf.member_level.map(i => { return { label: i, value: i } })
        }
        if (val && val.basic_conf && val.basic_conf.member_type) {
          this.option.customer_type = Object.keys(val.basic_conf.member_type).map(i => {
            return { label: val.basic_conf.member_type[i], value: i }
          })
        }
        if (val && val.group) {
          if (val.group.find(i => { return i.role_flag === 'CRM_NORMAL_MARKET' })) {
            this.option.customer_sale = val.group.find(i => { return i.role_flag === 'CRM_NORMAL_MARKET' }).children
          }
          if (val.group.find(i => { return i.role_flag === 'CRM_AFTER_SALES' })) {
            this.option.customer_sale_after = val.group.find(i => { return i.role_flag === 'CRM_AFTER_SALES' }).children
          }
          if (val.group.find(i => { return i.role_flag === 'CPM_PRE_SALES' })) {
            this.option.customer_sale_before = val.group.find(i => { return i.role_flag === 'CPM_PRE_SALES' }).children
          }
        }
        if (val && val.industry) {
          this.option.customer_industry_type = formartindustry(val.industry)
        }
      },
      deep: true
    }
  },

  methods: {
    handleOpen(industry_map = []) {
      this.industry_map = industry_map
      this.$nextTick(() => {
        this.$refs.dmdialog.handleOpen()
        if (this.$refs.Form) {
          this.$refs.Form.resetFields()
        }
      })
    },

    query(val, cb) {
      let data = []
      if (val !== '') {
        const params = {
          username: this.form.customer_email,
          type: '1'
        }
        this.Fetch.post('/V4/Account.Member.like', params).then(res => {
          const list = res.list
          if (list && list !== []) {
            data = formartList(list)
          }
          if (data.length === 0) {
            this.message.warning('未找到用户!')
          }
          cb(data)
        }).catch(e => {
          cb(data)
        })
      }
    },

    check(e) {
      if (e) {
        this.Fetch.post('/fd/V4/customer.manage.isrelation', { customer_email: e.value }).then(res => {
          if (res.relation === true) {
            this.form.customer_email = ''
            this.message.warning('客户已报备!')
          }
        }).catch(() => {
          this.form.customer_email = ''
        })
      }
    },

    change(e) {
      if (!e) {
        this.form.customer_email = ''
      }
    },

    handleSubmit() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          this.Fetch.post('/fd/V4/customer.manage.savebasicinfo', { ...this.form }).then(res => {
            this.Message('ACTION_SUCCESS')
            this.$emit('init')
            this.$refs.dmdialog.handleClose()
          }).catch(e => {
            this.$refs.dmdialog.afterValidate()
          })
        } else {
          this.$refs.dmdialog.afterValidate()
        }
      })
    }
  }
}
</script>
