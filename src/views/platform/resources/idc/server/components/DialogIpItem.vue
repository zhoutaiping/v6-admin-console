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
      :visible.sync="open"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      title="子IP列表"
      width="500px"
      class="server-ip-dialog"
      @close="handleClose"
    >
      <DmScroll>
        <div style="max-height:400px;">
          <el-form
            v-loading="ip_item_loading"
            label-position="left"
            label-width="0px"
            size="mini"
            class="server-dialog-form"
          >
            <el-form-item v-if="ip_item.length > 0">
              <el-tag
                v-for="(tag, index) in ip_item"
                :key="index"
                style="margin: 2px;"
              >
                {{ tag.ip }}
              </el-tag>
            </el-form-item>
            <el-form-item v-else>
              <el-tag style="margin: 2px;">
                暂无子标签
              </el-tag>
            </el-form-item>
          </el-form>
        </div>
      </DmScroll>
      <div slot="footer">
        <el-button
          type="info"
          @click="handleClose"
        >取消</el-button>
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
      ip_item_loading: false,
      ip_item: []
    }
  },

  methods: {
    handleOpen(data) {
      this.$nextTick(() => {
        this.open = true
        this.ip_item_loading = true
        setTimeout(() => {
          this.ip_item = data || []
          this.ip_item_loading = false
        }, 500)
      })
    },
    handleClose() {
      this.open = false
    }
  }
}
</script>
