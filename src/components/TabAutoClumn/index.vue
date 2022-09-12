
<style lang="postcss" scoped>
  .model {
    margin:5px;
  }

</style>
<style lang="postcss">
.el-dialog--model {
  .el-dialog__header {
    border-bottom: 0.5px solid #cdcdcd;
    .el-dialog__title {
      padding-left: 5px;
      border-left: 3px solid #409EFF;
    }
  }
  .el-dialog__body{
    padding: 5px 5px !important;
  }
  .el-dialog__footer{
    padding: 10px 0 0;
    .dialog-footer {
      padding: 10px;
      border-top: 0.5px solid #cdcdcd;
    }
  }
}
</style>
<template>
  <yd-dialog v-loading="model.loading" :close-on-click-modal="true" :visible.sync="model.visible" class="el-dialog--model" title="自定义列">
    <DmScroll>
      <el-form ref="model" :model="model" label-position="left" size="mini" class="model">
        <h3>选中：{{ select.length }}</h3>
        <yd-table>
          <el-table ref="columnList" :data="model.column" :height="400" border @selection-change="changeSelect">
            <ElTableColumn :selectable="selectable" label="" type="selection" width="55"/>
            <ElTableColumn label="列名" prop="label"/>
          </el-table>
        </yd-table>
      </el-form>
    </DmScroll>
    <div slot="footer" class="dialog-footer">
      <el-button type="info" size="mini" @click="handleClose">取 消</el-button>
      <el-button type="primary" size="mini" @click="handleSave">确 定</el-button>
    </div>
  </yd-dialog>
</template>
<script>

export default {
  data() {
    return {
      model: {
        visible: false,
        loading: true,
        column: [],
        checkColumns: []
      },
      select: [],
      new_column: []
    }
  },
  watch: {

  },
  mounted() {

  },
  methods: {
    selectable(row, index) {
      return true
    },
    handleOpen(columns, checkColumns) {
      this.$nextTick(() => {
        this.model.visible = true
        this.model.loading = true
        this.model.column = columns
        this.model.checkColumns = checkColumns
        setTimeout(() => {
          this.model.column.forEach(item => {
            const index = checkColumns.findIndex(record => {
              return item.prop === record.prop
            })
            if (this.model.checkColumns.length) {
              index > -1 && this.$refs.columnList.toggleRowSelection(item, true)
            } else {
              this.$refs.columnList.toggleRowSelection(item, true)
            }
          })
          this.model.loading = false
        }, 200)
      })
    },

    handleClose() {
      this.$refs.columnList && this.$refs.columnList.clearSelection()
      this.model.visible = false
    },

    changeSelect(val) {
      this.select = val
    },

    async handleSave() {
      this.new_column = []
      this.select.forEach(currentItem => {
        this.new_column.push(currentItem.prop)
      })
      this.$emit('initColumn', this.new_column)
      this.handleClose()
    }
  }
}
</script>

