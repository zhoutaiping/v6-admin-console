<style lang="scss" scoped>
.input-box {
  width: 235px;
  margin-bottom: 2px;
}
.more-line-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  /* 设置n行，也包括1 */
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
</style>
<template>
  <DmPage
    ref="DmData"
    :page-panel="PagePanel"
    @init="fetchList"
  >
    <div slot="filter">
      <InputSearch
        v-model="bindParams.email"
        placeholder="联系人邮箱"
        @submit="$refs.DmData.initPage()"
      />
      <InputSearch
        v-model="bindParams.phone"
        placeholder="手机号"
        @submit="$refs.DmData.initPage()"
      />
      <el-date-picker
        v-model="created_at"
        :default-time="['00:00:00', '23:59:59']"
        type="daterange"
        range-separator=" "
        class="input-box"
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="反馈时间"
        end-placeholder=" "
        @change="e =>{
          bindParams.start_date = e && e[0] || ''
          bindParams.end_date = e && e[1] || ''
          $refs.DmData.initPage()
        }"
      />
      <el-button
        type="primary"
        @click="$refs.DmData.initPage()"
      >搜 索</el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="list"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
    >
      <el-table-column
        type="index"
        label="序号"
        width="55"
      />
      <el-table-column
        v-for="item in column"
        :key="item.$index"
        :label="item.label"
      >
        <template slot-scope="{row}">
          <template v-if="item.dataIndex === 'pics'">
            <div
              v-for="pic in formartValue(row, item.dataIndex)"
              :key="pic"
              class="more-line-ellipsis"
            >
              <el-tooltip
                :content="pic"
                placement="top"
              >
                <a
                  :href="pic"
                  target="_blank"
                >{{ pic }}</a>
              </el-tooltip>

            </div>
          </template>
          <div v-else>
            {{ formartValue(row, item.dataIndex) }}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </DmPage>
</template>
<script>
import consoleData from '@/mixins/consoleData'
export default {
  mixins: [consoleData],
  data() {
    return {
      PagePanel: 'FEEDBAC-USER-LIST',
      API_INDEX: '/V4/canvas.feedback.query',
      created_at: '',
      bindParams: {},
      list: [],
      column: [
        { label: '联系人邮箱', dataIndex: 'email' },
        { label: '手机号', dataIndex: 'phone' },
        { label: '反馈问题类型', dataIndex: 'product' },
        { label: '反馈图片链接', dataIndex: 'pics' },
        { label: '反馈内容', dataIndex: 'content' },
        { label: '反馈时间', dataIndex: 'created_at' }
      ]
    }
  },
  watch: {
    resData: {
      handler(val) {
        this.list = this.resData.data
        this.$refs.DmData.init({ total: this.resData.pagination.total })
      },
      deep: true
    }
  },
  methods: {
    loadData() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 800)
    },
    formartValue(data, index) {
      let val = data[index]
      if (index === 'status') {
        val = val === '1' ? '开启' : '关闭'
      } else if (index === 'pics') {
        val = val && JSON.parse(val) || []
      }
      return val
    }
  }
}
</script>
