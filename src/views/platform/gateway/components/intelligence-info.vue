<template>
  <DmDialog
    ref="Dialog"
    :footer="false"
    title-label="恶意域名详情"
    width="700px"
  >
    <DmCard title="概览信息">
      域名：abc.com
    </DmCard>
    <DmCard
      title="标签集合"
      class="margin-top"
    >
      'ddostf': '恶意软件ddostf'
    </DmCard>
    <DmCard
      title="上下文"
      class="margin-top"
    >
      创建时间、注册者、注册机构
    </DmCard>
  </DmDialog>
</template>
<script>
export default {
  data() {
    return {
      form: {}
    }
  },
  methods: {
    handleOpen(data) {
      this.$nextTick(() => {
        this.$refs.Dialog.handleOpen()
      })
    }
  }
}
</script>
