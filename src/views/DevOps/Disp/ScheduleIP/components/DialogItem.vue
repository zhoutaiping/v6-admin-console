<style lang="postcss" scoped>
.server-edit {
  .server-ip-dialog {
    .server-dialog-form {
      margin: 5px;
      .server-dialog-item {
        display: inline-block;
        margin-bottom: 5px;
      }
      .server-dialog-input {
        width: 300px;
      }
      .server-dialog-input2 {
        width: 105px;
      }
      .ip_item_button {
        margin-top: 10px;
        margin-left: 0px;
      }
      .add_ip_button {
        width: 90%;
        margin: 0 auto;
        background: #ecf5ff;
        border-color: #b3d8ff;
      }
    }
  }
}
</style>

<template>
  <div class="server-edit">
    <el-dialog
      :title="title"
      :visible.sync="open"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      width="500px"
      class="server-ip-dialog"
      @close="handleClose"
    >
      <DmScroll>
        <div style="max-height:400px;">
          <el-form
            v-loading="item_loading"
            label-position="left"
            label-width="0px"
            size="mini"
            class="server-dialog-form"
          >
            <el-form-item v-if="Item.length > 0">
              <el-tag
                v-for="(tag, index) in Item"
                :key="index"
                style="margin: 2px;"
              >
                {{ tag }}
              </el-tag>
            </el-form-item>
            <el-form-item v-else>
              <el-tag style="margin: 2px;">
                暂无
              </el-tag>
            </el-form-item>
          </el-form>
        </div>
      </DmScroll>
      <div slot="footer">
        <el-button type="info" size="mini" @click="handleClose">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import DmScroll from '@/components/DmScroll'
export default {
  components: { DmScroll },
  data() {
    return {
      open: false,
      loading: false,
      item_loading: false,
      Item: [],
      type: '',
      title: ''
    }
  },

  methods: {
    handleOpen(data, type) {
      this.Item = []
      this.$nextTick(() => {
        this.open = true
        this.item_loading = true
        this.type = type
        this.title = '更多'
        if (type === 'line') this.title = '线路'
        if (type === 'ip') this.title = 'IP'
        setTimeout(() => {
          this.Item = data || []
          this.item_loading = false
        }, 500)
      })
    },
    handleClose() {
      this.Item = []
      this.open = false
      // this.$emit('handleLoad')
    }
  }
}
</script>
