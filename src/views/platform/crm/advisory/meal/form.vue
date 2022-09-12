<template>
  <el-form
    ref="Form"
    :model="form"
  >
    <el-form-item class="search-item">
      <InputSearch
        v-model="form.id"
        placeholder="套餐ID"
        class="input-box"
        @submit="$emit('init')"
      />
      <InputSearch
        v-model="form.email"
        placeholder="用户邮箱"
        class="search-input"
        @submit="$emit('init')"
      />

      <el-cascader
        :options="option.MealAll"
        :props="{ checkStrictly: true }"
        filterable
        clearable
        placeholder="套餐"
        class="search-input"
        @change="e =>{
          form.product_flag = e && e[0] || ''
          form.meal_flag = e && e[1] || ''
          $emit('init')
        }"
      />
      <el-select
        v-model="form.sale"
        filterable
        multiple
        collapse-tags
        placeholder="所属销售"
        clearable
        class="search-input"
        @change="$emit('init')"
      >
        <el-option-group
          v-for="(group, g_index) in option.SALES"
          :key="g_index"
          :label="group.role_name"
        >
          <el-option
            v-for="item in group.children"
            :disabled="!item.label || item.status !=='1'"
            :key="item.user_id"
            :label="item.label"
            :value="item.user_id"
          />
        </el-option-group>
      </el-select>
    </el-form-item>
    <template v-if="advanced">
      <el-form-item class="search-item">
        <el-date-picker
          v-model="created_at"
          :default-time="['00:00:00', '23:59:59']"
          type="daterange"
          range-separator=" "
          class="search-input-time"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="创建时间"
          end-placeholder=" "
          @change="e =>{
            form.created_at_start = e && e[0] && e[0] || ''
            form.created_at_end = e && e[1] && e[1] || ''
            $emit('init')
          }"
        />
        <el-date-picker
          v-model="expire_time"
          :default-time="['00:00:00', '23:59:59']"
          type="daterange"
          range-separator=" "
          class="search-input-time"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="到期时间"
          end-placeholder=" "
          @change="e =>{
            form.expire_time_start = e && e[0] && e[0] || ''
            form.expire_time_end = e && e[1] && e[1] || ''
            $emit('init')
          }"
        />
        <el-date-picker
          v-model="performance_time"
          :default-time="['00:00:00', '23:59:59']"
          type="daterange"
          range-separator=" "
          class="search-input-time"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="业绩时间"
          end-placeholder=" "
          @change="e =>{
            form.performance_start_time_start = e && e[0] && e[0] || ''
            form.performance_start_time_end = e && e[1] && e[1] || ''
            $emit('init')
          }"
        />
        <el-date-picker
          v-model="loss_time"
          :default-time="['00:00:00', '23:59:59']"
          type="daterange"
          range-separator=" "
          class="search-input-time"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="流失日期"
          end-placeholder=""
          @change="e =>{
            form.loss_time_start = e && e[0] && e[0] || ''
            form.loss_time_end = e && e[1] && e[1] || ''
            $emit('init')
          }"
        />
      </el-form-item>
    </template>
    <el-form-item class="search-item">
      <InputSearch
        v-model="form.instance_id"
        placeholder="套餐实例ID"
        class="input-box"
        @submit="$emit('init')"
      />
      <DmSelect
        v-model="form.test_user"
        :selects="option.test_user_list"
        :option-params="{
          label:'text',
          value:'value'
        }"
        placeholder="用户类型"
        class="search-input"
        @change="$emit('init')"
      />
      <el-select
        v-model="form.reason_top"
        placeholder="一级流失原因"
        clearable
        class="search-input"
        @change="e =>{
          form.reason_second = ''
          option.REASON_SECOND = e !=='' && option.REASON_SECOND_All.filter(i => Number(i.top) === Number(e)) || []
          $emit('init')
        }"
      >
        <el-option
          v-for="(item, key) in option.REASON_TOP"
          :key="key"
          :label="item"
          :value="key"
        />
      </el-select>
      <DmSelect
        v-model="form.reason_second"
        :selects="option.REASON_SECOND"
        :option-params="{
          label:'second',
          value:'value'
        }"
        placeholder="二级级流失原因"
        class="search-input"
        @change="$emit('init')"
      />
      <el-button
        :loading="loading"
        type="primary"
        icon="el-icon-search"
        @click="$emit('init')"
      >搜 索</el-button>
      <el-checkbox v-model="advanced">更多搜索</el-checkbox>
    </el-form-item>
  </el-form>
</template>
<script>
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
        id: '',
        email: '',
        product_flag: '',
        meal_flag: '',
        sale: [],
        //
        created_at_start: '',
        created_at_end: '',
        expire_time_start: '',
        expire_time_end: '',
        loss_time_start: '',
        loss_time_end: '',
        performance_start_time_start: '',
        performance_start_time_end: '',
        instance_id: '',
        test_user: '',
        reason_top: '', // 一级流失原因，
        reason_second: '', // 二级流失原因，

        plan_status: ''
      },
      created_at: '',
      expire_time: '',
      performance_time: '',
      loss_time: '',
      advanced: false,
      option: {
        MealAll: [],
        SALES: [],
        test_user_list: [],
        REASON_TOP: [],
        REASON_SECOND_All: [],
        REASON_SECOND: []
      }
    }
  },
  watch: {
    vm: {
      handler(val) {
        if (val && val.MealAll) {
          this.option.MealAll = val.MealAll
        }
        if (val && val.SALES) {
          this.option.SALES = val.SALES
        }
        if (val && val.test_user_list) {
          this.option.test_user_list = val.test_user_list
        }
        if (val && val.REASON_SECOND_All) {
          this.option.REASON_SECOND_All = val.REASON_SECOND_All
        }
        if (val && val.REASON_TOP) {
          this.option.REASON_TOP = val.REASON_TOP
        }
        if (val && val.plan_status) {
          this.form.plan_status = val.plan_status
        }
      },
      deep: true
    }
  },
  methods: {
    params() {
      let data = {}
      const params = [
        'id', 'email', 'product_flag', 'meal_flag', 'sale', 'plan_status',
        'instance_id', 'test_user', 'reason_top', 'reason_second'
      ]
      const params_advanced = [
        'created_at_start', 'created_at_end',
        'expire_time_start', 'expire_time_end',
        'loss_time_start', 'loss_time_end',
        'performance_start_time_start',
        'performance_start_time_end'
      ]

      function value(record, list = []) {
        const params_ = {}
        list.forEach(i => {
          if (record[i] && record[i] !== '') {
            params_[i] = record[i]
          }
        })
        return params_
      }
      data = value({ ...this.form }, params)
      if (this.advanced) {
        data = Object.assign(data, value({ ...this.form }, params_advanced))
      }
      data.plan_status = this.vm.plan_status
      return data
    }
  }
}
</script>
<style lang='scss' scoped>
@import url("./index.scss");
</style>
