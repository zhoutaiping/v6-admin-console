<style lang="less">
.SelectWebsiteGroup {
  &__popper {
    padding: 0px;
    .footer {
      text-align: center;
      padding: 12px;
      border-top: 1px solid rgba(0, 0, 0, 0.04);
    }
  }
}
</style>

<template>
  <span>
    <el-popover
      :popper-class="b('popper')"
      v-model="visible"
      placement="bottom-start"
      width="300"
      @after-enter="init"
    >
      <GroupList ref="GroupList" />
      <div class="footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button
          type="primary"
          @click="handleSubmit"
        >确定</el-button>
      </div>
      <template slot="reference">
        <el-button>
          已选择 {{ selectedTotal }} 个分组
          <i class="el-icon-arrow-down" />
        </el-button>
      </template>
    </el-popover>
  </span>
</template>

<script>
import GroupList from './GroupList'
import create from '@/utils/create-basic'

export default create({
  name: 'SelectGroupList',

  components: { GroupList },

  props: {
    value: [Array, String]
  },

  watch: {
    value() {
      this.init()
    }
  },

  data() {
    return {
      visible: false,
      total: 0,
      selectedTotal: 0
    }
  },

  created() {
    this.init()
  },

  methods: {
    init() {
      const value = this.value
      if (value && value.length) {
        this.selectedTotal = value.length
        this.$refs.GroupList.value = value
      }
      this.$refs.GroupList.init()
    },

    handleSubmit() {
      let selectedTotal = []
      let total = 0

      const value = this.$refs.GroupList.getValue()
      const group_id = value.list
      selectedTotal = value.list.length
      total = value.total

      this.selectedTotal = selectedTotal
      this.total = total
      this.$emit('input', group_id)
      this.visible = false
    }
  }
})
</script>
