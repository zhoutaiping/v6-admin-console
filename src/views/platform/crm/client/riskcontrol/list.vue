<style lang="scss" scoped>
.line-item-box {
  display: inline-block;
  margin-right: 10px;
}
</style>
<template>
  <console-page-layout>
    <p>
      <InputSearch
        v-model="bindParams.member_email"
        placeholder="邮箱"
        class="input-box"
        @submit="$refs.DmData.initPage()" />
      <el-button
        :loading="loading"
        type="primary"
        @click="$refs.DmData.initPage()">刷新</el-button>
      <el-button
        :disabled="loading"
        type="primary"
        @click="handleExport">导出</el-button>
    </p>
    <DmData ref="DmData" @init="fetchList">
      <DmTable :loading="loading" min-height>
        <el-table
          :data="list"
          @selection-change="e =>{ select = e }">
          <el-table-column type="selection" />
          <el-table-column
            v-for="(item, index) in column"
            :key="index"
            :label="item.label"
            :width="item.width">
            <template slot-scope="scope">
              {{ formartValue(scope.row, item.prop) }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="140"
            fixed="right">
            <template slot-scope="{ row }">
              <el-button
                type="text"
                @click="e =>{ $refs.info.handleOpen(row) }">详情</el-button>
              <el-divider direction="vertical" />
              <el-button
                type="text"
                @click="e =>{ $refs.addedit.handleOpen(row, 'Edit') }">人工确认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <InFo ref="info" />
    <AddEdit
      ref="addedit"
      @init="$refs.DmData.initPage()" />
  </console-page-layout>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import InFo from './components/info'
import AddEdit from './components/edit'
export default {
  components: { InFo, AddEdit },
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '/fd/V4/risk.customer.list',
      API_METHOD: 'post',
      bindParams: { member_email: '' },
      select: [],
      column: [
        { label: '注册邮箱', prop: 'member_email' },
        { label: '客户类别', prop: 'member_channel_type' },
        { label: '认证名称', prop: 'certification_name' },
        { label: '服务等级', prop: 'member_server_level' },
        { label: '同人风控风险等级', prop: 'risk_level' },
        { label: '同人等级操作时间', prop: 'updated_at' }
      ]
    }
  },
  methods: {
    formartValue(data, prop) {
      return data[prop]
    },
    async handleExport() {
      this.loading = true
      const params = {
        member_email: this.bindParams.member_email,
        ids: this.select.map(i => i.id)
      }
      this.$confirm('导出套餐列表excel，是否确认操作？', '导出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const data = await this.Fetch.get('/fd/V4/risk.customer.export', params)
        const a = document.createElement('a')
        a.setAttribute('href', data.url)
        document.body.appendChild(a)
        a.click()
        a.style.display = 'none'
        this.Message('ACTION_SUCCESS')
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
