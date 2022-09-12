<template>
  <el-form
    ref="Form"
    :model="form"
    :rules="rules"
    label-position="left"
    label-width="120px"
  >
    <DmCardPanel title="退订操作">
      <el-form-item label="订单目的">
        <DmSelect
          v-model="form.order_type"
          :selects="options.order_type"
          disabled
          placeholder=" "
        />
      </el-form-item>
      <el-form-item label="退订时间">
        <DmSelect
          v-model="form.type"
          :selects="options.type"
          :clearable="false"
          placeholder=" "
          style="width:100px"
          @change="e => {
            form.expire_time = ''
            if (e === '2') {
              form.expire_time = expire_time
            }
            $emit('getPrice')
          }"
        />
        <el-date-picker
          v-if="form.type === '2'"
          v-model="form.expire_time"
          :picker-options="options.pickerOptions"
          type="datetime"
          placeholder="选择日期时间"
          default-time="23:59:59"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="margin-left:15px;"
          @change="$emit('getPrice')"
        />
      </el-form-item>
      <el-form-item label="到期时间">
        {{ expire_time_text }}
      </el-form-item>
      <el-form-item label="退订原因">
        <el-form-item label-width="0" prop="reason_top" class="item-inline-box">
          <DmSelect
            v-model="form.reason_top"
            :selects="options.reason_top"
            placeholder=" "
            @change="e => {
              form.reason_second = ''
              options.reason_second = []
              if (e !=='') {
                options.reason_second = lose_cause[e].list
              }
              $emit('getPrice')
            }"
          />
        </el-form-item>
        <el-form-item label-width="0" prop="reason_second" class="item-inline-box">
          <DmSelect
            v-model="form.reason_second"
            :selects="options.reason_second"
            :option-params="{
              label: 'value',
              value: 'key'
            }"
            placeholder=" "
            @change="$emit('getPrice')"
          />
        </el-form-item>
      </el-form-item>
    </DmCardPanel>
  </el-form>
</template>

<script>
import defaultSetting from '@/core/defaultSetting'
import { CountDown } from '@/utils/utils'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      form: {
        member_id: '',
        plan_id: '',
        order_type: '',
        expire_time: '',
        type: '1',
        reason_top: '',
        reason_second: ''
      },
      rules: {
        order_type: [],
        expire_time: [],
        reason_top: [{ required: true, message: '请选择退订原因' }],
        reason_second: [{ required: true, message: '请选择退订原因' }]
      },
      options: {
        order_type: defaultSetting.order_type,
        type: [
          { label: '立即退订', value: '1' },
          { label: '定时退订', value: '2' }
        ],
        pickerOptions: {
          disabledDate(time) {
            var date = new Date()
            date.setDate(date.getDate() - 1)
            return time.getTime() < date
          }
        },
        reason_top: [],
        reason_second: []
      }
    }
  },
  computed: {
    ...mapState({
      detail: state => state.meal.detail,
      conf: state => state.finance.conf
    }),
    expire_time() {
      return this.form.expire_time || this.detail.expire_time || ''
    },
    expire_time_text() {
      return CountDown(this.form.expire_time || this.expire_time) || ''
    },
    lose_cause() {
      if (this.conf && this.conf.basic_conf && this.conf.basic_conf.lose_cause) {
        return this.conf.basic_conf.lose_cause
      }
      return {}
    }
  },
  watch: {
    lose_cause: {
      handler(val) {
        this.options.reason_top = Object.keys(val).map(i => {
          return {
            label: val[i].desc,
            value: i
          }
        })
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
        this.form.type = '1'
        this.form.expire_time = ''
        this.form.reason_top = ''
        this.form.reason_second = ''
      })
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
