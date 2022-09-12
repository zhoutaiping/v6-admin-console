<template>
  <el-form
    ref="Form"
    :model="form"
  >
    <el-form-item
      label=""
      class="item-box"
    >
      <InputSearch
        v-model="form.id"
        placeholder="订单ID"
        class="input-box"
        @submit="$emit('init')"
      />
      <InputSearch
        v-model="form.plan_id"
        placeholder="套餐ID"
        class="input-box"
        @submit="$emit('init')"
      />
      <InputSearch
        v-model="form.email"
        placeholder="用户邮箱"
        class="input-box"
        @submit="$emit('init')"
      />
      <DmSelect
        v-model="form.performance_over"
        :selects="option.performance_over"
        placeholder="是否超出业绩时间"
        class="input-box"
        @change="$emit('init')"
      />

      <template
        v-if="option.advanced"
        class="item-box"
      >
        <DmSelect
          v-model="form.buy_type"
          :selects="option.buy_type"
          filterable
          multiple
          collapse-tags
          placeholder="订单类型"
          class="input-box"
          @change="$emit('init')"
        />
        <DmSelect
          v-model="form.status"
          :selects="option.order_status"
          placeholder="订单状态"
          class="input-box"
          @change="e =>{
            $emit('changeTabs',e)
            $emit('init')
          }"
        />
        <DmSelect
          v-model="form.order_type"
          :selects="option.order_type"
          placeholder="订单目的"
          class="input-box"
          @change="$emit('init')"
        />
        <DmSelect
          v-model="form.pay_type"
          :selects="option.pay_type"
          placeholder="支付方式"
          class="input-box"
          @change="$emit('init')"
        />
        <DmSelect
          v-model="form.agent_member_emails"
          :selects="option.agent_emails"
          multiple
          filterable
          collapse-tags
          placeholder="代理商"
          class="input-box"
          @change="$emit('init')"
        />
        <el-select
          v-model="form.sale_user_id"
          filterable
          multiple
          collapse-tags
          placeholder="销售"
          clearable
          class="input-box"
          @change="$emit('init')"
        >
          <el-option-group
            v-for="(group, g_index) in option.sale"
            :key="g_index"
            :label="group.role_name"
          >
            <el-option
              v-for="item in group.children"
              :key="item.value"
              :disabled="item.label === '' || item.status !=='1'"
              :label="item.label"
              :value="item.value"
            />
          </el-option-group>
        </el-select>
        <DmSelect
          v-model="form.platform"
          :selects="option.platform"
          placeholder="平台"
          class="input-box"
          @change="$emit('init')"
        />
        <DmSelect
          v-model="form.no_pay"
          :selects="option.no_pay"
          placeholder="订单金额"
          class="input-box"
          @change="$emit('init')"
        />
        <DmSelect
          v-model="form.payment_mode"
          :selects="option.payment_mode"
          placeholder="订单模式"
          class="input-box"
          @change="$emit('init')"
        />
        <DmSelect
          v-model="form.test_user"
          :selects="option.test_user"
          placeholder="用户类型"
          class="input-box"
          @change="$emit('init')"
        />
        <DmSelect
          v-model="form.confirm"
          :selects="option.confirm"
          placeholder="确认状态"
          class="input-box"
          @change="$emit('init')"
        />
        <DmSelect
          v-model="form.order_hw2web"
          :selects="option.order_hw2web"
          placeholder="迁移状态"
          class="input-box"
          @change="$emit('init')"
        />
        <DmSelect
          v-model="form.has_receive"
          :selects="option.has_receive"
          placeholder="拆分状态"
          class="input-box"
          @change="$emit('init')"
        />
        <InputSearch
          v-model="form.pay_member_email"
          placeholder="支付邮箱"
          class="input-box"
          @submit="$emit('init')"
        />
        <InputSearch
          v-model="form.channel_member_email"
          placeholder="渠道邮箱"
          class="input-box"
          @submit="$emit('init')"
        />
        <DmSelect
          v-model="form.channel_end_relation"
          :selects="option.channel_end_relation"
          placeholder="渠道关联状态"
          class="input-box"
          @change="$emit('init')"
        />

      </template>
      <template
        v-if="option.time"
        class="item-box"
      ><br>
        <el-date-picker
          v-model="created_at"
          :default-time="['00:00:00', '23:59:59']"
          type="daterange"
          range-separator=" "
          class="input-time-box"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="创建日期"
          end-placeholder=""
          @change="e =>{
            form.created_at_start = e && e[0] && e[0] || ''
            form.created_at_end = e && e[1] && e[1] || ''
            $emit('init')
          }"
        />
        <el-date-picker
          v-model="order_start_time"
          :default-time="['00:00:00', '23:59:59']"
          type="daterange"
          range-separator=" "
          class="input-time-box"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="订单起始时间"
          end-placeholder=""
          @change="e =>{
            form.order_start_time_start = e && e[0] && e[0] || ''
            form.order_start_time_end = e && e[1] && e[1] || ''
            $emit('init')
          }"
        />
        <el-date-picker
          v-model="order_end_time"
          :default-time="['00:00:00', '23:59:59']"
          type="daterange"
          range-separator=" "
          class="input-time-box"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="订单结束时间"
          end-placeholder=""
          @change="e =>{
            form.order_end_time_start = e && e[0] && e[0] || ''
            form.order_end_time_end = e && e[1] && e[1] || ''
            $emit('init')
          }"
        />
      </template>
      <el-button
        type="primary"
        icon="el-icon-search"
        @click="$emit('init')"
      >搜索</el-button>
      <el-checkbox v-model="option.advanced">更多搜索</el-checkbox>
      <el-checkbox v-model="option.time">时间搜索 </el-checkbox>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  props: {
    vm: {
      type: [Object],
      default: null
    }
  },
  data() {
    return {
      form: {
        id: '',
        plan_id: '',
        email: '',
        platform: '',
        no_pay: '',
        payment_mode: '',
        buy_type: [],
        status: '',
        order_type: '',
        pay_type: '',

        confirm: '',
        order_hw2web: '',
        has_receive: '',
        test_user: '',
        agent_member_emails: [],
        sale_user_id: [],
        performance_over: '',

        created_at_start: '',
        created_at_end: '',
        order_start_time_start: '',
        order_start_time_end: '',
        order_end_time_start: '',
        order_end_time_end: '',

        pay_member_email: '',
        channel_member_email: '',
        channel_end_relation: ''
      },
      created_at: [],
      order_start_time: [],
      order_end_time: [],
      option: {
        advanced: false,
        time: false,
        platform: [
          { label: '云盾', value: '1' },
          { label: '白山云', value: '2' }
        ],
        no_pay: [
          { label: '0元订单', value: '1' },
          { label: '非0元订单', value: '2' }
        ],
        payment_mode: [
          { label: '预付费', value: '1' },
          { label: '后付费', value: '2' }
        ],
        order_hw2web: [
          { label: '正常订单', value: '0' },
          { label: '已迁移订单', value: '2' }
        ],

        has_receive: [
          { label: '未拆分', value: '0' },
          { label: '已拆分', value: '1' }
        ],

        performance_over: [
          { label: '是', value: '2' },
          { label: '否', value: '1' }
        ],
        confirm: [
          { label: '已确认', value: '1' },
          { label: '未确认', value: '0' }
        ],
        test_user: [
          { label: '非测试用户', value: '0' },
          { label: '测试用户', value: '1' }
        ],
        pay_type: [
          { label: '现金支付', value: '1' },
          { label: '银行转账 ', value: '2' },
          { label: '余额支付', value: '3' },
          { label: '微信支付', value: '4' },
          { label: '支付宝支付', value: '5' },
          { label: '欠款支付', value: '6' }
        ],
        buy_type: [],
        order_status: [],
        order_type: [],
        agent_emails: [],
        sale: [],
        channel_end_relation: []
      }
    }
  },
  watch: {
    vm: {
      handler(val) {
        if (val && val.listMap.map_buy_type) {
          this.option.buy_type = Object.keys(val.listMap.map_buy_type).map(i => { return { label: val.listMap.map_buy_type[i], value: i } })
        }
        if (val && val.listMap.map_order_status) {
          this.option.order_status = Object.keys(val.listMap.map_order_status).map(i => { return { label: val.listMap.map_order_status[i], value: i.toString() } })
        }
        if (val && val.listMap.map_order_type) {
          this.option.order_type = Object.keys(val.listMap.map_order_type).map(i => { return { label: val.listMap.map_order_type[i], value: i } })
        }
        if (val && val.listMap.channel_end_relation) {
          this.option.channel_end_relation = Object.keys(val.listMap.channel_end_relation).map(i => { return { label: val.listMap.channel_end_relation[i], value: i } })
        }
        if (this.$store.state.finance.agent_emails) {
          this.option.agent_emails = Object.keys(this.$store.state.finance.agent_emails).map(i => { return { label: this.$store.state.finance.agent_emails[i], value: this.$store.state.finance.agent_emails[i] } })
        }
        if (this.$store.state.finance.conf) {
          this.option.sale = this.$store.state.finance.conf.group
        }
      },
      deep: true
    }
  },
  methods: {
    setForm(key, value) {
      this.$set(this.form, key, value)
    },
    params() {
      let data = {}
      const params_1 = ['id', 'plan_id', 'email', 'status', 'performance_over']
      const params_2 = [
        'platform', 'no_pay', 'payment_mode', 'buy_type', 'order_type', 'pay_type',
        'confirm', 'order_hw2web', 'has_receive', 'agent_member_emails', 'sale_user_id',
        'test_user', 'pay_member_email', 'channel_member_email', 'channel_end_relation'
      ]
      const params_time = [
        'created_at_start', 'created_at_end', 'order_start_time_start', 'order_start_time_end',
        'order_end_time_start', 'order_end_time_end'
      ]
      function value(record, list = []) {
        const params = {}
        list.forEach(i => {
          if (record[i] && record[i] !== '') {
            params[i] = record[i]
          }
        })
        return params
      }
      data = value(this.form, params_1)

      if (this.option.advanced) {
        data = Object.assign(data, value(this.form, params_2))
      }

      if (this.option.time) {
        data = Object.assign(data, value(this.form, params_time))
      }
      return data
    }
  }
}
</script>
<style lang="scss" scoped>
.input-time-box {
  width: 250px;
  margin-bottom: 5px;
}
.input-box {
  width: 250px;
  margin-bottom: 5px;
}
.item-box {
  margin-bottom: 5px;
}
</style>
