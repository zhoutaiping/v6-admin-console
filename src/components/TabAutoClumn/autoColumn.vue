<style lang="postcss">
.autoColumn {
  .el-dialog__body {
    padding: 5px;
  }
  .el-transfer-panel {
    width: 240px;
    border: 1px solid #e8e8e8;
  }
}
</style>
<template>
  <div>
    <el-dialog
      :visible.sync="open"
      :before-close="handleClose"
      title="自定义列展示"
      width="660px"
      class="autoColumn"
    >
      <div>
        <el-transfer
          v-model="check"
          :data="list"
          :props="props"
          :titles="['不展示', '展示']"
          filter-placeholder="请输入列名称"
        />
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="mini"
          @click="open = false"
        >取 消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="handleClick"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Message from 'ant-design-vue/lib/message'
export default {
  name: 'AutoColumn',
  data() {
    return {
      open: false,
      list: [],
      check: [],
      props: { key: 'prop', label: 'label' }
    }
  },
  methods: {
    async init(column = [], check = [], prop = { key: 'prop', label: 'label' }) {
      this.open = true
      this.list = Array.isArray(column) ? column : []
      this.check = Array.isArray(check) ? check : []
    },
    getcheck() {
      return this.check
    },
    handleClose() {
      this.open = false
    },
    handleClick() {
      if (!this.check.length) {
        Message.warning('展示列不能为空!')
        return
      }
      this.handleClose()
      this.$emit('initColumn', 'set', this.check)
    }
  }
}
</script>
