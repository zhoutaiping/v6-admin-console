<style lang="scss" scoped>
  .dialog-item-input{
    width: 250px;
  }
</style>

<template>
  <el-dialog :visible="editMealName.visible" :close-on-click-modal="false" :close-on-press-escape="true" title="修改套餐别名" width="500px" @close="closeEditForm">
    <el-form ref="editForm" :model="editForm" :rules="rules" label-width="90px" size="mini" label-position="left">
      <el-form-item label="id" prop="id">
        <el-input v-model="editForm.id" :readonly="true" placeholder="请输入套餐ID" class="dialog-item-input" />
      </el-form-item>
      <el-form-item label="套餐别名" prop="plan_diy_name">
        <el-input v-model="editForm.plan_diy_name" placeholder="请输入套餐别名" class="dialog-item-input"/>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="editForm.remark" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入备注" type="textarea" class="dialog-item-input"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" >
      <el-button @click="closeEditForm">取 消</el-button>
      <el-button type="primary" @click="saveEditForm">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import MealResource from '@/api/mealApi'
export default {
  data() {
    return {
      editMealName: {
        visible: false,
        loading: false
      },
      rules: {
        id: [{ required: true, message: '必填字段', trigger: 'blur' }],
        plan_diy_name: [{ required: true, message: '请填套餐别名', trigger: ['change', 'blur'] }]
      },
      editForm: {}
    }
  },
  methods: {
    handleOpen(data) {
      this.editMealName.visible = true
      this.editMealName.loading = true
      this.editForm = Object.assign({ id: '', plan_diy_name: '', remark: '' }, data)
      setTimeout(() => {
        this.editMealName.loading = false
      }, 1000)
    },

    closeEditForm() {
      this.editMealName.visible = false
      this.$refs['editForm'].resetFields()
    },
    saveEditForm() {
      const form = this.$refs['editForm']
      form.validate(valid => {
        if (valid) {
          const { id, plan_diy_name, remark } = this.editForm
          const params = {
            id, plan_diy_name, remark
          }
          MealResource.editDiyPlanName(params).then(res => {
            this.Message('ACTION_SUCCESS')
            this.$emit('fetchData')
            this.editMealName.visible = false
          }).catch(e => {})
        }
      })
    }
  }
}
</script>
