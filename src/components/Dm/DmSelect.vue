<style lang="scss">
.el-select.DmSelect {
  width: 200px;
}
</style>
<template>
  <el-select
    v-model="val"
    :placeholder="placeholder"
    :filterable="filterable"
    :multiple="multiple"
    :disabled="disabled"
    :collapse-tags="'collapse-tags'"
    :class="b()"
    :clearable="clearable"
    @change="handleChange"
  >
    <el-option
      v-if="defaultText"
      :label="defaultText"
      :value="defaultValue"
    >{{ defaultText }}</el-option>
    <el-option
      v-for="item in selects"
      :key="item.value + Math.random().toString(36).substr(-10)"
      :disabled="item[optionParams.disabled]"
      :value="item[optionParams.value]"
      :label="item[optionParams.label]"
    />
  </el-select>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  name: 'DmSelect',

  props: {
    placeholder: String,
    disabled: Boolean,
    filterable: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    'collapse-tags': {
      type: Boolean,
      default: false
    },
    defaultText: String,
    defaultValue: {
      type: [String, Number, Boolean],
      default: '' || false
    },
    size: {
      type: String,
      default: ''
    },
    selects: {
      type: Array,
      default: () => []
    },
    value: [String, Number, Array],
    optionParams: {
      type: Object,
      default: () => {
        return {
          label: 'label',
          value: 'value',
          disabled: 'disabled'
        }
      }
    }
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
  },

  methods: {
    handleChange(value) {
      setTimeout(() => {
        this.$emit('change', this.value)
      }, 50)
    }
  }
})
</script>
