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
          form.content = []
        }"
      >{{ title }}</el-checkbox>
    </el-form-item>
    <el-form-item
      v-show="form.display"
      label="字段属性"
      class="item-box"
      prop="required"
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
      label="是否支持添加"
      class="item-box"
      prop="allowAdd"
    >
      <el-select
        v-model="form.allowAdd"
        class="input-box"
      >
        <el-option
          v-for="(item, index) in option.allowAdd"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      v-show="form.display"
      label-width="0"
      class="item-box"
      prop="content"
    >
      <DmTable
        add-button
        @click-add-button="handleAddRow"
      >
        <el-table :data="form.content">
          <el-table-column label="内容">
            <template slot-scope="scope">
              Name
              <el-input
                v-model="scope.row.name"
                style="width:320px"
              >
                <el-select
                  slot="append"
                  v-model="scope.row.nameFormat"
                  clearable
                  style="width:140px"
                >
                  <el-option
                    v-for="(item, i_index) in option.nameFormat"
                    :key="i_index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-input>
              Value
              <el-select
                v-model="scope.row.value"
                allow-create
                filterable
                clearable
                style="width:180px"
              >
                <el-option
                  v-for="(item, i_index) in option.nameValue"
                  :key="i_index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>

              <el-button
                style="float: right;"
                type="text"
                @click="handleRemove(scope.$index)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </el-form-item>
  </el-form>
</template>
<script>
import { deepClone } from '@/utils'
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
          allowAdd: true,
          content: []
        }
      }
    }
  },
  data() {
    return {
      form: {
        content: []
      },
      rules: {
        display: [],
        required: [],
        allowAdd: [],
        content: []
      },
      option: {
        required: [
          { label: '必填', value: true },
          { label: '非必填', value: false }
        ],
        allowAdd: [
          { label: '是', value: true },
          { label: '否', value: false }
        ],
        nameFormat: [
          { label: 'unspecified', value: 'unspecified' },
          { label: 'URI Reference', value: 'URI Reference' },
          { label: 'Basic', value: 'Basic' }
        ],
        nameValue: [
          { label: 'user.firstName', value: 'user.firstName' },
          { label: 'user.lastName', value: 'user.lastName' },
          { label: 'user.email', value: 'user.email' },
          { label: 'user.login', value: 'user.login' },
          { label: 'device.trusted', value: 'device.trusted' }
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
          this.form = Object.assign({
            display: false,
            required: true,
            allowAdd: true,
            content: []
          }, default_value)
          console.log({ ...this.form })
          return
        }
      }
    },
    handleAddRow() {
      if (this.form.content) {
        this.form.content.push({ name: '', nameFormat: 'unspecified', value: '' })
        return
      }
      this.form.content = [{ name: '', nameFormat: '', value: '' }]
    },

    handleRemove(index) {
      const newFileList = deepClone(this.form.content)
      newFileList.splice(index, 1)
      this.form.content = newFileList
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
