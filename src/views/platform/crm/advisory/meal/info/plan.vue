<template>
  <div>
    <CardInfo
      :data="options.info"
      title="基本信息"
    />
    <CardInfo
      :data="options.meal"
      :expand-model="false"
      title="套餐详情"
    />
    <Cdn
      v-show="cdn && Number(options.cdn_template.calc_way) > 0"
      ref="cdn"
      :cdn_template="options.cdn_template"
    />
    <CardInfo
      v-if="options.zengzhi.length"
      :expand-model="false"
      :data="options.zengzhi"
      title="增值配置"
    />
    <CardInfo
      v-if="options.kuorong.length"
      :expand-model="false"
      :data="options.kuorong"
      title="扩容配置"
    />
    <CardInfo
      :data="options.status"
      title="状态信息"
    />
    <CardInfo
      v-if="options.webanjs_kuorong.length"
      :data="options.webanjs_kuorong"
      :title="options.info[2].value + '体验版已使用域名包数量'"
    />
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import Cdn from './cdn-templante'
export default {
  components: {
    Cdn
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    cdn: {
      type: Boolean,
      default: false
    },
    loss_desc: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      options: {
        info: [],
        meal: [],
        status: [],
        zengzhi: [],
        kuorong: [],
        webanjs_kuorong: [],
        cdn_template: {}
      }
    }
  },
  watch: {
    data: {
      handler(val) {
        this.setInfo(this.data)
        this.setMeal(this.data)
        this.setStatus(this.data)
        this.setZengzhi(this.data)
        this.setKuorong(this.data)
        this.setWebanjsKuorong(this.data)
        this.setCdnTemplate(this.data)
      },
      deep: true
    }
  },
  methods: {
    ...mapActions({ OderPlan: 'OderPlan' }),
    setInfo(data, option) {
      this.options.info = [
        { title: '套餐ID', value: data.id },
        { title: '关联账号', value: data.member && data.member.email || '' },
        { title: '产品名称', value: data['plan_setting'] && data['plan_setting']['meal_latest'] && data['plan_setting']['meal_latest']['product_name'] || '' },
        { title: '套餐名称', value: data.plan_name }
      ]
    },
    setMeal(data, option) {
      const meal = data['plan_setting'] && data['plan_setting']['meal_latest'] && data['plan_setting']['meal_latest']['meal_detail'] || {}
      this.options.meal = mealOption(meal)
    },
    setStatus(data, option) {
      this.options.status = [
        { title: '开始时间', value: data.plan_start_time },
        { title: '到期时间', value: !['LS', 'DX'].includes(data.product_flag) ? data.expire_time : '' },
        { title: '套餐状态', value: Number(data.plan_status) === 1 ? '未到期' : '已到期' },
        { title: '备注', value: data.loss_remark }
      ]
      if (Number(data.unsubscribe_flag) === 1) {
        this.options.status.push({ title: '流失原因', value: this.loss_desc })
      }
    },
    setZengzhi(data, option) {
      const default_zengzhi = data['plan_setting'] && data['plan_setting']['zengzhi'] ? data['plan_setting']['zengzhi'] : null
      const default_zengzhi_value = data['plan_setting'] && data['plan_setting']['cfg'] ? data['plan_setting']['cfg']['zengzhi'] : null
      this.options.zengzhi = keylist(default_zengzhi, default_zengzhi_value)
    },
    setKuorong(data, option) {
      const default_kuorong = data['plan_setting'] && data['plan_setting']['kuorong'] ? data['plan_setting']['kuorong'] : []
      const default_kuorong_value = data['plan_setting'] && data['plan_setting']['cfg'] ? data['plan_setting']['cfg']['kuorong'] : null
      this.options.kuorong = keylist(default_kuorong, default_kuorong_value)
    },
    setCdnTemplate(data) {
      this.options.cdn_template = data.cdn_template && JSON.parse(data.cdn_template).template || {}
    },
    async setWebanjsKuorong(data, option) {
      this.options.webanjs_kuorong = []
      if (data.meal_flag !== 'YD-WEBAQJS-TY') {
        return
      }
      const { kuorong_min } = await this.OderPlan({ meal_flag: data.meal_flag, member_id: data.member_id })
      const list = []
      if (kuorong_min && Object.keys(kuorong_min).length) {
        list.push({
          title: '已使用域名包',
          value: kuorong_min.domain_packet,
          unit: '个'
        })
      }
      this.options.webanjs_kuorong = list
    }
  }
}
function ObjType(item) {
  const typeArr = ['String', 'Object', 'Number', 'Array', 'Undefined', 'Function', 'Null', 'Symbol']
  const type = Object.prototype.toString.call(item).slice(8, -1)
  const index = typeArr.indexOf(type)
  return typeArr[index] || ''
}
function mealOption(meal = {}) {
  const mealList = []
  const filters = ['meal_price', 'kuorong', 'zengzhi', 'backstage_show', 'default_fields', 'frequency']
  Object.keys(meal).forEach(item => {
    if (filters.indexOf(item) < 0) {
      const ITEMTYPE = ObjType(meal[item])
      if (ITEMTYPE === 'Object' || meal[item]['title']) {
        mealList.push({
          title: meal[item]['title'],
          value: (meal[item].value === true || meal[item].value === false || meal[item].value) ? meal[item]['value'] : '',
          unit: (meal[item].value === true || meal[item].value === false) ? '' : meal[item].unit || ''
        })
      }
      if (ITEMTYPE === 'Array') {
        meal[item].forEach(e => {
          const type = ObjType(e)
          if (type === 'Object' || e.title) {
            const obj = {
              title: e.title,
              value: (e.value === true || e.value === false || e.value) ? e.value : '',
              unit: (e.value === true || e.value === false) ? '' : e.unit || ''
            }
            mealList.push(obj)
          }
        })
      }
    }
  })
  return mealList
}
function keylist(dataList, valueRecord) {
  const list = []
  if (!dataList || !Object.keys(dataList).length) return list
  Object.keys(dataList).forEach(i => {
    if (valueRecord[i]) {
      list.push({
        title: dataList[i].title,
        value: valueRecord[i].buy_num,
        unit: dataList[i].unit
      })
    }
  })
  return list
}
</script>
