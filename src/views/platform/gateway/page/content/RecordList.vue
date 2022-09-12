<template>
  <el-table
    :data="list"
    :show-header="false"
  >
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
        <!-- <el-button
          v-show="Number(row.class_status) === 2"
          type="text"
        >禁用</el-button>
        <el-button
          v-show="Number(row.class_status)=== 1"
          type="text"
        >启用</el-button>
        <el-divider direction="vertical" /> -->
        <router-link :to="ToEdit(row)">
          <el-button type="text">修 改</el-button>
        </router-link>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  name: 'RecordList',
  data() {
    return {
      Api: '/content/list',
      list: [],
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
      ToEdit: (data) => {
        return {
          path: `/gateway-content-index/${data.id}`,
          query: { ...data }
        }
      }
    }
  },
  methods: {
    init(val) {
      this.$nextTick(() => {
        this.FetchGateWay.get(this.Api, { class_flag: val.class_flag }).then(res => {
          console.log(res)
          this.list = res.list
        })
      })
    },
    formartValue(data, index) {
      let val = data[index]
      if (index === 'class_level') val = this.options.class_level[val] || ''
      else if (index === 'class_status') val = Number(val) === 1 ? '禁用' : '启用'
      return val
    }
  }
}
</script>
