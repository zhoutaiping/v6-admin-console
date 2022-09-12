<template>
  <div>
    <el-form
      ref="Form"
      :model="form"
      :rules="rules"
      class="form-box"
    >
      <a-result
        :is-success="true"
        :status="status ===2 ?'success' : 'info'"
        :title="status ===1 ?'开通信息':'操作成功'"
        sub-title=""
        style="max-width: 560px; margin: 40px auto 0;"
      >
        <div class="information">
          <a-row>
            <a-col
              :sm="8"
              :xs="24"
            >用户邮箱：</a-col>
            <a-col
              :sm="16"
              :xs="24"
            >{{ step_form.email }}</a-col>
          </a-row>
          <a-row>
            <a-col
              :sm="8"
              :xs="24"
            >开通套餐：</a-col>
            <a-col
              :sm="16"
              :xs="24"
            >{{ meal() }}</a-col>
          </a-row>
          <a-row>
            <a-col
              :sm="8"
              :xs="24"
            >付款邮箱：</a-col>
            <a-col
              :sm="16"
              :xs="24"
            >{{ customer_info.pay_email }}</a-col>
          </a-row>
          <a-row>
            <a-col
              :sm="8"
              :xs="24"
            >支付方式：</a-col>
            <a-col
              :sm="16"
              :xs="24"
            >欠款支付</a-col>
          </a-row>
          <a-row>
            <a-col
              :sm="8"
              :xs="24"
            >余额</a-col>
            <a-col
              :sm="16"
              :xs="24"
            ><span class="money">{{ customer_info.total_balance }}</span> 元</a-col>
          </a-row>
          <a-row>
            <a-col
              :sm="8"
              :xs="24"
            >订单标价：</a-col>
            <a-col
              :sm="16"
              :xs="24"
            ><span class="money">{{ step_form.total_price }}</span> 元</a-col>
          </a-row>
          <a-row>
            <a-col
              :sm="8"
              :xs="24"
            >应付金额：</a-col>
            <a-col
              :sm="16"
              :xs="24"
            ><span class="money">{{ step_form.pay_price }}</span> 元</a-col>
          </a-row>
          <a-row v-if="form.order_code">
            <a-col
              :sm="8"
              :xs="24"
            >订单编号：</a-col>
            <a-col
              :sm="16"
              :xs="24"
            >{{ form.order_code }}</a-col>
          </a-row>
          <a-row>
            <a-col
              :sm="8"
              :xs="24"
            >说明：</a-col>
            <a-col
              :sm="16"
              :xs="24"
            >{{ step_form.remark }}</a-col>
          </a-row>
        </div>
        <template #extra>
          <template v-if="status === 1">
            <a-button
              type="primary"
              @click="$emit('change','del')"
            >上一步</a-button>
            <a-button
              :disabled="loading"
              type="primary"
              @click="createOrder"
            >开通套餐</a-button>
          </template>
          <template v-if="status ===2">
            <a-button
              type="primary"
              @click="$emit('change','reset')"
            >再下一单</a-button>
          </template>
          <a-button @click="$emit('close')">返回列表</a-button>
        </template>
      </a-result>
      <DmAlert v-if="create_form && create_form['kuorong']">
        <template v-if="step_form && step_form.product_flag && step_form.product_flag === 'WEBAQJS' && step_form.meal_flag">
          <el-form-item
            label="扩容配置："
            class="item-box"
          >
            {{ kuorong_setting.length }} 项
          </el-form-item>
          <el-row>
            <el-col
              v-for="_ in kuorong_setting"
              :key="_.key"
              :span="12"
            >
              <el-form-item
                :label="_.title"
                class="item-box"
              >
                {{ create_form['kuorong'] && create_form['kuorong'][ _.key ]['buy_num'] || 0 }}
                {{ _.unit }}
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </DmAlert>
    </el-form>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      form: {},
      rules: {},
      status: 1,
      loading: false
    }
  },
  computed: {
    ...mapState({
      customer_info: state => state.meal.customer_info,
      kuorong_setting: state => state.meal.kuorong_setting,
      meal_list: state => state.finance.meal_list,
      step_form: state => state.meal.step_form,
      create_form: state => state.meal.create_form
    })
  },

  methods: {
    init() {
      this.$nextTick(() => {
        if (this.$refs.Form) {
          this.$refs.Form.resetFields()
          this.status = 1
          this.loading = true
          this.form = Object.assign({}, this.step_form)

          setTimeout(() => {
            this.loading = false
          }, 500)
        }
      })
    },

    async createOrder() {
      this.loading = true
      let api = ''
      try {
        if (this.step_form.order_type === 'normal') {
          api = '/fd/V4/order.create_pay'
        } else if (this.step_form.order_type === 'user_refund') {
          api = '/fd/V4/order.try_pay'
        }
        const data = await this.Fetch.post(api, this.create_form)
        this.Message('ACTION_SUCCESS')
        this.form.order_code = data.order_code
        this.status = 2
        this.loading = false
      } catch (error) {
        this.loading = false
        return
      }
    },

    formartValue(data, key) {
      let val = ''
      if (key !== '') {
        val = data[key] || ''
      }
      return val
    },

    meal() {
      let val = ''
      if (this.step_form && this.step_form.meal_flag !== '') {
        const find = this.meal_list.find(i => { return i.meal_flag === this.step_form.meal_flag }) || null
        if (find) {
          val = find.product_name + '【' + find.meal_name + '】'
        }
      }
      return val
    }
  }
}
</script>
<style lang="scss" scoped>
.form-box {
  max-width: 560px;
  margin: 0 auto;
}
.input-box {
  width: 400px;
}
.item-box {
  margin-bottom: 5px;
}
.information {
  line-height: 22px;
  .ant-row:not(:last-child) {
    margin-bottom: 24px;
  }
}
</style>
