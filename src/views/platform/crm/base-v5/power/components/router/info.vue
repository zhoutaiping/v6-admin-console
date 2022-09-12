<style lang="scss" scoped>
.input-box {
  width: 400px;
}
</style>
<template>
  <DmDialog
    ref="dialog"
    :footer="false"
    title="详情"
    width="600px"
    aside
  >
    <DmScroll>
      <el-form :model="form" label-width="100px" label-position="left">
        <el-form-item label="API名称">
          <el-input v-model="form.api_name" readonly placeholder="" class="input-box"/>
        </el-form-item>
        <el-form-item label="API">
          <el-input v-model="form.api" readonly placeholder="" class="input-box"/>
        </el-form-item>
        <el-form-item label="系统">
          <el-input v-model="form.sys_name" readonly placeholder="" class="input-box"/>
        </el-form-item>
        <el-form-item label="请求方式">
          <el-input v-model="form.method" readonly placeholder="" class="input-box"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio v-for="item in option.status" :disabled="form.status!==item.value" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.doc" type="textarea" readonly placeholder="" class="input-box"/>
        </el-form-item>
      </el-form>
    </DmScroll>
  </DmDialog>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      form: {},
      option: {
        status: [
          { label: '未启用', value: '0' },
          { label: '上架', value: '1' },
          { label: '下架', value: '2' }
        ]
      }
    }
  },
  methods: {
    handleOpen(data, option) {
      this.$nextTick(() => {
        this.$refs.dialog.handleOpen()
        this.form = Object.assign({}, JSON.parse(JSON.stringify(data)))
      })
    }
  }
}
</script>
