<template>
  <el-pagination
    :page-sizes="pageSize"
    :total="total"
    :current-page="1"
    layout="total, sizes, prev, pager, next, jumper"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"/>
</template>

<script>
/*
+-----------------------------------------------------------------------------------------------------------------------
| Yundun
+-----------------------------------------------------------------------------------------------------------------------
| yd-pagination
| 分页组件
*/

const NAME = 'yd-pagination'

export default {
  name: NAME,

  components: {},

  props: {
    total: Number
  },

  data() {
    return {
      pageSize: [10, 20, 50, 100]
    }
  },

  methods: {
    handleSizeChange(e) {
      this.$emit('size-change', e)
    },
    handleCurrentChange(e) {
      this.$emit('current-change', e)
    }
  }
}
</script>

<style lang="postcss">
</style>
