<template>
  <DmPage
    ref="DmData"
    :title="'CDN-高防IP列表'"
    :page-panel="PagePanel"
    @init="fetchList"
  >
    <div slot="filter">
      <el-button
        type="primary"
        @click="$refs.AddEdit.handleOpen(null,'Create')"
      >新增</el-button>
      <el-button
        :disabled="!options.checkRow.length"
        @click="statusEdit(options.checkRow, 'on')"
      >启用</el-button>
      <el-button
        :disabled="!options.checkRow.length"
        @click="statusEdit(options.checkRow, 'off')"
      >禁用</el-button>
      <el-button @click="exportExcel">导出</el-button>
      <el-button
        :loading="loading"
        type="primary"
        @click="$refs.DmData.initPage()"
      >刷 新</el-button>
      <div style="display:inline;float:right">
        <InputSearch
          v-model="bindParams.ip"
          placeholder="IP信息"
          @submit="$refs.DmData.initPage()"
        />
        <DmSelect
          v-model="bindParams.type"
          :selects="options.type"
          clearable
          placeholder="IP类型"
          class="input-box"
          @change="$refs.DmData.initPage()"
        />
        <DmSelect
          v-model="bindParams.status"
          :selects="options.status"
          clearable
          placeholder="状态"
          class="input-box"
          @change="$refs.DmData.initPage()"
        />
      </div>
    </div>
    <DmTable min-height>
      <el-table
        v-loading="loading"
        :data="list"
        element-loading-text="加载中"
        element-loading-spinner="el-icon-loading"
        @selection-change="e =>{ options.checkRow = e.map( i=>i.id)}"
      >
        <el-table-column type="selection" />
        <el-table-column
          v-for="item in column"
          :key="item.$index"
          :label="item.label"
        >
          <template slot-scope="{row}">
            <div>
              {{ formartValue(row, item.dataIndex) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="160"
        >
          <template slot-scope="{row}">
            <el-button
              type="text"
              @click="del(row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </DmTable>
    <AddEdit
      ref="AddEdit"
      @init="$refs.DmData.initPage()"
    />
  </DmPage>
</template>
<script>
import consoleData from '@/mixins/consoleData'
import AddEdit from '../components/add-edit-cdn-ip'
export default {
  components: { AddEdit },
  mixins: [consoleData],
  data() {
    return {
      PagePanel: 'record-white-list',
      API_INDEX: '/fd/V4/cdn.high.defense.ip.list',
      bindParams: {
        type: '',
        ip: '',
        status: ''
      },
      column: [
        { label: 'IP信息', dataIndex: 'ip' },
        { label: 'IP类型', dataIndex: 'type' },
        { label: '归属地', dataIndex: 'location' },
        { label: '状态', dataIndex: 'status' }
      ],
      options: {
        checkRow: [],
        type: [
          { label: '大陆节点', value: 'mainland' },
          { label: '海外节点', value: 'oversea' }
        ],
        status: [
          { label: '启用', value: 'on' },
          { label: '禁用', value: 'off' }
        ]
      }
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
      if (index === 'type') val = val === 'mainland' ? '大陆节点' : '海外节点'
      else if (index === 'status') val = val === 'on' ? '启用' : '禁用'
      return val
    },
    async statusEdit(ids, status) {
      if (!Array.isArray(ids) || !ids.length) {
        return
      }
      try {
        await this.Fetch.put('/fd/V4/cdn.high.defense.ip.edit', {
          ids,
          status
        })
        this.Message('ACTION_SUCCESS')
        await this.$refs.DmData.initPage()
      } catch (error) {
        return
      }
    },
    async del(row) {
      this.$confirm('此操作将删除该IP, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await this.Fetch.delete('/fd/V4/cdn.high.defense.ip.del', { id: row.id })
          this.Message('ACTION_SUCCESS')
          await this.$refs.DmData.initPage()
        } catch (error) {
          return
        }
      })
    },
    exportExcel() {
      this.$confirm('确定导出数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const data = await this.Fetch.get('/fd/V4/cdn.high.defense.ip.export', { ...this.bindParams, download: true })
          if (data.url) {
            const a = document.createElement('a')
            a.setAttribute('href', data.url)
            document.body.appendChild(a)
            a.click()
            a.style.display = 'none'
            this.Message('ACTION_SUCCESS')
          }
        } catch (error) {
          return
        }
      })
    }
  }
}
</script>
