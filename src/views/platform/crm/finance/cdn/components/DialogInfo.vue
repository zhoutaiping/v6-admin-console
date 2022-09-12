<style lang="postcss" scoped>
.DialogDetail{
  .dialog-cdn-info-form{
    padding-top: 10px;
    .dialog-cdn-info-form-item {
      display: inline-block;
      width: 275px;
      margin-bottom: 5px;
      /* border: 0.5px solid #cccccc; */
      .dialog-receivable-detail-form-input {
        width: 175px;
      }
    }
  }
}
</style>
<template>
  <DmDialog
    ref="dmdialog"
    :footer="false"
    :title="title_type[type] || '账单详情'"
    width="600px"
    aside
    class="DialogDetail"
  >
    <DmScroll>
      <el-form ref="detailForm" :model="detailForm" label-position="left" label-width="140px" size="mini" class="dialog-cdn-info-form">
        <hr>
        <el-form-item label="日账单ID" class="dialog-cdn-info-form-item">
          {{ detailForm.record.id || '--' }}
        </el-form-item>
        <el-form-item label="账期" class="dialog-cdn-info-form-item">
          {{ detailForm.record.cdn_date || '--' }}
        </el-form-item>
        <h3>套餐配置</h3><hr>
        <el-form-item label="计费规则" class="dialog-cdn-info-form-item">
          {{ CALC_WAY_TEXT[Number(detailForm.record.calc_way)] || '--' }}
        </el-form-item>
        <el-form-item label="计费周期" class="dialog-cdn-info-form-item">
          {{ detailForm.record.calc_way_timeunit === 'day' ? '按日计费':'--' || '--' }}
        </el-form-item>
        <div v-if="Number(detailForm.record.calc_way) === 1">
          <el-form-item label="国内流量" class="dialog-cdn-info-form-item">
            {{ detailForm.record.fee_china || '--' }} 元/GB
          </el-form-item>
          <el-form-item label="国外流量" class="dialog-cdn-info-form-item">
            {{ detailForm.record.fee_foreign || '--' }} 元/GB
          </el-form-item>
        </div>
        <div v-if="Number(detailForm.record.calc_way) === 2">
          <el-form-item label="国内带宽峰值" class="dialog-cdn-info-form-item">
            {{ detailForm.record.fee_china_max || '--' }} 元/MbPs
          </el-form-item>
          <el-form-item label="海外带宽峰值" class="dialog-cdn-info-form-item">
            {{ detailForm.record.fee_foreign_max || '--' }} 元/MbPs
          </el-form-item>
        </div>
        <el-form-item label="http请求加速次数" style="margin-bottom: 5px;">
          {{ detailForm.record.fee_cdn_https || '--' }} 元/万次
        </el-form-item>
        <div v-if="type === 'bill-day' && Number(detailForm.record.calc_way) === 1">
          <h3>按流量计算</h3><hr>
          <div v-if="detailForm.old_day_detail.id">
            <el-form-item label="原账单国内流量" class="dialog-cdn-info-form-item">{{ detailForm.old_day_detail.amount_china }} GB</el-form-item>
            <el-form-item label="原账单海外流量" class="dialog-cdn-info-form-item">{{ detailForm.old_day_detail.amount_foreign }} GB</el-form-item>
          </div>
          <el-form-item label="正确账单国内流量" class="dialog-cdn-info-form-item">{{ detailForm.record.amount_china }} GB</el-form-item>
          <el-form-item label="正确账单海外流量" class="dialog-cdn-info-form-item">{{ detailForm.record.amount_foreign }} GB</el-form-item>
          <el-form-item label="赠送国内流量" class="dialog-cdn-info-form-item">{{ detailForm.record.free_china }} GB</el-form-item>
          <el-form-item label="赠送国外流量" class="dialog-cdn-info-form-item">{{ detailForm.record.free_foreign }}GB</el-form-item><hr>
          <el-form-item label="" class="dialog-cdn-info-form-item"/>
          <el-form-item label="金额" class="dialog-cdn-info-form-item">{{ (Number(detailForm.record.price_china) + Number(detailForm.record.price_foreign)).toFixed(2) || 0 }} 元</el-form-item>
        </div>
        <div v-if="type === 'bill-day' && Number(detailForm.record.calc_way) === 2">
          <h3>按带宽峰值计算</h3><hr>
          <div v-if="detailForm.old_day_detail.id">
            <el-form-item label="原账单国内带宽峰值" class="dialog-cdn-info-form-item">{{ detailForm.old_day_detail.amount_china_max }} GB</el-form-item>
            <el-form-item label="原账单海外带宽峰值" class="dialog-cdn-info-form-item">{{ detailForm.old_day_detail.amount_foreign_max }} GB</el-form-item>
          </div>
          <el-form-item label="正确账单国内带宽峰值" class="dialog-cdn-info-form-item">{{ detailForm.record.amount_china_max }} Mbps</el-form-item>
          <el-form-item label="正确账单海外带宽峰值" class="dialog-cdn-info-form-item">{{ detailForm.record.amount_foreign_max }} Mbps</el-form-item>
          <el-form-item label="赠送国内带宽峰值" class="dialog-cdn-info-form-item">{{ detailForm.record.free_china_max }} Mbps</el-form-item>
          <el-form-item label="赠送国外带宽峰值" class="dialog-cdn-info-form-item">{{ detailForm.record.free_foreign_max }} Mbps</el-form-item><hr>
          <el-form-item label="" class="dialog-cdn-info-form-item"/>
          <el-form-item label="金额" class="dialog-cdn-info-form-item">{{ (Number(detailForm.record.price_china_max) + Number(detailForm.record.price_foreign_max)).toFixed(2) || 0 }} 元</el-form-item>
          <br>
          <br>
        </div>
        <h3>按增值服务计算</h3><hr>
        <el-form-item v-if="detailForm.old_day_detail.id" label="原账单https请求加速次数" label-width="190px" style="margin-bottom: 5px;">{{ detailForm.old_day_detail.amount_cdn_https }} 万次</el-form-item>
        <el-form-item label="正确账单https请求加速次数" label-width="190px" class="dialog-cdn-info-form-item">{{ detailForm.record.amount_cdn_https }} 万次</el-form-item>
        <el-form-item label="赠送的https请求加速次数" label-width="180px" class="dialog-cdn-info-form-item">{{ detailForm.record.free_cdn_https }} 万次</el-form-item><hr>
        <el-form-item label="" class="dialog-cdn-info-form-item"/>
        <el-form-item label="金额" class="dialog-cdn-info-form-item">{{ Number(detailForm.record.price_cdn_https).toFixed(2) || 0 }} 元</el-form-item>
        <br>
        <br>
        <el-form-item label="日账单调整总金额" label-width="150px" class="dialog-cdn-info-form-item">{{ Number(detailForm.record.pay_price).toFixed(2) || 0 }} 元</el-form-item>
      </el-form>
    </DmScroll>
  </DmDialog>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      detailForm: {
        loading: false,
        visible: false,
        title: '账单详情',
        record: {},
        old_day_detail: {}
      },
      CALC_WAY_TEXT: {
        0: '--', 1: '按流量计费', 2: '按带宽峰值计费'
      },
      type: 'bill-day',
      title_type: {
        'bill-day': '日账单详情',
        'bill-month': '月账单详情'
      },
      orderList: []
    }
  },
  methods: {
    handleOpen(data, type) {
      this.$refs.dmdialog.handleOpen()
      this.$nextTick(() => {
        this.$refs.detailForm && this.$refs.detailForm.resetFields()
        this.detailForm.loading = true
        this.type = type || ''
        this.getDetail({
          billDay_id: data.id
        })
        setTimeout(() => {
          this.detailForm.loading = false
        }, 800)
      })
    },

    async getDetail(params) {
      const api = '/fd/V4/order.cdn.billdaydetail'
      this.detailForm.record = {}
      await this.InvokeAllApi.post(api, params).then(res => {
        const bill_day_detail = JSON.parse(JSON.stringify(res.bill_day_detail))
        const old_day_detail = (+bill_day_detail.type) === 2 && bill_day_detail.detail_info ? bill_day_detail.detail_info.normal : {}
        this.detailForm.record = bill_day_detail.id ? bill_day_detail : {}
        this.detailForm.old_day_detail = old_day_detail
      })
    }
  }
}
</script>
