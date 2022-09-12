<style lang="scss" scoped>
  .item-box {
    margin-bottom: 5px;
  }
  .input-box {
    width: 400px;
  }
</style>
<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="handleSubmit"
    :title="applyForm.title"
    width="800px"
    aside
    class="dialog-apply-save"
  >
    <DmScroll>
      <el-form ref="applyForm" :model="applyForm" :rules="apply_rule" label-position="left" label-width="120px" size="mini" class="dialog-apply-save-form">
        <el-form-item label="金额信息" class="item-box"/>
        <el-form-item label="关联订单ID" class="item-box">
          {{ applyForm.order_ids }}
        </el-form-item>
        <el-form-item label="开票邮箱" class="item-box">
          {{ applyForm.member_email }}
        </el-form-item>
        <el-form-item label="订单信息" class="item-box"/>
        <DmTable>
          <el-table :data="list" :max-height="250" class="tab-order" >
            <el-table-column label="订单ID" prop="id" width="80px" fixed="left" show-overflow-tooltip/>
            <el-table-column label="订单应付" prop="pay_price" width="150px" show-overflow-tooltip/>
            <el-table-column label="订单实付" prop="pay_off_price" width="150px" show-overflow-tooltip/>
            <el-table-column label="已开票金额" prop="invoice_finish_price" width="100" show-overflow-tooltip/>
            <el-table-column label="开票申请中金额" prop="invoice_request_price" width="120" show-overflow-tooltip/>
            <el-table-column label="未开票金额" prop="invoice_unopen_price" width="100" show-overflow-tooltip/>
            <el-table-column label="开票产品名称" prop="product_flag_name" width="250" show-overflow-tooltip/>
            <el-table-column label="本次开票金额" width="150px" fixed="right">
              <template slot-scope="scope">
                <el-input v-model="scope.row.invoice_amount_new" placeholder="" @change="changAmount(scope.row)"/>
              </template>
            </el-table-column>
          </el-table>
        </DmTable>
        <el-form-item/>
        <el-form-item label="发票信息" class="item-box"/>
        <DmAlert>
          请核实以下信息是否正确，如有误请前往 【客户管理】 处修改 <span style="color:red;">发票信息</span>
        </DmAlert>
        <el-form-item label="发票类型" class="item-box " prop="invoice_type" >
          <el-radio-group v-model="applyForm.invoice_type">
            <el-radio v-for="(item,index) in INVOICE_TYPE" :key="index" :label="item.value" :disabled="item.value !==applyForm.invoice_type">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发票抬头" class="item-box mb-10">
          {{ applyForm.invoice_title }}
        </el-form-item>
        <el-form-item label="税务登记证号" class="item-box mb-10">
          {{ applyForm.company_taxer_code }}
        </el-form-item>
        <el-form-item label="基本开户银行" class="item-box mb-10">
          {{ applyForm.company_bank }}
        </el-form-item>
        <el-form-item label="基本开户账号" class="item-box mb-10" prop="amount">
          {{ applyForm.company_bank_code }}
        </el-form-item>
        <el-form-item label="注册固定电话" class="item-box mb-10" prop="amount">
          {{ applyForm.company_reg_tel }}
        </el-form-item>
        <el-form-item label="注册场所地址" class="item-box mb-10" prop="order_ids">
          {{ applyForm.company_reg_address }}
        </el-form-item>
        <!-- <el-form-item label="营业执照扫描件" class="item-box">
          <el-popover v-if="applyForm.biz_licence_img" placement="left-start">
            <img :src="applyForm.biz_licence_img" class="image" style="height:667px;" alt="">
            <img slot="reference" :src="applyForm.biz_licence_img" class="image" style="width:100px; height:80px;" alt="">
          </el-popover>
        </el-form-item> -->
        <el-form-item label="备注" class="item-box mb-10">
          <el-input v-model="applyForm.refund_remark" :rows="4" type="textarea" placeholder=" " class="input-box" />
        </el-form-item>
      </el-form>
    </DmScroll>
  </DmDialog>
</template>
<script>
import Form from '@/utils/form'
import * as FORM from './c-from.js'
import InvoiceResource from '@/api/finance/invoiceApi'

