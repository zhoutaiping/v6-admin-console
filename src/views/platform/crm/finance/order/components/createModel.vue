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
  <el-form ref="createModel" :model="createModel" :rules="rules" label-position="left" label-width="90px" size="mini" class="panel-form">
    <el-form-item label="开始时间" class="panel-form-item" prop="start_time">
      <el-date-picker :default-value="new Date()" v-model="createModel.start_time" type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" class="panel-input" @change="changeStartTime"/>
    </el-form-item>
    <template v-if="plan_meal.meal_flag">
      <el-form-item v-for="(item, index) in createModel.meal_config" :key="index" :label="item.title" class="panel-form-item">
        <div v-if="item.key === 'buy_time'">
          <div v-if="item.valueType !== 'array'">
            <el-input ref="buy_time" v-model="createModel.buy_time" :readonly="item.readonly" controls-position="right" placeholder="" class="panel-input" @change="changeBuytime('price')">
              <el-select slot="append" v-model="createModel.time_unit" style="width:100px;" @change="changePrice('price')">
                <el-option
                  v-for="item in timetype"
                  :key="item.checked"
                  :label="item.text"
                  :value="item.value"
                  :disabled="item.status == '1' ? false :true"/>
              </el-select>
            </el-input>
          </div>
          <div v-if="item.valueType === 'array'" >
            <el-select slot="append" v-model="createModel.buy_time" style="width:100px;" @change="changePrice('price')">
              <el-option
                v-for="(record, index) in item.value"
                :key="index"
                :label="record"
                :value="record"/>
            </el-select>
            <el-select slot="append" v-model="createModel.time_unit" style="width:100px;" @change="changePrice('price')">
              <el-option
                v-for="item in timetype"
                :key="item.checked"
                :label="item.text"
                :value="item.value"
                :disabled="item.status == '1' ? false :true"/>
            </el-select>
          </div>

        </div>
        <div v-else-if="item.key === 'buy_num'" >
          <el-input-number
            v-if="plan_meal.product_flag !=='TS'"
            :min="Number(item.beishu) || 0"
            :step="Number(item.beishu)"
            v-model="createModel[item.key]"
            :disabled="item.readonly"
            controls-position="right"
            placeholder="请输入"
            class="panel-input input-number"
            @change="fieldValueChange(createModel[item.key],Number(item.beishu))" />
          <span v-if="plan_meal.product_flag !=='TS'" style="margin-left:10px;">{{ item.unit =='num' ? '个' : item.unit }}</span>
          <span v-if="item.default_value">基础配置：{{ "&nbsp;&nbsp;"+ item.default_value+"&nbsp;&nbsp;" }}{{ item.unit }}</span>
        </div>
        <div v-else>
          <div v-if="item.valueType === 'array'" >
            <el-select slot="append" v-model="createModel[item.key]" style="width:100px;" @change="changePrice('price')">
              <el-option
                v-for="(record, index) in item.value"
                :key="index"
                :label="record.title"
                :value="record.value"/>
            </el-select>
          </div>
          <div v-if="item.valueType !== 'array'" >
            <el-input-number v-model="createModel[item.key]" :readonly="item.readonly" placeholder="请输入" class="panel-input input-number" />
            <span style="margin-left:5px;">{{ item.unit =='min' ? '分钟' : item.unit }}</span>
          </div>
        </div>
      </el-form-item>
    </template>
    <el-form-item v-if="plan_meal.product_flag ==='TS' && createModel.meal_flag !=='' " label="基础容量" class="panel-form-item">
      <span>{{ TS_TEST.value || 0 }}{{ '&nbsp;&nbsp;'+ TS_TEST.unit }}</span>
    </el-form-item>
    <el-form-item v-if="getFilterFlagStatus(plan_meal.product_flag) && createModel.end_time !==''" label="到期时间" class="panel-form-item">
      <span>{{ createModel.end_time }}</span>
    </el-form-item>
  </el-form>
