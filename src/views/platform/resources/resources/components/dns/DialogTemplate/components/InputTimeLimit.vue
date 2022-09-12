<template>
  <span :class="b()">
    <template v-if="form.type === 'second'">
      <el-input-number
        v-model="form.value"
        :min="1"
        :max="3600"
        controls-position="right"
        @change="hanldeUpdate"
      />
    </template>
    <template v-if="form.type === 'minute'">
      <el-input-number
        v-model="form.value"
        :min="1"
        :max="60"
        controls-position="right"
        @change="hanldeUpdate"
      />
    </template>
    <template v-if="form.type === 'hours'">
      <el-input-number
        v-model="form.value"
        :min="1"
        :max="24"
        controls-position="right"
        @change="hanldeUpdate"
      />
    </template>
    <template v-if="form.type === 'day'">
      <el-input-number
        v-model="form.value"
        :min="1"
        :max="7"
        controls-position="right"
        @change="hanldeUpdate"
      />
    </template>
    <DmSelect
      :selects="options"
      v-model="form.type"
      style="width: 100px; margin-left: 10px"
      @change="hanldeUpdate"
    />
  </span>
</template>

<script>
import create from '@/utils/create-basic'
import { deepClone } from '@/utils'

export default create({
  name: 'InputTimeLimit',

  props: {
    value: Object,
    typeKey: {
      type: String,
      default: 'type'
    },
    formatValue: Function,
    formatUpdate: Function,
    valueKey: {
      type: String,
      default: 'value'
    }
  },

  data() {
    return {
      form: {
        type: 'minute',
        value: ''
      },
      options: [
        {
          label: '分钟',
          value: 'minute'
        },
        {
          label: '小时',
          value: 'hours'
        },
        {
          label: '天',
          value: 'day'
        }
      ]
    }
  },

  watch: {
    value(val) {
      this.init()
    }
  },

  created() {
    this.init()
  },

  methods: {
    init() {
      const value = deepClone(this.value)
      if (typeof value === 'object') {
        let _form
        if (this.formatValue) {
          _form = this.formatValue(value)
        } else {
          _form = {
            type: value[this.typeKey],
            value: value[this.valueKey]
          }
        }

        this.form = _form
      } else {
        this.form = {
          type: 'minute',
          value: ''
        }
      }
    },

    hanldeUpdate() {
      const { value, type } = this.form
      let form

      if (this.formatUpdate) {
        form = this.formatUpdate(type, value)
      } else {
        form = {
          [this.valueKey]: value,
          [this.typeKey]: type
        }
      }
      this.$emit('input', form)
    }
  }
})
</script>
