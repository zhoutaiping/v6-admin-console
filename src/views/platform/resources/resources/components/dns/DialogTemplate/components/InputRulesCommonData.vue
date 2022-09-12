<template>
  <div>
    <el-form
      ref="Form"
      :model="{ val }"
      :rules="rules"
    >
      <el-form-item prop="val">
        <template v-if="type === 'len_equals' || type === 'len_greater_than'">
          <el-input
            v-model="val"
            placeholder="请填写大于或等于0数字"
          />
        </template>
        <template v-else-if="type === 'len_less_than'">
          <el-input
            v-model="val"
            placeholder="请填写大于0数字"
          />
        </template>
        <template v-else-if="type === 'not_exist'">
          <el-input
            placeholder="无需填写"
            disabled
          />
        </template>
        <template v-else-if="LIMIT_TYPES.includes(type)">
          <InputRuleLimit v-model="val"/>
        </template>
        <template v-else>
          <InputMultiple
            v-if="multiple"
            v-model="val"
            :placeholder="placeholder"
            :placeholder-item="placeholderItem"
          />
          <el-input
            v-else
            v-model="val"
            :placeholder="placeholder"
          />
        </template>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import InputMultiple from '@/components/Input/InputMultiple'
import InputRuleLimit from '@/components/Input/InputRuleLimit'

const LEN_TYPES = ['len_less_than', 'len_greater_than', 'len_equals']
const MULTIPLE_TYPES = ['contains', 'not_contains', 'equals', 'not_equals']
const LIMIT_TYPES = ['key_rate_greater_than', 'value_rate_greater_than']

function validateArr(rule, value, callback) {
  if (value.length === 0) {
    callback(new Error(' '))
  } else {
    callback()
  }
}

export default {
  components: { InputMultiple, InputRuleLimit },

  props: {
    logic: String,
    value: [Object, Array, String],
    itemRules: [Array, Object],
    placeholder: String,
    placeholderItem: String,
    multiple: Boolean
  },

  data() {
    return {
      LIMIT_TYPES,
      val: '',
      type: '',
      rules: {
        val: [{ required: true, trigger: 'blur', message: ' ' }]
      }
    }
  },

  watch: {
    logic(val) {
      this.init()
    },

    value(val) {
      this.init()
    },

    val() {
      this.handleChange()
    }
  },

  created() {
    this.init()
  },

  methods: {
    validate() {
      try {
        this.$refs.Form.validate(valid => {
          if (!valid) throw new Error()
        })
      } catch (e) {
        return false
      }
      return true
    },

    init() {
      const logic = this.logic
      const value = this.value

      let rule
      // 数字
      if (LEN_TYPES.includes(logic)) {
        if (typeof value === 'object') {
          const { len = '' } = value
          this.val = len
        } else {
          this.val = ''
        }
        rule = [{ required: true, trigger: 'blur', message: ' ' }]
      } else if (MULTIPLE_TYPES.includes(logic)) { // 包含
        if (this.multiple) {
          this.val = Array.isArray(value) ? value : []
          rule = [{ validator: validateArr, trigger: 'blur' }]
        } else {
          this.val = typeof value === 'string' ? value : ''
          rule = [{ required: true, trigger: 'blur', message: ' ' }]
        }
      } else if (LIMIT_TYPES.includes(logic)) {
        this.val = value
      } else if (logic === 'not_exist') { // 不存在
        this.val = ''
      } else {
        this.val = Array.isArray(value) ? '' : value
      }

      this.rules = {
        val: rule
      }
      this.type = logic
    },

    handleChange() {
      if (LEN_TYPES.includes(this.type)) {
        this.$emit('input', {
          len: Number(this.val)
        })
      } else {
        this.$emit('input', this.val)
      }
    }
  }
}
</script>
