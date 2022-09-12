import { mapActions } from 'vuex'
import { deepClone } from '@/utils/index'
import DialogMealInfo from './info/index'
import DialogMealRenew from './dialog/DialogMealRenew'
import DialogMealUp from './dialog/DialogMealUp'
import DialogMealExpand from './dialog/DialogMealExpand'
import DialogMealRaise from './dialog/DialogMealRaise'
import DialogMealCancel from './dialog/DialogMealCancel'
import DialogEditDiyName from './dialog/DialogEditDiyName'
import DialogBindDomain from './dialog/DialogBindDomain'
import DialogEditTime from './dialog/dialog-edit-performance-time'
import DialogFormal from './dialog/DialogFormal'
import DialogRetry from './dialog/DialogRetry'
import DialogStage from './dialog/dialog-stage'
import DialogMealPayment from './dialog/DialogMealPayment'

import AdsEdit from './ads/edit'
import EnablePay from './webaqjs/enablepay.vue'
import DisablePay from './webaqjs/cancel.vue'
import Shrink from './webaqjs/shrink.vue'
import MealConfig from './mealConfig/index'
import Form from './form'
import Tabs from './tabs'
import defaultSetting from '@/core/defaultSetting'
export default {
  components: {
    DialogMealPayment,
    DialogMealInfo,
    DialogMealRenew,
    DialogMealUp,
    DialogMealExpand,
    DialogMealRaise,
    DialogMealCancel,
    MealConfig,
    DialogEditDiyName,
    DialogBindDomain,
    DialogFormal,
    DialogRetry,
    DialogStage,
    DialogEditTime,
    AdsEdit,
    EnablePay,
    DisablePay,
    Shrink,
    Form,
    Tabs
  },
  data() {
    return {
      loading: false,
      list: [],
      operateMap: defaultSetting.operateMap,
      selectRow: [],
      MealAll: [], // 订单目的
      SALES: [],
      column: [
        { label: 'ID', prop: 'id', fixed: 'left' },
        { label: '产品套餐', prop: 'meal_flag', width: '300' },
        { label: '用户邮箱', prop: 'email', width: '250' },
        { label: '代理商', prop: 'agent_member_email', width: '200' },
        { label: '实例名称', prop: 'plan_diy_name', width: '300' },
        { label: '销售', prop: 'sale_text', width: '200' },
        { label: '套餐类型', prop: 'phase' },
        { label: '套餐状态', prop: 'plan_status' },
        { label: '平台', prop: 'platform' },
        { label: '业绩时间', prop: 'performance_start_time', width: '160' },
        { label: '套餐生命时间轴', prop: 'stage', width: '150' },
        { label: '创建时间-到期时间', prop: 'created_at', width: '160' },
        { label: '防御IP段数量', prop: 'ads', width: '200' }
      ]
    }
  },
  methods: {
    ...mapActions({
      getMeal: 'getMeal',
      getbasicconf: 'getbasicconf'
    }),
    async init() {
      await Promise.all([this.getMealAll(), this.getSaleList()])
    },

    async getMealAll() {
      try {
        this.MealAll = []
        const res = await this.$store.dispatch('getMeal')
        this.MealAll = defaultSetting.getProductGroup(res.data)
      } catch (error) {
        return
      }
    },

    async getSaleList() {
      this.SALES = []
      try {
        await this.getbasicconf().then((res) => {
          const SALES = defaultSetting.Group(
            deepClone(res.role_list),
            deepClone(res.user_list)
          )
          this.SALES = SALES
        })
      } catch (error) {
        return
      }
    },

    fomartAdsValue(row, type) {
      const data = this.ads_ip[row.id]
      let val = 0
      if (data && data[type] !== '') {
        val = data[type]
      }
      return val + 'C'
    },

    handEditClick(data, type) {
      switch (type) {
        case 'renew':
          this.$refs.dialogMealRenew.handleOpen(deepClone(data))
          break
        case 'kuorong':
          this.$refs.dialogMealExpand.handleOpen(deepClone(data))
          break
        case 'zengzhi':
          this.$refs.dialogMealRaise.handleOpen(deepClone(data))
          break
        case 'up':
          this.$refs.dialogMealUp.handleOpen(deepClone(data))
          break
        case 'uplevel':
          this.$refs.dialogMealUp.handleOpen(deepClone(data))
          break
        case 'bindDomain':
          this.handleRowBindDomain(deepClone(data))
          break
        case 'cancel':
          this.$refs.dialogMealCancel.handleOpen(
            deepClone(data),
            this.REASON_TOP,
            this.REASON_SECOND_All
          )
          break
        case 'setconfig':
          this.$refs.mealConfig.handleOpen(deepClone(data))
          break
        case 'formal':
          this.$refs.dialogFormal.handleOpen(deepClone(data))
          break
        case 'retry':
          this.$refs.dialogRetry.handleOpen(deepClone(data))
          break
        case 'enablepay':
          this.$refs.enablePay.handleOpen(deepClone(data))
          break
        case 'disablePay':
          this.$refs.disablePay.handleOpen(deepClone(data))
          break
        case 'shrink':
          this.$refs.shrink.handleOpen(deepClone(data))
          break
        case 'ads':
          this.$refs.adsEdit.handleOpen(deepClone(data), deepClone(this.ads_ip))
          break
        case 'edittime':
          this.$refs.dialogEditTime.handleOpen(deepClone(data))
          break
        case 'payment':
          this.$refs.dialogMealPayment.handleOpen(deepClone(data))
          break
      }
    },

    handleRowBindDomain(data) {
      const email = data.email.trim() || ''
      if (!email) {
        this.message.warning('用户邮箱为空无法获取域名!')
        return
      }
      this.$refs.dialogBindDomain.handleOpen(data)
    }
  }
}
