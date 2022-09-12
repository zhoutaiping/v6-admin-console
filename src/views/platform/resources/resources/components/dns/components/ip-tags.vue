<style lang="scss" scoped>
.tag-box {
  margin: 2px;
}
</style>
<template>
  <DmDialog
    ref="Dialog"
    :footer="false"
    title="标签"
    width="500px"
  >
    <div>
      <el-form ref="Form" :model="form" :rules="rules">
        <el-tag v-for="(i, index) in form.tags" :key="index" class="tag-box">
          {{ i }}
        </el-tag>
      </el-form>
    </div>
  </DmDialog>
</template>
<script>
export default {
  data() {
    return {
      form: {
        tags: []
      },
      rules: {

      }
    }
  },
  methods: {
    handleOpen(data, option) {
      this.$nextTick(() => {
        this.$refs.Dialog.handleOpen()
        this.form.tags = []
        this.form.tags = data
      })
    }
  }
}
</script>
