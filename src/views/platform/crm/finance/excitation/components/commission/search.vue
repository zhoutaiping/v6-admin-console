<style lang="scss" scoped>
.input-box {
  width: 235px;
  margin-bottom: 2px;
}
</style>
<template>
  <DmToolbar>
    <InputSearch
      v-model="form.member_email"
      placeholder="用户邮箱"
      class="input-box"
      @submit="$emit('init', params())"
    />
    <InputSearch
      v-model="form.channel_member_email"
      placeholder="渠道邮箱"
      class="input-box"
      @submit="$emit('init', params())"
    />
    <InputSearch
      v-model="form.order_code"
      placeholder="订单Code"
      class="input-box"
      @submit="$emit('init', params())"
    />
    <DmSelect
      v-model="form.is_grant"
      :selects="option.is_grant"
      placeholder="发放状态"
      class="input-box"
      @change="$emit('init', params())"
    />
    <DmSelect
      v-model="form.is_valid"
      :selects="option.is_valid "
      placeholder="有效状态"
      class="input-box"
      @change="$emit('init', params())"
    />
    <el-date-picker
      v-model="finish_payment_time"
      :default-time="['00:00:00', '23:59:59']"
      type="daterange"
      range-separator=" "
      class="input-box"
      value-format="yyyy-MM-dd HH:mm:ss"
      start-placeholder="完成回款时间"
      end-placeholder=" "
      @change="e =>{
        form.finish_payment_time_start = e && e[0] || ''
        form.finish_payment_time_end = e && e[1] || ''
        $emit('init', params())
      }"
    />
    <el-date-picker
      v-model="expected_arrival_time"
      :default-time="['00:00:00', '23:59:59']"
      type="daterange"
      range-separator=" "
      class="input-box"
      value-format="yyyy-MM-dd HH:mm:ss"
      start-placeholder="预计到账时间"
      end-placeholder=" "
      @change="e =>{
        form.expected_arrival_time_start = e && e[0] || ''
        form.expected_arrival_time_end = e && e[1] || ''
        $emit('init', params())
      }"
    />
    <el-date-picker
      v-model="paid_arrival_time"
      :default-time="['00:00:00', '23:59:59']"
      type="daterange"
      range-separator=""
      class="input-box"
      value-format="yyyy-MM-dd HH:mm:ss"
      start-placeholder="实际到账时间"
      end-placeholder=" "
      @change="e =>{
        form.paid_arrival_time_start = e && e[0] || ''
        form.paid_arrival_time_end = e && e[1] || ''
        $emit('init', params())
      }"
    />
  </DmToolbar>
</template>
<script>
import { is_grant, is_valid } from '../../utils'

export default {
  data() {
    return {
      form: {},
      finish_payment_time: '',
      expected_arrival_time: '',
      paid_arrival_time: '',
      option: {
        is_grant: is_grant,
        is_valid: is_valid
      }
    }
  },
  methods: {
    params() {
      return { ...this.form }
    }
  }
}
</script>
