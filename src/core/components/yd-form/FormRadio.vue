<template>
  <el-radio-group
    v-model="val"
    :size="size"
  >
    <el-radio
      v-for="item in radios"
      :size="size"
      :key="item.value"
      :disabled="item.disabled || disabled"
      :label="item.value"
      :border="border"
    >{{ item.label }}</el-radio>
  </el-radio-group>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  name: 'yd-form-radio',

  props: {
    disabled: Boolean,
    size: {
      type: String,
      default: 'small'
    },
    border: {
      type: Boolean,
      default: false
    },
    radios: {
      type: Array,
      default: () => {
        return []
      }
    },
    value: [String, Number, Boolean]
  },

  data() {
    return {
      val: this.value
    }
  },

  watch: {
    val(val) {
      this.$emit('input', val)
      this.$emit('change', val)
    },
    value(val) {
      this.val = val
    }
  }
})
</script>
