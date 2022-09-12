<style lang="scss" scoped>

</style>

<template>
  <div>
    <el-table v-loading="loading" :data="data">
      <el-table-column label="ID" prop="id" width="55"/>
      <el-table-column label="管理类型" prop="edit_type">
        <template slot-scope="scope">
          {{ EDIT_TYPE[scope.row.edit_type] }}
        </template>
      </el-table-column>
      <el-table-column label="变更前">
        <template slot-scope="scope">
          {{ scope.row.old_data }}
        <!-- <div v-if="getTextValue(scope.row.old_data).length">
          <div v-for="(item, index) in getTextValue(scope.row.old_data)" :key="index">
            {{item.label}} : {{item.value}}
          </div>
        </div>
        <div v-else>暂无</div> -->
        </template>
      </el-table-column>
      <el-table-column label="变更后">
        <template slot-scope="scope">
          {{ scope.row.new_data }}
        <!-- <div v-if="getTextValue(scope.row.new_data).length">
          <div v-for="(item, index) in getTextValue(scope.row.new_data)" :key="index">
            {{item.label}} : {{item.value}}
          </div>
        </div>
        <div v-else>暂无</div> -->
        </template>
      </el-table-column>
      <el-table-column label="时间" prop="created_at"/>
      <el-table-column label="原因" prop="remark"/>
    </el-table>
    <Pagination
      :total="pagination.total"
      :page="pagination.page"
      :limit="pagination.per_page"
      @pagination="handlePagination"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      data: [],
      member_id: '',
      EDIT_TYPE: {
        'member_status': '客户阶段',
        'customer_type': '客户层级',
        'customer_level': '服务等级',
        'customer_sale': '销售',
        'customer_industry_type': '行业类型',
        'base': '基本信息'
      },
      pagination: {
        page_sizes: [10, 20, 30, 50],
        page: 1,
        per_page: 10,
        total: 0
      }
    }
  },
  methods: {
    init() {
      const params = {
        member_id: this.member_id,
        page: this.pagination.page,
        per_page: this.pagination.per_page
      }
      this.loading = true
      this.InvokeAllApi.get('/fd/V4/customer.manage.editinfolist', params).then(res => {
        this.pagination.total = Number(res.count) || 0
        this.data = res.list
      })
      setTimeout(() => { this.loading = false }, 1000)
    },
    handleLoad(id) {
      this.pagination.page = 1
      this.pagination.per_page = 10
      this.member_id = id
      this.init()
    },
    handlePagination(params) {
      this.pagination.page = params.page
      this.pagination.per_page = params.pre_page
      this.init()
    },
    getTextValue(data) {
      const Arr = []
      if (data && Object.keys(data).length) {
        Object.keys(data).forEach(i => {
          Arr.push({
            label: i, value: data[i]
          })
        })
      }
      return Arr
    }
  }
}
</script>
