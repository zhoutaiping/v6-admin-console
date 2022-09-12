<style lang="scss" scoped>
.input-box {
  width: 300px;
}
.item-box {
  margin-bottom: 5px;
}
</style>
<template>
  <div>
    <dm-dialog
      ref="dialog"
      :fetch-submit="fetchSubmit"
      :footer="false"
      title-label="调度包绑定"
      width="700px"
    >
      <DmAlert> 调度包绑定 </DmAlert>
      <dm-data
        ref="DmData"
        :auto-init="false"
        @init="fetchList"
      >
        <dm-table
          :loading="loading"
          min-height
        >
          <el-table :data="list">
            <el-table-column
              label="ID"
              prop="group_id"
            />
            <el-table-column
              label="调度包标识"
              prop="group_bn"
            />
            <el-table-column
              label="调度包名称"
              prop="name"
            />
            <el-table-column label="操作">
              <template slot-scope="{ row }">
                <el-button
                  type="text"
                  @click="handleBind(row)"
                >绑定</el-button>
              </template>
            </el-table-column>
          </el-table>
        </dm-table>
      </dm-data>
    </dm-dialog>
  </div>
</template>
<script>
import consoleData from '@/mixins/consoleData'
export default {
  components: {},
  mixins: [consoleData],
  data() {
    return {
      fetch: this.FetchDisp,
      API_INDEX: '/disp/group/tcp/select',
      bindParams: {},
      mode: 'Create',
      form: {},
      rules: {}
    }
  },
  methods: {
    handleOpen(data, option = '') {
      this.mode = option
      this.$nextTick(() => {
        this.$refs.dialog.handleOpen()
        if (this.$refs.Form) {
          this.$refs.Form.resetFields()
        }

        if (option === 'Edit') {
          this.form = Object.assign({}, data)
          this.bindParams = {
            member_id: data.member_id,
            is_share: 1,
            id: data.id
          }
          setTimeout(() => { this.$refs.DmData.initPage() }, 200)
        }
      })
    },
    handleBind(row) {
      const data = {
        id: this.form.id,
        disp_group_id: row.group_id
      }
      this.Fetch.post('/fd/V4/tcp.forward.bind.group', data)
        .then((res) => {
          this.Message('ACTION_SUCCESS')
          this.$emit('init', { ...row })
          this.$refs.dialog.handleClose()
        })
        .catch((e) => {
          this.$refs.dialog.afterValidate()
        })
    },

    fetchSubmit() { }
  }
}
</script>
