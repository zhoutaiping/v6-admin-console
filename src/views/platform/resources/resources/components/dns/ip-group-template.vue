<template>
  <console-page-layout>
    <DmTabs
      ref="active"
      :desc="''"
      :back="back"
      layout="back"
    />
    <DmToolbar>
      <div slot="right">
        <InputSearch
          v-model="bindParams.name"
          placeholder="分组名称"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
        <InputSearch
          v-model="bindParams.ip"
          placeholder="IP"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
      </div>
      <el-button type="primary" @click="$refs.addEdit.handleOpen(null, 'Create')">新增分组</el-button>
      <el-button :disabled="options.selRow.length === 0" type="primary" @click="IpDelete()">删除分组</el-button>
    </DmToolbar>
    <DmData ref="DmData" @init="fetchList" >
      <DmTable :loading="loading">
        <el-table
          :data="list"
          @selection-change="e =>{ options.selRow = e}"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column
            v-for="(_, _index) in column"
            :key="_.prop"
            :label="_.label"
            :width="_.width"
          >
            <template slot-scope="{row}">
              <div v-if="_.prop === 'create_at'">
                {{ formartValue(row, 'create_at') }}<br>
                {{ formartValue(row, 'update_at') }}
              </div>
              <div v-else-if="_.prop === 'ips'">
                <div v-for="(ip) in row.ips.slice(0, 2)" :key="ip"> {{ ip }}</div>
                <el-button v-if="row.ips.length > 2" type="text" icon="el-icon-right" @click="$refs.tags.handleOpen(row.ips)">更多</el-button>
              </div>
              <div v-else>
                {{ formartValue(row, _.prop) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="{row}">
              <el-button type="text" @click="$refs.addEdit.handleOpen(row, 'Edit')">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <AddEdit ref="addEdit" @init="$refs.DmData.initPage()"/>
    <Tags ref="tags" />
  </console-page-layout>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import AddEdit from './components/add-edit-ip-group'
import Tags from './components/ip-tags'
import moment from 'moment'
export default {
  components: { Tags, AddEdit },
  mixins: [consoleData],
  data() {
    return {
      back: {
        path: '/platform/resources/resources/dns',
        query: {
          active: 'ip'
        }
      },
      API_INDEX: '/ip/group/list',
      bindParams: {},
      fetch: this.FetchDisp,
      list: [],
      column: [
        { label: '分组名称', prop: 'name' },
        { label: 'IP', prop: 'ips' },
        { label: '创建/最近一次更新时间', prop: 'create_at' },
        { label: '备注', prop: 'remark' }
      ],
      options: {
        selRow: []
      }
    }
  },

  methods: {
    formartValue(data, prop) {
      const val = data[prop]
      if (prop === 'create_at' || prop === 'update_at') {
        return moment(val).format('YYYY-MM-DD HH:mm:ss')
      }
      return val
    },

    async IpDelete() {
      const params = {
        ids: this.options.selRow.map(i => i.id)
      }
      try {
        await this.FetchDisp.post('ip/group/delete', params)
        await this.$refs.DmData.initPage()
        this.Message('ACTION_SUCCESS')
      } catch (e) {
        return
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.input-box {
  width:160px;
  margin-left:5px;
}
</style>
