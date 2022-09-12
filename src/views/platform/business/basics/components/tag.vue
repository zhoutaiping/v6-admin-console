<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="handleSubmit"
    title="标签设置"
    width="700px"
    aside
  >
    <div>
      <BindTag ref="tag" :filter="['zidingyi','yumingbeian']"/>
    </div>
  </DmDialog>
</template>
<script>
import BindTag from '@/components/Card/NewBindTag'
export default {
  components: { BindTag },
  data() {
    return {
      API: {
        'ip-pool-tag-bind': '/ip/pool/tag/bind'
      },
      form: {
        ippool_ids: []
      },
      rules: {
        ids: [],
        tag: []
      },
      type: ''
    }
  },
  methods: {
    handleOpen(data, option) {
      this.$nextTick(() => {
        this.$refs.Dialog.handleOpen()
        this.type = option
        this.form.ippool_ids = data && Array.isArray(data) && data.map(i => { return i.ippool_id }) || []
        setTimeout(() => { if (this.$refs.tag) this.$refs.tag.setInit([]) }, 100)
      })
    },

    async handleSubmit() {
      const tags = this.$refs['tag'].getSel()
      if (!tags || tags.length === 0) {
        this.$refs.Dialog.afterValidate()
        return
      }
      try {
        const params = {
          tag_ids: tags.map(i => i.toString())
        }
        if (this.type === 'ip-pool-tag-bind') {
          params.ippool_ids = this.form.ippool_ids
        }
        await this.FetchDisp.post(this.API[this.type], params)
        this.Message('ACTION_SUCCESS')
        this.$refs.Dialog.afterValidate()
        this.$refs.Dialog.handleClose()
        this.$emit('init')
      } catch (error) {
        this.$refs.Dialog.afterValidate()
        return
      }
    }
  }
}
</script>
