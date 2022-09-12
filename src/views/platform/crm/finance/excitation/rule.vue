<template>
  <console-page-layout>
    <p>
      <el-button
        type="primary"
        @click="e =>{ $refs.DmData.initPage() }"
      >刷新</el-button>
    </p>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable
        :loading="loading"
        min-height
      >
        <el-table :data="rule_list">
          <el-table-column
            v-for="(item, index) in column"
            :key="index"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="{ row }">
              <template v-if="item.prop === 'status'">
                <a-switch
                  v-model="row.status"
                  checked-children="开启"
                  un-checked-children="关闭"
                  @change="e =>{ changeStatus({...row,status: e === true ? '1' : '2'})}"
                />
              </template>
              <template v-else>
                {{ formartValue(row, item.prop) }}
              </template>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button
                type="text"
                @click="e =>{ $refs.info.handleOpen(row) }"
              >详情</el-button>
              <el-divider direction="vertical" />
              <el-button
                type="text"
                @click="e =>{ $refs.addedit.handleOpen(row, 'Edit') }"
              >编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <InFo ref="info" />
    <AddEdit
      ref="addedit"
      @init="$refs.DmData.initPage()"
    />
  </console-page-layout>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import InFo from './components/rule/info'
import AddEdit from './components/rule/edit'
import { deepClone } from '@/utils'
export default {
  components: { InFo, AddEdit },
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '/V4/cbms.incentive.manage.list',
      bindParams: {},
      rule_list: [],
      column: [
        { label: 'ID', prop: 'id' },
        { label: '规则类别', prop: 'name' },
        { label: '创建时间', prop: 'created_at' },
        { label: '更新时间', prop: 'updated_at' },
        { label: '启用状态', prop: 'status' }
      ]
    }
  },
  watch: {
    list: {
      handler(val) {
        const list = deepClone(val)
        this.rule_list = list.map(i => {
          i.status = i.status === '1'
          return i
        })
      },
      deep: true
    }
  },
  methods: {
    formartValue(data, prop) {
      return data[prop]
    },

    async changeStatus(params) {
      try {
        await this.Fetch.post('/V4/cbms.incentive.manage.edit', params)
        this.Message('ACTION_SUCCESS')
        await this.$refs.DmData.initPage()
      } catch (error) {
        return
      }
    }
  }
}
</script>