</template>
<script>
import { isArray } from '@/utils/array'
import * as FORM from './form'
import FilterFlag from '@/config/filterFlag'

export default {
  props: {
    createModel: Object,
    create_enable: {
      type: Boolean
    },
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
      meal: {},
      timetype: [],
      rules: {
        start_time: [{ type: 'date', required: true, validator: validateTime, trigger: 'change' }],
        buy_time: [{ required: true, trigger: 'blur', validator: validateBuyTime }]
      },
      TS_TEST: {
        value: '',
        unit: ''
      },
      end_time: '',
      useCoupon: false
    }
  },
  watch: {
    create_enable(val) {
      val && this.init(val)
    }
  },

  methods: {
    init() {
      this.setMeal(this.plan_meal)
    },

    setMeal(Meal) {
      // 获取选中的套餐
      const meal_detail = Meal['meal_detail']
      if (!Meal.id) {
        this.message.warning('套餐配置不正确,请联系管理员')
        return
      }
      this.createModel['product_meal_id'] = Meal['id']
      this.createModel['time_unit'] = meal_detail['meal_price']['time_unit'] || ''

      this.createModel['buy_time'] = '1'
      this.createModel['meal']['buy_num'] = '1'
      this.createModel['meal']['unit'] = meal_detail['meal_price']['unit'] || ''

      if (Meal.product_flag === 'TS') {
        this.TS_TEST = {
          value: meal_detail['meal_price']['min_buy'] || '',
          unit: meal_detail['meal_price']['count_unit'] || ''
        }
      }
      // 时长价格区间
      const count_type = meal_detail['meal_price']['count_type']
      const count_type_config = meal_detail['meal_price']['config']
      this.createModel.priceLevelMap = this.getPriceLevelMap(count_type, count_type_config)

      // default_fields 默认字段配置
      const default_fields = meal_detail['backstage_show'] ? meal_detail['backstage_show']['default_fields'] : []
      const meal_config = this.getMealConfig(meal_detail['default_fields'], default_fields, meal_detail['meal_price']['count_unit'], this.createModel, meal_detail)
      this.createModel.meal_config = meal_config
      // 计算价格
      this.discount_used = meal_detail['backstage_show'] && meal_detail['backstage_show']['discount_used'] || ''
      this.createModel.coupon_code = ''
      this.useCoupon = false
      this.changePrice('price')
    },
    // 时长价格区间
    getPriceLevelMap(count_type, count_type_config) {
      const priceLevelMap = []
      if (count_type === 'one_to_many') {
        count_type_config.forEach(function(item, index) {
          priceLevelMap.push(parseInt(item.value, 10))
        })
      }
      return priceLevelMap
    },
    // default_fields 默认字段配置， list --默认字段集合 default_unit -- 默认单位 from-- form表单
    getMealConfig(default_fields, list, default_unit, from, mealDetail) {
      const meal_config = []
      const that = this
      if (list && list.length) {
        list.forEach(function(record, index) {
          const field = default_fields[record]
          if (field) {
            const config_item = {
              title: field['title'],
              value: field['value'] || 1,
              valueType: isArray(field['value']) ? 'array' : typeof field['value'],
              key: record,
              unit: field['unit'] ? field['unit'] : default_unit,
              readonly: field['readonly'] === '1',
              beishu: field['beishu'] || 1,
              default_value: field['default_value']
            }

            that.setMealTimetype(record, field['unit'])
            from[config_item['key']] = config_item['valueType'] !== 'array' ? config_item['value'] : config_item['value'][0].value || config_item['value'][0] || ''
            meal_config.push(config_item)
          }
        })
      }
      return meal_config
    },

    // 设置时长单位
    setMealTimetype(type, time_unit) {
      const time_type = []
      if (type !== 'buy_time' && time_unit.length > 0) {
        return true
      }
      const text = { 'd': '天', 'm': '月', 'y': '年' }
      time_unit.forEach(function(val, index) {
        time_type.push({
          'text': text[val],
          'value': val,
          'status': '1'
        })
      })
      this.timetype = time_type
    },
    getFilterFlagStatus(flag) {
      const filter_flag = FilterFlag.NOT_EXPIRE_TIME_FLAG
      let status = true
      if (filter_flag.indexOf(flag) > -1) {
        status = false
      }
      return status
    },
    fieldValueChange(newValue, beishu, e) {
      const new_Value = Math.ceil(newValue / beishu) * beishu
      this.createModel.buy_num = new_Value
      this.changePrice('price')
    },

    changeStartTime() {
      if (this.plan_meal.product_flag === 'LS') {
        this.createModel.end_time = ''
      } else {
        this.createModel.end_time = FORM.getExcTime(this.createModel.start_time, this.createModel.buy_time, this.createModel.time_unit)
      }
      this.$emit('changePrice')
    },

    changePrice() {
      const { priceLevelMap, meal, buy_time } = this.createModel
      if (priceLevelMap.length > 0) {
        meal.price_level = this.getSortPriceLevel(priceLevelMap, buy_time)
      }
      this.getDefaultFieldValue(meal, this.createModel)
      this.changeStartTime()
      // this.$emit('changePrice')
    },

    getDefaultFieldValue(meal, from) {
      const default_fields = this.createModel.meal_config
      default_fields.forEach((record) => {
        const filter = ['buy_num', 'buy_time']
        if (filter.indexOf(record.key) < 0) {
          this.createModel['meal']['price_level'] = from[record.key]
        }
      })
    },
    // 获取价格等级
    getSortPriceLevel(arr, number) {
      let level = 0
      let newArr = []
      newArr = arr.concat()
      newArr.push(parseInt(number, 10))
      newArr = newArr.sort(function(a, b) {
        return a - b
      })
      newArr.forEach(function(value, index) {
        if (value === number) {
          if (index === 0) {
            level = newArr[index + 1]
          } else if (value > arr[index - 1] && value < arr[index + 1]) {
            level = newArr[index - 1]
          } else if (value === arr[index - 1]) {
            level = newArr[index - 1]
          } else if (value === arr[index + 1]) {
            level = newArr[index + 1]
          } else if (index === arr.length - 1) {
            level = newArr[index - 1]
          }
        }
      })
      return level
    },

    changeBuytime() {
      let buy_time = this.createModel.buy_time
      const time_unit = this.createModel.time_unit

      if (isNaN(Number(buy_time))) {
        this.createModel.buy_time = 1
      } else {
        let newValue = Math.ceil(Number(buy_time))
        if (newValue === 0) {
          newValue = 1
        }
        //  else if (time_unit === 'd' && newValue > 30) {
        //   newValue = 30
        // }
        // else if (time_unit === 'm' && newValue > 10) {
        //   newValue = 10
        // }
        this.createModel.buy_time = newValue
        buy_time = newValue
      }
      if (buy_time && time_unit) {
        this.changeStartTime()
        // this.$emit('changePrice')
      }
    },

    setBuyTime() {
      const default_fields = this.meal.backstage_show.default_fields
      if (default_fields.buy_time || default_fields.indexOf('buy_time') > -1) {
        const buy_time = this.meal.default_fields.buy_time
        this.createModel.buy_time = buy_time.value || 1
        this.createModel.time_unit = this.meal.meal_price.time_unit
        this.createModel.buy_time_status = Number(buy_time.readonly) === 1 // 1禁用
        if (buy_time && buy_time.unit.length > 0) {
          const unit_text = {
            'd': '日', 'm': '月', 'y': '年'
          }
          const timetype = []
          buy_time.unit.forEach(item => {
            timetype.push({
              text: unit_text[item], value: item
            })
          })

          this.timetype = timetype
        } else {
          this.timetype = [
            { text: '日', value: 'd' },
            { text: '月', value: 'm' },
            { text: '年', value: 'y' }
          ]
          this.createModel.time_unit = 'd'
        }
      } else {
        this.timetype = []
      }
    }
  }

}
</script>
