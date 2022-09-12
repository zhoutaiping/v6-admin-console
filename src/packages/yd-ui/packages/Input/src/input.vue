<template>
  <div
    :class="[
      type === 'textarea' ? 'el-textarea' : 'el-input',
      size ? 'el-input--' + size : '',
      {
        'is-disabled': disabled,
        'el-input-group': $slots.prepend || $slots.append,
        'el-input-group--append': $slots.append,
        'el-input-group--prepend': $slots.prepend
      }
  ]">
    <template v-if="type !== 'textarea'">
      <!-- 前置元素 -->
      <div v-if="$slots.prepend" class="el-input-group__prepend">
        <slot name="prepend"/>
      </div>
      <!-- input 图标 -->
      <slot name="icon">
        <i
          v-if="icon"
          :class="[
            'el-icon-' + icon,
            onIconClick ? 'is-clickable' : ''
          ]"
          class="el-input__icon"
          @click="handleIconClick"/>
      </slot>
      <input v-if="type !== 'textarea'" ref="input" v-bind="$props" :autocomplete="autoComplete" :value="currentValue" class="el-input__inner" @input="handleInput" @focus="handleFocus" @blur="handleBlur">
      <i v-if="validating" class="el-input__icon el-icon-loading"/>
      <!-- 后置元素 -->
      <div v-if="$slots.append" class="el-input-group__append">
        <slot name="append"/>
      </div>
    </template>
    <textarea v-else ref="textarea" :value="currentValue" v-bind="$props" :style="textareaStyle" class="el-textarea__inner" @input="handleInput" @focus="handleFocus" @blur="handleBlur"/>
  </div>
</template>
<script>
import emitter from 'element-ui/src/mixins/emitter'
import calcTextareaHeight from './calcTextareaHeight'
import merge from 'element-ui/src/utils/merge'

export default {
  name: 'YdInput',

  componentName: 'YdInput',

  mixins: [emitter],

  props: {
    value: [String, Number],
    placeholder: String,
    size: String,
    resize: String,
    readonly: Boolean,
    autofocus: Boolean,
    icon: String,
    disabled: Boolean,
    type: {
      type: String,
      default: 'text'
    },
    name: String,
    autosize: {
      type: [Boolean, Object],
      default: false
    },
    rows: {
      type: Number,
      default: 2
    },
    autoComplete: {
      type: String,
      default: 'off'
    },
    form: String,
    maxlength: Number,
    minlength: Number,
    validateEvent: {
      type: Boolean,
      default: true
    },
    onIconClick: Function
  },

  data() {
    return {
      currentValue: this.value,
      textareaCalcStyle: {}
    }
  },

  computed: {
    validating() {
      return this.$parent.validateState === 'validating'
    },
    textareaStyle() {
      return merge({}, this.textareaCalcStyle, { resize: this.resize })
    }
  },

  watch: {
    value(val, oldValue) {
      this.setCurrentValue(val)
    }
  },

  created() {
    this.$on('inputSelect', this.inputSelect)
  },

  mounted() {
    this.resizeTextarea()
  },

  methods: {
    handleBlur(event) {
      this.$emit('blur', event)
      if (this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.blur', [this.currentValue])
      }
    },
    inputSelect() {
      this.$refs.input.select()
    },
    resizeTextarea() {
      if (this.$isServer) return
      const { autosize, type } = this
      if (!autosize || type !== 'textarea') return
      const minRows = autosize.minRows
      const maxRows = autosize.maxRows

      this.textareaCalcStyle = calcTextareaHeight(this.$refs.textarea, minRows, maxRows)
    },
    handleFocus(event) {
      this.$emit('focus', event)
    },
    handleInput(event) {
      const value = event.target.value
      this.$emit('input', value)
      this.setCurrentValue(value)
      this.$emit('change', value)
    },
    handleIconClick(event) {
      if (this.onIconClick) {
        this.onIconClick(event)
      }
      this.$emit('click', event)
    },
    setCurrentValue(value) {
      if (value === this.currentValue) return
      this.$nextTick(_ => {
        this.resizeTextarea()
      })
      this.currentValue = value
      if (this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.change', [value])
      }
    }
  }
}
</script>
