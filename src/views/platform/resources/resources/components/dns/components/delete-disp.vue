<style lang="scss" scoped>
.item-box {
  margin-bottom: 5px;
}
/deep/ .el-dialog__body {
  padding: 10px 20px;
  min-height: 150px;
}
</style>
<template>
  <el-dialog
    ref="Dialog"
    :visible.sync="open"
    title="删除&调度"
    width="700px"
  >
    <DmScroll>
      <el-form
        ref="Form"
        :model="form"
        :rules="rules"
        label-position="left"
        label-width="120px"
      >
        <el-form-item
          label="待删除调度IP"
          class="item-box"
        />
        <DmAlert>
          <el-tag
            v-for="i in form.ips"
            :key="i"
            style="margin:2px;"
          >
            {{ i }}
          </el-tag>
        </DmAlert>
        <template v-if="is_user">
          <el-form-item
            label="IP使用情况"
            class="item-box"
          />
          <DmAlert>
            <div
              v-for="i in user_ip"
              :key="i.label"
            >
              {{ i.value }}
            </div>
            <span v-if="user_ip.length === 0">已上IP可以删除，需要删除请点击【保存】按钮</span>
          </DmAlert>
        </template>
      </el-form>
    </DmScroll>

    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="open = false">取 消</el-button>
      <el-button
        v-show="!is_user"
        type="primary"
        @click="e =>{
          form.force = 0
          handleSubmit()
        }"
      >保 存</el-button>
      <el-button
        v-show="is_user"
        type="primary"
        @click="
          e =>{
            form.force = 1
            handleSubmit()
          }
        "
      >保 存</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      open: false,
      default: {
        ips: [],
        force: 0
      },
      form: {},
      is_user: false,
      user_ip: [],
      rules: {
        ips: [],
        force: []
      }
    }
  },

  methods: {
    handleOpen(data = [], option = null) {
      this.form = Object.assign({}, this.default)
      this.is_user = false
      this.user_ip = []
      this.$nextTick(() => {
        this.open = true
        this.form.ips = data.map(i => i.ip)
      })
    },

    async handleSubmit() {
      try {
        const data = await this.FetchDisp.post('/ip/delete', { ...this.form })
        if (data && data.ip && data.ip.length) {
          this.is_user = true
          this.user_ip = data.ip.map(i => { return { label: i, value: i } })
        } else if (data && data.ip && data.ip.length === 0) {
          this.is_user = true
        }
        if (this.form.force === 1) {
          this.Message('ACTION_SUCCESS')
          this.$emit('init')
          this.open = false
        }
      } catch (error) {
        return
      }
    }
  }
}
</script>