export default {
  props: {
    productList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      open: false,
      applyForm: new Form({
        title: '发票申请'
      }, {}),
      apply_rule: FORM.APPLYFORM_RULE,
      list: [],
      INVOICE_TYPE: [{ label: '增值税普通发票', value: '1' }, { label: '增值税专用发票', value: '2' }]
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.applyForm.reset()
    })
  },
  methods: {
    handleOpen(order_codes, type) {
      this.$refs.Dialog.handleOpen()
      this.loading = true
      this.getOrderInfo(order_codes, type)
    },

    changAmount(row) {
      if (isNaN(Number(row.invoice_amount_new)) || Number(row.invoice_amount_new) < 0) {
        this.message.warning('请选择大于0的数字')
        row.invoice_amount_new = 0
        return
      }
      if (Number(row.invoice_amount_new) > Number(row.invoice_unopen_price)) {
        row.invoice_amount_new = Number(row.invoice_unopen_price)
      }
    },

    getOrderInfo(order_codes, type) {
      const params = {
        order_codes: order_codes
      }
      InvoiceResource.getInvoiceRequestInfo(params).then(res => {
        const list = res.invoice_orders
        list.forEach(e => {
          e.product_flag_name = res.invoice_product_name_map[e.product_flag]
        })
        this.list = list
        this.setFieldValue(res, order_codes, type)
        this.loading = false
      }).catch(e => {
        this.$refs.Dialog.handleClose()
        this.loading = false
      })
    },

    setFieldValue(res, order_codes, type) {
      const invoice_orders = res.invoice_orders
      const data = res.member_invoices && res.member_invoices[0] || {}
      if (Object.keys(data).length === 0 || data.id === '') {
        this.message.warning('开票人信息不存在！')
      }
      const member_email = res.member.email
      const order_ids = this.getOrderIDs(invoice_orders)

      this.applyForm = {
        'title': type === 'pay' ? '应付金额开票' : '发票申请',
        'order_ids': order_ids,
        'id': data.id || '',
        'invoice_type': data.invoice_type || '1',
        'invoice_amount': res.invoice_amount,
        'member_id': data.member_id || res.member.member_id || '',
        'member_email': member_email,
        'company': data.company || '',
        'company_taxer_code': data.company_taxer_code || '',
        'company_reg_address': data.company_reg_address || '',
        'company_reg_tel': data.company_reg_tel || '',
        'company_bank': data.company_bank || '',
        'company_bank_code': data.company_bank_code || '',
        'invoice_title': data.invoice_title || '',
        'invoice_user': data.invoice_user || '',
        'invoice_mobile': data.invoice_mobile || '',
        'invoice_address': data.invoice_address || '',
        'biz_licence_img': data.biz_licence_img || '',
        'is_default': data.is_default || '',
        'created_at': data.created_at || '',
        'updated_at': data.updated_at || '',
        'refund_remark': data.refund_remark || ''
      }
    },
    getFieldValue() {
      const data = this.applyForm
      const invoice_amounts = {}
      let is_check = true
      this.list.forEach((item, index) => {
        if (isNaN(Number(item.invoice_amount_new)) || Number(item.invoice_amount_new) < 0 || !item.invoice_amount_new) {
          this.message.warning('请输入开票金额')
          is_check = false
          return
        }
        invoice_amounts[item.order_code] = item.invoice_amount_new
      })
      if (!is_check) return
      return {
        member_invoice_id: data.id,
        invoice_amounts: invoice_amounts,
        refund_remark: data.refund_remark
      }
    },
    getOrderIDs(list) {
      let order_ids = ''
      list.forEach((order, index) => {
        if (index === 0) {
          order_ids = order.id
        } else {
          order_ids = order.id + ',' + order_ids
        }
      })
      return order_ids
    },
    getProAndMealName(flag) {
      let name = '--'
      this.productList.forEach(item => {
        if (item.meal_flag === flag) name = item.product_name + '--' + item.meal_name
      })
      return name
    },
    handleSubmit(formName = 'applyForm') {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const parmas = this.getFieldValue()
          if (!parmas) {
            this.$refs.Dialog.afterValidate()
            return
          }
          InvoiceResource.invoiceRequestSave(parmas).then(res => {
            this.Message('ACTION_SUCCESS')
            this.$emit('handleload')
            this.$refs.Dialog.handleClose()
          }).catch(e => { this.$refs.Dialog.afterValidate() })
        } else {
          this.$refs.Dialog.afterValidate()
        }
      })
    }
  }

}
</script>
