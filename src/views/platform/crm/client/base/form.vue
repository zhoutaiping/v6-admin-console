<style lang="scss" scoped>
.item-box {
  margin-bottom: 5px;
}
.input-box {
  width: 200px;
}
.input-box-time {
  width: 403px;
}
</style>
<template>
  <el-form
    ref="Form"
    :model="form"
  >
    <el-form-item class="item-box">
      <InputSearch
        v-model="form.member_name"
        placeholder="报备名称"
        class="input-box"
        @submit="$emit('init')"
      />
      <InputSearch
        v-model="form.email"
        placeholder="客户邮箱"
        class="input-box"
        @submit="$emit('init')"
      />
      <InputSearch
        v-model="form.certification_name"
        placeholder="认证名称"
        class="input-box"
        @submit="$emit('init')"
      />
      <DmSelect
        v-model="form.sale"
        :selects="option.sale"
        clearable
        placeholder="销售"
        class="input-box"
        @change="$emit('init')"
      />
    </el-form-item>
    <template v-if="option.advanced">
      <el-form-item class="item-box">
        <DmSelect
          v-model="form.reason_top"
          :selects="option.reason_top"
          clearable
          placeholder="主要流失原因"
          class="input-box"
          @change="e =>{
            form.reason_second = ''
            if(e) {
              option.reason_second = option.reason_top[Number(e)].list
            } else {
              option.reason_second = []
            }
            $emit('init')
          }"
        />
        <DmSelect
          v-model="form.reason_second"
          :selects="option.reason_second"
          clearable
          placeholder="流失原因"
          class="input-box"
          @change="e =>{
            $emit('init')
          }"
        />
        <DmSelect
          v-model="form.reason_top_2"
          :selects="option.reason_top"
          clearable
          placeholder="次要流失原因"
          class="input-box"
          @change="e =>{
            form.reason_second_2 = ''
            if(e) {
              option.reason_second_2 = option.reason_top[Number(e)].list
            } else {
              option.reason_second_2 = []
            }
            $emit('init')
          }"
        />
        <DmSelect
          v-model="form.reason_second_2"
          :selects="option.reason_second_2"
          clearable
          placeholder="流失原因"
          class="input-box"
          @change="e =>{
            $emit('init')
          }"
        />
      </el-form-item>
      <el-form-item class="item-box">
        <el-date-picker
          v-model="member_status_time"
          :default-time="['00:00:00', '23:59:59']"
          type="daterange"
          range-separator="-"
          class="input-box-time"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="客户阶段更新开始日期"
          end-placeholder="结束日期"
          @change="e =>{
            form.member_status_time_start = e && e[0] && e[0] || ''
            form.member_status_time_end = e && e[1] && e[1] || ''
            $emit('init')
          }"
        />
        <el-date-picker
          v-model="loss_date"
          :default-time="['00:00:00', '23:59:59']"
          type="daterange"
          range-separator="-"
          class="input-box-time"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="客户流失开始日期"
          end-placeholder="结束日期"
          @change="e =>{
            form.loss_date_start = e && e[0] && e[0] || ''
            form.loss_date_end = e && e[1] && e[1] || ''
            $emit('init')
          }"
        />
      </el-form-item>
    </template>
    <el-form-item class="item-box">
      <el-cascader
        :options="option.industry"
        :props="{
          label:'industry_name',
          value:'id'
        }"
        placeholder="客户行业"
        clearable
        class="input-box"
        @change="e =>{
          if(e) {
            form.industry_id = e[e.length -1] || ''
          }else {
            form.industry_id = ''
          }
          $emit('init')
        }"
      />
      <DmSelect
        v-model="form.member_status"
        :selects="option.member_status"
        placeholder="客户阶段"
        class="input-box"
        @change="$emit('init')"
      />
      <DmSelect
        v-model="form.member_level"
        :selects="option.member_level"
        placeholder="客户等级"
        class="input-box"
        @change="$emit('init')"
      />
      <DmSelect
        v-model="form.is_strategic_coustomer"
        :selects="option.is_strategic_coustomer"
        placeholder="是否战略客户"
        class="input-box"
        @change="$emit('init')"
      />
      <el-button type="primary" @click="$emit('init')">搜 索</el-button>
      <el-button
        type="text"
        @click="e =>{
          option.advanced = !option.advanced
      }" >
        更多搜索
        <i :class="[{'el-icon-arrow-up':option.advanced}, {'el-icon-arrow-down':!option.advanced},'el-icon--right']" />
      </el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { mapState } from 'vuex'
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
  props: {
    vm: {
      type: [Object],
      default: null
    },
    loading: {
      type: [Boolean, String],
      default: false
    }
  },
  data() {
    return {
      form: {
        member_name: '',
        email: '',
        certification_name: '',
        sale: '',
        member_status: '',

        member_status_time_start: '',
        member_status_time_end: '',
        loss_date_start: '',
        loss_date_end: '',

        reason_top: '',
        reason_second: '',
        reason_top_2: '',
        reason_second_2: '',

        industry_id: '',
        member_level: '',
        is_strategic_coustomer: '',
        is_no_commission: ''

      },
      member_status_time: '',
      loss_date: '',
      option: {
        advanced: false,
        customer_type: [],
        member_level: [],
        sale: [],
        member_status: [],
        industry: [],
        is_strategic_coustomer: [],
        reason_top: [],
        reason_second: [],
        reason_second_2: []
      }
    }
  },
  computed: {
    ...mapState({
      conf: state => state.finance.conf
    })
  },
  watch: {
    vm: {
      handler(val) {
        if (val && val.IS_STRATEGIC_COUSTOMER) {
          this.option.is_strategic_coustomer = val.IS_STRATEGIC_COUSTOMER
        }
      },
      deep: true
    },
    conf: {
      handler(val) {
        if (val && val.basic_conf && val.basic_conf.member_level) {
          this.option.member_level = val.basic_conf.member_level.map(i => { return { label: i, value: i } })
        }
        if (val && val.basic_conf && val.basic_conf.member_type) {
          this.option.customer_type = Object.keys(val.basic_conf.member_type).map(i => {
            return { label: val.basic_conf.member_type[i], value: i }
          })
        }
        if (val && val.basic_conf && val.basic_conf.member_status) {
          this.option.member_status = Object.keys(val.basic_conf.member_status).map(i => {
            return { label: val.basic_conf.member_status[i], value: i }
          })
        }
        if (val && val.basic_conf && val.basic_conf.lose_cause) {
          this.option.reason_top = Object.keys(val.basic_conf.lose_cause).map(i => {
            return {
              label: val.basic_conf.lose_cause[i].desc,
              value: i,
              list: val.basic_conf.lose_cause[i].list
            }
          })
        }

        if (val && val.group) {
          if (val.group.find(i => { return i.role_flag === 'CRM_NORMAL_MARKET' })) {
            this.option.sale = val.group.find(i => { return i.role_flag === 'CRM_NORMAL_MARKET' }).children
          }
        }
        if (val && val.industry) {
          this.option.industry = formartindustry(val.industry)
        }
      },
      deep: true
    }
  },
  methods: {
    params() {
      let data = {}
      const params = [
        'member_name',
        'email',
        'certification_name',
        'sale',
        'member_status',

        'industry_id',
        'member_level',
        'is_strategic_coustomer',
        'is_no_commission'
      ]
      const params_advanced = [
        'member_status_time_start',
        'member_status_time_end',
        'loss_date_start',
        'loss_date_end',

        'reason_top',
        'reason_second',
        'reason_top_2',
        'reason_second_2'
      ]
      function value(record, list = []) {
        const params_ = {}
        list.forEach(i => {
          if (record[i] && record[i] !== '') {
            if (i === 'id') {
              params_[i] = record[i].replace(/\,|\"/gi, '')
            } else {
              params_[i] = record[i]
            }
          }
        })
        return params
      }
      data = value({ ...this.form }, params)
      if (this.option.advanced) {
        data = Object.assign(data, value({ ...this.form }, params_advanced))
      }
      return data
    }
  }
}
</script>
