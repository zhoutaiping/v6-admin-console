<template>
  <el-form
    ref="Form"
    :model="form"
    :rules="rules"
    label-position="left"
    label-width="120px"
  >
    <DmCardPanel title="续费操作">
      <el-form-item label="订单目的">
        <DmSelect
          v-model="form.order_type"
          :selects="options.order_type"
          disabled
          placeholder=" "
        />
      </el-form-item>
      <el-form-item label="续费时间">
        <el-input
          v-model="form.buy_time"
          style="width: 300px;"
          @change="e =>{
            check_buy_time()
            $emit('getPrice')
          }"
        >
          <DmSelect
            slot="append"
            v-model="form.time_unit"
            :selects="options.time_unit"
            :clearable="false"
            placeholder=" "
            style="width: 100px;"
            @change="e =>{
              check_buy_time()
              $emit('getPrice')
            }"
          />
        </el-input>
      </el-form-item>
      <el-form-item v-show="expire_time_text" label="到期时间">
        {{ priceData.expire_time }}
        <span class="color--primary">
          &ensp;
          {{ expire_time_text }}
        </span>
      </el-form-item>
    </DmCardPanel>
  </el-form>
</template>

<script>
import defaultSetting from '@/core/defaultSetting'
import { CountDown } from '@/utils/utils'
import { mapState } from 'vuex'
export default {
  props: {
    priceData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: {
        member_id: '',
        plan_id: '',
        order_type: '',
        buy_time: '',
        time_unit: ''
      },
      rules: {
        order_type: [],
        buy_time: [],
        time_unit: [],
        expire_time: []
      },
      options: {
        order_type: defaultSetting.order_type,
        time_unit: defaultSetting.time_unit
      },
      expire_time_text: ''
    }
  },
  computed: {
    ...mapState({
      detail: state => state.meal.detail,
      conf: state => state.finance.conf
    })
  },
  watch: {
    priceData: {
      handler(val) {
        let expire_time_text = ''
        if (Object.keys(val).length && val.expire_time) {
          expire_time_text = CountDown(val.expire_time) || ''
        }
        this.expire_time_text = expire_time_text
      },
      deep: true
    }
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.$refs.Form && this.$refs.Form.clearValidate()
        this.form.member_id = this.detail.member_id
        this.form.plan_id = this.detail.id
        this.form.order_type = Number(this.detail.phase) === 0 ? 'user_refund' : 'normal'
        this.form.buy_time = '1'
        this.form.time_unit = 'm'
        this.expire_time_text = ''
      })
    },
    check_buy_time() {
      const buy_time = this.form.buy_time
      const time_unit = this.form.time_unit
      defaultSetting.validatorBuyTime(buy_time, time_unit, this.form)
    },

    params() {
      const data = { ...this.form }
      delete data.type
      return data
      // this.$refs.Form.validate((valid) => {
      //   if (valid) {
      //     return data
      //   } else {
      //     return
      //   }
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
.item-inline-box {
  display: inline-block;
  margin-bottom: 0;
}
</style>
