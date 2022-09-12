<style lang="scss" scoped>
.input-box {
  width: 300px;
}
.item-box {
  margin-bottom: 5px;
}
</style>
<template>
  <div>
    <dm-dialog
      ref="dialog"
      :fetch-submit="fetchSubmit"
      :mode="mode"
      title-label="消息模板"
      width="600px"
    >
      <el-form
        ref="Form"
        :model="form"
        :rules="rules"
        label-position="left"
        label-width="120px"
      >
        <el-button @click="handleAdd">新增</el-button>
        <el-table :data="list">
          <el-table-column label="NAME">
            <template slot-scope="scope">
              <el-form
                :ref="'name-'+ scope.$index"
                :model="scope.row"
                :rules="RowRules"
              >
                <el-form-item prop="name">
                  <el-input v-model="scope.row.name" />
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="DESC">
            <template slot-scope="scope">
              <el-form
                :ref="'desc-'+ scope.$index"
                :model="scope.row"
                :rules="RowRules"
              >
                <el-form-item prop="desc">
                  <el-input v-model="scope.row.desc" />
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </dm-dialog>
  </div>
</template>
<script>
import { deepClone } from '@/utils'
export default {
  data() {
    return {
      mode: 'Create',
      form: {
        list: []
      },
      list: [],
      row: {
        id: '',
        name: '',
        desc: ''
      },
      rowKey: ['name', 'desc'],
      RowRules: {
        name: { required: true, message: ' ' },
        desc: { required: true, message: ' ' }
      },
      rules: {
        name: [{ required: true, message: ' ' }],
        flag: [{ required: true, message: ' ' }],
        type: [{ required: true, message: ' ' }]
      },
      option: {
        type1: [],
        type2: []
      }
    }
  },
  methods: {
    handleOpen(data, option = 'Create') {
      this.mode = option
      this.$nextTick(() => {
        this.$refs.dialog.handleOpen()
        if (this.$refs.Form) {
          this.$refs.Form.resetFields()
        }

        if (option === 'Edit') {
          this.form = Object.assign({}, data)
        }
      })
    },

    handleCheckRow(index) {
      let o = true
      this.rowKey.forEach((key) => {
        const keyIndex = `${key}-${index}`
        if (this.$refs[keyIndex] && this.$refs[keyIndex].validate) {
          o = this.$refs[keyIndex].validate()
          if (!o) throw new Error('validate error')
        }
      })
      return o
    },
    async handleCheckList() {
      const list = this.list
      for (let i = 0; i < list.length; i++) {
        try {
          await this.handleCheckRow(i)
        } catch (e) {
          throw new Error()
        }
      }
    },

    async handleAdd() {
      const list = deepClone(this.list)
      if (list.length > 0) {
        try {
          await this.handleCheckRow(list.length - 1)
        } catch (e) {
          throw new Error()
        }
      }

      this.list.push(deepClone(this.row))
    },
    async fetchSubmit() {
      await this.handleCheckList()
      this.$refs.Form.validate((valid) => {
        if (valid) {
          //
        } else {
          this.$refs.dialog.afterValidate()
        }
      })
    }
  }
}
</script>
