<template>
  <el-select
    v-model="val"
    :size="size"
    :placeholder="placeholder"
    :disabled="disabled"
    :filterable="filterable"
    :allow-create="allowCreate"
    :multiple="multiple"
    :collapse-tags="collapseTags"
    @change="handleChange"
  >
    <el-option
      v-if="defaultText"
      :size="size"
      :label="defaultText"
      value=""
    >{{ defaultText }}</el-option>
    <el-option
      v-for="item in selectsView"
      :size="size"
      :key="item.value"
      :disabled="item.disabled"
      :value="item.value"
      :label="item.label"
    >
      {{ item.label }}
    </el-option>
  </el-select>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  name: 'yd-form-select',

  props: {
    placeholder: String,
    disabled: Boolean,
    multiple: Boolean,
    collapseTags: Boolean,
    allowCreate: Boolean,
    defaultText: String,
    size: {
      type: String,
      default: ''
    },
    selects: {
      type: Array,
      default: () => []
    },
    filterable: Boolean,
    value: [String, Number, Array]
  },

  data() {
    return {
      val: this.value,
      selectsView: []
    }
  },

  mounted() {
    this.initSelects(this.selects)
  },

  watch: {
    selects(val) {
      this.initSelects(val)
    },
    val(val) {
      this.$emit('input', val)
    },
    value(val) {
      this.val = val
    }
  },

  methods: {
    initSelects(selects) {
      // selects = deepClone(selects)
      // selects.forEach(item => {
      //   item.label = item.label.replace('__companyEN__', this.appInfo.companyEN)
      // })
      this.selectsView = selects
    },

    handleChange(value) {
      this.$emit('input', value)
      this.$emit('change', value)
    }
  }
})
</script>
