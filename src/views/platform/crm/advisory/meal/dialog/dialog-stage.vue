<template>
  <div>
    <DmDialog
      ref="dmdialog"
      :fetch-submit="fetchSubmit"
      :footer="false"
      title="套餐生命时间轴"
      width="700px"
    >
      <div>
        <DmData
          ref="DmData"
          :auto-init="false"
          @init="fetchList"
        >
          <DmTable
            :loading="loading"
            min-height
          >
            <el-table :data="list">
              <el-table-column type="index" label=""/>
              <el-table-column v-for="(item, index) in column" :key="index" :label="item.label" :width="item.width" show-overflow-tooltip >
                <template slot-scope="scope">
                  {{ formartValue(scope.row, item.prop) }}
                </template>
              </el-table-column>
            </el-table>
          </DmTable>
        </DmData>
      </div>
    </DmDialog>
  </div>
</template>
<script>
import consoleData from '@/mixins/consoleData'
export default {
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '/fd/V4/order.plan.live_axis',
      API_METHOD: 'post',
      bindParams: {
        plan_id: ''
      },
      column: [
        { label: '阶段', prop: 'stage_after' },
        { label: '发生时间', prop: 'stage_update_time' }
      ]
    }
  },
  methods: {
    handleOpen(data) {
      this.$nextTick(() => {
        this.$refs.dmdialog.handleOpen()
        if (this.$refs.form) this.$refs.form.resetFields()
        this.bindParams.plan_id = data.id
        setTimeout(() => {
          if (data.id) this.$refs.DmData.initPage()
        }, 0)
      })
    },

    formartValue(data, prop) {
      let row_text = data[prop]
      if (prop === 'stage_after') {
        row_text = this.responseData && this.responseData.stage_conf ? this.responseData.stage_conf[row_text] : row_text
      }
      return row_text
    },

    fetchSubmit(fromName = 'form') {
      this.$refs.dmdialog.handleClose()
    }
  }
}
</script>
