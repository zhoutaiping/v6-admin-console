<style lang="postcss" scoped>
.panel-form{
  margin: 5px 0;
  .panel-item {
    display: inline-block;
  }
  .panel-input {
    width: 225px
  }
  .panel-input-250 {
    width: 18px
  }
  .m-b-5{
    margin-bottom: 5px;
  }
}
</style>
<template>
  <el-form ref="expansionModel" :model="expansionModel" :rules="rules" label-position="left" label-width="90px" size="mini" class="panel-form">
    <el-form-item label="开始时间" class="panel-input">
      <el-date-picker :default-value="new Date()" v-model="expansionModel.start_time" type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" class="panel-input" @change="changeStartTime"/>
    </el-form-item>
    <el-form-item v-if="getFilterFlagStatus(plan_meal.product_flag) && expansionModel.end_time !==''" label="结束时间" class="panel-input"/>
  </el-form>
</template>
<script>
import FilterFlag from '@/config/filterFlag'
// import { isArray } from '@/utils/array'
// import * as FORM from './form'

export default {
  components: {

  },
  props: {
    // expansionModel: {
    //   type: Object,
    //   default: {}
    // },
    // expansion_enable: {
    //   type: Boolean
    // },
    plan_meal: Object
  },
  data() {
    const validateBuyTime = (rule, value, callback) => {
      const valueNum = Number(value)
      if (valueNum < 0) {
        callback(new Error('请输入大于0的数字'))
      } else if (isNaN(value)) {
        callback(new Error('请输入数字'))
      } else {
        callback()
      }
    }
    const validateTime = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择时间'))
      } else {
        callback()
      }
    }
    return {
      expansionModel: {},
      rules: {
        start_time: [{ type: 'date', required: true, validator: validateTime, trigger: 'change' }],
        buy_time: [{ required: true, trigger: 'blur', validator: validateBuyTime }]
      }
    }
  },
  watch: {
    expansion_enable(val) {
      val && this.init(val)
    }
  },
  mounted() {

  },

  methods: {
    init() {
      this.setMeal(this.plan_meal)
    },
    setMeal(Meal) {
      // 获取选中的套餐
      // const meal_detail = Meal['meal_detail']
    },
    changeStartTime() {
      // if (this.plan_meal.product_flag === 'LS') {
      //   this.expansionModel.end_time = ''
      // } else {
      //   this.expansionModel.end_time = FORM.getExcTime(this.createModel.start_time, this.createModel.buy_time, this.createModel.time_unit)
      // }
      // this.$emit('changePrice')
    },

    getFilterFlagStatus(flag) {
      const filter_flag = FilterFlag.NOT_EXPIRE_TIME_FLAG
      let status = true
      if (filter_flag.indexOf(flag) > -1) {
        status = false
      }
      return status
    }
  }
}
</script>
