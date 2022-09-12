<style lang="scss" scoped>
.input-box {
  width: 300px;
}
.form-item {
  margin-bottom: 5px;
}
</style>
<template>
  <DmDialog
    ref="dialog"
    :fetch-submit="fetchSubmit"
    title="缩容"
    width="800px"
    aside
  >
    <DmScroll>
      <el-form
        ref="Form"
        :model="form"
        :rules="rules"
        label-width="150px"
        label-position="left"
      >
        <CardInfo
          :data="info"
          title="基本信息"
        />
        <CardInfo
          :data="user_kuorong"
          :expand-model="false"
          title="已扩容配置"
        />
        <CardInfo
          :data="webaqjs_user_kuorong"
          :expand-model="false"
          :title="info && info[2] && info[2].value || '' + '已使用域名包'"
        />
        <CardLayout
          :expand="true"
          title="缩容操作"
        >
          <div slot="layout">
            <template v-if="user_kuorong.length">
              <el-form-item
                v-for="item in user_kuorong"
                :key="item.key"
                :label="item.title"
                :prop="item.key"
              >
                <el-input-number
                  v-model="form[item.key]"
                  :min="0"
                  :max="item.max"
                  :step="item.beishu || 1"
                  placeholder=""
                  class="input-box input-number"
                  @change="e =>{changeKuorong(e, item.key, item.beishu || 1, 0)}"
                />
                <span
                  class="color--primary"
                  style="margin-left:10px;"
                >最大缩容：{{ item.max }}</span>
              </el-form-item>
            </template>
          </div>
        </CardLayout>
        <CardLayout
          :expand="true"
          title="订单金额"
        >
          <div slot="layout">
            <el-form-item
              label="订单价格"
              class="form-item"
              prop="total_price"
            >
              {{ form.total_price|| 0 }} 元
            </el-form-item>
            <el-form-item
              label="销售优惠"
              class="form-item"
              prop="discount_sale_amount"
            >
              <el-input
                v-model="form.discount_sale_amount"
                placeholder=""
                class="input-box"
                @change="getPrice('code')"
              >
                <el-select
                  slot="prepend"
                  v-model="form.discount_sale_type"
                  style="width: 100px;"
                  @change="SaleTypeChange"
                >
                  <el-option
                    v-for="item in discount_sale_type"
                    :key="item.checked"
                    :label="item.text"
                    :value="item.value"
                  />
                </el-select>
              </el-input>
            </el-form-item>
            <el-form-item
              :label="form.pay_price < 0 ? '应付金额':'应退金额'"
              class="form-item"
              prop="pay_price"
            >
              <a-input-number
                v-model="form.pay_price"
                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                class="input-box"
                @blur="changePayPrice"
              />
              元
            </el-form-item>
          </div>
        </CardLayout>
        <CardLayout
          :expand="true"
          title="支付相关"
        >
          <div slot="layout">
            <el-form-item
              label="支付方式"
              class="form-item"
              prop="pay_type"
            >
              <el-radio
                v-model="form.pay_type"
                label="6"
              >欠款支付</el-radio>
            </el-form-item>
            <el-form-item
              label="订单备注"
              class="form-item"
              prop="remark"
            >
              <el-input
                v-model="form.remark"
                type="textarea"
                placeholder="请输入备注"
                class="input-box"
              />
            </el-form-item>
          </div>
        </CardLayout>
      </el-form>
    </DmScroll>
  </DmDialog>
</template>
<script>
import mixins from './mixins-shrink'
export default {
  mixins: [mixins],
  data() {
    return {
      form: {
        total_price: 0,
        pay_price: 0,
        pay_type: '6',
        discount_sale_amount: 0,
        discount_sale_type: 'amount', // 销售折扣类型
        remark: ''
      },
      rules: {
        total_price: [],
        pay_price: [],
        pay_type: [],
        discount_sale_amount: [],
        discount_sale_type: [],
        remark: []
      },
      discount_sale_type: [
        { text: '折扣', value: 'rate' }, { text: '金额', value: 'amount' }
      ],
      rowData: {}
    }
  },
  methods: {
    handleOpen(data) {
      this.rowData = Object.assign({}, data)
      this.getDetail({ id: data.id }, 'kuorong')
      this.OderPlan({ meal_flag: data.meal_flag, member_id: data.member_id })
      this.$refs.dialog.handleOpen()
      this.$nextTick(() => {
        if (this.$refs.Form) this.$refs.Form.resetFields()
        setTimeout(() => {
          this.userKuorong(data)
          this.setShrink({
            data: data,
            vm: this,
            form: this.form
          })
        }, 800)
      })
    },

    SaleTypeChange(val) {
      if (val === 'rate') {
        this.form.discount_sale_amount = 1
      } else {
        this.form.discount_sale_amount = 0
      }
      this.getPrice()
    },

    changePayPrice(value) {
      // 支付金额  销售优惠 销售折扣 优惠类型
      const pay_price = this.form.pay_price
      const total_price = this.form.total_price
      const sales_amount = Number(total_price) - Number(pay_price)
      this.form.discount_sale_type = 'amount'
      this.form.discount_sale_amount = sales_amount.toFixed(2)
      this.getPrice()
    },
    changeKuorong(val, key, beishu, min) {
      if (val > min) {
        const value = Math.ceil(val / beishu) * beishu
        this.form[key] = value
      }
      this.getPrice()
    },
    getPrice() {
      this.$refs.Form.validate(valid => {
        if (valid) {
          this.Fetch.post('/fd/V4/order.suorong_price', { ...this.params() }).then(res => {
            this.form.total_price = res.total_price || 0
            this.form.discount_sale_type = res.discount_sale_type || 'amount'
            this.form.discount_sale_amount = res.discount_sale_amount || 0
            this.form.pay_price = res.pay_price || 0
          })
          this.$refs.dialog.afterValidate()
        } else {
          this.$refs.dialog.afterValidate()
        }
      })
    },

    fetchSubmit() {
      this.$refs.Form.validate(valid => {
        if (valid) {
          this.Fetch.post('/fd/V4/order.suorong_pay', { ...this.params() }).then(res => {
            this.Message('ACTION_SUCCESS')
            this.$refs.dialog.handleClose()
          })
          this.$refs.dialog.afterValidate()
        } else {
          this.$refs.dialog.afterValidate()
        }
      })
    }
  }
}
</script>
