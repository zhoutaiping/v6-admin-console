<template>
  <span>
    <el-popover>
      <template slot="reference">
        <el-button>
          <template v-if="selectedTotal === 0">
            全部
          </template>
          <template v-else>
            已选择 {{ selectedTotal }} / {{ total }}
          </template>
          <i class="el-icon-arrow-down" />
        </el-button>
      </template>
    </el-popover>
  </span>
</template>
<script>
export default {
  name: 'TreeSelect',
  data() {
    return {
      visible: false,
      total: 0,
      selectedTotal: 0
    }
  }
}
</script>
