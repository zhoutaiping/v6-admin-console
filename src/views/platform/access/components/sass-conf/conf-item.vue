<template>
  <el-form
    ref="Form"
    :model="form"
    :rules="rules"
    label-position="left"
    label-width="120px"
  >
    <el-form-item
      label-width="0"
      prop="display"
      class="item-box"
    >
      <el-checkbox
        v-model="form.display"
        @change="e => {
          form.required = true
          form.content = default_form.content
        }"
      >{{ title }}</el-checkbox>
    </el-form-item>
    <el-form-item
      v-show="form.display"
      label="字段属性"
      class="item-box"
      prop="display"
    >
      <el-select
        v-model="form.required"
        class="input-box"
      >
        <el-option
          v-for="(item, index) in option.required"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      v-show="form.display"
      label="字段内容"
      class="item-box"
      prop="content"
    >
      <template v-if="item_key==='name_id_format'">
        <el-select
          v-model="form.content"
          clearable
          class="input-box"
        >
          <el-option
            v-for="(item, index) in option.content"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>
      <template v-else-if="item_key==='access_token_expire_time' || item_key==='refresh_token_expire_time'">
        <el-input-number
          v-model="form.content"
          :controls="false"
          :min="0"
          :precision="0"
          placeholder=""
          class="input-box"
        />
      </template>
      <template v-else-if="item_key==='algorithmMethod'">
        <el-select
          v-model="form.content"
          clearable
          class="input-box"
        >
          <el-option
            v-for="(item, index) in option.AlgorithmMethod"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>
      <template v-else-if="item_key==='digestMethod'">
        <el-select
          v-model="form.content"
          clearable
          class="input-box"
        >
          <el-option
            v-for="(item, index) in option.DigestMethod"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>
      <template v-else>
        <el-input
          v-model="form.content"
          placeholder=" "
          clearable
          class="input-box"
        />
      </template>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    item_key: {
      type: String,
      default: ''
    },
    default_form: {
      type: [Object],
      default: () => {
        return {
          display: false,
          required: true,
          content: ''
        }
      }
    }
  },
  data() {
    return {
      form: {},
      rules: {
        display: [],
        required: [],
        content: []
      },

      option: {
        required: [
          { label: '必填', value: true },
          { label: '非必填', value: false }
        ],
        content: [
          { label: 'unspecified', value: 'unspecified' },
          { label: 'emailAddress', value: 'emailAddress' },
          { label: 'persistent', value: 'persistent' },
          { label: 'transient', value: 'transient' }
        ],
        AlgorithmMethod: [
          { label: 'RSA_SHA1', value: 'RSA_SHA1' },
          { label: 'RSA_SHA256', value: 'RSA_SHA256' },
          { label: 'RSA_SHA512', value: 'RSA_SHA512' },
          { label: 'RSA_RIPEMD160', value: 'RSA_RIPEMD160' }
        ],
        DigestMethod: [
          { label: 'SHA1', value: 'SHA1' },
          { label: 'SHA256', value: 'SHA256' },
          { label: 'SHA512', value: 'SHA512' },
          { label: 'RIPEMD160', value: 'RIPEMD160' }
        ]
      }
    }
  },
  created() {
    this.form = Object.assign({}, this.default_form)
  },
  methods: {
    init(data = null) {
      this.form = Object.assign({}, this.default_form)

      if (this.$refs.Form) {
        this.$refs.Form.resetFields()
      }

      if (this.item_key && data && Object.keys(data.saas_conf).length) {
        const conf = { ...data.saas_conf }
        const default_value = { ...conf[this.item_key] } || {}
        if (Object.keys(default_value).length) {
          this.form = Object.assign({}, default_value)
          return
        }
      }
    },

    getForm() {
      if (this.form.display) {
        return { ...this.form }
      }
      return null
    }
  }
}
</script>
<style lang="scss" scoped>
.input-box {
  width: 300px;
}
.item-box {
  margin-bottom: 5px;
}
</style>
