<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="handleSubmit"
    title="标签设置"
    width="700px"
    aside
  >
    <div>
      <BindTag
        ref="tag"
        :filter="['zidingyi','kehudengji','yonghuxinyu','yumingbeian','yonghurenzheng']"
      />
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
        'ip-tag-bind': '/ip/tag/bind'
      },
      default: {
        ips: []
      },
      form: {},
      rules: {
        ips: []
      },
      type: ''
    }
  },
  methods: {
    handleOpen(data, option) {
      this.form = Object.assign({}, this.default)
      this.type = option
      this.$nextTick(() => {
        this.$refs.Dialog.handleOpen()
        this.form.ips = data.map(i => { return i.ip })
        if (option === 'ip-tag-bind') {
          setTimeout(() => { if (this.$refs.tag) this.$refs.tag.setInit([]) }, 100)
        } else {
          this.getInfo({
            id: data[0].id
          })
        }
      })
    },
    getInfo(params = {}) {
      this.FetchDisp.get('/ip/info', params).then(res => {
        const tags = res.tags || {}
        const tags_ids = []
        if (tags && Object.keys(tags).length) {
          Object.keys(tags).forEach(i => {
            if (tags[i] && Object.keys(tags[i]).length) {
              Object.keys(tags[i]).forEach(k => {
                tags_ids.push(k)
              })
            }
          })
        }
        this.$refs.tag && this.$refs.tag.setInit(tags_ids)
      }).catch(e => {
        this.$refs.tag && this.$refs.tag.setInit([])
      })
    },
    async handleSubmit() {
      const tags = this.$refs['tag'].getSel()
      if (tags.length === 0) {
        this.$refs.Dialog.afterValidate()
        return
      }

      if (this.type === 'ip-tag-bind') {
        const params = {
          ips: this.form.ips,
          tag_ids: tags.map(i => i.toString())
        }
        try {
          await this.FetchDisp.post(this.API[this.type], params)
          this.Message('ACTION_SUCCESS')
          this.$refs.Dialog.afterValidate()
          this.$refs.Dialog.handleClose()
          this.$emit('init')
        } catch (error) {
          this.$refs.Dialog.afterValidate()
          return
        }
      } else if (this.type === 'edit') {
        const params = {
          ips: this.form.ips,
          tag_ids: tags.map(i => i.toString())
        }
        try {
          await this.FetchDisp.post('/ip/tag/bind', params)
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
}
</script>
