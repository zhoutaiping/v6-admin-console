<style lang="scss" scoped>
::v-deep .el-table__expanded-cell {
  padding: 10px 0px 10px 46px;
}
</style>
<template>
  <DmPage
    ref="DmData"
    :page-panel="PagePanel"
    @init="fetchList"
  >
    <div slot="filter">
      <router-link :to="{path:'/gateway-content-add'}">
        <el-button type="primary">新 增</el-button>
      </router-link>
      <el-button
        :loading="loading"
        type="primary"
        @click="$refs.DmData.initPage()"
      >刷 新</el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="list"
      :expand-row-keys="expandKeys"
      row-key="id"
      @expand-change="expandChange"
    >

      <el-table-column type="expand">
        <template slot-scope="{row}">
          <Record
            ref="record"
            :record="row"
          />
        </template>
      </el-table-column>
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
        width="120"
      >
        <template slot-scope="{row}">
          <el-button
            v-if="Number(row.class_status) === 2"
            type="text"
            @click="handleEditStatus(row, 2)"
          >禁用</el-button>
          <el-button
            v-if="Number(row.class_status)=== 1"
            type="text"
            @click="handleEditStatus(row, 2)"
          >启用</el-button>
          <el-divider direction="vertical" />
          <router-link :to="ToEdit(row)">
            <el-button type="text">修 改</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
  </DmPage>
</template>
<script>
import consoleData from '@/mixins/consoleData'
import Record from './RecordList'
export default {
  components: { Record },
  mixins: [consoleData],
  data() {
    return {
      PagePanel: 'CONTENT-INDEX',
      API_INDEX: '/content/class1list',
      fetch: this.FetchGateWay,
      bindParams: {},
      column: [
        { label: '编号', dataIndex: 'id' },
        { label: '级别', dataIndex: 'class_level' },
        { label: '内容类别', dataIndex: 'class_name' },
        { label: '启用状态', dataIndex: 'class_status' },
        { label: '更新时间', dataIndex: 'updated_at' },
        { label: '说明', dataIndex: 'class_explain' }
      ],
      options: {
        checkRow: [],
        class_level: {
          1: '一级',
          2: '二级',
          3: '三级'
        }
      },
      expandKeys: [],
      ToEdit: (data) => {
        return {
          path: `/gateway-content-index/${data.id}`,
          query: { ...data }
        }
      }
    }
  },
  watch: {
    resData() {
      this.expandKeys = []
    }
  },
  methods: {
    expandChange(row, expanded, val) {
      this.expandKeys = expanded.length ? [row.id] : []
      if (this.expandKeys.length) {
        setTimeout(() => {
          this.$refs.record && this.$refs.record.init(row)
        }, 20)
      }
    },
    formartValue(data, index) {
      let val = data[index]
      if (index === 'class_level') {
        val = this.options.class_level[val] || ''
      } else if (index === 'class_status') {
        val = Number(val) === 1 ? '禁用' : '启用'
      }
      return val
    },
    handleEditStatus(data, type) {
      console.log(data, type)
      const center = type === 1 ? '禁用' : '启用'
      this.$confirm('确认修改状态为' + center, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // try {
        //   const params = {
        //     image_ids: this.selRow.map(i => i.image_id)
        //   }
        //   await this.Fetch.post('/fd/V4/zero.trust.connector.image.del', params)
        this.Message('ACTION_SUCCESS')
        //   await this.$refs.DmData.initPage()
        // } catch (error) {
        //   return
        // }
      })
    }
  }
}
</script>
