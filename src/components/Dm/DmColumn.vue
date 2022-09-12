<style lang="scss" scoped>
.input-box {
  min-width: 120px;
}
</style>
<template>
  <el-popover
    :width="width"
    :trigger="trigger"
    :placement="placement">
    <el-checkbox :indeterminate="isAll" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
    <el-checkbox-group v-model="list" @change="changeValue">
      <el-checkbox v-for="_ in column" :label="_.dataIndex" :key="_.dataIndex" class="input-box">{{ _.label }}</el-checkbox>
    </el-checkbox-group>
    <a slot="reference" class="color--primary" >
      <i class="el-icon-s-tools" />
    </a>
  </el-popover>
</template>
<script>
export default {
  props: {
    trigger: {
      type: String,
      default: 'click'
    },
    width: {
      type: [String, Number],
      default: '350'
    },
    column: {
      type: Array,
      default: () => []
    },
    placement: {
      type: String,
      default: 'bottom-start'
    },
    check: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      checkAll: false,
      isAll: true,
      list: []
    }
  },

  async created() {
    await this.init()
  },

  methods: {
    init() {
      this.list = this.check
    },
    handleCheckAllChange(val) {
      this.list = val ? this.column.map(i => { return i.dataIndex }) : []
      this.isAll = false
      this.$emit('init', 'set', this.list)
    },
    changeValue(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.column.length
      this.isAll = checkedCount > 0 && checkedCount < this.column.length
      this.$emit('init', 'set', value)
    }

  }
}
</script>
