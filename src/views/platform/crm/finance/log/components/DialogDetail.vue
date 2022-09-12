<style lang="postcss" scoped>
.dialog-log-detail{
  .detail-form {
    margin: 10px 10px 10px;
    .form-item {
      margin-bottom: 5px;
    }
  }
}
</style>

<template>
  <DmDialog
    ref="dmdialog"
    :footer="false"
    :title="'日志详情'"
    width="600px"
    aside
    class="dialog-log-detail"
  >
    <DmScroll>
      <el-form :model="detailForm" size="mini" label-position="left" label-width="120px" class="detail-form">
        <h4/><hr>
        <el-form-item label="操作类型" class="form-item">{{ Number(detailForm.type) === 2 ?'应收单详情' : '流水详情' }}</el-form-item>
        <el-form-item label="操作内容" class="form-item">{{ detailForm.action_name }}</el-form-item>
        <el-form-item label="操作人" class="form-item">{{ detailForm.user_nickname }}</el-form-item>
        <h4>操作详情</h4><hr>
        <el-form-item v-for="(item, key) in optionList" :key="key" :label="item.label" class="form-item">
          <span style="color:#ccc;text-decoration: line-through;">{{ item.berforValue || '--' }}</span>
          <span style="margin-left:5px;">{{ item.updateValue || '--' }}</span>
        </el-form-item>
      </el-form>
    </DmScroll>
  </DmDialog>
</template>

<script>
import * as FORM from './form'
export default {
  components: {},
  data() {
    return {
      loading: false,
      detailForm: {},
      receivable_params: FORM.receivable_params,
      flow_params: FORM.flow_params,
      optionList: []
    }
  },
  methods: {
    handleOpen(data, panel_type) {
      this.$refs.dmdialog.handleOpen()
      this.$nextTick(() => {
        this.loading = true
        this.detailForm = Object.assign({}, data)
        this.getOptionInfo(this.detailForm.params, panel_type)
        setTimeout(() => {
          this.loading = false
        }, 500)
      })
    },

    getOptionInfo(data, type) {
      const params_text = this[type + '_params'] || {}
      const beforData = JSON.parse(JSON.stringify(data.oriRecord))
      const updateData = JSON.parse(JSON.stringify(data.updateData))
      const list = []
      if (updateData && params_text) {
        Object.keys(updateData).forEach(i => {
          list.push({
            label: params_text[i] || '--',
            updateValue: updateData[i] || '--',
            berforValue: beforData[i] || '--'
          })
        })
      }
      this.optionList = list
    }
  }
}
</script>
