<template>
  <div :class="b()">
    <el-form
      :model="form"
      :rules="rules"
      inline
    >
      <el-form-item prop="interval">
        <el-input-number
          v-model="form.interval"
          :min="1"
          :max="20"
          style="width: 120px; margin-right: 10px"
          placeholder="1 - 20"
          controls-position="right"
          @change="handleChange"
        />
        秒
      </el-form-item>
      <el-form-item prop="reqs">
        <el-input-number
          :min="1"
          :max="1000"
          v-model="form.reqs"
          controls-position="right"
          style="width: 120px; margin-right: 10px"
          @change="handleChange"
        />
        次
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import create from '@/utils/create-basic'

function validatorNumber(min, max) {
  return function intvalValidate(rule, value, callback) {
    if (!value) callback(new Error())
    const val = parseInt(value, 10)
    if (isNaN(val)) callback(new Error())

    if (min <= val && val <= max) {
      callback()
    } else {
      callback(new Error())
    }
  }
}

export default create({
  name: 'InputRuleLimit',

  props: {
    value: {
      type: [Object, Array, String]
    }
  },

  data() {
    return {
      rules: {
        interval: [
          { validator: validatorNumber(1, 20), message: ' ', trigger: 'blur' }
        ],
        reqs: [
          { validator: validatorNumber(1, 1000), message: ' ', trigger: 'blur' }
        ]
      },
      form: {
        interval: '',
        reqs: ''
      }
    }
  },

  created() {
    this.init()
  },

  methods: {
    init() {
      const value = this.value
      if (typeof value === 'object') {
        const { interval = '', reqs = '' } = value

        const form = {
          ...value,
          interval,
          reqs
        }
        this.form = form
        // this.form.interval = interval
        // this.form.reqs = reqs
      } else {
        this.form.interval = 1
        this.form.reqs = 1
      }
      this.handleChange()
    },

    handleChange() {
      this.$emit('input', this.form)
    }
  }
})
</script>
