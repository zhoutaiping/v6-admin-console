<template>
  <el-card :body-style="{'padding':'10px'}">
    <DmToolbar>
      <div slot="right">
        <DmSelect
          v-model="bindParams.status"
          :selects="options.status"
          class="input-box"
          placeholder="状态"
          @change="$refs.DmData.initPage()"
        />
        <InputSearch
          v-model="bindParams.keyword"
          placeholder="IP/主域名"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
      </div>
      <el-button
        type="primary"
        @click="$refs.addedit.handleOpen(null, 'Create')"
      >新增</el-button>
      <el-button
        :disabled="options.selRow.length === 0"
        type="primary"
        @click="handleOption(options.selRow,'open')"
      >启用</el-button>
      <el-button
        :disabled="options.selRow.length === 0"
        type="primary"
        @click="handleOption(options.selRow,'close')"
      >禁用</el-button>
      <el-button
        :disabled="options.selRow.length === 0"
        type="primary"
        @click="handleDel(options.selRow)"
      >删除</el-button>
      <el-button
        type="primary"
        @click="setColumn"
      >自定义展示</el-button>
    </DmToolbar>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable :loading="loading">
        <el-table
          :data="list"
          @selection-change="e =>{ options.selRow = e}"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            v-for="(_, _index) in filtet_column"
            :key="_.prop"
            :label="_.label"
            :width="_.width"
            show-overflow-tooltip
          >
            <template slot-scope="{row}">
              <template v-if="_.prop === 'status'">
                <span :class="Number(row.status) === 1 ? 'color--primary':'color--danger'">
                  {{ formartValue(row, 'status') }}
                </span>
              </template>
              <template v-else-if="_.prop === 'line_keys'">
                <div v-for="line in formartValue(row, _.prop)" :key="line">
                  {{ line }}
                </div>
              </template>
              <template v-else>
                {{ formartValue(row, _.prop) }}
              </template>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="$refs.addedit.handleOpen(scope.row, 'Edit')" >编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <AutoColumn ref="autoColumn" @initColumn="initColumn" />
    <AddEdit ref="addedit" @init="$refs.DmData.initPage()"/>
  </el-card>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import initColumn from '@/mixins/initColumn'
import AddEdit from './components/user-add-edit'
import moment from 'moment'
export default {
  components: { AddEdit },
  mixins: [consoleData, initColumn],
  data() {
    return {
      pannel_name: 'resources_user-template',
      initPage: false,
      API_INDEX: '/line_group/list',
      fetch: this.FetchDisp,
      bindParams: { keyword: '' },
      list: [],
      column: [
        { label: '组ID', prop: 'id' },
        { label: '组名称', prop: 'name' },
        { label: '覆盖请求来源', prop: 'line_keys' },
        { label: '状态', prop: 'status' },
        { label: '最后一次操作人', prop: 'last_opuser' },
        { label: '创建时间', prop: 'create_at' },
        { label: '更新时间', prop: 'update_at' },
        { label: '备注', prop: 'remark' }
      ],
      options: {
        selRow: [],
        isp: [],
        status: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 }
        ],
        region: {
          'default': '全局',
          'china': '中国',
          'overseas': '海外',
          'searchengine': '搜索引擎'
        }
      }
    }
  },
  methods: {
    formartValue(data, prop) {
      const val = data[prop]
      if (prop === 'status') {
        return this.options.status.find(i => Number(i.value) === Number(val)) ? this.options.status.find(i => Number(i.value) === Number(val)).label : ''
      } else if (prop === 'create_at' || prop === 'update_at') {
        return moment(val).format('YYYY-MM-DD HH:mm:ss')
      } else if (prop === 'line_keys') {
        const lines = Object.assign(this.options.region, data['lines'])
        return data[prop].map(i => lines[i])
      }
      return val
    },

    async handleOption(data, type) {
      if (type === '') return
      try {
        const params = {
          ids: data.map(i => { return i.id }).join(','),
          action: type
        }
        await this.FetchDisp.post('/line_group/switch_status', params)
        this.Message('ACTION_SUCCESS')
        await this.$refs.DmData.initPage()
      } catch (error) {
        return
      }
    },

    async handleDel(data, type) {
      try {
        const params = {
          ids: data.map(i => { return i.id }).join(',')
        }
        await this.FetchDisp.get('/line_group/delete', params)
        this.Message('ACTION_SUCCESS')
        await this.$refs.DmData.initPage()
      } catch (error) {
        return
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.input-box {
  width: 160px;
  margin: 0 0 5px 5px;
}
</style>
