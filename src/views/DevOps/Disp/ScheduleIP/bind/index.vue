<style lang="scss" scoped>
</style>
<template>
  <div>
    <DmDialog
      ref="bind-box"
      :fetch-submit="fetchSubmit"
      append-to-body
      title="绑定标签"
      width="700px"
      aside
    >
      <div style="padding: 5px;">
        <el-card
          :body-style="{ padding: '5px' }"
          class="box-card"
          shadow="never"
        >
          <div
            slot="header"
            class="clearfix"
          >
            <span>已选IP ({{ P_TAG.length }} 个)</span>
          </div>
          <el-tag
            v-for="(tag, index) in P_TAG"
            :key="index"
            style="margin: 2px;"
          >
            {{ tag }}
          </el-tag>
        </el-card>
        <BindTag ref="bindtag" />
      </div>
    </DmDialog>
  </div>
</template>
<script>
import BindTag from '@/components/Card/NewBindTag'
export default {
  components: { BindTag },
  data() {
    return {
      panelType: 'add',
      P_TAG: [],
      setForm: {
        sys_tag: [],
        manual_tag: [],
        type: '1',
        status: '1',
        add_tag: '',
        tags: [],
        remark: ''
      }
    }
  },

  methods: {
    handleOpen(data, type) {
      this.$nextTick(() => {
        this.$refs['bind-box'] && this.$refs['bind-box'].handleOpen()
        this.panelType = type
        if (type === 'edit') {
          this.P_TAG = [data.ip]
          this.getInfo({ id: data.id })
        } else {
          const tag = []
          data.forEach(i => {
            tag.push(i.ip)
          })
          this.P_TAG = tag
          this.$refs.bindtag && this.$refs.bindtag.setInit([])
        }
      })
    },

    getInfo(params = {}) {
      this.InvokeDispApi.get('/ip/info', params).then(res => {
        const data = JSON.parse(JSON.stringify(res))
        this.setForm.status = data.status.toString()
        const tags = data.tags || {}
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
        this.$refs.bindtag && this.$refs.bindtag.setInit(tags_ids)
      }).catch(e => {
        this.$refs.bindtag && this.$refs.bindtag.setInit([])
      })
    },

    async fetchSubmit() {
      //
      const tags = this.$refs['bindtag'].getSel()
      if (!tags) {
        this.$refs['bind-box'].afterValidate()
        return
      }
      if (!this.P_TAG.length) {
        this.message.warning('IP不存在!')
        return
      }
      this.InvokeDispApi.post('/ip/tag/bind', this.getParams(tags)).then(res => {
        this.Message('ACTION_SUCCESS')
        this.$emit('init')
        this.$refs['bind-box'].handleClose()
      }).catch(e => {
        this.$refs['bind-box'].afterValidate()
      })
    },

    getParams(tags) {
      const params = {
        'ips': this.P_TAG,
        'tag_ids': tags.map(i => i.toString())
      }
      return params
    }
  }
}
</script>
