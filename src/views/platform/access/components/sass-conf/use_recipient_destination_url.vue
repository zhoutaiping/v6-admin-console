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
        @change="e =>{
          form.required = true
          form.recipient_url = ''
          form.destination_url = ''
        }"
      >Use this for Recipient URL and Destination URL</el-checkbox>
    </el-form-item>
    <el-form-item
      v-show="form.display"
      label="默认状态"
      class="item-box"
    >
      <el-select
        v-model="form.required"
        class="input-box"
        @change="e =>{
          form.recipient_url = ''
          form.destination_url = ''
        }"
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
      label="Recipient_url"
      class="item-box"
    >
      <el-input
        v-model="form.recipient_url"
        placeholder=" "
        clearable
        class="input-box"
      />
    </el-form-item>
    <el-form-item
      v-show="form.display"
      label="Destination_url"
      class="item-box"
    >
      <el-input
        v-model="form.destination_url"
        placeholder=" "
        clearable
        class="input-box"
      />
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Attribute'
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
          recipient_url: '',
          destination_url: ''
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
        recipient_url: [],
        destination_url: []
      },

      option: {
        required: [
          { label: '选中', value: true },
          { label: '未选择', value: false }
        ]
      }
    }
  },
  created() {
    this.form = Object.assign({}, this.default_form)
  },
  methods: {
    init(data) {
      this.form = Object.assign({}, this.default_form)
      if (this.$refs.Form) {
        this.$refs.Form.resetFields()
      }
      if (this.item_key && data && Object.keys(data.saas_conf).length) {
        const default_value = data.saas_conf[this.item_key] || {}
        if (Object.keys(default_value).length) {
          this.form = Object.assign({}, default_value)
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
