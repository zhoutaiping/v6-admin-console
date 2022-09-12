<template>
  <div class="role_save">
    <FDialog
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      :visible.sync="visible"
      :title="title"
      width="500px"
    >
      <el-form
        v-loading="loading"
        ref="Form"
        :model="dialogSave"
        :rules="rules"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="角色名称" prop="name" >
          <el-input
            v-model="dialogSave.name"
            placeholder="请输入角色名称"
            clearable
            class="dialog—save-input"
          />
        </el-form-item>
        <el-form-item label="角色状态" prop="status" >
          <el-radio-group v-model="dialogSave.status">
            <el-radio-button label="1">启用</el-radio-button>
            <el-radio-button label="0">禁用</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="type === 'update'" label="创建时间" prop="created_at" >
          <span>{{ dialogSave.created_at }}</span>
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remark"
        >
          <el-input
            v-model="dialogSave.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            clearable
            placeholder="备注"
            type="textarea"
            class="dialog—save-input"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" >
        <el-button type="info" @click="e =>{visible = false}" >取 消</el-button>
        <el-button type="primary" @click="handleClick('Form')" >确 定</el-button>
      </div>
    </FDialog>
  </div>
</template>

<script>
import RoleResource from '@/views/platform/crm/system/resourceApi/roleApi'
import moment from 'moment'
export default {
  data() {
    return {
      loading: false,
      visible: false,
      title: '新增',
      type: 'add',
      dialogSave: {
        id: '',
        name: '',
        status: 1,
        remark: '',
        created_at: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      },
      rules: {
        name: [{ required: true, message: ' ' }],
        status: [{ required: true, message: ' ' }],
        created_at: [],
        remark: []
      }
    }
  },
  methods: {
    handleOpen(data, type) {
      this.type = type
      this.$nextTick(() => {
        this.visible = true
        if (this.$refs.Form) {
          this.$refs.Form.resetFields()
        }
        this.loading = true
        if (this.type === 'update') {
          this.title = '编辑'
          this.getRole(data)
        }
        setTimeout(() => { this.loading = false }, 500)
      })
    },

    async getRole(data) {
      const params = { id: data.id }
      try {
        await RoleResource.getRoleById(params).then(res => {
          this.dialogSave = Object.assign({}, res)
        })
      } catch (e) {
        this.dialogSave = Object.assign({}, data)
        return
      }
    },

    handleClick(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          const params = {
            id: this.dialogSave.id,
            name: this.dialogSave.name,
            remark: this.dialogSave.remark,
            status: this.dialogSave.status
          }
          if (this.type === 'add') {
            this.handleAdd(params)
          } else if (this.type === 'update') {
            this.handleUpdate(params)
          }
        }
      })
    },

    async handleAdd(params) {
      try {
        await RoleResource.roleAdd(params)
        this.message.success('新增成功')
        this.$emit('on-success')
        this.visible = false
      } catch (error) {
        return error
      }
    },

    async handleUpdate(params) {
      try {
        await RoleResource.roleUpdate(params)
        this.Message('ACTION_SUCCESS')
        this.$emit('on-success')
        this.visible = false
      } catch (error) {
        return error
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.dialog—save-input {
  width: 300px;
}
.form--main {
  display: flex;
}
.form--center {
  flex: 1;
}
</style>
