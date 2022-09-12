<template>
  <el-radio-group v-model="val" size="small">
    <el-radio-button v-for="item in radios" :key="item.value" :disabled="item.disabled" :label="item.value">{{ item.label }}</el-radio-button>
    <slot/>
  </el-radio-group>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  name: 'yd-form-radio-button',

  props: {
    size: {
      type: String,
      default: ''
    },
    border: {
      type: Boolean,
      default: false
    },
    radios: {
      type: Array,
      default: () => []
    },
    value: [String, Number]
  },

  data() {
    return {
      val: this.value
    }
  },

  watch: {
    val(val) {
      this.$emit('input', val)
    },
    value(val) {
      this.val = val
    }
  }
})
</script>
